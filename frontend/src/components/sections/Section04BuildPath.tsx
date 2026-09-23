"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Milestone {
  phase: string;
  name: string;
  objective: string;
  deliverable: string;
}

const MILESTONES: Milestone[] = [
  {
    phase: "01",
    name: "Foundation",
    objective: "Establish fundamental mental models, mathematical intuition, and domain principles.",
    deliverable: "Conceptual literacy & core analytical baseline",
  },
  {
    phase: "02",
    name: "Core Skills",
    objective: "Master the fundamental technical languages, tooling pipelines, and operational paradigms.",
    deliverable: "Hands-on execution competency & tool fluency",
  },
  {
    phase: "03",
    name: "Projects",
    objective: "Build end-to-end applications and research papers to forge verifiable proof of work.",
    deliverable: "Deployable portfolio & demonstrable implementations",
  },
  {
    phase: "04",
    name: "Specialization",
    objective: "Deep-dive into high-leverage sub-domains, architectural nuances, and performance tuning.",
    deliverable: "Specialized niche mastery & distinct competitive edge",
  },
  {
    phase: "05",
    name: "Career Ready",
    objective: "Calibrate for industry hiring, technical interview systems, and professional deployment.",
    deliverable: "Verified readiness score & targeted resume profile",
  },
];

export function Section04BuildPath() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <section className="py-20 md:py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* ── Section Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-4 block">
              04
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Build Your Path
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
              Every chosen direction unfolds into five sequential milestones. Focus on one phase at a time without getting lost in granular noise.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141210] border border-border/70 text-xs font-mono text-muted-foreground self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Milestone Trajectory</span>
          </div>
        </div>

        {/* ── Vertical Roadmap Trajectory ──────────────────────────── */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Connecting Guide Spine */}
          <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-px bg-border/60 z-0" />

          <div className="space-y-4 relative z-10">
            {MILESTONES.map((milestone, idx) => {
              const isSelected = idx === activePhaseIndex;

              return (
                <div
                  key={milestone.phase}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-[#1C1814] border-primary/60 shadow-lg shadow-amber-950/20"
                      : "bg-[#141210]/70 border-border/60 hover:border-border hover:bg-[#161412]"
                  }`}
                >
                  {/* Milestone Node Badge */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "bg-[#1A1612] text-muted-foreground border border-border/70"
                    }`}
                  >
                    {milestone.phase}
                  </div>

                  {/* Content details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <h4
                        className={`font-heading text-base sm:text-lg font-bold tracking-tight ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {milestone.name}
                      </h4>
                      <span className="text-[11px] font-mono text-muted-foreground/80">
                        Milestone {milestone.phase} of 05
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed mb-3 font-light">
                      {milestone.objective}
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161412] border border-border/60 text-[11px] font-mono text-muted-foreground">
                      <span className="text-primary font-semibold">Key Outcome:</span>
                      <span className="truncate">{milestone.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom link to assessment */}
          <div className="mt-8 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Unlock your custom roadmap through the assessment</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
