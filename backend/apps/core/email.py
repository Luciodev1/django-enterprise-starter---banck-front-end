from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

from apps.notifications.models import Notification, NotificationTemplate


def send_templated_email(template_code, recipient, context=None, subject=None):
    context = context or {}
    try:
        template = NotificationTemplate.objects.get(code=template_code, channel="email", is_active=True)
    except NotificationTemplate.DoesNotExist:
        raise ValueError(f"Email template '{template_code}' not found or inactive")

    email_subject = subject or template.subject
    html_body = render_to_string(f"email/{template_code}.html", context)
    text_body = render_to_string(f"email/{template_code}.txt", context)

    name = context.get("name", "")
    body = f"Olá{', ' + name if name else ''}! {email_subject}. Acede ao link para confirmar." if template_code == "email_verification" else email_subject
    notification = Notification.objects.create(
        recipient=recipient,
        channel="email",
        subject=email_subject,
        body=body,
    )

    try:
        msg = EmailMultiAlternatives(
            subject=email_subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient.email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
        notification.sent = True
        notification.sent_at = timezone.now()
        notification.save()
    except Exception as e:
        notification.error_message = str(e)
        notification.save()

    return notification
