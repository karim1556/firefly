"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, ChevronRight, Clock, Eye, Tag, Plus } from "lucide-react";
import { PageHeader } from "@/components/modules/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { KnowledgeBaseArticle, PolicyCategory } from "@/lib/types";

interface ArticleResponse {
  data: KnowledgeBaseArticle[];
}

export default function KnowledgeBasePage() {
  const { authFetch } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const query = useQuery({
    queryKey: ["compliance", "knowledge-base", search, category],
    queryFn: () =>
      authFetch<ArticleResponse>(
        `/compliance/knowledge-base${search || category ? `?${new URLSearchParams({ search, category }).toString()}` : ""}`
      )
  });

  const data = query.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Resources, guides, and informational articles for wellbeing operations."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/compliance">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/compliance/knowledge-base/new">
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              <option value="STUDENT_WELLBEING">Student Wellbeing</option>
              <option value="SAFEGUARDING">Safeguarding</option>
              <option value="CRISIS_MANAGEMENT">Crisis Management</option>
              <option value="REFERRAL_GUIDELINES">Referral Guidelines</option>
              <option value="PARENT_COMMUNICATION">Parent Communication</option>
              <option value="SEL_FRAMEWORKS">SEL Frameworks</option>
              <option value="SCHOOL_PROCEDURES">School Procedures</option>
              <option value="STAFF_HANDBOOK">Staff Handbook</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setCategory(""); }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      {query.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : data.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-teal-600" />
                  </div>
                  {article.isPublished ? (
                    <Badge variant="success" className="text-xs">Published</Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">Draft</Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{article.summary}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-0.5 text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-zinc-400 px-1">+{article.tags.length - 3}</span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article._count.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(article.updatedAt)}
                  </span>
                  <Badge variant="default" className="text-xs ml-auto">
                    {article.category}
                  </Badge>
                </div>

                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={`/compliance/knowledge-base/${article.id}`}>
                    Read Article <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No articles found"
          description="Knowledge base articles will appear here."
        />
      )}
    </div>
  );
}
