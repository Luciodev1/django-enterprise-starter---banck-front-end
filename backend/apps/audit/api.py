from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.permissions import IsAdmin, IsAuthenticated

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    performed_by_email = serializers.CharField(source="performed_by.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = (
            "id", "action", "model_name", "model_id",
            "performed_by", "performed_by_email",
            "description", "changes", "ip_address", "created_at",
        )
        read_only_fields = fields


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Apenas leitura (logs são imutáveis).
    - Admin/Manager vê todos.
    - Operator/Client só vê os logs onde performed_by == self.
    """
    queryset = AuditLog.objects.select_related("performed_by").all().order_by("-created_at")
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["action", "model_name", "performed_by"]
    search_fields = ["description", "model_name", "model_id"]
    ordering_fields = ["created_at", "action"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.user.role
        if role in ("superadmin", "admin", "manager"):
            return qs
        return qs.filter(performed_by=self.request.user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()
        by_action = list(qs.values("action").annotate(count=Count("id")).order_by("-count"))
        by_model = list(qs.values("model_name").annotate(count=Count("id")).order_by("-count")[:10])
        return Response(
            {
                "total": qs.count(),
                "by_action": {item["action"]: item["count"] for item in by_action},
                "top_models": by_model,
            }
        )
