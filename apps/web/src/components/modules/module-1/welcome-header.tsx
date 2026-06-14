"use client";

import { motion } from "framer-motion";
import { Calendar, Building2, UserCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HealthScoreGauge } from "./health-score-gauge";
import type { Module1Overview } from "@/lib/types";

function formatGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(date);
}

export function WelcomeHeader({ data }: { data: Module1Overview }) {
  const date = new Date(data.greeting.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/[0.04] via-transparent to-emerald-500/[0.04]" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-slate-900/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl" />
        <CardContent className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">
              {formatGreeting(date)}, {data.greeting.firstName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-400" />
                {data.greeting.schoolName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCircle2 className="h-4 w-4 text-slate-400" />
                {data.greeting.role.replace(/_/g, " ")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {formatLongDate(date)}
              </span>
            </div>
          </div>
          <HealthScoreGauge
            score={data.schoolHealthScore.score}
            category={data.schoolHealthScore.category}
            delta={data.schoolHealthScore.delta}
            className="md:justify-self-end"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
