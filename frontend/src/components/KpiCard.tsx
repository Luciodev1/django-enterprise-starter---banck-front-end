import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  className?: string;
  gradient?: "primary" | "success" | "warning" | "info" | "error";
}

const gradients = {
  primary: "from-primary-500/10 to-indigo-500/0 text-primary-600",
  success: "from-success-500/10 to-emerald-500/0 text-success-600",
  warning: "from-warning-500/10 to-amber-500/0 text-warning-600",
  info: "from-info-500/10 to-sky-500/0 text-info-600",
  error: "from-error-500/10 to-rose-500/0 text-error-600",
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
  gradient = "primary",
}: KpiCardProps) {
  const positive = trend !== undefined && trend.value >= 0;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgb(15_23_42/0.15)]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          gradients[gradient]
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl tabular-nums">
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border",
              gradients[gradient].split(" ").pop()
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="relative mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold",
              positive
                ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-200"
                : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-200"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {trend.value}%
          </span>
          {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
