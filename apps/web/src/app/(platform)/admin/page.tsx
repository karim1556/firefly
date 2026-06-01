"use client";

import { useState } from "react";
import { Shield, Users, Building2, Key, Bell, Monitor } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const settingsSections = [
  {
    id: "general",
    icon: Building2,
    title: "School Settings",
    desc: "Manage school profile, branding, and system preferences",
    fields: [
      { label: "School Name", value: "Firefly Public School" },
      { label: "Board", value: "CBSE" },
      { label: "Grades", value: "5-10" },
      { label: "Total Students", value: "847" },
    ]
  },
  {
    id: "roles",
    icon: Users,
    title: "Role Management",
    desc: "Configure RBAC permissions and user roles",
    roles: ["Super Admin", "School Admin", "Principal", "Vice Principal", "Counsellor", "Teacher", "Class Teacher", "Parent", "Student", "SWT Team", "SEL Team", "Clinical Specialist", "Career Specialist", "External Partner"]
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Compliance",
    desc: "Encryption, session policies, and audit controls",
    policies: [
      { name: "AES-256 Encryption at Rest", status: "active" },
      { name: "TLS 1.2+ Required", status: "active" },
      { name: "JWT Session Timeout", status: "active", detail: "15 min" },
      { name: "Device Tracking", status: "active" },
      { name: "IP Monitoring", status: "active" },
      { name: "Consent-Based Access", status: "active" },
    ]
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notification Channels",
    desc: "Configure email, SMS, push, and in-app notifications",
    channels: [
      { name: "Email", status: "active" },
      { name: "SMS", status: "active" },
      { name: "Push Notifications", status: "active" },
      { name: "In-App", status: "active" },
    ]
  }
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Settings" description="System configuration, RBAC, security policies, and infrastructure management." />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-3 space-y-1">
            {settingsSections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-left ${activeSection === section.id ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
                <section.icon className="h-4 w-4" />
                {section.title}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeSection === "general" && (
            <Card>
              <CardHeader><CardTitle>School Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {settingsSections.find(s => s.id === "general")?.fields?.map(field => (
                  <div key={field.label} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">{field.label}</p>
                    <p className="text-sm font-semibold text-zinc-900">{field.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "roles" && (
            <Card>
              <CardHeader><CardTitle>RBAC Role Configuration ({settingsSections.find(s => s.id === "roles")?.roles?.length} roles)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {settingsSections.find(s => s.id === "roles")?.roles?.map(role => (
                    <div key={role} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                      <Key className="h-4 w-4 text-zinc-400" />
                      <p className="text-sm font-medium text-zinc-900">{role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader><CardTitle>Security Policies</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {settingsSections.find(s => s.id === "security")?.policies?.map(policy => (
                  <div key={policy.name} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{policy.name}</p>
                      {policy.detail && <p className="text-xs text-zinc-500">{policy.detail}</p>}
                    </div>
                    <Badge variant="success">{policy.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader><CardTitle>Notification Channels</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {settingsSections.find(s => s.id === "notifications")?.channels?.map(channel => (
                  <div key={channel.name} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm font-medium text-zinc-900">{channel.name}</p>
                    <Badge variant="success">{channel.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Infrastructure Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Frontend", value: "Vercel / ECS" }, { label: "Backend", value: "ECS / Kubernetes" },
                  { label: "Database", value: "AWS RDS PostgreSQL" }, { label: "Cache", value: "Redis Cluster" },
                  { label: "CDN", value: "CloudFront" }, { label: "Storage", value: "S3" },
                  { label: "CI/CD", value: "GitHub Actions" }, { label: "Monitoring", value: "Prometheus + Grafana" },
                ].map(item => (
                  <div key={item.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-xs text-zinc-500">{item.label}</p>
                    <p className="text-sm font-semibold text-zinc-900 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}