"use client";

import { Target, Cpu, FolderGit2, MapPin, ArrowRight, ArrowDown } from "lucide-react";

interface PathStage {
  step: string;
  name: string;
  title: string;
  description: string;
  icon: typeof Target;
}

const STAGES: PathStage[] = [
  {
    step: "01",
    name: "CAREER",
    title: "Defined Target",
    description: "A clear role aligned with your profile and interests.",
    icon: Target,
  },
  {
    step: "02",
    name: "SKILLS",
    title: "Core Competencies",
    description: "The essential technical & domain tools needed to execute.",
    icon: Cpu,
  },
  {
    step: "03",
    name: "PROJECTS",
    title: "Proof of Work",
    description: "Real-world builds that demonstrate hands-on ability.",
    icon: FolderGit2,
  },
  {
    step: "04",
    name: "ROADMAP",
    title: "Structured Journey",
    description: "A step-by-step path you work through sequentially.",
    icon: MapPin,
  },
];

export function Section04BuildPath() {
  return (
    <section className="py-16 md:py-20 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* ── Section Header ───────────────────────────────────────── */}
        <div className="mb-10 sm:mb-12">
          <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-3 block">
            04
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Build Your Path
          </h2>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
            Once you know your direction, Career Compass turns it into a practical path you can work through step by step.
          </p>
        </div>

        {/* ── Visual Conceptual Pipeline: CAREER → SKILLS → PROJECTS → ROADMAP ── */}
        <div className="rounded-2xl bg-[#12100E] border border-border/70 p-5 sm:p-8 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isLast = idx === STAGES.length - 1;

              return (
                <div key={stage.name} className="flex flex-col md:flex-row items-center">
                  {/* Stage Card */}
                  <div className="w-full flex-1 p-4 rounded-xl border border-border/60 bg-[#10141A] hover:border-border transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {stage.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#141920] border border-border/60 flex items-center justify-center text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-semibold block mb-1">
                      {stage.name}
                    </span>

                    <h3 className="font-heading text-base font-semibold text-foreground mb-1.5">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-secondary-foreground font-light leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Connector Arrow (Desktop right, Mobile down) */}
                  {!isLast && (
                    <div className="py-2 md:py-0 md:px-2 shrink-0 flex items-center justify-center text-muted-foreground/40">
                      <ArrowRight className="h-4 w-4 hidden md:block" />
                      <ArrowDown className="h-4 w-4 block md:hidden" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
