from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.audit.models import AuditLog


@receiver(post_save, sender="accounts.User")
def user_post_save(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            action="create",
            model_name="User",
            model_id=str(instance.id),
            performed_by=instance,
            description=f"User {instance.email} created",
        )
