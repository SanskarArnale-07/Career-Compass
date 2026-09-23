"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface MatchingPipelineStage {
  id: string;
  name: string;
  domain: string;
  targetPath: string;
  affinity: string;
}

const TRAIT_FLOWS: MatchingPipelineStage[] = [
  { id: "an-te", name: "Analytical + Technical", domain: "Engineering", targetPath: "Software Engineering", affinity: "92% Fit" },
  { id: "an-sc", name: "Analytical + Scientific", domain: "Data & AI", targetPath: "Machine Learning & AI", affinity: "88% Fit" },
  { id: "cr-so", name: "Creative + Social", domain: "Design", targetPath: "Product & UX Design", affinity: "84% Fit" },
  { id: "bu-le", name: "Business + Leadership", domain: "Management", targetPath: "Product Management", affinity: "81% Fit" },
];

export function Section02FindDirection() {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const activeFlow = TRAIT_FLOWS[activeFlowIndex];

  return (
    <section className="py-20 md:py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* ── Section Header with Editorial 02 ─────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-4 block">
              02
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Find Your Direction
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
              Raw cognitive signals filter into domain suitability, which resolves into actionable career trajectories.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141210] border border-border/70 text-xs font-mono text-muted-foreground self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Matching Algorithm Pipeline</span>
          </div>
        </div>

        {/* ── Visual Transition: 8 Traits → Career Domains → Career Paths ─ */}
        <div className="relative rounded-2xl bg-[#12100E] border border-border/70 p-6 sm:p-10 shadow-xl overflow-hidden">
          
          {/* Subtle background flow lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C8922A_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Stepper Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-border/50 pb-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">STAGE 01</span>
              <span>8 Trait Matrix</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">STAGE 02</span>
              <span>Career Domains</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">STAGE 03</span>
              <span>Career Paths</span>
            </div>
          </div>

          {/* Interactive Pipeline Rows */}
          <div className="space-y-3 relative z-10">
            {TRAIT_FLOWS.map((flow, idx) => {
              const isSelected = idx === activeFlowIndex;

              return (
                <div
                  key={flow.id}
                  onClick={() => setActiveFlowIndex(idx)}
                  onMouseEnter={() => setActiveFlowIndex(idx)}
                  className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 rounded-xl border transition-all duration-300 cursor-pointer items-center ${
                    isSelected
                      ? "bg-[#1C1814] border-primary/60 shadow-lg shadow-amber-950/20"
                      : "bg-[#161412]/50 border-border/50 hover:border-border hover:bg-[#161412]"
                  }`}
                >
                  {/* Stage 1: Trait cluster */}
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-primary shadow-sm shadow-primary" : "bg-muted-foreground/30"}`} />
                    <span className={`text-sm font-medium ${isSelected ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {flow.name}
                    </span>
                  </div>

                  {/* Stage 2: Domain vector */}
                  <div className="flex items-center gap-3">
                    <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                    <span className={`text-sm font-heading font-medium px-2.5 py-0.5 rounded ${isSelected ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"}`}>
                      {flow.domain}
                    </span>
                  </div>

                  {/* Stage 3: Career Path & Affinity Signal */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                      <span className={`text-sm ${isSelected ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                        {flow.targetPath}
                      </span>
                    </div>

                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      isSelected
                        ? "text-primary border-primary/30 bg-primary/10 font-bold"
                        : "text-muted-foreground/60 border-transparent"
                    }`}>
                      {flow.affinity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Flow Pipeline Explainer Footer */}
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <div>
              <span className="text-muted-foreground">Active Calibration: </span>
              <span className="text-foreground font-semibold">{activeFlow.name}</span>
              <span className="mx-2 text-border">→</span>
              <span className="text-primary font-semibold">{activeFlow.domain} Domain</span>
              <span className="mx-2 text-border">→</span>
              <span className="text-foreground font-semibold">{activeFlow.targetPath}</span>
            </div>
            <div className="text-primary/80">
              Confidence Index: <strong className="text-primary">{activeFlow.affinity}</strong>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
