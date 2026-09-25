"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Briefcase, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import type { CareerMatch } from "@/lib/types/assessment";

interface ProgressiveHierarchyProps {
  activeCareer: CareerMatch;
  allMatches?: CareerMatch[];
  onSelectCareer?: (careerName: string) => void;
}

export function ProgressiveHierarchy({
  activeCareer,
}: ProgressiveHierarchyProps) {
  const hierarchy = useMemo(
    () => getCareerHierarchy(activeCareer.career_name),
    [activeCareer.career_name]
  );

  const specializations = useMemo(
    () => hierarchy?.path.specializations ?? [],
    [hierarchy]
  );

  const [selectedSpecId, setSelectedSpecId] = useState<string>(() => {
    return specializations[0]?.id ?? "";
  });

  // Keep selectedSpecId synced when active career changes
  const activeSpec = useMemo(() => {
    return (
      specializations.find((s) => s.id === selectedSpecId) ||
      specializations[0] ||
      null
    );
  }, [specializations, selectedSpecId]);

  if (!hierarchy) return null;

  return (
    <div
      className="w-full relative select-none"
      id="progressive-hierarchy-section"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* ── 1. WHERE THIS CAN LEAD (Specialization Layer) ─────────────── */}
        <div className="w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2.5">
            <span>WHERE THIS CAN LEAD</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            Where this career can lead
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal mb-5 max-w-xl mx-auto leading-relaxed">
            There are several distinct directions you can take within <span className="text-white font-medium">{hierarchy.path.name}</span>. Select an area to explore specific career roles:
          </p>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
            {specializations.map((spec) => {
              const isSelected = activeSpec?.id === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedSpecId(spec.id)}
                  className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border relative flex flex-col justify-between h-full group ${
                    isSelected
                      ? "bg-[#141920] border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/40"
                      : "bg-[#10141A] border-border/80 hover:border-cyan-500/40 hover:bg-[#141920]"
                  }`}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                        Career Area
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shrink-0">
                          <CheckCircle2 className="h-3 w-3" />
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Specialization title container with consistent 2-line height */}
                    <div className="min-h-[2.85rem] sm:min-h-[3.25rem] flex items-start mb-2">
                      <h3
                        className={`text-base sm:text-lg font-heading font-bold transition-colors leading-snug break-words ${
                          isSelected ? "text-cyan-200" : "text-white group-hover:text-cyan-300"
                        }`}
                      >
                        {spec.name}
                      </h3>
                    </div>

                    {/* Specialization description: 3-4 lines without aggressive clipping */}
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-4 flex-1">
                      {spec.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{spec.roles.length} Roles</span>
                    <span className={isSelected ? "text-cyan-300 font-semibold" : "text-slate-400 group-hover:text-slate-200"}>
                      {isSelected ? "Currently exploring" : "Explore area →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Downward connector filament from active spec to roles */}
        <div className="w-px h-8 bg-linear-to-b from-cyan-400/60 to-cyan-500/30 my-4" />

        {/* ── 2. CAREERS YOU COULD EXPLORE (Role Layer) ────────────────── */}
        <AnimatePresence mode="wait">
          {activeSpec && activeSpec.roles.length > 0 && (
            <motion.div
              key={activeSpec.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                <span>CAREERS YOU COULD EXPLORE</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 text-center">
                Careers you could explore in {activeSpec.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mb-5 font-normal text-center max-w-xl mx-auto leading-relaxed">
                Actual career roles you could eventually pursue within this direction:
              </p>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
                {activeSpec.roles.map((role) => (
                  <Link
                    key={role.id}
                    href={`/career/${hierarchy.path.slug}#roadmap`}
                    className="p-4 sm:p-4.5 rounded-xl bg-[#10141A] border border-border/80 hover:border-cyan-400/60 hover:bg-[#141920] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-xs"
                  >
                    <div className="flex flex-col flex-1">
                      {/* Role Header: Indicator Dot + Complete Title (wraps up to 2 lines, never truncated) + Arrow */}
                      <div className="min-h-[2.85rem] sm:min-h-[3.25rem] flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                              role.isEntryLevel ? "bg-cyan-400" : "bg-sky-400"
                            }`}
                          />
                          <h4 className="text-sm sm:text-base font-heading font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug break-words">
                            {role.title}
                          </h4>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>

                      {/* Role Description: 3-4 lines without aggressive clipping */}
                      <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-4 flex-1 mb-2">
                        {role.description || "Core professional role in this career specialization."}
                      </p>
                    </div>

                    {/* Role Footer: Experience Level Badge + View Roadmap CTA */}
                    <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                      <span
                        className={`px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                          role.isEntryLevel
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                            : "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                        }`}
                      >
                        {role.isEntryLevel ? "Entry Level" : "Mid/Senior"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-medium group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:text-cyan-200 transition-all shrink-0">
                        <span>View roadmap</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Roadmap Preview Bar */}
              <div className="mt-4 pt-3 border-t border-border/40 w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1117]/60 rounded-xl px-4 py-3 border border-cyan-500/20">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Roadmap Preview
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {hierarchy.path.name}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-normal text-slate-400 mt-0.5">
                    Phased milestones, Class 11–12 subject choices & degree pathways
                  </p>
                </div>
                <Link
                  href={`/career/${hierarchy.path.slug}#roadmap`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-cyan-400/90 hover:text-cyan-300 transition-colors shrink-0 group/preview"
                >
                  <span>Preview milestones</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/preview:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
