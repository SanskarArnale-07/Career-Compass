"use client";

import { useMemo } from "react";
import { Compass, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import {
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
  getTieredCareerMatches,
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
  const { strongMatches, explorationMatches, allVisibleMatches } = useMemo(() => {
    if (propStrong !== undefined) {
      const strong = propStrong;
      const exploration = propExploration ?? [];
      return {
        strongMatches: strong,
        explorationMatches: exploration,
        allVisibleMatches: [...strong, ...exploration].slice(0, 3),
      };
    }
    return getTieredCareerMatches(propCareers ?? []);
  }, [propStrong, propExploration, propCareers]);

  const hasStrong = strongMatches.length > 0;
  const hasExploration = explorationMatches.length > 0;

  if (!allVisibleMatches.length) {
    return null;
  }

  // Active career defaults to activeCareerName or the first match
  const selectedName = activeCareerName || allVisibleMatches[0]?.career_name;

  return (
    <div className="w-full select-none" id="career-matches-section">
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-2">
          <Compass className="h-3.5 w-3.5" />
          <span>CAREER POSSIBILITIES · CONNECTED PATHS</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Where Your Assessment Points You
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light leading-relaxed">
          Top career paths branching from your profile. Select any node to trace its complete hierarchy below.
        </p>
      </div>

      {/* ── Match Context Alert (When all matches are in exploration tier) ── */}
      {!hasStrong && hasExploration && (
        <div className="mb-6 p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 flex items-center justify-center gap-2.5 max-w-xl mx-auto text-center">
          <Compass className="h-4 w-4 text-sky-400 shrink-0" />
          <p className="text-xs text-sky-200 font-light">
            <strong className="font-semibold text-sky-300">Match Context:</strong>{" "}
            All top matches are within the Worth Exploring range ({CAREER_EXPLORATION_THRESHOLD}–{CAREER_MATCH_THRESHOLD - 1}%).
          </p>
        </div>
      )}

      {/* ── Desktop & Tablet Branching Constellation ────────────────── */}
      <div className="hidden sm:block relative w-full max-w-3xl mx-auto py-4">
        {/* Ambient Glow behind branching constellation */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_40%_50%,rgba(0,229,255,0.06),transparent_75%)]" />

        <div className="relative flex items-center justify-between gap-6">
          {/* ── LEFT: YOU Origin Anchor Node ────────────────────────── */}
          <div className="flex flex-col items-center shrink-0 z-20">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border border-cyan-500/20 animate-ping opacity-25 pointer-events-none" />
              <div className="h-16 w-16 rounded-full bg-[#141920] border-2 border-cyan-400 flex flex-col items-center justify-center shadow-xl shadow-cyan-950/50">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mb-1" />
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-300">
                  YOU
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2">
              Profile Origin
            </span>
          </div>

          {/* ── SVG Branching Connectors ────────────────────────────── */}
          <svg
            className="absolute left-16 top-0 w-[calc(100%-4rem)] h-full pointer-events-none z-10 overflow-visible"
            viewBox="0 0 540 280"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="activeBranchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Branch 1 to Top Node */}
            <path
              d="M 10 140 C 90 140, 110 45, 180 45"
              fill="none"
              stroke={selectedName === allVisibleMatches[0]?.career_name ? "url(#activeBranchGrad)" : "#1E293B"}
              strokeWidth={selectedName === allVisibleMatches[0]?.career_name ? "2.5" : "1.2"}
              strokeDasharray={selectedName === allVisibleMatches[0]?.career_name ? "none" : "3 3"}
              className="transition-all duration-300"
            />

            {/* Branch 2 to Middle Node */}
            {allVisibleMatches[1] && (
              <path
                d="M 10 140 C 90 140, 120 140, 180 140"
                fill="none"
                stroke={selectedName === allVisibleMatches[1]?.career_name ? "url(#activeBranchGrad)" : "#1E293B"}
                strokeWidth={selectedName === allVisibleMatches[1]?.career_name ? "2.5" : "1.2"}
                strokeDasharray={selectedName === allVisibleMatches[1]?.career_name ? "none" : "3 3"}
                className="transition-all duration-300"
              />
            )}

            {/* Branch 3: Emanating from Origin or Sub-branching to Third Node */}
            {allVisibleMatches[2] && (
              <path
                d="M 10 140 C 90 140, 110 235, 180 235"
                fill="none"
                stroke={selectedName === allVisibleMatches[2]?.career_name ? "url(#activeBranchGrad)" : "#1E293B"}
                strokeWidth={selectedName === allVisibleMatches[2]?.career_name ? "2.5" : "1.2"}
                strokeDasharray={selectedName === allVisibleMatches[2]?.career_name ? "none" : "3 3"}
                className="transition-all duration-300"
              />
            )}
          </svg>

          {/* ── RIGHT: Connected Career Path Nodes ──────────────────── */}
          <div className="flex flex-col justify-between w-full max-w-md pl-12 py-2 gap-4 z-20">
            {allVisibleMatches.map((career, index) => {
              const isSelected = selectedName === career.career_name;
              const isStrong = career.match_percentage >= CAREER_MATCH_THRESHOLD;
              const hierarchy = getCareerHierarchy(career.career_name);
              const score = Math.round(career.match_percentage);

              return (
                <button
                  key={career.career_name}
                  type="button"
                  onClick={() => onExploreCareer?.(career.career_name)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer border flex items-center justify-between gap-3 group relative ${
                    isSelected
                      ? "bg-[#141920] border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/40"
                      : "bg-[#10141A]/80 border-border/80 hover:border-cyan-500/40 hover:bg-[#141920]/90"
                  }`}
                >
                  {/* Left Connector Node Pin */}
                  <div
                    className={`absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-cyan-400 border-white shadow-md shadow-cyan-400"
                        : "bg-[#10141A] border-slate-600 group-hover:border-cyan-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-slate-950" : "bg-slate-400"
                      }`}
                    />
                  </div>

                  {/* Main Career Info */}
                  <div className="pl-3 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        0{index + 1}
                      </span>
                      <h3
                        className={`font-heading text-sm sm:text-base font-bold truncate transition-colors ${
                          isSelected ? "text-cyan-200" : "text-slate-100 group-hover:text-white"
                        }`}
                      >
                        {career.career_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      {hierarchy?.domain && (
                        <span className="text-[11px] font-mono text-slate-400 truncate">
                          {hierarchy.domain.name}
                        </span>
                      )}
                      <span className="text-slate-600">·</span>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          isStrong ? "text-cyan-400" : "text-sky-300"
                        }`}
                      >
                        {isStrong ? "Strong Match" : "Worth Exploring"}
                      </span>
                    </div>
                  </div>

                  {/* Right Score & Active Status Pill */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-[#080A0D] text-slate-300 border-border/80 group-hover:border-cyan-500/30"
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      <span>{score}%</span>
                    </div>

                    <div
                      className={`h-7 w-7 rounded-xl flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-cyan-400 border-cyan-300 text-slate-950"
                          : "bg-[#141920] border-border/70 text-slate-400 group-hover:text-cyan-300"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile Vertical Connected Spine (Zero horizontal overflow) ─ */}
      <div className="sm:hidden relative w-full px-2 py-2">
        {/* Origin: YOU */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-full bg-[#141920] border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-950/40 shrink-0">
            <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300">
              YOU
            </span>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Profile Origin
            </p>
            <p className="text-[11px] text-slate-400 font-light">
              Branching paths calibrated to your traits
            </p>
          </div>
        </div>

        {/* Vertical connected timeline */}
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-5.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-linear-to-b before:from-cyan-400 before:via-cyan-500/40 before:to-border/30">
          {allVisibleMatches.map((career, index) => {
            const isSelected = selectedName === career.career_name;
            const isStrong = career.match_percentage >= CAREER_MATCH_THRESHOLD;
            const hierarchy = getCareerHierarchy(career.career_name);
            const score = Math.round(career.match_percentage);

            return (
              <button
                key={career.career_name}
                type="button"
                onClick={() => onExploreCareer?.(career.career_name)}
                className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer border relative ${
                  isSelected
                    ? "bg-[#141920] border-cyan-400 shadow-md shadow-cyan-950/30"
                    : "bg-[#10141A]/90 border-border/80"
                }`}
              >
                {/* Node dot on vertical line */}
                <span
                  className={`absolute -left-[1.375rem] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                    isSelected
                      ? "bg-cyan-400 border-white shadow-sm shadow-cyan-400"
                      : "bg-[#10141A] border-slate-600"
                  }`}
                />

                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono text-cyan-400">
                      0{index + 1}
                    </span>
                    <h3
                      className={`text-xs font-heading font-bold truncate ${
                        isSelected ? "text-cyan-200" : "text-slate-100"
                      }`}
                    >
                      {career.career_name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                    {score}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-[160px]">
                    {hierarchy?.domain.name}
                  </span>
                  <span className={isStrong ? "text-cyan-300" : "text-sky-300"}>
                    {isStrong ? "Strong Match" : "Worth Exploring"}
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
