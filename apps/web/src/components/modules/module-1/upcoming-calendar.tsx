"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT_DOT: Record<CalendarEvent["type"], string> = {
  SEL_SESSION: "bg-slate-900",
  WORKSHOP: "bg-violet-500",
  AWARENESS_CAMPAIGN: "bg-amber-500",
  PARENT_SESSION: "bg-emerald-500",
};

const EVENT_LABEL: Record<CalendarEvent["type"], string> = {
  SEL_SESSION: "SEL Session",
  WORKSHOP: "Workshop",
  AWARENESS_CAMPAIGN: "Awareness Campaign",
  PARENT_SESSION: "Parent Session",
};

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtMonth(d: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(d);
}

export function UpcomingCalendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState<Date>(() => new Date());
  const todayKey = new Date().toISOString().slice(0, 10);

  const eventByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ key: string; day?: number; dateKey?: string }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push({ key: `d-${d}`, day: d, dateKey });
  }
  while (cells.length % 7 !== 0) cells.push({ key: `tail-${cells.length}` });

  const upcoming = useMemo(() => {
    const now = todayKey;
    return events.filter((e) => e.date >= now).slice(0, 5);
  }, [events, todayKey]);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <CalendarIcon className="h-4 w-4 text-slate-500" />
          Upcoming Activities
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center text-sm font-medium text-slate-700">{fmtMonth(cursor)}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="grid grid-cols-7 gap-1 pb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {DOW.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c) => {
              if (c.day == null) return <div key={c.key} className="h-9" />;
              const list = c.dateKey ? eventByDate.get(c.dateKey) ?? [] : [];
              const isToday = c.dateKey === todayKey;
              return (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "relative flex h-9 flex-col items-center justify-center rounded-md text-xs transition-colors",
                    isToday ? "bg-slate-900 font-semibold text-white" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {c.day}
                  {list.length > 0 && (
                    <span className="absolute bottom-1 flex gap-0.5">
                      {list.slice(0, 3).map((e, i) => (
                        <span key={i} className={cn("h-1 w-1 rounded-full", EVENT_DOT[e.type])} aria-hidden />
                      ))}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Next up</p>
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming activities" description="Scheduled sessions and workshops will appear here." />
          ) : (
            <ul className="space-y-2">
              {upcoming.map((e, i) => (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-start gap-3 rounded-lg border border-slate-200/60 bg-white p-3"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-md bg-slate-100 py-1 text-slate-700">
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      {new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(e.date))}
                    </span>
                    <span className="text-base font-bold leading-none">
                      {new Date(e.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{e.title}</p>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">
                      {EVENT_LABEL[e.type]} · {e.time}
                    </p>
                    {e.venue && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {e.venue}
                      </p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
