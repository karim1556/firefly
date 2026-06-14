"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClassroomActivityItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Eye, AlertTriangle, CheckCircle, Users } from "lucide-react";

interface ClassroomActivityFeedProps {
  items: ClassroomActivityItem[];
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  OBSERVATION_ADDED: { label: "Observation", icon: Eye, color: "text-blue-600 bg-blue-50" },
  FLAG_RAISED: { label: "Flag Raised", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  SEL_SESSION_COMPLETED: { label: "SEL Session", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
  WORKSHOP_ATTENDED: { label: "Workshop", icon: Users, color: "text-purple-600 bg-purple-50" },
  FLAG_RESOLVED: { label: "Flag Resolved", icon: CheckCircle, color: "text-green-600 bg-green-50" },
};

export function ClassroomActivityFeed({ items }: ClassroomActivityFeedProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-zinc-500">
          No recent activity
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(item => {
            const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.OBSERVATION_ADDED;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg p-1.5 ${config.color}`}>
                  <config.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{item.studentName}</span>
                    <Badge variant="default" className="text-xs">{config.label}</Badge>
                  </div>
                  <p className="text-sm text-zinc-600 truncate">{item.description}</p>
                  <p className="text-xs text-zinc-400">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
