"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudentSummary, AcademicSnapshot, FlagEntry, ObservationEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { X, GraduationCap, Heart, Activity, TrendingUp } from "lucide-react";

interface StudentProfileCardProps {
  student: StudentSummary;
  academic?: AcademicSnapshot;
  wellbeing?: { selParticipation: number; emotionalWellnessScore: number; riskLevel: string };
  selProgress?: { assigned: number; completed: number; pending: number };
  recentActivity?: { observations: ObservationEntry[]; flags: FlagEntry[]; workshops: string[] };
  onClose: () => void;
}

export function StudentProfileCard({
  student,
  academic,
  wellbeing,
  selProgress,
  recentActivity,
  onClose,
}: StudentProfileCardProps) {
  const completionRate =
    selProgress && selProgress.assigned > 0
      ? Math.round((selProgress.completed / selProgress.assigned) * 100)
      : 0;

  return (
<Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-5 py-3">
        <h3 className="font-semibold text-zinc-900">Student Profile</h3>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-zinc-200">
          <X className="h-4 w-4 text-zinc-500" />
        </button>
      </div>
      <CardContent className="space-y-4 p-5">
        {/* Basic Info */}
        <div>
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-lg font-bold text-zinc-900">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-zinc-500">Grade {student.grade} · {student.classroom}</p>
              <p className="text-xs text-zinc-400">Risk Score: {student.riskScore}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  student.tier === "TIER_3"
                    ? "danger"
                    : student.tier === "TIER_2"
                    ? "warning"
                    : "success"
                }
              >
                {student.tier.replace("TIER_", "Tier ")}
              </Badge>
              <Badge
                variant={
                  student.status === "STABLE"
                    ? "success"
                    : student.status === "NEEDS_INTERVENTION"
                    ? "danger"
                    : "warning"
                }
              >
                {student.status.replace("NEEDS_", "").replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Academic Snapshot */}
        {academic && (
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Academic Snapshot</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-900">{academic.attendancePercent}%</p>
                <p className="text-xs text-blue-600">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-900">{academic.assignmentCompletionPercent}%</p>
                <p className="text-xs text-blue-600">Assignments</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-blue-900 leading-tight">{academic.recentPerformance}</p>
                <p className="text-xs text-blue-600">Performance</p>
              </div>
            </div>
          </div>
        )}

        {/* Wellbeing Snapshot */}
        {wellbeing && (
          <div className="rounded-xl bg-pink-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-900">Wellbeing Snapshot</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-pink-900">{wellbeing.selParticipation}%</p>
                <p className="text-xs text-pink-600">SEL Participation</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-pink-900">{wellbeing.emotionalWellnessScore}</p>
                <p className="text-xs text-pink-600">Wellness Score</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-pink-900">{wellbeing.riskLevel}</p>
                <p className="text-xs text-pink-600">Risk Level</p>
              </div>
            </div>
          </div>
        )}

        {/* SEL Progress */}
        {selProgress && (
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">SEL Progress</span>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-emerald-700">{completionRate}% complete</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-emerald-900">{selProgress.assigned}</p>
                <p className="text-xs text-emerald-600">Assigned</p>
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">{selProgress.completed}</p>
                <p className="text-xs text-emerald-600">Done</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-600">{selProgress.pending}</p>
                <p className="text-xs text-amber-600">Pending</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentActivity && (recentActivity.observations.length > 0 || recentActivity.flags.length > 0) && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-500" />
              <span className="text-sm font-medium text-zinc-700">Recent Activity</span>
            </div>
            <div className="space-y-2">
              {recentActivity.observations.slice(0, 3).map(o => (
                <div key={o.id} className="flex items-start gap-2 rounded-lg bg-zinc-50 p-2.5">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-zinc-700">{o.type} — {o.severity}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1">{o.notes}</p>
                    <p className="text-xs text-zinc-400">{formatDate(o.createdAt)}</p>
                  </div>
                </div>
              ))}
              {recentActivity.flags.slice(0, 2).map(f => (
                <div key={f.id} className="flex items-start gap-2 rounded-lg bg-red-50 p-2.5">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-red-400" />
                  <div>
                    <p className="text-xs font-medium text-red-700">{f.category} — {f.priority}</p>
                    <p className="text-xs text-red-500 line-clamp-1">{f.notes}</p>
                    <p className="text-xs text-red-400">{formatDate(f.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
