"use client";

import { Sparkles, Target, GitBranch, Zap } from "lucide-react";
import type { WhyFitReasoning } from "@/lib/profile/profile-utils";

interface WhyFitSectionProps {
  reasoning: WhyFitReasoning;
}

export function WhyFitSection({ reasoning }: WhyFitSectionProps) {
  const getPillarIcon = (name: string) => {
    switch (name) {
      case "Target":
        return <Target className="h-4 w-4 text-primary" />;
      case "Sparkles":
        return <Zap className="h-4 w-4 text-secondary" />;
      case "GitBranch":
        return <GitBranch className="h-4 w-4 text-cyan-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-[#10141A] to-[#0B0E12] p-5 sm:p-6 space-y-4 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Why These Careers Fit You
          </h2>
          <p className="text-xs text-primary/80 font-mono">
            {reasoning.headline}
          </p>
        </div>
      </div>

      {/* Narrative */}
      <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
        {reasoning.narrative}
      </p>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {reasoning.pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-border/70 bg-[#0B0E12]/90 space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#141920] border border-border/80">
                {getPillarIcon(pillar.iconName)}
              </div>
              <h3 className="text-xs font-semibold text-foreground">
                {pillar.title}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
