# API Reference

Base URL: `/api/v1`

## Autenticação

### Login

```
POST /api/v1/accounts/login/
```

```json
{ "email": "user@example.com", "password": "Senha@123" }
```

Response:
```json
{
  "success": true,
  "data": {
    "access": "eyJ...",
    "refresh": "eyJ...",
    "user": { "id": "uuid", "email": "...", "first_name": "...", "role": "admin" }
  }
}
```

### Refresh Token

```
POST /api/v1/accounts/refresh/
```

```json
{ "refresh": "eyJ..." }
```

### Logout

```
POST /api/v1/accounts/logout/
Authorization: Bearer <access_token>
```

```json
{ "refresh": "eyJ..." }
```

### Me (Perfil)

```
GET /api/v1/accounts/me/
PATCH /api/v1/accounts/me/
```

### Register

```
POST /api/v1/accounts/register/
```

```json
{
  "email": "new@example.com",
  "first_name": "Nome",
  "last_name": "Sobrenome",
  "password": "Senha@123",
  "password_confirm": "Senha@123"
}
```

## Padrão de Respostas

### Sucesso
```json
{ "success": true, "message": "Success", "data": {} }
```

### Erro
```json
{ "success": false, "message": "Error description", "errors": {} }
```
