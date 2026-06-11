"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, CheckCircle2, XCircle, User, Phone, Mail, MapPin, Star, Calendar, MessageSquare, Flag, Plus, Send, Lock, Unlock } from "lucide-react";
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
import type { ReferralDetail, ReferralStatus, Priority, MilestoneStatus, FollowUpStatus } from "@/lib/types";

const statusConfig: Record<ReferralStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  DRAFT: { label: "Draft", variant: "default" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  ACTIVE: { label: "Active", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "default" },
};

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "text-slate-600 bg-slate-50 border-slate-200" },
  MEDIUM: { label: "Medium", className: "text-blue-600 bg-blue-50 border-blue-200" },
  HIGH: { label: "High", className: "text-amber-600 bg-amber-50 border-amber-200" },
  CRITICAL: { label: "Critical", className: "text-red-600 bg-red-50 border-red-200" },
};

const milestoneConfig: Record<MilestoneStatus, { label: string; className: string; icon: React.ReactNode }> = {
  NOT_STARTED: { label: "Not Started", className: "text-zinc-500 bg-zinc-50 border-zinc-200", icon: <Clock className="h-3 w-3" /> },
  IN_PROGRESS: { label: "In Progress", className: "text-blue-600 bg-blue-50 border-blue-200", icon: <Clock className="h-3 w-3" /> },
  COMPLETED: { label: "Completed", className: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle2 className="h-3 w-3" /> },
};

const followUpStatusConfig: Record<FollowUpStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SCHEDULED: { label: "Scheduled", variant: "info" },
  COMPLETED: { label: "Completed", variant: "success" },
  MISSED: { label: "Missed", variant: "danger" },
  RESCHEDULED: { label: "Rescheduled", variant: "warning" },
  CANCELLED: { label: "Cancelled", variant: "default" },
};

export default function ReferralDetailPage() {
  const { referralId } = useParams<{ referralId: string }>();
  const { authFetch, user } = useAuth();
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState("");
  const [newMilestoneType, setNewMilestoneType] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState("");

  const query = useQuery({
    queryKey: ["referral", referralId],
    queryFn: () => authFetch<ReferralDetail>(`/referrals/${referralId}`),
    enabled: Boolean(referralId)
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: ReferralStatus) =>
      authFetch(`/referrals/${referralId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const parentApprovalMutation = useMutation({
    mutationFn: (approved: boolean) =>
      authFetch(`/referrals/${referralId}/parent-approval`, {
        method: "POST",
        body: JSON.stringify({ approved })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const addTimelineEventMutation = useMutation({
    mutationFn: (data: { eventType: string; title: string; description: string }) =>
      authFetch(`/referrals/${referralId}/timeline`, {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const addCommunicationMutation = useMutation({
    mutationFn: (data: { authorName: string; authorRole: string; message: string }) =>
      authFetch(`/referrals/${referralId}/communication`, {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral", referralId] });
      setNewMessage("");
    }
  });

  const addMilestoneMutation = useMutation({
    mutationFn: (data: { milestoneType: string }) =>
      authFetch(`/referrals/${referralId}/milestones`, {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral", referralId] });
      setNewMilestoneType("");
    }
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: ({ milestoneId, status }: { milestoneId: string; status: MilestoneStatus }) =>
      authFetch(`/referrals/${referralId}/milestones/${milestoneId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const scheduleFollowUpMutation = useMutation({
    mutationFn: (data: { scheduledAt: string }) =>
      authFetch(`/referrals/${referralId}/follow-ups`, {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral", referralId] });
      setNewFollowUpDate("");
    }
  });

  const updateFollowUpMutation = useMutation({
    mutationFn: ({ followUpId, status }: { followUpId: string; status: FollowUpStatus }) =>
      authFetch(`/referrals/${referralId}/follow-ups/${followUpId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const requestContactMutation = useMutation({
    mutationFn: () =>
      authFetch(`/referrals/${referralId}/practitioners/${query.data?.practitioner.id}/request-access`, {
        method: "POST"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["referral", referralId] })
  });

  const referral = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="space-y-6">
        <EmptyState title="Referral not found" description="This referral may have been deleted or does not exist." />
      </div>
    );
  }

  const completedMilestones = referral.milestones.filter(m => m.status === "COMPLETED").length;
  const progressPercent = referral.milestones.length > 0
    ? Math.round((completedMilestones / referral.milestones.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/referrals"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {referral.student.firstName} {referral.student.lastName}
            </h1>
            <p className="text-sm text-zinc-500">
              {referral.student.grade} {referral.student.classroom} &bull; Referred to {referral.practitioner.fullName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusConfig[referral.status].variant} className="text-sm">
            {statusConfig[referral.status].label}
          </Badge>
          <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-full border ${priorityConfig[referral.priority].className}`}>
            {priorityConfig[referral.priority].label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6">
          {/* Student & Practitioner Card */}
          <Card>
            <CardHeader>
              <CardTitle>Care Coordination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Student</h3>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                  <User className="h-8 w-8 text-zinc-400" />
                  <div>
                    <p className="font-medium">{referral.student.firstName} {referral.student.lastName}</p>
                    <p className="text-sm text-zinc-500">{referral.student.grade} {referral.student.classroom}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Practitioner</h3>
                <div className="p-3 bg-zinc-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-zinc-400" />
                    <div className="flex-1">
                      <p className="font-medium">{referral.practitioner.fullName}</p>
                      <p className="text-sm text-zinc-500">{referral.practitioner.specializations?.join(", ")}</p>
                    </div>
                    {referral.practitioner.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">{referral.practitioner.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    {referral.practitioner.city}
                  </div>
                  <div className="pt-2 border-t">
                    {referral.practitioner.contactUnlocked ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-zinc-400" />
                          {referral.practitioner.email}
                        </div>
                        {referral.practitioner.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-zinc-400" />
                            {referral.practitioner.phone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => requestContactMutation.mutate()}
                        disabled={requestContactMutation.isPending}
                      >
                        <Lock className="h-3 w-3 mr-2" />
                        Request Contact Access
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Referral Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Category</span>
                    <span className="font-medium">{referral.concernCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Referred By</span>
                    <span className="font-medium">{referral.referredBy.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Created</span>
                    <span>{formatDate(referral.createdAt)}</span>
                  </div>
                </div>
              </div>

              {referral.notes && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Notes</h3>
                  <p className="text-sm bg-zinc-50 p-3 rounded-lg">{referral.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parent Approval Card */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {referral.parentApprovalStatus === "PENDING" ? (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Awaiting Approval</span>
                  </div>
                ) : referral.parentApprovalStatus === "APPROVED" ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Approved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Rejected</span>
                  </div>
                )}
              </div>
              {referral.parentApprovalStatus === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => parentApprovalMutation.mutate(true)}
                    disabled={parentApprovalMutation.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => parentApprovalMutation.mutate(false)}
                    disabled={parentApprovalMutation.isPending}
                  >
                    Reject
                  </Button>
                </div>
              )}
              {referral.parentApprovedAt && (
                <p className="text-sm text-zinc-500 mt-2">
                  {referral.parentApprovalStatus === "APPROVED" ? "Approved" : "Rejected"} on {formatDate(referral.parentApprovedAt)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Milestones Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Milestones</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">{completedMilestones}/{referral.milestones.length}</span>
                  <div className="w-20 h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {referral.milestones.length === 0 ? (
                <p className="text-sm text-zinc-500">No milestones set yet.</p>
              ) : (
                referral.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${milestoneConfig[milestone.status].className}`}>
                        {milestoneConfig[milestone.status].icon}
                        <span className="ml-1">{milestoneConfig[milestone.status].label}</span>
                      </span>
                      <span className="text-sm font-medium">{milestone.milestoneType}</span>
                    </div>
                    <select
                      className="text-xs border rounded px-2 py-1"
                      value={milestone.status}
                      onChange={(e) => updateMilestoneMutation.mutate({ milestoneId: milestone.id, status: e.target.value as MilestoneStatus })}
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                ))
              )}
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add milestone..."
                  value={newMilestoneType}
                  onChange={(e) => setNewMilestoneType(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => newMilestoneType && addMilestoneMutation.mutate({ milestoneType: newMilestoneType })}
                  disabled={!newMilestoneType || addMilestoneMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Follow-ups Card */}
          <Card>
            <CardHeader>
              <CardTitle>Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {referral.followUps.length === 0 ? (
                <p className="text-sm text-zinc-500">No follow-ups scheduled.</p>
              ) : (
                referral.followUps.map((followUp) => (
                  <div key={followUp.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{formatDate(followUp.scheduledAt)}</p>
                      {followUp.notes && <p className="text-xs text-zinc-500">{followUp.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={followUpStatusConfig[followUp.status].variant} className="text-xs">
                        {followUpStatusConfig[followUp.status].label}
                      </Badge>
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={followUp.status}
                        onChange={(e) => updateFollowUpMutation.mutate({ followUpId: followUp.id, status: e.target.value as FollowUpStatus })}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="MISSED">Missed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
              <div className="flex gap-2 pt-2">
                <Input
                  type="datetime-local"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => newFollowUpDate && scheduleFollowUpMutation.mutate({ scheduledAt: newFollowUpDate })}
                  disabled={!newFollowUpDate || scheduleFollowUpMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Communication */}
        <div className="lg:col-span-2 space-y-6">
          {/* Care Journey Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Care Journey Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {referral.timelineEvents.length === 0 ? (
                <p className="text-sm text-zinc-500">No timeline events yet.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200" />
                  <div className="space-y-4">
                    {referral.timelineEvents.map((event, idx) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-zinc-300">
                          <div className="h-2 w-2 rounded-full bg-zinc-400" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.title}</span>
                            <span className="text-xs text-zinc-500">{formatDate(event.createdAt)}</span>
                          </div>
                          <p className="text-sm text-zinc-600 mt-1">{event.description}</p>
                          <p className="text-xs text-zinc-400 mt-1">
                            by {event.createdBy.fullName} ({event.createdBy.role})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communication Log */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {referral.communicationLogs.length === 0 ? (
                <p className="text-sm text-zinc-500">No communication logs yet.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {referral.communicationLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-zinc-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{log.authorName}</span>
                        <span className="text-xs text-zinc-500">{formatDate(log.createdAt)}</span>
                      </div>
                      <Badge variant="default" className="text-xs mb-2">{log.authorRole}</Badge>
                      <p className="text-sm">{log.message}</p>
                      {log.attachmentUrl && (
                        <a href={log.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                          View Attachment
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newMessage.trim()) {
                        addCommunicationMutation.mutate({
                          authorName: user?.fullName || "Unknown",
                          authorRole: user?.role || "COUNSELLOR",
                          message: newMessage.trim()
                        });
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newMessage.trim()) {
                        addCommunicationMutation.mutate({
                          authorName: user?.fullName || "Unknown",
                          authorRole: user?.role || "COUNSELLOR",
                          message: newMessage.trim()
                        });
                      }
                    }}
                    disabled={!newMessage.trim() || addCommunicationMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {referral.status === "DRAFT" && (
                  <Button size="sm" onClick={() => updateStatusMutation.mutate("PENDING_APPROVAL")}>
                    Submit for Approval
                  </Button>
                )}
                {referral.status === "PENDING_APPROVAL" && (
                  <Button size="sm" onClick={() => updateStatusMutation.mutate("ACTIVE")}>
                    Activate Referral
                  </Button>
                )}
                {referral.status === "ACTIVE" && (
                  <Button size="sm" onClick={() => updateStatusMutation.mutate("COMPLETED")}>
                    Mark as Completed
                  </Button>
                )}
                {referral.status !== "COMPLETED" && referral.status !== "CANCELLED" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate("CANCELLED")}>
                    Cancel Referral
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}