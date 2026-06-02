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

const confirmSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    new_password: z.string().min(8, "Mínimo de 8 caracteres"),
    new_password_confirm: z.string(),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "Senhas não conferem",
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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Token inválido ou expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Redefinir Senha" subtitle="Defina uma nova senha para a sua conta">
      {success ? (
        <Alert variant="success">
          <AlertDescription>
            Senha redefinida com sucesso! A redirecionar para o login...
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            id="token"
            label="Token de recuperação"
            error={errors.token?.message}
            {...register("token")}
          />
          <Input
            id="new_password"
            type="password"
            label="Nova senha"
            error={errors.new_password?.message}
            {...register("new_password")}
          />
          <Input
            id="new_password_confirm"
            type="password"
            label="Confirmar nova senha"
            error={errors.new_password_confirm?.message}
            {...register("new_password_confirm")}
          />
          <Button type="submit" loading={loading} className="w-full">
            Redefinir Senha
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

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ResetConfirmInner />
    </Suspense>
  );
}
