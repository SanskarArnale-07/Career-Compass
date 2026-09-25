"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Briefcase, ArrowRight, Sparkles, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCareerHierarchy, type CareerHierarchyMatch } from "@/lib/career-hierarchy";
import type { CareerIntelligence } from "@/lib/career-intelligence";

interface CareerPathAreasProps {
  career: CareerIntelligence;
  hierarchy?: CareerHierarchyMatch;
}

export function CareerPathAreas({ career, hierarchy: propHierarchy }: CareerPathAreasProps) {
  const hierarchy = useMemo(() => {
    if (propHierarchy) return propHierarchy;
    return getCareerHierarchy(career.slug) || getCareerHierarchy(career.title);
  }, [propHierarchy, career.slug, career.title]);

  const specializations = useMemo(() => {
    return hierarchy?.path.specializations ?? [];
  }, [hierarchy]);

  const [selectedSpecId, setSelectedSpecId] = useState<string>(() => {
    return specializations[0]?.id ?? "";
  });

  const activeSpec = useMemo(() => {
    return (
      specializations.find((s) => s.id === selectedSpecId) ||
      specializations[0] ||
      null
    );
  }, [specializations, selectedSpecId]);

  if (!hierarchy || specializations.length === 0) return null;

  return (
    <section id="areas-and-roles" className="space-y-6">
      {/* ── Section Title ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Specialization & Role Architecture</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Explore areas within {hierarchy.path.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
            Choose an area of specialization to reveal its specific career roles and learning trajectories.
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground/70 shrink-0">
          {specializations.length} specializations available
        </span>
      </div>

      {/* ── Level 1: Specialization Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {specializations.map((spec) => {
          const isSelected = activeSpec?.id === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedSpecId(spec.id)}
              className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between h-full group ${
                isSelected
                  ? "bg-[#141922] border-primary shadow-lg shadow-cyan-950/40 ring-1 ring-primary/40"
                  : "bg-[#0D1117] border-border/80 hover:border-primary/40 hover:bg-[#121620]"
              }`}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                    Specialization
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/40 shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Exploring
                    </span>
                  )}
                </div>

                <div className="min-h-10 sm:min-h-[2.85rem] flex items-start mb-1.5">
                  <h3
                    className={`text-sm sm:text-base font-heading font-bold transition-colors leading-snug wrap-break-word ${
                      isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {spec.name}
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-4 flex-1">
                  {spec.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground/80">{spec.roles.length} Roles</span>
                <span
                  className={
                    isSelected
                      ? "text-primary font-semibold"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                >
                  {isSelected ? "Selected" : "Explore →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Level 2: Roles within Selected Specialization ─────────── */}
      <AnimatePresence mode="wait">
        {activeSpec && activeSpec.roles.length > 0 && (
          <motion.div
            key={activeSpec.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 rounded-2xl bg-[#0D1117] border border-border/80 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary shrink-0" />
                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Career Roles in {activeSpec.name}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Click any role to explore its learning roadmap
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 items-stretch">
              {activeSpec.roles.map((role) => (
                <a
                  key={role.id}
                  href="#roadmap"
                  className="p-3.5 sm:p-4 rounded-xl bg-[#121620] border border-border/80 hover:border-primary/50 hover:bg-[#161C28] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-xs"
                >
                  <div className="flex flex-col flex-1">
                    {/* Role Header: Indicator Dot + Full Role Title (no truncate) + Arrow */}
                    <div className="min-h-[2.65rem] sm:min-h-12 flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                            role.isEntryLevel ? "bg-primary" : "bg-sky-400"
                          }`}
                        />
                        <h4 className="text-xs sm:text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug wrap-break-word">
                          {role.title}
                        </h4>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-4 flex-1 mb-2">
                      {role.description || "Core professional role in this career specialization."}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${
                        role.isEntryLevel
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                      }`}
                    >
                      {role.isEntryLevel ? "Entry Level" : "Mid/Senior"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:underline shrink-0">
                      <span>View roadmap</span>
                      <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Link to Phased Roadmap */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">
                Ready to review the milestones for this discipline?
              </span>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-1.5 font-mono text-primary hover:underline"
              >
                <Map className="h-3.5 w-3.5" />
                <span>Jump to Phased Roadmap</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
