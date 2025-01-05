FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir torch==2.4.1+cpu --extra-index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
