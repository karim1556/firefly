"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { ExecutiveAnalytics } from "@/lib/types";
import { cn } from "@/lib/utils";

function MetricCard({
  label,
  value,
  sublabel,
  accentClass,
  delay,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  accentClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        "rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/60 p-4 shadow-sm",
        accentClass
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
    </motion.div>
  );
}

const tooltipStyles = {
  contentStyle: {
    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    color: "#0f172a",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
};

export function ExecutiveAnalyticsDashboard({ executiveAnalytics }: { executiveAnalytics: ExecutiveAnalytics }) {
  const { resolutionRate, referralOutcomes, crisisResponseTime, selEffectiveness, trendPoints } = executiveAnalytics;

  const chartData = trendPoints.map((p) => ({
    label: p.label,
    Wellbeing: p.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <BarChart3 className="h-4 w-4 text-slate-500" />
          Executive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPI tiles */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <MetricCard
            label="Resolution Rate"
            value={`${resolutionRate}%`}
            sublabel="cases closed on time"
            accentClass=""
            delay={0}
          />
          <MetricCard
            label="Referral Outcomes"
            value={`${referralOutcomes}%`}
            sublabel="successful referrals"
            accentClass=""
            delay={0.06}
          />
          <MetricCard
            label="Crisis Response"
            value={crisisResponseTime}
            sublabel="avg. response time"
            accentClass=""
            delay={0.12}
          />
          <MetricCard
            label="SEL Effectiveness"
            value={`${selEffectiveness}%`}
            sublabel="program impact"
            accentClass=""
            delay={0.18}
          />
        </div>

        {/* Trend chart */}
        <div className="h-[220px]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            School Wellbeing Score — Monthly Trend
          </p>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} interval="preserveStartEnd" />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} domain={[50, 100]} />
              <Tooltip {...tooltipStyles} />
              <Line
                type="monotone"
                dataKey="Wellbeing"
                name="Wellbeing Score"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
