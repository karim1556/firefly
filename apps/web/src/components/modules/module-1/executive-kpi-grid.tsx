"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, ShieldAlert, BookOpen, Target, FileText, AlertTriangle, ClipboardCheck, GraduationCap, UserPlus } from "lucide-react";
import type { Module1Overview } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tile = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "indigo" | "green" | "amber" | "red" | "violet" | "sky";
};

const TONE: Record<Tile["tone"], { soft: string; icon: string }> = {
  indigo: { soft: "from-slate-100 to-slate-50 border-slate-200", icon: "text-slate-700 bg-slate-100" },
  green: { soft: "from-emerald-50 to-emerald-50/40 border-emerald-200/60", icon: "text-emerald-700 bg-emerald-100" },
  amber: { soft: "from-amber-50 to-amber-50/40 border-amber-200/60", icon: "text-amber-700 bg-amber-100" },
  red: { soft: "from-red-50 to-red-50/40 border-red-200/60", icon: "text-red-700 bg-red-100" },
  violet: { soft: "from-violet-50 to-violet-50/40 border-violet-200/60", icon: "text-violet-700 bg-violet-100" },
  sky: { soft: "from-sky-50 to-sky-50/40 border-sky-200/60", icon: "text-sky-700 bg-sky-100" },
};

function TileCard({ tile, delay }: { tile: Tile; delay: number }) {
  const tone = TONE[toneOf(tile.tone)];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn("rounded-xl border bg-gradient-to-br p-4 shadow-sm", tone.soft)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{tile.label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tracking-tight">{tile.value}</p>
        </div>
        <div className={cn("grid h-9 w-9 place-items-center rounded-lg", tone.icon)}>
          <tile.icon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

function toneOf(t: Tile["tone"]) { return t; }

export function ExecutiveKpiGrid({ kpis }: { kpis: Module1Overview["kpis"] }) {
  const students: Tile[] = [
    { label: "Total Students", value: kpis.students.total.toLocaleString(), icon: Users, tone: "indigo" },
    { label: "Active Students", value: kpis.students.active.toLocaleString(), icon: GraduationCap, tone: "sky" },
    { label: "New Enrollments", value: `+${kpis.students.newEnrollments}`, icon: UserPlus, tone: "green" },
  ];
  const wellbeing: Tile[] = [
    { label: "Active Cases", value: kpis.wellbeing.activeCases, icon: Activity, tone: "indigo" },
    { label: "Open Referrals", value: kpis.wellbeing.openReferrals, icon: ClipboardCheck, tone: "sky" },
    { label: "Crisis Incidents", value: kpis.wellbeing.crisisIncidents, icon: AlertTriangle, tone: "red" },
    { label: "Students at Risk", value: kpis.wellbeing.studentsAtRisk, icon: ShieldAlert, tone: "amber" },
  ];
  const sel: Tile[] = [
    { label: "Active Programs", value: kpis.sel.activePrograms, icon: BookOpen, tone: "violet" },
    { label: "Completion Rate", value: `${kpis.sel.completionRate}%`, icon: Target, tone: "green" },
  ];
  const compliance: Tile[] = [
    { label: "Policy Compliance", value: `${kpis.compliance.policyCompliance}%`, icon: ShieldAlert, tone: "indigo" },
    { label: "Staff Ack. Rate", value: `${kpis.compliance.staffAcknowledgementRate}%`, icon: FileText, tone: "green" },
  ];

  return (
    <div className="space-y-4">
      <KpiSection title="Students" tiles={students} baseDelay={0} />
      <KpiSection title="Wellbeing" tiles={wellbeing} baseDelay={0.05} />
      <KpiSection title="SEL" tiles={sel} baseDelay={0.1} />
      <KpiSection title="Compliance" tiles={compliance} baseDelay={0.15} />
    </div>
  );
}

function KpiSection({ title, tiles, baseDelay }: { title: string; tiles: Tile[]; baseDelay: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <TileCard key={t.label} tile={t} delay={baseDelay + i * 0.04} />
        ))}
      </CardContent>
    </Card>
  );
}
