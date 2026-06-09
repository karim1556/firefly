"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FlagCategory, FlagPriority } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface FlagModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  onSubmit: (data: { category: FlagCategory; priority: FlagPriority; notes: string; requestCounsellor?: boolean }) => void;
}

const CATEGORIES: { value: FlagCategory; label: string }[] = [
  { value: "EMOTIONAL_DISTRESS", label: "Emotional Distress" },
  { value: "BULLYING", label: "Bullying" },
  { value: "ATTENDANCE_ISSUES", label: "Attendance Issues" },
  { value: "ACADEMIC_DECLINE", label: "Academic Decline" },
  { value: "SOCIAL_ISOLATION", label: "Social Isolation" },
];

export function FlagModal({ open, onClose, studentName, onSubmit }: FlagModalProps) {
  const [category, setCategory] = useState<FlagCategory>("EMOTIONAL_DISTRESS");
  const [priority, setPriority] = useState<FlagPriority>("MEDIUM");
  const [notes, setNotes] = useState("");
  const [requestCounsellor, setRequestCounsellor] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = notes.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onSubmit({ category, priority, notes, requestCounsellor });
      setNotes("");
      setCategory("EMOTIONAL_DISTRESS");
      setPriority("MEDIUM");
      setRequestCounsellor(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Raise Concern — ${studentName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>Select Flag if a counsellor visit and input is required.</strong> If not, please proceed to submit an observation instead.
            </span>
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Category</label>
          <Select value={category} onChange={e => setCategory(e.target.value as FlagCategory)}>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Priority</label>
          <Select value={priority} onChange={e => setPriority(e.target.value as FlagPriority)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Notes <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe the concern with context (date, time, place)..."
            required
            rows={4}
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Notes and category are the minimum required for submitting. Include date, time, and place for full attribution.
          </p>
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 cursor-pointer hover:bg-zinc-100">
          <input
            type="checkbox"
            checked={requestCounsellor}
            onChange={e => setRequestCounsellor(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm">
            <span className="font-medium text-zinc-900">I want a counsellor to visit this student</span>
            <p className="text-xs text-zinc-500">
              The assigned school counsellor will be notified and must visit the student. Required for Tier 3 escalations.
            </p>
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="danger" disabled={loading || !canSubmit}>
            {loading ? "Raising..." : "Raise Concern"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
