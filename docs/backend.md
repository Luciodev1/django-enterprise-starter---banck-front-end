# Backend

## Apps

### Core
- `BaseModel` abstrato com UUID, timestamps, created_by, soft delete
- Paginação, renderers, exceptions padronizados
- Permissions hierárquicas (SuperAdmin > Admin > Manager > Operator)
- Middleware de logging e auditoria

### Accounts
- Custom User model com login por email
- JWT (access + refresh tokens)
- Roles: SuperAdmin, Admin, Manager, Operator, Client
- Registro, login, logout, change password
- MFA preparado

### Audit
- Logging de ações (create, update, delete, login, logout)
- Integração com signals do Django

### Notifications
- Email, SMS, WhatsApp, Push (preparado)
- Celery tasks para processamento assíncrono

## Settings

Ambientes: development, staging, production
- development: debug, sqlite/console email
- staging: debug off, SSL
- production: Sentry, SSL/HSTS, SMTP
