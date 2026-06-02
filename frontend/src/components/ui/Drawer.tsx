"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: "right" | "left";
  width?: string;
  footer?: ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
  width = "w-full sm:max-w-md",
  footer,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "fixed bottom-0 top-0 flex flex-col border-l border-border bg-card shadow-modal",
          side === "right" ? "right-0 animate-slide-in-right" : "left-0 animate-slide-in-left",
          width
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-border/60 p-5">
            <div>
              {title && (
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-border/60 p-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
