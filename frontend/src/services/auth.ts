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

  async changePassword(payload: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<void> {
    await api.post("/accounts/change-password/", payload);
  },

  async requestPasswordReset(email: string): Promise<{ token: string; user_id: string }> {
    const { data } = await api.post<ApiResponse<{ token: string; user_id: string }>>(
      "/accounts/password-reset/request/",
      { email }
    );
    return data.data;
  },

  async confirmPasswordReset(payload: {
    token: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<void> {
    await api.post("/accounts/password-reset/confirm/", payload);
  },

  async requestEmailVerification(): Promise<{ token: string }> {
    const { data } = await api.post<ApiResponse<{ token: string }>>(
      "/accounts/email-verification/request/"
    );
    return data.data;
  },
};
