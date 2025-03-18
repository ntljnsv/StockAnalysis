import logging
import os
from typing import List

from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI

from app.service.prediction_service import PredictionService, DayData
from app.utils.issuers_data_collection import IssuerCollector
from app.utils.sentiment_analysis import SentimentAnalysis

app = FastAPI()

scheduler = AsyncIOScheduler()

db_connection_string = os.environ.get("DB_CONNECTION_STRING", "postgresql+psycopg2://sa:p123@localhost:5432/Makcii_DB")
sentiment_analysis = SentimentAnalysis(db_connection_string=db_connection_string)
issuer_collector = IssuerCollector(db_connection_string=db_connection_string)


def schedule_sentiment_analysis():
    sentiment_analysis.run()


def schedule_issuer_collecting():
    issuer_collector.run()


scheduler.add_job(schedule_issuer_collecting, 'cron', hour=10, minute=0)
scheduler.add_job(schedule_sentiment_analysis, 'cron', hour=10, minute=15)


def job_listener(event):
    if event.exception:
        logging.error(f"Job {event.job_id} failed.")
    else:
        logging.info(f"Job {event.job_id} completed successfully.")


scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)


@app.on_event("startup")
async def startup():
    scheduler.start()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.post("/predict")
def predict(day_data: List[DayData]):
    prediction = PredictionService.predict(day_data)
    return prediction
