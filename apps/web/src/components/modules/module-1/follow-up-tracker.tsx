"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock, Calendar as CalendarIcon, AlertCircle, Check, RotateCcw, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { FollowUpItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Bucket = { key: "dueToday" | "dueThisWeek" | "overdue"; title: string; tone: string; icon: React.ComponentType<{ className?: string }> };

const BUCKETS: Bucket[] = [
  { key: "dueToday", title: "Due Today", tone: "from-amber-50 to-amber-50/40 border-amber-200/60 text-amber-700", icon: Clock },
  { key: "dueThisWeek", title: "Due This Week", tone: "from-sky-50 to-sky-50/40 border-sky-200/60 text-sky-700", icon: CalendarIcon },
  { key: "overdue", title: "Overdue", tone: "from-red-50 to-red-50/40 border-red-200/60 text-red-700", icon: AlertCircle },
];

export function FollowUpTracker({
  followUps
}: {
  followUps: { dueToday: FollowUpItem[]; dueThisWeek: FollowUpItem[]; overdue: FollowUpItem[] };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">Follow-Up Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {BUCKETS.map((b, i) => {
            const list = followUps[b.key];
            const Icon = b.icon;
            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn("rounded-xl border bg-gradient-to-br p-4", b.tone)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider">{b.title}</p>
                  </div>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold text-slate-800">
                    {list.length}
                  </span>
                </div>
                {list.length === 0 ? (
                  <p className="text-xs text-slate-500">Nothing here.</p>
                ) : (
                  <ul className="space-y-2">
                    {list.map((it) => (
                      <li
                        key={it.id}
                        className="rounded-lg border border-white/60 bg-white/85 p-3 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-slate-800">{it.studentName}</p>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400">
                          {formatDate(it.scheduledAt)}
                        </p>
                        {it.notes && <p className="mt-1 text-xs text-slate-500">{it.notes}</p>}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
                            <Check className="mr-1 h-3 w-3" />Complete
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
                            <RotateCcw className="mr-1 h-3 w-3" />Reschedule
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                            <Eye className="mr-1 h-3 w-3" />View
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
