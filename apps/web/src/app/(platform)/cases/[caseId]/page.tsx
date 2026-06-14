"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, User, AlertTriangle, Clock, CheckCircle2, Phone, Mail, MessageSquare, Calendar, FileText, TrendingUp, ArrowUpRight, ShieldAlert, Plus, Edit, X, Users } from "lucide-react";
import { CaseTimeline } from "@/components/modules/cases/case-timeline";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { CaseDetailEnhanced, CaseFollowUp } from "@/lib/types";

const statusConfig: Record<string, { label: string; variant: string }> = {
  OPEN: { label: "Open", variant: "info" },
  ASSESSMENT_IN_PROGRESS: { label: "Assessment", variant: "warning" },
  INTERVENTION_ACTIVE: { label: "Intervention", variant: "success" },
  MONITORING: { label: "Monitoring", variant: "info" },
  ESCALATED: { label: "Escalated", variant: "danger" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-slate-600 bg-slate-50" },
  MEDIUM: { label: "Medium", color: "text-blue-600 bg-blue-50" },
  HIGH: { label: "High", color: "text-amber-600 bg-amber-50" },
  CRITICAL: { label: "Critical", color: "text-red-600 bg-red-50" },
};

const riskConfig: Record<string, { label: string; color: string }> = {
  LOW_RISK: { label: "Low Risk", color: "text-slate-600 bg-slate-50" },
  MODERATE_RISK: { label: "Moderate Risk", color: "text-blue-600 bg-blue-50" },
  HIGH_RISK: { label: "High Risk", color: "text-amber-600 bg-amber-50" },
  CRITICAL_RISK: { label: "Critical Risk", color: "text-red-600 bg-red-50" },
};

const interventionStatusConfig: Record<string, { label: string; color: string }> = {
  NOT_STARTED: { label: "Not Started", color: "text-zinc-500 bg-zinc-50" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600 bg-blue-50" },
  COMPLETED: { label: "Completed", color: "text-green-600 bg-green-50" },
  ON_HOLD: { label: "On Hold", color: "text-amber-600 bg-amber-50" },
};

const followUpStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SCHEDULED: { label: "Scheduled", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  MISSED: { label: "Missed", variant: "danger" },
  RESCHEDULED: { label: "Rescheduled", variant: "warning" },
  CANCELLED: { label: "Cancelled", variant: "default" },
};

const noteTypeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  COUNSELLOR_NOTE: { label: "Counsellor", icon: <User className="h-3 w-3" /> },
  TEACHER_NOTE: { label: "Teacher", icon: <FileText className="h-3 w-3" /> },
  PARENT_NOTE: { label: "Parent", icon: <MessageSquare className="h-3 w-3" /> },
  ADMINISTRATIVE_NOTE: { label: "Admin", icon: <ShieldAlert className="h-3 w-3" /> },
};

const escalationConfig: Record<string, { label: string; color: string }> = {
  COUNSELLOR: { label: "Counsellor", color: "text-blue-600 bg-blue-50" },
  COORDINATOR: { label: "Coordinator", color: "text-amber-600 bg-amber-50" },
  PRINCIPAL: { label: "Principal", color: "text-red-600 bg-red-50" },
  EXTERNAL_SUPPORT: { label: "External", color: "text-purple-600 bg-purple-50" },
};

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const { authFetch, user } = useAuth();
  const queryClient = useQueryClient();

  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Counselling follow-up");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "interventions" | "followups" | "notes" | "parent" | "risk" | "analytics">("overview");

  const query = useQuery({
    queryKey: ["case-detail", params.caseId],
    queryFn: () => authFetch<CaseDetailEnhanced>(`/cases/${params.caseId}`)
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

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "interventions", label: `Interventions (${caseRecord.interventions?.length || 0})` },
    { id: "followups", label: `Follow-ups (${caseRecord.followUps?.length || 0})` },
    { id: "notes", label: `Notes (${caseRecord.notes?.length || 0})` },
    { id: "parent", label: `Parent (${caseRecord.parentInteractions?.length || 0})` },
    { id: "risk", label: "Risk" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/cases"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{caseRecord.title}</h1>
            <p className="text-sm text-zinc-500">
              {caseRecord.student.firstName} {caseRecord.student.lastName} • Grade {caseRecord.student.grade}{caseRecord.student.classroom}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/cases/journey/${caseRecord.student.id}`}>View Journey</Link>
          </Button>
          {riskConfig[caseRecord.riskLevel || ""] && (
            <span className={`text-xs uppercase font-semibold px-2 py-1 rounded-full ${riskConfig[caseRecord.riskLevel].color}`}>
              {riskConfig[caseRecord.riskLevel].label}
            </span>
          )}
          {priorityConfig[caseRecord.priority || ""] && (
            <span className={`text-xs uppercase font-semibold px-2 py-1 rounded-full ${priorityConfig[caseRecord.priority].color}`}>
              {priorityConfig[caseRecord.priority].label}
            </span>
          )}
          <Badge variant={caseRecord.status === "CLOSED" ? "success" : "info"}>
            {statusConfig[caseRecord.status]?.label || caseRecord.status}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-zinc-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CaseTimeline events={caseRecord.timelineEvents || []} />
          </div>

          <div className="space-y-6">
            {/* Student Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-zinc-400" />
                  <div>
                    <p className="font-medium">{caseRecord.student.firstName} {caseRecord.student.lastName}</p>
                    <p className="text-sm text-zinc-500">Grade {caseRecord.student.grade} {caseRecord.student.classroom}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-zinc-500">Risk Score</p>
                    <p className="font-medium">{caseRecord.student.riskScore || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Tier</p>
                    <p className="font-medium">{caseRecord.student.tier || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Counsellor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assigned Counsellor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="font-medium">{caseRecord.assignedCounsellor?.fullName || "Unassigned"}</p>
                    <p className="text-sm text-zinc-500">{caseRecord.assignedCounsellor?.email || ""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <form className="space-y-2" onSubmit={onAddSession}>
                  <p className="text-xs font-semibold text-zinc-900">Add Session</p>
                  <Input value={sessionTitle} onChange={(event) => setSessionTitle(event.target.value)} placeholder="Session title" className="h-8 text-sm" />
                  <Input type="datetime-local" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} className="h-8 text-sm" />
                  <Button type="submit" variant="outline" size="sm" className="w-full" disabled={addSessionMutation.isPending}>
                    {addSessionMutation.isPending ? "Saving..." : "Add Session"}
                  </Button>
                </form>
                <div className="border-t border-zinc-200 pt-3">
                  <form className="space-y-2" onSubmit={onAddNote}>
                    <p className="text-xs font-semibold text-zinc-900">Add Note</p>
                    <Input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Note title" className="h-8 text-sm" />
                    <textarea
                      className="min-h-[60px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-sm text-zinc-900"
                      placeholder="Note content"
                      value={noteDescription}
                      onChange={(event) => setNoteDescription(event.target.value)}
                    />
                    <Button type="submit" variant="outline" size="sm" className="w-full" disabled={addTimelineMutation.isPending}>
                      {addTimelineMutation.isPending ? "Saving..." : "Add Note"}
                    </Button>
                  </form>
                </div>
                {canCloseCase && (
                  <div className="border-t border-zinc-200 pt-3">
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      disabled={caseRecord.status === "CLOSED" || closeCaseMutation.isPending}
                      onClick={() => closeCaseMutation.mutate()}
                    >
                      {caseRecord.status === "CLOSED" ? "Case Closed" : "Close Case"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Interventions Tab */}
      {activeTab === "interventions" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Intervention Plans</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Intervention
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {caseRecord.interventions?.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No interventions planned yet.</p>
              ) : (
                <div className="space-y-3">
                  {caseRecord.interventions?.map((intervention) => (
                    <div key={intervention.id} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{intervention.name}</p>
                          <p className="text-xs text-zinc-500">{intervention.interventionType.replace(/_/g, " ")}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${interventionStatusConfig[intervention.status]?.color}`}>
                          {interventionStatusConfig[intervention.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 mb-2">{intervention.objective}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>Owner: {intervention.owner.fullName}</span>
                        <span>Due: {formatDate(intervention.dueDate)}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">Success Criteria: {intervention.successCriteria}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Follow-ups Tab */}
      {activeTab === "followups" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Follow-ups</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Schedule Follow-up
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {caseRecord.followUps?.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No follow-ups scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {caseRecord.followUps?.map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{formatDate(followUp.scheduledAt)}</p>
                        {followUp.notes && <p className="text-xs text-zinc-500">{followUp.notes}</p>}
                      </div>
                      <Badge variant={followUpStatusConfig[followUp.status]?.variant || "default"}>
                        {followUpStatusConfig[followUp.status]?.label || followUp.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Case Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {caseRecord.notes?.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No notes recorded.</p>
              ) : (
                <div className="space-y-3">
                  {caseRecord.notes?.map((note) => (
                    <div key={note.id} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                          {noteTypeConfig[note.noteType]?.icon}
                          <span className="ml-1">{noteTypeConfig[note.noteType]?.label}</span>
                        </span>
                        <span className="text-xs text-zinc-400">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="font-medium text-sm mb-1">{note.title}</p>
                      <p className="text-sm text-zinc-600">{note.content}</p>
                      <p className="text-xs text-zinc-400 mt-2">by {note.createdBy.fullName} ({note.createdBy.role})</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Parent Engagement Tab */}
      {activeTab === "parent" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Parent Interactions</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Log Interaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {caseRecord.parentInteractions?.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No parent interactions recorded.</p>
              ) : (
                <div className="space-y-3">
                  {caseRecord.parentInteractions?.map((interaction) => (
                    <div key={interaction.id} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {interaction.interactionType === "PARENT_MEETING" && <Users className="h-4 w-4 text-pink-500" />}
                        {interaction.interactionType === "PHONE_CALL" && <Phone className="h-4 w-4 text-green-500" />}
                        {interaction.interactionType === "EMAIL" && <Mail className="h-4 w-4 text-blue-500" />}
                        {interaction.interactionType === "CONSENT_REQUEST" && <FileText className="h-4 w-4 text-amber-500" />}
                        <span className="text-xs font-semibold text-zinc-700">
                          {interaction.interactionType.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-zinc-400">{formatDate(interaction.date)}</span>
                      </div>
                      <p className="text-sm text-zinc-600 mb-2">{interaction.outcome}</p>
                      {interaction.nextActions && (
                        <p className="text-xs text-blue-600">Next: {interaction.nextActions}</p>
                      )}
                      <p className="text-xs text-zinc-400 mt-2">by {interaction.createdBy.fullName}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Assessment Tab */}
      {activeTab === "risk" && (
        <div className="space-y-4">
          {caseRecord.riskAssessment ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-semibold">{caseRecord.riskAssessment.riskScore}</p>
                      <p className="text-sm text-zinc-500">Risk Score</p>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${riskConfig[caseRecord.riskAssessment.riskLevel]?.color}`}>
                      {riskConfig[caseRecord.riskAssessment.riskLevel]?.label}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Assessed: {formatDate(caseRecord.riskAssessment.assessedAt)} by {caseRecord.riskAssessment.assessedBy.fullName}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caseRecord.riskAssessment.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{factor.factor}</p>
                          <p className="text-xs text-zinc-500">was: {factor.previousValue} → now: {factor.currentValue}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          factor.trend === "improving" ? "bg-green-100 text-green-700" :
                          factor.trend === "declining" ? "bg-red-100 text-red-700" :
                          "bg-zinc-100 text-zinc-700"
                        }`}>
                          {factor.trend === "improving" ? "↑" : factor.trend === "declining" ? "↓" : "→"} {factor.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {caseRecord.escalationEvents && caseRecord.escalationEvents.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                      Escalation History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {caseRecord.escalationEvents.map((event) => (
                        <div key={event.id} className="flex items-start justify-between p-3 bg-zinc-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Escalated to {escalationConfig[event.escalatedTo]?.label}</p>
                            <p className="text-xs text-zinc-500">{event.reason}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                              event.status === "ACKNOWLEDGED" ? "bg-amber-100 text-amber-700" :
                              "bg-zinc-100 text-zinc-700"
                            }`}>
                              {event.status}
                            </span>
                            <p className="text-xs text-zinc-400 mt-1">{formatDate(event.escalatedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <ShieldAlert className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No risk assessment recorded yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          {caseRecord.outcomeMeasurement ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Outcome Measurement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-semibold">{caseRecord.outcomeMeasurement.overallProgressScore}%</p>
                      <p className="text-sm text-zinc-500">Overall Progress</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      caseRecord.outcomeMeasurement.trend === "improving" ? "bg-green-100 text-green-700" :
                      caseRecord.outcomeMeasurement.trend === "declining" ? "bg-red-100 text-red-700" :
                      "bg-zinc-100 text-zinc-700"
                    }`}>
                      {caseRecord.outcomeMeasurement.trend === "improving" ? "↑ Improving" :
                       caseRecord.outcomeMeasurement.trend === "declining" ? "↓ Declining" : "→ Stable"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-zinc-500">Academic</p>
                      <p className="text-lg font-semibold text-blue-600">+{caseRecord.outcomeMeasurement.academicImprovement}%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-zinc-500">Attendance</p>
                      <p className="text-lg font-semibold text-green-600">+{caseRecord.outcomeMeasurement.attendanceImprovement}%</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-zinc-500">Behavioral</p>
                      <p className="text-lg font-semibold text-amber-600">+{caseRecord.outcomeMeasurement.behavioralImprovement}%</p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <p className="text-xs text-zinc-500">Emotional</p>
                      <p className="text-lg font-semibold text-pink-600">+{caseRecord.outcomeMeasurement.emotionalWellbeingImprovement}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progress Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {[
                      { label: "Week 1", value: 20 },
                      { label: "Week 2", value: 35 },
                      { label: "Week 3", value: 45 },
                      { label: "Week 4", value: 55 },
                      { label: "Week 5", value: 68 },
                    ].map((point) => (
                      <div key={point.label} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full bg-zinc-100 rounded-t" style={{ height: `${point.value}%` }}>
                          <div className="w-full bg-blue-500 rounded-t" style={{ height: "100%" }} />
                        </div>
                        <span className="text-xs text-zinc-500">{point.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <TrendingUp className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No outcome data recorded yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Progress will be tracked as interventions are completed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
