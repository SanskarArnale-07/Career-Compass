"use client";

import type { MotionValue } from "framer-motion";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { smallLabel } from "./typography";

// Canonical data from @/lib/career-hierarchy — never fabricated
const canonicalDomain = CAREER_DOMAINS[0]; // Engineering & Technology
const pathSoftware = canonicalDomain.paths[0]; // Software Development
const pathSystems = canonicalDomain.paths[1]; // Core & Systems Engineering

const specWeb = pathSoftware.specializations[0]; // Web & Application Engineering
const specSystems = pathSoftware.specializations[1]; // Systems & Cloud Architecture
const specMobile = pathSoftware.specializations[2]; // Mobile & Platforms

const webRoles = specWeb.roles; // Frontend, Backend, Full Stack

interface BranchingCareerTreeProps {
  /** Optional Framer Motion progress value across the scene */
  progress?: MotionValue<number>;
  /** If true, render in static mode without scroll-driven transforms */
  isStatic?: boolean;
  /** Hide internal sub-header when used in Shared Headline Slot */
  hideHeader?: boolean;
}

export function BranchingCareerTree({ isStatic: _isStatic = false, hideHeader = false }: BranchingCareerTreeProps) {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* ── Neutral Pre-Assessment Sub-Header ──────────────────────────── */}
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2 ${smallLabel} text-[11px] sm:text-xs`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Example Branch &middot; Canonical Taxonomy</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Pre-assessment illustrative model. Your assessment will map the specific domains and paths tailored to you.
          </p>
        </div>
      )}

      {/* ── Desktop & Tablet View (Wide Branching Tree) ────────────────── */}
      <div className="hidden md:flex flex-col items-center w-full max-w-4xl mx-auto">
        {/* LEVEL 0: ROOT DOMAIN */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-xl border border-primary bg-[#141920] text-foreground shadow-lg shadow-cyan-950/40 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-heading text-sm lg:text-base font-bold tracking-tight">
              {canonicalDomain.name.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80 border border-primary/40 rounded px-1.5 py-0.5">
              Domain
            </span>
          </div>

          {/* Stem dropping to Path branch */}
          <div className="w-px h-6 bg-linear-to-b from-primary to-primary/40" />
        </div>

        {/* LEVEL 1: PATHS BRANCHING */}
        <div className="w-full flex flex-col items-center">
          {/* Horizontal branch line connecting Software & Systems paths */}
          <div className="relative w-[60%] lg:w-[55%] h-px bg-primary/40 flex justify-between">
            <div className="w-px h-5 bg-primary/50 absolute left-0 top-0" />
            <div className="w-px h-5 bg-primary/30 absolute right-0 top-0" />
          </div>

          <div className="w-[60%] lg:w-[55%] flex justify-between pt-5">
            {/* Active Path: Software Development */}
            <div className="flex flex-col items-center -translate-x-1/2">
              <div className="px-3.5 py-1.5 rounded-lg border border-primary/80 bg-[#141920] text-foreground shadow-md shadow-cyan-950/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-heading text-xs lg:text-sm font-semibold">
                  {pathSoftware.name}
                </span>
                <span className="text-[9px] font-mono uppercase text-primary/70">Path</span>
              </div>
              {/* Stem dropping to Specializations */}
              <div className="w-px h-6 bg-linear-to-b from-primary/80 to-primary/30" />
            </div>

            {/* Sibling Path: Core & Systems Engineering */}
            <div className="flex flex-col items-center translate-x-1/2">
              <div className="px-3.5 py-1.5 rounded-lg border border-border/70 bg-[#10141A]/90 text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                <span className="font-heading text-xs lg:text-sm font-medium">
                  {pathSystems.name}
                </span>
                <span className="text-[9px] font-mono uppercase text-muted-foreground/60">Path</span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/50 mt-1 italic">
                (Robotics, Hardware, Civil)
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 2: SPECIALIZATIONS BRANCHING UNDER SOFTWARE */}
        <div className="w-full flex flex-col items-center -mt-0.5">
          {/* Horizontal branch line connecting 3 Specializations */}
          <div className="relative w-[75%] lg:w-[68%] h-px bg-primary/30 flex justify-between">
            <div className="w-px h-5 bg-primary/50 absolute left-0 top-0" />
            <div className="w-px h-5 bg-primary/30 absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="w-px h-5 bg-primary/30 absolute right-0 top-0" />
          </div>

          <div className="w-[75%] lg:w-[68%] flex justify-between pt-5">
            {/* Spec 1 (Active): Web & Application Engineering */}
            <div className="flex flex-col items-center -translate-x-1/4">
              <div className="px-3 py-1.5 rounded-md border border-primary/70 bg-[#141920] text-foreground text-center">
                <p className="font-heading text-[11px] lg:text-xs font-semibold">
                  {specWeb.name}
                </p>
                <span className="text-[9px] font-mono text-primary/70">Specialization</span>
              </div>
              {/* Stem dropping to Roles */}
              <div className="w-px h-6 bg-linear-to-b from-primary/70 to-primary/20" />
            </div>

            {/* Spec 2: Systems & Cloud */}
            <div className="flex flex-col items-center">
              <div className="px-3 py-1.5 rounded-md border border-border/60 bg-[#10141A]/80 text-muted-foreground text-center">
                <p className="font-heading text-[11px] lg:text-xs font-medium">
                  {specSystems.name}
                </p>
                <span className="text-[9px] font-mono text-muted-foreground/50">Specialization</span>
              </div>
            </div>

            {/* Spec 3: Mobile & Platforms */}
            <div className="flex flex-col items-center translate-x-1/4">
              <div className="px-3 py-1.5 rounded-md border border-border/60 bg-[#10141A]/80 text-muted-foreground text-center">
                <p className="font-heading text-[11px] lg:text-xs font-medium">
                  {specMobile.name}
                </p>
                <span className="text-[9px] font-mono text-muted-foreground/50">Specialization</span>
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 3: ROLES BRANCHING UNDER WEB & APPLICATION */}
        <div className="w-full flex flex-col items-center -mt-0.5">
          {/* Horizontal branch line connecting the 3 concrete roles */}
          <div className="relative w-[50%] lg:w-[42%] h-px bg-primary/30 flex justify-between">
            <div className="w-px h-4 bg-primary/40 absolute left-0 top-0" />
            <div className="w-px h-4 bg-primary/40 absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="w-px h-4 bg-primary/50 absolute right-0 top-0" />
          </div>

          <div className="w-[50%] lg:w-[42%] flex justify-between pt-4">
            {webRoles.map((role) => {
              const isHighlight = role.title === "Full Stack Developer";
              return (
                <div key={role.id} className="flex flex-col items-center">
                  <div
                    className={`px-2.5 py-1 rounded-md border text-center transition-all ${
                      isHighlight
                        ? "border-primary bg-[#141920] text-primary shadow-sm shadow-cyan-950/40"
                        : "border-border/60 bg-[#10141A]/90 text-muted-foreground"
                    }`}
                  >
                    <p className={`font-heading text-[10px] lg:text-[11px] font-medium ${isHighlight ? "font-semibold text-foreground" : ""}`}>
                      {role.title}
                    </p>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-primary/60">
                      Role
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile View: Vertical Progressive Tree (No Overflow) ────────── */}
      <div className="flex md:hidden flex-col w-full max-w-sm mx-auto px-2">
        {/* DOMAIN */}
        <div className="flex items-center gap-2 p-2 rounded-lg border border-primary/80 bg-[#141920]">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-heading text-xs font-bold text-foreground truncate">
              {canonicalDomain.name.toUpperCase()}
            </p>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-primary border border-primary/40 rounded px-1 shrink-0">
            Domain
          </span>
        </div>

        {/* BRANCH CONNECTOR LINE WITH CHILDREN */}
        <div className="ml-4 pl-3 border-l-2 border-primary/30 flex flex-col gap-2.5 my-1.5">
          {/* PATH 1: Software Development */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-2 p-1.5 rounded-md border border-primary/60 bg-[#141920]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="font-heading text-xs font-semibold text-foreground truncate">
                {pathSoftware.name}
              </p>
              <span className="text-[8px] font-mono uppercase text-primary ml-auto shrink-0">
                Path
              </span>
            </div>

            {/* SPECIALIZATION 1 UNDER PATH 1 */}
            <div className="ml-3 pl-2.5 border-l border-primary/20 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 p-1 rounded border border-border/80 bg-[#10141A]">
                <span className="w-1 h-1 rounded-full bg-primary/80 shrink-0" />
                <p className="font-heading text-[11px] font-medium text-foreground truncate">
                  {specWeb.name}
                </p>
                <span className="text-[8px] font-mono text-muted-foreground ml-auto shrink-0">
                  Spec
                </span>
              </div>

              {/* ROLES UNDER SPECIALIZATION 1 */}
              <div className="ml-2.5 pl-2 border-l border-primary/20 flex flex-wrap gap-1">
                {webRoles.map((role) => (
                  <span
                    key={role.id}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${
                      role.title === "Full Stack Developer"
                        ? "border-primary/70 bg-[#141920] text-primary font-semibold"
                        : "border-border/60 bg-[#10141A] text-muted-foreground"
                    }`}
                  >
                    {role.title}
                  </span>
                ))}
              </div>

              {/* SIBLING SPECIALIZATIONS */}
              <div className="text-[10px] font-mono text-muted-foreground/60 pl-1">
                + {specSystems.name} &middot; {specMobile.name}
              </div>
            </div>
          </div>

          {/* PATH 2: Core & Systems */}
          <div className="flex items-center gap-2 p-1.5 rounded-md border border-border/50 bg-[#10141A]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
            <p className="font-heading text-[11px] font-medium text-muted-foreground truncate">
              {pathSystems.name}
            </p>
            <span className="text-[8px] font-mono uppercase text-muted-foreground/60 ml-auto shrink-0">
              Path
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
