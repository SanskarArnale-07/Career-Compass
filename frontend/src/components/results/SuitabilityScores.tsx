"use client";

import { BrainCircuit, Calculator, Palette } from "lucide-react";

interface SuitabilityScoresProps {
  scores: {
    science: number;
    commerce: number;
    arts: number;
  };
  descriptions?: Record<string, string>;
  recommendation?: string;
}

export function SuitabilityScores({
  scores,
  descriptions = {},
  recommendation,
}: SuitabilityScoresProps) {
  const getStreamAlignment = (rank: number) => {
    if (rank === 0)
      return {
        label: "Strong alignment",
        badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    if (rank === 1)
      return {
        label: "Good alignment",
        badge: "bg-sky-500/10 text-sky-300 border-sky-500/25",
      };
    return {
      label: "Worth exploring",
      badge: "bg-[#141920] text-slate-400 border-border/80",
    };
  };

  const streams = [
    {
      name: "Science (PCM / PCB)",
      key: "science",
      score: scores.science,
      icon: <BrainCircuit className="h-4 w-4 text-cyan-400" />,
      color: "bg-cyan-400",
      bgClass: "bg-cyan-500/10 border border-cyan-500/20",
      description:
        descriptions.science ||
        "Connects with analytical, technical, and empirical investigation questions.",
    },
    {
      name: "Commerce & Economics",
      key: "commerce",
      score: scores.commerce,
      icon: <Calculator className="h-4 w-4 text-sky-400" />,
      color: "bg-sky-400",
      bgClass: "bg-sky-500/10 border border-sky-500/20",
      description:
        descriptions.commerce ||
        "Connects with business, structured analysis, and organizational thinking.",
    },
    {
      name: "Arts & Humanities",
      key: "arts",
      score: scores.arts,
      icon: <Palette className="h-4 w-4 text-indigo-400" />,
      color: "bg-indigo-400",
      bgClass: "bg-indigo-500/10 border border-indigo-500/20",
      description:
        descriptions.arts ||
        "Connects with creative expression, social perspective, and exploratory inquiry.",
    },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full space-y-4">
      {/* Section Header - Normalized to established Results-page scale */}
      <div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          Academic Stream Alignment
        </h3>
        <p className="text-sm sm:text-base text-slate-300 font-normal mt-1 leading-relaxed max-w-xl">
          Based on your assessment responses, here is how your current interests connect with major foundation pathways.
        </p>
      </div>

      <div className="space-y-3">
        {streams.map((stream, index) => {
          const alignment = getStreamAlignment(index);
          return (
            <div
              key={stream.key}
              className={`p-4 rounded-xl border transition-all ${
                index === 0
                  ? "border-cyan-500/40 bg-cyan-950/20 shadow-xs shadow-cyan-950/20"
                  : "border-border/70 bg-[#141920]/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stream.bgClass} shrink-0 mt-0.5 sm:mt-0`}>
                    {stream.icon}
                  </div>
                  <div>
                    <h4 className="font-heading text-base sm:text-lg font-bold text-slate-100">
                      {stream.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal leading-relaxed">
                      {stream.description}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${alignment.badge}`}
                  >
                    {alignment.label}
                  </span>
                </div>
              </div>

              {/* Relative spectrum indicator */}
              <div className="h-2 w-full bg-[#080A0D] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stream.color} transition-all duration-700 ease-out`}
                  style={{
                    width: `${Math.max(25, Math.min(95, stream.score * 1.5))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stream Recommendation Text */}
      {recommendation && (
        <div className="p-4 sm:p-5 rounded-xl border border-cyan-500/20 bg-cyan-950/15">
          <h4 className="font-heading text-base sm:text-lg font-bold text-cyan-300 mb-1.5">
            Stream Recommendation
          </h4>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}
