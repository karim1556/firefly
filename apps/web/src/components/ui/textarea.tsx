import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-xl border bg-zinc-50 p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200",
        error ? "border-red-300 focus:border-red-300 focus:ring-red-200" : "border-zinc-200",
        className
      )}
      {...props}
    />
  );
}
