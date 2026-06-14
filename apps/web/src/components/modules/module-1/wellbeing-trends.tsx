"use client";

import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import type { Module1Overview, TrendRange } from "@/lib/types";

const RANGES: Array<{ value: TrendRange; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "Q", label: "Last quarter" },
  { value: "Y", label: "Last year" },
];

const SERIES = [
  { key: "flags" as const, label: "Flags", color: "#0f172a" },
  { key: "cases" as const, label: "Cases", color: "#6366f1" },
  { key: "referrals" as const, label: "Referrals", color: "#f59e0b" },
  { key: "crisis" as const, label: "Crisis", color: "#ef4444" },
];

const tooltipStyles = {
  contentStyle: {
    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    color: "#0f172a",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
  }
};

export function WellbeingTrends({ trends }: { trends: Module1Overview["trends"] }) {
  const [range, setRange] = useState<TrendRange>("7d");
  const data = trends[range];
  const chartData = data.flags.map((p, i) => ({
    label: p.label,
    flags: p.value,
    cases: data.cases[i]?.value ?? 0,
    referrals: data.referrals[i]?.value ?? 0,
    crisis: data.crisis[i]?.value ?? 0,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          Student Wellbeing Trends
        </CardTitle>
        <div className="w-48">
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value as TrendRange)}
            aria-label="Time range"
          >
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} interval="preserveStartEnd" />
            <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
            <Tooltip {...tooltipStyles} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: s.color, stroke: "#fff", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
