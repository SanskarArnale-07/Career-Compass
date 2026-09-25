"use client";

import { useState, useMemo } from "react";
import { Sparkles, BrainCircuit, ChevronUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContributingTraitsVisualProps {
  traits: Record<string, number>;
  primaryCareerName?: string;
  defaultExpanded?: boolean;
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

/**
 * Computes collision-safe text positions for constellation dimension labels.
 * Ensures generous separation between:
 * - Trait label
 * - Percentage text
 * - Node dot & glowing halo
 * Keeps all labels bounded within the 520x520 canvas across any score (0-100%).
 */
function getDimensionLabelPosition(angle: number, x: number, y: number) {
  const a = ((angle % 360) + 360) % 360;

  let labelX = x;
  let labelY = y;
  let scoreX = x;
  let scoreY = y;
  let textAnchor: "start" | "middle" | "end" = "middle";

  switch (a) {
    case 270: // TOP (Technical) - Label and % placed cleanly ABOVE the node
      textAnchor = "middle";
      labelX = x;
      scoreX = x;
      // Node halo extends to y - 13.
      // scoreY at y - 26 leaves a 11-13px clear air gap above halo.
      // labelY at y - 40 places the label 14px above the percentage.
      scoreY = y - 26;
      labelY = y - 40;
      break;

    case 315: // TOP-RIGHT (Analytical) - Placed above-right of the node
      textAnchor = "start";
      labelX = x + 18;
      scoreX = x + 18;
      scoreY = y - 16;
      labelY = y - 29;
      break;

    case 0: // RIGHT (Scientific) - Placed to the right, centered vertically
      textAnchor = "start";
      labelX = Math.min(x + 22, 452);
      scoreX = labelX;
      labelY = y - 2;
      scoreY = y + 12;
      break;

    case 45: // BOTTOM-RIGHT (Business) - Placed below-right of the node
      textAnchor = "start";
      labelX = x + 20;
      scoreX = x + 20;
      labelY = y + 20;
      scoreY = y + 33;
      break;

    case 90: // BOTTOM (Creative) - Label and % placed cleanly BELOW the node
      textAnchor = "middle";
      labelX = x;
      scoreX = x;
      // Node halo extends to y + 13.
      // labelY at y + 32 leaves 10-12px clear air gap below halo.
      // scoreY at y + 45 places percentage 13px below label.
      labelY = y + 32;
      scoreY = y + 45;
      break;

    case 135: // BOTTOM-LEFT (Social) - Placed below-left of the node
      textAnchor = "end";
      labelX = x - 20;
      scoreX = x - 20;
      labelY = y + 20;
      scoreY = y + 33;
      break;

    case 180: // LEFT (Leadership) - Placed to the left, centered vertically
      textAnchor = "end";
      labelX = Math.max(x - 22, 65);
      scoreX = labelX;
      labelY = y - 2;
      scoreY = y + 12;
      break;

    case 225: // TOP-LEFT (Exploration) - Placed above-left of the node
      textAnchor = "end";
      labelX = x - 18;
      scoreX = x - 18;
      scoreY = y - 16;
      labelY = y - 29;
      break;

    default: {
      const rad = (a * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      if (cos > 0.3) textAnchor = "start";
      else if (cos < -0.3) textAnchor = "end";
      else textAnchor = "middle";

      labelX = x + cos * 28;
      scoreX = labelX;
      if (sin < -0.3) {
        scoreY = y + sin * 22;
        labelY = scoreY - 14;
      } else if (sin > 0.3) {
        labelY = y + sin * 22;
        scoreY = labelY + 13;
      } else {
        labelY = y - 2;
        scoreY = y + 12;
      }
      break;
    }
  }

  return { labelX, labelY, scoreX, scoreY, textAnchor };
}

export function ContributingTraitsVisual({
  traits,
  primaryCareerName,
  defaultExpanded = false,
}: ContributingTraitsVisualProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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

    // Identify top traits by score without assigning competitive rank numbers
    const sorted = [...items].sort((a, b) => b.score - a.score);
    const topCodes = new Set(sorted.slice(0, 3).map((t) => t.code));

    return items.map((item) => ({
      ...item,
      isTop: topCodes.has(item.code),
    }));
  }, [traits]);

  const topTraits = useMemo(() => {
    return [...normalizedTraits].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [normalizedTraits]);

  // Default active/inspected trait is the primary trait
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
      {/* ── Collapsed / Primary Evidence State ──────────────────── */}
      {!isExpanded ? (
        <div className="w-full max-w-245 mx-auto rounded-2xl border border-cyan-500/25 bg-[#0E1217]/90 p-6 sm:p-7 text-center flex flex-col items-center shadow-lg shadow-cyan-950/20">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
            Why This Matched You
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal mb-6 max-w-xl mx-auto leading-relaxed">
            These are the parts of your assessment that contributed to this career direction:
          </p>

          {/* Evidence Cards for Top Contributing Dimensions (3-column on desktop, 2-col tablet, 1-col mobile) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 mb-6 text-left items-stretch">
            {topTraits.map((trait) => (
              <div
                key={trait.code}
                className="p-4 sm:p-4.5 rounded-xl bg-[#10141A] border border-cyan-500/30 flex flex-col justify-between h-full shadow-xs"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm sm:text-base font-heading font-bold text-slate-100">
                      {trait.label}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-cyan-300">
                      {trait.score}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed flex-1 mb-4">
                    {trait.desc}
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18202A] overflow-hidden mt-auto">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 to-sky-300"
                    style={{ width: `${trait.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Prominent Clear CTA to Explore Full Constellation */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-sm sm:text-base font-semibold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer shadow-md shadow-cyan-950/30 hover:scale-[1.01]"
          >
            <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
            <span>Explore full profile constellation</span>
            <ArrowRight className="h-4.5 w-4.5 text-cyan-400" />
          </button>
        </div>
      ) : (
        /* ── Expanded Full Profile Dimensions & Constellation ─────────── */
        <div className="w-full max-w-245 mx-auto flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2">
              <span>WHY THIS MATCHED YOU</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Your Profile Constellation
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal">
              8 core dimensions from your assessment responses. Click any dimension to inspect details.
            </p>
          </div>

          {/* Collapse Button */}
          <div className="flex items-center justify-center mb-5">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-[#10141A] hover:bg-[#141920] text-xs sm:text-sm font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <span>Hide Profile Constellation</span>
              <ChevronUp className="h-4 w-4 text-cyan-400" />
            </button>
          </div>

          {/* 8 Core Dimension Score Cards */}
          <div className="w-full max-w-245 mx-auto mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[...normalizedTraits]
                .sort((a, b) => b.score - a.score)
                .map((trait) => (
                  <div
                    key={`pill-${trait.code}`}
                    onClick={() => setActiveCode(trait.code)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeCode === trait.code
                        ? "bg-[#141920] border-cyan-400/80 shadow-xs shadow-cyan-950/30"
                        : trait.isTop
                          ? "bg-[#10141A]/90 border-cyan-500/25 hover:border-cyan-400/50"
                          : "bg-[#0D1117]/80 border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-xs sm:text-sm font-heading font-semibold ${
                        trait.isTop ? "text-slate-100 font-bold" : "text-slate-200"
                      }`}>
                        {trait.label}
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
                        {trait.score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#18202A] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          trait.isTop
                            ? "bg-linear-to-r from-cyan-400 to-sky-300"
                            : "bg-slate-500/60"
                        }`}
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

      {/* ── Expandable Constellation Visualization ──────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center overflow-hidden"
          >
            <div className="relative w-full max-w-120 aspect-square mx-auto flex items-center justify-center my-2">
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

            // Compute collision-safe, clear separation label placement
            const { labelX, labelY, scoreX, scoreY, textAnchor } =
              getDimensionLabelPosition(trait.angle, x, y);

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

                {/* Trait Label */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  className={`text-[12px] font-heading font-semibold select-none transition-colors duration-200 ${
                    isActive
                      ? "fill-cyan-300 font-bold"
                      : isTop
                        ? "fill-white font-bold"
                        : "fill-slate-200 font-medium"
                  }`}
                >
                  {trait.label}
                </text>

                {/* Score Percentage */}
                <text
                  x={scoreX}
                  y={scoreY}
                  textAnchor={textAnchor}
                  className={`text-[11px] font-mono select-none ${
                    isActive
                      ? "fill-cyan-400 font-bold"
                      : isTop
                        ? "fill-cyan-300 font-bold"
                        : "fill-slate-400 font-semibold"
                  }`}
                >
                  {trait.score}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Active Trait Telemetry Bar ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTrait && (
          <motion.div
            key={activeTrait.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl mt-3 px-5 py-3.5 rounded-2xl border border-cyan-500/25 bg-[#0D1117]/90 backdrop-blur-md shadow-lg shadow-cyan-950/20"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-heading text-base font-bold text-white">
                  {activeTrait.label}
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {activeTrait.score}% Alignment
                </span>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {activeTrait.isTop ? "Primary Trait" : `Dimension ${activeTrait.code}`}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              {activeTrait.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Synthesis ───────────────────────────────────────── */}
      <div className="w-full max-w-lg mt-3.5 px-4 py-3 rounded-xl border border-border/60 bg-[#10141A]/60 flex items-center justify-center gap-2.5 text-center">
        <BrainCircuit className="h-4 w-4 text-cyan-400 shrink-0" />
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          Anchored by <span className="text-white font-medium">{topTraits[0]?.label} ({topTraits[0]?.score}%)</span> and <span className="text-white font-medium">{topTraits[1]?.label} ({topTraits[1]?.score}%)</span> toward <span className="text-cyan-300 font-medium">{primaryCareerName || "your recommended path"}</span>.
        </p>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      )}
    </div>
  );
}
