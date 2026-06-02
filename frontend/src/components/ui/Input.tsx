import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/90"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-input bg-background text-sm shadow-sm transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              error &&
                "border-error-500 focus-visible:ring-error-500 dark:border-error-500",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-error-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
