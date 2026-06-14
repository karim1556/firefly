"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, ClipboardList, ChevronRight, Clock, Download, Eye, CheckCircle2, StepForward } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { Sop, SopCategory } from "@/lib/types";

const categoryLabels: Record<SopCategory, string> = {
  CRISIS_RESPONSE: "Crisis Response",
  REFERRAL_MANAGEMENT: "Referral Management",
  STUDENT_ESCALATION: "Student Escalation",
  PARENT_COMMUNICATION: "Parent Communication",
  COUNSELLING_PROCEDURES: "Counselling Procedures",
  SAFEGUARDING_PROCEDURES: "Safeguarding Procedures",
};

const categoryColors: Record<string, string> = {
  CRISIS_RESPONSE: "bg-red-100 text-red-700",
  REFERRAL_MANAGEMENT: "bg-blue-100 text-blue-700",
  STUDENT_ESCALATION: "bg-amber-100 text-amber-700",
  PARENT_COMMUNICATION: "bg-purple-100 text-purple-700",
  COUNSELLING_PROCEDURES: "bg-teal-100 text-teal-700",
  SAFEGUARDING_PROCEDURES: "bg-green-100 text-green-700",
};

interface SopResponse {
  data: Sop[];
}

export default function SopLibraryPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const query = useQuery({
    queryKey: ["compliance", "sops", search, category],
    queryFn: () =>
      authFetch<SopResponse>(
        `/compliance/sops${search || category ? `?${new URLSearchParams({ search, category }).toString()}` : ""}`
      )
  });

  const data = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SOP & Process Library"
        description="Standard operating procedures and step-by-step guidance for wellbeing operations."
        actions={
          <Button variant="outline" asChild>
            <Link href="/compliance">Back to Dashboard</Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search SOPs..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              <option value="CRISIS_RESPONSE">Crisis Response</option>
              <option value="REFERRAL_MANAGEMENT">Referral Management</option>
              <option value="STUDENT_ESCALATION">Student Escalation</option>
              <option value="PARENT_COMMUNICATION">Parent Communication</option>
              <option value="COUNSELLING_PROCEDURES">Counselling Procedures</option>
              <option value="SAFEGUARDING_PROCEDURES">Safeguarding Procedures</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setCategory(""); }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SOP List */}
      {query.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : data.length ? (
        <div className="space-y-4">
          {data.map((sop) => (
            <Card key={sop.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[sop.category] ?? "bg-zinc-100 text-zinc-600"}`}>
                    <ClipboardList className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{sop.title}</h3>
                          <Badge variant="default" className="text-xs">{sop.version}</Badge>
                          {sop.isActive && <Badge variant="success" className="text-xs">Active</Badge>}
                        </div>
                        <p className="text-sm text-zinc-600 line-clamp-2">{sop.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/compliance/sops/${sop.id}`}>
                            View SOP <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Steps Preview */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sop.steps.slice(0, 4).map((step) => (
                        <div key={step.step} className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded-full">
                          <StepForward className="h-3 w-3" />
                          <span>{step.title}</span>
                        </div>
                      ))}
                      {sop.steps.length > 4 && (
                        <div className="text-xs text-zinc-400 px-2 py-1">
                          +{sop.steps.length - 4} more steps
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                      <span className={`px-2 py-0.5 rounded-full ${categoryColors[sop.category] ?? "bg-zinc-100"}`}>
                        {categoryLabels[sop.category as SopCategory] ?? sop.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {sop.steps.length} steps
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {sop._count.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {sop._count.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatDate(sop.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No SOPs found"
          description="Standard operating procedures will appear here."
        />
      )}
    </div>
  );
}
