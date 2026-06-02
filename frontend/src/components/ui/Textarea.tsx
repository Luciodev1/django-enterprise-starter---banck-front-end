"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, error, hint, id, rows = 4, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          rows={rows}
          className={cn(
            "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-60 resize-y",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-error-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
