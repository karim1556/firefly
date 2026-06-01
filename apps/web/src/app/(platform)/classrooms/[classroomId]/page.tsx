"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/modules/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { SessionSummary } from "@/lib/types";

export default function ClassroomDetail({ params }: { params: { classroomId: string } }) {
  const { authFetch, user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["classroom", params.classroomId],
    queryFn: () => authFetch<any>(`/classrooms/${params.classroomId}`)
  });

  if (query.isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );

  if (!query.data) return <EmptyState title="Classroom not found" description="No classroom data available." />;

  const classroom = query.data;

  async function handleFlag(studentId: string) {
    const reason = window.prompt("Reason for flagging this student?");
    if (!reason) return;

    const temp = {
      id: `temp-${Date.now()}`,
      studentId,
      reason,
      raisedBy: user?.fullName ?? "Unknown",
      createdAt: new Date().toISOString()
    };

    // optimistic update
    qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
      ...(old || {}),
      flags: [temp].concat(old?.flags || [])
    }));

    try {
      const created = await authFetch(`/classrooms/${params.classroomId}/flags`, { method: "POST", body: JSON.stringify({ studentId, reason }) });

      // replace temp with server-created item if returned
      if (created && (created as any).id) {
        qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
          ...(old || {}),
          flags: [ (created as any) ].concat((old?.flags || []).filter((f: any) => !String(f.id).startsWith("temp-")))
        }));
      } else {
        qc.invalidateQueries(["classroom", params.classroomId]);
      }

      alert("Flag created");
    } catch (err) {
      qc.invalidateQueries(["classroom", params.classroomId]);
      alert("Unable to create flag");
    }
  }

  async function handleObserve(studentId: string) {
    const notes = window.prompt("Observation notes?");
    if (!notes) return;

    const temp = {
      id: `temp-${Date.now()}`,
      studentId,
      notes,
      observedBy: user?.fullName ?? "Unknown",
      createdAt: new Date().toISOString()
    };

    qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
      ...(old || {}),
      observations: [temp].concat(old?.observations || [])
    }));

    try {
      const created = await authFetch(`/classrooms/${params.classroomId}/observations`, { method: "POST", body: JSON.stringify({ studentId, notes }) });

      if (created && (created as any).id) {
        qc.setQueryData(["classroom", params.classroomId], (old: any) => ({
          ...(old || {}),
          observations: [ (created as any) ].concat((old?.observations || []).filter((o: any) => !String(o.id).startsWith("temp-")))
        }));
      } else {
        qc.invalidateQueries(["classroom", params.classroomId]);
      }

      alert("Observation saved");
    } catch (err) {
      qc.invalidateQueries(["classroom", params.classroomId]);
      alert("Unable to save observation");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Class ${classroom.name}`} description={`Grade ${classroom.grade} • ${classroom.students?.length ?? 0} students`} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Roster</CardTitle>
          </CardHeader>
          <CardContent>
            {classroom.students?.length ? (
              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Tier</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroom.students.map((s: any) => (
                      <tr key={s.id} className="border-t border-zinc-200 text-zinc-800">
                        <td className="px-4 py-3">{s.firstName} {s.lastName}</td>
                        <td className="px-4 py-3">{s.tier}</td>
                        <td className="px-4 py-3">{s.riskScore}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleFlag(s.id)}>Flag</Button>
                          <Button size="sm" onClick={() => handleObserve(s.id)}>Observe</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No students" description="This classroom has no students in mock data." />
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timetable</CardTitle>
            </CardHeader>
            <CardContent>
              {classroom.timetable?.length ? (
                <div className="space-y-2">
                  {classroom.timetable.map((day: any) => (
                    <div key={day.day} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="font-semibold">{day.day}</p>
                      <p className="text-sm text-zinc-600">{day.slots.map((s: any) => `${s.time} • ${s.subject}`).join(" — ")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No timetable" description="Timetable not available for this mock classroom." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flags & Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold">Flags</p>
                  {(classroom.flags || []).map((f: any) => (
                    <div key={f.id} className="mt-2 rounded-xl border border-zinc-200 bg-red-50 p-2 text-sm">
                      <p className="font-medium">{f.reason}</p>
                      <p className="text-xs text-zinc-600">Raised by {f.raisedBy} • {new Date(f.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-semibold">Observations</p>
                  {(classroom.observations || []).map((o: any) => (
                    <div key={o.id} className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-sm">
                      <p className="font-medium">{o.notes}</p>
                      <p className="text-xs text-zinc-600">By {o.observedBy} • {new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
