"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentSummary, FlagEntry } from "@/lib/types";
import { Search, Filter } from "lucide-react";

type FilterType = "ALL" | "FLAGGED" | "AT_RISK" | "HIGH_PERFORMING" | "RECENT_OBSERVATIONS";

interface StudentRosterProps {
  students: StudentSummary[];
  flags: FlagEntry[];
  onSelectStudent: (student: StudentSummary) => void;
  onObserve: (student: StudentSummary) => void;
  onFlag: (student: StudentSummary) => void;
  selectedStudentId?: string;
}

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: "All",
  FLAGGED: "Flagged",
  AT_RISK: "At Risk",
  HIGH_PERFORMING: "High Performing",
  RECENT_OBSERVATIONS: "Recent Obs.",
};

const STATUS_LABELS: Record<string, string> = {
  STABLE: "Healthy",
  NEEDS_SUPPORT: "Needs Attention",
  NEEDS_INTERVENTION: "Under Review",
};

export function StudentRoster({
  students,
  flags,
  onSelectStudent,
  onObserve,
  onFlag,
  selectedStudentId,
}: StudentRosterProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ALL");

  const flaggedIds = new Set(flags.filter(f => f.status === "OPEN").map(f => f.studentId));

  let filtered = students;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    );
  }
  if (filter === "FLAGGED") {
    filtered = filtered.filter(s => flaggedIds.has(s.id));
  } else if (filter === "AT_RISK") {
    filtered = filtered.filter(s => s.tier === "TIER_3" || s.status === "NEEDS_INTERVENTION");
  } else if (filter === "HIGH_PERFORMING") {
    filtered = filtered.filter(s => s.tier === "TIER_1" && s.status === "STABLE");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {f !== "ALL" && <Filter className="h-3 w-3" />}
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-zinc-500">No students found</p>
        ) : (
          filtered.map(s => {
            const isFlagged = flaggedIds.has(s.id);
            const isSelected = s.id === selectedStudentId;
            return (
              <Card
                key={s.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-zinc-900" : ""
                } ${isFlagged ? "border-red-200 bg-red-50/30" : ""}`}
                onClick={() => onSelectStudent(s)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">
                        {s.firstName} {s.lastName}
</p>
                      <p className="text-xs text-zinc-500">Grade {s.grade} · {s.classroom}</p>
                    </div>
                    {isFlagged && (
                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Flagged
                      </span>
                    )}
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      variant={
                        s.tier === "TIER_3"
                          ? "danger"
                          : s.tier === "TIER_2"
                          ? "warning"
                          : "success"
                      }
                    >
                      {s.tier.replace("TIER_", "Tier ")}
                    </Badge>
                    <Badge
                      variant={
                        s.status === "STABLE"
                          ? "success"
                          : s.status === "NEEDS_INTERVENTION"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {STATUS_LABELS[s.status] ?? s.status}
                    </Badge>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>Risk Score: {s.riskScore}</span>
                    <span>{s._count.cases} case{s._count.cases !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); onObserve(s); }}
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
 >
                      Observe
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); onFlag(s); }}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${
                        isFlagged
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {isFlagged ? "Flagged" : "Raise Flag"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
