from rest_framework.permissions import BasePermission


class RolePermission(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.allowed_roles


class IsVerified(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_verified
