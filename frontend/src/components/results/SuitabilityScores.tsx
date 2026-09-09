"use client";

import { BrainCircuit, Calculator, Palette } from "lucide-react";

interface SuitabilityScoresProps {
  scores: {
    science: number;
    commerce: number;
    arts: number;
  };
  descriptions?: Record<string, string>;
}

export function SuitabilityScores({ scores, descriptions = {} }: SuitabilityScoresProps) {
  
  const getStreamAlignment = (rank: number) => {
    if (rank === 0) return { label: "Strong alignment", badge: "bg-primary/15 text-primary border-primary/30" };
    if (rank === 1) return { label: "Good alignment", badge: "bg-secondary/15 text-secondary border-secondary/30" };
    return { label: "Also worth exploring", badge: "bg-slate-800 text-slate-300 border-slate-700" };
  };

  const streams = [
    {
      name: "Science (PCM / PCB)",
      key: "science",
      score: scores.science,
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      color: "bg-primary",
      bgClass: "bg-primary/15 border border-primary/25",
      description: descriptions.science || "Connects with analytical, technical, and empirical investigation questions."
    },
    {
      name: "Commerce & Economics",
      key: "commerce",
      score: scores.commerce,
      icon: <Calculator className="h-6 w-6 text-secondary" />,
      color: "bg-secondary",
      bgClass: "bg-secondary/15 border border-secondary/25",
      description: descriptions.commerce || "Connects with business, structured analysis, and organizational thinking."
    },
    {
      name: "Arts & Humanities",
      key: "arts",
      score: scores.arts,
      icon: <Palette className="h-6 w-6 text-sky-400" />,
      color: "bg-sky-400",
      bgClass: "bg-sky-400/15 border border-sky-400/25",
      description: descriptions.arts || "Connects with creative expression, social perspective, and exploratory inquiry."
    }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-card border border-border shadow-md rounded-2xl p-6 md:p-8 w-full">
      <div className="mb-6">
        <h3 className="font-heading text-2xl font-bold mb-2 text-foreground">
          Academic Stream Alignment
        </h3>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Based on your assessment responses, here is how your current interests connect with major 11th-grade academic pathways.
        </p>
      </div>

      <div className="space-y-5">
        {streams.map((stream, index) => {
          const alignment = getStreamAlignment(index);
          return (
            <div
              key={stream.key}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                index === 0
                  ? "border-primary/40 bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border bg-[#0F172A]/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stream.bgClass} shrink-0`}>
                    {stream.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">
                      {stream.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stream.description}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${alignment.badge}`}
                  >
                    {alignment.label}
                  </span>
                </div>
              </div>

              {/* Relative spectrum indicator without raw numbers */}
              <div className="mt-3 h-2 w-full bg-[#0B1220] rounded-full overflow-hidden border border-border/80 p-0.5">
                <div
                  className={`h-full rounded-full ${stream.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.max(25, Math.min(95, stream.score * 1.5))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
