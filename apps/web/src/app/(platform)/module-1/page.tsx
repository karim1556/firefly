"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/modules/common/page-header";
import { WelcomeHeader } from "@/components/modules/module-1/welcome-header";
import { ExecutiveKpiGrid } from "@/components/modules/module-1/executive-kpi-grid";
import { SchoolHealthOverview } from "@/components/modules/module-1/school-health-overview";
import { WellbeingTrends } from "@/components/modules/module-1/wellbeing-trends";
import { ActiveCasesWidget } from "@/components/modules/module-1/active-cases-widget";
import { CrisisAlertCenter } from "@/components/modules/module-1/crisis-alert-center";
import { SelPerformance } from "@/components/modules/module-1/sel-performance";
import { ReferralAssistanceSummary } from "@/components/modules/module-1/referral-assistance-summary";
import { UpcomingCalendar } from "@/components/modules/module-1/upcoming-calendar";
import { ActivityFeed } from "@/components/modules/module-1/activity-feed";
import { HighRiskMonitor } from "@/components/modules/module-1/high-risk-monitor";
import { FollowUpTracker } from "@/components/modules/module-1/follow-up-tracker";
import type { Module1Overview } from "@/lib/types";

export default function Module1Page() {
  const { authFetch } = useAuth();

  const query = useQuery({
    queryKey: ["module-1", "overview"],
    queryFn: () => authFetch<Module1Overview>("/module-1/overview")
  });

  if (query.isLoading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Skeleton className="h-16 w-2/3" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl md:col-span-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Command Center"
          description="Home dashboard and visibility into student wellbeing across the school."
        />
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title="Command center unavailable"
              description="We could not load the home dashboard right now. Try again in a moment."
            />
            <div className="mt-4 flex justify-center">
              <Button onClick={() => void query.refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Home Dashboard & Command Center"
        description="A single, intelligent view of school wellbeing — cases, crisis, SEL, compliance, and AI guidance."
      />
      <WelcomeHeader data={query.data} />
      <SchoolHealthOverview kpis={query.data.kpis} />
      <ExecutiveKpiGrid kpis={query.data.kpis} />
      <WellbeingTrends trends={query.data.trends} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ActiveCasesWidget cases={query.data.activeCases} />
        <CrisisAlertCenter alerts={query.data.crisisAlerts} />
      </div>
      <SelPerformance sel={query.data.sel} />
      <ReferralAssistanceSummary referrals={query.data.referrals} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <UpcomingCalendar events={query.data.calendar} />
        <ActivityFeed events={query.data.recentActivity} />
      </div>
      <HighRiskMonitor students={query.data.highRiskStudents} />
      <FollowUpTracker followUps={query.data.followUps} />
    </div>
  );
}
