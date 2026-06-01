# Deploy

## Produção (Docker)

```bash
cp .env.example .env
# Edite .env com suas configs de produção
docker compose -f docker-compose.prod.yml up -d
```

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| DJANGO_SECRET_KEY | Chave secreta Django | - |
| POSTGRES_DB | Nome do banco | django_enterprise |
| POSTGRES_USER | Usuário do banco | django_user |
| POSTGRES_PASSWORD | Senha do banco | django_password |
| REDIS_URL | URL do Redis | redis://localhost:6379/0 |
| CELERY_BROKER_URL | Broker Celery | redis://localhost:6379/1 |
| SENTRY_DSN | DSN do Sentry | - |
| EMAIL_HOST | SMTP host | smtp.sendgrid.net |

## Migrações

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

## Backup

```bash
docker compose exec postgres pg_dump -U django_user django_enterprise > backup.sql
```
