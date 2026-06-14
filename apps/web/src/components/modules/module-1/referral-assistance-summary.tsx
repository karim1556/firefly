"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Clock, LifeBuoy, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReferralSummaryCard } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tile = { key: keyof ReferralSummaryCard; label: string; icon: React.ComponentType<{ className?: string }>; tone: string };

const TILES: Tile[] = [
  { key: "active", label: "Active Referrals", icon: UserPlus, tone: "from-sky-50 to-sky-50/40 border-sky-200/60 text-sky-700" },
  { key: "pending", label: "Pending Referrals", icon: Clock, tone: "from-amber-50 to-amber-50/40 border-amber-200/60 text-amber-700" },
  { key: "assistance", label: "Assistance Requests", icon: LifeBuoy, tone: "from-violet-50 to-violet-50/40 border-violet-200/60 text-violet-700" },
  { key: "resolved", label: "Resolved Referrals", icon: CheckCircle2, tone: "from-emerald-50 to-emerald-50/40 border-emerald-200/60 text-emerald-700" },
];

export function ReferralAssistanceSummary({ referrals }: { referrals: ReferralSummaryCard }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="text-base text-slate-800">Referrals &amp; Assistance</CardTitle>
        <Button variant="ghost" size="sm" className="group">
          Open hub
          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t, i) => (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={cn("rounded-xl border bg-gradient-to-br p-4", t.tone)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{t.label}</p>
                <t.icon className="h-4 w-4 opacity-80" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{referrals[t.key]}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
