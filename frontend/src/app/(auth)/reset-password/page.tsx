"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { authService } from "@/services/auth";

const resetSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.requestPasswordReset(data.email);
      setToken(result.token);
      setSent(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível enviar o email. Verifique o endereço e tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Recuperar Senha" subtitle="Enviaremos um link para seu email">
      {sent ? (
        <div className="text-center space-y-4">
          <Alert variant="success">
            <AlertDescription>
              Se o email existir em nossa base, um link de recuperação foi enviado.
              {token && (
                <span className="block mt-2 p-2 bg-secondary-50 rounded text-xs font-mono break-all">
                  Token (dev): {token}
                </span>
              )}
            </AlertDescription>
          </Alert>
          <Link
            href={token ? `/reset-password/confirm?token=${token}` : "/login"}
            className="text-sm text-primary-600 hover:underline block"
          >
            {token ? "Redefinir senha agora →" : "Voltar ao login"}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" loading={loading} className="w-full">
            Enviar Link
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-primary-600 hover:underline">
              Voltar ao login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
