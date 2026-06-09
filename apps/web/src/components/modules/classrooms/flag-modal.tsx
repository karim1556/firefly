"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FlagCategory, FlagPriority } from "@/lib/types";

interface FlagModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  onSubmit: (data: { category: FlagCategory; priority: FlagPriority; notes: string }) => void;
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ category, priority, notes });
      setNotes("");
      setCategory("EMOTIONAL_DISTRESS");
      setPriority("MEDIUM");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Raise Concern — ${studentName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Notes</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe the concern..."
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="danger" disabled={loading || !notes.trim()}>
            {loading ? "Raising..." : "Raise Concern"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
