"use client";

import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users, CheckCircle2 } from "lucide-react";
import type { SelPerformance as SelPerf } from "@/lib/types";
import { cn } from "@/lib/utils";

const DONUT_COLORS = ["#10b981", "#f59e0b", "#94a3b8"];

const tooltipStyles = {
  contentStyle: {
    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    color: "#0f172a",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
  }
};

export function SelPerformance({ sel }: { sel: SelPerf }) {
  const tiles = [
    { label: "Active Programs", value: sel.activePrograms, icon: BookOpen, tone: "from-violet-50 to-violet-50/40 border-violet-200/60 text-violet-700" },
    { label: "Sessions Conducted", value: sel.sessionsConducted, icon: Users, tone: "from-sky-50 to-sky-50/40 border-sky-200/60 text-sky-700" },
    { label: "Participation Rate", value: `${sel.participationRate}%`, icon: Target, tone: "from-amber-50 to-amber-50/40 border-amber-200/60 text-amber-700" },
    { label: "Completion Rate", value: `${sel.completionRate}%`, icon: CheckCircle2, tone: "from-emerald-50 to-emerald-50/40 border-emerald-200/60 text-emerald-700" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">SEL Program Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={cn("rounded-xl border bg-gradient-to-br p-4", t.tone)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{t.label}</p>
                <t.icon className="h-4 w-4 opacity-80" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{t.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Completion by Competency</p>
            <ul className="space-y-2.5">
              {sel.byCategory.map((row, i) => {
                const pct = Math.max(0, Math.min(100, row.completion));
                const tgt = Math.max(0, Math.min(100, row.target));
                return (
                  <li key={row.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{row.category}</span>
                      <span>
                        <span className="font-semibold text-slate-800">{row.completion}%</span>
                        <span className="text-slate-400"> / {row.target}%</span>
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          pct >= tgt ? "from-emerald-500 to-green-400" : "from-amber-500 to-yellow-400"
                        )}
                      />
                      <div
                        className="absolute top-0 h-full w-px bg-slate-400"
                        style={{ left: `${tgt}%` }}
                        aria-hidden
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sel.donut}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {sel.donut.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyles} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
              {sel.donut.map((d, i) => (
                <span key={d.label} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  {d.label} <span className="font-semibold text-slate-700">{d.value}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
