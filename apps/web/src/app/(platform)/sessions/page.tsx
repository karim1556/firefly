"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, List } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, toQueryString } from "@/lib/utils";
import type { PaginatedResponse, SessionSummary } from "@/lib/types";

export default function SessionsPage() {
  const { authFetch } = useAuth();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["sessions", page],
    queryFn: () => authFetch<PaginatedResponse<SessionSummary>>(`/sessions${toQueryString({ page, pageSize: 12 })}`)
  });

  const sessions = query.data?.data ?? [];

  const calendarGroups = sessions.reduce<Record<string, SessionSummary[]>>((acc, session) => {
    const key = new Date(session.scheduledAt).toISOString().slice(0, 10);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(session);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Plan and track counselling sessions through list and calendar views."
        actions={
          <div className="flex gap-2">
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}> 
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}> 
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : sessions.length ? (
            view === "list" ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{session.title}</p>
                        <p className="text-xs text-zinc-500">
                          {session.student.firstName} {session.student.lastName} • Grade {session.student.grade}
                        </p>
                      </div>
                      <Badge variant={session.status === "COMPLETED" ? "success" : "info"}>{session.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">{formatDate(session.scheduledAt)}</p>
                    <p className="mt-2 text-sm text-zinc-600">{session.notes ?? "No notes yet."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(calendarGroups).map(([date, daySessions]) => (
                  <div key={date} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-zinc-900">{formatDate(date)}</p>
                    <div className="space-y-2">
                      {daySessions.map((session) => (
                        <div key={session.id} className="rounded-lg border border-zinc-200 bg-zinc-100/40 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-zinc-900">{session.title}</p>
                            <Badge variant={session.status === "COMPLETED" ? "success" : "info"}>{session.status}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            {session.student.firstName} {session.student.lastName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <EmptyState title="No sessions scheduled" description="Session cards will appear once counselling sessions are added." />
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Page {query.data?.pagination.page ?? 1} of {query.data?.pagination.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={Boolean(query.data && page >= query.data.pagination.totalPages)}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
