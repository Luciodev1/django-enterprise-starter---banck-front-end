# Arquitetura

## Visão Geral

Monólito modular com Django Apps, Service Layer e API First.

## Estrutura

```
django-enterprise-starter/
├── backend/          # Django REST API
│   ├── config/       # Configurações (base, dev, staging, prod)
│   ├── apps/         # Django Apps modulares
│   │   ├── core/     # BaseModel, utils, pagination, renderers
│   │   ├── accounts/ # Auth, Users, JWT, Roles
│   │   ├── audit/    # Logging de auditoria
│   │   └── notifications/ # Notificações (email, SMS, push)
│   └── tests/        # Testes unitários, integração, e2e
├── frontend/         # Next.js 15 + TypeScript
│   └── src/
│       ├── app/      # Pages (App Router)
│       ├── components/ui/  # Design System
│       ├── features/       # Feature modules
│       └── services/       # API client
├── infra/            # Docker, Nginx, Prometheus, Grafana
└── .github/          # CI/CD pipelines
```

## Decisões

- **Monólito Modular**: Simplicidade sem acoplamento
- **API First**: REST como contrato principal
- **Django Admin First**: Interfaces administrativas completas
- **UUID**: Chaves primárias universais
- **Soft Delete**: is_active vs hard_delete
