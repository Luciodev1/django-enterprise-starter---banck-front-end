from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.email import send_templated_email
from apps.core.utils import log_audit, log_security

from .models import EmailVerificationToken, PasswordResetToken

User = get_user_model()


class AuthService:
    @staticmethod
    def login(request, email, password):
        user = authenticate(request, email=email, password=password)
        if not user:
            log_security("login_failed", request=request, details={"email": email})
            return None, "Invalid credentials"

        if not user.is_active:
            log_security("login_disabled_account", user=user, request=request)
            return None, "Account is disabled"

        refresh = RefreshToken.for_user(user)
        user.last_login_ip = request.META.get("REMOTE_ADDR") if request else None
        user.save(update_fields=["last_login_ip", "updated_at"])
        log_audit("login", user, {"email": email})
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "avatar": user.avatar.url if user.avatar else None,
                "is_verified": user.is_verified,
                "is_mfa_enabled": user.is_mfa_enabled,
            },
        }, None

    @staticmethod
    def logout(user, request):
        log_audit("logout", user)
        log_security("logout", user, request)
        return {"message": "Logged out successfully"}

    @staticmethod
    def refresh_token(refresh_token):
        try:
            token = RefreshToken(refresh_token)
            return {
                "access": str(token.access_token),
                "refresh": str(token),
            }, None
        except Exception:
            return None, "Invalid or expired refresh token"

    @staticmethod
    def request_password_reset(email: str):
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return None, "If the email exists, a reset link will be sent"

        PasswordResetToken.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())
        token = PasswordResetToken.create_for_user(user)
        log_audit("password_reset_requested", user, {"token_id": str(token.id)})
        return {"token": token.token, "user_id": str(user.id)}, None

    @staticmethod
    def confirm_password_reset(token: str, new_password: str):
        try:
            reset = PasswordResetToken.objects.select_related("user").get(token=token)
        except PasswordResetToken.DoesNotExist:
            return None, "Invalid or expired token"

        if not reset.is_valid():
            return None, "Token expired or already used"

        user = reset.user
        user.set_password(new_password)
        user.save(update_fields=["password", "updated_at"])
        reset.used_at = timezone.now()
        reset.save(update_fields=["used_at"])
        log_audit("password_reset_completed", user)
        return {"message": "Password reset successfully"}, None

    @staticmethod
    def request_email_verification(user):
        EmailVerificationToken.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())
        token = EmailVerificationToken.create_for_user(user)
        log_audit("email_verification_requested", user)

        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token.token}"
        try:
            send_templated_email(
                "email_verification",
                user,
                context={
                    "name": user.first_name,
                    "verification_link": verification_link,
                    "expiry_hours": 48,
                },
            )
        except Exception:
            pass

        response = {"token": token.token, "verification_link": verification_link} if settings.DEBUG else {"message": "Email de verificação enviado"}
        return response, None

    @staticmethod
    def confirm_email_verification(token: str):
        try:
            verify = EmailVerificationToken.objects.select_related("user").get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return None, "Invalid or expired token"

        if not verify.is_valid():
            return None, "Token expired or already used"

        user = verify.user
        user.is_verified = True
        user.save(update_fields=["is_verified", "updated_at"])
        verify.used_at = timezone.now()
        verify.save(update_fields=["used_at"])

        EmailVerificationToken.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())

        log_audit("email_verified", user)
        return {"message": "Email verified successfully"}, None
