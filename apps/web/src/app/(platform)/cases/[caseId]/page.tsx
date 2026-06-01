"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaseTimeline } from "@/components/modules/cases/case-timeline";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type CaseDetail = {
  id: string;
  title: string;
  summary: string;
  tier: string;
  type: string;
  riskLevel: string;
  status: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    classroom: string;
  };
  timelineEvents: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: {
      fullName: string;
      role: string;
    };
  }>;
  sessions: Array<{
    id: string;
    title: string;
    status: string;
    scheduledAt: string;
    notes: string | null;
  }>;
};

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const { authFetch, user } = useAuth();
  const queryClient = useQueryClient();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Counselling follow-up");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  const query = useQuery({
    queryKey: ["case-detail", params.caseId],
    queryFn: () => authFetch<CaseDetail>(`/cases/${params.caseId}`)
  });

  const addTimelineMutation = useMutation({
    mutationFn: () =>
      authFetch(`/cases/${params.caseId}/timeline`, {
        method: "POST",
        body: JSON.stringify({
          eventType: "note_added",
          title: noteTitle,
          description: noteDescription
        })
      }),
    onSuccess: async () => {
      setNoteTitle("");
      setNoteDescription("");
      toast.success("Case note added");
      await queryClient.invalidateQueries({ queryKey: ["case-detail", params.caseId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to add timeline note");
    }
  });

  const addSessionMutation = useMutation({
    mutationFn: () => {
      const scheduledAt = sessionDate ? new Date(sessionDate).toISOString() : new Date().toISOString();

      return authFetch("/sessions", {
        method: "POST",
        body: JSON.stringify({
          caseId: params.caseId,
          studentId: query.data?.student.id,
          counsellorId: user?.id,
          title: sessionTitle,
          notes: sessionNotes,
          scheduledAt,
          durationMins: 45,
          status: "SCHEDULED"
        })
      });
    },
    onSuccess: async () => {
      setSessionNotes("");
      setSessionDate("");
      toast.success("Session created");
      await queryClient.invalidateQueries({ queryKey: ["case-detail", params.caseId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to create session");
    }
  });

  const closeCaseMutation = useMutation({
    mutationFn: () =>
      authFetch(`/cases/${params.caseId}/close`, {
        method: "POST"
      }),
    onSuccess: async () => {
      toast.success("Case closed successfully");
      await queryClient.invalidateQueries({ queryKey: ["case-detail", params.caseId] });
      await queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to close case");
    }
  });

  const canCloseCase = user?.role === "COUNSELLOR" || user?.role === "ADMIN" || user?.role === "SYSTEM_ADMIN";

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (!query.data) {
    return <Card className="p-8 text-center text-zinc-600">Case not found.</Card>;
  }

  const caseRecord = query.data;

  const onAddNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!noteTitle || !noteDescription) {
      toast.error("Please provide both title and description for the note");
      return;
    }

    addTimelineMutation.mutate();
  };

  const onAddSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionTitle) {
      toast.error("Please add a session title");
      return;
    }

    addSessionMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={caseRecord.title}
        description={`${caseRecord.student.firstName} ${caseRecord.student.lastName} • Grade ${caseRecord.student.grade}${
          caseRecord.student.classroom
        }`}
        actions={
          <div className="flex gap-2">
            <Badge variant={caseRecord.riskLevel === "CRITICAL" || caseRecord.riskLevel === "HIGH" ? "danger" : "warning"}>
              {caseRecord.riskLevel}
            </Badge>
            <Badge variant={caseRecord.status === "CLOSED" ? "success" : "info"}>{caseRecord.status}</Badge>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <CaseTimeline events={caseRecord.timelineEvents} />

        <Card>
          <CardHeader>
            <CardTitle>Case Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-3" onSubmit={onAddSession}>
              <p className="text-sm font-semibold text-zinc-900">Add Session</p>
              <Input value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder="Session title" />
              <Input
                type="datetime-local"
                value={sessionDate}
                onChange={(event) => setSessionDate(event.target.value)}
                aria-label="Session date"
              />
              <textarea
                className="min-h-[90px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900"
                placeholder="Session notes"
                value={sessionNotes}
                onChange={(event) => setSessionNotes(event.target.value)}
              />
              <Button type="submit" variant="outline" className="w-full" disabled={addSessionMutation.isPending}>
                {addSessionMutation.isPending ? "Saving..." : "Add session"}
              </Button>
            </form>

            <form className="space-y-3" onSubmit={onAddNote}>
              <p className="text-sm font-semibold text-zinc-900">Add Timeline Note</p>
              <Input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Note title" />
              <textarea
                className="min-h-[90px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900"
                placeholder="Detailed note"
                value={noteDescription}
                onChange={(event) => setNoteDescription(event.target.value)}
              />
              <Button type="submit" variant="outline" className="w-full" disabled={addTimelineMutation.isPending}>
                {addTimelineMutation.isPending ? "Saving..." : "Add note"}
              </Button>
            </form>

            {canCloseCase ? (
              <Button
                variant="danger"
                className="w-full"
                disabled={caseRecord.status === "CLOSED" || closeCaseMutation.isPending}
                onClick={() => closeCaseMutation.mutate()}
              >
                {caseRecord.status === "CLOSED" ? "Case already closed" : "Close case"}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseRecord.sessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-sm font-semibold text-zinc-900">{session.title}</p>
                <p className="text-xs text-zinc-500">
                  {session.status} • {formatDate(session.scheduledAt)}
                </p>
                {session.notes ? <p className="mt-2 text-sm text-zinc-600">{session.notes}</p> : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
