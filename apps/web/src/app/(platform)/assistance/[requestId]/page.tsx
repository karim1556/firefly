"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, AlertTriangle, User, Users, MessageSquare, CheckCircle2, Send, Calendar, FileText, TrendingUp, ShieldAlert, Plus, ArrowUpRight, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { AssistanceDetail, AssistanceStatus, AssistancePriority, ConcernCategory, ExpertType } from "@/lib/types";

const statusConfig: Record<AssistanceStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  OPEN: { label: "Open", variant: "default" },
  ASSIGNED: { label: "Assigned", variant: "info" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  ESCALATED: { label: "Escalated", variant: "danger" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

const priorityConfig: Record<AssistancePriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "text-slate-600 bg-slate-50 border-slate-200" },
  MEDIUM: { label: "Medium", className: "text-blue-600 bg-blue-50 border-blue-200" },
  HIGH: { label: "High", className: "text-amber-600 bg-amber-50 border-amber-200" },
  CRITICAL: { label: "Critical", className: "text-red-600 bg-red-50 border-red-200" },
};

const categoryLabels: Record<ConcernCategory, string> = {
  EMOTIONAL_WELLBEING: "Emotional Wellbeing",
  BEHAVIORAL_CHALLENGES: "Behavioral Challenges",
  ATTENDANCE_ISSUES: "Attendance Issues",
  ACADEMIC_CONCERNS: "Academic Concerns",
  PARENT_ENGAGEMENT: "Parent Engagement",
  CRISIS_RISK: "Crisis Risk",
  LEARNING_DIFFICULTIES: "Learning Difficulties",
};

const expertTypeLabels: Record<ExpertType, string> = {
  CLINICAL_PSYCHOLOGIST: "Clinical Psychologist",
  SCHOOL_COUNSELLOR: "School Counsellor",
  BEHAVIORAL_SPECIALIST: "Behavioral Specialist",
  LEARNING_SUPPORT_EXPERT: "Learning Support Expert",
  FAMILY_COUNSELLOR: "Family Counsellor",
  SENIOR_SPECIALIST: "Senior Specialist",
  LEADERSHIP: "Leadership Team",
};

const recommendationTypeLabels: Record<string, string> = {
  SUGGESTED_INTERVENTION: "Suggested Intervention",
  COUNSELLING_PLAN: "Counselling Plan",
  PARENT_ENGAGEMENT_STRATEGY: "Parent Engagement Strategy",
  CLASSROOM_SUPPORT_PLAN: "Classroom Support Plan",
  MONITORING_PLAN: "Monitoring Plan",
  EXTERNAL_REFERRAL_RECOMMENDATION: "External Referral",
};

const recommendationStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  PENDING: { label: "Pending", variant: "warning" },
  ACCEPTED: { label: "Accepted", variant: "info" },
  IMPLEMENTED: { label: "Implemented", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
};

const actionItemStatusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  PENDING: { label: "Pending", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  OVERDUE: { label: "Overdue", variant: "danger" },
};

export default function AssistanceDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { authFetch } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "recommendations" | "action-items" | "discussion" | "timeline">("overview");
  const [newMessage, setNewMessage] = useState("");

  const query = useQuery({
    queryKey: ["assistance", requestId],
    queryFn: () => authFetch<AssistanceDetail>(`/assistance/${requestId}`),
    enabled: Boolean(requestId)
  });

  const request = query.data;

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

  if (!request) {
    return (
      <div className="space-y-6">
        <EmptyState title="Assistance request not found" description="This request may have been deleted or does not exist." />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "recommendations", label: `Recommendations (${request.recommendations?.length || 0})` },
    { id: "action-items", label: `Action Items (${request.actionItems?.length || 0})` },
    { id: "discussion", label: `Discussion (${request.discussions?.length || 0})` },
    { id: "timeline", label: `Timeline (${request.timelineEvents?.length || 0})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/assistance"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{request.studentName}</h1>
            <p className="text-sm text-zinc-500">
              {request.requestId} &bull; Grade {request.studentGrade} {request.studentClassroom} &bull; {request.schoolName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusConfig[request.status].variant}>
            {statusConfig[request.status].label}
          </Badge>
          <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full border ${priorityConfig[request.priority].className}`}>
            {priorityConfig[request.priority].label}
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
          {/* Left Column */}
          <div className="space-y-6">
            {/* Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Category</span>
                    <span className="font-medium">{categoryLabels[request.concernCategory] ?? request.concernCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Priority</span>
                    <span className="font-medium">{priorityConfig[request.priority].label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status</span>
                    <Badge variant={statusConfig[request.status].variant} className="text-xs">
                      {statusConfig[request.status].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Submitted By</span>
                    <span className="font-medium">{request.submittedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Created</span>
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Last Updated</span>
                    <span>{formatDate(request.updatedAt)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Summary</h4>
                  <p className="text-sm bg-zinc-50 p-3 rounded-lg">{request.summary}</p>
                </div>

                {request.supportingNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-2">Supporting Notes</h4>
                    <p className="text-sm bg-zinc-50 p-3 rounded-lg">{request.supportingNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Expert */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Expert</CardTitle>
              </CardHeader>
              <CardContent>
                {request.assignedExpert ? (
                  <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{request.assignedExpert.fullName}</p>
                      <p className="text-sm text-zinc-500">
                        {expertTypeLabels[request.assignedExpert.expertType as ExpertType] ?? request.assignedExpert.expertType}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-zinc-500">
                    <User className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                    <p className="text-sm">No expert assigned yet</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Assign Expert
                    </Button>
                  </div>
                )}
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
                      <User className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Age</span>
                    </div>
                    <span className="font-medium">{request.studentContext?.age ?? "-"} years</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Risk Score</span>
                    </div>
                    <span className="font-medium">{request.studentContext?.riskScore ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Existing Cases</span>
                    </div>
                    <span className="font-medium">{request.studentContext?.existingCases ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm">Tier</span>
                    </div>
                    <span className="font-medium">{request.studentContext?.tier ?? "-"}</span>
                  </div>
                </div>

                {request.studentContext?.previousInterventions && request.studentContext.previousInterventions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-zinc-500 mb-2">Previous Interventions</h4>
                    <div className="flex flex-wrap gap-1">
                      {request.studentContext.previousInterventions.map((intervention, i) => (
                        <Badge key={i} variant="default" className="text-xs">{intervention}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Escalation Info */}
            {request.escalations && request.escalations.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Escalations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.escalations.map((escalation) => (
                    <div key={escalation.id} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {expertTypeLabels[escalation.escalatedTo as ExpertType] ?? escalation.escalatedTo}
                        </span>
                        <Badge variant="danger" className="text-xs">{escalation.status}</Badge>
                      </div>
                      <p className="text-sm text-zinc-600">{escalation.reason}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Escalated by {escalation.escalatedBy.fullName} on {formatDate(escalation.escalatedAt)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-semibold">{request.recommendations?.length || 0}</p>
                  <p className="text-sm text-zinc-500">Recommendations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-semibold">{request.actionItems?.filter(a => a.status === "COMPLETED").length || 0}/{request.actionItems?.length || 0}</p>
                  <p className="text-sm text-zinc-500">Actions Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-semibold">{request.discussions?.length || 0}</p>
                  <p className="text-sm text-zinc-500">Discussion Posts</p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {request.timelineEvents && request.timelineEvents.length > 0 ? (
                  <div className="space-y-4">
                    {request.timelineEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-zinc-500">{event.description}</p>
                          <p className="text-xs text-zinc-400 mt-1">{formatDate(event.createdAt)}</p>
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
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-4">
          {request.recommendations && request.recommendations.length > 0 ? (
            request.recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="default" className="mb-2 text-xs">
                        {recommendationTypeLabels[rec.recommendationType] ?? rec.recommendationType}
                      </Badge>
                      <h3 className="font-medium">{rec.title}</h3>
                    </div>
                    <Badge variant={recommendationStatusConfig[rec.status]?.variant}>
                      {recommendationStatusConfig[rec.status]?.label ?? rec.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-600 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span>By {rec.createdBy.fullName}</span>
                      <span>&bull;</span>
                      <span>{expertTypeLabels[rec.createdBy.expertType as ExpertType] ?? rec.createdBy.expertType}</span>
                    </div>
                    {rec.dueDate && <span>Due: {formatDate(rec.dueDate)}</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No recommendations yet"
              description="Expert recommendations will appear here once added."
            />
          )}
        </div>
      )}

      {/* Action Items Tab */}
      {activeTab === "action-items" && (
        <div className="space-y-4">
          {request.actionItems && request.actionItems.length > 0 ? (
            <Card>
              <div className="divide-y divide-zinc-200">
                {request.actionItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        item.status === "COMPLETED" ? "border-green-500 bg-green-500" :
                        item.status === "IN_PROGRESS" ? "border-blue-500 bg-blue-500" :
                        item.status === "OVERDUE" ? "border-red-500 bg-red-500" :
                        "border-zinc-300"
                      }`}>
                        {item.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`font-medium ${item.status === "COMPLETED" ? "line-through text-zinc-400" : ""}`}>
                          {item.taskName}
                        </p>
                        <p className="text-sm text-zinc-500">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                          <span>Assigned to: {item.assignedTo.fullName}</span>
                          <span>&bull;</span>
                          <span>Due: {formatDate(item.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={actionItemStatusConfig[item.status]?.variant}>
                      {actionItemStatusConfig[item.status]?.label ?? item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No action items yet"
              description="Action items from recommendations will appear here."
            />
          )}
        </div>
      )}

      {/* Discussion Tab */}
      {activeTab === "discussion" && (
        <div className="space-y-4">
          {request.discussions && request.discussions.length > 0 ? (
            <div className="space-y-4">
              {request.discussions.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{post.authorName}</span>
                          <Badge variant="default" className="text-xs">{post.authorType.replace("_", " ")}</Badge>
                          <span className="text-xs text-zinc-400">{formatDate(post.createdAt)}</span>
                        </div>
                        <p className="text-sm text-zinc-700">{post.message}</p>
                        {post.mentions && post.mentions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {post.mentions.map((mention) => (
                              <span key={mention} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                @{mention}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No discussion yet"
              description="Start a discussion to collaborate with the expert."
            />
          )}

          {/* Reply Input */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add to the discussion..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {request.timelineEvents && request.timelineEvents.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200" />
                  <div className="space-y-6">
                    {request.timelineEvents.map((event, index) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center ${
                          event.eventType === "ESCALATED" ? "bg-red-100 text-red-600" :
                          event.eventType === "RESOLVED" ? "bg-green-100 text-green-600" :
                          event.eventType === "EXPERT_ASSIGNED" ? "bg-blue-100 text-blue-600" :
                          event.eventType === "RECOMMENDATION_ADDED" ? "bg-purple-100 text-purple-600" :
                          "bg-zinc-100 text-zinc-600"
                        }`}>
                          {event.eventType === "ESCALATED" ? <AlertTriangle className="h-4 w-4" /> :
                           event.eventType === "RESOLVED" ? <CheckCircle2 className="h-4 w-4" /> :
                           event.eventType === "EXPERT_ASSIGNED" ? <UserCheck className="h-4 w-4" /> :
                           event.eventType === "RECOMMENDATION_ADDED" ? <FileText className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
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
            <EmptyState
              title="No timeline events yet"
              description="Activity on this request will be tracked here."
            />
          )}
        </div>
      )}
    </div>
  );
}
