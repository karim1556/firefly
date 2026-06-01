"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/modules/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { PaginatedResponse, Classroom } from "@/lib/types";

export default function ClassroomsPage() {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => authFetch<PaginatedResponse<Classroom>>(`/classrooms`)
  });

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const classrooms = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Classrooms" description="View class rosters, timetables, and wellbeing snapshots." />

      <Card>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((c: Classroom) => (
                  <tr key={c.id} className="border-t border-zinc-200 text-zinc-800">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.grade}</td>
                    <td className="px-4 py-3">{c.teacher?.fullName}</td>
                    <td className="px-4 py-3">{c.studentsCount}</td>
                    <td className="px-4 py-3">
                      <Link href={`/classrooms/${c.id}`} className="text-sm text-indigo-600">Open roster</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
