"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { getCareerIcon } from "@/lib/career-icons";
import {
  CAREER_EXPLORATION_MAP,
  getAlignmentLabel,
} from "@/lib/career-directions";
import { getCareerSlug } from "@/lib/career-details";

import type { CareerMatch } from "@/lib/types/assessment";

interface CareerMatchesProps {
  careers: CareerMatch[];
}

export function CareerMatches({ careers }: CareerMatchesProps) {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <Compass className="h-3.5 w-3.5" />
          <span>Personalized for You</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          Your Top Career Matches
        </h2>
        <p className="text-secondary-foreground text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Ranked by how closely each career aligns with your trait profile and assessment responses.
        </p>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {careers.map((career, idx) => {
          const detail = CAREER_EXPLORATION_MAP[career.career_name];
          const displayTitle = detail?.title || career.career_name;
          const explanation = career.explanation;
          const subRoles = detail?.subRoles || [
            "Domain Specialist",
            "Technical Analyst",
            "Project Lead",
            "Strategic Associate",
          ];
          const alignment = getAlignmentLabel(idx);
          const Icon = getCareerIcon(career.career_name);
          const slug = getCareerSlug(career.career_name);
          const isTopMatch = idx === 0;

          return (
            <motion.div
              key={career.career_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: "easeOut" }}
              className="flex"
            >
              <SpotlightCard
                spotlightColor={isTopMatch ? "rgba(59, 130, 246, 0.22)" : "rgba(59, 130, 246, 0.10)"}
                className={`rounded-2xl p-6 flex flex-col justify-between w-full transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
                  isTopMatch
                    ? "border-primary/45 shadow-xl shadow-primary/10 bg-linear-to-b from-card via-card to-primary/5"
                    : "border-border/90 hover:border-primary/40 hover:shadow-lg shadow-black/20"
                }`}
              >
                {/* Top-match accent indicator bar */}
                {isTopMatch && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-primary" />
                )}

                <div>
                  {/* Header: Icon + Qualitative Alignment & Match % */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isTopMatch 
                        ? "bg-primary/15 border border-primary/30 text-primary shadow-xs shadow-primary/20" 
                        : "bg-primary/10 border border-primary/20 text-primary"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isTopMatch && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          ★ Top Match
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-primary/15 border border-primary/25 text-primary">
                        {Math.round(career.match_percentage)}%
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${alignment.badgeStyle}`}
                      >
                        {alignment.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {displayTitle}
                  </h3>

                  {/* Short explanation of WHY user responses connect */}
                  <p className="text-secondary-foreground/90 text-xs sm:text-sm leading-relaxed mb-5">
                    &ldquo;{explanation}&rdquo;
                  </p>

                  {/* "You might explore" roles */}
                  <div className="py-3 px-3.5 rounded-xl bg-[#0F172A] border border-border/80 mb-5">
                    <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      You might explore:
                    </p>
                    <ul className="space-y-1.5 text-xs text-foreground font-medium">
                      {subRoles.slice(0, 4).map((role) => (
                        <li key={role} className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isTopMatch ? "bg-primary" : "bg-primary/70"}`} />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action link */}
                <div className="pt-3 border-t border-border/60">
                  <Link
                    href={`/career/${slug}`}
                    className={`inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isTopMatch
                        ? "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/25"
                        : "bg-card border border-border text-primary hover:border-primary/40 hover:bg-card-hover"
                    }`}
                  >
                    <span>View Career &amp; Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
