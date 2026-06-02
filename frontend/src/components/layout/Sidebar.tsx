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
  ChevronLeft,
} from "lucide-react";
import { useUnreadCount } from "@/hooks/queries";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
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
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            Enterprise
          </Link>
        )}
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-muted transition-colors">
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-secondary-600 hover:bg-muted hover:text-secondary-900"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-error-500 text-white text-[10px] rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {!collapsed && <p className="text-xs text-secondary-400">Enterprise Starter v1.0</p>}
      </div>
    </aside>
  );
}
