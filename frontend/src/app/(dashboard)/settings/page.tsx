"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/services/auth";
import { useMe, useUnreadCount } from "@/hooks/queries";
import { useAuth } from "@/features/auth/AuthContext";
import { useHealth } from "@/hooks/queries";
import { Shield, Mail, Bell, Server, Activity, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { data: me } = useMe();
  const { data: unread } = useUnreadCount();
  const { data: health } = useHealth();
  const { logout } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tokenDisplay, setTokenDisplay] = useState<string | null>(null);

  const requestVerification = async () => {
    setVerifying(true);
    setVerifyMsg(null);
    try {
      const result = await authService.requestEmailVerification();
      setTokenDisplay(result.token);
      setVerifyMsg({ type: "success", text: "Token emitido. Em produção, enviado por email." });
    } catch (err: any) {
      setVerifyMsg({ type: "error", text: err?.response?.data?.message || "Erro ao solicitar verificação" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Configurações</h1>
        <p className="text-sm text-secondary-500">Segurança, conta e notificações</p>
      </div>

      {verifyMsg && (
        <Alert variant={verifyMsg.type} onClose={() => setVerifyMsg(null)}>
          <AlertDescription>
            {verifyMsg.text}
            {tokenDisplay && (
              <div className="mt-2 p-2 bg-secondary-50 rounded text-xs font-mono break-all">
                Token: {tokenDisplay}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-600" />
            Verificação de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{me?.email}</p>
              <p className="text-sm text-secondary-500">Status da verificação do email</p>
            </div>
            {me?.is_verified ? (
              <Badge variant="success" className="flex items-center gap-1">
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
            <Bell className="h-5 w-5 text-primary-600" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Não lidas</p>
              <p className="text-sm text-secondary-500">Notificações pendentes na sua conta</p>
            </div>
            <Badge variant={unread && unread > 0 ? "warning" : "secondary"}>{unread ?? 0}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autenticação Multifator (MFA)</p>
              <p className="text-sm text-secondary-500">Adicione uma camada extra de segurança</p>
            </div>
            <Badge variant={me?.is_mfa_enabled ? "success" : "secondary"}>
              {me?.is_mfa_enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="font-medium">Sair de todos os dispositivos</p>
              <p className="text-sm text-secondary-500">Encerra a sessão actual e invalida o token</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Terminar sessão
            </Button>
          </div>
        </CardContent>
      </Card>

      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary-600" />
              Estado do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Status geral
              </span>
              <Badge variant={health.status === "ok" ? "success" : "warning"}>{health.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Base de dados</span>
              <Badge variant={health.database === "ok" ? "success" : "error"}>{health.database}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Cache (Redis)</span>
              <Badge variant={health.cache === "ok" ? "success" : "error"}>{health.cache}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-secondary-500">
              <span>Versão</span>
              <span className="font-mono text-xs">{health.version}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
