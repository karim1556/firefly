"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Module1HighRiskStudent } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_TONE: Record<Module1HighRiskStudent["riskLevel"], string> = {
  MODERATE: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
};

export function HighRiskMonitor({ students }: { students: Module1HighRiskStudent[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <ShieldAlert className="h-4 w-4 text-slate-500" />
          High-Risk Student Monitor
        </CardTitle>
        <Button variant="ghost" size="sm" className="group">
          View all
          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <EmptyState title="No high-risk students" description="The watchlist is clear." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/60">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Student</th>
                  <th className="px-4 py-2.5">Risk</th>
                  <th className="px-4 py-2.5">Open Cases</th>
                  <th className="px-4 py-2.5">Last Activity</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-t border-slate-200/60 bg-white transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">Grade {s.grade} · {s.classroom}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", RISK_TONE[s.riskLevel])}>
                        {s.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s.openCases}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(s.lastActivity)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="group">
                        Review
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
