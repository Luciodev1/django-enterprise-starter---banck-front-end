FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/base.txt requirements/
RUN pip install --no-cache-dir -r requirements/base.txt

COPY . .

EXPOSE 8000

FROM base AS development
ENV DJANGO_SETTINGS_MODULE=config.settings.development
COPY requirements/development.txt requirements/
RUN pip install --no-cache-dir -r requirements/development.txt
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production
ENV DJANGO_SETTINGS_MODULE=config.settings.production
RUN pip install --no-cache-dir -r requirements/production.txt
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
