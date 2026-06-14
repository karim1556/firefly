"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldAlert, ClipboardCheck, LifeBuoy, AlertTriangle } from "lucide-react";
import type { Module1Overview } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tile = { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: "indigo" | "red" | "amber" | "sky" | "violet" };

const TONE: Record<Tile["tone"], { soft: string; chip: string; icon: string }> = {
  indigo: { soft: "from-slate-100 to-slate-50 border-slate-200", chip: "bg-slate-900 text-white", icon: "bg-slate-100 text-slate-700" },
  red: { soft: "from-red-50 to-red-50/40 border-red-200/60", chip: "bg-red-600 text-white", icon: "bg-red-100 text-red-700" },
  amber: { soft: "from-amber-50 to-amber-50/40 border-amber-200/60", chip: "bg-amber-500 text-white", icon: "bg-amber-100 text-amber-700" },
  sky: { soft: "from-sky-50 to-sky-50/40 border-sky-200/60", chip: "bg-sky-600 text-white", icon: "bg-sky-100 text-sky-700" },
  violet: { soft: "from-violet-50 to-violet-50/40 border-violet-200/60", chip: "bg-violet-600 text-white", icon: "bg-violet-100 text-violet-700" },
};

export function SchoolHealthOverview({ kpis }: { kpis: Module1Overview["kpis"] }) {
  const tiles: Tile[] = [
    { label: "Active Cases", value: kpis.wellbeing.activeCases, icon: Activity, tone: "indigo" },
    { label: "High-Risk Students", value: kpis.wellbeing.studentsAtRisk, icon: ShieldAlert, tone: "red" },
    { label: "Open Referrals", value: kpis.wellbeing.openReferrals, icon: ClipboardCheck, tone: "amber" },
    { label: "Pending Assistance", value: kpis.wellbeing.pendingAssistance, icon: LifeBuoy, tone: "sky" },
    { label: "Crisis Alerts", value: kpis.wellbeing.crisisIncidents, icon: AlertTriangle, tone: "red" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">School Health Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map((t, i) => {
            const tone = TONE[t.tone];
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={cn("relative overflow-hidden rounded-xl border bg-gradient-to-br p-4", tone.soft)}
              >
                <div className="flex items-center justify-between">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-lg", tone.icon)}>
                    <t.icon className="h-4 w-4" />
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", tone.chip)}>
                    Live
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">{t.value}</p>
                <p className="text-xs text-slate-500">{t.label}</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
