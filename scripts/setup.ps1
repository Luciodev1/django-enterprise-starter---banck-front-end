Write-Host "=== django-enterprise-starter Setup ===" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created. Edit it with your settings." -ForegroundColor Yellow
}

Write-Host "Starting Docker containers..." -ForegroundColor Green
docker compose up -d

Write-Host "Running migrations..." -ForegroundColor Green
docker compose exec backend python manage.py migrate

Write-Host "Creating superuser..." -ForegroundColor Green
docker compose exec backend python manage.py createsuperuser

Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000"
Write-Host "Admin: http://localhost:8000/admin/"
Write-Host "API: http://localhost:8000/api/v1/"
