"use client";

import { motion } from "framer-motion";
import { GraduationCap, BrainCircuit, Calculator, Palette, Info } from "lucide-react";
import type { StreamSuitabilityItem } from "@/lib/profile/profile-utils";

interface StreamSuitabilitySectionProps {
  rankedStreams: StreamSuitabilityItem[];
  primaryRecommendation: string;
}

export function StreamSuitabilitySection({
  rankedStreams,
  primaryRecommendation: _primaryRecommendation,
}: StreamSuitabilitySectionProps) {
  const getStreamIcon = (key: string) => {
    switch (key) {
      case "science":
        return <BrainCircuit className="h-4 w-4 text-cyan-400" />;
      case "commerce":
        return <Calculator className="h-4 w-4 text-sky-400" />;
      case "arts":
        return <Palette className="h-4 w-4 text-indigo-400" />;
      default:
        return <GraduationCap className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Academic Stream Suitability
          </h2>
          <p className="text-xs text-muted-foreground">
            Foundation study pathways aligned with your cognitive profile
          </p>
        </div>
      </div>

      {/* Streams list */}
      <div className="space-y-3">
        {rankedStreams.map((stream, idx) => {
          const isTop = idx === 0;
          return (
            <div
              key={stream.key}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-2.5 ${
                isTop
                  ? "border-primary/40 bg-primary/5 shadow-xs shadow-primary/10"
                  : "border-border/60 bg-[#0B0E12]/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-[#141920] border border-border/70 shrink-0">
                    {getStreamIcon(stream.key)}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                      {stream.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {stream.subjects}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono border ${stream.badgeClass}`}>
                    {stream.badgeLabel}
                  </span>
                  <div className="text-xs font-mono font-bold text-foreground mt-1 tabular-nums">
                    {stream.score}%
                  </div>
                </div>
              </div>

              {/* Relative progress bar */}
              <div className="h-1.5 w-full rounded-full bg-[#10141A] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, stream.score)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    isTop ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted-foreground/40"
                  }`}
                />
              </div>

              {/* Foundation guidance */}
              <p className="text-[11px] text-secondary-foreground/90 leading-relaxed">
                {stream.guidance}
              </p>
            </div>
          );
        })}
      </div>

      {/* Guidance Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0B0E12] border border-border/60 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed">
          Stream alignment helps select subject electives and entrance exam tracks (e.g. JEE, CUET, SAT) that feed directly into your target careers.
        </span>
      </div>
    </div>
  );
}
