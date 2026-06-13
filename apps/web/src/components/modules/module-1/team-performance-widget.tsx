"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target } from "lucide-react";
import type { Module1Overview } from "@/lib/types";
import { cn } from "@/lib/utils";

type TeamPerformance = Module1Overview["teamPerformance"];

function ProgressBar({ value, target, className }: { value: number; target: number; className?: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{value}/{target}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function TeamSection({
  title,
  icon: Icon,
  members,
  accentClass,
}: {
  title: string;
  icon: React.ElementType;
  members: TeamPerformance["counsellors"];
  accentClass: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("rounded-lg p-1.5", accentClass)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
      </div>
      <ul className="space-y-2.5">
        {members.map((m, i) => (
          <motion.li
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">{m.name}</span>
              <span className="text-slate-400">{m.metric}</span>
            </div>
            <ProgressBar value={m.value} target={m.target} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function TeamPerformanceWidget({ teamPerformance }: { teamPerformance: TeamPerformance }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <Users className="h-4 w-4 text-slate-500" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <TeamSection
            title="Counsellors"
            icon={Users}
            members={teamPerformance.counsellors}
            accentClass="bg-blue-50 text-blue-600"
          />
          <TeamSection
            title="Coordinators"
            icon={Target}
            members={teamPerformance.coordinators}
            accentClass="bg-purple-50 text-purple-600"
          />
          <TeamSection
            title="Leadership"
            icon={TrendingUp}
            members={teamPerformance.leadership}
            accentClass="bg-emerald-50 text-emerald-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}
