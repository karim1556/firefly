"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CrisisAlertRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_TONE: Record<CrisisAlertRow["severity"], { dot: string; text: string; bg: string; border: string }> = {
  LOW: { dot: "bg-slate-400", text: "text-slate-700", bg: "from-slate-50/80 to-slate-50/30", border: "border-slate-200/60" },
  MODERATE: { dot: "bg-amber-500", text: "text-amber-700", bg: "from-amber-50 to-amber-50/30", border: "border-amber-200/60" },
  HIGH: { dot: "bg-orange-500", text: "text-orange-700", bg: "from-orange-50 to-orange-50/30", border: "border-orange-200/60" },
  CRITICAL: { dot: "bg-red-500", text: "text-red-700", bg: "from-red-50 to-red-50/30", border: "border-red-200/60" },
};

const TYPE_LABEL: Record<CrisisAlertRow["type"], string> = {
  SELF_HARM_RISK: "Self-harm risk",
  SUICIDE_IDEATION: "Suicidal ideation",
  ABUSE: "Abuse",
  BULLYING: "Bullying",
  VIOLENCE: "Violence",
  EMOTIONAL_DISTRESS: "Emotional distress",
  MISSING: "Missing student",
  SAFETY: "Safety concern",
};

export function CrisisAlertCenter({ alerts }: { alerts: CrisisAlertRow[] }) {
  // Highest severity first
  const order: Record<CrisisAlertRow["severity"], number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
  const sorted = [...alerts].sort((a, b) => order[a.severity] - order[b.severity]);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <AlertTriangle className="h-4 w-4 text-slate-500" />
          Crisis Alert Center
        </CardTitle>
        <span className="text-xs text-slate-500">{sorted.length} active</span>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState title="No active crisis alerts" description="Urgent student concerns will surface here." />
        ) : (
          <ul className="space-y-3">
            {sorted.map((a, i) => {
              const tone = SEVERITY_TONE[a.severity];
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={cn("rounded-xl border bg-gradient-to-br p-4", tone.bg, tone.border)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", tone.dot)} aria-hidden />
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider", tone.text)}>
                          {a.severity}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">·</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                          {TYPE_LABEL[a.type]}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.description}</p>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        {a.studentName} · {formatDate(a.createdAt)}
                      </p>
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">Action taken:</span> {a.actionTaken}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="group">
                      View
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
