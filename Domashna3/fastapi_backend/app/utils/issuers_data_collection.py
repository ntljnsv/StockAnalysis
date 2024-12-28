import asyncio
import random
import re
from concurrent.futures import ThreadPoolExecutor
import aiohttp
import pandas as pd
import psycopg2
from lxml import etree
from sqlalchemy import create_engine
from sqlalchemy import text


class DatabaseHelper:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.engine = create_engine(self.connection_string)

    def connect(self):
        return psycopg2.connect(self.connection_string)

    def get_latest_date(self, issuer):
        query = """
        SELECT MAX("date")
        FROM public.day_data
        WHERE issuer_name = :issuer
    """
        with self.engine.connect() as conn:
            result = conn.execute(text(query), {'issuer': issuer}).fetchone()
            return result[0] if result else None

    def save_data(self, data):
        data.to_sql('day_data', self.engine, if_exists='append', index=False)

    def save_issuers(self, issuers):
        query = """
        INSERT INTO public.issuers (issuer_name)
        VALUES (:issuer_name)
        ON CONFLICT (issuer_name) DO NOTHING
    """
        with self.engine.connect() as conn:
            conn.execute(
                text(query),
                [{'issuer_name': issuer} for issuer in issuers]
            )
            conn.commit()


class Pipeline(object):
    def __init__(self):
        self.filters = []

    def connect(self, filter):
        self.filters.append(filter)
        return self

    async def combine_data(self, session, url, data):
        await self.filters[-1].process(session, url, data)

    async def process_data(self, session, url, data):
        for filter in self.filters[1:-1]:
            data = await filter.process(session, url, data)
        return data

    async def execute(self, url, issuer_urls):
        final_data = []
        async with aiohttp.ClientSession() as session:
            start_data = await self.filters[0].process(session, issuer_urls, [])
            processing_tasks = [self.process_data(session, url, data) for data in start_data]
            results = await asyncio.gather(*processing_tasks)

            await self.combine_data(session, url, results)


class Filter(object):
    async def process(self, session, url, data):
        raise NotImplementedError()


class ValidIssuersFilter(Filter):
    def __init__(self, db_helper):
        self.db_helper = db_helper

    async def get_issuers(self, session, urls):
        issuers = []

        async def fetch_issuers(url):
            async with session.get(url) as response:
                response.raise_for_status()
                data = await response.text()
                tree = etree.HTML(data)
                options = tree.xpath("//tbody//tr//td//a")
                return [option.text.strip() for option in options if option.text.strip()]

        results = await asyncio.gather(*[fetch_issuers(url) for url in urls])

        for result in results:
            issuers.extend(result)
        return issuers

    async def process(self, session, url, data):
        issuers = await self.get_issuers(session, url)
        pattern = re.compile(r"^[^\d]*$")
        valid_issuers = list(set([issuer for issuer in issuers if pattern.search(issuer)]))
        self.db_helper.save_issuers(valid_issuers)

        return valid_issuers


class IssuerDatesFilter(Filter):
    def __init__(self, db_helper):
        self.db_helper = db_helper

    def generate_date_pairs(self, latest_date):
        now = pd.Timestamp.today().normalize()
        pairs = []

        latest_date = pd.to_datetime(latest_date).normalize()
        start_date = latest_date + pd.Timedelta(days=1)
        while start_date <= now.normalize():
            end_date = min(start_date + pd.Timedelta(days=364), now)
            pairs.append((start_date, end_date))
            start_date = end_date + pd.Timedelta(days=1)
        return pairs

    async def process(self, session, url, data):
        issuer_date_pairs = {}
        latest_date = self.db_helper.get_latest_date(data)
        if not latest_date:
            latest_date = (pd.Timestamp.now() - pd.DateOffset(years=10)).normalize()

        date_pairs = self.generate_date_pairs(latest_date)
        issuer_date_pairs[data] = date_pairs
        return issuer_date_pairs


class FillInIssuerDataFilter(Filter):

    def __init__(self):
        self.semaphore = asyncio.Semaphore(30)

    def parse_row(self, row, issuer):
        data = [ele.strip() for ele in row]
        if data:
            data.insert(0, issuer)
        return data

    def parse_table(self, html_content, issuer):
        tree = etree.HTML(html_content)
        rows = tree.xpath("//tbody//tr")
        return [
            self.parse_row([ele.text.strip() if ele.text else '' for ele in row.xpath(".//td")], issuer)
            for row in rows
        ]

    async def fetch_data(self, session, url, data):
        timeout = aiohttp.ClientTimeout(total=20)
        retries = 8

        for attempt in range(retries):
            try:
                async with session.post(url, data=data, timeout=timeout) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        return None
            except asyncio.TimeoutError:
                pass
            except aiohttp.ClientError as e:
                pass
            await asyncio.sleep(2 ** attempt + random.uniform(0, 1))
        return None

    async def download_data(self, session, issuer, from_date, to_date):
        url = 'https://www.mse.mk/en/stats/symbolhistory/' + issuer
        payload = {
            'Code': issuer,
            'FromDate': from_date,
            'ToDate': to_date
        }
        async with self.semaphore:
            response = await self.fetch_data(session, url, payload)
            if response is None:
                return None

        return response

    async def download_latest_issuer_data(self, session, url, issuer, date_pairs):
        tasks = [self.download_data(session, issuer, from_date, to_date) for from_date, to_date in date_pairs]

        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_results = [result for result in results if result is not None]

        collected_rows = []
        loop = asyncio.get_event_loop()

        with ThreadPoolExecutor() as executor:
            parsing_tasks = [
                loop.run_in_executor(executor, self.parse_table, result, issuer)
                for result in valid_results if result
            ]
            parsed_tables = await asyncio.gather(*parsing_tasks)

        for data in parsed_tables:
            if data:
                collected_rows.extend(data)

        return collected_rows

    async def process(self, session, url, data):
        issuer = list(data.keys())[0]
        res = await self.download_latest_issuer_data(session, url, issuer, data[issuer])
        return res


class CombineAndSaveFilter(Filter):
    def __init__(self, db_helper):
        self.db_helper = db_helper

    async def format_data(self, data):
        data['date'] = pd.to_datetime(data['date'], format='%m/%d/%Y')

        def transform_column(col):
            return (
                col.astype(str)
                .str.replace(',', '', regex=False)
                .apply(pd.to_numeric, errors='coerce')
            )

        numeric_cols = data.columns.difference(['issuer_name', 'date'])
        data[numeric_cols] = data[numeric_cols].apply(transform_column)
        data[numeric_cols] = data[numeric_cols].astype(float)

        return data

    async def process(self, session, url, data):
        if not data:
            return

        col_names = ["issuer_name", "date", "last_transaction_price", "max_price", "min_price", "avg_price",
                     "percent_change", "volume", "turnover", "total_turnover"]

        data = [d for d in data if d is not None]
        data = [sublist for group in data for sublist in group]

        new_data = pd.DataFrame(data, columns=col_names)

        new_data = await self.format_data(new_data)
        new_data = new_data.dropna(axis=0, how="any")

        self.db_helper.save_data(new_data)


class IssuerCollector:

    def __init__(self, db_connection_string):
        self.url = "https://www.mse.mk/en/stats/symbolhistory/ADIN"
        self.issuer_urls = ["https://www.mse.mk/en/stats/current-schedule#results-continuousTradingMode",
                            "https://www.mse.mk/en/stats/current-schedule#results-fixingWith20PercentLimit",
                            "https://www.mse.mk/en/stats/current-schedule#results-fixingWithoutLimit"]

        self.db_connection_string = db_connection_string
        self.db_helper = DatabaseHelper(db_connection_string)
        self.pipeline = Pipeline()
        self.pipeline.connect(ValidIssuersFilter(self.db_helper)) \
            .connect(IssuerDatesFilter(self.db_helper)) \
            .connect(FillInIssuerDataFilter()) \
            .connect(CombineAndSaveFilter(self.db_helper))

    def run(self):
        try:
            asyncio.run(self.pipeline.execute(self.url, self.issuer_urls))
        except Exception as e:
            print(f"An exception occurred while collecting issuer data: {e}")
