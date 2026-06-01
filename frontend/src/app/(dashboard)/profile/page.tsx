"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/features/auth/AuthContext";
import { User } from "lucide-react";
import { useState } from "react";

const profileSchema = z.object({
  first_name: z.string().min(1, "Nome é obrigatório"),
  last_name: z.string().min(1, "Sobrenome é obrigatório"),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (_data: ProfileForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Perfil</h1>
        <p className="text-sm text-secondary-500">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert variant="success" className="mb-4">
              <p>Perfil atualizado com sucesso!</p>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="first_name"
                label="Nome"
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
            <Input
              id="email"
              label="Email"
              value={user?.email || ""}
              disabled
            />
            <Input
              id="phone"
              label="Telefone"
              placeholder="+55 (11) 99999-9999"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <div className="flex justify-end">
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
