"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, Clock, CheckCircle2, ArrowUpRight, ShieldAlert, Users, Calendar, User } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { HighRiskCase } from "@/lib/types";

const riskLevelConfig: Record<string, { label: string; color: string }> = {
  CRITICAL_RISK: { label: "Critical Risk", color: "bg-red-50 text-red-600 border-red-200" },
  HIGH_RISK: { label: "High Risk", color: "bg-amber-50 text-amber-600 border-amber-200" },
  MODERATE_RISK: { label: "Moderate Risk", color: "bg-blue-50 text-blue-600 border-blue-200" },
};

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  OPEN: { label: "Open", variant: "info" },
  ASSESSMENT_IN_PROGRESS: { label: "Assessment", variant: "warning" },
  INTERVENTION_ACTIVE: { label: "Intervention", variant: "success" },
  MONITORING: { label: "Monitoring", variant: "info" },
  ESCALATED: { label: "Escalated", variant: "danger" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

export default function HighRiskCasesPage() {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["cases", "high-risk"],
    queryFn: () => authFetch<{ data: HighRiskCase[] }>("/cases/high-risk")
  });

  const cases = query.data?.data || [];

  const criticalCases = cases.filter(c => c.riskLevel === "CRITICAL_RISK");
  const highRiskCases = cases.filter(c => c.riskLevel === "HIGH_RISK");
  const escalatedCases = cases.filter(c => c.status === "ESCALATED");
  const overdueFollowUps = cases.filter(c => c.overdueFollowUps > 0);

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/cases/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">High-Risk Monitoring Center</h1>
            <p className="text-sm text-zinc-500">
              Immediate action visibility for urgent student cases
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/cases/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Critical Cases</p>
                <p className="text-3xl font-semibold text-red-700">{criticalCases.length}</p>
              </div>
              <ShieldAlert className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">High-Risk Cases</p>
                <p className="text-3xl font-semibold text-amber-700">{highRiskCases.length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Escalated Cases</p>
                <p className="text-3xl font-semibold text-red-700">{escalatedCases.length}</p>
              </div>
              <ArrowUpRight className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Overdue Follow-ups</p>
                <p className="text-3xl font-semibold text-amber-700">{overdueFollowUps.reduce((sum, c) => sum + c.overdueFollowUps, 0)}</p>
              </div>
              <Clock className="h-10 w-10 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Cases - Immediate Attention */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Critical Cases Requiring Immediate Attention
            </h3>
            <Badge variant="danger">{criticalCases.length} cases</Badge>
          </div>

          {criticalCases.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 text-center">No critical cases.</p>
          ) : (
            <div className="space-y-3">
              {criticalCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="flex items-center justify-between p-4 bg-red-50/50 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{c.title}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {c.student.firstName} {c.student.lastName}
                        </span>
                        <span>Grade {c.student.grade} {c.student.classroom}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {c.daysOpen} days open
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Assigned to</p>
                      <p className="text-sm font-medium">{c.assignedCounsellor.fullName}</p>
                    </div>
                    <Badge variant="danger">{c.priority}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* High-Risk Cases */}
      <Card className="border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              High-Risk Cases
            </h3>
            <Badge variant="warning">{highRiskCases.length} cases</Badge>
          </div>

          {highRiskCases.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4 text-center">No high-risk cases.</p>
          ) : (
            <div className="space-y-3">
              {highRiskCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="flex items-center justify-between p-4 bg-amber-50/50 rounded-lg hover:bg-amber-50 transition-colors border border-amber-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{c.title}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {c.student.firstName} {c.student.lastName}
                        </span>
                        <span>Grade {c.student.grade} {c.student.classroom}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {c.daysOpen} days open
                        </span>
                        {c.overdueFollowUps > 0 && (
                          <span className="flex items-center gap-1 text-red-500">
                            <Clock className="h-3 w-3" />
                            {c.overdueFollowUps} overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusConfig[c.status]?.variant || "default"}>
                      {statusConfig[c.status]?.label || c.status}
                    </Badge>
                    <Badge variant="warning">{c.priority}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Follow-ups */}
      {overdueFollowUps.length > 0 && (
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-amber-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Cases with Overdue Follow-ups
              </h3>
              <Badge variant="warning">{overdueFollowUps.length} cases</Badge>
            </div>

            <div className="space-y-3">
              {overdueFollowUps.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="flex items-center justify-between p-4 bg-amber-50/50 rounded-lg hover:bg-amber-50 transition-colors border border-amber-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{c.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {c.student.firstName} {c.student.lastName} • {c.overdueFollowUps} follow-up(s) overdue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Last updated: {formatDate(c.lastUpdated)}</span>
                    <Badge variant="danger">{c.overdueFollowUps} overdue</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All High-Risk Cases Table */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">All High-Risk Cases</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Case</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Counsellor</th>
                  <th className="px-4 py-3">Days Open</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-t border-zinc-200 text-zinc-800">
                    <td className="px-4 py-3 font-medium">{c.title}</td>
                    <td className="px-4 py-3">
                      {c.student.firstName} {c.student.lastName}
                      <span className="ml-2 text-xs text-zinc-500">
                        {c.student.grade} {c.student.classroom}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${riskLevelConfig[c.riskLevel]?.color || "bg-zinc-50 text-zinc-600 border-zinc-200"}`}>
                        {riskLevelConfig[c.riskLevel]?.label || c.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.priority === "CRITICAL" ? "danger" : "warning"}>
                        {c.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[c.status]?.variant || "default"}>
                        {statusConfig[c.status]?.label || c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{c.assignedCounsellor.fullName}</td>
                    <td className="px-4 py-3">
                      {c.daysOpen > 7 ? (
                        <span className="text-red-600 font-medium">{c.daysOpen} days</span>
                      ) : (
                        <span className="text-zinc-600">{c.daysOpen} days</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cases/${c.id}`}>Open</Link>
                      </Button>
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
