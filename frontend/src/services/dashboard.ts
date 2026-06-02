import { api } from "./api";
import type { ApiResponse } from "@/types/auth";

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    new_last_30: number;
    verified: number;
    by_role: Record<string, number>;
  };
  audit: {
    total: number;
    recent_7: number;
    by_action: Record<string, number>;
  };
  notifications: {
    total: number;
    unread: number;
    by_channel: Record<string, number>;
  };
  timeseries: {
    users_30d: { date: string; count: number }[];
    audit_30d: { date: string; count: number }[];
  };
}

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats/");
    return data.data;
  },

  async health(): Promise<{ status: string; database: string; cache: string; service: string; version: string }> {
    const { data } = await api.get("/health/");
    return data;
  },
};
