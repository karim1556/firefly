"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, AlertCircle, Info, ArrowRight } from "lucide-react";
import type { AIInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG = {
  ALERT: {
    icon: AlertTriangle,
    accent: "bg-red-50 text-red-600 border-red-200",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  WARNING: {
    icon: AlertCircle,
    accent: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  INFO: {
    icon: Info,
    accent: "bg-blue-50 text-blue-600 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
};

export function AIInsightsPanel({ aiInsights }: { aiInsights: AIInsight[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base text-slate-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          AI Insights
        </CardTitle>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
          Powered by Firefly
        </span>
      </CardHeader>
      <CardContent>
        {aiInsights.length === 0 ? (
          <p className="text-sm text-slate-500">No insights available right now.</p>
        ) : (
          <ul className="space-y-3">
            {aiInsights.map((insight, i) => {
              const cfg = SEVERITY_CONFIG[insight.severity];
              const Icon = cfg.icon;
              return (
                <motion.li
                  key={insight.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className={cn(
                    "rounded-xl border p-4",
                    cfg.accent
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", cfg.badge)}>
                          {insight.severity}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{insight.insight}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{insight.description}</p>
                      {insight.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {insight.suggestedActions.map((action, j) => (
                            <motion.span
                              key={j}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.07 + j * 0.05 }}
                              className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm"
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                              {action}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="group flex-shrink-0">
                      <span className="text-xs">Act</span>
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
