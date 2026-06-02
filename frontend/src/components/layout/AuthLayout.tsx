import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="auth-bg flex min-h-screen w-full items-center justify-center p-4">
      <div className={cn("w-full max-w-sm", className)}>
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="surface-card mt-5 p-6">{children}</div>
      </div>
    </div>
  );
}
