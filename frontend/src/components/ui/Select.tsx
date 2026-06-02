"use client";

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, containerClassName, label, error, hint, options, placeholder, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground/90">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={inputId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-error-500 focus-visible:ring-error-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {error ? (
          <p className="text-xs font-medium text-error-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
