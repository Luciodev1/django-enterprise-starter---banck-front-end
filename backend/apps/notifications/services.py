from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Notification


class NotificationService:
    @staticmethod
    def send_email(recipient, subject, body):
        notification = Notification.objects.create(
            recipient=recipient, channel="email", subject=subject, body=body
        )
        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                [recipient.email],
                fail_silently=False,
            )
            notification.sent = True
            notification.sent_at = timezone.now()
            notification.save()
        except Exception as e:
            notification.error_message = str(e)
            notification.save()
        return notification

    @staticmethod
    def create_notification(recipient, channel, subject, body):
        return Notification.objects.create(
            recipient=recipient, channel=channel, subject=subject, body=body
        )
