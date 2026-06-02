import { api } from "./api";
import type { ApiResponse, User } from "@/types/auth";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserListParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  is_verified?: boolean;
  ordering?: string;
}

export interface UserCreatePayload {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active?: boolean;
  password: string;
  password_confirm: string;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  by_role: Record<string, number>;
}

export const userService = {
  async list(params: UserListParams = {}): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<User>>>("/accounts/users/", { params });
    return data.data;
  },

  async get(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/accounts/users/${id}/`);
    return data.data;
  },

  async create(payload: UserCreatePayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>("/accounts/users/", payload);
    return data.data;
  },

  async update(id: string, payload: UserUpdatePayload): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/accounts/users/${id}/`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/accounts/users/${id}/`);
  },

  async changeRole(id: string, role: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(`/accounts/users/${id}/change_role/`, { role });
    return data.data;
  },

  async activate(id: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(`/accounts/users/${id}/activate/`);
    return data.data;
  },

  async deactivate(id: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(`/accounts/users/${id}/deactivate/`);
    return data.data;
  },

  async stats(): Promise<UserStats> {
    const { data } = await api.get<ApiResponse<UserStats>>("/accounts/users/stats/");
    return data.data;
  },
};
