"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface DirectionFlow {
  id: string;
  profileTraits: string;
  domain: string;
  path: string;
}

const FLOWS: DirectionFlow[] = [
  {
    id: "tech",
    profileTraits: "Analytical + Technical",
    domain: "Engineering & Technology",
    path: "Software Engineering",
  },
  {
    id: "data",
    profileTraits: "Analytical + Scientific",
    domain: "Data & AI",
    path: "Machine Learning & AI",
  },
  {
    id: "design",
    profileTraits: "Creative + Social",
    domain: "Design & Creative",
    path: "Product & UX Design",
  },
  {
    id: "business",
    profileTraits: "Business + Leadership",
    domain: "Business & Management",
    path: "Product Management",
  },
];

export function Section02FindDirection() {
  const [activeFlowId, setActiveFlowId] = useState<string>(FLOWS[0].id);

  return (
    <section className="py-16 md:py-20 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="mb-10 sm:mb-12">
          <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-3 block">
            02
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Discover Your Direction
          </h2>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
            Your results highlight the career directions that align most closely with your profile.
          </p>
        </div>

        {/* ── Conceptual Transformation Diagram ──────────────────── */}
        <div className="rounded-2xl bg-[#12100E] border border-border/70 p-5 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C8922A_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Flow Column Headers: YOUR PROFILE → CAREER DOMAINS → CAREER PATHS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 pb-4 border-b border-border/50 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">01</span>
              <span>Your Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">02</span>
              <span>Career Domains</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">03</span>
              <span>Career Paths</span>
            </div>
          </div>

          {/* Interactive Pipeline Transformation Rows */}
          <div className="space-y-2.5 relative z-10">
            {FLOWS.map((flow) => {
              const isSelected = flow.id === activeFlowId;

              return (
                <div
                  key={flow.id}
                  onClick={() => setActiveFlowId(flow.id)}
                  onMouseEnter={() => setActiveFlowId(flow.id)}
                  className={`grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer items-center ${
                    isSelected
                      ? "bg-[#1C1814] border-primary/50 shadow-md shadow-amber-950/20"
                      : "bg-[#161412]/50 border-border/50 hover:border-border hover:bg-[#161412]"
                  }`}
                >
                  {/* Stage 1: Your Profile */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isSelected ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {flow.profileTraits}
                    </span>
                  </div>

                  {/* Stage 2: Career Domains */}
                  <div className="flex items-center gap-2.5">
                    <ArrowRight
                      className={`h-3.5 w-3.5 shrink-0 hidden md:block ${
                        isSelected ? "text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded border ${
                        isSelected
                          ? "text-foreground bg-[#221D17] border-border/80"
                          : "text-muted-foreground/80 bg-[#161412] border-transparent"
                      }`}
                    >
                      {flow.domain}
                    </span>
                  </div>

                  {/* Stage 3: Career Paths */}
                  <div className="flex items-center gap-2.5">
                    <ArrowRight
                      className={`h-3.5 w-3.5 shrink-0 hidden md:block ${
                        isSelected ? "text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {flow.path}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
