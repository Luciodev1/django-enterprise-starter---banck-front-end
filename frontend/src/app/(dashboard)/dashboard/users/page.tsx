"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useChangeUserRole,
  useToggleUserActive,
} from "@/hooks/queries";
import type { User } from "@/types/auth";
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Shield, Users as UsersIcon } from "lucide-react";

const ROLES = [
  { value: "superadmin", label: "SuperAdmin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "operator", label: "Operator" },
  { value: "client", label: "Client" },
];

const createSchema = z
  .object({
    email: z.string().email("Email inválido"),
    first_name: z.string().min(1, "Nome obrigatório"),
    last_name: z.string().min(1, "Sobrenome obrigatório"),
    phone: z.string().optional(),
    role: z.enum(["superadmin", "admin", "manager", "operator", "client"]),
    is_active: z.boolean().default(true),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Senhas não conferem",
    path: ["password_confirm"],
  });

const editSchema = z.object({
  first_name: z.string().min(1, "Nome obrigatório"),
  last_name: z.string().min(1, "Sobrenome obrigatório"),
  phone: z.string().optional(),
  role: z.enum(["superadmin", "admin", "manager", "operator", "client"]),
  is_active: z.boolean(),
});

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;

const roleVariant = (role: string) => {
  switch (role) {
    case "superadmin":
      return "error" as const;
    case "admin":
      return "warning" as const;
    case "manager":
      return "default" as const;
    case "operator":
      return "default" as const;
    default:
      return "secondary" as const;
  }
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const params = useMemo(
    () => ({
      page,
      page_size: 15,
      search: search || undefined,
      role: roleFilter || undefined,
      is_active: activeFilter === "true" ? true : activeFilter === "false" ? false : undefined,
    }),
    [page, search, roleFilter, activeFilter]
  );

  const { data, isLoading, isError, error, refetch } = useUsers(params);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const roleMutation = useChangeUserRole();
  const activeMutation = useToggleUserActive();

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: "client", is_active: true },
  });

  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  });

  const onCreate = async (values: CreateForm) => {
    try {
      await createMutation.mutateAsync(values);
      setAlert({ type: "success", message: "Usuário criado com sucesso" });
      setCreateOpen(false);
      createForm.reset();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao criar usuário";
      setAlert({ type: "error", message: msg });
    }
  };

  const onEdit = (user: User) => {
    setEditing(user);
    editForm.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
      role: user.role as any,
      is_active: user.is_active,
    });
  };

  const onUpdate = async (values: EditForm) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, payload: values });
      setAlert({ type: "success", message: "Usuário atualizado" });
      setEditing(null);
    } catch (err: any) {
      setAlert({ type: "error", message: err?.response?.data?.message || "Erro ao atualizar" });
    }
  };

  const onDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      setAlert({ type: "success", message: "Usuário removido" });
      setDeleting(null);
    } catch (err: any) {
      setAlert({ type: "error", message: err?.response?.data?.message || "Erro ao remover" });
    }
  };

  const onToggleActive = async (user: User) => {
    try {
      await activeMutation.mutateAsync({ id: user.id, active: !user.is_active });
      setAlert({
        type: "success",
        message: user.is_active ? "Usuário desativado" : "Usuário ativado",
      });
    } catch (err: any) {
      setAlert({ type: "error", message: "Erro ao alterar status" });
    }
  };

  const onChangeRole = async (user: User, role: string) => {
    try {
      await roleMutation.mutateAsync({ id: user.id, role });
      setAlert({ type: "success", message: `Role alterada para ${role}` });
    } catch (err: any) {
      setAlert({ type: "error", message: "Erro ao alterar role" });
    }
  };

  const users = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / (params.page_size || 15)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Usuários</h1>
          <p className="text-sm text-secondary-500">Gerencie usuários, roles e permissões</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.type === "success" ? "success" : "error"} onClose={() => setAlert(null)}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary-600" />
            Lista de Usuários
            {data && <span className="text-sm font-normal text-secondary-500">({data.count})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Buscar por nome, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              options={[{ value: "", label: "Todas as roles" }, ...ROLES]}
              placeholder="Role"
            />
            <Select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "Todos os status" },
                { value: "true", label: "Ativos" },
                { value: "false", label: "Inativos" },
              ]}
              placeholder="Status"
            />
          </div>

          {isLoading ? (
            <LoadingState message="Carregando usuários..." />
          ) : isError ? (
            <Alert variant="error">
              <AlertDescription>{(error as any)?.message || "Erro ao carregar usuários"}</AlertDescription>
            </Alert>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<UsersIcon className="h-12 w-12" />}
              title="Nenhum usuário encontrado"
              description="Crie um novo usuário ou ajuste os filtros"
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Criar primeiro usuário
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-semibold">
                            {u.first_name?.[0] || u.email[0].toUpperCase()}
                            {u.last_name?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">
                              {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : "—"}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {u.is_verified ? "Verificado" : "Não verificado"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-secondary-700">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleVariant(u.role)}>{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {u.is_active ? (
                          <Badge variant="success">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(u)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleActive(u)}
                            title={u.is_active ? "Desativar" : "Ativar"}
                          >
                            {u.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleting(u)}
                            title="Excluir"
                            className="text-error-500 hover:text-error-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Drawer: Criar usuário */}
      <Drawer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo Usuário"
        description="Crie um novo usuário no sistema"
        width="w-full sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={createForm.handleSubmit(onCreate)}
              loading={createMutation.isPending}
            >
              Criar Usuário
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreate)}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="first_name"
              label="Nome"
              error={createForm.formState.errors.first_name?.message}
              {...createForm.register("first_name")}
            />
            <Input
              id="last_name"
              label="Sobrenome"
              error={createForm.formState.errors.last_name?.message}
              {...createForm.register("last_name")}
            />
          </div>
          <Input
            id="email"
            label="Email"
            type="email"
            error={createForm.formState.errors.email?.message}
            {...createForm.register("email")}
          />
          <Input
            id="phone"
            label="Telefone"
            placeholder="+55 (11) 99999-9999"
            error={createForm.formState.errors.phone?.message}
            {...createForm.register("phone")}
          />
          <Select
            id="role"
            label="Role"
            options={ROLES}
            error={createForm.formState.errors.role?.message}
            {...createForm.register("role")}
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            error={createForm.formState.errors.password?.message}
            {...createForm.register("password")}
          />
          <Input
            id="password_confirm"
            label="Confirmar Senha"
            type="password"
            error={createForm.formState.errors.password_confirm?.message}
            {...createForm.register("password_confirm")}
          />
        </form>
      </Drawer>

      {/* Drawer: Editar usuário */}
      <Drawer
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={`Editar: ${editing?.email || ""}`}
        description="Atualize as informações do usuário"
        width="w-full sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={editForm.handleSubmit(onUpdate)} loading={updateMutation.isPending}>
              Salvar Alterações
            </Button>
          </>
        }
      >
        {editing && (
          <form className="space-y-4" onSubmit={editForm.handleSubmit(onUpdate)}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="edit_first_name"
                label="Nome"
                error={editForm.formState.errors.first_name?.message}
                {...editForm.register("first_name")}
              />
              <Input
                id="edit_last_name"
                label="Sobrenome"
                error={editForm.formState.errors.last_name?.message}
                {...editForm.register("last_name")}
              />
            </div>
            <Input
              id="edit_phone"
              label="Telefone"
              {...editForm.register("phone")}
            />
            <Select
              id="edit_role"
              label="Role"
              options={ROLES}
              error={editForm.formState.errors.role?.message}
              {...editForm.register("role")}
            />
            <div className="flex items-center gap-2">
              <input
                id="edit_is_active"
                type="checkbox"
                {...editForm.register("is_active")}
                className="h-4 w-4 rounded border-input"
              />
              <label htmlFor="edit_is_active" className="text-sm font-medium text-secondary-700">
                Usuário ativo
              </label>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-secondary-700 mb-2 flex items-center gap-1">
                <Shield className="h-4 w-4" /> Ações rápidas
              </p>
              <div className="flex flex-wrap gap-2">
                {ROLES.filter((r) => r.value !== editing.role).map((r) => (
                  <Button
                    key={r.value}
                    variant="outline"
                    size="sm"
                    onClick={() => onChangeRole(editing, r.value)}
                    disabled={roleMutation.isPending}
                  >
                    → {r.label}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        )}
      </Drawer>

      {/* Modal: Confirm delete */}
      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Confirmar exclusão"
      >
        <p className="text-sm text-secondary-700">
          Tem certeza que deseja remover o usuário <strong>{deleting?.email}</strong>? Esta ação não pode
          ser desfeita.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} loading={deleteMutation.isPending}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
