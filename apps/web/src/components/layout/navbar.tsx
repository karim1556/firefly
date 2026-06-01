"use client";

import { useMemo, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  COUNSELLOR: "Counsellor",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
  FIREFLY_REPRESENTATIVE: "Firefly Rep",
  FIREFLY_SPECIALIST: "Specialist",
  SYSTEM_ADMIN: "System Admin"
};

export function Navbar({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = useMemo(() => {
    if (!user?.fullName) {
      return "FF";
    }

    return user.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.fullName]);

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-zinc-50 px-4 py-3 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={onOpenMobileSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative flex-1 min-w-0 max-w-2xl hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6F6F]" />
          <Input
            placeholder="Search students, risk flags, sessions, incidents..."
            className="h-11 border-[#D4D4D4] bg-[#FFFFFF] pl-9 pr-14"
            aria-label="Search records"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-[#D4D4D4] bg-[#F7F7F7] px-2 py-0.5 text-[10px] font-semibold text-[#6F6F6F]">
            CMD K
          </span>
        </div>
        
        <div className="flex-1 md:hidden" />

        <div className="hidden items-center gap-2 rounded-xl border border-[#D4D4D4] bg-[#FFFFFF] px-3 py-2 lg:flex">
          <ShieldCheck className="h-4 w-4 text-[#111111]" />
          <Badge variant="info">{roleLabels[user?.role ?? "ADMIN"]}</Badge>
        </div>

        <Button variant="outline" size="sm" className="hidden lg:inline-flex">
          <Sparkles className="mr-1.5 h-4 w-4" />
          Quick Action
        </Button>

        <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
        </Button>

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#D4D4D4] bg-[#FFFFFF] px-3 py-1.5 text-left transition hover:border-[#000000]"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#000000] text-xs font-bold text-[#FFFFFF]">
              {initials}
            </div>
            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-medium text-[#111111]">{user?.fullName ?? "Guest"}</p>
              <p className="truncate text-xs text-[#6F6F6F]">{user?.email ?? "Not signed in"}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#6F6F6F]" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#D4D4D4] bg-[#FFFFFF] p-1.5 shadow-xl">
              <div className="mb-1 rounded-lg border border-[#E4E4E4] bg-[#F8F8F8] px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-[#6F6F6F]">Workspace</p>
                <p className="text-sm font-semibold text-[#111111]">Live</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#111111] hover:bg-[#F3F3F3]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
