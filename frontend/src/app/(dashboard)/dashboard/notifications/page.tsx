"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { PageHeader } from "@/components/PageHeader";
import {
  useMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries";
import {
  Bell,
  Check,
  CheckCheck,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
  Inbox,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import type { Notification } from "@/services/notifications";
import { cn } from "@/lib/utils";

const channelConfig = {
  email: { icon: Mail, label: "Email", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200" },
  sms: { icon: MessageSquare, label: "SMS", color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200" },
  whatsapp: { icon: MessageSquare, label: "WhatsApp", color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200" },
  push: { icon: Monitor, label: "Push", color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200" },
} as const;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const pageSize = 12;
  const params = { page, page_size: pageSize };
  const { data, isLoading, isError, error } = useMyNotifications(params);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.results ?? [];
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read_at) : notifications;
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;
  const totalUnread = data?.results?.filter((n) => !n.read_at).length ?? 0;

  if (isLoading) return <LoadingState message="A carregar notificações..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Central de mensagens e alertas do sistema"
        icon={Bell}
        actions={
          <Button
            variant="outline"
            onClick={() => markAll.mutate()}
            loading={markAll.isPending}
            disabled={totalUnread === 0}
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Marcar todas como lidas</span>
            <span className="sm:hidden">Marcar todas</span>
          </Button>
        }
      />

      {isError && (
        <Alert variant="error">
          <AlertDescription>
            {(error as { message?: string })?.message || "Erro ao carregar"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-primary-600" />
              Caixa de entrada
              {data && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.count.toLocaleString("pt-BR")})
                </span>
              )}
              {totalUnread > 0 && (
                <Badge variant="default" className="ml-1">
                  {totalUnread} nova{totalUnread > 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1 self-start rounded-lg border border-border bg-muted/40 p-0.5 sm:self-auto">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === "all"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === "unread"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Não lidas
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-6 w-6" />}
              title={filter === "unread" ? "Nenhuma não lida" : "Sem notificações"}
              description={
                filter === "unread" ? "Você está em dia!" : "Novas notificações aparecerão aqui"
              }
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const cfg = channelConfig[n.channel];
                const Icon = cfg.icon;
                const isUnread = !n.read_at;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border p-4 transition-all",
                      isUnread
                        ? "border-primary-200 bg-primary-50/40 shadow-sm dark:border-primary-800 dark:bg-primary-950/20"
                        : "border-border bg-card hover:border-border/80 hover:shadow-sm"
                    )}
                  >
                    {isUnread && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm", isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                              {n.subject}
                            </p>
                            <div className="mt-1 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                              {n.body.split("\n").filter(Boolean).map((para, i) => (
                                <p key={i} className={i > 0 ? "mt-2" : ""}>{para}</p>
                              ))}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => markRead.mutate(n.id)}
                                loading={markRead.isPending}
                                title="Marcar como lida"
                                aria-label="Marcar como lida"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(n.created_at)}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
                            isUnread ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200" : "bg-muted text-muted-foreground"
                          )}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          {!n.sent && (
                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                              Não enviado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              total={data?.count}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
