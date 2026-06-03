"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { authService } from "@/services/auth";
import { getApiErrorMessage } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!token) {
      setState("error");
      setError("Token de verificação não encontrado na URL.");
      return;
    }
    try {
      await authService.confirmEmailVerification(token);
      setState("success");
    } catch (err: unknown) {
      setState("error");
      setError(getApiErrorMessage(err, "Token inválido ou expirado"));
    }
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <AuthLayout
      title="Verificação de email"
      subtitle={state === "loading" ? "A verificar o seu email..." : undefined}
    >
      {state === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          <p className="text-sm text-muted-foreground">A verificar o seu email...</p>
        </div>
      )}

      {state === "success" && (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Alert variant="success">
            <AlertDescription>
              Email verificado com sucesso! A redirecionar para o painel...
            </AlertDescription>
          </Alert>
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-700"
          >
            Ir para o painel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {state === "error" && (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-600">
            <XCircle className="h-7 w-7" />
          </div>
          <Alert variant="error">
            <AlertDescription>
              {error || "Não foi possível verificar o email."}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/settings")} variant="outline" className="w-full">
              Reenviar verificação
            </Button>
            <Link
              href="/login"
              className="block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
