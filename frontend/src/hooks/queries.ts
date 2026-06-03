"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { userService, type UserCreatePayload, type UserListParams, type UserUpdatePayload } from "@/services/users";
import { auditService } from "@/services/audit";
import { dashboardService } from "@/services/dashboard";
import { notificationService } from "@/services/notifications";
import { authService } from "@/services/auth";
import type { User } from "@/types/auth";

export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (params: UserListParams) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    stats: ["users", "stats"] as const,
  },
  audit: {
    all: ["audit"] as const,
    list: (params: Record<string, unknown>) => ["audit", "list", params] as const,
    summary: ["audit", "summary"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: Record<string, unknown>) => ["notifications", "list", params] as const,
    mine: ["notifications", "mine"] as const,
    unread: ["notifications", "unread"] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    health: ["dashboard", "health"] as const,
  },
  me: ["auth", "me"] as const,
};

// --- Users ---
export function useUsers(
  params: UserListParams = {},
  options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userService.list>>>>
) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.list(params),
    ...options,
  });
}

export function useUser(id: string, options?: Partial<UseQueryOptions<User>>) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.get(id),
    enabled: !!id,
    ...options,
  });
}

export function useUserStats(options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof userService.stats>>>>) {
  return useQuery({
    queryKey: queryKeys.users.stats,
    queryFn: () => userService.stats(),
    ...options,
  });
}

export function useCreateUser(options?: UseMutationOptions<User, Error, UserCreatePayload>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => userService.create(payload),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateUser(options?: UseMutationOptions<User, Error, { id: string; payload: UserUpdatePayload }>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => userService.update(id, payload),
    ...options,
    onSuccess: (data, vars, ...rest) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.setQueryData(queryKeys.users.detail(vars.id), data);
      options?.onSuccess?.(data, vars, ...rest);
    },
  });
}

export function useDeleteUser(options?: UseMutationOptions<void, Error, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => userService.remove(id),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      options?.onSuccess?.(...args);
    },
  });
}

export function useChangeUserRole(options?: UseMutationOptions<User, Error, { id: string; role: string }>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => userService.changeRole(id, role),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      options?.onSuccess?.(...args);
    },
  });
}

export function useToggleUserActive(options?: UseMutationOptions<User, Error, { id: string; active: boolean }>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }) => (active ? userService.activate(id) : userService.deactivate(id)),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      options?.onSuccess?.(...args);
    },
  });
}

// --- Audit ---
export function useAuditLogs(
  params: Record<string, unknown> = {},
  options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof auditService.list>>>>
) {
  return useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: () => auditService.list(params),
    ...options,
  });
}

export function useAuditSummary(options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof auditService.summary>>>>) {
  return useQuery({
    queryKey: queryKeys.audit.summary,
    queryFn: () => auditService.summary(),
    ...options,
  });
}

// --- Notifications ---
export function useMyNotifications(
  params: Record<string, unknown> = {},
  options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationService.mine>>>>
) {
  return useQuery({
    queryKey: [...queryKeys.notifications.mine, params] as const,
    queryFn: () => notificationService.mine(params as any),
    ...options,
  });
}

export function useUnreadCount(options?: Partial<UseQueryOptions<number>>) {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationService.unreadCount(),
    refetchInterval: 60_000,
    ...options,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// --- Dashboard ---
export function useDashboardStats(options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardService.stats>>>>) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardService.stats(),
    refetchInterval: 60_000,
    ...options,
  });
}

export function useHealth(options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardService.health>>>>) {
  return useQuery({
    queryKey: queryKeys.dashboard.health,
    queryFn: () => dashboardService.health(),
    refetchInterval: 30_000,
    ...options,
  });
}

// --- Auth / Me ---
export function useMe(options?: Partial<UseQueryOptions<User>>) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => authService.getMe(),
    ...options,
  });
}

export function useUpdateProfile(options?: UseMutationOptions<User, Error, Partial<User>>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => authService.updateProfile(payload),
    ...options,
    onSuccess: (data, ...rest) => {
      qc.setQueryData(queryKeys.me, data);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
      }
      options?.onSuccess?.(data, ...rest);
    },
  });
}

export function useChangePassword(options?: UseMutationOptions<void, Error, { old_password: string; new_password: string; new_password_confirm: string }>) {
  return useMutation({
    mutationFn: (payload) => authService.changePassword(payload),
    ...options,
  });
}

export function useVerifyEmail(options?: UseMutationOptions<void, Error, string>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token) => authService.confirmEmailVerification(token),
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.me });
      options?.onSuccess?.(...args);
    },
  });
}
