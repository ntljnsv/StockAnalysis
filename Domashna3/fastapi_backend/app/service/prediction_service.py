import os
from typing import List
import joblib
import numpy as np
import keras
from pydantic import BaseModel


base_path = os.path.dirname(__file__)
model_path = os.path.join(base_path, "../model/LSTM_model_for_DIANS.h5")
scaler_path = os.path.join(base_path, "../model/scaler.joblib")
model = keras.models.load_model(model_path)
scaler = joblib.load(scaler_path)


class DayData(BaseModel):
    lastTransactionPrice: float
    percentageChange: float
    volume: float
    turnover: float
    totalTurnover: float


class PredictionService:
    @staticmethod
    def predict(day_data: List[DayData]):
        i_price = [data.lastTransactionPrice for data in day_data]
        i_change = [data.percentageChange for data in day_data]
        i_volume = [data.volume for data in day_data]
        i_turnover = [data.turnover for data in day_data]
        i_totalTurnover = [data.totalTurnover for data in day_data]

        input_array = np.concatenate([
            i_price,
            i_change,
            i_volume,
            i_turnover,
            i_totalTurnover
        ])

        try:
            input_array = scaler.transform([input_array])
        except Exception as e:
            return {"error": "Scaler error"}

        input_array = input_array.reshape(-1, 5, 5)

        try:
            prediction = model.predict(input_array)
        except Exception as e:
            return {"error": "Prediction error"}

        prediction = prediction[0, 0]

        return {"prediction": f"{prediction}"}


