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

type StudentDetail = {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  classroom: string;
  tier: string;
  status: string;
  riskScore: number;
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
    </div>
  );
}
