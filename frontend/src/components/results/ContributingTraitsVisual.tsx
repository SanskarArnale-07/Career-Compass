"use client";

import { useState, useMemo } from "react";
import { Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  rank: number;
  angle: number; // in degrees
}

// 8 Canonical Dimensions placed in a balanced radial constellation
const TRAIT_CONFIG = [
  { code: "TE", label: "Technical", desc: "Digital architecture, systems mastery, and structured logic", angle: 270 }, // Top
  { code: "AN", label: "Analytical", desc: "Algorithmic reasoning, data analysis, and quantitative problem-solving", angle: 315 }, // Top-Right
  { code: "SC", label: "Scientific", desc: "Empirical inquiry, hypothesis testing, and investigative discovery", angle: 0 }, // Right
  { code: "BU", label: "Business", desc: "Strategic mindset, value creation, and organizational scaling", angle: 45 }, // Bottom-Right
  { code: "CR", label: "Creative", desc: "Novel ideation, visual expression, and design innovation", angle: 90 }, // Bottom
  { code: "SO", label: "Social", desc: "Empathy, human communication, and collaborative resonance", angle: 135 }, // Bottom-Left
  { code: "LE", label: "Leadership", desc: "Directional ownership, team orchestration, and execution initiative", angle: 180 }, // Left
  { code: "EX", label: "Exploration", desc: "Cross-domain curiosity, agile learning, and adaptability", angle: 225 }, // Top-Left
];

export function ContributingTraitsVisual({
  traits,
  primaryCareerName,
}: ContributingTraitsVisualProps) {
  // Normalize scores from trait_profile
  const normalizedTraits = useMemo(() => {
    if (!traits) return [];

    const getScore = (code: string, label: string): number => {
      if (typeof traits[code] === "number") return Math.round(traits[code]);
      if (typeof traits[label] === "number") return Math.round(traits[label]);
      const lower = label.toLowerCase();
      const match = Object.entries(traits).find(
        ([k]) => k.toLowerCase() === lower || k.toLowerCase().startsWith(code.toLowerCase())
      );
      return match ? Math.round(match[1]) : 50;
    };

    const items = TRAIT_CONFIG.map((cfg) => ({
      ...cfg,
      score: Math.min(100, Math.max(0, getScore(cfg.code, cfg.label))),
    }));

    // Sort to determine ranks
    const sorted = [...items].sort((a, b) => b.score - a.score);
    const rankMap = new Map<string, number>();
    sorted.forEach((item, index) => {
      rankMap.set(item.code, index + 1);
    });

    return items.map((item) => {
      const rank = rankMap.get(item.code) || 8;
      return {
        ...item,
        rank,
        isTop: rank <= 3,
      };
    });
  }, [traits]);

  const topTraits = useMemo(() => {
    return [...normalizedTraits].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [normalizedTraits]);

  // Default active/inspected trait is the #1 strongest trait
  const [activeCode, setActiveCode] = useState<string>(() => {
    return topTraits[0]?.code || "TE";
  });

  const activeTrait = useMemo(() => {
    return (
      normalizedTraits.find((t) => t.code === activeCode) ||
      topTraits[0] ||
      normalizedTraits[0]
    );
  }, [normalizedTraits, activeCode, topTraits]);

  if (!normalizedTraits.length) return null;

  // Constellation coordinate math
  const viewBoxSize = 520;
  const center = viewBoxSize / 2;
  const minRadius = 90;
  const maxRadius = 185;

  // Helper to compute node (x, y) based on polar coordinates
  const getNodeCoords = (angleDeg: number, score: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    // Map score 0-100 to minRadius - maxRadius
    const r = minRadius + (score / 100) * (maxRadius - minRadius);
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Build the polygon points string for the 8 traits web
  const polygonPoints = normalizedTraits
    .map((t) => {
      const { x, y } = getNodeCoords(t.angle, t.score);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="w-full flex flex-col items-center select-none" id="traits-constellation-section">
      {/* ── Section Sub-header ─────────────────────────────────────── */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TRAIT CONSTELLATION · 8 DIMENSIONS</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Your Profile DNA
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light leading-relaxed">
          The shape of your constellation shows where your natural cognitive and behavioral energies cluster.
        </p>
      </div>

      {/* ── Visual Centerpiece: Radial Constellation ────────────────── */}
      <div className="relative w-full max-w-[560px] aspect-square mx-auto flex items-center justify-center">
        {/* Ambient cosmic lighting in background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,229,255,0.07),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(129,140,248,0.06),transparent_65%)]" />

        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Cyan glow filter for active nodes & filaments */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Gradient for Top spoke filaments */}
            <linearGradient id="topSpokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* ── Orbital Guide Rings ─────────────────────────────────── */}
          <circle
            cx={center}
            cy={center}
            r={maxRadius}
            fill="none"
            stroke="#1E2633"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            opacity="0.5"
          />
          <circle
            cx={center}
            cy={center}
            r={(minRadius + maxRadius) / 2}
            fill="none"
            stroke="#1E2633"
            strokeWidth="0.8"
            strokeDasharray="1 3"
            opacity="0.4"
          />
          <circle
            cx={center}
            cy={center}
            r={minRadius}
            fill="none"
            stroke="#1E2633"
            strokeWidth="0.8"
            opacity="0.3"
          />

          {/* ── Translucent Constellation Polygon Web ───────────────── */}
          <polygon
            points={polygonPoints}
            fill="rgba(0, 229, 255, 0.05)"
            stroke="rgba(0, 229, 255, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* ── Spoke Filaments from YOU to each Trait Node ─────────── */}
          {normalizedTraits.map((trait) => {
            const { x, y } = getNodeCoords(trait.angle, trait.score);
            const isActive = activeTrait?.code === trait.code;

            return (
              <g key={`spoke-${trait.code}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={
                    isActive
                      ? "#00E5FF"
                      : trait.isTop
                        ? "url(#topSpokeGrad)"
                        : "#263346"
                  }
                  strokeWidth={isActive ? 2.5 : trait.isTop ? 1.6 : 0.8}
                  strokeDasharray={trait.isTop || isActive ? "none" : "2 2"}
                  opacity={isActive ? 1 : trait.isTop ? 0.85 : 0.45}
                  filter={isActive ? "url(#cyanGlow)" : undefined}
                />
              </g>
            );
          })}

          {/* ── Central Anchor Beacon: YOU ──────────────────────────── */}
          <g>
            {/* Outer soft ambient circle */}
            <circle
              cx={center}
              cy={center}
              r="28"
              fill="rgba(0, 229, 255, 0.08)"
              stroke="rgba(0, 229, 255, 0.25)"
              strokeWidth="1"
            />
            {/* Inner dark node */}
            <circle
              cx={center}
              cy={center}
              r="18"
              fill="#10141A"
              stroke="#00E5FF"
              strokeWidth="2"
              filter="url(#cyanGlow)"
            />
            {/* Core dot */}
            <circle cx={center} cy={center} r="4" fill="#00E5FF" />
            {/* YOU label */}
            <text
              x={center}
              y={center + 36}
              textAnchor="middle"
              className="text-[10px] font-mono font-bold tracking-[0.2em] fill-cyan-400 select-none"
            >
              YOU
            </text>
          </g>

          {/* ── Radial Trait Nodes & Interactive Hit Areas ───────────── */}
          {normalizedTraits.map((trait) => {
            const { x, y } = getNodeCoords(trait.angle, trait.score);
            const isActive = activeTrait?.code === trait.code;
            const isTop = trait.isTop;

            // Compute label placement relative to the node
            const rad = (trait.angle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            // Distance offset for text label
            const textOffset = isTop ? 18 : 14;
            const labelX = x + cos * textOffset;
            const labelY = y + sin * textOffset;

            // Anchor alignment based on quadrant
            let textAnchor: "start" | "middle" | "end" = "middle";
            if (cos > 0.3) textAnchor = "start";
            else if (cos < -0.3) textAnchor = "end";

            return (
              <g
                key={`node-${trait.code}`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setActiveCode(trait.code)}
                onMouseEnter={() => setActiveCode(trait.code)}
              >
                {/* Generous invisible hit target for comfortable touch & hover */}
                <circle cx={x} cy={y} r="22" fill="transparent" />

                {/* Glowing halo for top traits or active selection */}
                {(isTop || isActive) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? "13" : "10"}
                    fill="none"
                    stroke={isActive ? "#00E5FF" : "#818CF8"}
                    strokeWidth={isActive ? "2" : "1.2"}
                    strokeOpacity={isActive ? "0.9" : "0.5"}
                    strokeDasharray={isActive ? "none" : "2 2"}
                    filter={isActive ? "url(#cyanGlow)" : undefined}
                  />
                )}

                {/* Main Node Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? "7" : isTop ? "5.5" : "4"}
                  fill={
                    isActive
                      ? "#00E5FF"
                      : isTop
                        ? "#38BDF8"
                        : "#475569"
                  }
                  stroke="#080A0D"
                  strokeWidth="1.5"
                  filter={isActive || isTop ? "url(#cyanGlow)" : undefined}
                />

                {/* Trait Label + Score */}
                <text
                  x={labelX}
                  y={labelY - (sin < -0.3 ? 6 : 0)}
                  textAnchor={textAnchor}
                  className={`text-[11px] font-heading select-none transition-colors duration-200 ${
                    isActive
                      ? "fill-cyan-300 font-bold"
                      : isTop
                        ? "fill-slate-100 font-semibold"
                        : "fill-slate-400 font-medium"
                  }`}
                >
                  {trait.label}
                </text>

                {/* Score Pill Text */}
                <text
                  x={labelX}
                  y={labelY + (sin < -0.3 ? 8 : 13)}
                  textAnchor={textAnchor}
                  className={`text-[10px] font-mono select-none ${
                    isActive
                      ? "fill-cyan-400 font-bold"
                      : isTop
                        ? "fill-sky-300 font-medium"
                        : "fill-slate-500"
                  }`}
                >
                  {trait.score}% {isTop ? `· #${trait.rank}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Active Trait Telemetry Bar (Replaces bulky side cards) ───── */}
      <AnimatePresence mode="wait">
        {activeTrait && (
          <motion.div
            key={activeTrait.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl mt-4 px-4 py-3 rounded-2xl border border-cyan-500/25 bg-[#0D1117]/90 backdrop-blur-md shadow-lg shadow-cyan-950/20"
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-heading text-sm font-semibold text-white">
                  {activeTrait.label}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {activeTrait.score}% Alignment
                </span>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {activeTrait.isTop ? `Top Trait #${activeTrait.rank}` : `Dimension ${activeTrait.code}`}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {activeTrait.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimal 1-Sentence Profile Synthesis ────────────────────── */}
      <div className="w-full max-w-xl mt-3 p-3.5 rounded-xl border border-border/70 bg-[#10141A]/60 flex items-start gap-3">
        <BrainCircuit className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 font-light leading-relaxed">
          <strong className="text-cyan-300 font-medium">Constellation Takeaway:</strong> Your profile is anchored by strong{" "}
          <span className="text-white font-medium">{topTraits[0]?.label} ({topTraits[0]?.score}%)</span> and{" "}
          <span className="text-white font-medium">{topTraits[1]?.label} ({topTraits[1]?.score}%)</span>, directing your career vector toward{" "}
          <span className="text-cyan-300 font-medium">{primaryCareerName || "your recommended path"}</span>.
        </p>
      </div>
    </div>
  );
}
