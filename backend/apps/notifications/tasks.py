from celery import shared_task

from .services import NotificationService


@shared_task
def send_email_notification(user_id, subject, body):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        NotificationService.send_email(user, subject, body)
        return f"Email sent to {user.email}"
    except User.DoesNotExist:
        return f"User {user_id} not found"
