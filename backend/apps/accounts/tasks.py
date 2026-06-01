from celery import shared_task

from apps.core.utils import log_audit


@shared_task
def send_welcome_email(user_id):
    log_audit("send_welcome_email", user_id, {"user_id": user_id})
    return f"Welcome email sent to user {user_id}"


@shared_task
def send_password_reset_email(user_id, reset_token):
    log_audit("send_password_reset", user_id, {"token": reset_token[:8] + "..."})
    return f"Password reset email sent to user {user_id}"
