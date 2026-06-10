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
import type { SelLessonTemplate } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  SELF_AWARENESS: "Self Awareness",
  EMOTIONAL_REGULATION: "Emotional Regulation",
  EMPATHY: "Empathy",
  COMMUNICATION: "Communication",
  LEADERSHIP: "Leadership",
  CONFLICT_RESOLUTION: "Conflict Resolution",
  RESILIENCE: "Resilience",
};

const CATEGORIES = ["SELF_AWARENESS","EMOTIONAL_REGULATION","EMPATHY","COMMUNICATION","LEADERSHIP","CONFLICT_RESOLUTION","RESILIENCE"];

export default function SELCurriculumPage() {
  const { authFetch } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["sel-templates", selectedCategory, gradeFilter],
    queryFn: () => authFetch<{ data: SelLessonTemplate[] }>(
      `/sel/templates${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`
    ),
  });

  const templates = (data?.data ?? []).filter(t => {
    if (search) return t.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEL Curriculum Repository"
        description="Browse and manage SEL lesson templates across all grades and categories."
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
          {/* Search and Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {["all","5","6","7","8","9","10"].map(g => (
                <Button key={g} variant={gradeFilter === g ? "default" : "outline"} size="sm" onClick={() => setGradeFilter(g)}>
                  {g === "all" ? "All Grades" : `Grade ${g}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
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
                          <span>Grade {tpl.grade}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{tpl.durationMins} mins</span>
                        </div>
                      </div>
                      <Badge variant="default">{categoryLabel[tpl.category]}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Learning Objectives</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tpl.learningObjectives.slice(0, 3).map((obj, i) => (
                          <Badge key={i} variant="default" className="text-xs font-normal">{obj}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Activities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tpl.activities.slice(0, 2).map((act, i) => (
                          <Badge key={i} variant="info" className="text-xs font-normal">{act}</Badge>
                        ))}
 </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{tpl.activities.length} activities · {tpl.reflectionQuestions.length} reflections</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 text-xs">View</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs">Duplicate</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No templates found"
              description={search ? "Try a different search term." : "Create your first SEL lesson template to build your curriculum."}
            />
          )}
        </div>
      </div>
    </div>
  );
}
