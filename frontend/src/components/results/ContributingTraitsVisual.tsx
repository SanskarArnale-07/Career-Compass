"use client";

import { useState, useMemo } from "react";
import { Sparkles, BrainCircuit, ChevronDown, ChevronUp } from "lucide-react";

interface ContributingTraitsVisualProps {
  traits: Record<string, number>;
  primaryCareerName?: string;
}

interface TraitItem {
  code: string;
  label: string;
  desc: string;
  score: number;
  isTop: boolean;
  angle: number;
}

const TRAIT_CONFIG = [
  { code: "AN", label: "Analytical", desc: "Structured logic and problem-solving", angle: 0 },
  { code: "TE", label: "Technical", desc: "Digital architecture and system mastery", angle: 45 },
  { code: "SC", label: "Scientific", desc: "Inquiry, testing, and discovery", angle: 90 },
  { code: "BU", label: "Business", desc: "Strategic mindset and organizational value", angle: 135 },
  { code: "CR", label: "Creative", desc: "Novel ideation and visual expression", angle: 180 },
  { code: "SO", label: "Social", desc: "Empathy, human impact, and collaboration", angle: 225 },
  { code: "LE", label: "Leadership", desc: "Initiative, ownership, and team direction", angle: 270 },
  { code: "EX", label: "Exploration", desc: "Adaptability and cross-domain curiosity", angle: 315 },
];

export function ContributingTraitsVisual({
  traits,
  primaryCareerName,
}: ContributingTraitsVisualProps) {
  const [showRemaining, setShowRemaining] = useState(false);

  // Normalize scores from trait_profile
  const normalizedTraits = useMemo(() => {
    if (!traits) return [];

    // Helper to find score by code or full label
    const getScore = (code: string, label: string): number => {
      if (typeof traits[code] === "number") return Math.round(traits[code]);
      if (typeof traits[label] === "number") return Math.round(traits[label]);
      const lower = label.toLowerCase();
      const match = Object.entries(traits).find(
        ([k]) => k.toLowerCase() === lower || k.toLowerCase().startsWith(code.toLowerCase())
      );
      return match ? Math.round(match[1]) : 50;
    };

    const items: TraitItem[] = TRAIT_CONFIG.map((cfg) => ({
      ...cfg,
      score: Math.min(100, Math.max(0, getScore(cfg.code, cfg.label))),
      isTop: false,
    }));

    // Identify top 3 traits
    const sorted = [...items].sort((a, b) => b.score - a.score);
    const topCodes = new Set(sorted.slice(0, 3).map((t) => t.code));

    return items.map((item) => ({
      ...item,
      isTop: topCodes.has(item.code),
    }));
  }, [traits]);

  // Top 3 strongest traits (shown prominently)
  const sortedTraits = useMemo(() => {
    return [...normalizedTraits].sort((a, b) => b.score - a.score);
  }, [normalizedTraits]);

  const top3Traits = useMemo(() => sortedTraits.slice(0, 3), [sortedTraits]);
  const remainingTraits = useMemo(() => sortedTraits.slice(3), [sortedTraits]);

  if (!normalizedTraits.length) return null;

  // Constellation SVG layout coordinates
  const svgSize = 220;
  const center = svgSize / 2;
  const radius = 78;

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-[#10141A]/90 p-5 sm:p-7 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profile DNA</span>
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            Why This Direction Fits You
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl font-light">
            Your strongest contributing traits derived from your assessment responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Compact Constellation Diagram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-55 h-55 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="w-full h-full overflow-visible"
            >
              {/* Radial Guide Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Connecting Spoke Filaments */}
              {normalizedTraits.map((trait) => {
                const rad = (trait.angle * Math.PI) / 180;
                const x = center + radius * Math.cos(rad);
                const y = center + radius * Math.sin(rad);

                return (
                  <line
                    key={`line-${trait.code}`}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke={trait.isTop ? "#00E5FF" : "#334155"}
                    strokeWidth={trait.isTop ? "1.5" : "0.75"}
                    strokeOpacity={trait.isTop ? "0.65" : "0.3"}
                  />
                );
              })}

              {/* Central Core Beacon */}
              <circle cx={center} cy={center} r="6" fill="#00E5FF" opacity="0.3" />
              <circle cx={center} cy={center} r="3" fill="#00E5FF" />

              {/* Trait Nodes along the perimeter */}
              {normalizedTraits.map((trait) => {
                const rad = (trait.angle * Math.PI) / 180;
                const x = center + radius * Math.cos(rad);
                const y = center + radius * Math.sin(rad);

                return (
                  <g key={`node-${trait.code}`}>
                    {/* Glowing outer ring for top traits */}
                    {trait.isTop && (
                      <circle
                        cx={x}
                        cy={y}
                        r="9"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                      />
                    )}
                    {/* Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={trait.isTop ? "5" : "3.5"}
                      fill={trait.isTop ? "#00E5FF" : "#475569"}
                    />
                    {/* Compact Label */}
                    <text
                      x={x + (x > center ? 8 : -8)}
                      y={y + 3}
                      textAnchor={x > center ? "start" : "end"}
                      className={`text-[9px] font-mono select-none ${
                        trait.isTop
                          ? "fill-cyan-300 font-bold"
                          : "fill-slate-500 font-medium"
                      }`}
                    >
                      {trait.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            8-Dimensional Profile Constellation
          </span>
        </div>

        {/* Right: Top 3 Strongest Traits Prominently + Compact Expand */}
        <div className="lg:col-span-7 space-y-3">
          {/* Top 3 Strongest Traits Prominently */}
          <div className="space-y-2.5">
            {top3Traits.map((trait, idx) => (
              <div
                key={trait.code}
                className="p-3 rounded-xl bg-[#141920]/80 border border-border/60 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-heading font-semibold text-slate-200">
                      {trait.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {trait.score}%
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 bg-[#080A0D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${trait.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-1 font-light leading-snug">
                  {trait.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Compact Reveal for Remaining 5 Dimensions */}
          {remainingTraits.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowRemaining(!showRemaining)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors py-1 cursor-pointer"
              >
                <span>
                  {showRemaining
                    ? "Hide remaining dimensions"
                    : `+ View remaining ${remainingTraits.length} profile dimensions`}
                </span>
                {showRemaining ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {showRemaining && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#0B0E12] border border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
                  {remainingTraits.map((trait) => (
                    <div
                      key={trait.code}
                      className="p-2 rounded-lg bg-[#141920]/60 border border-border/40"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">
                          {trait.label}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {trait.score}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#080A0D] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-500/70"
                          style={{ width: `${trait.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick 1-Sentence Synthesis */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2.5 mt-2">
            <BrainCircuit className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              <strong className="text-cyan-300 font-medium">Core takeaway:</strong> Your blend of{" "}
              <span className="text-white font-medium">{top3Traits[0]?.label}</span> and{" "}
              <span className="text-white font-medium">{top3Traits[1]?.label}</span> aligns directly with{" "}
              <span className="text-cyan-300 font-medium">{primaryCareerName || "your recommended path"}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
