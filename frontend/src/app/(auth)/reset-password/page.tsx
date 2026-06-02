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
import { getApiErrorMessage } from "@/lib/utils";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Não foi possível enviar o email. Verifique o endereço e tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar acesso"
      subtitle="Enviaremos um link seguro para redefinir a sua senha."
    >
      {sent ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Alert variant="success">
            <AlertDescription>
              Se o email existir em nossa base, um link de recuperação foi enviado.
              {token && (
                <span className="mt-2 block break-all rounded-md bg-secondary-100 p-2 font-mono text-[11px] text-secondary-800">
                  Token (dev): {token}
                </span>
              )}
            </AlertDescription>
          </Alert>
          <Link
            href={token ? `/reset-password/confirm?token=${token}` : "/login"}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-700"
          >
            {token ? "Redefinir senha agora" : "Voltar ao login"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? "A enviar..." : "Enviar link de recuperação"}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
