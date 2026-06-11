"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, AlertCircle, FileText, User, MessageSquare, Users, Phone, Mail, ArrowUpRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { StudentJourneyEvent } from "@/lib/types";

const eventTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  OBSERVATION_ADDED: { icon: <Eye className="h-4 w-4" />, color: "text-blue-500 bg-blue-50", label: "Observation" },
  CONCERN_RAISED: { icon: <AlertCircle className="h-4 w-4" />, color: "text-amber-500 bg-amber-50", label: "Concern" },
  CASE_OPENED: { icon: <FileText className="h-4 w-4" />, color: "text-purple-500 bg-purple-50", label: "Case Opened" },
  COUNSELLING_SESSION: { icon: <User className="h-4 w-4" />, color: "text-green-500 bg-green-50", label: "Counselling" },
  INTERVENTION_ADDED: { icon: <MessageSquare className="h-4 w-4" />, color: "text-indigo-500 bg-indigo-50", label: "Intervention" },
  PARENT_MEETING: { icon: <Users className="h-4 w-4" />, color: "text-pink-500 bg-pink-50", label: "Parent Meeting" },
  REFERRAL_CREATED: { icon: <ArrowUpRight className="h-4 w-4" />, color: "text-cyan-500 bg-cyan-50", label: "Referral" },
  CASE_CLOSED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500 bg-emerald-50", label: "Case Closed" },
  FLAG_RAISED: { icon: <AlertCircle className="h-4 w-4" />, color: "text-red-500 bg-red-50", label: "Flag Raised" },
  FLAG_RESOLVED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-500 bg-green-50", label: "Flag Resolved" },
  RISK_ASSESSMENT: { icon: <Eye className="h-4 w-4" />, color: "text-orange-500 bg-orange-50", label: "Risk Assessment" },
  ESCALATION: { icon: <ArrowUpRight className="h-4 w-4" />, color: "text-red-500 bg-red-50", label: "Escalation" },
};

const eventOrder = [
  "OBSERVATION_ADDED",
  "FLAG_RAISED",
  "CONCERN_RAISED",
  "CASE_OPENED",
  "RISK_ASSESSMENT",
  "ESCALATION",
  "COUNSELLING_SESSION",
  "INTERVENTION_ADDED",
  "PARENT_MEETING",
  "REFERRAL_CREATED",
  "FLAG_RESOLVED",
  "CASE_CLOSED",
];

const STUDENT_INFO: Record<string, { firstName: string; lastName: string; grade: string; classroom: string }> = {
  "s4": { firstName: "Ananya", lastName: "Reddy", grade: "9", classroom: "9C" },
  "s1": { firstName: "Arjun", lastName: "Patel", grade: "8", classroom: "8A" },
  "s7": { firstName: "Aryan", lastName: "Joshi", grade: "8", classroom: "8B" },
  "s13": { firstName: "Karan", lastName: "Mehta", grade: "8", classroom: "8A" },
};

export default function StudentJourneyPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["cases", "journey", studentId],
    queryFn: () => authFetch<{ data: StudentJourneyEvent[] }>(`/cases/journey/${studentId}`),
    enabled: Boolean(studentId)
  });

  const student = STUDENT_INFO[studentId] || { firstName: "Student", lastName: "", grade: "", classroom: "" };

  const events = query.data?.data || [];

  const sortedEvents = [...events].sort((a, b) => {
    const aIdx = eventOrder.indexOf(a.eventType);
    const bIdx = eventOrder.indexOf(b.eventType);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!events.length && !query.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/cases"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
        </div>
        <EmptyState
          title="No journey events found"
          description="Student journey events will appear here once case activities begin."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/cases"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-sm text-zinc-500">
              Student Journey Timeline • Grade {student.grade} {student.classroom}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/cases?student=${studentId}`}>View Cases</Link>
        </Button>
      </div>

      {/* Journey Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{events.filter(e => e.eventType === "CASE_OPENED").length}</p>
                <p className="text-xs text-zinc-500">Cases Opened</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <User className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{events.filter(e => e.eventType === "COUNSELLING_SESSION").length}</p>
                <p className="text-xs text-zinc-500">Counselling Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{events.filter(e => e.eventType === "FLAG_RAISED").length}</p>
                <p className="text-xs text-zinc-500">Flags Raised</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{events.filter(e => e.eventType === "ESCALATION").length}</p>
                <p className="text-xs text-zinc-500">Escalations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-zinc-900 mb-6">Student Journey Timeline</h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-200" />

            <div className="space-y-6">
              {sortedEvents.map((event, idx) => {
                const config = eventTypeConfig[event.eventType] || {
                  icon: <Clock className="h-4 w-4" />,
                  color: "text-zinc-500 bg-zinc-50",
                  label: event.eventType
                };
                const isFirst = idx === 0;
                const isLast = idx === sortedEvents.length - 1;

                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full ${config.color} ${isFirst ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-xs text-zinc-400">{formatDate(event.createdAt)}</span>
                        {isFirst && (
                          <Badge variant="info" className="text-xs">Latest</Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-zinc-900">{event.title}</h4>
                      <p className="text-sm text-zinc-600 mt-1">{event.description}</p>
                      {event.createdBy && (
                        <p className="text-xs text-zinc-400 mt-2">
                          by {event.createdBy.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Story Reference */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-zinc-900 mb-2">Demo Story Progress</h3>
          <p className="text-sm text-zinc-600">
            This timeline demonstrates the complete student support journey from initial observation through intervention and resolution.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Observation Added", "Flag Raised", "Case Opened", "Counselling Session", "Parent Meeting"].map((step, i) => {
              const hasStep = sortedEvents.some(e =>
                e.eventType === "OBSERVATION_ADDED" && i === 0 ||
                e.eventType === "FLAG_RAISED" && i === 1 ||
                e.eventType === "CASE_OPENED" && i === 2 ||
                e.eventType === "COUNSELLING_SESSION" && i === 3 ||
                e.eventType === "PARENT_MEETING" && i === 4
              );
              return (
                <span
                  key={step}
                  className={`text-xs px-2 py-1 rounded-full ${hasStep ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"}`}
                >
                  {hasStep ? "✓" : "○"} {step}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
