"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Network,
  ArrowRight,
  Compass,
  ExternalLink,
  Zap,
  Layers,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Info,
  LayoutGrid,
  TrendingUp,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CareerIntelligence, SkillNode } from "@/lib/career-intelligence";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";

interface CareerConstellationProps {
  career: CareerIntelligence;
  relatedCareers: Array<{ title: string; slug: string; category?: string }>;
}

type SelectedNodeType =
  | { type: "target" }
  | { type: "skill"; skill: SkillNode; index: number }
  | {
      type: "career";
      career: {
        title: string;
        slug: string;
        category?: string;
        sharedSkillNames: string[];
        explanation: string;
        intel?: CareerIntelligence;
      };
      index: number;
    };

// Utility to break long strings across two lines gracefully without truncation
function wrapText(text: string, maxCharsPerLine: number = 20): [string, string] {
  if (text.length <= maxCharsPerLine) {
    return [text, ""];
  }
  const words = text.split(" ");
  let line1 = "";
  let line2 = "";
  for (const word of words) {
    if ((line1 + " " + word).trim().length <= maxCharsPerLine && !line2) {
      line1 = (line1 + " " + word).trim();
    } else {
      line2 = (line2 + " " + word).trim();
    }
  }
  if (!line2 && text.length > maxCharsPerLine) {
    const midpoint = Math.floor(text.length / 2);
    const spaceIdx = text.indexOf(" ", midpoint - 4);
    if (spaceIdx !== -1 && spaceIdx < text.length - 3) {
      return [text.slice(0, spaceIdx), text.slice(spaceIdx + 1)];
    }
    return [text.slice(0, maxCharsPerLine), text.slice(maxCharsPerLine)];
  }
  return [line1, line2];
}

export default function CareerConstellation({
  career,
  relatedCareers,
}: CareerConstellationProps) {
  // Selected node state: starts with the top foundational skill for immediate practical value
  const coreSkills = useMemo(() => career.skills.slice(0, 4), [career.skills]);

  const [selectedNode, setSelectedNode] = useState<SelectedNodeType>(() => {
    if (coreSkills.length > 0) {
      return { type: "skill", skill: coreSkills[0], index: 0 };
    }
    return { type: "target" };
  });

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"graph" | "matrix">("graph");

  // Top 3 adjacent pathways from props
  const pathways = useMemo(() => relatedCareers.slice(0, 3), [relatedCareers]);

  // Compute authentic shared skills and relationships for each related career
  const enrichedPathways = useMemo(() => {
    return pathways.map((rel) => {
      const relIntel = resolveCareerIntelligence(rel.slug);

      // Identify real overlapping skills between target career and adjacent pathway
      const targetSkillNames = coreSkills.map((s) => s.name.toLowerCase());
      const relSkillNames = (relIntel?.skills || []).map((s) => s.name.toLowerCase());

      const directlyMatched = coreSkills.filter((s) => {
        const sLower = s.name.toLowerCase();
        return relSkillNames.some(
          (r) =>
            r === sLower ||
            r.includes(sLower) ||
            sLower.includes(r) ||
            (s.relevantTraits &&
              relIntel?.primaryTraits &&
              s.relevantTraits.some((t) => relIntel.primaryTraits.includes(t)))
        );
      });

      const sharedSkillNames =
        directlyMatched.length > 0
          ? directlyMatched.map((s) => s.name)
          : [coreSkills[0]?.name || "Foundational Problem Solving"];

      const explanation = `Shares key competencies in ${sharedSkillNames
        .slice(0, 2)
        .join(" & ")}, enabling smooth cross-domain skill portability between ${career.title} and ${rel.title}.`;

      return {
        title: rel.title,
        slug: rel.slug,
        category: rel.category || relIntel?.category || "Adjacent Pathway",
        sharedSkillNames,
        explanation,
        intel: relIntel,
      };
    });
  }, [pathways, coreSkills, career.title]);

  // SVG Virtual Geometry Coordinates (800 x 470 Canvas)
  const center = { x: 400, y: 235 };

  // 4 Essential Skill Nodes symmetrically flanking the center
  const skillCoords = useMemo(() => {
    return [
      { id: "skill-0", x: 190, y: 140, w: 195, h: 54 }, // Top-Left
      { id: "skill-1", x: 190, y: 330, w: 195, h: 54 }, // Bottom-Left
      { id: "skill-2", x: 610, y: 140, w: 195, h: 54 }, // Top-Right
      { id: "skill-3", x: 610, y: 330, w: 195, h: 54 }, // Bottom-Right
    ];
  }, []);

  // 3 Related Career Nodes in outer constellation tier
  const careerCoords = useMemo(() => {
    return [
      { id: "rel-0", x: 400, y: 48, w: 220, h: 52 }, // Top-Center
      { id: "rel-1", x: 155, y: 425, w: 200, h: 52 }, // Far Bottom-Left
      { id: "rel-2", x: 645, y: 425, w: 200, h: 52 }, // Far Bottom-Right
    ];
  }, []);

  // Determine active highlights for lines and nodes
  const activeSkillName =
    selectedNode.type === "skill" ? selectedNode.skill.name : null;
  const activeCareerTitle =
    selectedNode.type === "career" ? selectedNode.career.title : null;
  const isTargetActive = selectedNode.type === "target";

  // Check if a line should be illuminated
  const isTargetToSkillActive = useCallback(
    (skillName: string) => {
      if (isTargetActive) return true;
      if (activeSkillName === skillName) return true;
      if (activeCareerTitle) {
        const found = enrichedPathways.find((p) => p.title === activeCareerTitle);
        return found?.sharedSkillNames.includes(skillName) ?? false;
      }
      return false;
    },
    [isTargetActive, activeSkillName, activeCareerTitle, enrichedPathways]
  );

  const isBridgeActive = useCallback(
    (skillName: string, careerTitle: string) => {
      if (activeSkillName === skillName) {
        const p = enrichedPathways.find((ep) => ep.title === careerTitle);
        return p?.sharedSkillNames.includes(skillName) ?? false;
      }
      if (activeCareerTitle === careerTitle) {
        const p = enrichedPathways.find((ep) => ep.title === careerTitle);
        return p?.sharedSkillNames.includes(skillName) ?? false;
      }
      return false;
    },
    [activeSkillName, activeCareerTitle, enrichedPathways]
  );

  const handleScrollToRoadmap = () => {
    const el = document.getElementById("roadmap");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-[#0D1117] via-[#0E131D] to-[#0D1117] p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-black/30">
      {/* Background ambient radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-primary/6 blur-[100px] rounded-full pointer-events-none" />

      {/* ── 1. Component Header & Mode Selector ─────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 pb-5 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-2">
            <Network className="h-3.5 w-3.5" />
            <span>Interactive Skill Web &amp; Transferable Pathways</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            Career Constellation &amp; Skill Web
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl font-light">
            Understand which core competencies matter for {career.title}, why they are required, and how your skills unlock adjacent career opportunities.
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-border/70 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "graph"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Web Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("matrix")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "matrix"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Skill Matrix</span>
          </button>
        </div>
      </div>

      {/* ── 2. Meaningful Relationship Legend ───────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[#111520] px-4 py-2.5 rounded-xl border border-border/70 mb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-xs shadow-primary" />
            Target Career
          </span>
          <span className="text-border/60">•</span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Essential Skills ({coreSkills.length})
          </span>
          <span className="text-border/60">•</span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            Related Careers ({enrichedPathways.length})
          </span>
          <span className="text-border/60 hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
            <span className="w-5 border-t-2 border-dashed border-sky-400/80 inline-block" />
            Transferable Skill Bridge
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground/80 hidden lg:inline">
          Click any node to inspect practical applications &amp; next actions
        </span>
      </div>

      {/* ── 3. Main Visualization Area ──────────────────────────────── */}
      {viewMode === "graph" ? (
        <div className="space-y-6 relative z-10">
          {/* Interactive SVG Constellation Canvas */}
          <div className="relative w-full aspect-[800/470] max-w-4xl mx-auto rounded-2xl bg-[#0B0E14] border border-border/60 overflow-visible select-none shadow-inner">
            <svg
              viewBox="0 0 800 470"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label={`Interactive career constellation map for ${career.title}`}
            >
              <defs>
                <linearGradient id="primaryLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
                </linearGradient>
                <radialGradient id="centerPulseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeActiveGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Circular Guide Rings */}
              <circle
                cx={center.x}
                cy={center.y}
                r={160}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                className="text-border/40"
              />
              <circle
                cx={center.x}
                cy={center.y}
                r={235}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="6 8"
                className="text-border/25"
              />

              {/* ── Connection Layer 1: Subtle Target to Related Careers (Dotted) ── */}
              {careerCoords.map((cCoord) => (
                <line
                  key={`target-rel-line-${cCoord.id}`}
                  x1={center.x}
                  y1={center.y}
                  x2={cCoord.x}
                  y2={cCoord.y}
                  stroke="#38BDF8"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  strokeOpacity={0.18}
                />
              ))}

              {/* ── Connection Layer 2: Transferable Skill Bridges (Skill to Related Career) ── */}
              {enrichedPathways.map((rel, cIdx) => {
                const cCoord = careerCoords[cIdx];
                if (!cCoord) return null;

                return coreSkills.map((sk, sIdx) => {
                  const sCoord = skillCoords[sIdx];
                  if (!sCoord) return null;

                  const isShared = rel.sharedSkillNames.includes(sk.name);
                  if (!isShared) return null;

                  const isBridgeIlluminated = isBridgeActive(sk.name, rel.title);

                  return (
                    <line
                      key={`bridge-${sk.id}-${rel.slug}`}
                      x1={sCoord.x}
                      y1={sCoord.y}
                      x2={cCoord.x}
                      y2={cCoord.y}
                      stroke={isBridgeIlluminated ? "#38BDF8" : "#0284C7"}
                      strokeWidth={isBridgeIlluminated ? 2.5 : 1.2}
                      strokeDasharray={isBridgeIlluminated ? "none" : "4 3"}
                      strokeOpacity={isBridgeIlluminated ? 0.9 : 0.3}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}

              {/* ── Connection Layer 3: Target Career to Essential Skills (Solid Cyan) ── */}
              {coreSkills.map((sk, sIdx) => {
                const sCoord = skillCoords[sIdx];
                if (!sCoord) return null;

                const isLineIlluminated = isTargetToSkillActive(sk.name);

                return (
                  <line
                    key={`target-skill-line-${sk.id}`}
                    x1={center.x}
                    y1={center.y}
                    x2={sCoord.x}
                    y2={sCoord.y}
                    stroke={isLineIlluminated ? "#00E5FF" : "rgba(0, 229, 255, 0.25)"}
                    strokeWidth={isLineIlluminated ? 2.8 : 1.4}
                    strokeOpacity={isLineIlluminated ? 1 : 0.35}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Center Ambient Glow */}
              <circle cx={center.x} cy={center.y} r={110} fill="url(#centerPulseGlow)" />

              {/* ── Node Layer 1: Center Target Career Node ── */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode({ type: "target" })}
                onMouseEnter={() => setHoveredNodeId("target")}
                onMouseLeave={() => setHoveredNodeId(null)}
                role="button"
                tabIndex={0}
                aria-label={`Target career: ${career.title}`}
              >
                <title>{`${career.title} (Target Career Focus)`}</title>
                {/* Node Box */}
                <rect
                  x={center.x - 110}
                  y={center.y - 34}
                  width={220}
                  height={68}
                  rx={16}
                  className={`transition-all duration-200 fill-[#0D131F] ${
                    isTargetActive
                      ? "stroke-primary stroke-2 filter drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]"
                      : "stroke-primary/60 hover:stroke-primary stroke-1.5"
                  }`}
                />
                {/* Center Icon Circle */}
                <circle
                  cx={center.x - 76}
                  cy={center.y}
                  r={18}
                  className="fill-primary/15 stroke-primary/40 stroke-1"
                />
                <circle cx={center.x - 76} cy={center.y} r={6} className="fill-primary" />

                {/* Node Text Content - Cleanly Wrapped Without Truncation */}
                {(() => {
                  const [t1, t2] = wrapText(career.title, 18);
                  return (
                    <text x={center.x - 48} y={center.y - 6} className="pointer-events-none">
                      <tspan
                        x={center.x - 48}
                        className="fill-foreground font-heading text-[12px] font-bold"
                      >
                        {t1}
                      </tspan>
                      {t2 && (
                        <tspan
                          x={center.x - 48}
                          dy="15"
                          className="fill-foreground font-heading text-[12px] font-bold"
                        >
                          {t2}
                        </tspan>
                      )}
                      <tspan
                        x={center.x - 48}
                        dy={t2 ? "14" : "16"}
                        className="fill-primary font-mono text-[9px] font-semibold uppercase tracking-wider"
                      >
                        Target Focus
                      </tspan>
                    </text>
                  );
                })()}
              </g>

              {/* ── Node Layer 2: 4 Essential Skill Nodes ── */}
              {coreSkills.map((sk, sIdx) => {
                const coord = skillCoords[sIdx];
                if (!coord) return null;

                const isSelected =
                  selectedNode.type === "skill" && selectedNode.skill.name === sk.name;
                const isHovered = hoveredNodeId === `skill-${sIdx}`;
                const [w1, w2] = wrapText(sk.name, 19);

                return (
                  <g
                    key={`svg-skill-node-${sk.id}`}
                    className="cursor-pointer group"
                    onClick={() =>
                      setSelectedNode({ type: "skill", skill: sk, index: sIdx })
                    }
                    onMouseEnter={() => setHoveredNodeId(`skill-${sIdx}`)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Essential skill: ${sk.name}`}
                  >
                    <title>{`${sk.name} (Essential Core Skill)`}</title>
                    {/* Active Halo */}
                    {(isSelected || isHovered) && (
                      <rect
                        x={coord.x - coord.w / 2 - 4}
                        y={coord.y - coord.h / 2 - 4}
                        width={coord.w + 8}
                        height={coord.h + 8}
                        rx={16}
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                      />
                    )}

                    {/* Skill Capsule Card */}
                    <rect
                      x={coord.x - coord.w / 2}
                      y={coord.y - coord.h / 2}
                      width={coord.w}
                      height={coord.h}
                      rx={12}
                      className={`transition-all duration-200 fill-[#0F141F] ${
                        isSelected
                          ? "stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                          : "stroke-border/80 group-hover:stroke-cyan-400/80 stroke-1"
                      }`}
                    />

                    {/* Mini Icon Bullet */}
                    <circle
                      cx={coord.x - coord.w / 2 + 20}
                      cy={coord.y}
                      r={10}
                      className="fill-cyan-500/15 stroke-cyan-400/40 stroke-1"
                    />
                    <circle
                      cx={coord.x - coord.w / 2 + 20}
                      cy={coord.y}
                      r={3.5}
                      className="fill-cyan-400"
                    />

                    {/* Skill Full Name (Never Truncated) */}
                    <text
                      x={coord.x - coord.w / 2 + 38}
                      y={coord.y - (w2 ? 4 : 2)}
                      className="pointer-events-none"
                    >
                      <tspan
                        x={coord.x - coord.w / 2 + 38}
                        className="fill-foreground font-heading text-[11px] font-semibold"
                      >
                        {w1}
                      </tspan>
                      {w2 && (
                        <tspan
                          x={coord.x - coord.w / 2 + 38}
                          dy="13"
                          className="fill-foreground font-heading text-[11px] font-semibold"
                        >
                          {w2}
                        </tspan>
                      )}
                      <tspan
                        x={coord.x - coord.w / 2 + 38}
                        dy={w2 ? "12" : "13"}
                        className="fill-cyan-400 font-mono text-[9px] font-semibold tracking-wider uppercase"
                      >
                        Core Skill
                      </tspan>
                    </text>
                  </g>
                );
              })}

              {/* ── Node Layer 3: 3 Related Career Nodes ── */}
              {enrichedPathways.map((rel, cIdx) => {
                const coord = careerCoords[cIdx];
                if (!coord) return null;

                const isSelected =
                  selectedNode.type === "career" && selectedNode.career.title === rel.title;
                const isHovered = hoveredNodeId === `rel-${cIdx}`;
                const [c1, c2] = wrapText(rel.title, 20);

                return (
                  <g
                    key={`svg-career-node-${rel.slug}`}
                    className="cursor-pointer group"
                    onClick={() =>
                      setSelectedNode({ type: "career", career: rel, index: cIdx })
                    }
                    onMouseEnter={() => setHoveredNodeId(`rel-${cIdx}`)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Related career: ${rel.title}`}
                  >
                    <title>{`${rel.title} (Adjacent Career Pathway)`}</title>
                    {/* Active Halo */}
                    {(isSelected || isHovered) && (
                      <rect
                        x={coord.x - coord.w / 2 - 4}
                        y={coord.y - coord.h / 2 - 4}
                        width={coord.w + 8}
                        height={coord.h + 8}
                        rx={16}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                      />
                    )}

                    {/* Career Capsule Card */}
                    <rect
                      x={coord.x - coord.w / 2}
                      y={coord.y - coord.h / 2}
                      width={coord.w}
                      height={coord.h}
                      rx={12}
                      className={`transition-all duration-200 fill-[#0D121B] ${
                        isSelected
                          ? "stroke-sky-400 stroke-2 filter drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                          : "stroke-border/80 group-hover:stroke-sky-400/80 stroke-1"
                      }`}
                    />

                    {/* Mini Icon Bullet */}
                    <circle
                      cx={coord.x - coord.w / 2 + 20}
                      cy={coord.y}
                      r={10}
                      className="fill-sky-500/15 stroke-sky-400/40 stroke-1"
                    />
                    <circle
                      cx={coord.x - coord.w / 2 + 20}
                      cy={coord.y}
                      r={3.5}
                      className="fill-sky-400"
                    />

                    {/* Career Full Name (Never Truncated) */}
                    <text
                      x={coord.x - coord.w / 2 + 38}
                      y={coord.y - (c2 ? 4 : 2)}
                      className="pointer-events-none"
                    >
                      <tspan
                        x={coord.x - coord.w / 2 + 38}
                        className="fill-foreground font-heading text-[11px] font-semibold"
                      >
                        {c1}
                      </tspan>
                      {c2 && (
                        <tspan
                          x={coord.x - coord.w / 2 + 38}
                          dy="13"
                          className="fill-foreground font-heading text-[11px] font-semibold"
                        >
                          {c2}
                        </tspan>
                      )}
                      <tspan
                        x={coord.x - coord.w / 2 + 38}
                        dy={c2 ? "12" : "13"}
                        className="fill-sky-400 font-mono text-[9px] font-semibold tracking-wider uppercase"
                      >
                        Adjacent Pathway
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        /* ── View Mode: Structured Skill & Career Matrix ────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {/* Column 1: Essential Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Zap className="h-4 w-4 text-cyan-400" />
              <h3 className="font-heading text-sm font-bold text-foreground">
                Essential Skills for {career.title}
              </h3>
            </div>
            <div className="space-y-2.5">
              {coreSkills.map((sk, idx) => (
                <div
                  key={`matrix-skill-${sk.id}`}
                  onClick={() =>
                    setSelectedNode({ type: "skill", skill: sk, index: idx })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedNode.type === "skill" &&
                    selectedNode.skill.name === sk.name
                      ? "bg-primary/10 border-primary"
                      : "bg-[#0E131E] border-border/70 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading text-sm font-bold text-foreground">
                      {sk.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-semibold">
                      {sk.category || "Core"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
                    {sk.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Connected Adjacent Pathways */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Compass className="h-4 w-4 text-sky-400" />
              <h3 className="font-heading text-sm font-bold text-foreground">
                Transferable Career Opportunities
              </h3>
            </div>
            <div className="space-y-2.5">
              {enrichedPathways.map((rel, idx) => (
                <div
                  key={`matrix-rel-${rel.slug}`}
                  onClick={() =>
                    setSelectedNode({ type: "career", career: rel, index: idx })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedNode.type === "career" &&
                    selectedNode.career.title === rel.title
                      ? "bg-sky-500/10 border-sky-400"
                      : "bg-[#0E131E] border-border/70 hover:border-sky-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading text-sm font-bold text-foreground">
                      {rel.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold">
                      {rel.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
                    {rel.explanation}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground/75">
                      Shared skills:
                    </span>
                    {rel.sharedSkillNames.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#141922] border border-border/60 text-foreground/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Interactive Live Inspector Panel ("Answering: SO WHAT?") ── */}
      <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#0B0F17] border border-border/80 relative z-10 shadow-lg">
        {/* State A: An Essential Skill is selected */}
        {selectedNode.type === "skill" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Essential Competency
                    </span>
                    <span className="text-border/60">•</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {selectedNode.skill.category || "Core Domain"}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {selectedNode.skill.name}
                  </h3>
                </div>
              </div>

              {selectedNode.skill.recommendedLevel && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#121622] border border-border/70 text-muted-foreground shrink-0 self-start sm:self-auto">
                  Proficiency Target: {selectedNode.skill.recommendedLevel}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Why It Matters */}
              <div className="p-4 rounded-xl bg-[#0F1420] border border-border/60 space-y-1.5">
                <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider block">
                  Why It Matters for {career.title}
                </span>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {selectedNode.skill.whyItMatters ||
                    `Crucial foundation required to master ${selectedNode.skill.name} within this profession.`}
                </p>
              </div>

              {/* How It Is Used in Practice */}
              <div className="p-4 rounded-xl bg-[#0F1420] border border-border/60 space-y-1.5">
                <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider block">
                  How Professionals Apply It in Practice
                </span>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {selectedNode.skill.whatToKnow ||
                    `Applied across key projects, systems design, and day-to-day execution.`}
                </p>
              </div>
            </div>

            {/* Transferable Pathways for this Skill */}
            {(() => {
              const transferCareers = enrichedPathways.filter((p) =>
                p.sharedSkillNames.includes(selectedNode.skill.name)
              );
              return (
                <div className="p-3.5 rounded-xl bg-[#0E131E] border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Transferable to:</strong>{" "}
                      {transferCareers.length > 0
                        ? `Learning ${selectedNode.skill.name} gives you portability into `
                        : `Foundational capability across modern `}
                      {transferCareers.map((c, i) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            const found = enrichedPathways.find((p) => p.slug === c.slug);
                            if (found) {
                              setSelectedNode({
                                type: "career",
                                career: found,
                                index: i,
                              });
                            }
                          }}
                          className="text-sky-400 hover:underline font-semibold ml-1 cursor-pointer"
                        >
                          {c.title}
                          {i < transferCareers.length - 1 ? "," : ""}
                        </button>
                      ))}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleScrollToRoadmap}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
                  >
                    <span>View in Phased Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* State B: An Adjacent Career is selected */}
        {selectedNode.type === "career" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                      Connected Pathway
                    </span>
                    <span className="text-border/60">•</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {selectedNode.career.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {selectedNode.career.title}
                  </h3>
                </div>
              </div>

              <Link
                href={`/career/${selectedNode.career.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md transition-all shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>Explore {selectedNode.career.title}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {/* Why It Connects */}
              <div className="p-4 rounded-xl bg-[#0F1420] border border-border/60 space-y-1.5">
                <span className="text-[11px] font-mono text-sky-400 font-semibold uppercase tracking-wider block">
                  Why It Connects to {career.title}
                </span>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {selectedNode.career.explanation}
                </p>
              </div>

              {/* Shared Competencies */}
              <div className="p-4 rounded-xl bg-[#0F1420] border border-border/60 space-y-2">
                <span className="text-[11px] font-mono text-sky-400 font-semibold uppercase tracking-wider block">
                  Overlapping Skills You Can Reuse
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.career.sharedSkillNames.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-mono font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/80 font-light pt-0.5">
                  Mastering these competencies protects your versatility, allowing you to branch out without starting from scratch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State C: Target Career is selected */}
        {selectedNode.type === "target" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                      Target Career Hub
                    </span>
                    <span className="text-border/60">•</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {career.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {career.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleScrollToRoadmap}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md transition-all shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>Start Phased Roadmap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
              {career.tagline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#0F1420] border border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Core Skills Mapped
                </span>
                <span className="font-heading font-bold text-foreground text-sm">
                  {coreSkills.length} Essential Competencies
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1420] border border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Adjacent Pathways
                </span>
                <span className="font-heading font-bold text-foreground text-sm">
                  {enrichedPathways.length} Connected Directions
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1420] border border-border/60">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Guidance
                </span>
                <span className="font-mono text-primary text-xs">
                  Click any skill or pathway to explore
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
