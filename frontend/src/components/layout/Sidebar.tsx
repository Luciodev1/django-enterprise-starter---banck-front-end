"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  BarChart3,
  Users,
  History,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react";
import { useUnreadCount } from "@/hooks/queries";
import { Logo } from "@/components/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: unread } = useUnreadCount();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/users", label: "Usuários", icon: Users },
    { href: "/dashboard/notifications", label: "Notificações", icon: Bell, badge: unread },
    { href: "/dashboard/audit", label: "Auditoria", icon: History },
    { href: "/dashboard/reports", label: "Relatórios", icon: BarChart3 },
    { href: "/profile", label: "Perfil", icon: User },
    { href: "/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn("flex items-center overflow-hidden", collapsed && "justify-center w-full")}
        >
          {collapsed ? <Logo withText={false} size="md" /> : <Logo size="md" />}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "hidden lg:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "hidden"
          )}
          aria-label="Recolher sidebar"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 scrollbar-thin" aria-label="Navegação principal">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-primary-600" />
              )}
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive ? "text-primary-600 dark:text-primary-300" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {collapsed && (
        <div className="border-t border-border/60 p-2">
          <button
            type="button"
            onClick={onToggle}
            className="hidden lg:inline-flex h-9 w-full items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Expandir sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
              S
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">SIS Enterprise</p>
              <p className="truncate text-[11px] text-muted-foreground">v1.0 · Build 2025</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
