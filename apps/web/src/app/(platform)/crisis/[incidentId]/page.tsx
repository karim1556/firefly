"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, ShieldAlert, Users, MessageSquare, Phone, Mail, Calendar, FileText, UserCheck, AlertOctagon, TrendingUp, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { CrisisIncidentRecord, CrisisStatus, CrisisSeverity, IncidentCategory, CrisisEscalationLevel } from "@/lib/types";

const statusConfig: Record<CrisisStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  REPORTED: { label: "Reported", variant: "default" },
  ACKNOWLEDGED: { label: "Acknowledged", variant: "info" },
  INVESTIGATING: { label: "Investigating", variant: "warning" },
  ESCALATED: { label: "Escalated", variant: "danger" },
  MONITORING: { label: "Monitoring", variant: "info" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

const severityConfig: Record<CrisisSeverity, { label: string; className: string; bgClass: string }> = {
  HIGH: { label: "High", className: "text-orange-600 bg-orange-50 border-orange-200", bgClass: "bg-orange-100 text-orange-700" },
  CRITICAL: { label: "Critical", className: "text-red-600 bg-red-50 border-red-200", bgClass: "bg-red-100 text-red-700" },
  EMERGENCY: { label: "Emergency", className: "text-red-700 bg-red-100 border-red-300", bgClass: "bg-red-200 text-red-800" },
};

const categoryLabels: Record<IncidentCategory, string> = {
  SELF_HARM_RISK: "Self-Harm Risk",
  SUICIDE_IDEATION: "Suicide Ideation",
  ABUSE_CONCERNS: "Abuse Concerns",
  BULLYING_ESCALATION: "Bullying Escalation",
  VIOLENCE_THREAT: "Violence Threat",
  SEVERE_EMOTIONAL_DISTREESS: "Severe Emotional Distress",
  MISSING_STUDENT: "Missing Student",
  SAFETY_CONCERN: "Safety Concern",
  SUBSTANCE_CONCERN: "Substance Concern",
};

const escalationPath: CrisisEscalationLevel[] = [
  "TEACHER", "COUNSELLOR", "COORDINATOR", "PRINCIPAL", "SAFEGUARDING_TEAM", "EXTERNAL_AUTHORITIES"
];

const actionTypeLabels: Record<string, string> = {
  CONTACT_PARENT: "Contact Parent",
  SCHEDULE_ASSESSMENT: "Schedule Assessment",
  CONDUCT_SAFETY_CHECK: "Safety Check",
  ARRANGE_COUNSELLING: "Arrange Counselling",
  NOTIFY_LEADERSHIP: "Notify Leadership",
  ESCALATE_EXTERNALLY: "Escalate Externally",
  DOCUMENTATION: "Documentation",
  FOLLOW_UP: "Follow Up",
};

const actionStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  PENDING: { label: "Pending", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  OVERDUE: { label: "Overdue", variant: "danger" },
};

const commTypeLabels: Record<string, string> = {
  PHONE_CALL: "Phone Call",
  EMAIL: "Email",
  MEETING: "Meeting",
  NOTIFICATION: "Notification",
  SMS: "SMS",
};

const timelineEventIcons: Record<string, React.ReactNode> = {
  INCIDENT_REPORTED: <AlertOctagon className="h-4 w-4" />,
  ESCALATION_TRIGGERED: <TrendingUp className="h-4 w-4" />,
  TEAM_ASSIGNED: <Users className="h-4 w-4" />,
  PARENT_CONTACTED: <Phone className="h-4 w-4" />,
  ASSESSMENT_COMPLETED: <CheckCircle2 className="h-4 w-4" />,
  INTERVENTION_STARTED: <FileText className="h-4 w-4" />,
  FOLLOW_UP_CONDUCTED: <Calendar className="h-4 w-4" />,
  INCIDENT_CLOSED: <CheckCircle2 className="h-4 w-4" />,
  STATUS_UPDATED: <Clock className="h-4 w-4" />,
  NOTE_ADDED: <MessageSquare className="h-4 w-4" />,
  ACTION_COMPLETED: <CheckCircle2 className="h-4 w-4" />,
};

export default function CrisisDetailPage() {
  const { incidentId } = useParams<{ incidentId: string }>();
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "actions" | "communications" | "timeline" | "escalation">("overview");

  const query = useQuery({
    queryKey: ["crisis", "incident", incidentId],
    queryFn: () => authFetch<CrisisIncidentRecord>(`/crisis/incidents/${incidentId}`),
    enabled: Boolean(incidentId)
  });

  const incident = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="space-y-6">
        <EmptyState title="Incident not found" description="This crisis incident may have been deleted or does not exist." />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "actions", label: `Actions (${incident.actions?.length || 0})` },
    { id: "communications", label: `Communications (${incident.communications?.length || 0})` },
    { id: "timeline", label: `Timeline (${incident.timelineEvents?.length || 0})` },
    { id: "escalation", label: `Escalation (${incident.escalations?.length || 0})` },
  ];

  const currentEscalationLevel = incident.escalations && incident.escalations.length > 0
    ? incident.escalations[incident.escalations.length - 1].escalatedTo
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/crisis"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{incident.studentName}</h1>
            <p className="text-sm text-zinc-500">
              {incident.incidentId} &bull; {categoryLabels[incident.incidentCategory as IncidentCategory] ?? incident.incidentCategory} &bull; Grade {incident.studentGrade} {incident.studentClassroom}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusConfig[incident.status as CrisisStatus]?.variant ?? "default"} className="text-sm">
            {statusConfig[incident.status as CrisisStatus]?.label ?? incident.status}
          </Badge>
          <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full border ${severityConfig[incident.severity as CrisisSeverity]?.className}`}>
            {severityConfig[incident.severity as CrisisSeverity]?.label ?? incident.severity}
          </span>
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
                ? "border-red-500 text-red-600"
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
          {/* Left Column */}
          <div className="space-y-6">
            {/* Incident Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Category</span>
                    <span className="font-medium">{categoryLabels[incident.incidentCategory as IncidentCategory] ?? incident.incidentCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Severity</span>
                    <span className={`font-medium ${severityConfig[incident.severity as CrisisSeverity]?.bgClass}`}>
                      {severityConfig[incident.severity as CrisisSeverity]?.label ?? incident.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status</span>
                    <Badge variant={statusConfig[incident.status as CrisisStatus]?.variant} className="text-xs">
                      {statusConfig[incident.status as CrisisStatus]?.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Location</span>
                    <span className="font-medium">{incident.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Reported By</span>
                    <span className="font-medium">{incident.reportedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Reported At</span>
                    <span>{formatDate(incident.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last Updated</span>
                    <span>{formatDate(incident.updatedAt)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Description</h4>
                  <p className="text-sm bg-zinc-50 p-3 rounded-lg">{incident.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Student Context */}
            <Card>
              <CardHeader>
                <CardTitle>Student Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Risk Score</span>
                    </div>
                    <span className="font-bold text-red-600">{incident.studentInfo?.riskScore ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Care Tier</span>
                    </div>
                    <span className="font-medium">{incident.studentInfo?.tier ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Existing Cases</span>
                    </div>
                    <span className="font-medium">{incident.studentInfo?.existingCases ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Previous Incidents</span>
                    </div>
                    <span className="font-medium">{incident.studentInfo?.previousIncidents ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Team */}
            <Card>
              <CardHeader>
                <CardTitle>Response Team</CardTitle>
              </CardHeader>
              <CardContent>
                {incident.responseTeam && incident.responseTeam.length > 0 ? (
                  <div className="space-y-3">
                    {incident.responseTeam.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          member.roleType === "OWNER" ? "bg-red-100 text-red-600" :
                          member.roleType === "SUPPORTING" ? "bg-blue-100 text-blue-600" :
                          "bg-zinc-100 text-zinc-600"
                        }`}>
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member.fullName}</p>
                          <p className="text-xs text-zinc-500">{member.role}</p>
                        </div>
                        <Badge variant={member.isAvailable ? "success" : "default"} className="text-xs">
                          {member.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No team assigned yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Escalation Status */}
            {incident.escalations && incident.escalations.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Escalation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Escalation Path Visualization */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      {escalationPath.map((level, idx) => {
                        const isActive = currentEscalationLevel && escalationPath.indexOf(currentEscalationLevel) >= idx;
                        const isCurrent = currentEscalationLevel === level;
                        return (
                          <div key={level} className="flex flex-col items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent ? "bg-red-500 text-white" :
                              isActive ? "bg-red-100 text-red-600 border-2 border-red-300" :
                              "bg-zinc-100 text-zinc-400"
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] mt-1 text-center ${
                              isCurrent ? "text-red-600 font-semibold" : isActive ? "text-zinc-600" : "text-zinc-400"
                            }`}>
                              {level.replace("_", " ")}
                            </span>
                            {idx < escalationPath.length - 1 && (
                              <div className={`h-0.5 w-full absolute top-4 ${
                                isActive && escalationPath.indexOf(currentEscalationLevel!) > idx ? "bg-red-300" : "bg-zinc-200"
                              }`} style={{ width: "calc(100% - 2rem)", left: "1rem" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Escalations */}
                  <div className="space-y-2">
                    {incident.escalations.slice(0, 2).map((esc) => (
                      <div key={esc.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-red-800">{esc.escalatedTo.replace("_", " ")}</span>
                          <Badge variant={esc.status === "RESOLVED" ? "success" : esc.status === "ACKNOWLEDGED" ? "info" : "warning"} className="text-xs">
                            {esc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-red-700">{esc.reason}</p>
                        <p className="text-[10px] text-red-500 mt-1">by {esc.escalatedBy.fullName} &bull; {formatDate(esc.escalatedAt)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{incident._count?.actions ?? 0}</p>
                    <p className="text-xs text-zinc-500">Total Actions</p>
                  </div>
                  <div className="text-center p-3 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {incident.actions?.filter(a => a.status === "COMPLETED").length ?? 0}
                    </p>
                    <p className="text-xs text-zinc-500">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">
                      {incident.actions?.filter(a => a.status === "PENDING" || a.status === "IN_PROGRESS").length ?? 0}
                    </p>
                    <p className="text-xs text-zinc-500">Pending</p>
                  </div>
                  <div className="text-center p-3 bg-zinc-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {incident._count?.communications ?? 0}
                    </p>
                    <p className="text-xs text-zinc-500">Communications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
                  <div className="space-y-3">
                    {incident.timelineEvents.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 flex-shrink-0">
                          {timelineEventIcons[event.eventType] ?? <Clock className="h-3 w-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-zinc-500">{formatDate(event.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No activity yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Pending Actions */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {incident.actions && incident.actions.filter(a => a.status !== "COMPLETED").length > 0 ? (
                  <div className="space-y-2">
                    {incident.actions.filter(a => a.status !== "COMPLETED").slice(0, 3).map((action) => (
                      <div key={action.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm font-medium">{action.taskName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-zinc-500">Due: {formatDate(action.dueTime)}</span>
                          <Badge variant={actionStatusConfig[action.status]?.variant} className="text-xs">
                            {actionStatusConfig[action.status]?.label}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No pending actions</p>
                )}
              </CardContent>
            </Card>

            {/* Communications Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
              </CardHeader>
              <CardContent>
                {incident.communications && incident.communications.length > 0 ? (
                  <div className="space-y-2">
                    {incident.communications.slice(0, 3).map((comm) => (
                      <div key={comm.id} className="p-3 bg-zinc-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="h-3 w-3 text-zinc-400" />
                          <span className="text-sm font-medium">{comm.contactPerson}</span>
                        </div>
                        <p className="text-xs text-zinc-500">{commTypeLabels[comm.communicationType] ?? comm.communicationType} &bull; {formatDate(comm.dateTime)}</p>
                        <p className="text-xs text-zinc-600 mt-1">{comm.outcome}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">No communications logged</p>
                )}
              </CardContent>
            </Card>

            {/* Investigation Status */}
            {incident.investigation && (
              <Card>
                <CardHeader>
                  <CardTitle>Investigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={incident.investigation.status === "COMPLETED" ? "success" : "warning"}>
                      {incident.investigation.status}
                    </Badge>
                    {incident.investigation.concludedAt && (
                      <span className="text-xs text-zinc-500">Concluded: {formatDate(incident.investigation.concludedAt)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === "actions" && (
        <div className="space-y-4">
          {incident.actions && incident.actions.length > 0 ? (
            <Card>
              <div className="divide-y divide-zinc-200">
                {incident.actions.map((action) => (
                  <div key={action.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        action.status === "COMPLETED" ? "border-green-500 bg-green-500" :
                        action.status === "IN_PROGRESS" ? "border-blue-500 bg-blue-500" :
                        action.status === "OVERDUE" ? "border-red-500 bg-red-500" :
                        "border-zinc-300"
                      }`}>
                        {action.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`font-medium ${action.status === "COMPLETED" ? "line-through text-zinc-400" : ""}`}>
                          {action.taskName}
                        </p>
                        <p className="text-sm text-zinc-500">{action.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                          <span>{actionTypeLabels[action.actionType] ?? action.actionType}</span>
                          <span>&bull;</span>
                          <span>Assigned: {action.assignedTo.fullName}</span>
                          <span>&bull;</span>
                          <span>Due: {formatDate(action.dueTime)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={actionStatusConfig[action.status]?.variant}>
                      {actionStatusConfig[action.status]?.label ?? action.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <EmptyState title="No actions yet" description="Emergency actions will appear here." />
          )}
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === "communications" && (
        <div className="space-y-4">
          {incident.communications && incident.communications.length > 0 ? (
            <div className="space-y-4">
              {incident.communications.map((comm) => (
                <Card key={comm.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {comm.communicationType === "PHONE_CALL" ? <Phone className="h-5 w-5 text-blue-600" /> :
                         comm.communicationType === "EMAIL" ? <Mail className="h-5 w-5 text-blue-600" /> :
                         comm.communicationType === "MEETING" ? <Users className="h-5 w-5 text-blue-600" /> :
                         <MessageSquare className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-medium">{comm.contactPerson}</span>
                            <span className="text-sm text-zinc-500 ml-2">({comm.relationship})</span>
                          </div>
                          <Badge variant="default" className="text-xs">
                            {commTypeLabels[comm.communicationType] ?? comm.communicationType}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-600 mb-2">{comm.outcome}</p>
                        {comm.notes && <p className="text-sm text-zinc-500 bg-zinc-50 p-2 rounded">{comm.notes}</p>}
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                          <span>{formatDate(comm.dateTime)}</span>
                          <span>&bull;</span>
                          <span>By {comm.createdBy.fullName}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No communications logged" description="Parent and guardian communications will appear here." />
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {incident.timelineEvents && incident.timelineEvents.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200" />
                  <div className="space-y-6">
                    {incident.timelineEvents.map((event) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center ${
                          event.eventType === "ESCALATION_TRIGGERED" ? "bg-red-100 text-red-600" :
                          event.eventType === "INCIDENT_CLOSED" ? "bg-green-100 text-green-600" :
                          event.eventType === "ACTION_COMPLETED" ? "bg-green-100 text-green-600" :
                          event.eventType === "ASSESSMENT_COMPLETED" ? "bg-blue-100 text-blue-600" :
                          "bg-zinc-100 text-zinc-600"
                        }`}>
                          {timelineEventIcons[event.eventType] ?? <Clock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-sm text-zinc-600">{event.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                            <span>{formatDate(event.createdAt)}</span>
                            {event.createdBy && (
                              <>
                                <span>&bull;</span>
                                <span>{event.createdBy.fullName}</span>
                                <span>&bull;</span>
                                <span>{event.createdBy.role}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="No timeline events yet" description="Activity on this incident will be tracked here." />
          )}
        </div>
      )}

      {/* Escalation Tab */}
      {activeTab === "escalation" && (
        <div className="space-y-4">
          {/* Escalation Path */}
          <Card>
            <CardHeader>
              <CardTitle>Escalation Pathway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {escalationPath.map((level, idx) => {
                  const escItem = incident.escalations?.find(e => e.escalatedTo === level);
                  const isActive = !!escItem;
                  const isCurrent = incident.escalations && incident.escalations.length > 0 &&
                    incident.escalations[incident.escalations.length - 1].escalatedTo === level;
                  return (
                    <div key={level} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        isCurrent ? "bg-red-500 text-white border-red-500 scale-110" :
                        isActive ? "bg-red-100 text-red-600 border-red-300" :
                        "bg-zinc-100 text-zinc-400 border-zinc-200"
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] mt-2 text-center max-w-[60px] ${
                        isCurrent ? "text-red-600 font-semibold" : isActive ? "text-zinc-700" : "text-zinc-400"
                      }`}>
                        {level.replace(/_/g, " ")}
                      </span>
                      {escItem && (
                        <Badge variant={escItem.status === "RESOLVED" ? "success" : escItem.status === "ACKNOWLEDGED" ? "info" : "warning"} className="text-[9px] mt-1">
                          {escItem.status}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Escalation Records */}
          {incident.escalations && incident.escalations.length > 0 ? (
            <div className="space-y-4">
              {incident.escalations.map((esc) => (
                <Card key={esc.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="danger" className="mb-1">{esc.escalatedTo.replace(/_/g, " ")}</Badge>
                        <h3 className="font-medium">Escalation Triggered</h3>
                      </div>
                      <Badge variant={esc.status === "RESOLVED" ? "success" : esc.status === "ACKNOWLEDGED" ? "info" : "warning"}>
                        {esc.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">{esc.reason}</p>
                          <p className="text-zinc-500">Triggered by: {esc.triggeredBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t">
                        <span>Escalated by {esc.escalatedBy.fullName} ({esc.escalatedBy.role})</span>
                        <span>&bull;</span>
                        <span>{formatDate(esc.escalatedAt)}</span>
                        {esc.acknowledgedAt && (
                          <>
                            <span>&bull;</span>
                            <span>Acknowledged: {formatDate(esc.acknowledgedAt)}</span>
                          </>
                        )}
                        {esc.resolvedAt && (
                          <>
                            <span>&bull;</span>
                            <span>Resolved: {formatDate(esc.resolvedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No escalations" description="This incident has not been escalated." />
          )}
        </div>
      )}
    </div>
  );
}
