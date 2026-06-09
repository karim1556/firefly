"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, TrendingUp, Eye } from "lucide-react";

interface ClassroomDashboardProps {
  totalStudents: number;
  activeFlags: number;
  selCompletionRate: number;
  pendingObservations: number;
}

export function ClassroomDashboard({
  totalStudents,
  activeFlags,
  selCompletionRate,
  pendingObservations,
}: ClassroomDashboardProps) {
  const metrics = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Flags",
      value: activeFlags,
      icon: AlertTriangle,
      color: activeFlags > 0 ? "text-red-600" : "text-green-600",
      bg: activeFlags > 0 ? "bg-red-50" : "bg-green-50",
    },
    {
      label: "SEL Completion",
      value: `${selCompletionRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Observations",
      value: pendingObservations,
      icon: Eye,
      color: pendingObservations > 0 ? "text-amber-600" : "text-green-600",
      bg: pendingObservations > 0 ? "bg-amber-50" : "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} className="overflow-hidden">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-xl ${m.bg} p-2.5`}>
              <m.icon className={`h-5 w-5 ${m.color}`} />
</div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{m.value}</p>
              <p className="text-xs text-zinc-500">{m.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
