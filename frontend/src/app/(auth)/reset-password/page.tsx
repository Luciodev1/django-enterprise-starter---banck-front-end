"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const resetSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (_data: ResetForm) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout title="Recuperar Senha" subtitle="Enviaremos um link para seu email">
      {sent ? (
        <div className="text-center space-y-4">
          <Alert variant="success">
            <p>Email enviado! Verifique sua caixa de entrada.</p>
          </Alert>
          <Link href="/login" className="text-sm text-primary-600 hover:underline block">
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
