"use client";

import {
  Users,
  Activity,
  Bell,
  TrendingUp,
  BarChart3,
  UserCheck,
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
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { useDashboardStats } from "@/hooks/queries";

const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

export default function ReportsPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <LoadingState message="A gerar relatórios..." />;
  if (!data)
    return (
      <EmptyState
        icon={<BarChart3 className="h-12 w-12" />}
        title="Sem dados"
        description="Ainda não há dados suficientes para relatórios"
      />
    );

  const usersByRole = Object.entries(data.users.by_role).map(([name, value]) => ({ name, value }));
  const auditByAction = Object.entries(data.audit.by_action).map(([name, value]) => ({ name, value }));
  const notifByChannel = Object.entries(data.notifications.by_channel).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Relatórios</h1>
        <p className="text-sm text-secondary-500">Análise detalhada de métricas e tendências</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">Usuários Ativos</p>
                <p className="text-2xl font-bold">{data.users.active}</p>
              </div>
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <p className="text-xs text-success-600 mt-2">
              {((data.users.active / Math.max(data.users.total, 1)) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">Verificados</p>
                <p className="text-2xl font-bold">{data.users.active - data.users.inactive}</p>
              </div>
              <UserCheck className="h-5 w-5 text-primary-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">de {data.users.total} usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">Eventos de auditoria</p>
                <p className="text-2xl font-bold">{data.audit.total}</p>
              </div>
              <Activity className="h-5 w-5 text-primary-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">{data.audit.recent_7} nos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">Não lidas</p>
                <p className="text-2xl font-bold">{data.notifications.unread}</p>
              </div>
              <Bell className="h-5 w-5 text-primary-600" />
            </div>
            <p className="text-xs text-secondary-500 mt-2">de {data.notifications.total} totais</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Crescimento de usuários
            </CardTitle>
            <CardDescription>Novos cadastros nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.timeseries.users_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Atividade do sistema
            </CardTitle>
            <CardDescription>Acções registadas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.timeseries.audit_30d.map((p) => ({ ...p, label: formatDate(p.date) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Roles</CardTitle>
          </CardHeader>
          <CardContent>
            {usersByRole.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={usersByRole} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} label>
                    {usersByRole.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações mais comuns</CardTitle>
          </CardHeader>
          <CardContent>
            {auditByAction.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={auditByAction} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                    {auditByAction.map((_, i) => (
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
            <CardTitle>Canais de notificação</CardTitle>
          </CardHeader>
          <CardContent>
            {notifByChannel.length === 0 ? (
              <EmptyState title="Sem dados" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={notifByChannel} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                    {notifByChannel.map((_, i) => (
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
    </div>
  );
}
