"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/hooks/queries";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  user?: { email: string; first_name: string; last_name: string; role: string } | null;
}

export function DashboardLayout({
  children,
  onLogout,
  darkMode,
  onToggleDarkMode,
  user,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: unread } = useUnreadCount();

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="app-shell flex min-h-screen">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 lg:block",
          "transition-[width] duration-300 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-slide-in-left">
            <Sidebar
              collapsed={false}
              onToggle={() => {}}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onMenuClick={() => setMobileOpen(true)}
          unread={unread}
          user={user}
        />
        <main id="main" className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
