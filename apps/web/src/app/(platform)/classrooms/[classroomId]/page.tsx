"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { StudentSummary, ObservationType, FlagCategory, FlagPriority } from "@/lib/types";
import { toast } from "sonner";

export default function ClassroomDetail({ params }: { params: { classroomId: string } }) {
  const { authFetch, user } = useAuth();
  const qc = useQueryClient();

  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(null);
  const [observeModalOpen, setObserveModalOpen] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<StudentSummary | null>(null);

  const classroomQuery = useQuery({
    queryKey: ["classroom", params.classroomId],
    queryFn: () => authFetch<any>(`/classrooms/${params.classroomId}`)
  });

  const selProgressQuery = useQuery({
    queryKey: ["classroom-sel-progress", params.classroomId],
    queryFn: () => authFetch<any>(`/classrooms/${params.classroomId}/sel-progress`),
    enabled: !!params.classroomId,
  });

  const activityQuery = useQuery({
    queryKey: ["classroom-activity", params.classroomId],
    queryFn: () => authFetch<any>(`/classrooms/${params.classroomId}/activity`),
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
  const flags: any[] = classroom.flags ?? [];
  const observations: any[] = classroom.observations ?? [];
  const selProgress = selProgressQuery.data;
  const activityItems = activityQuery.data?.data ?? [];

  const openFlags = flags.filter((f: any) => f.status === "OPEN" || !f.status);
  const pendingObs = observations.filter((o: any) => {
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
    qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
      ...(old || {}), observations: [temp].concat(old?.observations || [])
    }));
    try {
      const created = await authFetch(`/classrooms/${params.classroomId}/observations`, {
        method: "POST", body: JSON.stringify({ studentId: modalStudent.id, notes: data.notes, type: data.type, severity: data.severity })
      });
      if (created && (created as any).id) {
        qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
          ...(old || {}), observations: [(created as any)].concat((old?.observations || []).filter((o: any) => !String(o.id).startsWith("temp-")))
        }));
      }
      toast.success("Observation saved");
    } catch {
      qc.invalidateQueries({ queryKey: ["classroom", params.classroomId] });
      toast.error("Unable to save observation");
    }
  };

  const handleFlagSubmit = async (data: { category: FlagCategory; priority: FlagPriority; notes: string }) => {
    if (!modalStudent) return;
    const temp = {
      id: `temp-${Date.now()}`, studentId: modalStudent.id, classroom: classroom.name,
      category: data.category, priority: data.priority, notes: data.notes,
      status: "OPEN", createdBy: user?.fullName ?? "Unknown", createdAt: new Date().toISOString(),
    };
    qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
      ...(old || {}), flags: [temp].concat(old?.flags || [])
    }));
    try {
      const created = await authFetch(`/classrooms/${params.classroomId}/flags`, {
        method: "POST", body: JSON.stringify({ studentId: modalStudent.id, reason: data.notes, category: data.category, priority: data.priority })
      });
      if (created && (created as any).id) {
        qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
          ...(old || {}), flags: [(created as any)].concat((old?.flags || []).filter((f: any) => !String(f.id).startsWith("temp-")))
        }));
      }
      toast.success("Flag raised");
    } catch {
      qc.invalidateQueries({ queryKey: ["classroom", params.classroomId] });
      toast.error("Unable to raise flag");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Class ${classroom.name}`}
        description={`Grade ${classroom.grade} · ${students.length} students`}
      />

      {/* Dashboard Metrics */}
      <ClassroomDashboard
        totalStudents={students.length}
        activeFlags={openFlags.length}
        selCompletionRate={selProgress?.completionRate ?? 0}
        pendingObservations={pendingObs}
      />

<div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — roster + profile */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentRoster
                students={students}
                flags={flags}
                onSelectStudent={setSelectedStudent}
                onObserve={handleObserve}
                onFlag={handleFlag}
                selectedStudentId={selectedStudent?.id}
              />
            </CardContent>
          </Card>

          {/* Student Profile Panel */}
          {selectedStudent && (
            <StudentProfileCard
              student={selectedStudent}
              academic={(selectedStudent as any).academic}
              wellbeing={(selectedStudent as any).wellbeing}
              selProgress={(selectedStudent as any).selProgress}
              recentActivity={(selectedStudent as any).recentActivity}
              onClose={() => setSelectedStudent(null)}
            />
          )}
        </div>

        {/* Right column — timeline, SEL, activity */}
        <div className="space-y-4">
          <FlagTimeline observations={observations} flags={flags} />

          {selProgress && (
            <SELProgressCard
              progress={{ assigned: selProgress.assigned, completed: selProgress.completed, pending: selProgress.pending }}
            />
          )}

          <ClassroomActivityFeed items={activityItems} />
        </div>
      </div>

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
    </div>
  );
}
