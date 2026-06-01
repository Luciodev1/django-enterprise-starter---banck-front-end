import logging
from functools import wraps

audit_logger = logging.getLogger("audit")
security_logger = logging.getLogger("security")


def log_audit(action, user=None, details=None):
    audit_logger.info(
        "Audit: %s | User: %s | Details: %s",
        action, user, details or {},
    )


def log_security(event, user=None, request=None, details=None):
    ip = getattr(request, "META", {}).get("REMOTE_ADDR", "unknown") if request else "unknown"
    security_logger.info(
        "Security: %s | User: %s | IP: %s | Details: %s",
        event, user, ip, details or {},
    )


def catch_exceptions(logger=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                (logger or logging.getLogger(func.__module__)).error(
                    "Error in %s: %s", func.__name__, str(e), exc_info=True
                )
                raise
        return wrapper
    return decorator
