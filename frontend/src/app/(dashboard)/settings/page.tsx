"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/PageHeader";
import { authService } from "@/services/auth";
import { useMe, useUnreadCount, useHealth, useMyNotifications } from "@/hooks/queries";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Shield,
  Mail,
  Bell,
  Server,
  Activity,
  CheckCircle2,
  Lock,
  LogOut,
  XCircle,
  KeyRound,
  Database,
  Cpu,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        ok
          ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-200"
          : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-200"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ok ? "bg-success-500 shadow-[0_0_6px_rgb(16,185,129,0.8)]" : "bg-error-500"
        )}
      />
      {label}
    </span>
  );
}

export default function SettingsPage() {
  const { data: me } = useMe();
  const { data: unread } = useUnreadCount();
  const { data: health } = useHealth();
  const { data: notifData } = useMyNotifications({ page: 1, page_size: 3 });
  const { logout } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const requestVerification = async () => {
    setVerifying(true);
    setVerifyMsg(null);
    try {
      await authService.requestEmailVerification();
      setVerifyMsg({ type: "success", text: "Enviámos um email de verificação para a sua caixa de entrada." });
    } catch (err: unknown) {
      setVerifyMsg({ type: "error", text: getApiErrorMessage(err, "Erro ao solicitar verificação") });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        title="Configurações"
        description="Segurança, conta e diagnóstico do sistema"
        icon={Shield}
      />

      {verifyMsg && (
        <Alert variant={verifyMsg.type} onClose={() => setVerifyMsg(null)}>
          <AlertDescription>
            {verifyMsg.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary-600" />
            Verificação de email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">{me?.email}</p>
              <p className="text-sm text-muted-foreground">Status da verificação do email</p>
            </div>
            {me?.is_verified ? (
              <Badge variant="success" className="gap-1 px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3" /> Verificado
              </Badge>
            ) : (
              <Button size="sm" onClick={requestVerification} loading={verifying}>
                Solicitar verificação
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary-600" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                <Inbox className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">Caixa de entrada</p>
                <p className="text-sm text-muted-foreground">Notificações pendentes na sua conta</p>
              </div>
            </div>
            <Badge variant={unread && unread > 0 ? "warning" : "secondary"} className="px-2.5 py-1">
              {unread ?? 0} não lidas
            </Badge>
          </div>

          {notifData?.results && notifData.results.length > 0 && (
            <ul className="divide-y divide-border/60 rounded-lg border border-border">
              {notifData.results.map((n) => (
                <li key={n.id} className={cn("flex items-start gap-3 px-3 py-2.5", !n.read_at && "bg-primary-50/30 dark:bg-primary-900/10")}>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm truncate", !n.read_at ? "font-semibold text-foreground" : "text-foreground/80")}>
                      {n.subject}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.read_at && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/dashboard/notifications"
            className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            Ver todas as notificações
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-600" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                <KeyRound className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">Autenticação Multifator (MFA)</p>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
            </div>
            <Badge variant={me?.is_mfa_enabled ? "success" : "secondary"}>
              {me?.is_mfa_enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-200">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">Sair de todos os dispositivos</p>
                <p className="text-sm text-muted-foreground">
                  Encerra a sessão atual e invalida o token
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <Lock className="h-4 w-4" />
              Terminar sessão
            </Button>
          </div>
        </CardContent>
      </Card>

      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary-600" />
              Estado do sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Status geral</span>
                </div>
                <StatusPill ok={health.status === "ok"} label={health.status} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Base de dados</span>
                </div>
                <StatusPill ok={health.database === "ok"} label={health.database} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Cache (Redis)</span>
                </div>
                <StatusPill ok={health.cache === "ok"} label={health.cache} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Versão</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{health.version}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
