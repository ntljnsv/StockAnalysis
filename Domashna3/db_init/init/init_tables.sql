CREATE TABLE IF NOT EXISTS issuers (
    issuer_name varchar(50) primary key
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


DROP INDEX IF EXISTS idx_day_data_issuer_name;
DROP INDEX IF EXISTS idx_day_data_date;
DROP INDEX IF EXISTS idx_day_data_issuer_date;

CREATE INDEX idx_day_data_issuer_name ON day_data (issuer_name);
CREATE INDEX idx_day_data_date ON day_data ("date");
CREATE INDEX idx_day_data_issuer_date ON day_data (issuer_name, "date");