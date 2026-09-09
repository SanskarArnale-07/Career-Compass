"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { getCareerIcon } from "@/lib/career-icons";
import {
  CAREER_EXPLORATION_MAP,
  getAlignmentLabel,
  formatExplorationExplanation,
} from "@/lib/career-directions";

interface CareerMatchData {
  career_name: string;
  match_percentage: number;
  top_traits: string[];
  explanation: string;
  skill_gaps: string[];
  next_steps: string[];
}

interface CareerMatchesProps {
  careers: CareerMatchData[];
}

export function CareerMatches({ careers }: CareerMatchesProps) {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <Compass className="h-3.5 w-3.5" />
          <span>Exploratory Pathways</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          Career directions worth exploring
        </h2>
        <p className="text-secondary-foreground text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Your results highlight several career directions with different levels of alignment. No single direction is a definitive recommendation.
        </p>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {careers.map((career, idx) => {
          const detail = CAREER_EXPLORATION_MAP[career.career_name];
          const displayTitle = detail?.title || career.career_name;
          const explanation = formatExplorationExplanation(
            career.career_name,
            career.top_traits
          );
          const subRoles = detail?.subRoles || [
            "Domain Specialist",
            "Technical Analyst",
            "Project Lead",
            "Strategic Associate",
          ];
          const alignment = getAlignmentLabel(idx);
          const Icon = getCareerIcon(career.career_name);

          return (
            <div
              key={career.career_name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:bg-card-hover hover:border-primary/30 group"
            >
              <div>
                {/* Header: Icon + Qualitative Alignment */}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${alignment.badgeStyle}`}
                  >
                    {alignment.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
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
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shrink-0" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-3 border-t border-border/60">
                <Link
                  href={`/careers?search=${encodeURIComponent(career.career_name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary-hover transition-colors"
                >
                  <span>Explore this direction</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
