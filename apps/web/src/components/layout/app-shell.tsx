"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Role } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-zinc-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-neutral-400/12 blur-3xl" />
      </div>

      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="relative z-10 flex min-h-screen flex-1 min-w-0 flex-col">
        <Navbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-[1500px] flex-1 p-4 md:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
