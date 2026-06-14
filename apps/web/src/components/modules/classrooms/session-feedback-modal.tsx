"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SELSessionDetailed, SessionFeedback } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface SessionFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  session: SELSessionDetailed;
  onSubmit: (feedback: Omit<SessionFeedback, "submittedAt" | "submittedBy">) => void;
}

export function SessionFeedbackModal({ open, onClose, session, onSubmit }: SessionFeedbackModalProps) {
  const [studentEngagement, setStudentEngagement] = useState<SessionFeedback["studentEngagement"]>("High");
  const [learningUnderstanding, setLearningUnderstanding] = useState<SessionFeedback["learningUnderstanding"]>("Strong");
  const [emotionalClimate, setEmotionalClimate] = useState<SessionFeedback["emotionalClimate"]>("Open & Receptive");
  const [followUpNeed, setFollowUpNeed] = useState<SessionFeedback["followUpNeed"]>("No Concerns");
  const [planCompletion, setPlanCompletion] = useState<SessionFeedback["planCompletion"]>("Yes");
  const [activityCompletion, setActivityCompletion] = useState<SessionFeedback["activityCompletion"]>("Yes");
  const [activityQuality, setActivityQuality] = useState<SessionFeedback["activityQuality"]>("Good");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        studentEngagement,
        learningUnderstanding,
        emotionalClimate,
        followUpNeed,
        planCompletion,
        activityCompletion,
        activityQuality,
        notes: notes.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Session Feedback — ${session.topic}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
          <Sparkles className="mr-1 inline h-3 w-3" />
          This feedback trains our AI-generation pipeline. Please complete both parts.
        </p>

        {/* Part 1 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">Part 1 — Session quality</h3>
          <div className="space-y-3">
            <Field label="Student Engagement">
              <Select value={studentEngagement} onChange={(e) => setStudentEngagement(e.target.value as SessionFeedback["studentEngagement"])}>
                <option>High</option><option>Moderate</option><option>Minimal</option>
                <option>Resistant</option><option>Mixed</option>
              </Select>
            </Field>
            <Field label="Learning & Concept Understanding">
              <Select value={learningUnderstanding} onChange={(e) => setLearningUnderstanding(e.target.value as SessionFeedback["learningUnderstanding"])}>
                <option>Strong</option><option>Basic</option><option>Partial</option>
                <option>Poor</option><option>Needs Reinforcement</option>
              </Select>
            </Field>
            <Field label="Emotional Climate / Responsiveness">
              <Select value={emotionalClimate} onChange={(e) => setEmotionalClimate(e.target.value as SessionFeedback["emotionalClimate"])}>
                <option>Open & Receptive</option><option>Mixed / Neutral</option>
                <option>Resistant / Disengaged</option><option>Anxious / Restless</option>
                <option>Low Mood</option><option>Emotionally Reactive</option>
              </Select>
            </Field>
            <Field label="Follow-up Need / Concern Flag">
              <Select value={followUpNeed} onChange={(e) => setFollowUpNeed(e.target.value as SessionFeedback["followUpNeed"])}>
                <option>No Concerns</option><option>Monitoring Needed</option>
                <option>Immediate Follow-Up Recommended</option>
              </Select>
            </Field>
          </div>
        </div>

        {/* Part 2 */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">Part 2 — Plan & activity completion</h3>
          <div className="space-y-3">
            <Field label="Session plan completion">
              <Select value={planCompletion} onChange={(e) => setPlanCompletion(e.target.value as SessionFeedback["planCompletion"])}>
                <option>Yes</option><option>Rushed / Partial</option><option>No</option>
              </Select>
            </Field>
            <Field label="Activity completion">
              <Select value={activityCompletion} onChange={(e) => setActivityCompletion(e.target.value as SessionFeedback["activityCompletion"])}>
                <option>Yes</option><option>Rushed / Partial</option><option>No</option>
              </Select>
            </Field>
            <Field label="Activity quality">
              <Select value={activityQuality} onChange={(e) => setActivityQuality(e.target.value as SessionFeedback["activityQuality"])}>
                <option>Good</option><option>Average / Can Improve</option><option>Low</option>
              </Select>
            </Field>
          </div>
        </div>

        <Field label="Optional notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any additional observations..." />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Submit feedback & mark complete"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  );
}
