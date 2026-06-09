"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/modules/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { ClassroomDashboard } from "@/components/modules/classrooms/classroom-dashboard";
import { StudentRoster } from "@/components/modules/classrooms/student-roster";
import { StudentProfileCard } from "@/components/modules/classrooms/student-profile-card";
import { ObservationModal } from "@/components/modules/classrooms/observation-modal";
import { FlagModal } from "@/components/modules/classrooms/flag-modal";
import { FlagTimeline } from "@/components/modules/classrooms/flag-timeline";
import { SELProgressCard } from "@/components/modules/classrooms/sel-progress";
import { ClassroomActivityFeed } from "@/components/modules/classrooms/classroom-activity-feed";
import { ClassroomTimetable } from "@/components/modules/classrooms/classroom-timetable";
import { TeachersList } from "@/components/modules/classrooms/teachers-list";
import { ClassAnalyticsPanel } from "@/components/modules/classrooms/class-analytics";
import { SessionFeedbackModal } from "@/components/modules/classrooms/session-feedback-modal";
import type { StudentSummary, StudentFullProfile, ObservationType, FlagCategory, FlagPriority, Teacher, TimetableSlot, SELSessionDetailed, ClassAnalytics, SessionFeedback, ObservationEntry, FlagEntry, ClassroomSELProgress, ClassroomActivityItem } from "@/lib/types";
import { toast } from "sonner";
import { Calendar, GraduationCap, BarChart3, LayoutDashboard, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ClassroomData {
  id: string;
  name: string;
  grade: string;
  section?: string;
  students: StudentSummary[];
  flags: FlagEntry[];
  observations: ObservationEntry[];
  teachers: Teacher[];
  timetable: TimetableSlot[];
  sessions: SELSessionDetailed[];
}

type Tab = "overview" | "timetable" | "teachers" | "analytics" | "sessions";

export default function ClassroomDetail({ params }: { params: { classroomId: string } }) {
  const { authFetch, user } = useAuth();
  const qc = useQueryClient();

  const [tab, setTab] = useState<Tab>("overview");
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [observeModalOpen, setObserveModalOpen] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<StudentSummary | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<SELSessionDetailed | null>(null);

  const classroomQuery = useQuery({
    queryKey: ["classroom", params.classroomId],
    queryFn: () => authFetch<ClassroomData>(`/classrooms/${params.classroomId}`)
  });

  const selProgressQuery = useQuery({
    queryKey: ["classroom-sel-progress", params.classroomId],
    queryFn: () => authFetch<ClassroomSELProgress>(`/classrooms/${params.classroomId}/sel-progress`),
    enabled: !!params.classroomId,
  });

  const activityQuery = useQuery({
    queryKey: ["classroom-activity", params.classroomId],
    queryFn: () => authFetch<{ data: ClassroomActivityItem[] }>(`/classrooms/${params.classroomId}/activity`),
    enabled: !!params.classroomId,
  });

  const teachersQuery = useQuery({
    queryKey: ["classroom-teachers", params.classroomId],
    queryFn: () => authFetch<{ data: Teacher[] }>(`/classrooms/${params.classroomId}/teachers`),
    enabled: !!params.classroomId,
  });

  const timetableQuery = useQuery({
    queryKey: ["classroom-timetable", params.classroomId],
    queryFn: () => authFetch<{ data: TimetableSlot[] }>(`/classrooms/${params.classroomId}/timetable`),
    enabled: !!params.classroomId,
  });

  const sessionsQuery = useQuery({
    queryKey: ["classroom-sessions", params.classroomId],
    queryFn: () => authFetch<{ data: SELSessionDetailed[] }>(`/classrooms/${params.classroomId}/sessions`),
    enabled: !!params.classroomId,
  });

  const analyticsQuery = useQuery({
    queryKey: ["classroom-analytics", params.classroomId],
    queryFn: () => authFetch<ClassAnalytics>(`/classrooms/${params.classroomId}/analytics`),
    enabled: !!params.classroomId,
  });

  if (classroomQuery.isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );

  if (!classroomQuery.data) return <EmptyState title="Classroom not found" description="No classroom data available." />;

  const classroom = classroomQuery.data;
  const students: StudentSummary[] = classroom.students ?? [];
  const flags: FlagEntry[] = classroom.flags ?? [];
  const observations: ObservationEntry[] = classroom.observations ?? [];
  const teachers: Teacher[] = teachersQuery.data?.data ?? classroom.teachers ?? [];
  const timetable: TimetableSlot[] = timetableQuery.data?.data ?? classroom.timetable ?? [];
  const sessions: SELSessionDetailed[] = sessionsQuery.data?.data ?? classroom.sessions ?? [];
  const classAnalytics: ClassAnalytics | undefined = analyticsQuery.data;
  const selProgress = selProgressQuery.data;
  const activityItems: ClassroomActivityItem[] = activityQuery.data?.data ?? [];
  const ct = teachers.find((t) => t.isClassTeacher);

  const openFlags = flags.filter((f) => f.status === "OPEN" || !f.status);
  const pendingObs = observations.filter((o) => {
    const age = Date.now() - new Date(o.createdAt).getTime();
    return age < 3 * 24 * 60 * 60 * 1000;
  }).length;

  const handleObserve = (student: StudentSummary) => {
    setModalStudent(student);
    setObserveModalOpen(true);
  };

  const handleFlag = (student: StudentSummary) => {
    setModalStudent(student);
    setFlagModalOpen(true);
  };

  const handleObserveSubmit = async (data: { type: ObservationType; severity: "LOW" | "MEDIUM" | "HIGH"; notes: string }) => {
    if (!modalStudent) return;
    const temp = {
      id: `temp-${Date.now()}`, studentId: modalStudent.id, classroom: classroom.name,
      type: data.type, severity: data.severity, notes: data.notes,
      createdBy: user?.fullName ?? "Unknown", createdAt: new Date().toISOString(),
    };
    qc.setQueryData<ClassroomData>(["classroom", params.classroomId], (old) => ({
      ...(old || { id: "", name: "", grade: "", students: [], flags: [], observations: [], teachers: [], timetable: [], sessions: [] }), observations: [temp as ObservationEntry].concat(old?.observations || [])
    }));
    try {
      const created = await authFetch<ObservationEntry>(`/classrooms/${params.classroomId}/observations`, {
        method: "POST", body: JSON.stringify({ studentId: modalStudent.id, notes: data.notes, type: data.type, severity: data.severity })
      });
      if (created && created.id) {
        qc.setQueryData<ClassroomData>(["classroom", params.classroomId], (old) => ({
          ...(old || { id: "", name: "", grade: "", students: [], flags: [], observations: [], teachers: [], timetable: [], sessions: [] }), observations: [created].concat((old?.observations || []).filter((o) => !String(o.id).startsWith("temp-")))
        }));
      }
      toast.success("Observation saved");
    } catch {
      qc.invalidateQueries({ queryKey: ["classroom", params.classroomId] });
      toast.error("Unable to save observation");
    }
  };

  const handleFlagSubmit = async (data: { category: FlagCategory; priority: FlagPriority; notes: string; requestCounsellor?: boolean }) => {
    if (!modalStudent) return;
    const temp = {
      id: `temp-${Date.now()}`, studentId: modalStudent.id, classroom: classroom.name,
      category: data.category, priority: data.priority, notes: data.notes,
      status: "OPEN", createdBy: user?.fullName ?? "Unknown", createdAt: new Date().toISOString(),
    };
    qc.setQueryData<ClassroomData>(["classroom", params.classroomId], (old) => ({
      ...(old || { id: "", name: "", grade: "", students: [], flags: [], observations: [], teachers: [], timetable: [], sessions: [] }), flags: [temp as FlagEntry].concat(old?.flags || [])
    }));
    try {
      const created = await authFetch<FlagEntry>(`/classrooms/${params.classroomId}/flags`, {
        method: "POST", body: JSON.stringify({ studentId: modalStudent.id, reason: data.notes, category: data.category, priority: data.priority })
      });
      if (created && created.id) {
        qc.setQueryData<ClassroomData>(["classroom", params.classroomId], (old) => ({
          ...(old || { id: "", name: "", grade: "", students: [], flags: [], observations: [], teachers: [], timetable: [], sessions: [] }), flags: [created].concat((old?.flags || []).filter((f) => !String(f.id).startsWith("temp-")))
        }));
      }
      toast.success(data.requestCounsellor ? "Flag raised — counsellor notified" : "Flag raised");
    } catch {
      qc.invalidateQueries({ queryKey: ["classroom", params.classroomId] });
      toast.error("Unable to raise flag");
    }
  };

  const handleSessionFeedbackSubmit = async (sessionId: string, feedback: Omit<SessionFeedback, "submittedAt" | "submittedBy">) => {
    const tempSession: SELSessionDetailed = { ...feedbackSession!, status: "COMPLETED", feedback: { ...feedback, submittedAt: new Date().toISOString(), submittedBy: user?.fullName ?? "Unknown" } };
    qc.setQueryData<{ data: SELSessionDetailed[] }>(["classroom-sessions", params.classroomId], (old) => ({
      ...(old || { data: [] }),
      data: (old?.data ?? sessions).map((s) => s.id === sessionId ? tempSession : s),
    }));
    setFeedbackSession(null);
    try {
      await authFetch(`/classrooms/${params.classroomId}/sessions/${sessionId}/feedback`, {
        method: "POST", body: JSON.stringify(feedback),
      });
      toast.success("Session marked complete with feedback");
      qc.invalidateQueries({ queryKey: ["classroom-sessions", params.classroomId] });
      qc.invalidateQueries({ queryKey: ["classroom-analytics", params.classroomId] });
    } catch {
      qc.invalidateQueries({ queryKey: ["classroom-sessions", params.classroomId] });
      toast.error("Unable to save feedback");
    }
  };

  const handleSELRequest = async (day: string, period: number) => {
    await authFetch(`/classrooms/${params.classroomId}/sel-request`, {
      method: "POST",
      body: JSON.stringify({ day, period }),
    });
  };

  const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "sessions", label: "Sessions", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Class ${classroom.name}`}
        description={`Grade ${classroom.grade}${classroom.section ? ` · Section ${classroom.section}` : ""} · ${students.length} students${ct ? ` · CT: ${ct.fullName}` : ""}`}
      />

      <ClassroomDashboard
        totalStudents={students.length}
        activeFlags={openFlags.length}
        selCompletionRate={selProgress?.completionRate ?? 0}
        pendingObservations={pendingObs}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-zinc-100 p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Roster</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentRoster
                  students={students}
                  flags={flags}
                  observations={observations}
                  onSelectStudent={setSelectedStudent}
                  onObserve={handleObserve}
                  onFlag={handleFlag}
                  selectedStudentId={selectedStudent?.id}
                />
              </CardContent>
            </Card>

            {selectedStudent && (
              <StudentProfileCard
                student={selectedStudent}
                academic={(selectedStudent as StudentFullProfile).academic}
                wellbeing={(selectedStudent as StudentFullProfile).wellbeing}
                selProgress={(selectedStudent as StudentFullProfile).selProgress}
                recentActivity={(selectedStudent as StudentFullProfile).recentActivity}
                onClose={() => setSelectedStudent(null)}
              />
            )}
          </div>

          <div className="space-y-4">
            <FlagTimeline observations={observations} flags={flags} classroomId={params.classroomId} />

            {selProgress && (
              <SELProgressCard
                progress={{ assigned: selProgress.assigned, completed: selProgress.completed, pending: selProgress.pending, participationRate: selProgress.participationRate }}
              />
            )}

            <ClassroomActivityFeed items={activityItems} />
          </div>
        </div>
      )}

      {/* Timetable tab */}
      {tab === "timetable" && (
        <ClassroomTimetable timetable={timetable} classTeacherName={ct?.fullName} onRequestSEL={handleSELRequest} />
      )}

      {/* Teachers tab */}
      {tab === "teachers" && <TeachersList teachers={teachers} />}

      {/* Sessions tab */}
      {tab === "sessions" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              SEL Sessions
            </CardTitle>
            <p className="text-xs text-zinc-500">Mark sessions complete and submit feedback after each session.</p>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <EmptyState title="No sessions scheduled" description="SEL sessions for this class will appear here once scheduled." />
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 rounded-xl border border-zinc-200 p-3">
                    <div className={`mt-0.5 rounded-lg p-2 ${
                      s.status === "COMPLETED" ? "bg-emerald-50" : s.status === "NO_SHOW" ? "bg-amber-50" : "bg-blue-50"
                    }`}>
                      <Sparkles className={`h-4 w-4 ${
                        s.status === "COMPLETED" ? "text-emerald-600" : s.status === "NO_SHOW" ? "text-amber-600" : "text-blue-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900">{s.topic}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          s.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                          s.status === "NO_SHOW" ? "bg-amber-100 text-amber-700" :
                          s.status === "CANCELLED" ? "bg-zinc-100 text-zinc-600" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {s.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {formatDate(s.scheduledAt)} · {s.durationMins} min · {s.facilitatorName}
                      </p>
                      {s.feedback && (
                        <div className="mt-2 rounded-lg bg-emerald-50/50 p-2 text-xs text-emerald-900">
                          <div className="flex items-center gap-1 font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Feedback submitted by {s.feedback.submittedBy}
                          </div>
                          <p className="mt-1 text-emerald-700">Engagement: {s.feedback.studentEngagement} · Plan: {s.feedback.planCompletion} · Quality: {s.feedback.activityQuality}</p>
                        </div>
                      )}
                    </div>
                    {(s.status === "SCHEDULED" || s.status === "NO_SHOW") && (
                      <Button size="sm" onClick={() => setFeedbackSession(s)}>
                        Mark complete + feedback
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics tab */}
      {tab === "analytics" && (
        classAnalytics ? <ClassAnalyticsPanel analytics={classAnalytics} /> :
        <Skeleton className="h-72 w-full" />
      )}

      {/* Modals */}
      {modalStudent && (
        <>
          <ObservationModal
            open={observeModalOpen}
            onClose={() => { setObserveModalOpen(false); setModalStudent(null); }}
            studentName={`${modalStudent.firstName} ${modalStudent.lastName}`}
            onSubmit={handleObserveSubmit}
          />
          <FlagModal
            open={flagModalOpen}
            onClose={() => { setFlagModalOpen(false); setModalStudent(null); }}
            studentName={`${modalStudent.firstName} ${modalStudent.lastName}`}
            onSubmit={handleFlagSubmit}
          />
        </>
      )}

      {feedbackSession && (
        <SessionFeedbackModal
          open={!!feedbackSession}
          onClose={() => setFeedbackSession(null)}
          session={feedbackSession}
          onSubmit={(feedback) => handleSessionFeedbackSubmit(feedbackSession.id, feedback)}
        />
      )}
    </div>
  );
}
