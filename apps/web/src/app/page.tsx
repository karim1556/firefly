"use client";

import Link from "next/link";
import { ArrowRight, Brain, Shield, Bell, BarChart3, Users, BookHeart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, isHydrated } = useAuth();

  return (
    <main className="min-h-screen bg-[#FAFBFC] text-[#0f172a]">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
              <BookHeart className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Firefly Health</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Platform</a>
            <a href="#solutions" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Solutions</a>
            <a href="#impact" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Impact</a>
            <Link
              href={isHydrated && user ? "/dashboard" : "/login"}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              {isHydrated && user ? "Dashboard" : "Sign In"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-40 h-96 w-96 rounded-full bg-black/[0.03] blur-3xl" />
          <div className="absolute -right-20 top-60 h-96 w-96 rounded-full bg-emerald-500/[0.03] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-500/[0.02] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-8 shadow-sm">
            <Brain className="h-3.5 w-3.5" />
            Supreme Court Aligned • MTSS-Based • AI-Powered
          </div>
          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-2.5px] md:text-7xl lg:text-8xl">
            The Operating System for{" "}
            <span className="italic text-zinc-400">School Mental Wellbeing</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 leading-relaxed">
            From early detection to crisis intervention — Firefly Health empowers 847+ schools
            across India with proactive, multi-tiered care systems that transform student wellbeing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href={isHydrated && user ? "/dashboard" : "/login"}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-base font-medium text-white hover:bg-zinc-800 transition-all"
            >
              {isHydrated && user ? "Launch Dashboard" : "Start Demo"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-4 text-base font-medium text-zinc-700 hover:border-black/20 transition-all"
            >
              Explore Platform
            </a>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-left shadow-sm">
              <p className="text-3xl font-bold text-black">847</p>
              <p className="text-sm text-zinc-500 mt-1">Schools Onboarded</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-left shadow-sm">
              <p className="text-3xl font-bold text-black">124K</p>
              <p className="text-sm text-zinc-500 mt-1">Students Supported</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-left shadow-sm">
              <p className="text-3xl font-bold text-black">98%</p>
              <p className="text-sm text-zinc-500 mt-1">Crisis Response Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t border-black/5 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              <Shield className="h-3.5 w-3.5" />
              Enterprise Platform
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Complete Wellbeing Intelligence System
            </h2>
            <p className="mt-4 text-zinc-500">
              Everything your school needs for proactive mental health support, from MTSS-based care
              to Supreme Court compliance.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Bell, title: "Early Warning System", desc: "AI-powered risk detection flags at-risk students before crises develop." },
              { icon: BarChart3, title: "Analytics & BI", desc: "Real-time wellbeing dashboards, risk heatmaps, and intervention tracking." },
              { icon: Users, title: "Multi-Tiered Care", desc: "MTSS-based workflows from universal SEL to intensive crisis intervention." },
              { icon: Shield, title: "Compliance Ready", desc: "Supreme Court guideline mapping with audit-ready documentation." }
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-black/5 bg-zinc-50 p-6 hover:shadow-md transition-shadow">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section id="solutions" className="border-t border-black/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              14 Core Modules, One Unified Platform
            </h2>
            <p className="mt-4 text-zinc-500">
              Every aspect of school mental wellbeing, connected and intelligent.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              "Student Management", "Case Management", "SEL Curriculum", "Screening & Assessments",
              "Crisis Management", "Referral Network", "Care Coordination", "Compliance",
              "Analytics & BI", "AI Recommendations", "Appointment Scheduling", "Parent Portal",
              "Student Portal", "Audit & Security"
            ].map((module) => (
              <div key={module} className="rounded-xl border border-black/5 bg-white px-5 py-4 text-sm font-medium shadow-sm hover:border-black/10 transition-colors">
                {module}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/5 bg-black py-24 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Transform School Wellbeing?
          </h2>
          <p className="mt-4 text-zinc-400">
            Join 847 schools across India using Firefly Health for proactive, data-driven mental health support.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-medium text-black hover:bg-zinc-100 transition-all"
          >
            Start Your Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-400">
          <p>&copy; 2026 Firefly Health. Supreme Court aligned school wellbeing platform.</p>
        </div>
      </footer>
    </main>
  );
}