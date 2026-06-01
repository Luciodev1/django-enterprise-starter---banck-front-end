from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.utils import log_audit, log_security


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
