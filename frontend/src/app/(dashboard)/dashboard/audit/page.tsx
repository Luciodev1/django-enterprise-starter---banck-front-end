"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { useAuditLogs, useAuditSummary } from "@/hooks/queries";
import { AlertCircle, History, Activity, Search } from "lucide-react";
import type { AuditLog } from "@/services/audit";

const ACTION_VARIANTS: Record<string, "default" | "success" | "warning" | "error" | "secondary"> = {
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

  const params = useMemo(
    () => ({
      page,
      page_size: 20,
      search: search || undefined,
      action: actionFilter || undefined,
    }),
    [page, search, actionFilter]
  );

  const { data, isLoading } = useAuditLogs(params);
  const { data: summary } = useAuditSummary();

  const logs = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 1;
  const actions = summary ? Object.keys(summary.by_action) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Auditoria</h1>
        <p className="text-sm text-secondary-500">Histórico de ações no sistema</p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-secondary-500">Total de eventos</p>
              <p className="text-2xl font-bold mt-1">{summary.total}</p>
            </CardContent>
          </Card>
          {Object.entries(summary.by_action)
            .slice(0, 3)
            .map(([action, count]) => (
              <Card key={action}>
                <CardContent className="p-4">
                  <p className="text-xs text-secondary-500">{action}</p>
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary-600" />
            Eventos
            {data && <span className="text-sm font-normal text-secondary-500">({data.count})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Buscar..."
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
              icon={<Activity className="h-12 w-12" />}
              title="Sem eventos"
              description="Nenhuma acção corresponde aos filtros"
            />
          ) : (
            <div className="space-y-2">
              {logs.map((log: AuditLog) => {
                const variant = ACTION_VARIANTS[log.action] || "secondary";
                return (
                  <div
                    key={log.id}
                    className="border rounded-lg p-3 hover:bg-secondary-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={variant}>{log.action}</Badge>
                          <span className="text-sm text-secondary-700">
                            <strong>{log.model_name}</strong>
                            {log.model_id && <span className="text-secondary-400"> #{log.model_id.slice(0, 8)}</span>}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">{log.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-secondary-500">
                          <span>{log.performed_by_email || "sistema"}</span>
                          <span>•</span>
                          <span>{formatDate(log.created_at)}</span>
                          {log.ip_address && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{log.ip_address}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
