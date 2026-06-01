import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneGradients = {
  indigo: "from-slate-900 via-slate-800 to-slate-700",
  green: "from-emerald-600 via-emerald-500 to-green-400",
  amber: "from-amber-600 via-amber-500 to-yellow-400",
  red: "from-red-600 via-red-500 to-rose-400"
};

const toneIconBg = {
  indigo: "bg-gradient-to-br from-slate-900/10 to-slate-700/5 border-slate-200",
  green: "bg-gradient-to-br from-emerald-500/10 to-green-400/5 border-emerald-200",
  amber: "bg-gradient-to-br from-amber-500/10 to-yellow-400/5 border-amber-200",
  red: "bg-gradient-to-br from-red-500/10 to-rose-400/5 border-red-200"
};

const toneTrendColors = {
  indigo: "text-slate-600",
  green: "text-emerald-600",
  amber: "text-amber-600",
  red: "text-red-600"
};

export function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  tone = "indigo"
}: {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "indigo" | "green" | "amber" | "red";
}) {
  const isPositive = trend.includes("+") || trend.includes("up") || trend.includes("stable");
  const isNegative = trend.includes("-") || trend.includes("Needs") || trend.includes("review");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card className="group relative overflow-hidden p-5">
        {/* Top accent gradient bar */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          toneGradients[tone]
        )} />

        {/* Subtle shine overlay on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          </div>
          <div className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border shadow-sm",
            toneIconBg[tone]
          )}>
            <Icon className={cn(
              "h-5 w-5",
              tone === "indigo" && "text-slate-800",
              tone === "green" && "text-emerald-600",
              tone === "amber" && "text-amber-600",
              tone === "red" && "text-red-600"
            )} />
          </div>
        </div>

        <div className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-50 border border-slate-100",
          toneTrendColors[tone]
        )}>
          {isPositive && !isNegative ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : isNegative ? (
            <TrendingDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          {trend}
        </div>
      </Card>
    </motion.div>
  );
}