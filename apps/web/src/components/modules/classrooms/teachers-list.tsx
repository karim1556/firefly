"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Teacher } from "@/lib/types";
import { GraduationCap, UserCircle2 } from "lucide-react";

interface TeachersListProps {
  teachers: Teacher[];
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

export function TeachersList({ teachers }: TeachersListProps) {
  if (!teachers || teachers.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-zinc-500">
          <UserCircle2 className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
          No teachers assigned to this class
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="h-4 w-4 text-indigo-600" />
          Class Teachers
        </CardTitle>
        <p className="text-xs text-zinc-500">Class teacher and subject teachers assigned to this class.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={t.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  t.isClassTeacher ? "border-indigo-200 bg-indigo-50/40" : "border-zinc-200 bg-white"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${color}`}>
                  {t.initials || t.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-zinc-900">{t.fullName}</p>
                  </div>
                  <p className="truncate text-xs text-zinc-500">{t.subject ?? "—"}</p>
                </div>
                {t.isClassTeacher && (
                  <Badge variant="info" className="shrink-0">CT</Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
