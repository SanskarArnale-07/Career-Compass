"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { getCareerIcon } from "@/lib/career-icons";
import { getCareerHierarchy, CAREER_DOMAINS } from "@/lib/career-hierarchy";
import type { CareerIntelligence } from "@/lib/career-intelligence";

interface CareersDirectoryFilterProps {
  careers: CareerIntelligence[];
}

export function CareersDirectoryFilter({ careers }: CareersDirectoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const hierarchy = getCareerHierarchy(c.slug);
      const domainId = hierarchy?.domain.id;

      const matchesDomain =
        selectedDomain === "all" || domainId === selectedDomain;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        hierarchy?.path.name.toLowerCase().includes(q) ||
        hierarchy?.sampleRoles.some((r) => r.toLowerCase().includes(q));

      return matchesDomain && matchesSearch;
    });
  }, [careers, searchQuery, selectedDomain]);

  return (
    <div className="space-y-6">
      {/* ── Secondary Convenience: Search & Domain Filter Bar ─────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12100E] border border-border/70">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specific career, domain, or role..."
            className="w-full bg-[#181512] border border-border/80 rounded-lg pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDomain("all")}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors shrink-0 ${
              selectedDomain === "all"
                ? "bg-primary text-white font-semibold"
                : "bg-[#181512] text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            All
          </button>
          {CAREER_DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors shrink-0 ${
                selectedDomain === d.id
                  ? "bg-primary text-white font-semibold"
                  : "bg-[#181512] text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              {d.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Career Cards Grid ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          {selectedDomain === "all"
            ? "All Career Paths"
            : CAREER_DOMAINS.find((d) => d.id === selectedDomain)?.name}
        </h2>
        <span className="text-xs font-mono text-muted-foreground/60">
          Showing {filteredCareers.length} of {careers.length}
        </span>
      </div>

      {filteredCareers.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-border/60 bg-[#12100E] p-6">
          <p className="text-sm text-muted-foreground mb-3">
            No career paths found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
            }}
            className="text-xs font-mono text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCareers.map((career) => {
            const IconComponent = getCareerIcon(career.careerName);
            const hierarchy = getCareerHierarchy(career.slug);
            const domain = hierarchy?.domain.name || career.category;

            return (
              <Link
                key={career.slug}
                href={`/career/${career.slug}`}
                className="group flex flex-col justify-between gap-3 p-5 rounded-xl bg-card border border-border/70 hover:border-primary/40 hover:bg-card-hover transition-all duration-200"
              >
                <div>
                  {/* Icon + Domain */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                      <IconComponent className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-[#161412] border border-border/50 rounded-full px-2.5 py-0.5 truncate max-w-[140px]">
                      {domain}
                    </span>
                  </div>

                  {/* Title + tagline */}
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {career.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-light">
                    {career.tagline}
                  </p>
                </div>

                {/* Subroles & CTA */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      {hierarchy?.sampleRoles?.length ?? 4} roles
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                      View roadmap <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
