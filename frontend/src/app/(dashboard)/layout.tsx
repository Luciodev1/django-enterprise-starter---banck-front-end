"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react";
import { LoadingState } from "@/components/ui/Spinner";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, logout, darkMode, toggleDarkMode } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState message="A validar sessão..." />
      </div>
    );
  }

  return (
    <DashboardLayout
      onLogout={logout}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
      user={{
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
