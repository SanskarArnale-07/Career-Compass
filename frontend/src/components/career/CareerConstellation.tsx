"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Network, ArrowRight } from "lucide-react";
import type { CareerIntelligence } from "@/lib/career-intelligence";

interface CareerConstellationProps {
  career: CareerIntelligence;
  relatedCareers: Array<{ title: string; slug: string; category?: string }>;
}

export default function CareerConstellation({
  career,
  relatedCareers,
}: CareerConstellationProps) {
  const [activeNode, setActiveNode] = useState<string>(career.title);
  const [nodeDetail, setNodeDetail] = useState<string>(
    "Core Focus: Foundational domain expertise and specialized competencies."
  );

  // Take top 4 core skills for inner orbit
  const coreSkills = career.skills.slice(0, 4);

  // Layout coordinates in a 500x500 virtual SVG canvas
  const center = { x: 250, y: 250 };
  const innerRadius = 115;
  const outerRadius = 185;

  // Compute skill node positions (Inner ring)
  const skillNodes = coreSkills.map((skill, idx) => {
    const angle = (idx * (360 / coreSkills.length) - 45) * (Math.PI / 180);
    return {
      id: `skill-${idx}`,
      name: skill.name,
      detail: skill.whyItMatters || skill.whatToKnow || `Key competency required for ${career.title}.`,
      type: "skill" as const,
      x: center.x + innerRadius * Math.cos(angle),
      y: center.y + innerRadius * Math.sin(angle),
    };
  });

  // Compute adjacent career positions (Outer ring)
  const pathways = relatedCareers.slice(0, 3);
  const careerNodes = pathways.map((rel, idx) => {
    const angle = (idx * (360 / Math.max(pathways.length, 1)) + 45) * (Math.PI / 180);
    return {
      id: `rel-${idx}`,
      name: rel.title,
      slug: rel.slug,
      category: rel.category || "Adjacent Pathway",
      detail: `Adjacent pathway sharing foundational skills with ${career.title}.`,
      type: "career" as const,
      x: center.x + outerRadius * Math.cos(angle),
      y: center.y + outerRadius * Math.sin(angle),
    };
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-black/20">
      {/* Background ambient radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
            <Network className="h-3.5 w-3.5" />
            <span>Interactive Nexus</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            Career Constellation & Skill Web
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            See how your target career connects directly to core competencies and neighboring professional pathways.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono shrink-0 bg-[#0F172A] px-3.5 py-1.5 rounded-xl border border-border/80">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Core Career
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Skills
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pathways
          </span>
        </div>
      </div>

      {/* Interactive SVG Diagram */}
      <div className="relative w-full aspect-square max-w-115 mx-auto z-10 select-none">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Constellation map for ${career.title}`}
        >
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit Circles */}
          <circle
            cx={center.x}
            cy={center.y}
            r={innerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="text-border/70"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={outerRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            className="text-border/40"
          />

          {/* Connection Lines from Center to Skills */}
          {skillNodes.map((s) => {
            const isHovered = activeNode === s.name;
            return (
              <line
                key={`line-${s.id}`}
                x1={center.x}
                y1={center.y}
                x2={s.x}
                y2={s.y}
                stroke={isHovered ? "#3B82F6" : "rgba(59, 130, 246, 0.25)"}
                strokeWidth={isHovered ? 2 : 1.2}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Connection Lines from Skills to Adjacent Careers */}
          {careerNodes.map((c, cIdx) => {
            // Connect each adjacent career to 1 or 2 closest skills
            const linkedSkill = skillNodes[cIdx % skillNodes.length];
            const isHovered = activeNode === c.name;
            return (
              <line
                key={`rel-line-${c.id}`}
                x1={linkedSkill.x}
                y1={linkedSkill.y}
                x2={c.x}
                y2={c.y}
                stroke={isHovered ? "#10B981" : "rgba(16, 185, 129, 0.22)"}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray="3 3"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Center Glow Backdrop */}
          <circle cx={center.x} cy={center.y} r={65} fill="url(#centerGlow)" />

          {/* Center Node (Active Career) */}
          <g
            className="cursor-pointer group"
            onClick={() => {
              setActiveNode(career.title);
              setNodeDetail(`Core Career: ${career.tagline}`);
            }}
          >
            <circle
              cx={center.x}
              cy={center.y}
              r={46}
              className="fill-[#0B1220] stroke-primary stroke-2 group-hover:stroke-3 transition-all"
            />
            <circle
              cx={center.x}
              cy={center.y}
              r={40}
              className="fill-primary/15"
            />
            <text
              x={center.x}
              y={center.y - 6}
              textAnchor="middle"
              className="fill-foreground font-heading text-[11px] font-bold pointer-events-none"
            >
              {career.title.length > 16 ? `${career.title.slice(0, 15)}…` : career.title}
            </text>
            <text
              x={center.x}
              y={center.y + 11}
              textAnchor="middle"
              className="fill-primary font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none"
            >
              Target Focus
            </text>
          </g>

          {/* Skill Nodes */}
          {skillNodes.map((s) => {
            const isSelected = activeNode === s.name;
            return (
              <g
                key={s.id}
                className="cursor-pointer group"
                onMouseEnter={() => {
                  setActiveNode(s.name);
                  setNodeDetail(`Skill Focus: ${s.detail}`);
                }}
                onClick={() => {
                  setActiveNode(s.name);
                  setNodeDetail(`Skill Focus: ${s.detail}`);
                }}
              >
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={isSelected ? 26 : 22}
                  className={`transition-all duration-300 fill-[#0F172A] ${
                    isSelected
                      ? "stroke-secondary stroke-2 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                      : "stroke-border group-hover:stroke-secondary/70 stroke-1"
                  }`}
                />
                <circle cx={s.x} cy={s.y} r={16} className="fill-secondary/10" />
                <text
                  x={s.x}
                  y={s.y + 3}
                  textAnchor="middle"
                  className="fill-foreground font-heading text-[9px] font-medium pointer-events-none"
                >
                  {s.name.length > 11 ? `${s.name.slice(0, 10)}…` : s.name}
                </text>
              </g>
            );
          })}

          {/* Career Neighbor Nodes */}
          {careerNodes.map((c) => {
            const isSelected = activeNode === c.name;
            return (
              <g
                key={c.id}
                className="cursor-pointer group"
                onMouseEnter={() => {
                  setActiveNode(c.name);
                  setNodeDetail(`Adjacent Direction: ${c.detail}`);
                }}
                onClick={() => {
                  setActiveNode(c.name);
                  setNodeDetail(`Adjacent Direction: ${c.detail}`);
                }}
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isSelected ? 28 : 24}
                  className={`transition-all duration-300 fill-[#0F172A] ${
                    isSelected
                      ? "stroke-emerald-400 stroke-2 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : "stroke-border group-hover:stroke-emerald-400/60 stroke-1"
                  }`}
                />
                <circle cx={c.x} cy={c.y} r={18} className="fill-emerald-500/10" />
                <text
                  x={c.x}
                  y={c.y + 3}
                  textAnchor="middle"
                  className="fill-foreground font-heading text-[9px] font-medium pointer-events-none"
                >
                  {c.name.length > 11 ? `${c.name.slice(0, 10)}…` : c.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Detail Card Below Diagram */}
      <div className="mt-4 p-4 rounded-xl bg-[#0F172A] border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              {activeNode}
            </p>
            <p className="text-xs sm:text-sm text-foreground/90 mt-0.5 font-sans">
              {nodeDetail}
            </p>
          </div>
        </div>

        {/* If an adjacent career is selected, show quick exploration link */}
        {pathways.some((p) => p.title === activeNode) && (
          <Link
            href={`/career/${pathways.find((p) => p.title === activeNode)?.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shrink-0 self-end sm:self-auto"
          >
            <span>Explore Pathway</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
