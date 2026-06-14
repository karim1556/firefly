"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Star, Clock, Globe, Phone, Mail, Lock, Unlock, Calendar, FileText, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { Practitioner, PractitionerReview } from "@/lib/types";

interface PractitionerDetail extends Practitioner {
  reviews: PractitionerReview[];
  _count: {
    referrals: number;
  };
}

export default function PractitionerProfilePage() {
  const { practitionerId } = useParams<{ practitionerId: string }>();
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["practitioner", practitionerId],
    queryFn: () => authFetch<PractitionerDetail>(`/referrals/practitioners/${practitionerId}`),
    enabled: Boolean(practitionerId)
  });

  const requestContactMutation = useMutation({
    mutationFn: () =>
      authFetch(`/referrals/practitioners/${practitionerId}/request-access`, {
        method: "POST"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["practitioner", practitionerId] })
  });

  const practitioner = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="space-y-6">
        <EmptyState title="Practitioner not found" description="This practitioner may have been removed." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/referrals/practitioners"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{practitioner.fullName}</h1>
            <p className="text-sm text-zinc-500">
              {practitioner.specializations.join(" | ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {practitioner.rating && (
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-lg font-semibold">{practitioner.rating.toFixed(1)}</span>
              <span className="text-sm text-zinc-500">rating</span>
            </div>
          )}
          {practitioner.isAvailable ? (
            <Badge variant="success">Available</Badge>
          ) : (
            <Badge variant="default">Not Available</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-zinc-200 flex items-center justify-center mb-4">
                  <span className="text-3xl font-semibold text-zinc-600">
                    {practitioner.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{practitioner.fullName}</h2>
                <p className="text-zinc-500 mt-1">{practitioner.city}</p>

                {practitioner.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(practitioner.rating!)
                            ? "text-amber-500 fill-amber-500"
                            : "text-zinc-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-zinc-500">
                      {practitioner.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                )}

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-zinc-400" />
                    <div className="text-left">
                      <p className="text-sm text-zinc-500">Experience</p>
                      <p className="font-medium">{practitioner.yearsOfExperience} years</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <Globe className="h-5 w-5 text-zinc-400" />
                    <div className="text-left">
                      <p className="text-sm text-zinc-500">Languages</p>
                      <p className="font-medium">{practitioner.languages.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                    <FileText className="h-5 w-5 text-zinc-400" />
                    <div className="text-left">
                      <p className="text-sm text-zinc-500">Referrals</p>
                      <p className="font-medium">{practitioner._count.referrals} students referred</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-400" />
                <span>{practitioner.email}</span>
              </div>

              {practitioner.contactUnlocked ? (
                <>
                  {practitioner.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-zinc-400" />
                      <span>{practitioner.phone}</span>
                    </div>
                  )}
                  {practitioner.clinicAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-zinc-400 mt-0.5" />
                      <span>{practitioner.clinicAddress}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-zinc-50 rounded-lg text-center">
                  <Lock className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm text-zinc-600 mb-3">
                    Contact details are protected. Request access to view.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => requestContactMutation.mutate()}
                    disabled={requestContactMutation.isPending}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultation Modes */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {practitioner.consultationModes.map((mode) => (
                  <Badge key={mode} variant="default" className="text-sm px-3 py-1">
                    {mode}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fee Range */}
          {practitioner.feeRange && (
            <Card>
              <CardHeader>
                <CardTitle>Fee Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{practitioner.feeRange}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {practitioner.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-700 leading-relaxed">{practitioner.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {practitioner.specializations.map((spec) => (
                  <Badge key={spec} variant="default" className="text-sm px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {practitioner.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {practitioner.reviews.length === 0 ? (
                <p className="text-sm text-zinc-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {practitioner.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.studentName || "Anonymous"}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-zinc-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-zinc-500">{formatDate(review.createdAt)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-zinc-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Referral Button */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ready to refer a student?</p>
                  <p className="text-sm text-zinc-500">Create a referral to connect with this practitioner.</p>
                </div>
                <Button asChild>
                  <Link href="/students">Create Referral</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}