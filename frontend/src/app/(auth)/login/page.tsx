"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiErrorMessage } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Credenciais inválidas"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sessão" subtitle="Aceda à sua conta">
      {error && (
        <Alert variant="error" className="mb-4" onClose={() => setError("")}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nome@empresa.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-foreground/90">
              Senha
            </label>
            <Link
              href="/reset-password"
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Esqueceu?
            </Link>
          </div>
          <Input
            id="password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="pointer-events-auto text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
