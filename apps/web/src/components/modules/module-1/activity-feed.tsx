"use client";

import { motion } from "framer-motion";
import {
  Activity, ClipboardPlus, FileText, AlertTriangle, BookOpen, CheckCircle2, MessageSquare,
  Flag, Users, ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  OBSERVATION_ADDED: { icon: MessageSquare, tone: "from-sky-100 to-sky-200/60 text-sky-600 border-sky-200/60" },
  CASE_CREATED: { icon: ClipboardPlus, tone: "from-violet-100 to-violet-200/60 text-violet-600 border-violet-200/60" },
  CASE_UPDATED: { icon: ClipboardList, tone: "from-violet-100 to-violet-200/60 text-violet-600 border-violet-200/60" },
  REFERRAL_SUBMITTED: { icon: Flag, tone: "from-amber-100 to-amber-200/60 text-amber-600 border-amber-200/60" },
  CRISIS_REPORTED: { icon: AlertTriangle, tone: "from-red-100 to-red-200/60 text-red-600 border-red-200/60" },
  WORKSHOP_COMPLETED: { icon: BookOpen, tone: "from-emerald-100 to-emerald-200/60 text-emerald-600 border-emerald-200/60" },
  POLICY_PUBLISHED: { icon: FileText, tone: "from-slate-100 to-slate-200/60 text-slate-600 border-slate-200/60" },
  SESSION_COMPLETED: { icon: CheckCircle2, tone: "from-emerald-100 to-emerald-200/60 text-emerald-600 border-emerald-200/60" },
  CHECK_IN: { icon: Users, tone: "from-sky-100 to-sky-200/60 text-sky-600 border-sky-200/60" },
};

const FALLBACK = { icon: Activity, tone: "from-slate-100 to-slate-200/60 text-slate-600 border-slate-200/60" };

export function ActivityFeed({ events }: { events: Array<{ id: string; type: string; title: string; subtitle: string; createdAt: string }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <Activity className="h-4 w-4 text-slate-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="No recent activity" description="Platform events will appear here." />
        ) : (
          <ul className="space-y-3">
            {events.map((e, i) => {
              const meta = ICON_MAP[e.type] ?? FALLBACK;
              const Icon = meta.icon;
              return (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60 p-3.5"
                >
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border bg-gradient-to-br", meta.tone)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{e.title}</p>
                    <p className="truncate text-xs text-slate-500">{e.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-slate-400">
                    {formatDate(e.createdAt)}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
