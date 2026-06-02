"use client";

import {
  Users,
  Activity,
  Bell,
  TrendingUp,
  BarChart3,
  UserCheck,
  Download,
  Sparkles,
  PieChart as PieIcon,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { useDashboardStats } from "@/hooks/queries";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const formatNumber = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k`
  : n.toString();

export default function ReportsPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <LoadingState message="A gerar relatórios..." />;
  if (!data) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-6 w-6" />}
        title="Sem dados"
        description="Ainda não há dados suficientes para relatórios"
      />
    );
  }

  const usersByRole = Object.entries(data.users.by_role).map(([name, value]) => ({ name, value }));
  const auditByAction = Object.entries(data.audit.by_action).map(([name, value]) => ({ name, value }));
  const notifByChannel = Object.entries(data.notifications.by_channel).map(([name, value]) => ({
    name,
    value,
  }));

  const activeRatio =
    data.users.total > 0 ? ((data.users.active / data.users.total) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Análise detalhada de métricas e tendências"
        icon={BarChart3}
        actions={
          <>
            <Badge variant="success" className="gap-1.5 px-2.5 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 shadow-[0_0_6px_rgb(16,185,129,0.8)]" />
              Dados em tempo real
            </Badge>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Utilizadores ativos"
          value={data.users.active}
          hint={`${activeRatio}% do total`}
          icon={Users}
          gradient="primary"
        />
        <KpiCard
          label="Verificados"
          value={data.users.verified}
          hint={`de ${data.users.total} utilizadores`}
          icon={UserCheck}
          gradient="success"
        />
        <KpiCard
          label="Eventos de auditoria"
          value={formatNumber(data.audit.total)}
          hint={`${data.audit.recent_7} nos últimos 7 dias`}
          icon={Activity}
          gradient="info"
        />
        <KpiCard
          label="Não lidas"
          value={data.notifications.unread}
          hint={`de ${formatNumber(data.notifications.total)} totais`}
          icon={Bell}
          gradient="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                  Crescimento de utilizadores
                </CardTitle>
                <CardDescription>Novos cadastros nos últimos 30 dias</CardDescription>
              </div>
              <Badge variant="info">Tendência</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={data.timeseries.users_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}
              >
                <defs>
                  <linearGradient id="rUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--border))" allowDecimals={false} />
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
                  strokeWidth={3}
                  fill="url(#rUsers)"
                  dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-success-600" />
                  Atividade do sistema
                </CardTitle>
                <CardDescription>Eventos registados nos últimos 30 dias</CardDescription>
              </div>
              <Badge variant="success">Volume</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.timeseries.audit_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--border))" allowDecimals={false} />
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary-600" />
              Distribuição de roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersByRole.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                    label={({ value }) => value}
                  >
                    {usersByRole.map((_, i) => (
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning-600" />
              Ações mais comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditByAction.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={auditByAction}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {auditByAction.map((_, i) => (
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
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-info-600" />
              Canais de notificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifByChannel.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={notifByChannel}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {notifByChannel.map((_, i) => (
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
    </div>
  );
}
