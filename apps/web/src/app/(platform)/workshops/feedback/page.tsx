"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

type WorkshopFeedbackEntry = {
  id: string;
  workshopId: string;
  workshopTitle: string;
  respondentName: string;
  rating: number;
  usefulnessScore: number;
  learnedNew: boolean;
  wouldRecommend: boolean;
  comments: string;
  submittedAt: string;
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

export default function WorkshopFeedbackPage() {
  const { authFetch } = useAuth();
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const { data: workshopsData } = useQuery({
    queryKey: ["workshops"],
    queryFn: () => authFetch<{ data: any[] }>("/workshops"),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["workshop-feedback-m4"],
    queryFn: () => authFetch<{ data: WorkshopFeedbackEntry[] }>("/workshops/feedback"),
  });

  const feedbackEntries = (data?.data ?? []).filter((f: WorkshopFeedbackEntry) => {
    if (ratingFilter === "all") return true;
    if (ratingFilter === "high") return f.rating >= 4;
    if (ratingFilter === "low") return f.rating < 3;
    return true;
  });

  const workshops = workshopsData?.data ?? [];
  const getWorkshopCategory = (id: string) => workshops.find(w => w.id === id)?.category ?? "";

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className={`h-4 w-4 ${j < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  );

  const avgRating = feedbackEntries.length > 0
    ? feedbackEntries.reduce((s, f) => s + f.rating, 0) / feedbackEntries.length
    : 0;
  const recommendPct = feedbackEntries.length > 0
    ? Math.round((feedbackEntries.filter(f => f.wouldRecommend).length / feedbackEntries.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop Feedback"
        description="Review participant feedback on school workshops."
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
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
              <p className="text-3xl font-bold text-slate-900">{recommendPct}%</p>
              <p className="text-sm text-slate-500">Would Recommend</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{feedbackEntries.length}</p>
              <p className="text-sm text-slate-500">Total Responses</p>
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
                    <p className="font-semibold text-slate-900">{fb.workshopTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="text-xs">{categoryLabel[getWorkshopCategory(fb.workshopId)] || "Workshop"}</Badge>
                      <p className="text-xs text-slate-500">by {fb.respondentName} · {formatDate(fb.submittedAt)}</p>
                    </div>
                  </div>
                  {renderStars(fb.rating)}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <span className="text-xs text-slate-500">Usefulness:</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className={`h-2 w-4 rounded-sm ${j < fb.usefulnessScore ? "bg-emerald-500" : "bg-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <span className="text-xs text-slate-500">Learned new:</span>
                    <Badge variant={fb.learnedNew ? "success" : "info"} className="text-xs">
                      {fb.learnedNew ? "Yes" : "Somewhat"}
                    </Badge>
                  </div>
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
        <EmptyState title="No feedback found" description="Workshop feedback will appear here after workshops are completed." />
      )}
    </div>
  );
}