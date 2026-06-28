FROM python:3.12-slim

WORKDIR /app

# libpq-dev and gcc are required to compile the psycopg2 PostgreSQL driver
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

# Bake Django admin static files into the image
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "carmarket.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
