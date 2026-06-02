import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200",
        secondary:
          "border-transparent bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200",
        success:
          "border-transparent bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-200",
        warning:
          "border-transparent bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-200",
        error:
          "border-transparent bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-200",
        info: "border-transparent bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-200",
        outline: "border-border text-foreground",
        gradient:
          "border-transparent bg-gradient-to-r from-primary-500 to-indigo-500 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
