"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Filter, Plus, Star, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { Facilitator } from "@/lib/types";

const typeLabel: Record<string, string> = {
  SCHOOL_COUNSELLOR: "School Counsellor",
  TEACHER: "Teacher",
  PRINCIPAL: "Principal",
  EXTERNAL_EXPERT: "External Expert",
};

const typeColor: Record<string, string> = {
  SCHOOL_COUNSELLOR: "bg-emerald-100 text-emerald-700",
  TEACHER: "bg-blue-100 text-blue-700",
  PRINCIPAL: "bg-purple-100 text-purple-700",
  EXTERNAL_EXPERT: "bg-amber-100 text-amber-700",
};

export default function FacilitatorsPage() {
  const { authFetch } = useAuth();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["facilitators", typeFilter],
    queryFn: () => authFetch<{ data: Facilitator[] }>(
      `/facilitators${typeFilter !== "all" ? `?type=${typeFilter}` : ""}`
    ),
  });

  const facilitators = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facilitator Management"
        description="Manage SEL and workshop facilitators across your school community."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Facilitator
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{facilitators.length}</p>
              <p className="text-xs text-slate-500">Total Facilitators</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {facilitators.filter(f => f.type === "SCHOOL_COUNSELLOR").length}
              </p>
              <p className="text-xs text-slate-500">School Counsellors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {facilitators.filter(f => f.type === "EXTERNAL_EXPERT").length}
              </p>
              <p className="text-xs text-slate-500">External Experts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {facilitators.filter(f => f.type === "TEACHER").length}
              </p>
              <p className="text-xs text-slate-500">Teacher Facilitators</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all","SCHOOL_COUNSELLOR","TEACHER","PRINCIPAL","EXTERNAL_EXPERT"].map(f => (
          <Button key={f} variant={typeFilter === f ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(f)}>
            {f === "all" ? "All Types" : typeLabel[f] || f}
          </Button>
        ))}
      </div>

      {/* Facilitator Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : facilitators.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {facilitators.map((fac) => (
            <Card key={fac.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-indigo-700">
                      {fac.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{fac.fullName}</p>
                    <p className="text-xs text-slate-500">{fac.email}</p>
                    <Badge className={`mt-1 text-xs ${typeColor[fac.type]}`}>
                      {typeLabel[fac.type] || fac.type}
                    </Badge>
                  </div>
                </div>

                {fac.bio && (
                  <p className="text-sm text-slate-600 line-clamp-2">{fac.bio}</p>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.expertise.map((exp, i) => (
                      <Badge key={i} variant="default" className="text-xs font-normal">{exp}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Button size="sm" variant="ghost" className="h-7 text-xs">View Profile</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Assign Session</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No facilitators found" description="Add your first facilitator to get started." />
      )}
    </div>
  );
}
