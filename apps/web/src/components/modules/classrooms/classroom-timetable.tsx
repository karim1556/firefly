"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TimetableSlot } from "@/lib/types";
import { Calendar, Sparkles, Sun } from "lucide-react";
import { toast } from "sonner";

interface ClassroomTimetableProps {
  timetable: TimetableSlot[];
  classTeacherName?: string | null;
  onRequestSEL?: (day: string, period: number) => Promise<void>;
}

const DAYS: Array<"Mon" | "Tue" | "Wed" | "Thu" | "Fri"> = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const TYPE_STYLES: Record<string, { wrap: string; badge?: "success" | "info" | "default" }> = {
  ACADEMIC: { wrap: "bg-white border-zinc-200" },
  SEL: { wrap: "bg-emerald-50 border-emerald-200", badge: "success" },
  FREE: { wrap: "bg-amber-50 border-amber-200 border-dashed", badge: "info" },
  BREAK: { wrap: "bg-zinc-50 border-zinc-200" },
};

export function ClassroomTimetable({ timetable, classTeacherName, onRequestSEL }: ClassroomTimetableProps) {
  const [view, setView] = useState<"day" | "week">("week");
  const [activeDay, setActiveDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri">("Mon");
  const [requesting, setRequesting] = useState<string | null>(null);

  const byDay = DAYS.reduce<Record<string, TimetableSlot[]>>((acc, d) => {
    acc[d] = timetable.filter((s) => s.day === d).sort((a, b) => a.period - b.period);
    return acc;
  }, {});

  const allPeriods = Array.from(new Set(timetable.map((s) => s.period))).sort();
  const daySlots = byDay[activeDay] ?? [];

  const handleRequestSEL = async (day: string, period: number) => {
    const key = `${day}-${period}`;
    if (requesting) return;
    setRequesting(key);
    try {
      if (onRequestSEL) {
        await onRequestSEL(day, period);
      }
      toast.success(`SEL request sent for ${day} Period ${period}`, {
        description: "School Coordinator will review and approve.",
      });
    } catch {
      toast.error("Failed to send SEL request");
    } finally {
      setRequesting(null);
    }
  };

  if (timetable.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-zinc-500">
          <Calendar className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
          No timetable uploaded for this class yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Class Timetable
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            {classTeacherName ? `Class Teacher: ${classTeacherName}` : "Weekly schedule with SEL sessions highlighted"}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 text-xs">
          <button
            onClick={() => setView("day")}
            className={`rounded-md px-3 py-1 font-medium ${view === "day" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`rounded-md px-3 py-1 font-medium ${view === "week" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
          >
            Week
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "day" && (
          <>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeDay === d
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {daySlots.map((slot) => (
                <SlotRow key={`${slot.day}-${slot.period}`} slot={slot} onRequestSEL={handleRequestSEL} />
              ))}
            </div>
          </>
        )}

        {view === "week" && (
          <div className="overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-[80px_repeat(5,1fr)] gap-1.5">
              <div />
              {DAYS.map((d) => (
                <div key={d} className="rounded-md bg-zinc-50 px-2 py-1.5 text-center text-xs font-medium text-zinc-600">
                  {d}
                </div>
              ))}
              {allPeriods.map((period) => (
                <FragmentRow key={period} period={period} byDay={byDay} onRequestSEL={handleRequestSEL} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50" />
            SEL Session
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-dashed border-amber-300 bg-amber-50" />
            Free Period
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-zinc-200 bg-white" />
            Academic
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SlotRow({ slot, onRequestSEL }: { slot: TimetableSlot; onRequestSEL: (d: string, p: number) => void | Promise<void> }) {
  const style = TYPE_STYLES[slot.type] ?? TYPE_STYLES.ACADEMIC;
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${style.wrap}`}>
      <div className="w-20 shrink-0 text-xs">
        <p className="font-semibold text-zinc-900">P{slot.period}</p>
        <p className="text-zinc-500">{slot.time}</p>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-900">{slot.subject}</p>
        <p className="text-xs text-zinc-500">{slot.teacherName ?? "—"}</p>
      </div>
      <div className="flex items-center gap-2">
        {slot.type === "SEL" && (
          <Badge variant="success" className="gap-1">
            <Sparkles className="h-3 w-3" /> SEL
          </Badge>
        )}
        {slot.type === "FREE" && (
          <button
            onClick={() => onRequestSEL(slot.day, slot.period)}
            className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
          >
            Request SEL
          </button>
        )}
      </div>
    </div>
  );
}

function FragmentRow({
  period,
  byDay,
  onRequestSEL,
}: {
  period: number;
  byDay: Record<string, TimetableSlot[]>;
  onRequestSEL: (d: string, p: number) => void | Promise<void>;
}) {
  return (
    <>
      <div className="flex items-center justify-center text-xs text-zinc-500">P{period}</div>
      {DAYS.map((d) => {
        const slot = byDay[d]?.find((s) => s.period === period);
        if (!slot) return <div key={`${d}-${period}`} className="rounded-md bg-zinc-50/50" />;
        const style = TYPE_STYLES[slot.type] ?? TYPE_STYLES.ACADEMIC;
        return (
          <div
            key={`${d}-${period}`}
            className={`rounded-md border p-1.5 text-[11px] ${style.wrap} ${slot.type === "FREE" ? "cursor-pointer hover:bg-amber-100" : ""}`}
            onClick={() => slot.type === "FREE" && onRequestSEL(d, period)}
          >
            <div className="flex items-center justify-between gap-1">
              <p className="truncate font-medium text-zinc-900" title={slot.subject}>{slot.subject}</p>
              {slot.type === "SEL" && <Sparkles className="h-3 w-3 shrink-0 text-emerald-600" />}
              {slot.type === "FREE" && <Sun className="h-3 w-3 shrink-0 text-amber-600" />}
            </div>
            <p className="truncate text-[10px] text-zinc-500" title={slot.teacherName ?? ""}>
              {slot.teacherName ?? "—"}
            </p>
            <p className="text-[10px] text-zinc-400">{slot.time}</p>
          </div>
        );
      })}
    </>
  );
}
