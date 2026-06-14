"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart,
  PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { PageHeader } from "@/components/modules/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "@/components/modules/dashboard/kpi-card";

const COLORS = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1", "#e2e8f0"];

export default function WellbeingAnalyticsPage() {
  const { authFetch } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["analytics-wellbeing"],
    queryFn: () => authFetch<any>("/analytics/wellbeing"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="School Wellbeing Analytics" description="Executive-level reporting on school-wide wellbeing initiatives." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Wellbeing Analytics"
        description="Executive-level reporting on SEL programs, workshop attendance, and student engagement."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Sessions"
          value={data.totalSessionsConducted}
          trend="Conducted this term"
          icon={Activity}
          tone="indigo"
        />
        <KpiCard
          title="Workshop Attendance"
          value={`${data.workshopAttendanceRate}%`}
          trend="Average attendance"
          icon={Users}
          tone="green"
        />
        <KpiCard
          title="Student Engagement"
          value={`${data.studentEngagementRate}%`}
          trend="Active participation"
          icon={TrendingUp}
          tone="green"
        />
        <KpiCard
          title="SEL Completion"
          value={`${data.selCompletionRate}%`}
          trend="Program completion"
          icon={BarChart3}
          tone="indigo"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Monthly Participation Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyParticipation} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Line type="monotone" dataKey="attended" stroke="#0f172a" strokeWidth={3} name="Attended" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Total" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Grade-wise Completion</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.gradeWiseCompletion} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Bar dataKey="completed" fill="#0f172a" radius={[4, 4, 0, 0]} name="Completed %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Workshop Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.workshopAttendanceTrend} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Bar dataKey="attended" fill="#0f172a" radius={[4, 4, 0, 0]} name="Attended" />
                <Bar dataKey="missed" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Flagged Student Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.flaggedStudentTrends} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={3} name="Flagged Students" dot={{ r: 4, fill: "#ef4444" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Pie */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800">Student Engagement Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
<ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Highly Engaged", value: Math.round(data.studentEngagementRate * 0.4) },
                  { name: "Moderately Engaged", value: Math.round(data.studentEngagementRate * 0.35) },
                  { name: "Low Engagement", value: Math.round((100 - data.studentEngagementRate) * 0.6) },
                  { name: "Not Engaged", value: Math.round((100 - data.studentEngagementRate) * 0.4) },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={3}
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
              <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
