"use client";

import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { getCareerIcon } from "@/lib/career-icons";
import {
  CAREER_EXPLORATION_MAP,
  getAlignmentLabel,
} from "@/lib/career-directions";
import { getCareerSlug } from "@/lib/career-details";
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
}

export function CareerMatches({
  strongMatches: propStrong,
  explorationMatches: propExploration,
  careers: propCareers,
}: CareerMatchesProps) {
  // If individual tiers are passed, use them; otherwise, compute from careers array
  const { strongMatches, explorationMatches } =
    propStrong !== undefined
      ? {
          strongMatches: propStrong,
          explorationMatches: propExploration ?? [],
        }
      : getTieredCareerMatches(propCareers ?? []);

  const hasStrong = strongMatches.length > 0;
  const hasExploration = explorationMatches.length > 0;

  if (!hasStrong && !hasExploration) {
    return null;
  }

  return (
    <div className="w-full space-y-14">
      {/* ── Tier 1: Strong Matches ───────────────────────────────────── */}
      {hasStrong && (
        <section>
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
                <Compass className="h-3.5 w-3.5" />
                <span>Personalized For You</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181512] border border-border/80 text-[11px] font-mono text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-primary/70" />
                <span>
                  Showing career paths with {CAREER_MATCH_THRESHOLD}% or higher profile alignment
                </span>
              </div>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Your Strong Matches
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-light">
              These career paths show the strongest alignment with your assessment profile.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {strongMatches.map((career, idx) => (
              <CareerCard
                key={career.career_name}
                career={career}
                idx={idx}
                isTier2={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Tier 2: Worth Exploring ──────────────────────────────────── */}
      {hasExploration && (
        <section className={hasStrong ? "pt-4 border-t border-border/40" : ""}>
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-semibold text-amber-400/90">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Directional Alignment</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181512] border border-border/80 text-[11px] font-mono text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-amber-500/70" />
                <span>
                  Showing paths with {CAREER_EXPLORATION_THRESHOLD}%–{CAREER_MATCH_THRESHOLD - 1}% profile alignment
                </span>
              </div>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Other Directions Worth Exploring
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-light">
              These paths show some alignment with your profile, but are less strongly matched.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {explorationMatches.map((career, idx) => (
              <CareerCard
                key={career.career_name}
                career={career}
                idx={idx + strongMatches.length}
                isTier2={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Shared Card Component ────────────────────────────────────────────

interface CareerCardProps {
  career: CareerMatch;
  idx: number;
  isTier2: boolean;
}

function CareerCard({ career, idx, isTier2 }: CareerCardProps) {
  const detail = CAREER_EXPLORATION_MAP[career.career_name];
  const displayTitle = detail?.title || career.career_name;
  const explanation = career.explanation;
  const hierarchy = getCareerHierarchy(career.career_name);
  const subRoles =
    hierarchy?.sampleRoles && hierarchy.sampleRoles.length > 0
      ? hierarchy.sampleRoles
      : detail?.subRoles || [
          "Domain Specialist",
          "Technical Analyst",
          "Project Lead",
          "Strategic Associate",
        ];
  const alignment = getAlignmentLabel(idx);
  const Icon = getCareerIcon(career.career_name);
  const slug = hierarchy?.path.slug || getCareerSlug(career.career_name);
  const isTopMatch = !isTier2 && idx === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.45, ease: "easeOut" }}
      className="flex"
    >
      <SpotlightCard
        spotlightColor={
          isTopMatch
            ? "rgba(200, 146, 42, 0.18)"
            : isTier2
            ? "rgba(200, 146, 42, 0.04)"
            : "rgba(200, 146, 42, 0.08)"
        }
        className={`rounded-xl p-6 flex flex-col justify-between w-full transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden ${
          isTopMatch
            ? "border-primary/40 shadow-xl shadow-amber-950/20 bg-gradient-to-b from-card via-card to-primary/5"
            : isTier2
            ? "border-border/60 bg-[#141210] hover:border-primary/25 hover:shadow-md"
            : "border-border/70 hover:border-primary/30 hover:shadow-lg"
        }`}
      >
        {/* Top-match amber accent indicator bar */}
        {isTopMatch && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#D4A853] to-primary" />
        )}

        <div>
          {/* Header: Icon + Qualitative Alignment & Match % */}
          <div className="flex justify-between items-start mb-3">
            <div
              className={`p-2.5 rounded-xl transition-colors ${
                isTopMatch
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-xs shadow-primary/20"
                  : isTier2
                  ? "bg-[#1A1816] border border-border/80 text-muted-foreground group-hover:text-primary/90"
                  : "bg-primary/10 border border-primary/20 text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {isTopMatch && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/20 border border-primary/35 text-primary">
                  ★ Top Match
                </span>
              )}
              {isTier2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400/80">
                  Worth Exploring
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                  isTier2
                    ? "bg-[#1A1816] border border-border/80 text-foreground/80"
                    : "bg-primary/15 border border-primary/25 text-primary"
                }`}
              >
                {Math.round(career.match_percentage)}%
              </span>
              {!isTier2 && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${alignment.badgeStyle}`}
                >
                  {alignment.label}
                </span>
              )}
            </div>
          </div>

          {/* Hierarchy Trail: Domain -> Path -> Specialization -> Role */}
          {hierarchy && hierarchy.breadcrumbs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-muted-foreground/75 mb-2 leading-tight">
              {hierarchy.breadcrumbs.map((crumb, cIdx) => (
                <span key={cIdx} className="inline-flex items-center gap-1">
                  <span
                    className={
                      cIdx === hierarchy.breadcrumbs.length - 1
                        ? isTier2
                          ? "text-muted-foreground font-medium"
                          : "text-primary/90 font-medium"
                        : "text-muted-foreground/70"
                    }
                  >
                    {crumb}
                  </span>
                  {cIdx < hierarchy.breadcrumbs.length - 1 && (
                    <span className="text-muted-foreground/40 text-[9px]">→</span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
            {displayTitle}
          </h3>

          {/* Short explanation of WHY user responses connect */}
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 font-light">
            &ldquo;{explanation}&rdquo;
          </p>

          {/* Hierarchy Branch Exploration */}
          <div className="py-3 px-3.5 rounded-xl bg-[#161412] border border-border/80 mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/80">
                Possible Specializations:
              </p>
              <span className="text-[9px] font-mono text-muted-foreground/50">
                Path score: {Math.round(career.match_percentage)}%
              </span>
            </div>

            {hierarchy?.path.specializations && hierarchy.path.specializations.length > 0 ? (
              <div className="space-y-1 text-xs">
                {hierarchy.path.specializations.map((spec, sIdx) => {
                  const isLast = sIdx === hierarchy.path.specializations.length - 1;
                  return (
                    <Link
                      key={spec.id}
                      href={`/career-map?domain=${hierarchy.domain.id}&path=${slug}&spec=${spec.id}`}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#1E1A16] text-foreground/90 font-medium group/spec transition-colors"
                      title={`Explore ${spec.name} branch in Career Tree`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-primary/60 font-mono text-[11px]">
                          {isLast ? "└──" : "├──"}
                        </span>
                        <span className="truncate group-hover/spec:text-primary transition-colors">
                          {spec.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/50 group-hover/spec:text-primary transition-colors shrink-0">
                        {spec.roles.length} roles →
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <ul className="space-y-1.5 text-xs text-foreground/90 font-medium">
                {subRoles.slice(0, 3).map((role) => (
                  <li key={role} className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        isTopMatch
                          ? "bg-primary"
                          : isTier2
                          ? "bg-muted-foreground/50"
                          : "bg-primary/70"
                      }`}
                    />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
          <Link
            href={`/career/${slug}`}
            className={`inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isTopMatch
                ? "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-amber-900/25"
                : isTier2
                ? "bg-[#181512] border border-border/70 text-foreground hover:border-primary/40 hover:bg-[#1E1A16]"
                : "bg-card border border-border/70 text-foreground hover:border-primary/40 hover:bg-card-hover"
            }`}
          >
            <span>{isTier2 ? "View Career Path Details" : "View Career & Roadmap"}</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>

          {hierarchy && (
            <Link
              href={`/career-map?domain=${hierarchy.domain.id}&path=${slug}&match=${Math.round(career.match_percentage)}`}
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-mono font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Explore this branch in Career Tree</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
