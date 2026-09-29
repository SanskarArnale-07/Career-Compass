"use client";

import { useMemo } from "react";
import {
  getTieredCareerMatches,
  isStrongMatch,
} from "@/lib/constants/matching";
import type { CareerMatch } from "@/lib/types/assessment";

interface CareerMatchesProps {
  strongMatches?: CareerMatch[];
  explorationMatches?: CareerMatch[];
  careers?: CareerMatch[];
  activeCareerName?: string;
  onExploreCareer?: (careerName: string) => void;
}

export function CareerMatches({
  strongMatches: propStrong,
  explorationMatches: propExploration,
  careers: propCareers,
  activeCareerName,
  onExploreCareer,
}: CareerMatchesProps) {
  // Use provided tiers or compute using canonical matching logic
  const { allVisibleMatches } = useMemo(() => {
    if (propStrong !== undefined) {
      const strong = propStrong;
      const exploration = propExploration ?? [];
      return {
        allVisibleMatches: [...strong, ...exploration].slice(0, 3),
      };
    }
    return getTieredCareerMatches(propCareers ?? []);
  }, [propStrong, propExploration, propCareers]);

  if (!allVisibleMatches.length) {
    return null;
  }

  // Active career defaults to activeCareerName or the first match
  const selectedName = activeCareerName || allVisibleMatches[0]?.career_name;

  return (
    <div className="w-full select-none" id="career-matches-section">
      {/* ── Section Header ─────────────── */}
      <div className="text-center max-w-xl mx-auto mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2">
          <span>YOUR CAREER MATCHES</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
          Strongest Career Directions
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-normal mt-1 leading-relaxed max-w-xl mx-auto">
          Your primary recommendation is highlighted below, alongside alternative directions that match your profile.
        </p>
      </div>

      {/* ── Desktop & Tablet Connected Constellation ────────────────── */}
      <div className="hidden sm:block relative w-full max-w-2xl mx-auto py-1">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_40%_50%,rgba(0,229,255,0.05),transparent_75%)]" />

        <div className="relative flex items-center justify-between gap-4">
          {/* ── LEFT: YOU Origin Anchor Node ────────────────────────── */}
          <div className="flex flex-col items-center shrink-0 z-20">
            <div className="h-12 w-12 rounded-full bg-[#141920] border-2 border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-950/40">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-0.5" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-300">
                YOU
              </span>
            </div>
          </div>

          {/* ── SVG Branching Connectors (Tight vertical height) ─────── */}
          <svg
            className="absolute left-12 top-0 w-[calc(100%-3rem)] h-full pointer-events-none z-10 overflow-visible"
            viewBox="0 0 460 140"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="activeSpokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Branch 1 to Top Node */}
            <path
              d="M 5 70 C 50 70, 65 22, 110 22"
              fill="none"
              stroke={selectedName === allVisibleMatches[0]?.career_name ? "url(#activeSpokeGrad)" : "#1E2633"}
              strokeWidth={selectedName === allVisibleMatches[0]?.career_name ? "2" : "1"}
              strokeDasharray={selectedName === allVisibleMatches[0]?.career_name ? "none" : "2 2"}
              className="transition-all duration-200"
            />

            {/* Branch 2 to Middle Node */}
            {allVisibleMatches[1] && (
              <path
                d="M 5 70 L 110 70"
                fill="none"
                stroke={selectedName === allVisibleMatches[1]?.career_name ? "url(#activeSpokeGrad)" : "#1E2633"}
                strokeWidth={selectedName === allVisibleMatches[1]?.career_name ? "2" : "1"}
                strokeDasharray={selectedName === allVisibleMatches[1]?.career_name ? "none" : "2 2"}
                className="transition-all duration-200"
              />
            )}

            {/* Branch 3 to Bottom Node */}
            {allVisibleMatches[2] && (
              <path
                d="M 5 70 C 50 70, 65 118, 110 118"
                fill="none"
                stroke={selectedName === allVisibleMatches[2]?.career_name ? "url(#activeSpokeGrad)" : "#1E2633"}
                strokeWidth={selectedName === allVisibleMatches[2]?.career_name ? "2" : "1"}
                strokeDasharray={selectedName === allVisibleMatches[2]?.career_name ? "none" : "2 2"}
                className="transition-all duration-200"
              />
            )}
          </svg>

          {/* ── RIGHT: Constellation Nodes (Hierarchical visual dominance) ─── */}
          <div className="flex flex-col justify-between w-full pl-8 py-0 gap-2.5 z-20">
            {allVisibleMatches.map((career, idx) => {
              const isSelected = selectedName === career.career_name;
              const isRecommended = idx === 0;
              const isStrong = isStrongMatch(career.match_percentage);
              const score = Math.round(career.match_percentage);

              return (
                <button
                  key={career.career_name}
                  type="button"
                  onClick={() => onExploreCareer?.(career.career_name)}
                  className={`group relative flex items-center justify-between gap-3.5 rounded-2xl border transition-all duration-200 cursor-pointer w-full text-left ${
                    isRecommended
                      ? isSelected
                        ? "px-4 py-3 bg-[#161D26] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-400/40 text-white scale-[1.01]"
                        : "px-4 py-3 bg-[#12161E] border-cyan-500/50 shadow-md shadow-cyan-950/30 text-slate-100 hover:border-cyan-400"
                      : isSelected
                        ? "px-4 py-2.5 bg-[#141920] border-cyan-500/70 shadow-md shadow-cyan-950/40 text-white ring-1 ring-cyan-400/30"
                        : "px-4 py-2.5 bg-[#0B0E12]/80 border-border/50 text-slate-400 hover:border-border/80 hover:text-slate-200"
                  }`}
                >
                  {/* Left Joint Marker + Badge + Flexible Career Title */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`rounded-full shrink-0 transition-all ${
                        isRecommended
                          ? "w-2.5 h-2.5 bg-cyan-400 shadow-sm shadow-cyan-400 scale-125"
                          : isSelected
                            ? "w-2 h-2 bg-cyan-400"
                            : "w-2 h-2 bg-slate-600 group-hover:bg-slate-500"
                      }`}
                    />
                    {isRecommended && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shrink-0">
                        Recommended
                      </span>
                    )}
                    {/* Career Path Title (Flexible, graceful truncation, never wraps under score) */}
                    <span
                      className={`font-heading font-bold text-sm sm:text-base leading-tight truncate flex-1 min-w-0 ${
                        isSelected
                          ? "text-white"
                          : isRecommended
                            ? "text-slate-100 group-hover:text-white"
                            : "text-slate-300 group-hover:text-slate-100"
                      }`}
                      title={career.career_name}
                    >
                      {career.career_name}
                    </span>
                  </div>

                  {/* Right: Dedicated Non-Overlapping Area for Score & Tier Badge */}
                  <div className="flex items-center gap-2 shrink-0 pl-2 text-right">
                    <span
                      className={`font-mono font-bold text-sm sm:text-base ${
                        isRecommended || isSelected ? "text-cyan-300" : "text-slate-200"
                      }`}
                    >
                      {score}%
                    </span>
                    <span className="text-slate-600 text-xs select-none">·</span>
                    <span
                      className={`text-xs font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap ${
                        isStrong
                          ? "text-cyan-300 bg-cyan-950/40 border-cyan-500/30"
                          : "text-sky-300 bg-sky-950/40 border-sky-500/30"
                      }`}
                    >
                      {isStrong ? "WORTH EXPLORING" : "MAYBE EXPLORE"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile Vertical Connected Spine (Zero horizontal overflow) ─ */}
      <div className="sm:hidden relative w-full px-2 py-1">
        {/* Origin: YOU */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-8 w-8 rounded-full bg-[#141920] border-2 border-cyan-400 flex items-center justify-center shadow-sm shadow-cyan-950/40 shrink-0">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-300">
              YOU
            </span>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Origin
          </span>
        </div>

        {/* Vertical connected timeline */}
        <div className="relative pl-5 space-y-2 before:absolute before:left-3.5 before:top-1 before:bottom-2 before:w-px before:bg-cyan-500/40">
          {allVisibleMatches.map((career, idx) => {
            const isSelected = selectedName === career.career_name;
            const isRecommended = idx === 0;
            const isStrong = isStrongMatch(career.match_percentage);
            const score = Math.round(career.match_percentage);

            return (
              <button
                key={career.career_name}
                type="button"
                onClick={() => onExploreCareer?.(career.career_name)}
                className={`w-full text-left rounded-xl transition-all cursor-pointer border relative flex items-center justify-between gap-3 p-3.5 ${
                  isRecommended
                    ? "bg-[#141920] border-cyan-400/90 shadow-md shadow-cyan-950/40 text-white"
                    : isSelected
                      ? "bg-[#141920] border-cyan-500/60 shadow-sm shadow-cyan-950/30 text-white"
                      : "bg-[#0B0E12]/80 border-border/50 text-slate-400"
                }`}
              >
                {/* Node dot on vertical line */}
                <span
                  className={`absolute -left-4.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border ${
                    isRecommended || isSelected
                      ? "bg-cyan-400 border-white shadow-xs shadow-cyan-400"
                      : "bg-[#10141A] border-slate-600"
                  }`}
                />

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {isRecommended && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 shrink-0">
                        Recommended
                      </span>
                    )}
                    <span
                      className={`text-xs font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border whitespace-nowrap ${
                        isStrong
                          ? "text-cyan-300 bg-cyan-950/40 border-cyan-500/30"
                          : "text-sky-300 bg-sky-950/40 border-sky-500/30"
                      }`}
                    >
                      {isStrong ? "WORTH EXPLORING" : "MAYBE EXPLORE"}
                    </span>
                  </div>
                  <h3
                    className="text-sm font-heading font-bold text-white truncate leading-tight"
                    title={career.career_name}
                  >
                    {career.career_name}
                  </h3>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-sm font-mono font-bold border inline-block ${
                      isRecommended
                        ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40"
                        : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {score}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
