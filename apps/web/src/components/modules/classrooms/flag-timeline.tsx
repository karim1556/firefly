"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { Clock, CheckCircle, CheckCheck, Edit3 } from "lucide-react";
import { toast } from "sonner";
import type { ObservationEntry, FlagEntry } from "@/lib/types";

interface FlagTimelineProps {
  observations: ObservationEntry[];
  flags: FlagEntry[];
  classroomId?: string;
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

const RESOLVE_ROLES = new Set(["COUNSELLOR", "SCHOOL_ADMIN", "PRINCIPAL", "ADMIN", "SUPER_ADMIN", "VICE_PRINCIPAL"]);

export function FlagTimeline({ observations, flags, classroomId }: FlagTimelineProps) {
  const qc = useQueryClient();
  const { user, authFetch } = useAuth();
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolveFlag, setResolveFlag] = useState<FlagEntry | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canResolve = !!user?.role && RESOLVE_ROLES.has(user.role);

  const items: Array<{
    id: string;
    type: "OBSERVATION" | "FLAG" | "FLAG_UPDATE";
    date: string;
    title: string;
    description: string;
    meta?: string;
    status?: string;
    priority?: string;
  }> = [
    ...observations.map(o => ({
      id: o.id,
      type: "OBSERVATION" as const,
      date: o.createdAt,
      title: `Observation — ${TYPE_LABELS[o.type] ?? o.type}`,
      description: o.notes,
      meta: `Severity: ${o.severity} · By ${o.createdBy}`,
    })),
    ...flags.flatMap(f => {
      const entries: Array<{
        id: string;
        type: "FLAG" | "FLAG_UPDATE";
        date: string;
        title: string;
        description: string;
        meta?: string;
        status?: string;
        priority?: string;
      }> = [{
        id: f.id,
        type: "FLAG" as const,
        date: f.createdAt,
        title: `Flag — ${TYPE_LABELS[f.category] ?? f.category}`,
        description: f.notes,
        meta: `Priority: ${f.priority} · By ${f.createdBy}`,
        status: f.status,
        priority: f.priority,
      }];
      if (f.updatedAt && f.updatedAt !== f.createdAt) {
        entries.push({
          id: `${f.id}-updated`,
          type: "FLAG_UPDATE" as const,
          date: f.updatedAt,
          title: `Flag Updated — ${TYPE_LABELS[f.category] ?? f.category}`,
          description: `Priority escalated to ${f.priority}`,
          meta: `By ${f.updatedBy ?? "Unknown"}`,
          status: f.status,
          priority: f.priority,
        });
      }
      return entries;
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openResolve = (flag: FlagEntry) => {
    setResolveFlag(flag);
    setResolveNote("");
    setResolveOpen(true);
  };

  const submitResolve = async () => {
    if (!resolveFlag || !classroomId) return;
    if (!resolveNote.trim()) {
      toast.error("Add a resolution note");
      return;
    }
    setSubmitting(true);
    try {
      await authFetch(`/classrooms/${classroomId}/flags/${resolveFlag.id}/resolve`, {
        method: "POST",
        body: JSON.stringify({ resolutionNote: resolveNote }),
      });
      toast.success("Flag resolved");
      setResolveOpen(false);
      qc.invalidateQueries({ queryKey: ["classroom", classroomId] });
    } catch {
      toast.error("Unable to resolve flag");
    } finally {
      setSubmitting(false);
    }
  };

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
                      : item.type === "FLAG_UPDATE"
                      ? "bg-amber-100"
                      : "bg-zinc-100"
                  }`}
                >
                  {item.type === "FLAG" && item.status === "RESOLVED" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  ) : item.type === "FLAG_UPDATE" ? (
                    <Edit3 className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
                    <Clock className={`h-3.5 w-3.5 ${item.type === "FLAG" ? "text-red-600" : "text-zinc-500"}`} />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{item.title}</span>
                    {(item.type === "FLAG" || item.type === "FLAG_UPDATE") && (
                      <Badge
                        variant={
                          item.status === "RESOLVED"
                            ? "success"
                            : item.priority === "CRITICAL" || item.priority === "HIGH"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {item.status === "RESOLVED" ? "Resolved" : item.type === "FLAG_UPDATE" ? "Updated" : "Open"}
                      </Badge>
                    )}
                    {item.type === "FLAG" && item.status !== "RESOLVED" && canResolve && classroomId && (
                      <button
                        onClick={() => {
                          const original = flags.find(f => f.id === item.id);
                          if (original) openResolve(original);
                        }}
                        className="ml-auto flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Resolve
                      </button>
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

      <Modal open={resolveOpen} onClose={() => setResolveOpen(false)} title="Resolve Flag">
        <div className="space-y-4">
          <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
            Resolving a flag is permanent. The flag will be marked as RESOLVED and the assigned counsellor will be notified.
          </p>
          {resolveFlag && (
            <div className="rounded-xl bg-zinc-50 p-3 text-xs">
              <p className="font-medium text-zinc-900">{TYPE_LABELS[resolveFlag.category] ?? resolveFlag.category}</p>
              <p className="mt-1 text-zinc-600">{resolveFlag.notes}</p>
              <p className="mt-1 text-zinc-400">Priority: {resolveFlag.priority} · Raised by {resolveFlag.createdBy}</p>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Resolution note</label>
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="What was done to address this concern? E.g., counsellor met student, family contacted, IEP updated..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setResolveOpen(false)}>Cancel</Button>
            <Button onClick={submitResolve} disabled={submitting || !resolveNote.trim()}>
              {submitting ? "Resolving..." : "Mark Resolved"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
