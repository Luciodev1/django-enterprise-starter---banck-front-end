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
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/features/auth/AuthContext";
import { useMe, useUpdateProfile, useChangePassword } from "@/hooks/queries";
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  MailCheck,
  Lock,
  Building2,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";

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
    message: "As senhas não coincidem",
    path: ["new_password_confirm"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

function getInitials(first: string, last: string, email: string) {
  const f = (first?.[0] || email?.[0] || "?").toUpperCase();
  const l = (last?.[0] || "").toUpperCase();
  return `${f}${l}`;
}

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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao atualizar perfil"));
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao alterar senha"));
    }
  };

  if (isLoading) return <LoadingState message="Carregando perfil..." />;

  const initials = getInitials(me?.first_name || "", me?.last_name || "", me?.email || "");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        title="Perfil"
        description="Gerencie as suas informações pessoais e segurança"
        icon={User}
      />

      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="relative h-28 bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 app-grid-bg opacity-20" />
        </div>
        <CardContent className="-mt-12 flex flex-col items-center gap-4 p-5 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5 sm:p-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary-500 to-indigo-600 text-3xl font-bold text-white shadow-glow">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {me?.first_name} {me?.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">{me?.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="gradient" className="capitalize">
                {me?.role}
              </Badge>
              {me?.is_verified ? (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" /> Verificado
                </Badge>
              ) : (
                <Badge variant="warning">Não verificado</Badge>
              )}
              {me?.is_mfa_enabled && <Badge variant="info">MFA ativo</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

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
            <User className="h-4 w-4 text-primary-600" />
            Informações pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="first_name"
                label="Nome"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.first_name?.message}
                {...register("first_name")}
              />
              <Input
                id="last_name"
                label="Sobrenome"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/90">Email</label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground/80">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {me?.email || user?.email}
                {me?.is_verified && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-success-700">
                    <MailCheck className="h-3 w-3" />
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Para alterar o email contacte o administrador.
              </p>
            </div>
            <Input
              id="phone"
              label="Telefone"
              placeholder="+55 (11) 99999-9999"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="default" className="capitalize">
                  {me?.role || user?.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm sm:justify-end">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Membro desde</span>
                <span className="font-medium text-foreground">
                  {me?.created_at
                    ? new Date(me.created_at).toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={!isDirty} loading={updateProfile.isPending}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary-600" />
            Alterar senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              id="old_password"
              type="password"
              autoComplete="current-password"
              label="Senha atual"
              leftIcon={<Lock className="h-4 w-4" />}
              error={pwdErrors.old_password?.message}
              {...regPwd("old_password")}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="new_password"
                type="password"
                autoComplete="new-password"
                label="Nova senha"
                leftIcon={<Lock className="h-4 w-4" />}
                hint="Mínimo 8 caracteres"
                error={pwdErrors.new_password?.message}
                {...regPwd("new_password")}
              />
              <Input
                id="new_password_confirm"
                type="password"
                autoComplete="new-password"
                label="Confirmar nova senha"
                error={pwdErrors.new_password_confirm?.message}
                {...regPwd("new_password_confirm")}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={changePassword.isPending}>
                Alterar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
