from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.serializers import LoginSerializer, RegisterSerializer, UserSerializer
from apps.accounts.services import AuthService
from apps.core.permissions import IsAuthenticated

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
            return Response({"success": False, "message": error}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"success": True, "message": "Login successful", "data": result})


class RefreshAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        result, error = AuthService.refresh_token(request.data.get("refresh", ""))
        if error:
            return Response({"success": False, "message": error}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"success": True, "message": "Token refreshed", "data": result})


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
        result = AuthService.logout(request.user, request)
        return Response({"success": True, "message": result["message"]})


class UserMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"success": True, "message": "Success", "data": serializer.data})

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "message": "Profile updated", "data": serializer.data})


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
                "success": True,
                "message": "User registered successfully",
                "data": {
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )
