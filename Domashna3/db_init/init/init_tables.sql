CREATE TABLE IF NOT EXISTS issuers (
    issuer_name varchar(50) primary key,
		current_recommendation varchar(10) default 'hold'
);


CREATE TABLE IF NOT EXISTS news_sentiment (
    id serial primary key,
    issuer_name varchar(50),
    recommendation varchar(10), -- 'buy', 'sell', 'hold'
    scraped_date date,
		
    CONSTRAINT fk_issuer_news FOREIGN KEY (issuer_name) REFERENCES issuers (issuer_name)
);


CREATE TABLE IF NOT EXISTS day_data (
    id serial primary key,
    issuer_name varchar(50),
    "date" date,
    last_transaction_price float,
    max_price float,
    min_price float,
    avg_price float,
    percent_change float,
    volume float,
    turnover float,
    total_turnover float,
    
    CONSTRAINT fk_issuer FOREIGN KEY (issuer_name) REFERENCES Issuers(issuer_name)
);


-- Day Data Table Indexes
CREATE INDEX IF NOT EXISTS idx_day_data_issuer_name ON day_data (issuer_name);
CREATE INDEX IF NOT EXISTS idx_day_data_date ON day_data ("date");
CREATE INDEX IF NOT EXISTS idx_day_data_issuer_date ON day_data (issuer_name, "date");

-- News Sentiment Table Indexes
CREATE INDEX IF NOT EXISTS idx_news_sentiment_issuer_name ON news_sentiment (issuer_name);
CREATE INDEX IF NOT EXISTS idx_news_sentiment_date ON news_sentiment (scraped_date);
CREATE INDEX IF NOT EXISTS idx_news_sentiment_issuer_date ON news_sentiment (issuer_name, scraped_date);
