"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, Clock, BookOpen } from "lucide-react";
import type { ComplianceSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

function StatPill({
  label,
  value,
  icon: Icon,
  accentClass,
  sublabel,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accentClass: string;
  sublabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/60 p-4 shadow-sm"
    >
      <div className={cn("mt-0.5 rounded-lg p-2", accentClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
        {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
      </div>
    </motion.div>
  );
}

export function ComplianceSnapshotWidget({ compliance }: { compliance: ComplianceSnapshot }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <ShieldCheck className="h-4 w-4 text-slate-500" />
          Compliance Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Top-level KPIs */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatPill
            label="Policy Compliance"
            value={`${compliance.policyCompliance}%`}
            icon={ShieldCheck}
            accentClass="bg-emerald-50 text-emerald-600"
          />
          <StatPill
            label="Training Completion"
            value={`${compliance.trainingCompletion}%`}
            icon={BookOpen}
            accentClass="bg-blue-50 text-blue-600"
          />
          <StatPill
            label="Acknowledgements"
            value={compliance.acknowledgementsPending}
            icon={AlertCircle}
            accentClass="bg-amber-50 text-amber-600"
            sublabel="pending"
          />
          <StatPill
            label="Reviews Due"
            value={compliance.reviewsDue}
            icon={Clock}
            accentClass="bg-red-50 text-red-600"
            sublabel="this month"
          />
        </div>

        {/* Category breakdown */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">By Category</p>
          <ul className="space-y-2">
            {compliance.byCategory.map((cat, i) => {
              const pct = cat.rate;
              const color =
                pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500";
              return (
                <motion.li
                  key={cat.category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{cat.category}</span>
                    <span className={pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-600"}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <motion.div
                      className={cn("h-full rounded-full", color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 + 0.1 }}
                    />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
