"use client";

import {
  Users,
  Activity,
  Bell,
  UserCheck,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { useDashboardStats, useMyNotifications, useUnreadCount } from "@/hooks/queries";

const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const formatNumber = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k`
  : n.toString();

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();
  const { data: notifications } = useMyNotifications();
  const { data: unread } = useUnreadCount();

  if (isLoading) return <LoadingState message="Carregando dashboard..." />;

  if (isError) {
    return (
      <Alert variant="error">
        <AlertDescription>
          Erro ao carregar dashboard: {(error as any)?.message || "Desconhecido"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return <EmptyState title="Sem dados disponíveis" icon={<BarChart3 className="h-12 w-12" />} />;

  const usersByRoleData = Object.entries(data.users.by_role).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  const auditByActionData = Object.entries(data.audit.by_action).map(([action, count]) => ({
    name: action,
    value: count,
  }));

  const notifByChannelData = Object.entries(data.notifications.by_channel).map(([channel, count]) => ({
    name: channel,
    value: count,
  }));

  const stats = [
    {
      label: "Total de Usuários",
      value: formatNumber(data.users.total),
      sub: `${data.users.active} ativos · ${data.users.inactive} inativos`,
      icon: Users,
    },
    {
      label: "Novos (30d)",
      value: formatNumber(data.users.new_last_30),
      sub: "Últimos 30 dias",
      icon: UserCheck,
    },
    {
      label: "Ações (7d)",
      value: formatNumber(data.audit.recent_7),
      sub: `${formatNumber(data.audit.total)} no total`,
      icon: Activity,
    },
    {
      label: "Notificações",
      value: formatNumber(data.notifications.total),
      sub: `${unread ?? 0} não lidas`,
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-sm text-secondary-500">Visão geral da plataforma</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <p className="mt-3 text-xs text-secondary-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeseries */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Usuários criados (30d)
            </CardTitle>
            <CardDescription>Novos utilizadores por dia</CardDescription>
          </CardHeader>
          <CardContent>
            {data.timeseries.users_30d.length === 0 ? (
              <EmptyState title="Sem dados de novos usuários" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.timeseries.users_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Atividade de auditoria (30d)
            </CardTitle>
            <CardDescription>Acções por dia</CardDescription>
          </CardHeader>
          <CardContent>
            {data.timeseries.audit_30d.length === 0 ? (
              <EmptyState title="Sem dados de auditoria" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.timeseries.audit_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distributions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuários por role</CardTitle>
          </CardHeader>
          <CardContent>
            {usersByRoleData.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={usersByRoleData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {usersByRoleData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações de auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            {auditByActionData.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={auditByActionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {auditByActionData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações por canal</CardTitle>
          </CardHeader>
          <CardContent>
            {notifByChannelData.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={notifByChannelData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {notifByChannelData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" />
            Notificações recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!notifications || notifications.results.length === 0 ? (
            <EmptyState title="Sem notificações" icon={<AlertCircle className="h-8 w-8" />} />
          ) : (
            <div className="divide-y">
              {notifications.results.slice(0, 5).map((n) => (
                <div key={n.id} className="py-3 flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${n.read_at ? "bg-secondary-300" : "bg-primary-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">{n.subject}</p>
                    <p className="text-xs text-secondary-500 line-clamp-1">{n.body}</p>
                  </div>
                  <Badge variant={n.read_at ? "secondary" : "default"}>{n.channel}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
