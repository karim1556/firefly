"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, toQueryString } from "@/lib/utils";

type Incident = {
  id: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  incidentType: string;
  description: string;
  actionTaken: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
  };
};

type IncidentResponse = {
  data: Incident[];
};

export default function IncidentsPage() {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const [severity, setSeverity] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  const incidentsQuery = useQuery({
    queryKey: ["incidents", severity],
    queryFn: () => authFetch<IncidentResponse>(`/incidents${toQueryString({ severity })}`)
  });

  const createMutation = useMutation({
    mutationFn: () =>
      authFetch("/incidents", {
        method: "POST",
        body: JSON.stringify({
          severity: severity || "HIGH",
          incidentType,
          description,
          actionTaken
        })
      }),
    onSuccess: async () => {
      setIncidentType("");
      setDescription("");
      setActionTaken("");
      toast.success("Incident logged");
      await queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to log incident");
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!incidentType || !description || !actionTaken) {
      toast.error("Incident type, description, and action taken are required");
      return;
    }

    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Crisis Incidents" description="Log and monitor high-severity incidents with mandatory action tracking." />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-600">
              <AlertTriangle className="h-5 w-5" />
              Incident Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidentsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : incidentsQuery.data?.data.length ? (
              <div className="space-y-3">
                {incidentsQuery.data.data.map((incident) => (
                  <div
                    key={incident.id}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 transition-colors hover:border-red-400/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-600">{incident.incidentType}</p>
                      <Badge variant={incident.severity === "CRITICAL" ? "danger" : "warning"}>{incident.severity}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-red-600/90">{incident.description}</p>
                    <p className="mt-2 text-xs text-zinc-600/70">Action: {incident.actionTaken}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-600/60">{formatDate(incident.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No incidents" description="Crisis incidents and escalation logs appear here." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <select
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
              >
                <option value="">Severity (default HIGH)</option>
                <option value="LOW">Low</option>
                <option value="MODERATE">Moderate</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>

              <Input
                value={incidentType}
                onChange={(event) => setIncidentType(event.target.value)}
                placeholder="Incident type"
                required
              />

              <textarea
                className="min-h-[100px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                required
              />

              <textarea
                className="min-h-[100px] w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900"
                value={actionTaken}
                onChange={(event) => setActionTaken(event.target.value)}
                placeholder="Action taken (required)"
                required
              />

              <Button type="submit" variant="danger" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Submit incident"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
