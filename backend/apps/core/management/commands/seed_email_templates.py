from django.core.management.base import BaseCommand

from apps.notifications.models import NotificationTemplate


TEMPLATES = [
    {
        "code": "email_verification",
        "name": "Email Verification",
        "channel": "email",
        "subject": "Verifique seu email — SIS Enterprise",
        "body": "Use o template HTML/TXT renderizado via Django templates.",
    },
]


class Command(BaseCommand):
    help = "Seed email notification templates"

    def handle(self, *args, **options):
        for tpl in TEMPLATES:
            obj, created = NotificationTemplate.objects.update_or_create(
                code=tpl["code"],
                channel=tpl["channel"],
                defaults={
                    "name": tpl["name"],
                    "subject": tpl["subject"],
                    "body": tpl["body"],
                    "is_active": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created template: {tpl['code']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Updated template: {tpl['code']}"))

        self.stdout.write(self.style.SUCCESS("Email templates seeded successfully."))
