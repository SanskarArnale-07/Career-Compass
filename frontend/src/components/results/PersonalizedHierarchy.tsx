"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Circle } from "lucide-react";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import type { CareerMatch } from "@/lib/types/assessment";

interface PersonalizedHierarchyProps {
  topMatches: CareerMatch[]; // already filtered by threshold
}

const DOMAIN_COLOR: Record<string, string> = {
  "engineering-technology": "#00E5FF",
  "data-ai": "#38BDF8",
  "design-creative": "#818CF8",
  "business-finance-management": "#60A5FA",
  "healthcare-sciences": "#2DD4BF",
  "media-communications-social": "#A78BFA",
};

export function PersonalizedHierarchy({ topMatches }: PersonalizedHierarchyProps) {
  if (!topMatches || topMatches.length === 0) return null;

  // Render up to top 3 matches with their hierarchy
  const matchesWithHierarchy = topMatches
    .slice(0, 3)
    .map((m) => {
      const hierarchy = getCareerHierarchy(m.career_name);
      return { match: m, hierarchy };
    })
    .filter((item) => item.hierarchy !== undefined);

  if (matchesWithHierarchy.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Your Career Direction
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            How your top matches map to the career hierarchy
          </p>
        </div>
        <Link
          href="/career-map"
          className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
        >
          Explore full tree
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {matchesWithHierarchy.map(({ match, hierarchy }, idx) => {
          if (!hierarchy) return null;
          const color =
            DOMAIN_COLOR[hierarchy.domain.id] ?? "#00E5FF";
          const isPrimary = idx === 0;

          return (
            <motion.div
              key={match.career_name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="rounded-2xl border p-5 relative overflow-hidden"
              style={{
                borderColor: isPrimary ? `${color}40` : `${color}18`,
                background: isPrimary ? `${color}06` : "transparent",
              }}
            >
              {/* subtle glow for primary */}
              {isPrimary && (
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ background: color }}
                />
              )}

              {/* Match badge */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.18em]"
                  style={{ color: `${color}90` }}
                >
                  {match.match_percentage >= 40
                    ? isPrimary
                      ? "Primary Strong Match"
                      : "Strong Match"
                    : "Worth Exploring"}
                </span>
                <span
                  className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: `${color}20`,
                    color: color,
                    border: `1px solid ${color}35`,
                  }}
                >
                  {Math.round(match.match_percentage)}%
                </span>
              </div>

              {/* Breadcrumb tree: Domain → Path → Specialization → Roles */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-0 flex-wrap">

                {/* Domain */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/career-map?domain=${hierarchy.domain.id}`}
                    title={`Explore ${hierarchy.domain.name} in Career Tree`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}25`,
                      color: `${color}`,
                    }}
                  >
                    {hierarchy.domain.name}
                  </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-0">
                  {/* connector */}
                  <div className="hidden sm:flex items-center px-1">
                    <div
                      className="w-6 h-px"
                      style={{ background: `${color}35` }}
                    />
                    <ChevronRight className="h-3 w-3" style={{ color: `${color}60` }} />
                  </div>
                  <ChevronRight className="h-3 w-3 sm:hidden" style={{ color: `${color}60` }} />

                  {/* Path (with match %) */}
                  <Link
                    href={`/career-map?domain=${hierarchy.domain.id}&path=${hierarchy.path.slug}&match=${Math.round(match.match_percentage)}`}
                    title={`Explore ${hierarchy.path.name} in Career Tree`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: isPrimary ? `${color}20` : `${color}10`,
                      border: `1px solid ${color}${isPrimary ? "50" : "25"}`,
                      color: "#F4F7FA",
                    }}
                  >
                    {hierarchy.path.name}
                  </Link>
                </div>

                {/* Specialization */}
                {hierarchy.primarySpecialization && (
                  <div className="flex items-center gap-2 sm:gap-0">
                    <div className="hidden sm:flex items-center px-1">
                      <div
                        className="w-6 h-px"
                        style={{ background: `${color}25` }}
                      />
                      <ChevronRight className="h-3 w-3" style={{ color: `${color}45` }} />
                    </div>
                    <ChevronRight className="h-3 w-3 sm:hidden" style={{ color: `${color}45` }} />
                    <Link
                      href={`/career-map?domain=${hierarchy.domain.id}&path=${hierarchy.path.slug}&spec=${hierarchy.primarySpecialization.id}`}
                      title={`Explore ${hierarchy.primarySpecialization.name} in Career Tree`}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: "#10141A",
                        border: `1px solid ${color}18`,
                        color: "#8C96A3",
                      }}
                    >
                      {hierarchy.primarySpecialization.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Roles & Explore Branch Action */}
              {hierarchy.primarySpecialization && (
                <div className="relative z-10 mt-3 pt-3 border-t" style={{ borderColor: `${color}15` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: `${color}70` }}>
                      Example roles in this path
                    </p>
                    <Link
                      href={`/career-map?domain=${hierarchy.domain.id}&path=${hierarchy.path.slug}&match=${Math.round(match.match_percentage)}`}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold transition-colors hover:underline"
                      style={{ color }}
                    >
                      <span>Explore this branch in Tree</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hierarchy.primarySpecialization.roles.map((role) => (
                      <Link
                        key={role.id}
                        href={`/career/${hierarchy.path.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all hover:scale-[1.02]"
                        style={{
                          background: `${color}08`,
                          border: `1px solid ${color}20`,
                          color: "#8C96A3",
                        }}
                      >
                        <Circle
                          className="h-1.5 w-1.5 shrink-0"
                          fill={role.isEntryLevel ? color : "transparent"}
                          stroke={color}
                          strokeWidth={2}
                        />
                        {role.title}
                      </Link>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground/50 font-mono mt-2">
                    ⚠ Match % is for the career path, not individual roles
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
