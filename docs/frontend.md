# Frontend

## Estrutura

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Reset Password
│   └── (dashboard)/        # Dashboard, Profile, Settings
├── components/
│   ├── ui/                 # Design System (Button, Input, Card, etc)
│   └── layout/             # Sidebar, Topbar, Layouts
├── features/               # Feature modules
│   └── auth/               # AuthContext, hooks
├── services/               # API client (Axios + interceptors)
├── hooks/                  # Custom hooks
├── types/                  # TypeScript types
├── lib/                    # Utils, theme config
└── styles/                 # Global CSS
```

## Design System

Componentes reutilizáveis: Button, Input, Card, Badge, Alert, Modal, Table, Select

## Autenticação

- JWT tokens armazenados em localStorage
- Axios interceptor com refresh automático
- AuthContext com user, login, logout
- Rotas protegidas via layout group

## Data Fetching

- TanStack Query para cache e gerenciamento
- Axios com interceptors para refresh token
