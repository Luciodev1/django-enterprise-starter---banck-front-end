"use client";

import { Bell, Moon, Sun, LogOut, User } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Topbar({ onLogout, darkMode, onToggleDarkMode }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-card px-6">
      <button
        onClick={onToggleDarkMode}
        className="p-2 rounded-md hover:bg-muted transition-colors"
        title={darkMode ? "Modo Claro" : "Modo Escuro"}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <button className="p-2 rounded-md hover:bg-muted transition-colors relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500" />
      </button>

      <Link
        href="/profile"
        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <User className="h-4 w-4 text-primary-600" />
        </div>
      </Link>

      <button
        onClick={onLogout}
        className="p-2 rounded-md hover:bg-muted transition-colors text-secondary-500 hover:text-error-500"
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}
