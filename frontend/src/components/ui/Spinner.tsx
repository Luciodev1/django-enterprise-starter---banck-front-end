import { cn } from "@/lib/utils";
import { Loader2, Inbox, type LucideIcon } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };
  return <Loader2 className={cn("animate-spin text-primary-600", sizes[size], className)} />;
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Carregando...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-14", className)}>
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Sem dados",
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-4 py-14 text-center", className)}>
      {icon !== null && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          {icon ?? <Inbox className="h-6 w-6" />}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
