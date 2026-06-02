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
} from "lucide-react";
import type { Notification } from "@/services/notifications";
import { cn } from "@/lib/utils";

const channelIcon = (channel: Notification["channel"]) => {
  switch (channel) {
    case "email":
      return Mail;
    case "sms":
    case "whatsapp":
      return MessageSquare;
    case "push":
      return Monitor;
    default:
      return Smartphone;
  }
};

const channelVariant = (channel: Notification["channel"]) => {
  switch (channel) {
    case "email":
      return "info" as const;
    case "sms":
    case "whatsapp":
      return "success" as const;
    case "push":
      return "default" as const;
    default:
      return "secondary" as const;
  }
};

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
            <ul className="divide-y divide-border/60">
              {filtered.map((n) => {
                const Icon = channelIcon(n.channel);
                const isUnread = !n.read_at;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group flex items-start gap-3 p-3 transition-colors sm:p-4",
                      isUnread && "bg-primary-50/30 dark:bg-primary-900/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        isUnread
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p
                          className={cn(
                            "text-sm",
                            isUnread
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/80"
                          )}
                        >
                          {n.subject}
                        </p>
                        {isUnread && (
                          <Badge variant="default" className="text-[10px]">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{n.body}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant={channelVariant(n.channel)} className="capitalize">
                          {n.channel}
                        </Badge>
                        <span>•</span>
                        <span>{formatDate(n.created_at)}</span>
                      </div>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => markRead.mutate(n.id)}
                        loading={markRead.isPending}
                        title="Marcar como lida"
                        aria-label="Marcar como lida"
                        className="opacity-60 group-hover:opacity-100"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
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
