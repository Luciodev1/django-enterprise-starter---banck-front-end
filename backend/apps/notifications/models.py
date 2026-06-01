import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    channel = models.CharField(max_length=20, choices=[
        ("email", "Email"),
        ("sms", "SMS"),
        ("whatsapp", "WhatsApp"),
        ("push", "Push"),
    ])
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["recipient", "sent"]),
            models.Index(fields=["channel"]),
        ]

    def __str__(self):
        return f"{self.channel} - {self.subject} ({self.recipient.email})"
