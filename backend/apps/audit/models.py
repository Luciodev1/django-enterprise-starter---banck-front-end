import uuid

from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=50, choices=[
        ("login", "Login"),
        ("logout", "Logout"),
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
        ("permission_change", "Permission Change"),
        ("email_verification_requested", "Email Verification Requested"),
        ("email_verified", "Email Verified"),
    ])
    model_name = models.CharField(max_length=100)
    model_id = models.CharField(max_length=100, blank=True)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.TextField(blank=True)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["action"]),
            models.Index(fields=["model_name"]),
            models.Index(fields=["performed_by"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.action} - {self.model_name} [{self.created_at}]"
