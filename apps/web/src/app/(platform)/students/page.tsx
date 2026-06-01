"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { toQueryString } from "@/lib/utils";
import type { PaginatedResponse, StudentSummary } from "@/lib/types";

type TierFilter = "" | "TIER_1" | "TIER_2" | "TIER_3";

function statusVariant(status: StudentSummary["status"]) {
  if (status === "NEEDS_INTERVENTION") {
    return "danger";
  }

  if (status === "NEEDS_SUPPORT") {
    return "warning";
  }

  return "success";
}

export default function StudentsPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<TierFilter>("");
  const [grade, setGrade] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["students", search, tier, grade, page],
    queryFn: () =>
      authFetch<PaginatedResponse<StudentSummary>>(
        `/students${toQueryString({ search, tier, grade, page, pageSize: 8 })}`
      )
  });

  const students = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Track wellbeing status, tier placement, and intervention readiness." />

      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by name or admission number"
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={tier}
              onChange={(event) => {
                setTier(event.target.value as TierFilter);
                setPage(1);
              }}
              aria-label="Filter by tier"
            >
              <option value="">All tiers</option>
              <option value="TIER_1">Tier 1</option>
              <option value="TIER_2">Tier 2</option>
              <option value="TIER_3">Tier 3</option>
            </select>

            <Input
              placeholder="Class / Grade"
              value={grade}
              onChange={(event) => {
                setGrade(event.target.value);
                setPage(1);
              }}
              aria-label="Filter by class"
            />
          </div>

          {query.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : students.length ? (
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t border-zinc-200 text-zinc-800">
                      <td className="px-4 py-3 font-medium">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3">
                        Grade {student.grade} • {student.classroom}
                      </td>
                      <td className="px-4 py-3">{student.tier.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(student.status)}>{student.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-4 py-3">{student.riskScore}</td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/students/${student.id}`}>View profile</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No students found"
              description="Adjust your filters or search terms to find student records."
            />
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Page {query.data?.pagination.page ?? 1} of {query.data?.pagination.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
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
