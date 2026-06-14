"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, Users, TrendingUp, Calendar, Clock, Star,
  AlertTriangle, CheckCircle2, ChevronRight, Sparkles,
  BarChart3, GraduationCap, Heart
} from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/modules/dashboard/kpi-card";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { SelDashboardStats, SelLesson, SelLessonTemplate } from "@/lib/types";

type Tab = "dashboard" | "curriculum" | "lessons" | "sessions";

const statusVariant = (status: string) => {
  switch (status) {
    case "APPROVED": return "success" as const;
    case "PENDING_APPROVAL": return "warning" as const;
    case "DRAFT": return "info" as const;
    case "REJECTED": return "danger" as const;
    default: return "info" as const;
  }
};

const categoryLabel: Record<string, string> = {
  SELF_AWARENESS: "Self Awareness",
  EMOTIONAL_REGULATION: "Emotional Regulation",
  EMPATHY: "Empathy",
  COMMUNICATION: "Communication",
  LEADERSHIP: "Leadership",
  CONFLICT_RESOLUTION: "Conflict Resolution",
  RESILIENCE: "Resilience",
};

export default function SELPlannerPage() {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [lessonFilter, setLessonFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");

  const statsQuery = useQuery({
    queryKey: ["sel-dashboard-stats"],
    queryFn: () => authFetch<SelDashboardStats>("/sel/dashboard/stats"),
  });

  const templatesQuery = useQuery({
    queryKey: ["sel-templates"],
    queryFn: () => authFetch<{ data: SelLessonTemplate[] }>("/sel/templates"),
  });

  const lessonsQuery = useQuery({
    queryKey: ["sel-lessons"],
    queryFn: () => authFetch<{ data: SelLesson[] }>("/sel/lessons"),
  });

  const sessionsQuery = useQuery({
    queryKey: ["sel-sessions-m4"],
    queryFn: () => authFetch<{ data: any[] }>("/sel/sessions"),
  });

  const stats = statsQuery.data;
  const templates = templatesQuery.data?.data ?? [];
  const lessons = (lessonsQuery.data?.data ?? []).filter((l) => lessonFilter === "all" || l.status === lessonFilter);
  const sessions = sessionsQuery.data?.data ?? [];

  const upcomingSessions = sessions.filter((s: any) => s.status === "SCHEDULED").slice(0, 5);
  const completedSessions = sessions.filter((s: any) => s.status === "COMPLETED").length;
  const scheduledSessions = sessions.filter((s: any) => s.status === "SCHEDULED").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Management"
        description="Design, schedule, and track Social-Emotional Learning curriculum across all grades."
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        {[
          { key: "dashboard", label: "Dashboard", icon: BarChart3 },
          { key: "curriculum", label: "Curriculum", icon: BookOpen },
          { key: "lessons", label: "Lessons", icon: GraduationCap },
          { key: "sessions", label: "Sessions", icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(key as Tab)}
            className="gap-1.5"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* ======================== DASHBOARD TAB ======================== */}
      {activeTab === "dashboard" && (
        <>
          {statsQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-2xl" />
              ))}
            </div>
          ) : stats ? (
            <>
              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <KpiCard
                  title="Total Programs"
                  value={stats.totalPrograms}
                  trend={`${stats.studentParticipation}% participation`}
                  icon={BookOpen}
                  tone="indigo"
                />
                <KpiCard
                  title="Active Sessions"
                  value={stats.activeSessions}
                  trend={`${stats.upcomingSessions} upcoming`}
                  icon={Clock}
                  tone="green"
                />
                <KpiCard
                  title="Completion Rate"
                  value={`${stats.completionRate}%`}
                  trend="Across all grades"
                  icon={CheckCircle2}
                  tone="indigo"
                />
                <KpiCard
                  title="Student Participation"
                  value={`${stats.studentParticipation}%`}
                  trend="Active engagement"
                  icon={Users}
                  tone="green"
                />
                <KpiCard
                  title="Workshop Attendance"
                  value={`${stats.workshopAttendance}%`}
                  trend="Average attendance"
                  icon={TrendingUp}
                  tone="amber"
                />
                <KpiCard
                  title="Upcoming This Week"
                  value={stats.upcomingWorkshopsThisWeek}
                  trend="Workshops scheduled"
                  icon={Calendar}
                  tone="green"
                />
              </div>

              {/* Quick Insights */}
              <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Quick Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-200/60 p-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Highest completion: Grade {stats.highestCompletionGrade}</p>
                        <p className="text-xs text-slate-500">Leading SEL participation across all grades</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/60 p-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{stats.studentsRequiringIntervention} students require intervention</p>
                        <p className="text-xs text-slate-500">Monitored by counselling team</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/60 p-4">
                      <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{stats.upcomingWorkshopsThisWeek} workshops this week</p>
                        <p className="text-xs text-slate-500">Across multiple grades and topics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Star className="h-4 w-4 text-slate-500" />
                      Recent Facilitator Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.recentFeedback.map((fb, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-slate-200/80 p-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < Math.floor(fb.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{fb.sessionTitle}</p>
                          <p className="text-xs text-slate-500">{fb.facilitatorName} · {formatDate(fb.date)}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Upcoming SEL Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length ? (
                    <div className="space-y-3">
                      {upcomingSessions.map((session: any) => (
                        <div key={session.id} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200/80 p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{session.title}</p>
                              <p className="text-xs text-slate-500">{formatDate(session.scheduledAt)} · {session.durationMins} mins</p>
                            </div>
                          </div>
                          <Badge variant="info">Scheduled</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="No upcoming sessions" description="Schedule your first SEL session to get started." />
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <EmptyState title="Dashboard unavailable" description="SEL dashboard data could not be loaded." />
          )}
        </>
      )}

      {/* ======================== CURRICULUM TAB ======================== */}
      {activeTab === "curriculum" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button variant={templateFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setTemplateFilter("all")}>All</Button>
              {["SELF_AWARENESS","EMOTIONAL_REGULATION","EMPATHY","COMMUNICATION","LEADERSHIP","CONFLICT_RESOLUTION","RESILIENCE"].map(cat => (
                <Button key={cat} variant={templateFilter === cat ? "default" : "outline"} size="sm" onClick={() => setTemplateFilter(cat)}>
                  {categoryLabel[cat]}
                </Button>
              ))}
            </div>
            <Button size="sm" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              New Template
            </Button>
          </div>

          {templatesQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.filter(t => templateFilter === "all" || t.category === templateFilter).map((tpl) => (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{tpl.title}</p>
                        <p className="text-xs text-slate-500">Grade {tpl.grade} · {tpl.durationMins} mins</p>
                      </div>
                      <Badge variant="default">{categoryLabel[tpl.category]}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.learningObjectives.slice(0, 3).map((obj, i) => (
                        <Badge key={i} variant="default" className="text-xs">{obj}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{tpl.activities.length} activities</span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronRight className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ======================== LESSONS TAB ======================== */}
      {activeTab === "lessons" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {["all","APPROVED","PENDING_APPROVAL","DRAFT","REJECTED"].map(f => (
                <Button key={f} variant={lessonFilter === f ? "default" : "outline"} size="sm" onClick={() => setLessonFilter(f)}>
                  {f === "all" ? "All" : f.replace("_", " ")}
                </Button>
              ))}
            </div>
            <Button size="sm" className="gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Create Lesson
            </Button>
          </div>

          {lessonsQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
            </div>
          ) : lessons.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                        <p className="text-xs text-slate-500">Grade {lesson.grade} · {lesson.topic}</p>
                      </div>
                      <Badge variant={statusVariant(lesson.status)}>{lesson.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="default" className="text-xs">{categoryLabel[lesson.category]}</Badge>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{lesson.durationMins} mins</span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronRight className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No lessons found" description="Create your first SEL lesson to get started." />
          )}
        </>
      )}

      {/* ======================== SESSIONS TAB ======================== */}
      {activeTab === "sessions" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Sessions</Button>
              <Button variant="outline" size="sm">Calendar View</Button>
            </div>
            <Button size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              Schedule Session
            </Button>
          </div>

          {/* Session Stats */}
          <div className="grid gap-4 grid-cols-3 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{scheduledSessions}</p>
                  <p className="text-xs text-slate-500">Scheduled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{completedSessions}</p>
                  <p className="text-xs text-slate-500">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{Math.round((completedSessions / (sessions.length || 1)) * 100)}%</p>
                  <p className="text-xs text-slate-500">Completion Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {sessionsQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
            </div>
          ) : sessions.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sessions.map((session: any) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{session.title}</p>
                        <p className="text-xs text-slate-500">{formatDate(session.scheduledAt)}</p>
                      </div>
                      <Badge variant={session.status === "COMPLETED" ? "success" : session.status === "SCHEDULED" ? "info" : "danger"}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{session.durationMins} mins</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No sessions" description="Schedule your first SEL session." />
          )}
        </>
      )}
    </div>
  );
}
