"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import type { ClassAnalytics } from "@/lib/types";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ClassAnalyticsPanelProps {
  analytics: ClassAnalytics;
}

const TIER_COLORS: Record<string, string> = {
  TIER_1: "#10b981",
  TIER_2: "#f59e0b",
  TIER_3: "#ef4444",
};

const TIER_LABELS: Record<string, string> = {
  TIER_1: "Tier 1",
  TIER_2: "Tier 2",
  TIER_3: "Tier 3",
};

export function ClassAnalyticsPanel({ analytics }: ClassAnalyticsPanelProps) {
  const tierData = analytics.tierDistribution.map((t) => ({
    name: TIER_LABELS[t.tier] ?? t.tier,
    count: t.count,
    fill: TIER_COLORS[t.tier] ?? "#94a3b8",
  }));

  return (
    <div className="space-y-4">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
          label="Total Students"
          value={analytics.totalStudents}
          bg="bg-blue-50"
        />
        <KpiTile
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          label="Open Flags"
          value={analytics.flagCount.open}
          bg="bg-red-50"
        />
        <KpiTile
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          label="Resolved Flags"
          value={analytics.flagCount.resolved}
          bg="bg-emerald-50"
        />
        <KpiTile
          icon={<TrendingUp className="h-4 w-4 text-indigo-600" />}
          label="SEL Completion"
          value={`${analytics.selCompletionRate}%`}
          bg="bg-indigo-50"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tier Distribution</CardTitle>
            <p className="text-xs text-zinc-500">MTSS support tier counts across the class</p>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {tierData.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Observation Trend</CardTitle>
            <p className="text-xs text-zinc-500">Observations logged across the school week</p>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiTile({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`rounded-lg p-2 ${bg}`}>{icon}</div>
        <div>
          <p className="text-xl font-bold text-zinc-900">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
