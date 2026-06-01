"use client";

import Link from "next/link";
import { ArrowRight, BookHeart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, isHydrated } = useAuth();

  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0f172a]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
              <BookHeart className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Firefly Health</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href={isHydrated && user ? "/dashboard" : "/login"} className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
              {isHydrated && user ? "Dashboard" : "Sign In"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative pt-32 pb-20">
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold md:text-5xl">Firefly Health</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">A simple platform to support school wellbeing and care coordination.</p>

          <div className="mx-auto mt-8 max-w-2xl text-left">
            <h2 className="text-xl font-semibold mb-3">Services we provide</h2>
            <ul className="list-disc list-inside text-zinc-700 space-y-2">
              <li>Student Management and Rosters</li>
              <li>Case Management & Timelines</li>
              <li>SEL Curriculum and Sessions</li>
              <li>Screening & Assessments</li>
              <li>Crisis Management & Escalation</li>
              <li>Referral Network & Care Coordination</li>
              <li>Analytics & Reporting</li>
              <li>Appointments & Scheduling</li>
              <li>Parent & Student Portals</li>
              <li>Compliance Auditing and Logs</li>
            </ul>

            <div className="mt-8 flex gap-3">
              <Link href={isHydrated && user ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800">
                {isHydrated && user ? "Launch Dashboard" : "Start Demo"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-zinc-700 hover:border-black/20">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Firefly Health</p>
        </div>
      </footer>
    </main>
  );
}