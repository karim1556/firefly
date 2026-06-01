"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Brain, ShieldCheck, Sparkles, UserRoundCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/types";

const roleOptions: Array<{ role: Role; label: string }> = [
  { role: "ADMIN", label: "Admin" },
  { role: "COUNSELLOR", label: "Counsellor" },
  { role: "TEACHER", label: "Teacher" },
  { role: "PARENT", label: "Parent" },
  { role: "STUDENT", label: "Student" }
];

export default function LoginPage() {
  const router = useRouter();
  const { user, isHydrated, login, loginAsRole } = useAuth();
  const allowNoDbMode = process.env.NEXT_PUBLIC_ALLOW_NO_DB !== "false";
  const [email, setEmail] = useState("admin@firefly.local");
  const [password, setPassword] = useState("Firefly@123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtitle = useMemo(
    () => "Multi-tier school wellbeing platform with counselling, crisis, and reporting workflows.",
    []
  );

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/dashboard");
    }
  }, [isHydrated, router, user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleQuickLogin = async (role: Role) => {
    setIsSubmitting(true);

    try {
      await loginAsRole(role);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in with demo role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#FFFFFF] p-4 pb-10 pt-8 text-[#000000] md:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-8 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        <div className="absolute right-4 top-24 h-72 w-72 rounded-full bg-neutral-300/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-zinc-300/35 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <section className="glass relative overflow-hidden rounded-3xl border border-black/10 p-8 md:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-[2.5rem] bg-gradient-to-bl from-black/10 to-transparent" />

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#000000]">
              <Sparkles className="h-3.5 w-3.5" />
              Firefly Intelligence Platform
            </div>

            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#000000] text-[#FFFFFF] shadow-lg shadow-black/25">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-normal leading-[0.95] tracking-[-1.4px] text-[#000000] md:text-4xl">Firefly Health</h1>
                <p className="text-sm text-[#6F6F6F]">School Wellbeing Operating System</p>
              </div>
            </div>

            <p className="max-w-xl text-lg leading-relaxed text-[#6F6F6F] md:text-[1.2rem]">{subtitle}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-[#6F6F6F]">Tier Coverage</p>
                <p className="mt-2 text-2xl font-semibold text-[#000000]">1-3</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-[#6F6F6F]">Early Flags</p>
                <p className="mt-2 text-2xl font-semibold text-[#000000]">Realtime</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-[#6F6F6F]">Case Flow</p>
                <p className="mt-2 text-2xl font-semibold text-[#000000]">E2E</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-[#000000]">Tier 1 Promotion</p>
                <p className="mt-1 text-xs text-[#6F6F6F]">Universal SEL delivery and weekly wellbeing checks.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-[#000000]">Tier 2 Prevention</p>
                <p className="mt-1 text-xs text-[#6F6F6F]">Targeted support plans, referrals, and follow-up tasks.</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 sm:col-span-2">
                <p className="text-sm font-medium text-[#000000]">Tier 3 Intervention</p>
                <p className="mt-1 text-xs text-[#6F6F6F]">Crisis workflows with escalation, audit trails, and care continuity.</p>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-sm text-[#6F6F6F]">
              <ShieldCheck className="h-4 w-4 text-[#000000]" />
              Aligned for secure school wellbeing operations
            </div>
          </section>

          <Card className="glass rounded-3xl border border-black/10 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <UserRoundCog className="h-5 w-5 text-[#000000]" />
              <h2 className="text-xl font-semibold text-[#000000]">Sign in</h2>
            </div>

            {allowNoDbMode ? (
              <div className="mb-4 rounded-xl border border-black/10 bg-black/5 p-3 text-xs text-[#444444]">
                Preview mode enabled: app can run even if database is not connected.
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-[#6F6F6F]" htmlFor="email">
                  Email
                </label>
                <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wide text-[#6F6F6F]" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                />
              </div>

              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in to workspace"}
                {!isSubmitting ? <ArrowRight className="ml-1.5 h-4 w-4" /> : null}
              </Button>
            </form>

            <div className="my-5 h-px bg-black/10" />

            <p className="mb-3 text-xs uppercase tracking-wide text-[#6F6F6F]">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => (
                <Button
                  key={option.role}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => void handleRoleQuickLogin(option.role)}
                  disabled={isSubmitting}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
