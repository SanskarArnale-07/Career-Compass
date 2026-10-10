"use client";

import Link from "next/link";
import { Compass, ArrowRight, Sparkles } from "lucide-react";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerIcon } from "@/lib/career-icons";
import { getCareerSlug } from "@/lib/career-details";
import type { CareerMatch } from "@/lib/types/assessment";

interface TopCareerDirectionsSectionProps {
  matches: CareerMatch[];
  limit?: number; // 3 to 5 directions
  onExploreAll?: () => void;
  exploreAllHref?: string;
  minimal?: boolean;
}

export function TopCareerDirectionsSection({
  matches,
  limit = 4,
  onExploreAll,
  exploreAllHref = "/careers",
  minimal = false,
}: TopCareerDirectionsSectionProps) {
  // When minimal, strictly enforce top 3 careers; otherwise 3 to 5
  const targetCount = minimal ? Math.min(limit, 3) : Math.min(Math.max(limit, 3), 5);
  const displayedMatches = matches.slice(0, targetCount);

  if (displayedMatches.length === 0) {
    return null;
  }

  if (minimal) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Careers to Explore
              </h2>
              <p className="text-xs text-muted-foreground">
                The 3 most relevant career paths based on your assessment results
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-mono font-medium text-primary">
              Top 3 Matches
            </span>
          </div>
        </div>

        {/* Compact 3-Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {displayedMatches.map((match) => {
            const intel = getCareerIntelligence(match.career_name);
            const slug = intel?.slug || getCareerSlug(match.career_name);
            const IconComp = getCareerIcon(slug || intel?.slug || match.career_name);
            const shortReason =
              match.explanation ||
              intel?.tagline ||
              "Direct cognitive synergy with your dominant analytical and execution strengths.";

            return (
              <Link
                key={match.career_name}
                href={`/career/${slug}`}
                className="group p-4 rounded-xl border border-border/70 bg-[#0B0E12]/80 hover:border-primary/50 hover:bg-[#10141A] transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 shrink-0">
                      {Math.round(match.match_percentage)}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                      {intel?.title || match.career_name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1.5">
                      {shortReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-primary pt-1 border-t border-border/40">
                  <span>Explore Career</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ONE clear action: Explore All Careers */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
          <span className="text-[11px] text-muted-foreground font-mono">
            Showing top {displayedMatches.length} recommended careers
          </span>
          {onExploreAll ? (
            <button
              onClick={onExploreAll}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              <span>Explore All Careers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              href={exploreAllHref}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <span>Explore All Careers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Top Career Directions
            </h2>
            <p className="text-xs text-muted-foreground">
              The {displayedMatches.length} highest-alignment pathways for your cognitive strengths
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-mono font-medium text-primary">
            Top Recommendations
          </span>
        </div>
      </div>

      {/* Career Directions Grid — High signal, no nested role overload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {displayedMatches.map((match, idx) => {
          const intel = getCareerIntelligence(match.career_name);
          const slug = intel?.slug || getCareerSlug(match.career_name);
          const hierarchy = getCareerHierarchy(slug);
          const IconComp = getCareerIcon(slug || intel?.slug || match.career_name);
          const isTop = idx === 0;

          // Short, 1-line interpretation avoiding walls of text
          const shortReason =
            match.explanation ||
            intel?.tagline ||
            "Direct cognitive synergy with your dominant analytical and execution strengths.";

          return (
            <div
              key={match.career_name}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                isTop
                  ? "border-primary/40 bg-primary/5 shadow-xs shadow-primary/10"
                  : "border-border/70 bg-[#0B0E12]/80 hover:border-border"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-[#141920] border border-border/80 flex items-center justify-center text-primary shrink-0">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {intel?.title || match.career_name}
                        </h3>
                        {isTop && (
                          <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-mono font-semibold shrink-0">
                            #1 Fit
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
                  {shortReason}
                </p>
              </div>

              {/* Action Link */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Pathway Exploration
                </span>
                <Link
                  href={`/career/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>Explore Pathway</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progressive Disclosure Link */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
        <span className="text-[11px] text-muted-foreground font-mono">
          Showing top {displayedMatches.length} recommended pathways
        </span>
        {onExploreAll ? (
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline cursor-pointer font-medium"
          >
            <span>View All Career Matches &amp; Alternatives</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <Link
            href={exploreAllHref}
            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline font-medium"
          >
            <span>View All Career Matches &amp; Alternatives</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
