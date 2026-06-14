"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Plus, Sparkles, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { Facilitator } from "@/lib/types";
import { useRouter } from "next/navigation";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

export default function SELSessionSchedulePage() {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<"form" | "calendar">("form");
  const [form, setForm] = useState({
    title: "",
    classroomId: "",
    facilitatorId: "",
    scheduledDate: "",
    scheduledTime: "09:00",
    durationMins: "45",
    topic: "",
  });
  const [saving, setSaving] = useState(false);

  const { data: facilitatorsData } = useQuery({
    queryKey: ["facilitators"],
    queryFn: () => authFetch<{ data: Facilitator[] }>("/facilitators"),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["sel-sessions-m4"],
    queryFn: () => authFetch<{ data: any[] }>("/sel/sessions"),
  });

  const facilitators = facilitatorsData?.data ?? [];
  const sessions = sessionsData?.data ?? [];
  const scheduledSessions = sessions.filter((s: any) => s.status === "SCHEDULED");

  const handleSchedule = async () => {
    setSaving(true);
    try {
      const scheduledAt = `${form.scheduledDate}T${form.scheduledTime}:00.000Z`;
      await authFetch("/sel/sessions", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          topic: form.topic || form.title,
          classroomId: form.classroomId,
          facilitatorId: form.facilitatorId,
          scheduledAt,
          durationMins: parseInt(form.durationMins),
        }),
      });
      router.push("/sel");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Session Scheduling"
        description="Schedule SEL sessions for classrooms with facilitators and timing."
        actions={
          <div className="flex gap-2">
            <Button variant={view === "form" ? "default" : "outline"} size="sm" onClick={() => setView("form")}>
              Schedule Form
            </Button>
            <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>
              Calendar View
            </Button>
          </div>
        }
      />

      {view === "form" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Schedule Form */}
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Session Title *</label>
                <Input
                  placeholder="e.g., Building Healthy Friendships"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Topic</label>
                  <Input
                    placeholder="e.g., Empathy"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Classroom *</label>
                  <Select
                    value={form.classroomId}
                    onChange={(e) => setForm({ ...form, classroomId: e.target.value })}
                  >
                    <option value="">Select classroom</option>
                    {["5A","5B","6A","6B","7A","7B","7C","8A","8B","9A","9B","9C","10A","10B","10C"].map(c => (
                      <option key={c} value={`class-${c}`}>{c}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date *</label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Time *</label>
                  <Select
                    value={form.scheduledTime}
                    onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  >
                    {HOURS.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Facilitator *</label>
                  <Select
                    value={form.facilitatorId}
                    onChange={(e) => setForm({ ...form, facilitatorId: e.target.value })}
                  >
                    <option value="">Select facilitator</option>
                    {facilitators.map(f => (
                      <option key={f.id} value={f.id}>{f.fullName} ({f.type.replace("_"," ")})</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Duration</label>
                  <div className="flex gap-2">
                    {["30","45","60","90"].map(d => (
                      <Button
                        key={d}
                        type="button"
                        variant={form.durationMins === d ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setForm({ ...form, durationMins: d })}
                      >
                        {d}m
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleSchedule}
                  disabled={saving || !form.title || !form.classroomId || !form.facilitatorId || !form.scheduledDate}
                >
                  <Plus className="h-4 w-4" />
                  Schedule Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Calendar className="h-4 w-4 text-slate-500" />
                Upcoming Sessions ({scheduledSessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledSessions.length ? (
                <div className="space-y-3">
                  {scheduledSessions.slice(0, 8).map((session: any) => (
                    <div key={session.id} className="flex items-center gap-3 rounded-xl bg-white border border-slate-200/80 p-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{session.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(session.scheduledAt)}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{session.durationMins}m</span>
                        </div>
                      </div>
                      <Badge variant="info">Scheduled</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No scheduled sessions" description="Schedule your first SEL session using the form." />
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Calendar View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-4 w-4 text-slate-500" />
              Session Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {DAYS.map(day => (
                <div key={day} className="space-y-2">
                  <div className="text-sm font-semibold text-slate-600">{day}</div>
                  <div className="flex gap-2 flex-wrap">
                    {scheduledSessions
                      .filter((s: any) => s.scheduledAt.includes(day))
                      .map((session: any) => (
                        <div key={session.id} className="flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-indigo-900">{session.title}</p>
                            <p className="text-xs text-indigo-600">{session.scheduledAt.slice(11, 16)}</p>
                          </div>
                        </div>
                      ))}
 </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
