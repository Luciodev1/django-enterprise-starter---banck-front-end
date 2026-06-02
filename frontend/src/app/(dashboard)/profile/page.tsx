"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/Spinner";
import { useAuth } from "@/features/auth/AuthContext";
import { useMe, useUpdateProfile, useChangePassword } from "@/hooks/queries";
import { User, Mail, Phone, Shield, KeyRound, CheckCircle2 } from "lucide-react";

const profileSchema = z.object({
  first_name: z.string().min(1, "Nome é obrigatório"),
  last_name: z.string().min(1, "Sobrenome é obrigatório"),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Senha atual obrigatória"),
    new_password: z.string().min(8, "Mínimo de 8 caracteres"),
    new_password_confirm: z.string(),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "Senhas não conferem",
    path: ["new_password_confirm"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: me, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (me) {
      reset({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        phone: me.phone || "",
      });
    }
  }, [me, reset]);

  const onProfileSubmit = async (data: ProfileForm) => {
    setError(null);
    setSuccess(null);
    try {
      await updateProfile.mutateAsync(data);
      setSuccess("Perfil atualizado com sucesso");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao atualizar perfil");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setError(null);
    setSuccess(null);
    try {
      await changePassword.mutateAsync(data);
      setSuccess("Senha alterada com sucesso");
      resetPwd();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao alterar senha");
    }
  };

  if (isLoading) return <LoadingState message="Carregando perfil..." />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Perfil</h1>
        <p className="text-sm text-secondary-500">Gerencie suas informações pessoais</p>
      </div>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          <AlertDescription className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> {success}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="first_name" label="Nome" error={errors.first_name?.message} {...register("first_name")} />
              <Input id="last_name" label="Sobrenome" error={errors.last_name?.message} {...register("last_name")} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Email</label>
              <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-secondary-50 text-sm text-secondary-700">
                <Mail className="h-4 w-4" />
                {me?.email || user?.email}
              </div>
            </div>
            <Input
              id="phone"
              label="Telefone"
              placeholder="+55 (11) 99999-9999"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className="text-secondary-500">Role:</span>
                <Badge variant="default">{me?.role || user?.role}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                {me?.is_verified ? (
                  <Badge variant="success">Verificado</Badge>
                ) : (
                  <Badge variant="warning">Não verificado</Badge>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty} loading={updateProfile.isPending}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary-600" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              id="old_password"
              type="password"
              label="Senha atual"
              error={pwdErrors.old_password?.message}
              {...regPwd("old_password")}
            />
            <Input
              id="new_password"
              type="password"
              label="Nova senha"
              error={pwdErrors.new_password?.message}
              {...regPwd("new_password")}
            />
            <Input
              id="new_password_confirm"
              type="password"
              label="Confirmar nova senha"
              error={pwdErrors.new_password_confirm?.message}
              {...regPwd("new_password_confirm")}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={changePassword.isPending}>
                Alterar Senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
