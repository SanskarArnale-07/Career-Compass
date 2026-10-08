"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { ScoredTrait } from "@/lib/profile/profile-utils";

interface TopTraitsSectionProps {
  topStrengths: ScoredTrait[];
  allTraits: ScoredTrait[];
  limit?: number;
}

export function TopTraitsSection({
  topStrengths,
  allTraits,
  limit = 3,
}: TopTraitsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const initialStrengths = topStrengths.slice(0, limit);
  const displayedTraits = showAll ? allTraits : initialStrengths;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Strongest Traits & Cognitive Fingerprint
            </h2>
            <p className="text-xs text-muted-foreground">
              {showAll
                ? "Complete 8-dimension psychometric profile"
                : `Top ${limit} core aptitudes that drive your career suitability`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-primary-hover font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>{showAll ? `Show Top ${limit} Strengths` : "View All 8 Dimensions"}</span>
          {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Primary Top Strengths Grid */}
      <div className="space-y-3.5">
        {displayedTraits.map((trait) => (
          <div
            key={trait.code}
            className="p-3.5 rounded-xl border border-border/60 bg-[#0B0E12]/80 hover:border-border transition-colors space-y-2"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-[#141920] border border-border/80 text-[11px] font-mono font-bold text-primary">
                  {trait.code}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {trait.label}
                </span>
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono border ${trait.badgeClass}`}>
                  {trait.tier}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-foreground tabular-nums">
                  {trait.score}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-[#10141A] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trait.score}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  trait.score >= 70
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : trait.score >= 50
                    ? "bg-secondary"
                    : "bg-muted-foreground/50"
                }`}
              />
            </div>

            {/* Capability takeaway */}
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed pt-0.5">
              {trait.keyCapability}
            </p>
          </div>
        ))}
      </div>

      {/* Footer takeaway */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-secondary-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-[11px] sm:text-xs">
          Your top scores represent natural cognitive flow states where learning velocity and problem-solving stamina are highest.
        </span>
      </div>
    </div>
  );
}
