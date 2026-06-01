# django-enterprise-starter

Framework enterprise production-ready baseado em Django + Next.js.

## Stack

- **Backend**: Python 3.13, Django 5, DRF, PostgreSQL, Redis, Celery
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, TanStack Query
- **Infra**: Docker, Nginx, GitHub Actions, Sentry, Prometheus, Grafana

## Quick Start

```bash
cp .env.example .env
docker compose up -d
docker compose exec backend python manage.py createsuperuser
```

Acessos:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- Admin: http://localhost:8000/admin/

## Desenvolvimento

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements/development.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
