# Segurança

## Implementado

- Argon2 para hashing de senhas
- django-axes para rate limit de login (5 tentativas, 1h lockout)
- CSP (Content Security Policy) preparado
- HSTS em produção
- Secure/HttpOnly cookies
- CSRF prevention
- XSS protection via Django middleware
- CORS configurado

## OWASP Top 10

- **A01 Broken Access Control**: Permissions hierárquicas + Django Groups
- **A02 Cryptographic Failures**: Argon2, JWT com HS256
- **A03 Injection**: Django ORM (proteção nativa contra SQL injection)
- **A04 Insecure Design**: API First, validação em camadas
- **A05 Security Misconfiguration**: Settings por ambiente
- **A06 Vulnerable Components**: Dependências auditadas via Safety
- **A07 Auth Failures**: JWT + MFA preparado + axes rate limit
- **A08 Integrity Failures**: CSP, SRI preparado
- **A09 Logging**: Audit logging completo
- **A10 SSRF**: Proteção via validação de URLs
