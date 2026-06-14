"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle2, Plus, Star, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { Workshop, WorkshopDashboardStats } from "@/lib/types";
import { useRouter } from "next/navigation";

const categoryLabel: Record<string, string> = {
  BULLYING_PREVENTION: "Bullying Prevention",
  CAREER_GUIDANCE: "Career Guidance",
  MENTAL_HEALTH_AWARENESS: "Mental Health Awareness",
  DIGITAL_SAFETY: "Digital Safety",
  STRESS_MANAGEMENT: "Stress Management",
  PARENT_AWARENESS: "Parent Awareness",
  TEACHER_WELLNESS: "Teacher Wellness",
};

const statusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED": return "success" as const;
    case "SCHEDULED": return "info" as const;
    case "CANCELLED": return "danger" as const;
    case "DRAFT": return "warning" as const;
    default: return "info" as const;
  }
};

export default function WorkshopsPage() {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");

  const statsQuery = useQuery({
    queryKey: ["workshops-dashboard-stats"],
    queryFn: () => authFetch<WorkshopDashboardStats>("/workshops/dashboard/stats"),
  });

  const { data: workshopsData, isLoading } = useQuery({
    queryKey: ["workshops", filter],
    queryFn: () => authFetch<{ data: Workshop[] }>(
      `/workshops${filter !== "all" ? `?status=${filter}` : ""}`
    ),
  });

  const stats = statsQuery.data;
  const workshops = workshopsData?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop Management"
        description="Manage school workshops, track attendance, and monitor feedback."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => router.push("/workshops/new")}>
            <Plus className="h-4 w-4" />
            Create Workshop
          </Button>
        }
      />

      {/* KPI Cards */}
      {statsQuery.isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : stats ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalWorkshops}</p>
                <p className="text-xs text-slate-500">Total Workshops</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.upcomingWorkshops}</p>
                <p className="text-xs text-slate-500">Upcoming</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.completedWorkshops}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.averageAttendance}%</p>
                <p className="text-xs text-slate-500">Avg Attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.feedbackScore}</p>
                <p className="text-xs text-slate-500">Feedback Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all","SCHEDULED","COMPLETED","DRAFT","CANCELLED"].map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Workshops Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
        </div>
      ) : workshops.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workshops.map((workshop) => (
            <Card key={workshop.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{workshop.title}</p>
                    <p className="text-xs text-slate-500">{categoryLabel[workshop.category] || workshop.category}</p>
                  </div>
                  <Badge variant={statusVariant(workshop.status)}>{workshop.status.replace("_", " ")}</Badge>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">{workshop.description}</p>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{workshop.audience}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Venue:</span>
                    <span>{workshop.venue}</span>
                  </div>
                </div>

                {workshop.feedbackScore && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3.5 w-3.5 ${j < Math.floor(workshop.feedbackScore!) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">{workshop.feedbackScore.toFixed(1)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">{workshop.durationMins} mins</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No workshops found" description="Create your first workshop to get started." />
      )}
    </div>
  );
}
