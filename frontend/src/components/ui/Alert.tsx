import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

const alertVariants = cva(
  cn(
    "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-4 [&>svg]:w-4",
    "flex items-start gap-2"
  ),
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        info: "border-info-200 bg-info-50 text-info-700 [&>svg]:text-info-600 dark:border-info-500/30 dark:bg-info-500/10 dark:text-info-200",
        success:
          "border-success-200 bg-success-50 text-success-700 [&>svg]:text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-200",
        warning:
          "border-warning-200 bg-warning-50 text-warning-700 [&>svg]:text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-200",
        error:
          "border-error-200 bg-error-50 text-error-700 [&>svg]:text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  onClose?: () => void;
  icon?: ReactNode;
}

export function Alert({ className, variant = "default", onClose, icon, children, ...props }: AlertProps) {
  const Icon =
    (variant && variant !== "default" ? icons[variant as keyof typeof icons] : undefined) ||
    (icon ? () => <>{icon}</> : undefined);
  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon />}
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="ml-auto -mr-1 -mt-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h5 className={cn("mb-1 font-semibold tracking-tight", className)}>{children}</h5>;
}

export function AlertDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)}>{children}</div>;
}
