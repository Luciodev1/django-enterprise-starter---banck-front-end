"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/AuthContext";
import { Shield, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const passwordSchema = z.object({
  current_password: z.string().min(1, "Senha atual é obrigatória"),
  new_password: z.string().min(8, "Mínimo de 8 caracteres"),
  confirm_password: z.string().min(1, "Confirmação é obrigatória"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Senhas não conferem",
  path: ["confirm_password"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (_data: PasswordForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Configurações</h1>
        <p className="text-sm text-secondary-500">Gerencie suas preferências</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert variant="success" className="mb-4">
              <p>Senha alterada com sucesso!</p>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="current_password"
              label="Senha Atual"
              type="password"
              error={errors.current_password?.message}
              {...register("current_password")}
            />
            <Input
              id="new_password"
              label="Nova Senha"
              type="password"
              error={errors.new_password?.message}
              {...register("new_password")}
            />
            <Input
              id="confirm_password"
              label="Confirmar Nova Senha"
              type="password"
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />
            <div className="flex justify-end">
              <Button type="submit">Alterar Senha</Button>
            </div>
          </form>
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
              <p className="font-medium">Autenticação de Dois Fatores</p>
              <p className="text-sm text-secondary-500">Adicione uma camada extra de segurança</p>
            </div>
            <Badge variant="secondary">Em breve</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sessões Ativas</p>
              <p className="text-sm text-secondary-500">Gerencie seus dispositivos conectados</p>
            </div>
            <Badge variant="secondary">Em breve</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
