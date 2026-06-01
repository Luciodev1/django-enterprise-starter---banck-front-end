"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function DashboardLayout({ children, onLogout, darkMode, onToggleDarkMode }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={cn("transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <Topbar onLogout={onLogout} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
