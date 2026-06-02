"use client";

import {
  Users,
  Activity,
  Bell,
  UserCheck,
  TrendingUp,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Zap,
  Shield,
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
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { useDashboardStats, useMyNotifications } from "@/hooks/queries";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const formatNumber = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k`
  : n.toString();

const formatRelative = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
};

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();
  const { data: notifications } = useMyNotifications();

  if (isLoading) return <LoadingState message="A carregar dashboard..." />;

  if (isError) {
    return (
      <Alert variant="error">
        <AlertDescription>
          Erro ao carregar dashboard: {(error as { message?: string })?.message || "Desconhecido"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return <EmptyState title="Sem dados disponíveis" icon={<BarChart3 className="h-6 w-6" />} />;

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

  const unread = data.notifications.unread;
  const recent = notifications?.results?.slice(0, 5) ?? [];
  const newUsers30 = data.users.new_last_30;
  const activeRatio = data.users.total > 0 ? Math.round((data.users.active / data.users.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral em tempo real da plataforma"
        icon={Sparkles}
        actions={
          <>
            <Badge variant="success" className="gap-1.5 px-2.5 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 shadow-[0_0_6px_rgb(16,185,129,0.8)]" />
              Sistema operacional
            </Badge>
            <Link
              href="/dashboard/reports"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Ver relatórios
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total de Utilizadores"
          value={formatNumber(data.users.total)}
          hint={`${data.users.active} ativos · ${data.users.inactive} inativos`}
          icon={Users}
          gradient="primary"
        />
        <KpiCard
          label="Novos (30 dias)"
          value={formatNumber(newUsers30)}
          hint="Últimos 30 dias"
          icon={UserCheck}
          gradient="success"
          trend={{ value: 12, label: "vs. mês anterior" }}
        />
        <KpiCard
          label="Eventos de Auditoria"
          value={formatNumber(data.audit.total)}
          hint={`${formatNumber(data.audit.recent_7)} nos últimos 7 dias`}
          icon={Activity}
          gradient="info"
        />
        <KpiCard
          label="Notificações não lidas"
          value={formatNumber(unread)}
          hint={`${formatNumber(data.notifications.total)} no total`}
          icon={Bell}
          gradient="warning"
        />
      </div>

      {/* Quick stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Taxa de atividade"
          value={`${activeRatio}%`}
          hint={`${data.users.active} de ${data.users.total} utilizadores ativos`}
          icon={Zap}
          gradient="primary"
        />
        <KpiCard
          label="Verificados"
          value={`${data.users.verified}/${data.users.total}`}
          hint="Contas com email validado"
          icon={Shield}
          gradient="success"
        />
        <KpiCard
          label="Caixa de entrada"
          value={formatNumber(unread)}
          hint={`${formatNumber(data.notifications.total)} notificações no total`}
          icon={Bell}
          gradient="warning"
        />
      </div>

      {/* Timeseries */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                  Utilizadores criados (30d)
                </CardTitle>
                <CardDescription>Novos cadastros por dia</CardDescription>
              </div>
              <Badge variant="info">Diário</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {data.timeseries.users_30d.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.timeseries.users_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#gUsers)"
                    dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--background))" }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-success-600" />
                  Atividade de auditoria (30d)
                </CardTitle>
                <CardDescription>Eventos registados por dia</CardDescription>
              </div>
              <Badge variant="success">Diário</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {data.timeseries.audit_30d.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.timeseries.audit_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distributions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Utilizadores por role</CardTitle>
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
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {usersByRoleData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
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
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {auditByActionData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
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
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {notifByChannelData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary-600" />
                Notificações recentes
              </CardTitle>
              <CardDescription>Últimos alertas da plataforma</CardDescription>
            </div>
            <Link
              href="/dashboard/notifications"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline"
            >
              Ver todas
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <EmptyState title="Sem notificações" icon={<AlertCircle className="h-6 w-6" />} />
          ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((n) => {
                const isUnread = !n.read_at;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group flex items-start gap-3 py-3.5 transition-colors",
                      isUnread && "bg-primary-50/30 dark:bg-primary-900/10"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        isUnread
                          ? "bg-primary-500 shadow-[0_0_6px_rgb(99,102,241,0.6)]"
                          : "bg-muted-foreground/40"
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm",
                            isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                          )}
                        >
                          {n.subject}
                        </p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {formatRelative(n.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{n.body}</p>
                    </div>
                    <Badge variant={n.read_at ? "secondary" : "default"} className="hidden sm:inline-flex">
                      {n.channel}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
