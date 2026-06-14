"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { HeatmapRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_COLORS = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const RISK_LABELS = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function Cell({ count, color, label }: { count: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white shadow-sm",
          color
        )}
        title={`${label}: ${count}`}
      >
        {count}
      </motion.div>
    </div>
  );
}

export function WellbeingHeatmap({ heatmap }: { heatmap: HeatmapRow[] }) {
  const maxTotal = Math.max(...heatmap.map((r) => r.low + r.medium + r.high + r.critical));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <Flame className="h-4 w-4 text-slate-500" />
          School Wellbeing Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {(Object.keys(RISK_COLORS) as Array<keyof typeof RISK_COLORS>).map((risk) => (
            <div key={risk} className="flex items-center gap-1.5">
              <div className={cn("h-2.5 w-2.5 rounded-sm", RISK_COLORS[risk])} />
              <span className="text-slate-500">{RISK_LABELS[risk]}</span>
            </div>
          ))}
          <div className="ml-auto text-xs text-slate-400">
            Total students at risk:{" "}
            <span className="font-semibold text-slate-600">
              {heatmap.reduce((sum, r) => sum + r.high + r.critical, 0)}
            </span>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="pb-2 pr-3 text-left font-semibold uppercase tracking-wider text-slate-500">Grade</th>
                <th className="pb-2 text-center font-semibold uppercase tracking-wider text-slate-500">Low</th>
                <th className="pb-2 text-center font-semibold uppercase tracking-wider text-slate-500">Medium</th>
                <th className="pb-2 text-center font-semibold uppercase tracking-wider text-slate-500">High</th>
                <th className="pb-2 text-center font-semibold uppercase tracking-wider text-slate-500">Critical</th>
                <th className="pb-2 text-center font-semibold uppercase tracking-wider text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row, i) => {
                const total = row.low + row.medium + row.high + row.critical;
                return (
                  <motion.tr
                    key={row.grade}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="border-t border-slate-100"
                  >
                    <td className="py-2 pr-3 font-semibold text-slate-700">Grade {row.grade}</td>
                    <td className="py-2 text-center">
                      <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-emerald-50 px-1.5 text-xs font-medium text-emerald-700">
                        {row.low}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-amber-50 px-1.5 text-xs font-medium text-amber-700">
                        {row.medium}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-orange-50 px-1.5 text-xs font-medium text-orange-700">
                        {row.high}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-md bg-red-50 px-1.5 text-xs font-medium text-red-700">
                        {row.critical}
                      </span>
                    </td>
                    <td className="py-2 text-center font-semibold text-slate-700">{total}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual bar heatmap */}
        <div className="space-y-2">
          {heatmap.map((row, i) => {
            const total = row.low + row.medium + row.high + row.critical;
            const maxRow = Math.max(total, 1);
            return (
              <motion.div
                key={row.grade}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2"
              >
                <span className="w-12 text-xs font-medium text-slate-600">Grade {row.grade}</span>
                <div className="flex flex-1 overflow-hidden rounded-full">
                  {(["low", "medium", "high", "critical"] as const).map((risk) => {
                    const count = row[risk];
                    const width = (count / maxRow) * 100;
                    if (width === 0) return null;
                    return (
                      <motion.div
                        key={risk}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                        className={cn("h-3", RISK_COLORS[risk])}
                        title={`${risk}: ${count}`}
                      />
                    );
                  })}
                </div>
                <span className="w-6 text-right text-xs font-semibold text-slate-600">{total}</span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
