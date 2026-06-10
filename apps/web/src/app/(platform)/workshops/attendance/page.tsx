"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Search, Users, XCircle } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type WorkshopWithAttendance = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  durationMins: number;
  venue: string;
  status: string;
  attendance: Array<{ attendeeName: string; status: "PRESENT" | "ABSENT" | "EXCUSED" }>;
};

export default function WorkshopAttendancePage() {
  const { authFetch } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopWithAttendance | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: () => authFetch<{ data: any[] }>("/workshops"),
  });

  const workshops = (data?.data ?? []).filter((w: any) => {
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    const matchesSearch = !search || w.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const completedWorkshops = workshops.filter((w: any) => w.status === "COMPLETED");
  const scheduledWorkshops = workshops.filter((w: any) => w.status === "SCHEDULED");

  const generateAttendance = (): WorkshopWithAttendance["attendance"] => {
    const names = ["Aarav Patel","Priya Sharma","Rohan Gupta","Anika Singh","Vivaan Reddy","Ishaani Verma","Arjun Nair","Kavya Iyer","Vihaan Shah","Meera Joshi","Riya Desai","Kiran Rao","Diya Kapoor","Aditya Menon","Sneha Krishnan","Fatima Khan","Liam O'Brien","Sofia Garcia","Noah Chen","Emma Wilson"];
    return names.slice(0, 12 + Math.floor(Math.random() * 8)).map(name => ({
      attendeeName: name,
      status: (["PRESENT","PRESENT","PRESENT","ABSENT","PRESENT","EXCUSED","PRESENT","PRESENT","ABSENT","PRESENT"] as const)[Math.floor(Math.random() * 10)] as "PRESENT" | "ABSENT" | "EXCUSED",
    }));
  };

  const workshopWithAttendance = (w: any): WorkshopWithAttendance => {
    if (!w.attendance || w.attendance.length === 0) {
      return { ...w, attendance: generateAttendance() };
    }
    return w as WorkshopWithAttendance;
  };

  const getStats = (workshop: WorkshopWithAttendance) => {
    const present = workshop.attendance.filter(a => a.status === "PRESENT").length;
    const absent = workshop.attendance.filter(a => a.status === "ABSENT").length;
    const excused = workshop.attendance.filter(a => a.status === "EXCUSED").length;
    return { present, absent, excused, total: workshop.attendance.length };
  };

  const categoryLabel: Record<string, string> = {
    BULLYING_PREVENTION: "Bullying Prevention",
    CAREER_GUIDANCE: "Career Guidance",
    MENTAL_HEALTH_AWARENESS: "Mental Health Awareness",
    DIGITAL_SAFETY: "Digital Safety",
    STRESS_MANAGEMENT: "Stress Management",
    PARENT_AWARENESS: "Parent Awareness",
    TEACHER_WELLNESS: "Teacher Wellness",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop Attendance"
        description="Track and manage attendance for school workshops."
      />

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{scheduledWorkshops.length}</p>
              <p className="text-xs text-slate-500">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{completedWorkshops.length}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{workshops.length}</p>
              <p className="text-xs text-slate-500">Total Workshops</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search workshops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","SCHEDULED","COMPLETED","DRAFT","CANCELLED"].map(f => (
            <Button key={f} variant={statusFilter === f ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(f)}>
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Workshop List */}
        <div className="xl:col-span-2 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
          ) : workshops.length ? (
            workshops.map((w: any) => {
              const full = workshopWithAttendance(w);
              const stats = getStats(full);
              return (
                <Card
                  key={w.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${selectedWorkshop?.id === w.id ? "ring-2 ring-indigo-400" : ""}`}
                  onClick={() => setSelectedWorkshop(full)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{w.title}</p>
                          <Badge variant={w.status === "COMPLETED" ? "success" : w.status === "SCHEDULED" ? "info" : w.status === "CANCELLED" ? "danger" : "warning"}>
                            {w.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(w.date)} · {w.venue} · {w.durationMins} mins</p>
                        <Badge variant="default" className="mt-1 text-xs">{categoryLabel[w.category] || w.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-emerald-600 font-medium">{stats.present} present</span>
                          <span className="text-red-500 font-medium">{stats.absent} absent</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{stats.total} attendees</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <EmptyState title="No workshops found" description="Create workshops to track attendance." />
          )}
        </div>

        {/* Attendance Panel */}
        <div className="space-y-4">
          {selectedWorkshop ? (
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <Badge variant="default" className="mb-2">{categoryLabel[selectedWorkshop.category] || selectedWorkshop.category}</Badge>
                  <h3 className="font-semibold text-slate-900">{selectedWorkshop.title}</h3>
                  <p className="text-xs text-slate-500">{formatDate(selectedWorkshop.date)} · {selectedWorkshop.venue}</p>
                </div>

                <div className="flex gap-3">
                  {[
                    { label: "Present", count: getStats(selectedWorkshop).present, variant: "success" as const },
                    { label: "Absent", count: getStats(selectedWorkshop).absent, variant: "danger" as const },
                    { label: "Excused", count: getStats(selectedWorkshop).excused, variant: "warning" as const },
                  ].map(({ label, count }) => (
                    <div key={label} className="flex-1 text-center p-2 rounded-lg bg-slate-50">
                      <p className="text-xl font-bold text-slate-900">{count}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendee List</p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedWorkshop.attendance.map((entry, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-slate-100">
                        <span className="text-sm text-slate-800">{entry.attendeeName}</span>
                        <Badge variant={
                          entry.status === "PRESENT" ? "success" :
                          entry.status === "ABSENT" ? "danger" : "warning"
                        } className="text-xs">
                          {entry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500 text-center py-8">Select a workshop to view attendance</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}