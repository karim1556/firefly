import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
      <Sparkles className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
      <h4 className="text-base font-semibold text-zinc-900">{title}</h4>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
