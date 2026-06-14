"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { WORKSHOP_CATEGORIES } from "@/lib/types";
import type { Facilitator, WorkshopTemplate } from "@/lib/types";
import { useRouter } from "next/navigation";

const categoryLabel: Record<string, string> = {
  BULLYING_PREVENTION: "Bullying Prevention",
  CAREER_GUIDANCE: "Career Guidance",
  MENTAL_HEALTH_AWARENESS: "Mental Health Awareness",
  DIGITAL_SAFETY: "Digital Safety",
  STRESS_MANAGEMENT: "Stress Management",
  PARENT_AWARENESS: "Parent Awareness",
  TEACHER_WELLNESS: "Teacher Wellness",
};

export default function CreateWorkshopPage() {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    audience: "",
    venue: "",
    date: "",
    time: "10:00",
    durationMins: "90",
    facilitatorId: "",
    templateId: "",
    materials: "",
  });
  const [saving, setSaving] = useState(false);

  const { data: facilitatorsData } = useQuery({
    queryKey: ["facilitators"],
    queryFn: () => authFetch<{ data: Facilitator[] }>("/facilitators"),
  });

  const { data: templatesData } = useQuery({
    queryKey: ["workshop-templates"],
    queryFn: () => authFetch<{ data: WorkshopTemplate[] }>("/workshops/templates"),
  });

  const facilitators = facilitatorsData?.data ?? [];
  const templates = templatesData?.data ?? [];

  const handleTemplateSelect = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setForm({
        ...form,
        templateId,
        title: tpl.title,
        description: tpl.description,
        category: tpl.category,
        audience: tpl.audience,
        durationMins: String(tpl.durationMins),
          materials: tpl.materials.join(", "),
      });
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await authFetch("/workshops", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          durationMins: parseInt(form.durationMins),
          date: `${form.date}T${form.time}:00.000Z`,
        }),
      });
      router.push("/workshops");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Create Workshop"
        description="Schedule a new workshop for your school community."
        actions={
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.push("/workshops")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Workshops
          </Button>
        }
      />

      {/* Template Selection */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="text-sm font-semibold text-slate-700">Start from Template (optional)</div>
          <div className="flex flex-wrap gap-2">
            {templates.map(tpl => (
              <Button
                key={tpl.id}
                variant={form.templateId === tpl.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleTemplateSelect(tpl.id)}
                className="text-xs"
              >
                {tpl.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workshop Form */}
      <Card>
        <CardContent className="p-5 space-y-5">
          <div className="grid gap-4 grid-cols-2">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Workshop Title *</label>
              <Input
                placeholder="e.g., Stress Management Workshop"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category *</label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {WORKSHOP_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{categoryLabel[cat]}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Audience *</label>
              <Input
                placeholder="e.g., Grade 10 Students"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea
                placeholder="Describe the workshop objectives and content..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date *</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Time *</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Venue *</label>
              <Input
                placeholder="e.g., Main Hall"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Duration</label>
              <div className="flex gap-2">
                {["60","90","120","180"].map(d => (
                  <Button
                    key={d}
                    type="button"
                    variant={form.durationMins === d ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setForm({ ...form, durationMins: d })}
                  >
                    {d}m
                  </Button>
                ))}
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Facilitator *</label>
              <Select
                value={form.facilitatorId}
                onChange={(e) => setForm({ ...form, facilitatorId: e.target.value })}
              >
                <option value="">Select facilitator</option>
                {facilitators.map(f => (
                  <option key={f.id} value={f.id}>{f.fullName} ({f.type.replace("_"," ")})</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleCreate}
              disabled={saving || !form.title || !form.category || !form.audience || !form.venue || !form.date || !form.facilitatorId}
            >
              <Plus className="h-4 w-4" />
              Create Workshop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
