"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import {
  useMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries";
import { Bell, Check, CheckCheck, Mail, MessageSquare, Smartphone, Monitor } from "lucide-react";
import type { Notification } from "@/services/notifications";

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

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const params = { page, page_size: 15 };
  const { data, isLoading, isError, error } = useMyNotifications(params);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.results ?? [];
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read_at) : notifications;
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  if (isLoading) return <LoadingState message="Carregando notificações..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Notificações</h1>
          <p className="text-sm text-secondary-500">Central de mensagens e alertas</p>
        </div>
        <Button
          variant="outline"
          onClick={() => markAll.mutate()}
          loading={markAll.isPending}
          disabled={notifications.every((n) => n.read_at)}
        >
          <CheckCheck className="h-4 w-4" />
          Marcar todas como lidas
        </Button>
      </div>

      {isError && (
        <Alert variant="error">
          <AlertDescription>{(error as any)?.message || "Erro ao carregar"}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-600" />
              Suas notificações
              {data && <span className="text-sm font-normal text-secondary-500">({data.count})</span>}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Não lidas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-12 w-12" />}
              title={filter === "unread" ? "Nenhuma não lida" : "Sem notificações"}
              description={filter === "unread" ? "Você está em dia!" : "Novas notificações aparecerão aqui"}
            />
          ) : (
            <div className="divide-y">
              {filtered.map((n) => {
                const Icon = channelIcon(n.channel);
                const isUnread = !n.read_at;
                return (
                  <div
                    key={n.id}
                    className={`p-4 flex items-start gap-3 ${isUnread ? "bg-primary-50/30" : ""}`}
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isUnread ? "bg-primary-100 text-primary-700" : "bg-secondary-100 text-secondary-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm ${isUnread ? "font-semibold" : "font-medium"} text-secondary-900`}>
                          {n.subject}
                        </p>
                        {isUnread && (
                          <Badge variant="default" className="text-[10px]">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 line-clamp-2">{n.body}</p>
                      <p className="text-xs text-secondary-400 mt-1">{formatDate(n.created_at)}</p>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markRead.mutate(n.id)}
                        loading={markRead.isPending}
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
