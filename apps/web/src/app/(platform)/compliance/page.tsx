"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Shield, AlertTriangle, CheckCircle2, Clock, TrendingUp, BookOpen, ClipboardList, BarChart3, Users, Calendar, ChevronRight, ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { PolicyDashboardStats, ComplianceStats, Policy, PolicyStatus, PolicyCategory } from "@/lib/types";

const statusConfig: Record<PolicyStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  DRAFT: { label: "Draft", variant: "default" },
  UNDER_REVIEW: { label: "Under Review", variant: "warning" },
  APPROVED: { label: "Approved", variant: "info" },
  PUBLISHED: { label: "Published", variant: "success" },
  ARCHIVED: { label: "Archived", variant: "default" },
  EXPIRED: { label: "Expired", variant: "danger" },
};

const categoryLabels: Record<PolicyCategory, string> = {
  STUDENT_WELLBEING: "Student Wellbeing",
  SAFEGUARDING: "Safeguarding",
  CRISIS_MANAGEMENT: "Crisis Management",
  REFERRAL_GUIDELINES: "Referral Guidelines",
  PARENT_COMMUNICATION: "Parent Communication",
  SEL_FRAMEWORKS: "SEL Frameworks",
  SCHOOL_PROCEDURES: "School Procedures",
  STAFF_HANDBOOK: "Staff Handbook",
};

export default function ComplianceDashboardPage() {
  const { authFetch } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["compliance", "dashboard", "stats"],
    queryFn: () => authFetch<PolicyDashboardStats>("/compliance/dashboard/stats")
  });

  const complianceQuery = useQuery({
    queryKey: ["compliance", "stats"],
    queryFn: () => authFetch<ComplianceStats>("/compliance/stats")
  });

  const stats = statsQuery.data;
  const compliance = complianceQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policy & Documentation Hub"
        description="Manage policies, SOPs, compliance, and organizational knowledge."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/compliance/policies">All Policies</Link>
            </Button>
            <Button asChild>
              <Link href="/compliance/policies">
                <Plus className="mr-2 h-4 w-4" />
                Create Policy
              </Link>
            </Button>
          </div>
        }
      />

      {/* Dashboard Metrics */}
      {statsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Total Policies</p>
                  <p className="text-3xl font-semibold">{stats.totalPolicies}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Active Policies</p>
                  <p className="text-3xl font-semibold text-green-600">{stats.activePolicies}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Under Review</p>
                  <p className="text-3xl font-semibold text-amber-600">{stats.underReview}</p>
                </div>
                <Clock className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Compliance Rate</p>
                  <p className="text-3xl font-semibold text-blue-600">{stats.complianceRate}%</p>
                </div>
                <Shield className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Expiring Soon</p>
                  <p className="text-3xl font-semibold text-orange-600">{stats.expiringPolicies}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Pending Acknowledgements</p>
                  <p className="text-3xl font-semibold text-amber-600">{stats.pendingAcknowledgements}</p>
                </div>
                <Users className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Total Acknowledged</p>
                  <p className="text-3xl font-semibold text-green-600">{stats.totalAcknowledged}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Overdue</p>
                  <p className="text-3xl font-semibold text-red-600">{stats.totalOverdue}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Quick Access */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/compliance/policies">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Policy Repository</h3>
                <p className="text-sm text-zinc-500">Browse all policies</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance/sops">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">SOP Library</h3>
                <p className="text-sm text-zinc-500">Standard operating procedures</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance/knowledge-base">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Knowledge Base</h3>
                <p className="text-sm text-zinc-500">Resources and guides</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/compliance/audit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-zinc-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Governance Analytics</h3>
                <p className="text-sm text-zinc-500">Compliance insights</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Policies & Upcoming Reviews */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Policies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Policies</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/compliance/policies">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentPolicies && stats.recentPolicies.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPolicies.map((policy) => (
                  <Link key={policy.id} href={`/compliance/policies/${policy.id}`} className="block p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{policy.title}</p>
                        <p className="text-xs text-zinc-500">Review due: {formatDate(policy.reviewDate)}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No recent policies</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                Upcoming Reviews
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.upcomingReviews && stats.upcomingReviews.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingReviews.map((review) => (
                  <div key={review.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{review.title}</p>
                      <p className="text-xs text-amber-700">Review due: {formatDate(review.reviewDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">No upcoming reviews</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Overview */}
      {compliance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-zinc-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{compliance.overallCompliance}%</p>
                <p className="text-sm text-zinc-500">Overall Compliance</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{compliance.policyAdoptionRate}%</p>
                <p className="text-sm text-zinc-500">Policy Adoption</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">{compliance.staffAcknowledgementRate}%</p>
                <p className="text-sm text-zinc-500">Staff Acknowledgement</p>
              </div>
              <div className="text-center p-4 bg-zinc-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{compliance.overdueReviews}</p>
                <p className="text-sm text-zinc-500">Overdue Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
