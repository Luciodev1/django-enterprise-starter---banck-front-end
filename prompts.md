Você é um Principal Software Architect, Staff Django Engineer, Frontend Architect, DevSecOps Engineer, SRE Engineer e AI Software Factory Agent.

Sua missão é criar automaticamente um framework enterprise chamado:

django-enterprise-starter

Este framework será utilizado como base para:

- ERP
- CRM
- SaaS
- Marketplace
- Fintech
- E-commerce
- Sistemas internos
- APIs corporativas
- Plataformas Multi-Tenant

==================================================================
OBJETIVO
==================================================================

Criar uma plataforma production-ready, escalável, segura e reutilizável.

A stack obrigatória é:

BACKEND

- Python 3.13+
- Django 5+
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Celery Beat
- JWT Authentication
- Django Admin
- Django Unfold

FRONTEND

- Next.js 15+
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- Zod
- TanStack Query
- Axios
- Lucide Icons
- Recharts

DEVOPS

- Docker
- Docker Compose
- Nginx
- GitHub Actions

OBSERVABILIDADE

- Sentry
- Prometheus
- Grafana

==================================================================
ARQUITETURA
==================================================================

Utilizar:

- Monólito Modular
- Django Apps
- Service Layer
- API First
- Django Admin First
- Cloud Ready

NÃO utilizar:

- Microserviços
- CQRS
- Event Sourcing
- Repository Pattern desnecessário
- DDD excessivamente complexo

==================================================================
ESTRUTURA DO PROJETO
==================================================================

django-enterprise-starter/

backend/
frontend/
infra/
docs/
scripts/
.github/

.env.example
.gitignore
README.md
docker-compose.yml

==================================================================
BACKEND
==================================================================

backend/

manage.py

config/

settings/

base.py
development.py
staging.py
production.py

urls.py
wsgi.py
asgi.py
celery.py

apps/

core/
accounts/
audit/
notifications/

tests/

requirements/

==================================================================
APP CORE
==================================================================

Criar:

core/

admin.py
models.py
permissions.py
validators.py
constants.py
choices.py
mixins.py
exceptions.py
utils.py

Criar BaseModel.

Todos os modelos devem herdar de BaseModel.

Campos:

- UUID
- created_at
- updated_at
- created_by
- updated_by
- is_active

Preparar Soft Delete.

==================================================================
APP ACCOUNTS
==================================================================

Criar sistema completo.

Estrutura:

accounts/

admin.py
models.py
views.py
urls.py
forms.py
services.py
permissions.py
validators.py
signals.py
tasks.py

api/
tests/

==================================================================
CUSTOM USER
==================================================================

Campos:

- UUID
- email
- phone
- first_name
- last_name
- avatar
- is_verified
- is_mfa_enabled
- last_login

Login por email.

Nunca usar username.

==================================================================
AUTENTICAÇÃO
==================================================================

Implementar:

- JWT
- Refresh Token
- Login
- Logout
- Password Reset
- Email Verification

Preparar MFA.

==================================================================
AUTORIZAÇÃO
==================================================================

Implementar:

- Django Groups
- Django Permissions

Roles padrão:

- SuperAdmin
- Admin
- Manager
- Operator
- Client

==================================================================
APP AUDIT
==================================================================

Criar sistema de auditoria.

Registrar:

- Login
- Logout
- Create
- Update
- Delete
- Permission Changes

==================================================================
APP NOTIFICATIONS
==================================================================

Preparar:

- Email
- SMS
- WhatsApp
- Push

Utilizar Celery.

==================================================================
API
==================================================================

Criar:

api/v1/

Implementar:

- Paginação
- Filtros
- Ordenação
- Busca

Resposta padrão:

{
  "success": true,
  "message": "",
  "data": {}
}

Erro:

{
  "success": false,
  "message": "",
  "errors": {}
}

==================================================================
DJANGO ADMIN
==================================================================

Instalar:

django-unfold

Criar:

- Dashboard moderno
- Menus organizados
- Pesquisa
- Filtros
- Autocomplete

Todos os modelos devem possuir Admin profissional.

==================================================================
FRONTEND
==================================================================

Criar:

frontend/

src/

app/
components/
features/
services/
hooks/
types/
lib/
utils/
styles/

public/

==================================================================
DESIGN SYSTEM
==================================================================

Criar:

components/ui/

Button
Input
Textarea
Modal
Drawer
Card
Badge
Alert
Table
Select
DatePicker

Todos os sistemas futuros devem reutilizar estes componentes.

==================================================================
LAYOUT BASE
==================================================================

Criar:

- Sidebar
- Topbar
- Footer
- Dashboard Layout
- Auth Layout

==================================================================
PÁGINAS BASE
==================================================================

Criar:

- Login
- Recuperar Senha
- Dashboard
- Perfil
- Configurações

==================================================================
TAILWIND CSS
==================================================================

Configurar:

- Cores corporativas
- Espaçamentos
- Tipografia
- Sombras
- Bordas
- Dark Mode

Criar theme.ts.

==================================================================
TANSTACK QUERY
==================================================================

Configurar:

- Query Client
- Cache Global
- Retry
- Error Handling

==================================================================
FORMULÁRIOS
==================================================================

Configurar:

- React Hook Form
- Zod

Criar exemplos.

==================================================================
SEGURANÇA
==================================================================

Instalar:

- argon2-cffi
- django-axes
- django-csp
- django-environ

Implementar:

- CSP
- HSTS
- Secure Cookies
- CSRF
- Rate Limit
- XSS Protection

Seguir OWASP Top 10.

==================================================================
POSTGRESQL
==================================================================

Utilizar:

- UUID
- Índices
- Constraints
- Timestamps

Criar migrações iniciais.

==================================================================
REDIS
==================================================================

Utilizar para:

- Cache
- Sessões
- Rate Limit
- Celery Broker

==================================================================
CELERY
==================================================================

Configurar:

- Celery
- Celery Beat

Criar tarefas exemplo.

==================================================================
DOCKER
==================================================================

Criar:

Containers:

- backend
- frontend
- postgres
- redis
- celery
- celery-beat
- nginx

Criar Dockerfiles.

==================================================================
NGINX
==================================================================

Criar configuração production-ready.

==================================================================
TESTES
==================================================================

Backend:

- pytest
- pytest-django
- factory-boy
- faker

Frontend:

- Vitest
- Testing Library

Estrutura:

tests/

unit/
integration/
e2e/

Meta:

80%+ cobertura.

==================================================================
OBSERVABILIDADE
==================================================================

Preparar integração:

- Sentry
- Prometheus
- Grafana

==================================================================
LOGGING
==================================================================

Criar:

logs/

application.log
security.log
audit.log

==================================================================
CI/CD
==================================================================

Criar GitHub Actions.

Pipeline:

1. Ruff
2. Black Check
3. MyPy
4. Testes
5. Security Scan
6. Build Docker
7. Deploy

==================================================================
DOCUMENTAÇÃO
==================================================================

Gerar automaticamente:

docs/

architecture.md
backend.md
frontend.md
security.md
deployment.md
development.md
api.md

==================================================================
QUALITY GATES
==================================================================

Nenhum código deve ser aceito sem:

- Lint OK
- Testes OK
- Segurança OK
- Docker Build OK

==================================================================
ENTREGA FINAL
==================================================================

Gerar:

1. Estrutura completa de diretórios.
2. Todos os arquivos necessários.
3. Configurações iniciais.
4. Docker funcional.
5. Backend funcional.
6. Frontend funcional.
7. Admin funcional.
8. PostgreSQL funcional.
9. Redis funcional.
10. Celery funcional.
11. GitHub Actions.
12. Documentação completa.
13. Guia de instalação.
14. Guia de deploy.

Não pedir confirmação.
Executar até concluir completamente.