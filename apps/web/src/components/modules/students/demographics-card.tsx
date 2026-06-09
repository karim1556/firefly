"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentDemographics } from "@/lib/types";
import { IdCard, Users, Phone, Cake } from "lucide-react";

interface DemographicsCardProps {
  demographics: StudentDemographics;
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-900">{value ?? "—"}</p>
    </div>
  );
}

export function DemographicsCard({ demographics }: DemographicsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <IdCard className="h-4 w-4 text-indigo-600" />
          Student Demographics
        </CardTitle>
        <p className="text-xs text-zinc-500">Basic identification and parent information.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Student ID" value={demographics.admissionNumber} />
          <Field label="Date of Birth" value={demographics.dateOfBirth} />
          <Field label="Age" value={demographics.age} />
          <Field label="Gender" value={demographics.gender} />
          <Field label="Standard" value={demographics.standard} />
          <Field label="Section" value={demographics.section} />
        </div>

        <div className="mt-4 rounded-xl bg-zinc-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-700">
            <Users className="h-3.5 w-3.5" />
            Parents / Guardians
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Father" value={demographics.fatherName} />
            <Field label="Mother" value={demographics.motherName} />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-2">
            <Phone className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500">Parent Contact:</span>
            <span className="text-sm font-medium text-zinc-900">{demographics.parentContact}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <Cake className="h-3 w-3" />
          <span>Demographics visible to Coordinators, Counsellors, and authorised staff only.</span>
        </div>
      </CardContent>
    </Card>
  );
}
