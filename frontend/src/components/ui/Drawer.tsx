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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 transition-opacity"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          "fixed top-0 bottom-0 bg-white shadow-modal flex flex-col",
          side === "right" ? "right-0" : "left-0",
          width,
          "animate-in slide-in-from-" + (side === "right" ? "right" : "left")
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b">
            <div>
              {title && <h2 className="text-lg font-semibold text-secondary-900">{title}</h2>}
              {description && <p className="text-sm text-secondary-500 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted transition-colors text-secondary-500"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="border-t p-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
