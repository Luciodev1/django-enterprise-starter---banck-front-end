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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/PageHeader";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useChangeUserRole,
  useToggleUserActive,
} from "@/hooks/queries";
import type { User } from "@/types/auth";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Users as UsersIcon,
  Filter,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { cn, getApiErrorMessage } from "@/lib/utils";

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
      return "info" as const;
    default:
      return "secondary" as const;
  }
};

function getInitials(u: User) {
  const f = (u.first_name?.[0] || u.email[0] || "?").toUpperCase();
  const l = (u.last_name?.[0] || "").toUpperCase();
  return `${f}${l}`;
}

function avatarGradient(u: User) {
  const palette = [
    "from-primary-500 to-indigo-600",
    "from-sky-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
  ];
  const idx = (u.id.charCodeAt(0) + (u.id.charCodeAt(1) || 0)) % palette.length;
  return palette[idx];
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const pageSize = 10;

  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
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
      setAlert({ type: "success", message: "Utilizador criado com sucesso" });
      setCreateOpen(false);
      createForm.reset();
    } catch (err: unknown) {
      setAlert({ type: "error", message: getApiErrorMessage(err, "Erro ao criar utilizador") });
    }
  };

  const onEdit = (user: User) => {
    setEditing(user);
    editForm.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
      role: user.role as EditForm["role"],
      is_active: user.is_active,
    });
  };

  const onUpdate = async (values: EditForm) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, payload: values });
      setAlert({ type: "success", message: "Utilizador atualizado" });
      setEditing(null);
    } catch (err: unknown) {
      setAlert({ type: "error", message: getApiErrorMessage(err, "Erro ao atualizar") });
    }
  };

  const onDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      setAlert({ type: "success", message: "Utilizador removido" });
      setDeleting(null);
    } catch (err: unknown) {
      setAlert({ type: "error", message: getApiErrorMessage(err, "Erro ao remover") });
    }
  };

  const onToggleActive = async (user: User) => {
    try {
      await activeMutation.mutateAsync({ id: user.id, active: !user.is_active });
      setAlert({
        type: "success",
        message: user.is_active ? "Utilizador desativado" : "Utilizador ativado",
      });
    } catch {
      setAlert({ type: "error", message: "Erro ao alterar status" });
    }
  };

  const onChangeRole = async (user: User, role: string) => {
    try {
      await roleMutation.mutateAsync({ id: user.id, role });
      setAlert({ type: "success", message: `Role alterada para ${role}` });
    } catch {
      setAlert({ type: "error", message: "Erro ao alterar role" });
    }
  };

  const users = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
  const activeFilters = [search, roleFilter, activeFilter].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilizadores"
        description="Gerencie contas, roles e permissões"
        icon={UsersIcon}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo utilizador
          </Button>
        }
      />

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-primary-600" />
              Lista de utilizadores
              {data && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.count.toLocaleString("pt-BR")})
                </span>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen((o) => !o)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFilters > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("grid gap-3", filtersOpen ? "grid-cols-1" : "hidden lg:grid lg:grid-cols-3")}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            <LoadingState message="Carregando utilizadores..." />
          ) : isError ? (
            <Alert variant="error">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>{(error as { message?: string })?.message || "Erro ao carregar utilizadores"}</span>
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  Tentar de novo
                </Button>
              </AlertDescription>
            </Alert>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<UsersIcon className="h-6 w-6" />}
              title="Nenhum utilizador encontrado"
              description="Crie um novo utilizador ou ajuste os filtros de pesquisa"
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Criar primeiro utilizador
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilizador</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                              avatarGradient(u)
                            )}
                          >
                            {getInitials(u)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {u.first_name || u.last_name
                                ? `${u.first_name} ${u.last_name}`.trim()
                                : "—"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground md:hidden">
                              {u.email}
                            </p>
                            <p className="hidden text-xs text-muted-foreground md:block">
                              {u.is_verified ? "✓ Verificado" : "Não verificado"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-secondary-700 md:table-cell">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleVariant(u.role)} className="capitalize">
                          {u.role}
                        </Badge>
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
                            size="icon-sm"
                            onClick={() => onEdit(u)}
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onToggleActive(u)}
                            title={u.is_active ? "Desativar" : "Ativar"}
                            aria-label={u.is_active ? "Desativar" : "Ativar"}
                          >
                            {u.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleting(u)}
                            title="Excluir"
                            aria-label="Excluir"
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

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                total={data?.count}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Drawer: Criar utilizador */}
      <Drawer
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo utilizador"
        description="Adicione um novo membro à plataforma"
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
              Criar utilizador
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreate)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              id="first_name"
              label="Nome"
              leftIcon={<UserIcon className="h-4 w-4" />}
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
            leftIcon={<Mail className="h-4 w-4" />}
            error={createForm.formState.errors.email?.message}
            {...createForm.register("email")}
          />
          <Input
            id="phone"
            label="Telefone"
            placeholder="+55 (11) 99999-9999"
            leftIcon={<Phone className="h-4 w-4" />}
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
            leftIcon={<Shield className="h-4 w-4" />}
            error={createForm.formState.errors.password?.message}
            {...createForm.register("password")}
          />
          <Input
            id="password_confirm"
            label="Confirmar senha"
            type="password"
            error={createForm.formState.errors.password_confirm?.message}
            {...createForm.register("password_confirm")}
          />
        </form>
      </Drawer>

      {/* Drawer: Editar utilizador */}
      <Drawer
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={`Editar ${editing?.email || ""}`}
        description="Atualize as informações do utilizador"
        width="w-full sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={editForm.handleSubmit(onUpdate)} loading={updateMutation.isPending}>
              Salvar alterações
            </Button>
          </>
        }
      >
        {editing && (
          <form className="space-y-4" onSubmit={editForm.handleSubmit(onUpdate)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="edit_first_name"
                label="Nome"
                leftIcon={<UserIcon className="h-4 w-4" />}
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
              leftIcon={<Phone className="h-4 w-4" />}
              {...editForm.register("phone")}
            />
            <Select
              id="edit_role"
              label="Role"
              options={ROLES}
              error={editForm.formState.errors.role?.message}
              {...editForm.register("role")}
            />
            <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <input
                id="edit_is_active"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary-600 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                {...editForm.register("is_active")}
              />
              <span className="font-medium text-foreground">Utilizador ativo</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Pode aceder à plataforma
              </span>
            </label>
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary-600" />
                Ações rápidas
              </p>
              <div className="flex flex-wrap gap-2">
                {ROLES.filter((r) => r.value !== editing.role).map((r) => (
                  <Button
                    key={r.value}
                    variant="soft"
                    size="sm"
                    onClick={() => onChangeRole(editing, r.value)}
                    disabled={roleMutation.isPending}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        )}
      </Drawer>

      {/* Modal: Confirmar exclusão */}
      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Confirmar exclusão"
        description="Esta ação é irreversível"
      >
        <div className="flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-200">
          <Trash2 className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Tem certeza que pretende remover o utilizador{" "}
            <strong className="font-semibold">{deleting?.email}</strong>?
          </p>
        </div>
        <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} loading={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4" />
            Excluir definitivamente
          </Button>
        </div>
      </Modal>
    </div>
  );
}
