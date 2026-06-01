"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  BookHeart,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LifeBuoy,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  group: "workspace" | "care" | "insights";
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    group: "workspace",
    icon: Home,
    roles: ["ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "FIREFLY_REPRESENTATIVE"]
  },
  {
    href: "/students",
    label: "Students",
    group: "care",
    icon: Users,
    roles: ["ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "PARENT", "STUDENT"]
  },
  {
    href: "/cases",
    label: "Cases",
    group: "care",
    icon: ClipboardList,
    roles: ["ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN", "FIREFLY_SPECIALIST"]
  },
  {
    href: "/sessions",
    label: "Sessions",
    group: "care",
    icon: LifeBuoy,
    roles: ["ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "STUDENT", "PARENT"]
  },
  {
    href: "/reports",
    label: "Reports",
    group: "insights",
    icon: BarChart3,
    roles: ["ADMIN", "COUNSELLOR", "SYSTEM_ADMIN", "FIREFLY_REPRESENTATIVE", "PARENT"]
  },
  {
    href: "/incidents",
    label: "Incidents",
    group: "insights",
    icon: AlertTriangle,
    roles: ["ADMIN", "COUNSELLOR", "TEACHER", "SYSTEM_ADMIN"]
  }
];

const groupMeta = {
  workspace: "Workspace",
  care: "Care Ops",
  insights: "Insights"
} as const;

function SidebarBody({
  role,
  collapsed,
  onToggle,
  onNavigate
}: {
  role: Role;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => item.roles.includes(role));
  const groupedItems = {
    workspace: visibleItems.filter((item) => item.group === "workspace"),
    care: visibleItems.filter((item) => item.group === "care"),
    insights: visibleItems.filter((item) => item.group === "insights")
  };

  return (
    <div className="relative flex h-full flex-col border-r border-black/10 bg-zinc-50 px-3 py-4 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-16 h-24 w-24 rounded-full bg-black/8 blur-2xl" />
        <div className="absolute -right-8 bottom-20 h-20 w-20 rounded-full bg-zinc-400/20 blur-2xl" />
      </div>

      <div className={cn("mb-6 flex items-center", collapsed ? "justify-center" : "justify-between")}> 
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#000000] font-bold text-[#FFFFFF] shadow-lg shadow-black/20">
            <BookHeart className="h-4 w-4" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-[#111111]">Firefly Health</p>
              <p className="text-xs text-[#6F6F6F]">Care Intelligence</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="hidden rounded-lg border border-black/10 p-1 text-[#666666] hover:border-black/25 hover:text-[#111111] md:inline-flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="relative z-10 space-y-5">
        {(Object.keys(groupedItems) as Array<keyof typeof groupedItems>).map((groupKey) => {
          const items = groupedItems[groupKey];

          if (!items.length) {
            return null;
          }

          return (
            <div key={groupKey}>
              {!collapsed ? <p className="mb-2 px-3 text-[11px] uppercase tracking-wide text-[#6F6F6F]">{groupMeta[groupKey]}</p> : null}
              <div className="space-y-1.5">
                {items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex h-11 items-center rounded-xl px-3 text-sm transition-all duration-300",
                        isActive
                          ? "bg-black text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.28)]"
                          : "text-[#4A4A4A] hover:bg-[#F1F1F1] hover:text-[#111111]"
                      )}
                    >
                      {isActive ? <span className="absolute -left-1 h-7 w-1 rounded-r-full bg-[#000000]" /> : null}
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-[#6F6F6F]")} />
                      <AnimatePresence initial={false}>
                        {!collapsed ? (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="ml-3 font-medium"
                          >
                            {item.label}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="relative z-10 mt-auto rounded-xl border border-black/10 bg-[#F5F5F5] p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#111111]">On-call Safety</p>
          <p className="mt-1 text-xs text-[#6F6F6F]">Crisis escalation line active. Response target: under 15 min.</p>
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({
  role,
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile
}: {
  role: Role;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className={cn("hidden md:block", collapsed ? "w-20" : "w-72")}>
        <SidebarBody role={role} collapsed={collapsed} onToggle={onToggleCollapsed} />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/35 md:hidden"
              aria-label="Close sidebar"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            >
              <SidebarBody role={role} collapsed={false} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
