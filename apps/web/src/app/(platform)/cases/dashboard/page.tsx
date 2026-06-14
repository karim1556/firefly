"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Users, CheckCircle2, AlertTriangle, Clock, TrendingUp, ArrowRight, Activity, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { CaseDashboardStats } from "@/lib/types";

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-600",
  ASSESSMENT_IN_PROGRESS: "bg-amber-50 text-amber-600",
  INTERVENTION_ACTIVE: "bg-green-50 text-green-600",
  MONITORING: "bg-purple-50 text-purple-600",
  ESCALATED: "bg-red-50 text-red-600",
  RESOLVED: "bg-emerald-50 text-emerald-600",
  CLOSED: "bg-zinc-50 text-zinc-600",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-600",
  HIGH: "bg-amber-50 text-amber-600",
  CRITICAL: "bg-red-50 text-red-600",
};

export default function CaseDashboardPage() {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["cases", "dashboard", "stats"],
    queryFn: () => authFetch<CaseDashboardStats>("/cases/dashboard/stats")
  });

  const stats = query.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Management Dashboard"
        description="Track student wellbeing cases from identification through intervention and resolution."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/cases/high-risk">High-Risk Cases</Link>
            </Button>
            <Button asChild>
              <Link href="/cases">
                Case Registry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Total Cases</p>
                    <p className="text-3xl font-semibold">{stats.totalCases}</p>
                  </div>
                  <FileText className="h-10 w-10 text-zinc-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Active Cases</p>
                    <p className="text-3xl font-semibold">{stats.activeCases}</p>
                  </div>
                  <Activity className="h-10 w-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Closed Cases</p>
                    <p className="text-3xl font-semibold">{stats.closedCases}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">High-Risk Cases</p>
                    <p className="text-3xl font-semibold text-red-600">{stats.highRiskCases}</p>
                  </div>
                  <ShieldAlert className="h-10 w-10 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Awaiting Action</p>
                    <p className="text-3xl font-semibold text-amber-600">{stats.casesAwaitingAction}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Upcoming Follow-Ups</p>
                    <p className="text-3xl font-semibold">{stats.upcomingFollowUps}</p>
                  </div>
                  <Users className="h-10 w-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cases by Status */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">Cases by Status</h3>
                <div className="space-y-3">
                  {stats.casesByStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${statusColors[item.status]?.replace("bg-", "").replace("-50", "-400").replace("text-", "bg-")}`} />
                        <span className="text-sm text-zinc-700">{item.status.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${(item.count / stats.totalCases) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-zinc-900 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cases by Priority */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">Cases by Priority</h3>
                <div className="space-y-3">
                  {stats.casesByPriority.map((item) => (
                    <div key={item.priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${priorityColors[item.priority]?.split(" ")[0].replace("bg-", "")}`} />
                        <span className="text-sm text-zinc-700">{item.priority}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.priority === "CRITICAL" ? "bg-red-500" : item.priority === "HIGH" ? "bg-amber-500" : item.priority === "MEDIUM" ? "bg-blue-500" : "bg-slate-400"}`}
                            style={{ width: `${(item.count / stats.totalCases) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-zinc-900 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cases by Category */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">Cases by Category</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {stats.casesByCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <span className="text-sm text-zinc-700">{item.category}</span>
                    <Badge variant={item.count > 12 ? "danger" : item.count > 8 ? "warning" : "info"}>
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">Monthly Case Trends</h3>
              <div className="flex items-end justify-between gap-2">
                {stats.monthlyTrends.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                    <div className="flex gap-1 w-full justify-center">
                      <div className="w-6 bg-blue-200 rounded-t" style={{ height: `${Math.max(item.opened * 3, 4)}px` }}>
                        <div className="w-6 bg-blue-500 rounded-t" style={{ height: `${item.opened * 3}px` }} />
                      </div>
                      <div className="w-6 bg-green-200 rounded-t" style={{ height: `${Math.max(item.closed * 3, 4)}px` }}>
                        <div className="w-6 bg-green-500 rounded-t" style={{ height: `${item.closed * 3}px` }} />
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-xs text-zinc-500">Cases Opened</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-xs text-zinc-500">Cases Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links to High-Risk Cases */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  High-Risk Cases Requiring Attention
                </h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/cases/high-risk">View All</Link>
                </Button>
              </div>
              <div className="space-y-2">
                {stats.casesByPriority
                  .filter((p) => p.priority === "CRITICAL" || p.priority === "HIGH")
                  .flatMap((p) =>
                    CASES_BY_PRIORITY[p.priority]?.map((c) => ({ ...c, priority: p.priority })) || []
                  )
                  .slice(0, 5)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/cases/${c.id}`}
                      className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{c.title}</p>
                        <p className="text-xs text-zinc-500">
                          {c.student} • {c.daysOpen} days open
                        </p>
                      </div>
                      <Badge variant={c.priority === "CRITICAL" ? "danger" : "warning"}>
                        {c.priority}
                      </Badge>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

// Helper data for quick links
const CASES_BY_PRIORITY: Record<string, Array<{ id: string; title: string; student: string; daysOpen: number }>> = {
  CRITICAL: [
    { id: "c1", title: "Crisis intervention - Ananya Reddy", student: "Grade 9C", daysOpen: 3 },
  ],
  HIGH: [
    { id: "c2", title: "Self-harm monitoring - Arjun Patel", student: "Grade 8A", daysOpen: 5 },
    { id: "c4", title: "Behavioural support - Aryan Joshi", student: "Grade 8B", daysOpen: 4 },
    { id: "c7", title: "Emotional regulation - Karan Mehta", student: "Grade 8A", daysOpen: 10 },
  ],
};
