"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <DashboardLayout onLogout={logout} darkMode={darkMode} onToggleDarkMode={toggleDarkMode}>
      {children}
    </DashboardLayout>
  );
}
