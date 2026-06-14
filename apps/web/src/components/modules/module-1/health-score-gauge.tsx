"use client";

import { motion } from "framer-motion";
import type { HealthScoreCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<HealthScoreCategory, string> = {
  EXCELLENT: "Excellent",
  HEALTHY: "Healthy",
  NEEDS_ATTENTION: "Needs Attention",
  CRITICAL: "Critical",
};

const CATEGORY_TONE: Record<HealthScoreCategory, { stroke: string; chip: string; soft: string }> = {
  EXCELLENT: { stroke: "#10b981", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", soft: "from-emerald-500/10" },
  HEALTHY: { stroke: "#22c55e", chip: "bg-green-50 text-green-700 border-green-200", soft: "from-green-500/10" },
  NEEDS_ATTENTION: { stroke: "#f59e0b", chip: "bg-amber-50 text-amber-700 border-amber-200", soft: "from-amber-500/10" },
  CRITICAL: { stroke: "#ef4444", chip: "bg-red-50 text-red-700 border-red-200", soft: "from-red-500/10" },
};

const SIZE = 168;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export function HealthScoreGauge({
  score,
  category,
  delta,
  className
}: {
  score: number;
  category: HealthScoreCategory;
  delta: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = CIRC * (1 - clamped / 100);
  const tone = CATEGORY_TONE[category];

  return (
    <div className={cn("relative flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: SIZE, height: SIZE }} aria-label={`School wellbeing score ${clamped} of 100, ${CATEGORY_LABEL[category]}`} role="img">
        <div className={cn("pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br to-transparent blur-2xl", tone.soft)} />
        <svg width={SIZE} height={SIZE} className="relative -rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="#e2e8f0" strokeWidth={STROKE} fill="none" />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={tone.stroke}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Health Score</span>
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{clamped}</span>
          <span className="text-[10px] font-medium text-slate-400">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider", tone.chip)}>
          {CATEGORY_LABEL[category]}
        </span>
        <span className={cn("text-xs font-semibold", delta >= 0 ? "text-emerald-600" : "text-red-600")}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs last term
        </span>
      </div>
    </div>
  );
}
