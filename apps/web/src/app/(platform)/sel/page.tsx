"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, BookOpen, Calendar, Clock, Target, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type SELSession = {
  id: string;
  title: string;
  description: string;
  grade: string;
  date: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  completedBy: number;
  totalStudents: number;
  competencies: string[];
};

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "success" as const;
    case "in_progress": return "info" as const;
    case "planned": return "warning" as const;
    case "cancelled": return "danger" as const;
    default: return "info" as const;
  }
};

export default function SELPlannerPage() {
  const { authFetch } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const query = useQuery({
    queryKey: ["sel-sessions"],
    queryFn: () => authFetch<SELSession[]>("/sel/sessions")
  });

  const sessions = (query.data ?? []).filter((s) => filter === "all" || s.status === filter);

  const stats = {
    total: (query.data ?? []).length,
    completed: (query.data ?? []).filter((s) => s.status === "completed").length,
    inProgress: (query.data ?? []).filter((s) => s.status === "in_progress").length,
    planned: (query.data ?? []).filter((s) => s.status === "planned").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Planner"
        description="Design, schedule, and track Social-Emotional Learning curriculum across all grades."
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-slate-700" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BadgeCheck className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.planned}</p>
              <p className="text-xs text-slate-500">Planned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "planned", "in_progress", "completed", "cancelled"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Sessions Grid */}
      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : sessions.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{session.title}</p>
                    <p className="text-xs text-slate-500">{session.description.slice(0, 80)}...</p>
                  </div>
                  <Badge variant={statusVariant(session.status)}>
                    {session.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.competencies.map((c) => (
                    <Badge key={c} variant="default">
                      {c}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    <span>Grade {session.grade}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{session.completedBy}/{session.totalStudents}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No SEL sessions" description="Create your first SEL curriculum session to get started." />
      )}
    </div>
  );
}