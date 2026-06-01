import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-500",
        success: "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-500",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-500",
        error: "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
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
}

export function Alert({ className, variant, onClose, children, ...props }: AlertProps) {
  const Icon = variant ? icons[variant as keyof typeof icons] : undefined;
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {Icon && <Icon className="h-4 w-4" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>{children}</h5>;
}

export function AlertDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)}>{children}</div>;
}
