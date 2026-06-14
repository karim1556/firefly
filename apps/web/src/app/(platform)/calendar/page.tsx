"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, Filter, MapPin, Users } from "lucide-react";
import {
  Cell, Legend, PieChart, Pie, ResponsiveContainer, Tooltip
} from "recharts";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { CalendarEvent } from "@/lib/types";

const EVENT_COLORS: Record<string, string> = {
  SEL_SESSION: "#0f172a",
  WORKSHOP: "#8b5cf6",
  AWARENESS_CAMPAIGN: "#f59e0b",
  PARENT_SESSION: "#10b981",
};

const EVENT_LABELS: Record<string, string> = {
  SEL_SESSION: "SEL Session",
  WORKSHOP: "Workshop",
  AWARENESS_CAMPAIGN: "Awareness Campaign",
  PARENT_SESSION: "Parent Session",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

export default function SchoolCalendarPage() {
  const { authFetch } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const fromDate = new Date(year, month, 1).toISOString().slice(0, 10);
  const toDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data, isLoading } = useQuery({
    queryKey: ["calendar-events", fromDate, toDate, typeFilter],
    queryFn: () => authFetch<{ data: CalendarEvent[] }>(
      `/calendar/events${typeFilter !== "all" ? `?type=${typeFilter}&from=${fromDate}&to=${toDate}` : `?from=${fromDate}&to=${toDate}`}`
    ),
  });

  const events = data?.data ?? [];

  const prevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const nextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const pieData = Object.entries(EVENT_COLORS).map(([type, color]) => ({
    name: EVENT_LABELS[type],
    value: events.filter(e => e.type === type).length,
    color,
  })).filter(d => d.value > 0);

  const monthName = selectedDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="School SEL Calendar"
        description="Centralized view of all wellbeing activities across the school."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Calendar */}
        <div className="xl:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {monthName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  return (
                    <div
                      key={idx}
                      className={`min-h-[80px] rounded-lg border p-2 ${day ? "bg-white cursor-pointer hover:bg-slate-50" : "bg-slate-50"} ${isToday ? "border-indigo-400 ring-1 ring-indigo-400" : "border-slate-200"}`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs font-semibold mb-1 ${isToday ? "text-indigo-600" : "text-slate-600"}`}>{day}</div>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 3).map(evt => (
                              <div
                                key={evt.id}
                                onClick={() => setSelectedEvent(evt)}
                                className="text-[10px] px-1.5 py-0.5 rounded truncate text-white"
                                style={{ backgroundColor: EVENT_COLORS[evt.type] || "#94a3b8" }}
                              >
                                {evt.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-[10px] text-slate-500 px-1.5">+{dayEvents.length - 3} more</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Event Type Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button variant={typeFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("all")}>
              All Events
            </Button>
            {Object.entries(EVENT_LABELS).map(([type, label]) => (
              <Button key={type} variant={typeFilter === type ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(type)}>
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Event Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-800 text-sm">Event Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No events this month" description="Schedule events to see distribution." />
              )}
            </CardContent>
          </Card>

          {/* Selected Event Details */}
          {selectedEvent ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-800 text-sm">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge style={{ backgroundColor: EVENT_COLORS[selectedEvent.type] || "#94a3b8" }} className="text-white">
                    {EVENT_LABELS[selectedEvent.type]}
                  </Badge>
                </div>
                <p className="font-semibold text-slate-900">{selectedEvent.title}</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{selectedEvent.date} {selectedEvent.time}</span>
                  </div>
                  {selectedEvent.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                  )}
                  {selectedEvent.facilitatorName && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{selectedEvent.facilitatorName}</span>
                    </div>
                  )}
                  {selectedEvent.grade && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Grade:</span>
                      <span>{selectedEvent.grade}</span>
                    </div>
                  )}
                </div>
                <Button size="sm" variant="outline" className="w-full">View Full Details</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500 text-center">Click an event to see details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
