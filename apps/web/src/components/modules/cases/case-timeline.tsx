"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock3, MessageSquare, ShieldAlert, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type TimelineEvent = {
  id: string;
  eventType: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: {
    fullName: string;
    role: string;
  };
};

function TimelineIcon({ eventType }: { eventType: string }) {
  if (eventType.includes("session")) {
    return <Stethoscope className="h-4 w-4 text-zinc-400" />;
  }

  if (eventType.includes("closed") || eventType.includes("safety")) {
    return <ShieldAlert className="h-4 w-4 text-zinc-600" />;
  }

  if (eventType.includes("note") || eventType.includes("comment")) {
    return <MessageSquare className="h-4 w-4 text-cyan-200" />;
  }

  return <Clock3 className="h-4 w-4 text-zinc-600" />;
}

export function CaseTimeline({ events }: { events: TimelineEvent[] }) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Case Timeline</h3>
        <p className="text-xs text-zinc-500">Chronological interventions and actions</p>
      </div>

      <div className="space-y-2">
        {events.map((event) => {
          const expanded = expandedIds.includes(event.id);

          return (
            <div key={event.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-3 text-left"
                onClick={() => toggleExpanded(event.id)}
                aria-expanded={expanded}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-zinc-100/80">
                    <TimelineIcon eventType={event.eventType} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{event.title}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(event.createdAt)} • {event.createdBy.fullName} ({event.createdBy.role})
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </button>

              {expanded ? <p className="mt-3 border-t border-zinc-200 pt-3 text-sm text-zinc-600">{event.description}</p> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
