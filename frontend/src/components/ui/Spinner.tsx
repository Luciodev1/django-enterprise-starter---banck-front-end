import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      <Spinner size="lg" />
      <p className="text-sm text-secondary-500">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title = "Sem dados", description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon && <div className="text-secondary-400">{icon}</div>}
      <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
      {description && <p className="text-sm text-secondary-500 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
