"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ObservationType } from "@/lib/types";

interface ObservationModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  onSubmit: (data: { type: ObservationType; severity: "LOW" | "MEDIUM" | "HIGH"; notes: string }) => void;
}

const OBSERVATION_TYPES: { value: ObservationType; label: string }[] = [
  { value: "BEHAVIOURAL", label: "Behavioural" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "SOCIAL", label: "Social" },
  { value: "EMOTIONAL", label: "Emotional" },
  { value: "ATTENDANCE", label: "Attendance" },
];

export function ObservationModal({ open, onClose, studentName, onSubmit }: ObservationModalProps) {
  const [type, setType] = useState<ObservationType>("BEHAVIOURAL");
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ type, severity, notes });
      setNotes("");
      setType("BEHAVIOURAL");
      setSeverity("LOW");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add Observation — ${studentName}`}>
<form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Observation Type</label>
          <Select value={type} onChange={e => setType(e.target.value as ObservationType)}>
            {OBSERVATION_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Severity</label>
          <Select value={severity} onChange={e => setSeverity(e.target.value as "LOW" | "MEDIUM" | "HIGH")}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Description</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe what you observed..."
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading || !notes.trim()}>{loading ? "Saving..." : "Save Observation"}</Button>
        </div>
      </form>
    </Modal>
  );
}
