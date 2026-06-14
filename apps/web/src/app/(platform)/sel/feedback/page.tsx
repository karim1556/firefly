"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Star, ThumbsDown, ThumbsUp, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type FeedbackEntry = {
  id: string;
  sessionId: string;
  sessionTitle: string;
  facilitatorName: string;
  rating: number;
  contentClarity: number;
  engagementLevel: number;
  practicalTips: number;
  comments: string;
  submittedAt: string;
};

export default function SELFeedbackPage() {
  const { authFetch } = useAuth();
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const { data: statsData } = useQuery({
    queryKey: ["sel-dashboard-stats"],
    queryFn: () => authFetch<any>("/sel/dashboard/stats"),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["sel-feedback-m4"],
    queryFn: () => authFetch<{ data: FeedbackEntry[] }>("/sel/feedback"),
  });

  const feedbackEntries = (data?.data ?? []).filter((f: FeedbackEntry) => {
    if (ratingFilter === "all") return true;
    if (ratingFilter === "high") return f.rating >= 4;
    if (ratingFilter === "low") return f.rating < 3;
    return true;
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className={`h-4 w-4 ${j < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Session Feedback"
        description="Review feedback from students and facilitators on SEL sessions."
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {feedbackEntries.length > 0 ? (feedbackEntries.reduce((s, f) => s + f.rating, 0) / feedbackEntries.length).toFixed(1) : "—"}
              </p>
              <p className="text-sm text-slate-500">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {feedbackEntries.filter(f => f.rating >= 4).length}
              </p>
              <p className="text-sm text-slate-500">Highly Rated (4+)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <ThumbsDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">
                {feedbackEntries.filter(f => f.rating < 3).length}
              </p>
              <p className="text-sm text-slate-500">Needs Improvement (&lt;3)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all","high","low"].map(f => (
          <Button key={f} variant={ratingFilter === f ? "default" : "outline"} size="sm" onClick={() => setRatingFilter(f)}>
            {f === "all" ? "All Feedback" : f === "high" ? "4+ Stars" : "<3 Stars"}
          </Button>
        ))}
      </div>

      {/* Feedback List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : feedbackEntries.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {feedbackEntries.map((fb) => (
            <Card key={fb.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{fb.sessionTitle}</p>
                    <p className="text-xs text-slate-500">{fb.facilitatorName} · {formatDate(fb.submittedAt)}</p>
                  </div>
                  {renderStars(fb.rating)}
                </div>

                {/* Sub-metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Content Clarity", value: fb.contentClarity },
                    { label: "Engagement", value: fb.engagementLevel },
                    { label: "Practical Tips", value: fb.practicalTips },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-2 rounded-lg bg-slate-50">
                      <p className="text-lg font-bold text-slate-900">{value.toFixed(1)}</p>
                      <p className="text-[10px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                {fb.comments && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-sm text-slate-600 italic">"{fb.comments}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No feedback found" description="Feedback will appear here after sessions are completed." />
      )}
    </div>
  );
}