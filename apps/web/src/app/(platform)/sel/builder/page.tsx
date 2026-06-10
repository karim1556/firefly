"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, GraduationCap, Save, Send } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { SEL_CATEGORIES } from "@/lib/types";
import type { SelLessonTemplate } from "@/lib/types";
import { useRouter } from "next/navigation";

const categoryLabel: Record<string, string> = {
  SELF_AWARENESS: "Self Awareness",
  EMOTIONAL_REGULATION: "Emotional Regulation",
  EMPATHY: "Empathy",
  COMMUNICATION: "Communication",
  LEADERSHIP: "Leadership",
  CONFLICT_RESOLUTION: "Conflict Resolution",
  RESILIENCE: "Resilience",
};

export default function SELLessonBuilderPage() {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    grade: "",
    topic: "",
    category: "",
    learningObjectives: "",
    activities: "",
    reflectionQuestions: "",
    durationMins: "45",
    templateId: "",
  });
  const [saving, setSaving] = useState(false);

  const { data: templatesData } = useQuery({
    queryKey: ["sel-templates"],
    queryFn: () => authFetch<{ data: SelLessonTemplate[] }>("/sel/templates"),
  });

  const templates = templatesData?.data ?? [];

  const handleTemplateSelect = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      setForm({
        ...form,
        templateId,
        title: tpl.title,
        grade: tpl.grade,
        category: tpl.category,
        learningObjectives: tpl.learningObjectives.join("\n"),
        activities: tpl.activities.join("\n"),
        reflectionQuestions: tpl.reflectionQuestions.join("\n"),
        durationMins: String(tpl.durationMins),
      });
    }
  };

  const handleSave = async (asStatus: "DRAFT" | "PENDING_APPROVAL") => {
    setSaving(true);
    try {
      await authFetch("/sel/lessons", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          learningObjectives: form.learningObjectives.split("\n").filter(Boolean),
          activities: form.activities.split("\n").filter(Boolean),
          reflectionQuestions: form.reflectionQuestions.split("\n").filter(Boolean),
          durationMins: parseInt(form.durationMins),
          status: asStatus,
        }),
      });
      router.push("/sel");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="SEL Lesson Builder"
        description="Create structured SEL lessons with learning objectives, activities, and reflection questions."
        actions={
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.push("/sel")}>
            <ArrowLeft className="h-4 w-4" />
            Back to SEL
          </Button>
        }
      />

      {/* Template Selection */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Start from Template (optional)</span>
          </div>
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

      {/* Lesson Form */}
      <Card>
        <CardContent className="p-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Lesson Title *</label>
              <Input
                placeholder="e.g., Managing Exam Anxiety"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Grade *</label>
              <Select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                <option value="">Select grade</option>
                {["5","6","7","8","9","10"].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Topic *</label>
              <Input
                placeholder="e.g., Emotional Regulation"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category *</label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {SEL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{categoryLabel[cat]}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Duration (minutes)</label>
            <div className="flex gap-2">
              {["30","45","60","90"].map(d => (
                <Button
                  key={d}
                  type="button"
                  variant={form.durationMins === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, durationMins: d })}
                >
                  {d} min
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Learning Objectives (one per line)</label>
            <Textarea
              placeholder={"Identify emotional triggers\nRecognize anxiety symptoms\nApply coping strategies"}
              value={form.learningObjectives}
              onChange={(e) => setForm({ ...form, learningObjectives: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Activities (one per line)</label>
            <Textarea
              placeholder={"Deep breathing exercises\nProgressive muscle relaxation\nGrounding techniques"}
              value={form.activities}
              onChange={(e) => setForm({ ...form, activities: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Reflection Questions (one per line)</label>
            <Textarea
              placeholder={"What helps you feel calmer before a test?\nWhere do you feel anxiety in your body?\nWhat technique will you use?"}
              value={form.reflectionQuestions}
              onChange={(e) => setForm({ ...form, reflectionQuestions: e.target.value })}
              rows={4}
            />
          </div>

          {/* Preview */}
          {form.title && (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">Lesson Preview</span>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">{form.title || "Untitled Lesson"}</p>
                  <div className="flex flex-wrap gap-2">
                    {form.grade && <Badge variant="default">Grade {form.grade}</Badge>}
                    {form.category && <Badge variant="default">{categoryLabel[form.category] || form.category}</Badge>}
                    {form.durationMins && <Badge variant="default">{form.durationMins} mins</Badge>}
                  </div>
                </div>
                {form.learningObjectives && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500">Objectives:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.learningObjectives.split("\n").filter(Boolean).map((obj, i) => (
                        <Badge key={i} variant="info" className="text-xs">{obj}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => handleSave("DRAFT")}
              disabled={saving || !form.title}
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => handleSave("PENDING_APPROVAL")}
              disabled={saving || !form.title || !form.grade || !form.category}
            >
              <Send className="h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
