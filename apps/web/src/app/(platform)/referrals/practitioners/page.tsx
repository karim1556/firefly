"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Star, Clock, Globe, Phone, Mail, Filter, GraduationCap, Languages } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { toQueryString } from "@/lib/utils";
import type { Practitioner, PaginatedResponse, SPECIALTIES, CONSULTATION_MODES } from "@/lib/types";

const SPECIALTIES_LIST = [
  "Child Psychology",
  "Clinical Psychology",
  "Psychiatry",
  "Family Therapy",
  "Behavioral Therapy",
  "Learning Disabilities",
  "ADHD Support",
  "Anxiety & Stress Support"
] as const;

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];
const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Kannada"];

export default function PractitionersPage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [language, setLanguage] = useState("");
  const [consultationMode, setConsultationMode] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["practitioners", search, city, specialty, language, consultationMode, page],
    queryFn: () =>
      authFetch<PaginatedResponse<Practitioner>>(
        `/referrals/practitioners${toQueryString({ search, city, specialty, language, consultationMode, page, pageSize: 12 })}`
      )
  });

  const data = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practitioner Directory"
        description="Find trusted mental health professionals for student referrals."
      />

      {/* Search & Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name, city, or specialty..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => { setSearch(""); setCity(""); setSpecialty(""); setLanguage(""); setConsultationMode(""); setPage(1); }}>
              Clear
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={city}
              onChange={(event) => { setCity(event.target.value); setPage(1); }}
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={specialty}
              onChange={(event) => { setSpecialty(event.target.value); setPage(1); }}
            >
              <option value="">All Specialties</option>
              {SPECIALTIES_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={language}
              onChange={(event) => { setLanguage(event.target.value); setPage(1); }}
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={consultationMode}
              onChange={(event) => { setConsultationMode(event.target.value); setPage(1); }}
            >
              <option value="">All Modes</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : data.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((practitioner) => (
              <Card key={practitioner.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center">
                        <span className="text-lg font-semibold text-zinc-600">
                          {practitioner.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{practitioner.fullName}</h3>
                        <div className="flex items-center gap-1 text-sm text-zinc-500">
                          <MapPin className="h-3 w-3" />
                          {practitioner.city}
                        </div>
                      </div>
                    </div>
                    {practitioner.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold">{practitioner.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {practitioner.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="default" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {practitioner.specializations.length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{practitioner.specializations.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-zinc-400" />
                      <span>{practitioner.yearsOfExperience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-zinc-400" />
                      <span>{practitioner.languages.join(", ")}</span>
                    </div>
                    <div className="flex gap-2">
                      {practitioner.consultationModes.map((mode) => (
                        <Badge key={mode} variant="outline" className="text-xs">
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    {practitioner.isAvailable ? (
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    ) : (
                      <span className="text-xs text-zinc-500">Not available</span>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/referrals/practitioners/${practitioner.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing {data.length} practitioners
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
        </>
      ) : (
        <EmptyState
          title="No practitioners found"
          description="Try adjusting your search criteria."
        />
      )}
    </div>
  );
}