"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, containerClassName, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type="date"
            className={cn(
              "flex h-10 w-full rounded-lg border border-input bg-background pl-3 pr-10 text-sm shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-error-500 focus-visible:ring-error-500",
              className
            )}
            ref={ref}
            {...props}
          />
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {error && <p className="text-xs font-medium text-error-600">{error}</p>}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";
