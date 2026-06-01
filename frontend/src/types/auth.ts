export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  role: "superadmin" | "admin" | "manager" | "operator" | "client";
  is_verified: boolean;
  is_mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}
