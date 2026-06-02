import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiErrorMessage(err: unknown, fallback = "Ocorreu um erro inesperado"): string {
  if (typeof err === "object" && err !== null) {
    const axiosErr = err as AxiosError<{ message?: string; errors?: unknown; detail?: string }>;
    const data = axiosErr.response?.data;
    if (data) {
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }
      if (typeof data.detail === "string" && data.detail.trim()) {
        return data.detail;
      }
      if (data.errors) {
        const first = extractFirstError(data.errors);
        if (first) return first;
      }
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function extractFirstError(errors: unknown): string | null {
  if (typeof errors === "string") return errors;
  if (Array.isArray(errors)) {
    for (const item of errors) {
      const found = extractFirstError(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof errors === "object" && errors !== null) {
    for (const value of Object.values(errors)) {
      const found = extractFirstError(value);
      if (found) return found;
    }
  }
  return null;
}
