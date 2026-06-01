"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Users, Building2, Activity, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Usuários Ativos", value: "1,234", icon: Users, change: "+12%", variant: "success" as const },
  { label: "Empresas", value: "56", icon: Building2, change: "+3", variant: "success" as const },
  { label: "Taxa de Atividade", value: "98.5%", icon: Activity, change: "+0.5%", variant: "success" as const },
  { label: "Receita Mensal", value: "R$ 45.678", icon: DollarSign, change: "+8.2%", variant: "success" as const },
];

const recentUsers = [
  { name: "Ana Silva", email: "ana@exemplo.com", role: "Admin", status: "active" as const },
  { name: "Carlos Souza", email: "carlos@exemplo.com", role: "Manager", status: "active" as const },
  { name: "Maria Lima", email: "maria@exemplo.com", role: "Operator", status: "inactive" as const },
  { name: "João Santos", email: "joao@exemplo.com", role: "Client", status: "active" as const },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-sm text-secondary-500">Visão geral da plataforma</p>
      </div>

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
              <div className="mt-4 flex items-center gap-1 text-sm text-success-600">
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change} este mês</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-primary-600" />
              Últimos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "active" ? "success" : "secondary"}>
                        {u.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-500" />
                  <div className="flex-1">
                    <p className="text-sm">Ação realizada no sistema</p>
                    <p className="text-xs text-secondary-400">Há {i * 5} minutos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
