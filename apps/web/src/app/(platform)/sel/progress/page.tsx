"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { PageHeader } from "@/components/modules/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

const COLORS = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1", "#e2e8f0"];

export default function SELProgressPage() {
  const { authFetch } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["sel-progress"],
    queryFn: () => authFetch<any>("/sel/progress"),
  });

  const byGrade = data?.byGrade ?? [];
  const overallCompletion = data?.overallCompletion ?? 0;
  const overallParticipation = data?.overallParticipation ?? 0;

  const completionData = byGrade.map((g: any) => ({
    grade: `Grade ${g.grade}`,
    completed: g.completed,
    pending: g.pending,
    assigned: g.assigned,
  }));

  const participationData = byGrade.map((g: any) => ({
    grade: `Grade ${g.grade}`,
    rate: g.participationRate,
  }));

  const pieData = [
    { name: "Completed", value: byGrade.reduce((sum: number, g: any) => sum + g.completed, 0) },
    { name: "Pending", value: byGrade.reduce((sum: number, g: any) => sum + g.pending, 0) },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="SEL Progress Tracking" description="Track program completion across grades and classrooms." />
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Progress Tracking"
        description="Track program completion and participation across grades and classrooms."
      />

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
<CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{overallCompletion}%</p>
              <p className="text-sm text-slate-500">Overall Completion Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{overallParticipation}%</p>
              <p className="text-sm text-slate-500">Student Participation Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{byGrade.reduce((sum: number, g: any) => sum + g.assigned, 0)}</p>
              <p className="text-sm text-slate-500">Total Sessions Assigned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Completion by Grade</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Bar dataKey="completed" fill="#0f172a" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="pending" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Overall Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Legend formatter={(value) => <span className="text-sm text-slate-600 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Participation Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800">Participation Rate by Grade</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }} />
              <Bar dataKey="rate" fill="#0f172a" radius={[4, 4, 0, 0]} name="Participation %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grade Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800">Grade-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Grade</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Assigned</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Completed</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Pending</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Completion %</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Participation %</th>
                </tr>
              </thead>
              <tbody>
                {byGrade.map((g: any) => (
                  <tr key={g.grade} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">Grade {g.grade}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{g.assigned}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{g.completed}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{g.pending}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-slate-800">{g.completionRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-emerald-600">{g.participationRate}%</span>
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
