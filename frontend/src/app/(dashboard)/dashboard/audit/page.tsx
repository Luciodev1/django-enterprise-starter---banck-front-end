"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { useAuditLogs, useAuditSummary } from "@/hooks/queries";
import {
  AlertCircle,
  History,
  Activity,
  Search,
  Database,
  Globe,
  User2,
  Clock,
} from "lucide-react";
import type { AuditLog } from "@/services/audit";
import { cn } from "@/lib/utils";

const ACTION_VARIANTS: Record<string, "default" | "success" | "warning" | "error" | "secondary" | "info"> = {
  create: "success",
  update: "default",
  delete: "error",
  login: "success",
  logout: "secondary",
  login_failed: "error",
  permission_change: "warning",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
};

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const pageSize = 15;
  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: search || undefined,
      action: actionFilter || undefined,
    }),
    [page, search, actionFilter]
  );

  const { data, isLoading } = useAuditLogs(params);
  const { data: summary } = useAuditSummary();

  const logs = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
  const actions = summary ? Object.keys(summary.by_action) : [];
  const topActions = summary
    ? Object.entries(summary.by_action).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        description="Histórico completo de ações na plataforma"
        icon={History}
      />

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Eventos totais"
            value={summary.total}
            icon={Database}
            gradient="primary"
            hint="Desde o início"
          />
          {topActions.map(([action, count]) => (
            <KpiCard
              key={action}
              label={`Top: ${action}`}
              value={count}
              icon={Activity}
              gradient={ACTION_VARIANTS[action] === "error" ? "error" : ACTION_VARIANTS[action] === "warning" ? "warning" : "info"}
            />
          ))}
          {topActions.length < 3 && (
            <KpiCard
              label="Período ativo"
              value="30d"
              icon={Clock}
              gradient="info"
              hint="Janela de observação"
            />
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary-600" />
            Eventos
            {data && (
              <span className="text-sm font-normal text-muted-foreground">
                ({data.count.toLocaleString("pt-BR")})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição, modelo..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              options={[{ value: "", label: "Todas as ações" }, ...actions.map((a) => ({ value: a, label: a }))]}
            />
          </div>

          {isLoading ? (
            <LoadingState message="Carregando auditoria..." />
          ) : logs.length === 0 ? (
            <EmptyState
              icon={<Activity className="h-6 w-6" />}
              title="Sem eventos"
              description="Nenhuma ação corresponde aos filtros atuais"
            />
          ) : (
            <ol className="relative space-y-3 border-l border-border/60 pl-6 sm:pl-7">
              {logs.map((log: AuditLog) => {
                const variant = ACTION_VARIANTS[log.action] || "secondary";
                return (
                  <li key={log.id} className="group relative">
                    <span
                      className={cn(
                        "absolute -left-[33px] sm:-left-[37px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-card",
                        variant === "success" && "bg-success-500",
                        variant === "error" && "bg-error-500",
                        variant === "warning" && "bg-warning-500",
                        variant === "info" && "bg-info-500",
                        variant === "default" && "bg-primary-500",
                        variant === "secondary" && "bg-secondary-400"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <div className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary-200 hover:bg-accent/30 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={variant} className="capitalize">
                              {log.action}
                            </Badge>
                            <span className="text-sm text-foreground">
                              <strong className="font-semibold">{log.model_name}</strong>
                              {log.model_id && (
                                <span className="text-muted-foreground">
                                  {" "}
                                  #{log.model_id.slice(0, 8)}
                                </span>
                              )}
                            </span>
                          </div>
                          {log.description && (
                            <p className="mt-1 text-sm text-muted-foreground">{log.description}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <User2 className="h-3 w-3" />
                              {log.performed_by_email || "sistema"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(log.created_at)}
                            </span>
                            {log.ip_address && (
                              <span className="inline-flex items-center gap-1 font-mono">
                                <Globe className="h-3 w-3" />
                                {log.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            total={data?.count}
          />
        </CardContent>
      </Card>
    </div>
  );
}
