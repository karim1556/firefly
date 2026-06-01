"use client";

import { useState } from "react";
import { Search, Shield, UserCheck, FileText, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

const MOCK_AUDIT_LOGS = [
  { id: "audit-1", action: "Case Created", actor: "Rebecca Thompson", target: "Case #124", category: "case", severity: "info", details: "New case opened for Emily Clarke (Tier 3)", timestamp: Date.now() - 900000, ipAddress: "192.168.1.100" },
  { id: "audit-2", action: "Risk Level Updated", actor: "AI Engine", target: "Student Jane Doe", category: "student", severity: "warning", details: "Risk score escalated from 62 to 84", timestamp: Date.now() - 1800000, ipAddress: "internal" },
  { id: "audit-3", action: "User Login", actor: "admin@firefly.local", target: "Admin Console", category: "auth", severity: "info", details: "Successful login from new device", timestamp: Date.now() - 2700000, ipAddress: "203.0.113.42" },
  { id: "audit-4", action: "Permission Change", actor: "System Admin", target: "RBAC Role: Counsellor", category: "config", severity: "warning", details: "Added case.escalate permission", timestamp: Date.now() - 7200000, ipAddress: "192.168.1.1" },
  { id: "audit-5", action: "Crisis Activated", actor: "Rebecca Thompson", target: "Crisis Protocol", category: "crisis", severity: "critical", details: "Crisis escalation for self-harm ideation", timestamp: Date.now() - 3600000, ipAddress: "192.168.1.100" },
  { id: "audit-6", action: "Consent Updated", actor: "Priya Parent", target: "Consent Form", category: "config", severity: "info", details: "Parent consent granted", timestamp: Date.now() - 10800000, ipAddress: "10.0.0.15" },
  { id: "audit-7", action: "Referral Created", actor: "Mr. David Chen", target: "Referral - Oliver Wang", category: "case", severity: "info", details: "Referred for anxiety concerns", timestamp: Date.now() - 14400000, ipAddress: "192.168.1.50" },
];

const severityColors: Record<string, string> = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

const categoryIcon = (cat: string) => {
  switch (cat) {
    case "case": return <FileText className="h-4 w-4" />;
    case "auth": return <UserCheck className="h-4 w-4" />;
    case "student": return <AlertCircle className="h-4 w-4" />;
    case "config": return <Shield className="h-4 w-4" />;
    case "crisis": return <AlertCircle className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = MOCK_AUDIT_LOGS.filter(log => {
    if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.actor.toLowerCase().includes(q) || log.target.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Immutable audit trail with IP tracking, user attribution, and event categorization." />
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input placeholder="Search events..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="case">Case</option><option value="auth">Auth</option><option value="student">Student</option>
              <option value="config">Configuration</option><option value="crisis">Crisis</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map(log => (
              <div key={log.id} className="rounded-xl border border-zinc-100 bg-white p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 grid h-8 w-8 place-items-center rounded-lg ${severityColors[log.severity]}`}>{categoryIcon(log.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{log.action}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{log.target}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${severityColors[log.severity]}`}>{log.severity}</span>
                        <Badge variant="info">{log.category}</Badge>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{log.details}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span>Actor: {log.actor}</span><span>IP: {log.ipAddress}</span><span>{formatDate(new Date(log.timestamp).toISOString())}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}