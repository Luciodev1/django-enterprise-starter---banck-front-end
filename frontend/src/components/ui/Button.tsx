"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  cn(
    "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold",
    "transition-all duration-200 will-change-transform",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
    "select-none"
  ),
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary-500 to-primary-700 text-white shadow-glow hover:from-primary-600 hover:to-primary-800",
        secondary:
          "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-gradient-to-b from-error-500 to-error-700 text-white shadow-[0_8px_24px_-10px_rgb(239,68,68,0.6)] hover:from-error-600 hover:to-error-700",
        link: "text-primary-600 underline-offset-4 hover:underline",
        soft: "bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-200 dark:hover:bg-primary-900/50",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
