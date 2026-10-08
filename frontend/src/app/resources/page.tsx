"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FolderArchive,
  Search,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import {
  VERIFIED_RESOURCES,
  RESOURCE_CATEGORIES,
  type VerifiedResource,
} from "@/lib/resources/resources-data";
import { trackResourceClicked } from "@/lib/analytics/tracker";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (initialCategory === "government" || initialCategory === "civil-services") {
      setSelectedCategory("civil-services");
    } else if (initialCategory) {
      const match = RESOURCE_CATEGORIES.find((c) => c.id === initialCategory);
      if (match) setSelectedCategory(match.id);
    }
  }, [initialCategory]);

  const filteredResources = useMemo(() => {
    return VERIFIED_RESOURCES.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleResourceClick = (resource: VerifiedResource) => {
    trackResourceClicked(resource.id, resource.category, resource.title);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-[#0B0E12]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-6xl py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                Authoritative Curriculum &amp; Documentation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400">
                100% Verified
              </span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Verified Learning Resources Hub
            </h1>
            <p className="text-xs text-muted-foreground max-w-xl">
              Curated official documentation, open university courseware, and governmental portals aligned with Career Compass roadmap milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border/80 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Back to Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-6 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, platform, provider, or topic (e.g., Python, UPSC, Machine Learning)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resources Count */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>
            Showing {filteredResources.length} of {VERIFIED_RESOURCES.length} verified sources
          </span>
          <span className="hidden sm:inline">
            Direct authoritative links · No paywalls or affiliate links
          </span>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border/70 bg-card hover:border-border transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-primary font-semibold truncate max-w-[180px]">
                    {item.provider}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-[#141920] border border-border/70 text-[10px] font-mono text-muted-foreground">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400">
                      {item.cost}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-foreground leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-secondary">
                  {item.badge}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleResourceClick(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/25 text-xs font-mono font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="p-12 rounded-2xl border border-border bg-card text-center space-y-3">
            <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">
              No matching resources found
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
}
