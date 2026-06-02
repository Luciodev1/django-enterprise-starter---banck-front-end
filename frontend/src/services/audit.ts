import { api } from "./api";
import type { ApiResponse } from "@/types/auth";
import type { PaginatedResponse } from "./users";

export interface AuditLog {
  id: string;
  action: string;
  model_name: string;
  model_id: string;
  performed_by: string | null;
  performed_by_email: string | null;
  description: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface AuditSummary {
  total: number;
  by_action: Record<string, number>;
  top_models: { model_name: string; count: number }[];
}

export const auditService = {
  async list(params: Record<string, unknown> = {}): Promise<PaginatedResponse<AuditLog>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<AuditLog>>>("/audit/logs/", { params });
    return data.data;
  },

  async get(id: string): Promise<AuditLog> {
    const { data } = await api.get<ApiResponse<AuditLog>>(`/audit/logs/${id}/`);
    return data.data;
  },

  async summary(): Promise<AuditSummary> {
    const { data } = await api.get<ApiResponse<AuditSummary>>("/audit/logs/summary/");
    return data.data;
  },
};
