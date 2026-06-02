import { api } from "./api";
import type { ApiResponse } from "@/types/auth";
import type { PaginatedResponse } from "./users";

export interface Notification {
  id: string;
  recipient: string;
  channel: "email" | "sms" | "whatsapp" | "push";
  subject: string;
  body: string;
  sent: boolean;
  sent_at: string | null;
  read_at: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const notificationService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<Notification>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Notification>>>("/notifications/notifications/", { params });
    return data.data;
  },

  async mine(_params: Record<string, unknown> = {}): Promise<PaginatedResponse<Notification>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Notification>>>(
      "/notifications/notifications/mine/"
    );
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await api.get<ApiResponse<{ unread: number }>>(
      "/notifications/notifications/unread_count/"
    );
    return data.data.unread;
  },

  async markRead(id: string): Promise<Notification> {
    const { data } = await api.post<ApiResponse<Notification>>(
      `/notifications/notifications/${id}/mark_read/`
    );
    return data.data;
  },

  async markAllRead(): Promise<number> {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      "/notifications/notifications/mark_all_read/"
    );
    return 0;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/notifications/${id}/`);
  },
};
