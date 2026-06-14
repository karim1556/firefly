"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, CheckCircle2, Clock, Circle, Lock } from "lucide-react";
import { toast } from "sonner";
import type { IEP, IEPFeedback, IEPFeedbackProgress } from "@/lib/types";

interface IEPSectionProps {
  studentId: string;
  iep: IEP | null;
  feedback: IEPFeedback[];
}

const GOAL_STATUS: Record<string, { variant: "success" | "warning" | "default"; label: string; icon: typeof CheckCircle2 }> = {
  ACHIEVED: { variant: "success", label: "Achieved", icon: CheckCircle2 },
  IN_PROGRESS: { variant: "warning", label: "In Progress", icon: Clock },
  NOT_STARTED: { variant: "default", label: "Not Started", icon: Circle },
};

const PROGRESS_OPTIONS: Array<{ value: IEPFeedbackProgress; label: string }> = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ACHIEVED", label: "Achieved" },
];

export function IEPSection({ studentId, iep, feedback }: IEPSectionProps) {
  const qc = useQueryClient();
  const { authFetch } = useAuth();
  const [open, setOpen] = useState(false);
  const [goalId, setGoalId] = useState<string>("");
  const [progress, setProgress] = useState<IEPFeedbackProgress>("IN_PROGRESS");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!iep) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-zinc-500" />
            Individual Education Plan (IEP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No IEP uploaded for this student"
            description="If this student is assigned an IEP by the counsellor, goals and feedback will appear here."
          />
        </CardContent>
      </Card>
    );
  }

  const openModal = () => {
    setGoalId(iep.goals[0]?.id ?? "");
    setProgress("IN_PROGRESS");
    setComment("");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!goalId) {
      toast.error("Select a goal");
      return;
    }
    setSubmitting(true);
    try {
      await authFetch(`/students/${studentId}/iep-feedback`, {
        method: "POST",
        body: JSON.stringify({ goalId, progress, comment }),
      });
      toast.success("IEP feedback saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["student", studentId] });
    } catch {
      toast.error("Unable to save feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-indigo-600" />
            Individual Education Plan
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            {iep.title} · Uploaded by {iep.uploadedBy} on {formatDate(iep.createdAt)}
          </p>
          {iep.consentLogged && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
              <Lock className="h-3 w-3" />
              Parent consent logged
            </p>
          )}
        </div>
        <Button size="sm" onClick={openModal} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Feedback
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {iep.goals.map((g) => {
            const cfg = GOAL_STATUS[g.status] ?? GOAL_STATUS.NOT_STARTED;
            const Icon = cfg.icon;
            const goalFeedback = feedback.filter((f) => f.goalId === g.id);
            return (
              <div key={g.id} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">{g.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{g.description}</p>
                    {g.accommodation && (
                      <p className="mt-1 text-[11px] text-zinc-500">
                        <span className="font-medium">Accommodation:</span> {g.accommodation}
                      </p>
                    )}
                  </div>
                  <Badge variant={cfg.variant} className="gap-1">
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </Badge>
                </div>
                {goalFeedback.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-2">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Recent feedback</p>
                    {goalFeedback.slice(0, 3).map((f) => (
                      <div key={f.id} className="rounded-lg bg-white p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-700">{f.submittedBy}</span>
                          <span className="text-zinc-400">{formatDate(f.submittedAt)}</span>
                        </div>
                        {f.comment && <p className="mt-1 text-zinc-600">{f.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Modal open={open} onClose={() => setOpen(false)} title="Add IEP Feedback">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Goal</label>
            <Select value={goalId} onChange={(e) => setGoalId(e.target.value)}>
              {iep.goals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Progress</label>
            <Select value={progress} onChange={(e) => setProgress(e.target.value as IEPFeedbackProgress)}>
              {PROGRESS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you observe? What's working, what needs more support?"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting || !goalId}>
              {submitting ? "Saving..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
