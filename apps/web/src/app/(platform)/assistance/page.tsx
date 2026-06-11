"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Headphones, Clock, AlertTriangle, CheckCircle2, Plus, Users, ArrowUpRight, TrendingUp, FileText } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { toQueryString, formatDate } from "@/lib/utils";
import type { AssistanceRequest, AssistanceDashboardStats, AssistanceStatus, AssistancePriority, ConcernCategory, PaginatedResponse } from "@/lib/types";

const statusConfig: Record<AssistanceStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" | undefined }> = {
  OPEN: { label: "Open", variant: "default" },
  ASSIGNED: { label: "Assigned", variant: "info" },
  IN_PROGRESS: { label: "In Progress", variant: "warning" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: undefined },
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

export default function AssistancePage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const statsQuery = useQuery({
    queryKey: ["assistance", "dashboard", "stats"],
    queryFn: () => authFetch<AssistanceDashboardStats>("/assistance/dashboard/stats")
  });

  const query = useQuery({
    queryKey: ["assistance", search, status, priority, category, page],
    queryFn: () =>
      authFetch<PaginatedResponse<AssistanceRequest>>(
        `/assistance${toQueryString({ search, status, priority, category, page, pageSize: 10 })}`
      )
  });

  const data = query.data?.data ?? [];
  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hub & Spoke Assistance"
        description="Request expert guidance from central wellbeing specialists and support teams."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/assistance/experts">View Experts</Link>
            </Button>
            <Button asChild>
              <Link href="/students">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>
        }
      />

      {/* Dashboard Metrics */}
      {statsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Total Requests</p>
                  <p className="text-3xl font-semibold">{stats.totalRequests}</p>
                </div>
                <FileText className="h-10 w-10 text-zinc-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Open Requests</p>
                  <p className="text-3xl font-semibold">{stats.openRequests}</p>
                </div>
                <ArrowUpRight className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">In Progress</p>
                  <p className="text-3xl font-semibold">{stats.inProgressRequests}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Resolved</p>
                  <p className="text-3xl font-semibold">{stats.resolvedRequests}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">High Priority</p>
                  <p className="text-3xl font-semibold text-red-600">{stats.highPriorityRequests}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Avg Response Time</p>
                  <p className="text-3xl font-semibold">{stats.avgResponseTime}</p>
                </div>
                <Clock className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Experts Available</p>
                  <p className="text-3xl font-semibold">6</p>
                </div>
                <Users className="h-10 w-10 text-teal-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Escalated</p>
                  <p className="text-3xl font-semibold">{stats.requestsByStatus.find(s => s.status === "ESCALATED")?.count ?? 0}</p>
                </div>
                <Headphones className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <Input
              placeholder="Search by student, ID, or school..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              <option value="EMOTIONAL_WELLBEING">Emotional Wellbeing</option>
              <option value="BEHAVIORAL_CHALLENGES">Behavioral Challenges</option>
              <option value="ATTENDANCE_ISSUES">Attendance Issues</option>
              <option value="ACADEMIC_CONCERNS">Academic Concerns</option>
              <option value="PARENT_ENGAGEMENT">Parent Engagement</option>
              <option value="CRISIS_RISK">Crisis Risk</option>
              <option value="LEARNING_DIFFICULTIES">Learning Difficulties</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setStatus(""); setPriority(""); setCategory(""); setPage(1); }}>
              Clear Filters
            </Button>
          </div>

          {query.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data.length ? (
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Request ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Expert</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((request) => (
                    <tr key={request.id} className="border-t border-zinc-200 text-zinc-800">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{request.requestId}</td>
                      <td className="px-4 py-3 font-medium">
                        {request.studentName}
                        <span className="ml-2 text-xs text-zinc-500">
                          Gr. {request.studentGrade} {request.studentClassroom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{categoryLabels[request.concernCategory] ?? request.concernCategory}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${priorityConfig[request.priority].className}`}>
                          {priorityConfig[request.priority].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[request.status].variant}>
                          {statusConfig[request.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {request.assignedExpert ? (
                          <span>{request.assignedExpert.fullName}</span>
                        ) : (
                          <span className="text-zinc-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{request.schoolName}</td>
                      <td className="px-4 py-3 text-zinc-500">{formatDate(request.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/assistance/${request.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No assistance requests found"
              description="Assistance requests will appear here once created by school staff."
            />
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Page {query.data?.pagination.page ?? 1} of {query.data?.pagination.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
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
