"use client";

import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { GraduationCap, Heart, TrendingUp, Activity } from "lucide-react";

type StudentDetail = {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  classroom: string;
  tier: string;
  status: string;
  riskScore: number;
  academic?: {
    attendancePercent: number;
    assignmentCompletionPercent: number;
    recentPerformance: string;
  };
  wellbeing?: {
    selParticipation: number;
    emotionalWellnessScore: number;
    riskLevel: string;
  };
  selProgress?: {
    assigned: number;
    completed: number;
    pending: number;
  };
  recentActivity?: {
    observations: Array<{ id: string; type: string; severity: string; notes: string; createdAt: string; createdBy: string }>;
    flags: Array<{ id: string; category: string; priority: string; notes: string; status: string; createdAt: string; createdBy: string }>;
    workshops: string[];
  };
  assessmentTrend: Array<{
    id: string;
    score: number;
    riskLevel: string;
    createdAt: string;
  }>;
  cases: Array<{
    id: string;
    title: string;
    tier: string;
    status: string;
    riskLevel: string;
    openedAt: string;
  }>;
  sessions: Array<{
    id: string;
    title: string;
    status: string;
    scheduledAt: string;
    notes: string | null;
  }>;
  incidents: Array<{
    id: string;
    severity: string;
    incidentType: string;
    actionTaken: string;
    createdAt: string;
  }>;
};

export default function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["student", params.studentId],
    queryFn: () => authFetch<StudentDetail>(`/students/${params.studentId}`)
  });

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!query.data) {
    return <EmptyState title="Student not found" description="The requested student profile could not be loaded." />;
  }

  const student = query.data;
  const completionRate =
    student.selProgress && student.selProgress.assigned > 0
      ? Math.round((student.selProgress.completed / student.selProgress.assigned) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={`Grade ${student.grade} • ${student.classroom} • Tier ${student.tier.replace("TIER_", "")}`}
        actions={<Badge variant={student.status === "NEEDS_INTERVENTION" ? "danger" : "warning"}>{student.status}</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-zinc-500">Risk score</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{student.riskScore}</p>
            </div>
            <p className="text-zinc-600">Status: {student.status.replaceAll("_", " ")}</p>
            <p className="text-zinc-600">Tier: {student.tier.replaceAll("_", " ")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {student.assessmentTrend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={student.assessmentTrend.map((entry) => ({
                    ...entry,
                    date: new Date(entry.createdAt).toLocaleDateString()
                  }))}
                >
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No assessments yet" description="Assessment graph will populate after screenings." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic + Wellbeing row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {student.academic ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                Academic Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center rounded-xl bg-blue-50 p-3">
                  <p className="text-2xl font-bold text-blue-900">{student.academic.attendancePercent}%</p>
                  <p className="text-xs text-blue-600">Attendance</p>
                </div>
                <div className="text-center rounded-xl bg-blue-50 p-3">
                  <p className="text-2xl font-bold text-blue-900">{student.academic.assignmentCompletionPercent}%</p>
                  <p className="text-xs text-blue-600">Assignments</p>
                </div>
                <div className="text-center rounded-xl bg-blue-50 p-3">
                  <p className="text-sm font-bold text-blue-900 leading-tight">{student.academic.recentPerformance}</p>
                  <p className="text-xs text-blue-600">Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {student.wellbeing ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-600" />
                Wellbeing Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center rounded-xl bg-pink-50 p-3">
                  <p className="text-2xl font-bold text-pink-900">{student.wellbeing.selParticipation}%</p>
                  <p className="text-xs text-pink-600">SEL Participation</p>
                </div>
                <div className="text-center rounded-xl bg-pink-50 p-3">
                  <p className="text-2xl font-bold text-pink-900">{student.wellbeing.emotionalWellnessScore}</p>
                  <p className="text-xs text-pink-600">Wellness Score</p>
                </div>
                <div className="text-center rounded-xl bg-pink-50 p-3">
                  <p className="text-2xl font-bold text-pink-900">{student.wellbeing.riskLevel}</p>
                  <p className="text-xs text-pink-600">Risk Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* SEL Progress */}
      {student.selProgress ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              SEL Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Overall Completion</span>
              <span className="font-medium text-zinc-900">{completionRate}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completionRate}%` }} />
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-lg font-bold text-zinc-900">{student.selProgress.assigned}</p>
                <p className="text-xs text-zinc-500">Assigned</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">{student.selProgress.completed}</p>
                <p className="text-xs text-zinc-500">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600">{student.selProgress.pending}</p>
                <p className="text-xs text-zinc-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Case History</CardTitle>
          </CardHeader>
          <CardContent>
            {student.cases.length ? (
              <div className="space-y-3">
                {student.cases.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <p className="font-semibold text-zinc-900">{entry.title}</p>
                    <p className="text-xs text-zinc-500">{entry.tier} • {entry.status} • {entry.riskLevel}</p>
                    <p className="mt-1 text-xs text-zinc-500">Opened {formatDate(entry.openedAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No cases" description="Case records will appear once interventions begin." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {student.incidents.length ? (
              <div className="space-y-3">
                {student.incidents.map((incident) => (
                  <div key={incident.id} className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-zinc-600">{incident.incidentType}</p>
                      <Badge variant={incident.severity === "CRITICAL" ? "danger" : "warning"}>{incident.severity}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600/90">{incident.actionTaken}</p>
                    <p className="mt-1 text-xs text-zinc-600/60">{formatDate(incident.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No incidents" description="Incident notes and interventions will appear here." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {student.recentActivity && (student.recentActivity.observations.length > 0 || student.recentActivity.flags.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {student.recentActivity.observations.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-start gap-3 rounded-xl bg-blue-50 p-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-blue-900">{o.type} — {o.severity}</p>
                    </div>
                    <p className="text-sm text-blue-700">{o.notes}</p>
                    <p className="text-xs text-blue-500">{o.createdBy} · {formatDate(o.createdAt)}</p>
                  </div>
                </div>
              ))}
              {student.recentActivity.flags.slice(0, 3).map(f => (
                <div key={f.id} className="flex items-start gap-3 rounded-xl bg-red-50 p-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-red-900">{f.category} — {f.priority}</p>
                      <Badge variant={f.status === "RESOLVED" ? "success" : "danger"}>{f.status}</Badge>
                    </div>
                    <p className="text-sm text-red-700">{f.notes}</p>
                    <p className="text-xs text-red-500">{f.createdBy} · {formatDate(f.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
