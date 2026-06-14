"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Search, XCircle, AlertTriangle, ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { SelLesson } from "@/lib/types";

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

export default function SELApprovalsPage() {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("PENDING_APPROVAL");
  const [selectedLesson, setSelectedLesson] = useState<SelLesson | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["sel-lessons"],
    queryFn: () => authFetch<{ data: SelLesson[] }>("/sel/lessons"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => authFetch(`/sel/lessons/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status: "APPROVED" }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sel-lessons"] });
      setSelectedLesson(null);
      setRejectionReason("");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => authFetch(`/sel/lessons/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status: "REJECTED", reason: rejectionReason }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sel-lessons"] });
      setSelectedLesson(null);
      setRejectionReason("");
    },
  });

  const lessons = (data?.data ?? []).filter(l => {
    const matchesFilter = filter === "all" || l.status === filter;
    const matchesSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = (data?.data ?? []).filter(l => l.status === "PENDING_APPROVAL").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Lesson Approvals"
        description="Review, approve, or reject SEL lesson submissions from your team."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-sm px-3 py-1.5">
              {pendingCount} Pending Review
            </Badge>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","PENDING_APPROVAL","APPROVED","REJECTED","DRAFT"].map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Lesson List */}
        <div className="xl:col-span-2 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
          ) : lessons.length ? (
            lessons.map((lesson) => (
              <Card
                key={lesson.id}
                className={`cursor-pointer hover:shadow-md transition-all ${selectedLesson?.id === lesson.id ? "ring-2 ring-indigo-400" : ""}`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                        <Badge variant={statusVariant(lesson.status)}>{lesson.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Grade {lesson.grade} · {lesson.topic} · {lesson.durationMins} mins</p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="default" className="text-xs">{categoryLabel[lesson.category] || lesson.category}</Badge>
                        {lesson.learningObjectives.slice(0, 2).map((obj, i) => (
                          <Badge key={i} variant="info" className="text-xs">{obj}</Badge>
                        ))}
                      </div>
                      {lesson.rejectionReason && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Rejected: {lesson.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No lessons found"
              description={filter === "PENDING_APPROVAL" ? "No lessons awaiting approval." : "No lessons match your filter."}
            />
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedLesson ? (
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <Badge variant={statusVariant(selectedLesson.status)} className="mb-2">
                    {selectedLesson.status.replace("_", " ")}
                  </Badge>
                  <h3 className="font-semibold text-slate-900 text-lg">{selectedLesson.title}</h3>
                  <p className="text-sm text-slate-500">Grade {selectedLesson.grade} · {selectedLesson.topic}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Learning Objectives</p>
                    <ul className="space-y-1">
                      {selectedLesson.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Activities</p>
                    <ul className="space-y-1">
                      {selectedLesson.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reflection Questions</p>
                    <ul className="space-y-1">
                      {selectedLesson.reflectionQuestions.map((q, i) => (
                        <li key={i} className="text-sm text-slate-700">• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                {selectedLesson.status === "PENDING_APPROVAL" && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <p className="text-sm font-semibold text-slate-700">Review Decision</p>

                    {selectedLesson.status === "PENDING_APPROVAL" && (
                      <>
                        <Textarea
                          placeholder="Rejection reason (required if rejecting)..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-1.5"
                            onClick={() => approveMutation.mutate(selectedLesson.id)}
                            disabled={approveMutation.isPending}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="flex-1 gap-1.5"
                            onClick={() => rejectMutation.mutate(selectedLesson.id)}
                            disabled={rejectMutation.isPending || !rejectionReason.trim()}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500 text-center py-8">Select a lesson to review details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}