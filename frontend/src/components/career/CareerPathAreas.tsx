"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Sparkles,
  Map,
  Layers,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCareerHierarchy,
  type CareerHierarchyMatch,
  type CareerSpecialization,
  type CareerRole,
} from "@/lib/career-hierarchy";
import type { CareerIntelligence } from "@/lib/career-intelligence";

interface CareerPathAreasProps {
  career: CareerIntelligence;
  hierarchy?: CareerHierarchyMatch;
  initialSpecId?: string;
  onSelectRole?: (role: CareerRole) => void;
}

export function CareerPathAreas({
  career,
  hierarchy: propHierarchy,
  initialSpecId,
  onSelectRole,
}: CareerPathAreasProps) {
  const hierarchy = useMemo(() => {
    if (propHierarchy) return propHierarchy;
    return getCareerHierarchy(career.slug) || getCareerHierarchy(career.title);
  }, [propHierarchy, career.slug, career.title]);

  const specializations = useMemo(() => {
    return hierarchy?.path.specializations ?? [];
  }, [hierarchy]);

  const totalRoles = useMemo(() => {
    return specializations.reduce((acc, s) => acc + s.roles.length, 0);
  }, [specializations]);

  const [selectedSpecId, setSelectedSpecId] = useState<string>(() => {
    if (initialSpecId && specializations.some((s) => s.id === initialSpecId)) {
      return initialSpecId;
    }
    return specializations[0]?.id ?? "";
  });

  // Handle URL deep-linking (e.g. /career/cybersecurity?spec=sec-operations)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSpec = params.get("spec");
      if (urlSpec && specializations.some((s) => s.id === urlSpec)) {
        setSelectedSpecId(urlSpec);
      }
    }
  }, [specializations]);

  const activeSpec = useMemo(() => {
    return (
      specializations.find((s) => s.id === selectedSpecId) ||
      specializations[0] ||
      null
    );
  }, [specializations, selectedSpecId]);

  if (!hierarchy || specializations.length === 0) return null;

  return (
    <section id="specializations" className="space-y-8 scroll-mt-24">
      {/* ── 1. Career Path Header: Name, Counts, Tagline ─────────── */}
      <div className="pb-5 border-b border-border/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Dynamic canonical count badge — never hardcoded */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-mono font-semibold text-primary shadow-xs">
            <Layers className="h-3.5 w-3.5" />
            <span>
              {specializations.length} Specializations · {totalRoles} Roles
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground/80 bg-[#121620] px-3 py-1 rounded-full border border-border/50">
            {hierarchy.domain.name}
          </span>
        </div>

        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
            {hierarchy.path.name}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light mt-2 max-w-3xl leading-relaxed">
            {hierarchy.path.tagline}
          </p>
        </div>
      </div>

      {/* ── 2. Specializations Overview Grid (3 columns on desktop) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {specializations.length} Specializations
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground/70">
            Select a specialization to inspect its roles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {specializations.map((spec) => {
            const isSelected = activeSpec?.id === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecId(spec.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between h-full group ${
                  isSelected
                    ? "bg-[#141922] border-primary shadow-lg shadow-cyan-950/40 ring-1 ring-primary/40"
                    : "bg-[#0D1117] border-border/80 hover:border-primary/40 hover:bg-[#121620]"
                }`}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                      Specialization
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/40 shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        Exploring
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-base font-heading font-bold transition-colors leading-snug mb-2 ${
                      isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {spec.name}
                  </h4>

                  <p className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-4 flex-1">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground/80 font-medium">
                    {spec.roles.length} {spec.roles.length === 1 ? "role" : "roles"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <span>{isSelected ? "Selected" : "Explore →"}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Roles in Selected Specialization (Progressive Disclosure) ── */}
      <AnimatePresence mode="wait">
        {activeSpec && activeSpec.roles.length > 0 && (
          <motion.div
            key={activeSpec.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-7 rounded-2xl bg-[#0D1117] border border-border/80 shadow-md space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3.5 border-b border-border/50">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    Roles in {activeSpec.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light mt-0.5 max-w-2xl">
                    {activeSpec.description}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground/80 bg-[#121620] px-2.5 py-1 rounded border border-border/40 shrink-0 self-start sm:self-auto">
                {activeSpec.roles.length} {activeSpec.roles.length === 1 ? "role" : "roles"} available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {activeSpec.roles.map((role) => (
                <a
                  key={role.id}
                  href="#roadmap"
                  onClick={() => onSelectRole?.(role)}
                  className="p-4 sm:p-5 rounded-xl bg-[#121620] border border-border/80 hover:border-primary/50 hover:bg-[#161C28] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-xs text-left"
                >
                  <div className="flex flex-col flex-1">
                    {/* Role Header: Indicator Dot + Full Role Title (no truncation) + Arrow */}
                    <div className="min-h-[2.75rem] flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                            role.isEntryLevel ? "bg-primary" : "bg-sky-400"
                          }`}
                        />
                        <h4 className="text-sm font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug wrap-break-word">
                          {role.title}
                        </h4>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-muted-foreground font-normal leading-relaxed line-clamp-4 flex-1 mb-2">
                      {role.description || "Core professional role in this career specialization."}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded uppercase font-semibold shrink-0 ${
                        role.isEntryLevel
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                      }`}
                    >
                      {role.isEntryLevel ? "Entry Level" : "Mid/Senior"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:underline shrink-0">
                      <span>Explore role roadmap</span>
                      <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Navigation to the Curriculum Roadmap */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-border/30">
              <span className="text-muted-foreground text-[11px]">
                Ready to review the learning milestones for {activeSpec.name}?
              </span>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-1.5 font-mono text-primary hover:underline shrink-0"
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
