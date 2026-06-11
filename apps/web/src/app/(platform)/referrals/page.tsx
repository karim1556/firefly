"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, FileText, UserPlus, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { toQueryString, formatDate } from "@/lib/utils";
import type { ReferralSummary, ReferralDashboardStats, PaginatedResponse, ReferralStatus, Priority } from "@/lib/types";

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

export default function ReferralsPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const statsQuery = useQuery({
    queryKey: ["referrals", "dashboard", "stats"],
    queryFn: () => authFetch<ReferralDashboardStats>("/referrals/dashboard/stats")
  });

  const query = useQuery({
    queryKey: ["referrals", search, status, priority, page],
    queryFn: () =>
      authFetch<PaginatedResponse<ReferralSummary>>(
        `/referrals${toQueryString({ search, status, priority, page, pageSize: 8 })}`
      )
  });

  const data = query.data?.data ?? [];
  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral Network"
        description="Connect students with trusted mental health professionals and track care journeys."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/referrals/practitioners">Find Practitioners</Link>
            </Button>
            <Button asChild>
              <Link href="/students">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Referral
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
                  <p className="text-sm text-zinc-500">Total Referrals</p>
                  <p className="text-3xl font-semibold">{stats.totalReferrals}</p>
                </div>
                <FileText className="h-10 w-10 text-zinc-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Active Referrals</p>
                  <p className="text-3xl font-semibold">{stats.activeReferrals}</p>
                </div>
                <ArrowRight className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Completed</p>
                  <p className="text-3xl font-semibold">{stats.completedReferrals}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Pending Approval</p>
                  <p className="text-3xl font-semibold">{stats.pendingApproval}</p>
                </div>
                <Clock className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">High Priority</p>
                  <p className="text-3xl font-semibold text-red-600">{stats.highPriorityCases}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Avg Resolution</p>
                  <p className="text-3xl font-semibold">{stats.averageResolutionDays}<span className="text-lg text-zinc-500"> days</span></p>
                </div>
                <Clock className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Search by student or practitioner..."
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
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
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
            <Button variant="outline" onClick={() => { setSearch(""); setStatus(""); setPriority(""); setPage(1); }}>
              Clear Filters
            </Button>
          </div>

          {query.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data.length ? (
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Practitioner</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Parent Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((referral) => (
                    <tr key={referral.id} className="border-t border-zinc-200 text-zinc-800">
                      <td className="px-4 py-3 font-medium">
                        {referral.student.firstName} {referral.student.lastName}
                        <span className="ml-2 text-xs text-zinc-500">
                          {referral.student.grade} {referral.student.classroom}
                        </span>
                      </td>
                      <td className="px-4 py-3">{referral.practitioner.fullName}</td>
                      <td className="px-4 py-3">{referral.concernCategory}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${priorityConfig[referral.priority].className}`}>
                          {priorityConfig[referral.priority].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[referral.status].variant}>
                          {statusConfig[referral.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {referral.parentApprovalStatus === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        ) : referral.parentApprovalStatus === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{formatDate(referral.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/referrals/${referral.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No referrals found"
              description="Referrals will appear here once created. Start by finding a practitioner."
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