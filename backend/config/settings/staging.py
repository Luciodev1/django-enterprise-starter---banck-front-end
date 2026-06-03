from .base import *  # noqa: F403

DEBUG = True
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["*"])  # noqa: F405

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST", default="smtp.sendgrid.net")  # noqa: F405
EMAIL_PORT = env.int("EMAIL_PORT", default=587)  # noqa: F405
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")  # noqa: F405
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")  # noqa: F405
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)  # noqa: F405
DEFAULT_FROM_EMAIL = env("EMAIL_DEFAULT_FROM", default="noreply@example.com")  # noqa: F405
