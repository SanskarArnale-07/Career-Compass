"use client";

import { useState, useMemo } from "react";
import { Layers, Sparkles, CheckCircle2, ChevronRight, Briefcase } from "lucide-react";
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
      className="w-full relative select-none"
      id="progressive-hierarchy-section"
    >
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-2">
          <Layers className="h-3.5 w-3.5" />
          <span>CAREER HIERARCHY · SPATIAL TAXONOMY</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          How Your Career Path Unfolds
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light leading-relaxed">
          Explore deeper into the Career Globe: Domain → Path → Specialization → Concrete Roles.
        </p>
      </div>

      {/* ── Spatial Branching Tree Visualization ─────────────────────── */}
      <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Ambient celestial lighting */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_40%,rgba(0,229,255,0.05),transparent_70%)]" />

        {/* ── LEVEL 1: ROOT DOMAIN NODE ──────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-2xl border-2 border-cyan-400 bg-[#141920] text-foreground shadow-lg shadow-cyan-950/40 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                DOMAIN
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="font-heading text-xs sm:text-sm font-extrabold tracking-tight text-white uppercase">
                {hierarchy.domain.name}
              </span>
            </div>
          </div>

          {/* Sibling Path Switcher if domain contains multiple paths */}
          {hierarchy.domain.paths.length > 1 && (
            <div className="mt-2.5 flex items-center gap-1.5 p-1 rounded-xl bg-[#080A0D]/90 border border-border/80 text-[11px] font-mono">
              <span className="text-slate-500 px-2 py-0.5 uppercase text-[9px]">Paths:</span>
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
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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

          {/* Stem dropping to Path */}
          <div className="w-px h-8 bg-linear-to-b from-cyan-400 to-cyan-500/50" />
        </div>

        {/* ── LEVEL 2: ACTIVE CAREER PATH NODE ───────────────────────── */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-2xl border border-cyan-500/70 bg-[#10141A] text-foreground shadow-md shadow-cyan-950/30 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                PATH
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-heading text-xs sm:text-sm font-bold text-slate-100">
                {hierarchy.path.name}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              {matchScore}% Match
            </span>
          </div>

          {/* Stem dropping to Specializations distribution branch */}
          <div className="w-px h-8 bg-linear-to-b from-cyan-500/50 to-primary/30" />
        </div>

        {/* ── LEVEL 3: SPECIALIZATIONS BRANCHING ─────────────────────── */}
        {specializations.length > 0 && (
          <div className="w-full flex flex-col items-center relative z-10">
            {/* Desktop horizontal branching crossbar */}
            <div className="hidden sm:block relative w-[80%] h-px bg-cyan-500/40">
              {/* Connector drops to specializations */}
              <div className="w-px h-5 bg-cyan-500/50 absolute left-0 top-0" />
              <div className="w-px h-5 bg-cyan-500/50 absolute left-1/2 -translate-x-1/2 top-0" />
              <div className="w-px h-5 bg-cyan-500/50 absolute right-0 top-0" />
            </div>

            {/* Specialization selection nodes */}
            <div className="w-full pt-2 sm:pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {specializations.map((spec) => {
                const isSelected = activeSpec?.id === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setSelectedSpecId(spec.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-300 cursor-pointer border relative flex flex-col justify-between group ${
                      isSelected
                        ? "bg-[#141920] border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/40"
                        : "bg-[#10141A]/90 border-border/80 hover:border-slate-500 hover:bg-[#141920]/80"
                    }`}
                  >
                    {/* Top connector pin */}
                    <div
                      className={`hidden sm:flex absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full items-center justify-center border ${
                        isSelected
                          ? "bg-cyan-400 border-white shadow-sm shadow-cyan-400"
                          : "bg-[#10141A] border-slate-600"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? "bg-slate-950" : "bg-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                          Specialization
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <h4
                        className={`text-xs sm:text-sm font-heading font-bold mb-1 transition-colors ${
                          isSelected ? "text-cyan-200" : "text-slate-100 group-hover:text-white"
                        }`}
                      >
                        {spec.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed line-clamp-2">
                        {spec.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{spec.roles.length} Roles Defined</span>
                      <span className={isSelected ? "text-cyan-300 font-semibold" : "text-slate-500"}>
                        {isSelected ? "Active Focus" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stem dropping from Active Specialization down to Roles */}
            <div className="w-px h-8 bg-linear-to-b from-cyan-400/70 to-cyan-500/20 my-1" />
          </div>
        )}

        {/* ── LEVEL 4: ROLES (Leaf Nodes Branching from Active Spec) ─── */}
        <AnimatePresence mode="wait">
          {activeSpec && activeSpec.roles.length > 0 && (
            <motion.div
              key={activeSpec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center relative z-10"
            >
              {/* Connected role label pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1117] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3 shadow-md">
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  ROLES IN {activeSpec.name.toUpperCase()} ({activeSpec.roles.length})
                </span>
              </div>

              {/* Roles connected node cluster */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {activeSpec.roles.map((role) => (
                  <div
                    key={role.id}
                    className="p-3 rounded-xl bg-[#10141A]/90 border border-border/70 flex items-center justify-between gap-2.5 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          role.isEntryLevel ? "bg-cyan-400" : "bg-sky-400"
                        }`}
                      />
                      <span className="text-xs font-heading font-medium text-slate-200 truncate">
                        {role.title}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${
                        role.isEntryLevel
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                      }`}
                    >
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
