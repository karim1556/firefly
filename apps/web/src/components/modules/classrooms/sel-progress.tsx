"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SELProgress } from "@/lib/types";

interface SELProgressProps {
  progress: SELProgress;
  studentName?: string;
  showDetails?: boolean;
}

export function SELProgressCard({ progress, studentName, showDetails = true }: SELProgressProps) {
  const { assigned, completed, pending } = progress;
  const total = assigned;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {studentName ? `${studentName}'s SEL Progress` : "Classroom SEL Progress"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-zinc-600">Overall Completion</span>
            <span className="font-medium text-zinc-900">{completionRate}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        {showDetails && (
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-zinc-900">{assigned}</p>
              <p className="text-xs text-zinc-500">Assigned</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-emerald-600">{completed}</p>
              <p className="text-xs text-zinc-500">Completed</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-amber-600">{pending}</p>
              <p className="text-xs text-zinc-500">Pending</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
