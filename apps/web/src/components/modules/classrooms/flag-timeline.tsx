"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ObservationEntry, FlagEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Clock, CheckCircle } from "lucide-react";

interface FlagTimelineProps {
  observations: ObservationEntry[];
  flags: FlagEntry[];
}

const TYPE_LABELS: Record<string, string> = {
  BEHAVIOURAL: "Behavioural",
  ACADEMIC: "Academic",
  SOCIAL: "Social",
  EMOTIONAL: "Emotional",
  ATTENDANCE: "Attendance",
  EMOTIONAL_DISTRESS: "Emotional Distress",
  BULLYING: "Bullying",
  ATTENDANCE_ISSUES: "Attendance Issues",
  ACADEMIC_DECLINE: "Academic Decline",
  SOCIAL_ISOLATION: "Social Isolation",
};

export function FlagTimeline({ observations, flags }: FlagTimelineProps) {
  const items: Array<{
    id: string;
    type: "OBSERVATION" | "FLAG";
    date: string;
    title: string;
    description: string;
    meta?: string;
    status?: string;
  }> = [
    ...observations.map(o => ({
      id: o.id,
      type: "OBSERVATION" as const,
      date: o.createdAt,
      title: `Observation — ${TYPE_LABELS[o.type] ?? o.type}`,
      description: o.notes,
      meta: `Severity: ${o.severity} · By ${o.createdBy}`,
    })),
    ...flags.map(f => ({
      id: f.id,
      type: "FLAG" as const,
      date: f.createdAt,
      title: `Flag — ${TYPE_LABELS[f.category] ?? f.category}`,
      description: f.notes,
      meta: `Priority: ${f.priority} · By ${f.createdBy}`,
      status: f.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-zinc-500">
          No observations or flags recorded yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          <div className="absolute left-3 top-0 h-full w-px bg-zinc-200" />
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="relative pl-9">
                <div
                  className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${
                    item.type === "FLAG"
                      ? item.status === "RESOLVED"
                        ? "bg-green-100"
                        : "bg-red-100"
                      : "bg-zinc-100"
                  }`}
                >
                  {item.type === "FLAG" && item.status === "RESOLVED" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Clock className={`h-3.5 w-3.5 ${item.type === "FLAG" ? "text-red-600" : "text-zinc-500"}`} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{item.title}</span>
                    {item.type === "FLAG" && (
                      <Badge
                        variant={
                          item.status === "RESOLVED"
                            ? "success"
                            : (item.description.includes("CRITICAL") || item.description.includes("High"))
                            ? "danger"
                            : "warning"
                        }
                      >
                        {item.status === "RESOLVED" ? "Resolved" : "Open"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600">{item.description}</p>
                  <p className="text-xs text-zinc-400">{item.meta} · {formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
