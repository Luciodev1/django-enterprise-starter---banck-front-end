import { api } from "./api";
import type { ApiResponse, LoginResponse, User } from "@/types/auth";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>("/accounts/login/", { email, password });
    return data.data;
  },

  async refresh(refresh: string): Promise<{ access: string; refresh: string }> {
    const { data } = await api.post<ApiResponse<{ access: string; refresh: string }>>("/accounts/refresh/", { refresh });
    return data.data;
  },

  async logout(refresh: string): Promise<void> {
    await api.post("/accounts/logout/", { refresh });
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/accounts/me/");
    return data.data;
  },

  async updateProfile(profile: Partial<User>): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>("/accounts/me/", profile);
    return data.data;
  },
};
