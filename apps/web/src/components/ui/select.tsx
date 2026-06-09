import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border bg-zinc-50 px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2",
        error
          ? "border-red-300 focus:border-red-300 focus:ring-red-200"
          : "border-zinc-200 focus:border-zinc-300 focus:ring-zinc-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
