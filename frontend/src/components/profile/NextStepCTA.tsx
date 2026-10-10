"use client";

import Link from "next/link";
import { Compass, ArrowRight, Map, ChevronDown, Sparkles } from "lucide-react";

interface NextStepCTAProps {
  exploreMatchesHref?: string;
  onExploreMatches?: () => void;
  roadmapHref?: string;
  activeCareerTitle?: string;
  onToggleDeepDive?: () => void;
  isDeepDiveOpen?: boolean;
  minimal?: boolean;
}

export function NextStepCTA({
  exploreMatchesHref = "/results",
  onExploreMatches,
  roadmapHref = "/dashboard",
  activeCareerTitle,
  onToggleDeepDive,
  isDeepDiveOpen = false,
  minimal = false,
}: NextStepCTAProps) {
  if (minimal) {
    return (
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-primary/5">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[11px] font-mono font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              <span>Next Step</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Ready to Explore Your Career Matches?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Dive into full match reasoning, stream recommendations, and required skills to find your ideal career path.
            </p>
          </div>

          <div className="shrink-0">
            {onExploreMatches ? (
              <button
                onClick={onExploreMatches}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-center group cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Your Career Matches</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <Link
                href={exploreMatchesHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-center group cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Your Career Matches</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 relative overflow-hidden shadow-lg shadow-primary/5">
      {/* Ambient radial blur highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[11px] font-mono font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Recommended Next Step</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Take Your Next Step
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Examine your full career trajectory matches, review course recommendations, and compare specialization requirements before finalizing your roadmap.
          </p>

          {onToggleDeepDive && (
            <div className="pt-1">
              <button
                onClick={onToggleDeepDive}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary-hover font-semibold transition-colors cursor-pointer"
              >
                <span>
                  {isDeepDiveOpen
                    ? "Hide in-depth assessment data"
                    : "Or expand detailed assessment intelligence on this page"}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isDeepDiveOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          {onExploreMatches ? (
            <button
              onClick={onExploreMatches}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-center group cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Your Career Matches</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <Link
              href={exploreMatchesHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all text-center group cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Your Career Matches</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {roadmapHref && (
            <Link
              href={roadmapHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-[#10141A] text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-center"
            >
              <Map className="h-3.5 w-3.5 text-primary" />
              <span>Continue Roadmap ({activeCareerTitle || "Active Path"})</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
