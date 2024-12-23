import re
import fitz
import torch
import aiohttp
import asyncio
from lxml import etree
from io import BytesIO
from itertools import chain
from datetime import datetime
from aiohttp import ClientTimeout
from sqlalchemy import create_engine
from sqlalchemy import text
from transformers import AutoTokenizer, AutoModelForSequenceClassification


class DatabaseHelper:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.engine = create_engine(self.connection_string)

    def get_issuers(self):
        query = "SELECT issuer_name FROM issuers"
        with self.engine.connect() as conn:
            result = conn.execute(text(query)).fetchall()
        return [r[0] for r in result]

    def get_latest_date(self, issuer):
        query = "SELECT MAX(scraped_date) FROM news_sentiment WHERE issuer_name = :issuer"
        with self.engine.connect() as conn:
            result = conn.execute(text(query), {'issuer': issuer}).fetchone()
        return result[0] if result else None

    def save_data(self, data):
        query = """
            INSERT INTO news_sentiment (issuer_name, recommendation, scraped_date)
            VALUES (:issuer_name, :recommendation, :scraped_date)
        """

        with self.engine.connect() as conn:
            conn.execute(text(query), data)
            conn.commit()

    def update_current_recommendations(self):
        query = """
            WITH RecommendationCounts AS (
                SELECT 
                    issuer_name, 
                    recommendation, 
                    COUNT(*) AS count,
                    RANK() OVER (PARTITION BY issuer_name ORDER BY COUNT(*) DESC) AS rank
                FROM news_sentiment
                WHERE scraped_date >= CURRENT_DATE - INTERVAL '60 days'
                GROUP BY issuer_name, recommendation
            )
            UPDATE issuers
            SET current_recommendation = rc.recommendation
            FROM RecommendationCounts rc
            WHERE issuers.issuer_name = rc.issuer_name AND rc.rank = 1;
        """
        with self.engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()


class Parser:

    def clean_text(self, text):
        text = ' '.join(text.split())
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s]', '', text)
        text = text.replace('nbsp', '')
        return text.lower()

    def parse_file(self, byte_code):
        file = fitz.open(stream=byte_code)
        text = ""
        for page_num in range(min(2, file.page_count)):
            page = file.load_page(page_num)
            text += page.get_text("text")
        text = self.clean_text(text)
        return text

    def parse_html(self, content):
        if "automatically generated" in content or "original document" in content or "link" in content:
            return None
        text = re.sub(r'<[^>]+>', '', content).strip()
        text = self.clean_text(text)
        return text


class Scraper:

    def __init__(self, session, parser):
        self.session = session
        self.link_url = "https://www.mse.mk/en/symbol/{issuer}"
        self.text_url = "https://api.seinet.com.mk/public/documents/single/{news_id}"
        self.attachment_url = "https://api.seinet.com.mk/public/documents/attachment/{attachment_id}"
        self.parser = parser

    def extract_date(self, link_text):
        date_pattern = r'(\d{1,2}/\d{1,2}/\d{4})'
        match = re.search(date_pattern, link_text)
        if match:
            date_string = match.group(1)
            date = datetime.strptime(date_string, '%m/%d/%Y')
            return date.date()

    def extract_news_id(self, url):
        return url.split('/')[-1]

    async def get_issuer_news_links(self, issuer):
        url = self.link_url.format(issuer=issuer)
        async with self.session.get(url) as response:
            response.raise_for_status()
            data = await response.text()
            tree = etree.HTML(data)
            links = tree.xpath('//*[@id="seiNetIssuerLatestNews"]//a')
            links = [
                (self.extract_news_id(link.xpath('./@href')[0]),
                 self.extract_date(link.xpath('./ul/li[2]/h4/text()')[0]))
                for link in links
                if link.xpath('./@href')
            ]
            return links

    async def fetch_news(self, news_id):
        news_url = self.text_url.format(news_id=news_id)
        async with self.session.get(news_url) as response:
            if response.status == 200:
                data = await response.json()
                content = data.get("data", {}).get("attachments", None)
                if content:
                    attachment_id = content[0].get("attachmentId", None)
                    attachment_type = content[0].get("attachmentType", {}).get("mimeType", "")
                    if attachment_type == "application/pdf" and attachment_id is not None:
                        return await self.fetch_attachment(attachment_id) if attachment_id else None
                content = data.get("data", {}).get("content", None)
                if data:
                    return self.parser.parse_html(content)
        return None

    async def fetch_attachment(self, attachment_id):
        url = self.attachment_url.format(attachment_id=attachment_id)
        async with self.session.get(url) as response:
            if response.status == 200:
                content = BytesIO(await response.read())
                return self.parser.parse_file(content)
        return None


class SentimentAnalyzer:

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
        self.model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

    def get_action(self, label):
        actions = {"positive": "buy", "negative": "sell", "neutral": "hold"}
        return actions[label]

    def get_label(self, prediction):
        labels = self.model.config.id2label
        return labels[prediction.item()]

    def analyze_article(self, text):
        inputs = self.tokenizer(text, max_length=512, truncation=True, padding='max_length', return_tensors='pt')
        outputs = self.model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits, axis=-1)
        label = self.get_label(prediction)
        return self.get_action(label)


class Pipeline:

    def __init__(self, db_connection_string):
        self.db = DatabaseHelper(db_connection_string)
        self.parser = Parser()
        self.sentiment_analyzer = SentimentAnalyzer()

    async def process_issuer(self, issuer, scraper):
        latest_date = self.db.get_latest_date(issuer)
        news_links = await scraper.get_issuer_news_links(issuer)

        if len(news_links) == 0:
            return [{"issuer_name": issuer,
                     "recommendation": "no_data",
                     "scraped_date": datetime.utcnow().strftime('%Y-%m-%d')}
                    ]

        filtered_links = [
            (news_id, date) for news_id, date in news_links
            if date > (latest_date or datetime.strptime('2014-01-01', '%Y-%m-%d').date())
        ]

        tasks = [
            self.process_article(issuer, news_id, date, scraper) for news_id, date in filtered_links
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        final_results = [
            result for result in results if result is not None and not isinstance(result, Exception) and result != []
        ]

        if len(final_results) == 0:
            return [{"issuer_name": issuer,
                     "recommendation": "no_data",
                     "scraped_date": datetime.utcnow().strftime('%Y-%m-%d')}
                    ]

        return final_results

    async def process_article(self, issuer, news_id, date, scraper):
        content = await scraper.fetch_news(news_id)
        if content:
            recommendation = self.sentiment_analyzer.analyze_article(content)
            return {"issuer_name": issuer,
                    "recommendation": recommendation,
                    "scraped_date": datetime.utcnow().strftime('%Y-%m-%d')
                    }

    async def process_issuer_with_retry_with_semaphore(self, issuer, scraper, semaphore, retries=3, timeout=60):
        attempt = 0
        while attempt < retries:
            try:
                async with semaphore:
                    results = await asyncio.wait_for(self.process_issuer(issuer, scraper), timeout)
                return results
            except asyncio.TimeoutError:
                attempt += 1
                print(f"Timeout exceeded while processing {issuer}. Attempt {attempt}/{retries}")
                if attempt == retries:
                    print(f"Max retries reached for {issuer}. Skipping this issuer.")
                    break
                await asyncio.sleep(2 ** attempt)
            except asyncio.CancelledError:
                print(f"Task for {issuer} was cancelled.")
                break
            except Exception as e:
                print(f"An unexpected error occurred with {issuer}: {e}")
                break

    async def run(self):
        issuers = self.db.get_issuers()
        semaphore = asyncio.Semaphore(20)
        async with aiohttp.ClientSession(timeout=ClientTimeout(total=120)) as session:
            scraper = Scraper(session, self.parser)
            tasks = [
                self.process_issuer_with_retry_with_semaphore(issuer, scraper, semaphore)
                for issuer in issuers
            ]
            results = await asyncio.gather(*tasks)
            results = list(chain.from_iterable(results))
            self.db.save_data(results)
            self.db.update_current_recommendations()


class SentimentAnalysis:

    def __init__(self, db_connection_string):
        self.db_connection_string = db_connection_string
        self.pipeline = Pipeline(self.db_connection_string)

    def run(self):
        try:
            asyncio.run(self.pipeline.run())
        except Exception as e:
            print(f"An exception occurred during sentiment analysis: {e}")

