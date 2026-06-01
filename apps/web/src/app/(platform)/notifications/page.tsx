"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bell, Calendar, Info, Star } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: "alert" | "reminder" | "update" | "milestone";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
};

const typeIcon = (type: string) => {
  switch (type) {
    case "alert": return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case "reminder": return <Calendar className="h-5 w-5 text-amber-600" />;
    case "update": return <Info className="h-5 w-5 text-blue-600" />;
    case "milestone": return <Star className="h-5 w-5 text-emerald-600" />;
    default: return <Bell className="h-5 w-5 text-slate-400" />;
  }
};

const priorityBadge = (priority: string) => {
  switch (priority) {
    case "high": return "danger" as const;
    case "medium": return "warning" as const;
    case "low": return "info" as const;
    default: return "info" as const;
  }
};

export default function NotificationsPage() {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => authFetch<NotificationItem[]>("/notifications")
  });

  const notifications = query.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Activity & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : notifications.length ? (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    notif.read
                      ? "border-slate-100 bg-white"
                      : "border-slate-200 bg-gradient-to-r from-slate-50 to-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">{typeIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${notif.read ? "text-slate-600" : "text-slate-900"}`}>
                            {notif.title}
                          </p>
                          {!notif.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                        </div>
                        <Badge variant={priorityBadge(notif.priority)}>
                          {notif.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{notif.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notifications" description="Your notification feed will appear here." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}