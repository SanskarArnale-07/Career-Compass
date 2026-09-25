"use client";

import { useMemo } from "react";
import { Compass, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { CAREER_EXPLORATION_MAP } from "@/lib/career-directions";
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
  const { strongMatches, explorationMatches } = useMemo(() => {
    if (propStrong !== undefined) {
      return {
        strongMatches: propStrong,
        explorationMatches: propExploration ?? [],
      };
    }
    return getTieredCareerMatches(propCareers ?? []);
  }, [propStrong, propExploration, propCareers]);

  const hasStrong = strongMatches.length > 0;
  const hasExploration = explorationMatches.length > 0;

  if (!hasStrong && !hasExploration) {
    return null;
  }

  return (
    <div className="w-full space-y-10" id="career-matches-section">
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>Curated Matches</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            Careers You Can Explore
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-light leading-relaxed">
            Top paths filtered by your assessment profile. Click any card to explore its detailed hierarchy below.
          </p>
        </div>
      </div>

      {/* ── Match Context: All visible results in 25–39% range ── */}
      {!hasStrong && hasExploration && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-sky-950/25 border border-sky-500/30 flex items-center gap-3">
          <Compass className="h-4 w-4 text-sky-400 shrink-0" />
          <p className="text-xs sm:text-sm text-sky-200 font-light">
            <strong className="font-semibold text-sky-300">Match Context:</strong> No strong match yet. These are your top paths worth exploring.
          </p>
        </div>
      )}

      {/* ── Tier 1: Strong Matches (≥40%) ──────────────────────────── */}
      {hasStrong && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Strong Match
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              (≥{CAREER_MATCH_THRESHOLD}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {strongMatches.map((career, idx) => (
              <CleanCareerCard
                key={career.career_name}
                career={career}
                idx={idx}
                isTier2={false}
                isActive={activeCareerName === career.career_name}
                onSelect={onExploreCareer}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Tier 2: Worth Exploring (25–39%) ────────────────────────── */}
      {hasExploration && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              Worth Exploring
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ({CAREER_EXPLORATION_THRESHOLD}–{CAREER_MATCH_THRESHOLD - 1}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {explorationMatches.map((career, idx) => (
              <CleanCareerCard
                key={career.career_name}
                career={career}
                idx={idx + strongMatches.length}
                isTier2={true}
                isActive={activeCareerName === career.career_name}
                onSelect={onExploreCareer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Ultra-Clean Minimal Card ──────────────────────────────────────────
// Entire card is clickable to select path and scroll to hierarchy.
// No redundant Explore buttons.

interface CleanCareerCardProps {
  career: CareerMatch;
  idx: number;
  isTier2: boolean;
  isActive: boolean;
  onSelect?: (careerName: string) => void;
}

function CleanCareerCard({
  career,
  idx,
  isTier2,
  isActive,
  onSelect,
}: CleanCareerCardProps) {
  const hierarchy = getCareerHierarchy(career.career_name);
  const detail = CAREER_EXPLORATION_MAP[career.career_name];
  const displayTitle = hierarchy?.path.name || detail?.title || career.career_name;

  // 1-line description (clean, concise, non-bloated)
  const description =
    hierarchy?.path.tagline ||
    detail?.summary ||
    career.explanation?.split(".")[0] ||
    "Specialized career path aligned with your assessment strengths.";

  const matchScore = Math.round(career.match_percentage);

  const handleClick = () => {
    if (onSelect) {
      onSelect(career.career_name);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.35 }}
      aria-pressed={isActive}
      className={`rounded-2xl p-5 sm:p-6 text-left flex flex-col justify-between transition-all duration-200 border cursor-pointer group relative overflow-hidden focus:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        isActive
          ? "bg-[#141C26] border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/50"
          : isTier2
          ? "bg-[#10141A]/90 border-border/70 hover:border-sky-500/50 hover:bg-[#121720]"
          : "bg-[#10141A]/90 border-border/70 hover:border-cyan-500/50 hover:bg-[#121720]"
      }`}
    >
      {/* Top active indicator line */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 via-sky-400 to-cyan-400" />
      )}

      <div className="w-full">
        {/* Top: Career Path + Match Percentage */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3
            className={`font-heading text-base sm:text-lg font-bold leading-snug transition-colors ${
              isActive
                ? "text-cyan-300"
                : "text-slate-100 group-hover:text-cyan-200"
            }`}
          >
            {displayTitle}
          </h3>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 ${
              isActive
                ? "bg-cyan-400 text-slate-950 font-extrabold shadow-xs shadow-cyan-400/30"
                : isTier2
                ? "bg-sky-500/10 border border-sky-500/20 text-sky-400"
                : "bg-cyan-500/10 border border-cyan-500/25 text-cyan-300"
            }`}
          >
            {matchScore}%
          </span>
        </div>

        {/* 1-Line Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light line-clamp-2">
          {description}
        </p>
      </div>

      {/* Bottom active state / hint */}
      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
        <span
          className={`flex items-center gap-1.5 transition-colors ${
            isActive
              ? "text-cyan-400 font-semibold"
              : "text-slate-500 group-hover:text-slate-300"
          }`}
        >
          {isActive ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>Currently Exploring</span>
            </>
          ) : (
            <span>Click to explore hierarchy</span>
          )}
        </span>

        <span
          className={`text-xs transition-transform duration-200 ${
            isActive
              ? "text-cyan-400 translate-y-0.5"
              : "text-slate-500 group-hover:text-cyan-400 group-hover:translate-y-0.5"
          }`}
        >
          ↓
        </span>
      </div>
    </motion.button>
  );
}
