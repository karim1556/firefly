"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, FileText, Eye, Clock, Shield, ChevronRight, Filter } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, toQueryString } from "@/lib/utils";
import type { Policy, PolicyStatus, PolicyCategory, PaginatedResponse } from "@/lib/types";

const statusConfig: Record<PolicyStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  DRAFT: { label: "Draft", variant: "default" },
  UNDER_REVIEW: { label: "Under Review", variant: "warning" },
  APPROVED: { label: "Approved", variant: "info" },
  PUBLISHED: { label: "Published", variant: "success" },
  ARCHIVED: { label: "Archived", variant: "default" },
  EXPIRED: { label: "Expired", variant: "danger" },
};

const categoryLabels: Record<PolicyCategory, string> = {
  STUDENT_WELLBEING: "Student Wellbeing",
  SAFEGUARDING: "Safeguarding",
  CRISIS_MANAGEMENT: "Crisis Management",
  REFERRAL_GUIDELINES: "Referral Guidelines",
  PARENT_COMMUNICATION: "Parent Communication",
  SEL_FRAMEWORKS: "SEL Frameworks",
  SCHOOL_PROCEDURES: "School Procedures",
  STAFF_HANDBOOK: "Staff Handbook",
};

const categoryIcons: Record<string, React.ReactNode> = {
  STUDENT_WELLBEING: <FileText className="h-5 w-5" />,
  SAFEGUARDING: <Shield className="h-5 w-5" />,
  CRISIS_MANAGEMENT: <FileText className="h-5 w-5" />,
  REFERRAL_GUIDELINES: <FileText className="h-5 w-5" />,
  PARENT_COMMUNICATION: <FileText className="h-5 w-5" />,
  SEL_FRAMEWORKS: <FileText className="h-5 w-5" />,
  SCHOOL_PROCEDURES: <FileText className="h-5 w-5" />,
  STAFF_HANDBOOK: <FileText className="h-5 w-5" />,
};

export default function PoliciesPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["compliance", "policies", search, status, category, page],
    queryFn: () =>
      authFetch<PaginatedResponse<Policy>>(
        `/compliance/policies${toQueryString({ search, status, category, page, pageSize: 12 })}`
      )
  });

  const data = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policy Repository"
        description="Browse and manage all organizational policies, guidelines, and procedures."
        actions={
          <Button asChild>
            <Link href="/compliance">
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search policies..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
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
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
              <option value="EXPIRED">Expired</option>
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
              <option value="STUDENT_WELLBEING">Student Wellbeing</option>
              <option value="SAFEGUARDING">Safeguarding</option>
              <option value="CRISIS_MANAGEMENT">Crisis Management</option>
              <option value="REFERRAL_GUIDELINES">Referral Guidelines</option>
              <option value="PARENT_COMMUNICATION">Parent Communication</option>
              <option value="SEL_FRAMEWORKS">SEL Frameworks</option>
              <option value="SCHOOL_PROCEDURES">School Procedures</option>
              <option value="STAFF_HANDBOOK">Staff Handbook</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setStatus(""); setCategory(""); setPage(1); }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : data.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        {categoryIcons[policy.category] ?? <FileText className="h-4 w-4" />}
                      </div>
                      <Badge variant={statusConfig[policy.status]?.variant ?? "default"} className="text-xs">
                        {statusConfig[policy.status]?.label ?? policy.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{policy.version}</span>
                  </div>

                  <div>
                    <h3 className="font-semibold line-clamp-1">{policy.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{policy.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100">
                      {categoryLabels[policy.category as PolicyCategory] ?? policy.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {policy._count.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(policy.effectiveDate)}
                      </span>
                    </div>
                  </div>

                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href={`/compliance/policies/${policy.id}`}>
                      View Policy <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing {data.length} policies
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
        </>
      ) : (
        <EmptyState
          title="No policies found"
          description="Policies will appear here once created."
        />
      )}
    </div>
  );
}
