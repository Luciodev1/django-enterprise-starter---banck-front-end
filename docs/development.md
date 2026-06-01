# Desenvolvimento

## Requisitos

- Python 3.13+
- Node.js 20+
- Docker (opcional)

## Setup Manual

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements/development.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up -d
docker compose exec backend python manage.py createsuperuser
```

## Testes

```bash
cd backend
pytest --cov=. --cov-report=html

cd frontend
npm test
```

## Commits

Seguir Conventional Commits: feat, fix, chore, docs, refactor, test, security
