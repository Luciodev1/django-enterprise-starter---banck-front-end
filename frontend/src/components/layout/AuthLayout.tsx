import { Building2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary-600 text-white mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
          {subtitle && <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-xl shadow-card p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
