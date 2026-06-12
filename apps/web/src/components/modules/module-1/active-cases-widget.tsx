"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowRight, Calendar, Edit, Eye, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ActiveCaseRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_TONE: Record<ActiveCaseRow["riskLevel"], string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_TONE: Record<ActiveCaseRow["status"], string> = {
  OPEN: "bg-sky-50 text-sky-700 border-sky-200",
  IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-200",
  ON_HOLD: "bg-slate-100 text-slate-600 border-slate-200",
  CLOSED: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export function ActiveCasesWidget({ cases }: { cases: ActiveCaseRow[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <ClipboardList className="h-4 w-4 text-slate-500" />
          Active Cases
        </CardTitle>
        <Button variant="ghost" size="sm" className="group">
          View all
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <EmptyState title="No active cases" description="All cases are currently resolved." />
        ) : (
          <ul className="space-y-3">
            {cases.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60 p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{c.studentName}</p>
                      <span className="text-xs text-slate-400">•</span>
                      <p className="text-xs text-slate-500">Grade {c.studentGrade}</p>
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", RISK_TONE[c.riskLevel])}>
                        {c.riskLevel}
                      </span>
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", STATUS_TONE[c.status])}>
                        {c.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Counsellor: <span className="font-medium text-slate-700">{c.counsellor}</span> · Opened {formatDate(c.openedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className="group">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="group">
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Update
                    </Button>
                    <Button variant="outline" size="sm" className="group">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
