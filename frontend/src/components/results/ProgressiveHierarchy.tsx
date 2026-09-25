"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Layers, CheckCircle2 } from "lucide-react";
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
  onSelectCareer,
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

  const matchScore = Math.round(activeCareer.match_percentage);

  return (
    <div
      className="w-full rounded-2xl border border-border/80 bg-[#10141A]/95 p-5 sm:p-7 shadow-xl relative overflow-hidden"
      id="progressive-hierarchy-section"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Career Hierarchy</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            How Your Career Path Unfolds
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-light">
            Domain → Path → Specialization → Role
          </p>
        </div>

        {/* Canonical Career Path Switcher for current domain */}
        {hierarchy.domain.paths.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080A0D] border border-border/70">
            {hierarchy.domain.paths.map((p) => {
              const isCurrent = p.id === hierarchy.path.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (onSelectCareer) onSelectCareer(p.careerName);
                    if (p.specializations[0]) {
                      setSelectedSpecId(p.specializations[0].id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-5">
        {/* Step 1 & 2: Domain → Career Path */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[#141920]/80 border border-border/70 text-xs">
          {/* Domain Node */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Domain:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 font-semibold text-cyan-300">
              {hierarchy.domain.name}
            </span>
          </div>

          <ChevronRight className="hidden sm:block h-3.5 w-3.5 text-slate-600 shrink-0" />

          {/* Career Path Node */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
              Career Path:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#080A0D] border border-cyan-500/30 font-bold text-slate-100 flex items-center gap-1.5">
              <span>{hierarchy.path.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {matchScore}%
              </span>
            </span>
          </div>
        </div>

        {/* Step 3: Specialization Selection */}
        {specializations.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Select a Specialization</span>
                <span className="text-[10px] font-normal text-slate-500">
                  (Reveals concrete roles)
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {specializations.map((spec) => {
                const isSelected = activeSpec?.id === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setSelectedSpecId(spec.id)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500/40"
                        : "bg-[#141920]/60 border-border/70 hover:border-slate-600 hover:bg-[#141920]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-cyan-300" : "text-slate-200"
                        }`}
                      >
                        {spec.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 font-light leading-snug">
                      {spec.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Progressively Revealed Roles */}
        <AnimatePresence mode="wait">
          {activeSpec && activeSpec.roles.length > 0 && (
            <motion.div
              key={activeSpec.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-3.5 sm:p-4 rounded-xl bg-[#0B0E12] border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Roles in {activeSpec.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {activeSpec.roles.length} roles
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeSpec.roles.map((role) => (
                  <div
                    key={role.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141920] border border-border/70 text-xs text-slate-200"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        role.isEntryLevel ? "bg-cyan-400" : "bg-sky-400"
                      }`}
                    />
                    <span>{role.title}</span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {role.isEntryLevel ? "Entry" : "Mid/Senior"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
