"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Settings,
  Shield,
  Bell,
  BarChart3,
  Building2,
  Users,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Usuários", icon: Users },
  { href: "/dashboard/companies", label: "Empresas", icon: Building2 },
  { href: "/dashboard/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

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
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
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
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {!collapsed && (
          <p className="text-xs text-secondary-400">Enterprise Starter v1.0</p>
        )}
      </div>
    </aside>
  );
}
