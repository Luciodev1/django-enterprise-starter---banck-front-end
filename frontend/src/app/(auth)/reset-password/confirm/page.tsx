"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { authService } from "@/services/auth";
import { getApiErrorMessage } from "@/lib/utils";
import { Lock, KeyRound, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

const confirmSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    new_password: z.string().min(8, "Mínimo de 8 caracteres"),
    new_password_confirm: z.string(),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "As senhas não coincidem",
    path: ["new_password_confirm"],
  });

type ConfirmForm = z.infer<typeof confirmSchema>;

function ResetConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { token: tokenFromUrl },
  });

  const onSubmit = async (data: ConfirmForm) => {
    setLoading(true);
    setError(null);
    try {
      await authService.confirmPasswordReset({
        token: data.token,
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Token inválido ou expirado"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Definir nova senha"
      subtitle="Escolha uma senha forte com pelo menos 8 caracteres."
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Alert variant="success">
            <AlertDescription>
              Senha redefinida com sucesso! A redirecionar para o login...
            </AlertDescription>
          </Alert>
          <Link
            href="/login"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-700"
          >
            Ir para o login
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
            id="token"
            label="Token de recuperação"
            placeholder="Cole o token recebido por email"
            leftIcon={<KeyRound className="h-4 w-4" />}
            error={errors.token?.message}
            {...register("token")}
          />

          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            label="Nova senha"
            placeholder="Mínimo 8 caracteres"
            leftIcon={<Lock className="h-4 w-4" />}
            hint="Use letras maiúsculas, minúsculas, números e símbolos."
            error={errors.new_password?.message}
            {...register("new_password")}
          />

          <Input
            id="new_password_confirm"
            type="password"
            autoComplete="new-password"
            label="Confirmar nova senha"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.new_password_confirm?.message}
            {...register("new_password_confirm")}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? "A redefinir..." : "Redefinir senha"}
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

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ResetConfirmInner />
    </Suspense>
  );
}
