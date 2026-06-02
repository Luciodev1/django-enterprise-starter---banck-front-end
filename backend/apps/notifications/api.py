from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.permissions import IsAdmin, IsAuthenticated

from .models import Notification, NotificationTemplate
from .serializers import (
    NotificationCreateSerializer,
    NotificationSerializer,
    NotificationTemplateSerializer,
)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    CRUD de notificações.
    - Listagem/retrieve: o utilizador só vê as próprias notificações.
    - Create: Admin+.
    - Update/destroy: Admin+ ou o próprio recipient.
    """
    queryset = Notification.objects.select_related("recipient").all().order_by("-created_at")
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["channel", "sent", "read_at"]
    search_fields = ["subject", "body"]
    ordering_fields = ["created_at", "sent_at", "read_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "create":
            return NotificationCreateSerializer
        return NotificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.user.role
        if role in ("superadmin", "admin", "manager"):
            return qs
        return qs.filter(recipient=self.request.user)

    def get_permissions(self):
        if self.action in ("create", "destroy", "update", "partial_update"):
            self.permission_classes = [IsAuthenticated, IsAdmin]
        return super().get_permissions()

    @action(detail=False, methods=["get"])
    def mine(self, request):
        qs = self.get_queryset().filter(recipient=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        if notification.read_at is None:
            notification.read_at = timezone.now()
            notification.save(update_fields=["read_at", "updated_at"])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(recipient=request.user, read_at__isnull=True).update(read_at=timezone.now())
        return Response({"message": f"{updated} notifications marked as read"})

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = self.get_queryset().filter(recipient=request.user, read_at__isnull=True).count()
        return Response({"unread": count})


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all().order_by("name")
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["channel", "is_active"]
    search_fields = ["code", "name", "subject"]
    ordering_fields = ["name", "code", "created_at"]
    ordering = ["name"]
