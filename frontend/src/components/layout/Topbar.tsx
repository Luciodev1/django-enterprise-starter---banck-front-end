"use client";

import {
  Bell,
  Moon,
  Sun,
  LogOut,
  Search,
  Menu,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMenuClick: () => void;
  unread?: number;
  user?: { email: string; first_name: string; last_name: string; role: string } | null;
}

const pageMeta: Record<string, { title: string; description: string; icon?: LucideIcon }> = {
  "/dashboard": { title: "Dashboard", description: "Visão geral da plataforma" },
  "/dashboard/users": { title: "Usuários", description: "Gestão de contas e permissões" },
  "/dashboard/notifications": { title: "Notificações", description: "Central de mensagens e alertas" },
  "/dashboard/audit": { title: "Auditoria", description: "Histórico de ações no sistema" },
  "/dashboard/reports": { title: "Relatórios", description: "Métricas e tendências" },
  "/profile": { title: "Perfil", description: "Informações pessoais" },
  "/settings": { title: "Configurações", description: "Segurança e conta" },
};

function resolveMeta(pathname: string) {
  if (pageMeta[pathname]) return pageMeta[pathname];
  for (const key of Object.keys(pageMeta)) {
    if (key !== "/dashboard" && pathname.startsWith(key + "/")) {
      return pageMeta[key];
    }
  }
  return { title: "SIS", description: "" };
}

function getInitials(first: string, last: string, email: string) {
  const f = (first?.[0] || email?.[0] || "?").toUpperCase();
  const l = (last?.[0] || "").toUpperCase();
  return `${f}${l}`;
}

export function Topbar({ onLogout, darkMode, onToggleDarkMode, onMenuClick, unread, user }: TopbarProps) {
  const pathname = usePathname();
  const meta = resolveMeta(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 sm:block">
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {meta.title}
          </h1>
          <p className="truncate text-xs text-muted-foreground">{meta.description}</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 sm:flex-none sm:gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Pesquisar..."
              className="h-9 w-48 rounded-lg border border-input bg-background pl-9 pr-3 text-sm transition-all placeholder:text-muted-foreground focus:w-72 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground lg:inline-flex">
              ⌘K
            </kbd>
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            href="/dashboard/notifications"
            aria-label="Notificações"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell className="h-4 w-4" />
            {unread !== undefined && unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500 ring-2 ring-card" />
            )}
          </Link>

          <div className="relative ml-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-border bg-card p-0.5 pr-2 text-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white",
                  "bg-gradient-to-br from-primary-500 to-indigo-600"
                )}
              >
                {getInitials(user?.first_name || "", user?.last_name || "", user?.email || "")}
              </span>
              <span className="hidden truncate text-xs font-medium text-foreground md:inline">
                {user?.first_name || user?.email?.split("@")[0]}
              </span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-modal animate-fade-in"
              >
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {user?.role}
                  </p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <UserIcon className="h-4 w-4" />
                  Meu perfil
                </Link>
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <SettingsIcon className="h-4 w-4" />
                  Configurações
                </Link>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-error-600 transition-colors hover:bg-error-50 dark:hover:bg-error-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Terminar sessão
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
