from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import exceptions, filters, generics, permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import (
    EmailVerificationToken,
    PasswordResetToken,
)
from apps.accounts.serializers import (
    ChangePasswordSerializer,
    EmailVerificationConfirmSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserCreateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from apps.accounts.services import AuthService
from apps.audit.services import AuditService
from apps.core.permissions import IsAdmin, IsAuthenticated

User = get_user_model()


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result, error = AuthService.login(
            request,
            serializer.validated_data["email"],
            serializer.validated_data["password"],
        )
        if error:
            raise exceptions.AuthenticationFailed(error)
        return Response(result)


class RefreshAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        result, error = AuthService.refresh_token(request.data.get("refresh", ""))
        if error:
            raise exceptions.AuthenticationFailed(error)
        return Response(result)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        AuthService.logout(request.user, request)
        return Response({"message": "Logged out successfully"})


class UserMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            raise serializers.ValidationError({"old_password": "Current password is incorrect"})
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password", "updated_at"])
        return Response({"message": "Password changed successfully"})


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class PasswordResetRequestAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result, error = AuthService.request_password_reset(serializer.validated_data["email"])
        if error:
            raise serializers.ValidationError(error)
        return Response(result)


class PasswordResetConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result, error = AuthService.confirm_password_reset(
            serializer.validated_data["token"],
            serializer.validated_data["new_password"],
        )
        if error:
            raise serializers.ValidationError(error)
        return Response({"message": result["message"]})


class EmailVerificationRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        result, error = AuthService.request_email_verification(request.user)
        if error:
            raise serializers.ValidationError(error)
        return Response(result)


class EmailVerificationConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailVerificationConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result, error = AuthService.confirm_email_verification(serializer.validated_data["token"])
        if error:
            raise serializers.ValidationError(error)
        return Response({"message": result["message"]})


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD de utilizadores.
    - list/retrieve: Admin/Manager podem ver todos; Operator/Client só vêem o próprio.
    - create: Admin+ apenas.
    - update/destroy: Admin+ (destroy é admin only).
    """
    queryset = User.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["role", "is_active", "is_verified", "is_staff"]
    search_fields = ["email", "first_name", "last_name", "phone"]
    ordering_fields = ["created_at", "updated_at", "email", "first_name", "last_name"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        if self.action in ("update", "partial_update"):
            return UserUpdateSerializer
        return UserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.user.role
        if role in ("superadmin", "admin", "manager"):
            return qs
        return qs.filter(id=self.request.user.id)

    def get_permissions(self):
        if self.action == "destroy":
            self.permission_classes = [IsAuthenticated, IsAdmin]
        return super().get_permissions()

    def perform_create(self, serializer):
        user = serializer.save()
        AuditService.log(
            action="create",
            model_name="User",
            model_id=str(user.id),
            performed_by=self.request.user,
            description=f"User {user.email} created",
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return full user (with id) using UserSerializer
        output = UserSerializer(serializer.instance, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        user = serializer.save()
        AuditService.log(
            action="update",
            model_name="User",
            model_id=str(user.id),
            performed_by=self.request.user,
            description=f"User {user.email} updated",
        )

    def perform_destroy(self, instance):
        AuditService.log(
            action="delete",
            model_name="User",
            model_id=str(instance.id),
            performed_by=self.request.user,
            description=f"User {instance.email} deleted",
        )
        instance.delete()

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdmin])
    def change_role(self, request, pk=None):
        user = self.get_object()
        new_role = request.data.get("role")
        valid_roles = [r[0] for r in User._meta.get_field("role").choices]
        if new_role not in valid_roles:
            raise serializers.ValidationError(f"Invalid role. Valid: {valid_roles}")
        old_role = user.role
        user.role = new_role
        user.save(update_fields=["role", "updated_at"])
        AuditService.log(
            action="permission_change",
            model_name="User",
            model_id=str(user.id),
            performed_by=request.user,
            description=f"Role {old_role} -> {new_role}",
        )
        return Response(UserSerializer(user, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdmin])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=["is_active", "updated_at"])
        return Response(UserSerializer(user, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdmin])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=["is_active", "updated_at"])
        return Response(UserSerializer(user, context={"request": request}).data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdmin])
    def stats(self, request):
        qs = self.get_queryset()
        by_role = qs.values("role").annotate(count=Count("id"))
        active = qs.filter(is_active=True).count()
        inactive = qs.filter(is_active=False).count()
        verified = qs.filter(is_verified=True).count()
        return Response(
            {
                "total": qs.count(),
                "active": active,
                "inactive": inactive,
                "verified": verified,
                "by_role": {item["role"]: item["count"] for item in by_role},
            }
        )
