import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "article";
}

export function Card({ className, children, as = "div" }: CardProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-card transition-shadow hover:shadow-[0_4px_12px_-2px_rgb(15_23_42/0.08)]",
        className
      )}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn("flex flex-col space-y-1 p-5 sm:p-6", className)}>{children}</div>
  );
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: CardProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}>
      {children}
    </div>
  );
}
