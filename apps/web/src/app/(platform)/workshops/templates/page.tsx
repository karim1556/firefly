"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Filter, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { WorkshopTemplate } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  BULLYING_PREVENTION: "Bullying Prevention",
  CAREER_GUIDANCE: "Career Guidance",
  MENTAL_HEALTH_AWARENESS: "Mental Health Awareness",
  DIGITAL_SAFETY: "Digital Safety",
  STRESS_MANAGEMENT: "Stress Management",
  PARENT_AWARENESS: "Parent Awareness",
  TEACHER_WELLNESS: "Teacher Wellness",
};

const CATEGORIES = ["BULLYING_PREVENTION","CAREER_GUIDANCE","MENTAL_HEALTH_AWARENESS","DIGITAL_SAFETY","STRESS_MANAGEMENT","PARENT_AWARENESS","TEACHER_WELLNESS"];

export default function WorkshopTemplatesPage() {
  const { authFetch } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["workshop-templates", selectedCategory],
    queryFn: () => authFetch<{ data: WorkshopTemplate[] }>(
      `/workshops/templates${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`
    ),
  });

  const templates = (data?.data ?? []).filter(t => {
    if (search) return t.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop Template Library"
        description="Browse reusable workshop content for school wellbeing programs."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-56 shrink-0">
          <Card>
            <CardContent className="p-4">
<div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Categories</span>
              </div>
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {categoryLabel[cat]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search workshop templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
            </div>
          ) : templates.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((tpl) => (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{tpl.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{tpl.durationMins} mins</span>
                        </div>
                      </div>
                      <Badge variant="default">{categoryLabel[tpl.category]}</Badge>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">{tpl.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Audience</p>
                      <Badge variant="default" className="text-xs">{tpl.audience}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Materials</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tpl.materials.slice(0, 3).map((mat, i) => (
                          <Badge key={i} variant="info" className="text-xs font-normal">{mat}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{tpl.materials.length} materials</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 text-xs">Preview</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No templates found" description="Create your first workshop template." />
          )}
        </div>
      </div>
    </div>
  );
}
