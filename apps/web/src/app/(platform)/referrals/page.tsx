"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type ReferralItem = {
  id: string;
  studentName: string;
  referredBy: string;
  referredTo: string;
  reason: string;
  status: "pending" | "accepted" | "completed" | "declined";
  createdAt: string;
  priority: "low" | "medium" | "high" | "urgent";
};

const statusBadge = (status: string) => {
  switch (status) {
    case "accepted": return "success" as const;
    case "completed": return "info" as const;
    case "pending": return "warning" as const;
    case "declined": return "danger" as const;
    default: return "info" as const;
  }
};

const priorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "text-red-600 bg-red-50 border-red-200";
    case "high": return "text-amber-600 bg-amber-50 border-amber-200";
    case "medium": return "text-blue-600 bg-blue-50 border-blue-200";
    case "low": return "text-slate-600 bg-slate-50 border-slate-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export default function ReferralsPage() {
  const { authFetch } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const query = useQuery({
    queryKey: ["referrals"],
    queryFn: () => authFetch<ReferralItem[]>("/referrals")
  });

  const referrals = (query.data ?? []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral Center"
        description="Track and manage student referrals across counsellors, specialists, and external partners."
      />

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "accepted", "completed", "declined"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && query.data ? ` (${query.data.filter(r => r.status === "pending").length})` : ""}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : referrals.length ? (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-900">{referral.studentName}</p>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${priorityColor(referral.priority)}`}>
                          {referral.priority}
                        </span>
                        <Badge variant={statusBadge(referral.status)}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{referral.reason}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>From: {referral.referredBy}</span>
                        <span className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          To: {referral.referredTo}
                        </span>
                        <span>{formatDate(referral.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No referrals" description="Student referrals will appear here once created." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}