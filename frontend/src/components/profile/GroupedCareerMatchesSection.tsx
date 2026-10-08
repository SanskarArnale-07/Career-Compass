"use client";

import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerIcon } from "@/lib/career-icons";
import { getCareerSlug } from "@/lib/career-details";
import type { CareerMatch } from "@/lib/types/assessment";

interface GroupedCareerMatchesSectionProps {
  strongMatches: CareerMatch[];
  explorationMatches: CareerMatch[];
  allMatches: CareerMatch[];
}

export function GroupedCareerMatchesSection({
  strongMatches,
  explorationMatches,
  allMatches,
}: GroupedCareerMatchesSectionProps) {
  // If strongMatches is empty, fallback to top items from allMatches
  const primaryTier = strongMatches.length > 0 ? strongMatches : allMatches.slice(0, 3);
  const secondaryTier = strongMatches.length > 0 ? explorationMatches : allMatches.slice(3, 6);

  if (primaryTier.length === 0 && secondaryTier.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Career Trajectories Grouped by Relevance
            </h2>
            <p className="text-xs text-muted-foreground">
              Personalized matches ranked by psychometric alignment and skill transferability
            </p>
          </div>
        </div>

        <Link
          href="/results"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary-hover font-semibold transition-colors"
        >
          <span>View Scoring Breakdown</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tier 1: Primary & High-Alignment Trajectories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-primary">
            Primary & High-Fit Pathways
          </h3>
          <span className="text-[11px] text-muted-foreground font-mono">
            ({primaryTier.length} trajectories)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {primaryTier.map((match, idx) => {
            const intel = getCareerIntelligence(match.career_name);
            const slug = intel?.slug || getCareerSlug(match.career_name);
            const hierarchy = getCareerHierarchy(slug);
            const IconComp = getCareerIcon(slug || intel?.slug || match.career_name);
            const isTop = idx === 0;

            return (
              <div
                key={match.career_name}
                className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                  isTop
                    ? "border-primary/40 bg-primary/5 shadow-xs shadow-primary/10"
                    : "border-border/70 bg-[#0B0E12]/80 hover:border-border"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-[#141920] border border-border/80 flex items-center justify-center text-primary shrink-0">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {intel?.title || match.career_name}
                          </h4>
                          {isTop && (
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-mono font-semibold">
                              Top Pick
                            </span>
                          )}
                        </div>
                        {hierarchy && (
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            {hierarchy.domain.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 shrink-0">
                      {Math.round(match.match_percentage)}% Match
                    </span>
                  </div>

                  <p className="text-xs text-secondary-foreground leading-relaxed line-clamp-2">
                    {match.explanation || intel?.tagline || "High-synergy path leveraging your cognitive strengths."}
                  </p>

                  {/* Top trait chips */}
                  {match.top_traits && match.top_traits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {match.top_traits.slice(0, 3).map((trait) => (
                        <span
                          key={trait}
                          className="px-2 py-0.5 rounded-md bg-[#141920] border border-border/60 text-[10px] font-mono text-slate-300"
                        >
                          #{trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  {hierarchy ? (
                    <Link
                      href={`/career-map?domain=${hierarchy.domain.id}&path=${hierarchy.path.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GitBranch className="h-3 w-3" />
                      <span>Explore Tree</span>
                    </Link>
                  ) : <span />}

                  <Link
                    href={`/career/${slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Adjacent & Growth Directions */}
      {secondaryTier.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-secondary">
              Adjacent & Growth Directions
            </h3>
            <span className="text-[11px] text-muted-foreground font-mono">
              ({secondaryTier.length} alternative pathways)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {secondaryTier.map((match) => {
              const intel = getCareerIntelligence(match.career_name);
              const slug = intel?.slug || getCareerSlug(match.career_name);
              const IconComp = getCareerIcon(slug || intel?.slug || match.career_name);

              return (
                <div
                  key={match.career_name}
                  className="p-3.5 rounded-xl border border-border/60 bg-[#0B0E12]/60 hover:border-border transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-[#141920] border border-border/70 flex items-center justify-center text-secondary shrink-0">
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {intel?.title || match.career_name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Complementary skill growth
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/25 text-[11px] font-mono font-semibold text-secondary">
                      {Math.round(match.match_percentage)}%
                    </span>
                    <Link
                      href={`/career/${slug}`}
                      className="p-1 rounded-md text-muted-foreground hover:text-primary transition-colors"
                      title="View Career"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
