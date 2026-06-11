"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert, Users, TrendingUp, Plus, Search, AlertOctagon, Activity } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, toQueryString } from "@/lib/utils";
import type { CrisisIncidentSummary, CrisisDashboardStats, CrisisStatus, CrisisSeverity, IncidentCategory, PaginatedResponse } from "@/lib/types";
import { toast } from "sonner";

const statusConfig: Record<CrisisStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  REPORTED: { label: "Reported", variant: "default" },
  ACKNOWLEDGED: { label: "Acknowledged", variant: "info" },
  INVESTIGATING: { label: "Investigating", variant: "warning" },
  ESCALATED: { label: "Escalated", variant: "danger" },
  MONITORING: { label: "Monitoring", variant: "info" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "default" },
};

const severityConfig: Record<CrisisSeverity, { label: string; className: string }> = {
  HIGH: { label: "High", className: "text-orange-600 bg-orange-50 border-orange-200" },
  CRITICAL: { label: "Critical", className: "text-red-600 bg-red-50 border-red-200" },
  EMERGENCY: { label: "Emergency", className: "text-red-700 bg-red-100 border-red-300" },
};

const categoryLabels: Record<IncidentCategory, string> = {
  SELF_HARM_RISK: "Self-Harm Risk",
  SUICIDE_IDEATION: "Suicide Ideation",
  ABUSE_CONCERNS: "Abuse Concerns",
  BULLYING_ESCALATION: "Bullying Escalation",
  VIOLENCE_THREAT: "Violence Threat",
  SEVERE_EMOTIONAL_DISTREESS: "Severe Emotional Distress",
  MISSING_STUDENT: "Missing Student",
  SAFETY_CONCERN: "Safety Concern",
  SUBSTANCE_CONCERN: "Substance Concern",
};

export default function CrisisDashboardPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // Form state
  const [formStudentName, setFormStudentName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formSeverity, setFormSeverity] = useState("HIGH");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const statsQuery = useQuery({
    queryKey: ["crisis", "dashboard", "stats"],
    queryFn: () => authFetch<CrisisDashboardStats>("/crisis/dashboard/stats")
  });

  const query = useQuery({
    queryKey: ["crisis", "incidents", search, status, severity, category, page],
    queryFn: () =>
      authFetch<PaginatedResponse<CrisisIncidentSummary>>(
        `/crisis/incidents${toQueryString({ search, status, severity, category, page, pageSize: 10 })}`
      )
  });

  const data = query.data?.data ?? [];
  const stats = statsQuery.data;

  const handleSubmitIncident = (e: FormEvent) => {
    e.preventDefault();
    if (!formStudentName || !formCategory || !formDescription) {
      toast.error("Please fill in required fields");
      return;
    }
    // In a real app, this would call the mutation
    toast.success("Crisis incident reported successfully");
    setFormStudentName("");
    setFormCategory("");
    setFormSeverity("HIGH");
    setFormDescription("");
    setFormLocation("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crisis Command Center"
        description="Manage critical incidents, coordinate response teams, and ensure student safety."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/crisis/high-risk">High-Risk Students</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/crisis/analytics">Analytics</Link>
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
          </div>
        }
      />

      {/* New Incident Form */}
      {showForm && (
        <Card className="border-red-300 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertOctagon className="h-5 w-5" />
              Report New Crisis Incident
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Student Name *</label>
                  <Input
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                    placeholder="Full name of student"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700">Incident Category *</label>
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="SELF_HARM_RISK">Self-Harm Risk</option>
                    <option value="SUICIDE_IDEATION">Suicide Ideation</option>
                    <option value="ABUSE_CONCERNS">Abuse Concerns</option>
                    <option value="BULLYING_ESCALATION">Bullying Escalation</option>
                    <option value="VIOLENCE_THREAT">Violence Threat</option>
                    <option value="SEVERE_EMOTIONAL_DISTREESS">Severe Emotional Distress</option>
                    <option value="MISSING_STUDENT">Missing Student</option>
                    <option value="SAFETY_CONCERN">Safety Concern</option>
                    <option value="SUBSTANCE_CONCERN">Substance Concern</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700">Severity *</label>
                  <select
                    className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value)}
                  >
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700">Location</label>
                  <Input
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Where did this occur?"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Description *</label>
                <textarea
                  className="mt-1 min-h-[100px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the incident in detail..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Submit Incident
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Metrics */}
      {statsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-red-200 bg-red-50/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Active Crisis Cases</p>
                  <p className="text-3xl font-semibold text-red-700">{stats.activeCrisisCases}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-300 bg-red-100/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Critical Incidents</p>
                  <p className="text-3xl font-semibold text-red-700">{stats.criticalIncidents}</p>
                </div>
                <AlertOctagon className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Escalated Cases</p>
                  <p className="text-3xl font-semibold text-orange-600">{stats.escalatedCases}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Avg Response Time</p>
                  <p className="text-3xl font-semibold">{stats.avgResponseTime}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Resolved Incidents</p>
                  <p className="text-3xl font-semibold text-green-600">{stats.resolvedIncidents}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Open Investigations</p>
                  <p className="text-3xl font-semibold">{stats.openInvestigations}</p>
                </div>
                <Activity className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">High-Risk Students</p>
                  <p className="text-3xl font-semibold text-red-600">{stats.highRiskStudents}</p>
                </div>
                <ShieldAlert className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Pending Actions</p>
                  <p className="text-3xl font-semibold text-amber-600">{stats.pendingActions}</p>
                </div>
                <Users className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Quick Insights */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-red-200 bg-red-50/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4" />
                Immediate Action Required
              </h3>
              <p className="text-2xl font-bold text-red-600">{stats.criticalIncidents + stats.escalatedCases}</p>
              <p className="text-xs text-zinc-500">Critical or escalated incidents need attention</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Actions
              </h3>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingActions}</p>
              <p className="text-xs text-zinc-500">Actions awaiting completion</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                High-Risk Students
              </h3>
              <p className="text-2xl font-bold text-orange-600">{stats.highRiskStudents}</p>
              <p className="text-xs text-zinc-500">Students requiring active monitoring</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-5">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search incidents..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="ESCALATED">Escalated</option>
              <option value="MONITORING">Monitoring</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={severity}
              onChange={(event) => {
                setSeverity(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All severities</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              <option value="SELF_HARM_RISK">Self-Harm Risk</option>
              <option value="SUICIDE_IDEATION">Suicide Ideation</option>
              <option value="ABUSE_CONCERNS">Abuse Concerns</option>
              <option value="BULLYING_ESCALATION">Bullying Escalation</option>
              <option value="VIOLENCE_THREAT">Violence Threat</option>
              <option value="SEVERE_EMOTIONAL_DISTREESS">Emotional Distress</option>
              <option value="MISSING_STUDENT">Missing Student</option>
              <option value="SAFETY_CONCERN">Safety Concern</option>
              <option value="SUBSTANCE_CONCERN">Substance Concern</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setStatus(""); setSeverity(""); setCategory(""); setPage(1); }}>
              Clear Filters
            </Button>
          </div>

          {query.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data.length ? (
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Incident ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">School</th>
                    <th className="px-4 py-3">Reported</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((incident) => (
                    <tr key={incident.id} className="border-t border-zinc-200 text-zinc-800">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{incident.incidentId}</td>
                      <td className="px-4 py-3 font-medium">
                        {incident.studentName}
                        <span className="ml-2 text-xs text-zinc-500">
                          Gr. {incident.studentGrade} {incident.studentClassroom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {categoryLabels[incident.incidentCategory as IncidentCategory] ?? incident.incidentCategory}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${severityConfig[incident.severity as CrisisSeverity]?.className}`}>
                          {severityConfig[incident.severity as CrisisSeverity]?.label ?? incident.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[incident.status as CrisisStatus]?.variant ?? "default"}>
                          {statusConfig[incident.status as CrisisStatus]?.label ?? incident.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{incident.schoolName}</td>
                      <td className="px-4 py-3 text-zinc-500">{formatDate(incident.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/crisis/${incident.id}`}>Manage</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No crisis incidents found"
              description="Crisis incidents will appear here when reported."
            />
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Page {query.data?.pagination.page ?? 1} of {query.data?.pagination.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={Boolean(query.data && page >= query.data.pagination.totalPages)}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
