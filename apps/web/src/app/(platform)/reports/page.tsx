"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const pieColors = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

type WellbeingReport = {
  studentStatus: Array<{ status: string; _count: { status: number } }>;
  studentTier: Array<{ tier: string; _count: { tier: number } }>;
  casesByStatus: Array<{ status: string; _count: { status: number } }>;
  casesByType: Array<{ type: string; _count: { type: number } }>;
  incidentsBySeverity: Array<{ severity: string; _count: { severity: number } }>;
};

type ComplianceReport = {
  supremeCourtGuidelines: Array<{
    code: string;
    title: string;
    status: string;
  }>;
  metrics: {
    activeCases: number;
    incidentCount: number;
    sessionsCount: number;
  };
};

export default function ReportsPage() {
  const { authFetch, user } = useAuth();

  const wellbeingQuery = useQuery({
    queryKey: ["wellbeing-report"],
    queryFn: () => authFetch<WellbeingReport>("/reports/wellbeing")
  });

  const complianceQuery = useQuery({
    queryKey: ["compliance-report"],
    queryFn: () => authFetch<ComplianceReport>("/reports/compliance"),
    enabled: user?.role !== "PARENT" && user?.role !== "STUDENT"
  });

  if (wellbeingQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!wellbeingQuery.data) {
    return <EmptyState title="Reports unavailable" description="Report endpoints are not reachable right now." />;
  }

  const wellbeing = wellbeingQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        description="Outcome trends, wellbeing distribution, and compliance monitoring."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wellbeing.studentStatus.map((row) => ({
                    name: row.status,
                    value: row._count.status
                  }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={105}
                >
                  {wellbeing.studentStatus.map((row, index) => (
                    <Cell key={row.status} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cases by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wellbeing.casesByType.map((row) => ({
                  name: row.type,
                  value: row._count.type
                }))}
              >
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supreme Court Compliance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {complianceQuery.data ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <MetricCard label="Active Cases" value={String(complianceQuery.data.metrics.activeCases)} />
                <MetricCard label="Incidents" value={String(complianceQuery.data.metrics.incidentCount)} />
                <MetricCard label="Sessions" value={String(complianceQuery.data.metrics.sessionsCount)} />
              </div>

              <div className="space-y-2">
                {complianceQuery.data.supremeCourtGuidelines.map((item) => (
                  <div key={item.code} className="flex flex-wrap items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-sm text-zinc-900">
                      {item.code}: {item.title}
                    </p>
                    <Badge variant={item.status === "active" ? "success" : "warning"}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Restricted compliance view"
              description="Your role has read-only access to wellbeing analytics without compliance internals."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
