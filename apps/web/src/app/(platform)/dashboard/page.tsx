"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  Users,
  UserRoundCheck,
  Bell,
  Calendar,
  ClipboardList,
  BookOpen,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  Home
} from "lucide-react";
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/modules/common/page-header";
import { KpiCard } from "@/components/modules/dashboard/kpi-card";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { DashboardOverview } from "@/lib/types";

const pieColors = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1"];

const chartTooltipStyles = {
  contentStyle: {
    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    color: "#0f172a",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)"
  }
};

const ROLE_DASHBOARD_META: Record<string, { title: string; subtitle: string; icon: typeof Home }> = {
  ADMIN: { title: "Administration Hub", subtitle: "Full oversight of all MTSS operations, risk analytics, and system-wide intervention tracking.", icon: ShieldAlert },
  COUNSELLOR: { title: "Counsellor Command Center", subtitle: "Your active caseload, upcoming sessions, and intervention priorities at a glance.", icon: ClipboardList },
  TEACHER: { title: "Classroom Wellbeing Hub", subtitle: "Track your homeroom wellbeing, flag concerns, and manage referrals to support teams.", icon: BookOpen },
  PARENT: { title: "Family Wellbeing Dashboard", subtitle: "Stay informed about your child's wellbeing journey with check-ins, sessions, and reports.", icon: Home },
  STUDENT: { title: "My Wellbeing Hub", subtitle: "Your personal wellness journey — check in, track goals, and access support resources.", icon: Target }
};

function AdminDashboard({ data }: { data: DashboardOverview }) {
  const criticalAlerts = data.recentAlerts.filter((a) => a.severity === "CRITICAL").length;

  return (
    <>
      {/* Care Continuum + Today's Priorities */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] animate-fade-rise-delay">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-emerald-500/5" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-slate-900/8 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-gradient-to-tr from-emerald-500/8 to-transparent blur-3xl" />
          <CardContent className="relative space-y-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
                  <span className="status-dot status-dot-success" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">System Overview</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">You oversee 847 students</h2>
                <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
                  Full platform oversight with real-time MTSS analytics, intervention tracking, and system-wide reporting.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-3 text-right shadow-lg">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">System Health</p>
                <p className="text-2xl font-bold text-white tracking-tight">98%</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Critical Alerts</p>
                <p className="mt-1.5 text-xl font-bold text-red-700 tracking-tight">{criticalAlerts}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Cases</p>
                <p className="mt-1.5 text-xl font-bold text-emerald-700 tracking-tight">{data.kpis.activeCases}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tier 3 Watchlist</p>
                <p className="mt-1.5 text-xl font-bold text-amber-700 tracking-tight">{data.kpis.tier3Alerts}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="group">
                View All Reports
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="sm" variant="outline" className="group">
                System Audit Log
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              {"Today\u2019s Priorities"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-danger" />
                <p className="text-sm font-semibold text-slate-800">Critical incident response</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">{criticalAlerts} critical alerts require immediate escalation review.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-50/50 border border-sky-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-info" />
                <p className="text-sm font-semibold text-slate-800">Weekly leadership report</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Generate the weekly wellbeing summary for the board review.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-warning" />
                <p className="text-sm font-semibold text-slate-800">Staff supervision compliance</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">2 counsellor supervision reviews are overdue this month.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <KpiCard title="Total Students" value={data.kpis.totalStudents} trend="+8.2% vs last month" icon={Users} tone="indigo" />
        <KpiCard title="Active Cases" value={data.kpis.activeCases} trend="+3.4% this week" icon={Activity} tone="green" />
        <KpiCard title="Tier 2 Students" value={data.kpis.tier2Students} trend="Stable trend" icon={UserRoundCheck} tone="amber" />
        <KpiCard title="Tier 3 Alerts" value={data.kpis.tier3Alerts} trend="Needs immediate review" icon={ShieldAlert} tone="red" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Incident Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip {...chartTooltipStyles} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={entry.tier} fill={pieColors[index % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyles} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Activity */}
      <div className="grid gap-6 xl:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentAlerts.length ? (
              <div className="space-y-3">
                {data.recentAlerts.map((alert) => (
                  <div key={alert.id} className="group rounded-xl bg-gradient-to-br from-red-50/80 to-red-50/30 border border-red-200/60 p-4 transition-all duration-300 hover:border-red-300/80 hover:shadow-sm">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="status-dot status-dot-danger" />
                        <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                      </div>
                      <Badge variant={alert.severity === "CRITICAL" ? "danger" : "warning"}>{alert.severity}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 ml-5">{alert.description}</p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-5">{alert.studentName} • {formatDate(alert.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No active alerts" description="High-severity incident alerts will show up here." />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-4 w-4 text-slate-500" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.activityFeed.map((event) => (
                <li key={event.id} className="group rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-4 transition-all duration-300 hover:border-slate-300/60 hover:shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 flex items-center justify-center shrink-0">
                      <Activity className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate">{event.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function CounsellorDashboard({ data }: { data: DashboardOverview }) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] animate-fade-rise-delay">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-violet-500/5" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/8 to-transparent blur-3xl" />
          <CardContent className="relative space-y-6 p-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
                <span className="status-dot status-dot-info" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">My Caseload</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">You have 38 active cases today</h2>
              <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
                14 sessions scheduled today, 6 overdue follow-ups requiring immediate attention.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Crisis Alerts</p>
                <p className="mt-1.5 text-xl font-bold text-red-700 tracking-tight">1</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-sky-500/5 border border-blue-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{"Today's Sessions"}</p>
                <p className="mt-1.5 text-xl font-bold text-blue-700 tracking-tight">14</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes Pending</p>
                <p className="mt-1.5 text-xl font-bold text-amber-700 tracking-tight">6</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="group">
                <Calendar className="mr-1.5 h-4 w-4" />
                View My Schedule
              </Button>
              <Button size="sm" variant="outline" className="group">
                Write Session Notes
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Clock className="h-4 w-4 text-slate-500" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Emily Clarke — Crisis check-in</p>
                  <p className="mt-0.5 text-xs text-slate-500">Today 2:00 PM • Room 204</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Michael Brown — Tier 2 follow-up</p>
                  <p className="mt-0.5 text-xs text-slate-500">Today 3:30 PM • Virtual</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Lucas Green — Intervention review</p>
                  <p className="mt-0.5 text-xs text-slate-500">Tomorrow 10:00 AM • Room 108</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <KpiCard title="Active Cases" value={data.kpis.activeCases} trend="38 active cases" icon={ClipboardList} tone="indigo" />
        <KpiCard title="Tier 2 Students" value={data.kpis.tier2Students} trend="22 on watchlist" icon={UserRoundCheck} tone="amber" />
        <KpiCard title="Tier 3 Alerts" value={data.kpis.tier3Alerts} trend="12 critical" icon={ShieldAlert} tone="red" />
        <KpiCard title="Total Students" value={data.kpis.totalStudents} trend="School-wide" icon={Users} tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Session Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip {...chartTooltipStyles} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Caseload Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={entry.tier} fill={pieColors[index % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyles} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl bg-gradient-to-br from-red-50/80 to-red-50/30 border border-red-200/60 p-4">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="status-dot status-dot-danger" />
                      <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                    </div>
                    <Badge variant={alert.severity === "CRITICAL" ? "danger" : "warning"}>{alert.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 ml-5">{alert.description}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-5">{alert.studentName} • {formatDate(alert.createdAt)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-4 w-4 text-slate-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.activityFeed.map((event) => (
                <li key={event.id} className="rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 border border-sky-200/60 flex items-center justify-center shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate">{event.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function TeacherDashboard({ data }: { data: DashboardOverview }) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] animate-fade-rise-delay">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-amber-500/8 to-transparent blur-3xl" />
          <CardContent className="relative space-y-6 p-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
                <span className="status-dot status-dot-warning" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Homeroom 5B</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">28/32 check-ins completed this week</h2>
              <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
                Monitor classroom wellbeing, submit referrals, and track student flags in real-time.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stable</p>
                <p className="mt-1.5 text-xl font-bold text-emerald-700 tracking-tight">24</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Needs Support</p>
                <p className="mt-1.5 text-xl font-bold text-amber-700 tracking-tight">5</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Needs Intervention</p>
                <p className="mt-1.5 text-xl font-bold text-red-700 tracking-tight">3</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="group">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Submit Referral
              </Button>
              <Button size="sm" variant="outline" className="group">
                View Class Roster
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              Classroom Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-danger" />
                <p className="text-sm font-semibold text-slate-800">Behavioural concern — Jake M.</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Aggression during group activities — referred to counselling.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-warning" />
                <p className="text-sm font-semibold text-slate-800">Academic decline — Lily C.</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Grades dropped 20% alongside wellbeing scores.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-50/50 border border-sky-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-info" />
                <p className="text-sm font-semibold text-slate-800">Attendance — Ryan P.</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">4 days missed this month — pattern emerging.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <KpiCard title="My Students" value={data.kpis.totalStudents} trend="Homeroom 5B" icon={BookOpen} tone="indigo" />
        <KpiCard title="Active Concerns" value={data.kpis.activeCases} trend="Requires attention" icon={AlertTriangle} tone="red" />
        <KpiCard title="Support Needed" value={data.kpis.tier2Students} trend="Tier 2 students" icon={UserRoundCheck} tone="amber" />
        <KpiCard title="Intervention Required" value={data.kpis.tier3Alerts} trend="Tier 3 cases" icon={ShieldAlert} tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Check-in Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip {...chartTooltipStyles} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Class Wellbeing Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={entry.tier} fill={pieColors[index % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyles} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              Student Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl bg-gradient-to-br from-red-50/80 to-red-50/30 border border-red-200/60 p-4">
                  <div className="flex items-center gap-2">
                    <span className="status-dot status-dot-danger" />
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-5">{alert.description}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-5">{alert.studentName}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-4 w-4 text-slate-500" />
              Class Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.activityFeed.map((event) => (
                <li key={event.id} className="rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-200/60 flex items-center justify-center shrink-0">
                      <FileText className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate">{event.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ParentDashboard({ data }: { data: DashboardOverview }) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] animate-fade-rise-delay">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-gradient-to-tr from-teal-500/8 to-transparent blur-3xl" />
          <CardContent className="relative space-y-6 p-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
                <span className="status-dot status-dot-success" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Alex Thompson</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">Alex\u2019s wellbeing score: 78/100</h2>
              <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
                Stay informed about Alex\u2019s check-ins, counselling sessions, and wellbeing progress.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Wellbeing Score</p>
                <p className="mt-1.5 text-xl font-bold text-teal-700 tracking-tight">78</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-sky-500/5 border border-blue-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</p>
                <p className="mt-1.5 text-xl font-bold text-blue-700 tracking-tight">92%</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Engagement</p>
                <p className="mt-1.5 text-xl font-bold text-purple-700 tracking-tight">65%</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="group">
                <FileText className="mr-1.5 h-4 w-4" />
                View Full Report
              </Button>
              <Button size="sm" variant="outline" className="group">
                Message Counsellor
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-warning" />
                <p className="text-sm font-semibold text-slate-800">Wellbeing score decreased</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Score dropped from 82 to 78 this week. Counsellor is monitoring.</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-info" />
                <p className="text-sm font-semibold text-slate-800">Parent-teacher conference</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Wellbeing check-in meeting scheduled for next Thursday.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <KpiCard title="Wellbeing Score" value={78} trend="Down from 82" icon={Target} tone="amber" />
        <KpiCard title="Attendance" value="92%" trend="This month" icon={TrendingUp} tone="green" />
        <KpiCard title="Active Sessions" value={data.kpis.activeCases} trend="1 enrolled" icon={Calendar} tone="indigo" />
        <KpiCard title="Available Resources" value={24} trend="New this week: 2" icon={BookOpen} tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Weekly Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip {...chartTooltipStyles} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Alex\u2019s Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={entry.tier} fill={pieColors[index % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyles} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-50/80 border border-slate-200/80 p-4">
                  <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                  <p className="mt-2 text-[11px] font-medium text-slate-400 uppercase tracking-wider">{formatDate(alert.createdAt)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-4 w-4 text-slate-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.activityFeed.map((event) => (
                <li key={event.id} className="rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 border border-teal-200/60 flex items-center justify-center shrink-0">
                      <Home className="h-3.5 w-3.5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate">{event.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StudentDashboard({ data }: { data: DashboardOverview }) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] animate-fade-rise-delay">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/8 to-transparent blur-3xl" />
          <CardContent className="relative space-y-6 p-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1">
                <span className="status-dot status-dot-success" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your Wellbeing</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl tracking-tight">12-day check-in streak! </h2>
              <p className="max-w-xl text-sm text-slate-500 leading-relaxed">
                Keep it up! Daily check-ins help your school support team understand how you\u2019re doing.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Check-in Streak</p>
                <p className="mt-1.5 text-xl font-bold text-violet-700 tracking-tight">12 days</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-sky-500/5 border border-blue-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sessions This Month</p>
                <p className="mt-1.5 text-xl font-bold text-blue-700 tracking-tight">4</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-200/60 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Goals Met</p>
                <p className="mt-1.5 text-xl font-bold text-emerald-700 tracking-tight">3</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="group">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Complete Check-in
              </Button>
              <Button size="sm" variant="outline" className="group">
                View My Resources
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              For You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-50/50 border border-sky-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-info" />
                <p className="text-sm font-semibold text-slate-800">Check-in reminder</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">You haven\u2019t checked in today yet. It only takes 2 minutes!</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="status-dot status-dot-success" />
                <p className="text-sm font-semibold text-slate-800">Session tomorrow</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 ml-5">Check-in with Ms. Rebecca Thompson at 2:30 PM.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <KpiCard title="Check-in Streak" value="12 days" trend="Best streak yet!" icon={Target} tone="green" />
        <KpiCard title="Sessions This Month" value={4} trend="2 remaining" icon={Calendar} tone="indigo" />
        <KpiCard title="Goals Achieved" value={3} trend="This month" icon={CheckCircle2} tone="amber" />
        <KpiCard title="Resources Viewed" value={8} trend="New this week" icon={BookOpen} tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Your Mood This Week</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip {...chartTooltipStyles} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3}>
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={entry.tier} fill={pieColors[index % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyles} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Bell className="h-4 w-4 text-slate-500" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentAlerts.map((alert) => (
                <div key={alert.id} className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-50/80 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2">
                    <span className="status-dot status-dot-info" />
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-5">{alert.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-4 w-4 text-slate-500" />
              Your Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.activityFeed.map((event) => (
                <li key={event.id} className="rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 border border-violet-200/60 flex items-center justify-center shrink-0">
                      <Target className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate">{event.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { authFetch, user } = useAuth();

  const query = useQuery({
    queryKey: ["dashboard-overview", user?.role],
    enabled: Boolean(user),
    queryFn: () => authFetch<DashboardOverview>("/dashboard/overview")
  });

  const meta = useMemo(() => {
    if (!user) return ROLE_DASHBOARD_META.ADMIN;
    return ROLE_DASHBOARD_META[user.role] ?? ROLE_DASHBOARD_META.ADMIN;
  }, [user]);

  const roleMessage = useMemo(() => {
    if (!user) return "";
    const messages: Record<string, string> = {
      ADMIN: "Full system oversight with live risk analytics and intervention tracking.",
      COUNSELLOR: "Your counselling queue is prioritized with active cases and intervention timeline insights.",
      TEACHER: "Monitor classroom wellbeing, track student flags, and manage referrals.",
      PARENT: "Stay informed about your child's wellbeing journey with real-time updates.",
      STUDENT: "Track your wellness journey, check in daily, and access support resources."
    };
    return messages[user.role] ?? messages.ADMIN;
  }, [user]);

  if (query.isLoading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-10 w-96" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-4 animate-slide-up">
        <PageHeader title="Dashboard" description="Real-time mental wellbeing monitoring." />
        <Card>
          <CardContent className="py-8">
            <EmptyState title="Dashboard unavailable" description="The dashboard data could not be loaded right now." />
          </CardContent>
        </Card>
        <Button variant="default" onClick={() => void query.refetch()}>
          Retry request
        </Button>
      </div>
    );
  }

  const data = query.data;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="animate-fade-rise">
        <PageHeader
          title={meta.title}
          description={roleMessage}
          actions={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {user?.fullName ?? "User"} • {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          }
        />
      </div>

      {/* Role-specific dashboard content */}
      {user?.role === "ADMIN" && <AdminDashboard data={data} />}
      {user?.role === "COUNSELLOR" && <CounsellorDashboard data={data} />}
      {user?.role === "TEACHER" && <TeacherDashboard data={data} />}
      {user?.role === "PARENT" && <ParentDashboard data={data} />}
      {user?.role === "STUDENT" && <StudentDashboard data={data} />}
      {!user?.role || !["ADMIN", "COUNSELLOR", "TEACHER", "PARENT", "STUDENT"].includes(user.role) ? (
        <AdminDashboard data={data} />
      ) : null}
    </div>
  );
}