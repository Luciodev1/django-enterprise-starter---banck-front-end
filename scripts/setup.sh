#!/bin/bash
set -e

echo "=== django-enterprise-starter Setup ==="

if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created. Edit it with your settings."
fi

echo "Starting Docker containers..."
docker compose up -d

echo "Running migrations..."
docker compose exec backend python manage.py migrate

echo "Creating superuser..."
docker compose exec backend python manage.py createsuperuser

echo "Setup complete!"
echo "Frontend: http://localhost:3000"
echo "Admin: http://localhost:8000/admin/"
echo "API: http://localhost:8000/api/v1/"
