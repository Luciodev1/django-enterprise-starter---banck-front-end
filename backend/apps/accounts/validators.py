from django.core.exceptions import ValidationError


def validate_email_not_taken(email):
    from .models import User
    if User.objects.filter(email__iexact=email).exists():
        raise ValidationError("This email is already registered")
