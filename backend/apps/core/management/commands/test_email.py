from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.core.email import send_templated_email

User = get_user_model()


class Command(BaseCommand):
    help = "Send a test email to verify SMTP configuration"

    def add_arguments(self, parser):
        parser.add_argument("email", nargs="?", help="Recipient email (defaults to first superadmin)")
        parser.add_argument("--template", default="email_verification", help="Template code to send")

    def handle(self, *args, **options):
        email = options["email"]
        template_code = options["template"]

        if email:
            user = User.objects.filter(email=email).first()
            if not user:
                self.stdout.write(self.style.ERROR(f"User with email '{email}' not found."))
                self.stdout.write("Create a user first or run without arguments to use the first superadmin.")
                return
        else:
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                self.stdout.write(self.style.ERROR("No superadmin found. Provide an email argument."))
                return
            email = user.email

        self.stdout.write(f"From: {settings.DEFAULT_FROM_EMAIL}")
        self.stdout.write(f"To: {email}")
        self.stdout.write(f"Template: {template_code}")
        self.stdout.write(f"Backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"Host: {getattr(settings, 'EMAIL_HOST', 'N/A')}:{getattr(settings, 'EMAIL_PORT', 'N/A')}")
        self.stdout.write("")

        context = {
            "name": user.first_name or "Teste",
            "verification_link": f"{settings.FRONTEND_URL}/verify-email?token=test-token-123",
            "expiry_hours": 48,
        }

        try:
            notification = send_templated_email(template_code, user, context=context)
            if notification.sent:
                self.stdout.write(self.style.SUCCESS(f"Email sent! Notification ID: {notification.id}"))
            else:
                self.stdout.write(self.style.ERROR(f"Send failed: {notification.error_message}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
