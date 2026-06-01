import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-white text-slate-600 shadow-sm",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm",
        warning: "border-amber-200 bg-amber-50 text-amber-700 shadow-sm",
        danger: "border-red-200 bg-red-50 text-red-700 shadow-sm",
        info: "border-slate-200 bg-slate-100 text-slate-700 shadow-sm"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
