"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type AppointmentItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  studentName: string;
  type: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
};

const statusBadge = (status: string) => {
  switch (status) {
    case "confirmed": return "success" as const;
    case "pending": return "warning" as const;
    case "completed": return "info" as const;
    case "cancelled": return "danger" as const;
    default: return "info" as const;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "confirmed": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "pending": return <Clock className="h-4 w-4 text-amber-600" />;
    case "completed": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
    case "cancelled": return <XCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

export default function AppointmentsPage() {
  const { authFetch } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const query = useQuery({
    queryKey: ["appointments"],
    queryFn: () => authFetch<AppointmentItem[]>("/appointments")
  });

  const appointments = (query.data ?? []).filter((a) => filter === "all" || a.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Schedule and manage counselling sessions, assessments, and consultations."
      />

      <div className="flex gap-2 flex-wrap">
        {["all", "confirmed", "pending", "completed", "cancelled"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : appointments.length ? (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{statusIcon(appt.status)}</div>
                      <div>
                        <p className="font-semibold text-slate-900">{appt.title}</p>
                        <p className="text-sm text-slate-600">{appt.studentName}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(appt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appt.time}
                          </span>
                          <span className="capitalize">{appt.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusBadge(appt.status)}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No appointments" description="Appointments will appear here once scheduled." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}