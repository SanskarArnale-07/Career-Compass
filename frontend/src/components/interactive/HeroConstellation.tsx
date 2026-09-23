"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CareerPath {
  name: string;
  role: string;
}

interface DomainNode {
  id: string;
  label: string;
  angle: number; // in degrees
  distance: number; // percentage radius from center
  paths: CareerPath[];
}

const DOMAINS: DomainNode[] = [
  {
    id: "engineering",
    label: "Engineering",
    angle: -90, // Top
    distance: 36,
    paths: [
      { name: "Software Engineering", role: "Architecture & Systems" },
      { name: "Civil Engineering", role: "Infrastructure & Design" },
      { name: "Mechanical Engineering", role: "Robotics & Hardware" },
    ],
  },
  {
    id: "technology",
    label: "Technology",
    angle: -38,
    distance: 38,
    paths: [
      { name: "Cybersecurity", role: "SecOps & Defense" },
      { name: "Cloud Architecture", role: "Distributed Infra" },
      { name: "Systems & DevOps", role: "Reliability & Scale" },
    ],
  },
  {
    id: "data",
    label: "Data",
    angle: 14,
    distance: 37,
    paths: [
      { name: "Data Science", role: "Predictive Modeling" },
      { name: "Analytics", role: "Business Intelligence" },
      { name: "Machine Learning / AI", role: "Deep Learning" },
    ],
  },
  {
    id: "business",
    label: "Business",
    angle: 68,
    distance: 36,
    paths: [
      { name: "Product Management", role: "Strategy & Execution" },
      { name: "Entrepreneurship", role: "Venture Creation" },
      { name: "Finance & Strategy", role: "Capital & Growth" },
    ],
  },
  {
    id: "society",
    label: "People & Society",
    angle: 125,
    distance: 38,
    paths: [
      { name: "Psychology", role: "Behavioral Analysis" },
      { name: "Public Policy", role: "Governance & Law" },
      { name: "Education & Impact", role: "Social Leadership" },
    ],
  },
  {
    id: "science",
    label: "Science",
    angle: 180,
    distance: 36,
    paths: [
      { name: "Scientific Research", role: "Experimental Inquiry" },
      { name: "Biotechnology", role: "Genomics & Pharma" },
      { name: "Applied Physics", role: "Materials & Energy" },
    ],
  },
  {
    id: "design",
    label: "Design",
    angle: 232,
    distance: 37,
    paths: [
      { name: "Product Design", role: "Interface & Experience" },
      { name: "Visual Systems", role: "Brand & Graphic Craft" },
      { name: "UX Research", role: "Cognitive Ergonomics" },
    ],
  },
];

export function HeroConstellation() {
  const [activeDomainId, setActiveDomainId] = useState<string>("engineering");
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto cycle active domain every 4.5s if not manually paused
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveDomainId((current) => {
        const currentIndex = DOMAINS.findIndex((d) => d.id === current);
        const nextIndex = (currentIndex + 1) % DOMAINS.length;
        return DOMAINS[nextIndex].id;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const activeDomain = DOMAINS.find((d) => d.id === activeDomainId) || DOMAINS[0];

  // Helper to convert polar coordinates (center 50,50) to Cartesian %
  const getCoordinates = (angleDeg: number, radiusPercent: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: 50 + radiusPercent * Math.cos(rad),
      y: 50 + radiusPercent * Math.sin(rad),
    };
  };

  return (
    <div
      className="relative w-full max-w-[680px] lg:max-w-[760px] aspect-[1/0.92] sm:aspect-square mx-auto select-none"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
    >
      {/* ── Background Instrument Grid & Radial Gradients ──────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Soft amber beacon behind YOU center */}
        <div className="w-56 h-56 rounded-full bg-primary/10 blur-[90px] animate-pulse" />
        {/* Subtle secondary ambient glow */}
        <div className="w-[85%] h-[85%] rounded-full border border-border/20" />
      </div>

      {/* ── SVG Navigation Astrolabe / Radar Circles ───────────────── */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        {/* Degree coordinate ticks (Instrument style) */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.12"
          strokeDasharray="0.6 2.4"
          opacity="0.3"
        />

        {/* Outer orbital boundary */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.15"
          opacity="0.35"
        />

        {/* Domain node orbit ring */}
        <circle
          cx="50"
          cy="50"
          r="36.5"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.2"
          strokeDasharray="2 2"
          opacity="0.4"
        />

        {/* Inner sub-orbit */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.15"
          opacity="0.3"
        />

        {/* Core compass boundary around YOU */}
        <circle
          cx="50"
          cy="50"
          r="9"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.3"
          opacity="0.45"
        />
        <circle
          cx="50"
          cy="50"
          r="13"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.1"
          opacity="0.25"
        />

        {/* Crosshair axis markers */}
        <line
          x1="50"
          y1="2"
          x2="50"
          y2="98"
          stroke="var(--border)"
          strokeWidth="0.08"
          opacity="0.2"
        />
        <line
          x1="2"
          y1="50"
          x2="98"
          y2="50"
          stroke="var(--border)"
          strokeWidth="0.08"
          opacity="0.2"
        />

        {/* Vector trajectories from YOU center to each Domain */}
        {DOMAINS.map((domain) => {
          const coords = getCoordinates(domain.angle, domain.distance);
          const isActive = domain.id === activeDomainId;

          return (
            <g key={`vector-${domain.id}`}>
              {/* Domain line */}
              <line
                x1="50"
                y1="50"
                x2={coords.x}
                y2={coords.y}
                stroke={isActive ? "var(--primary)" : "var(--border)"}
                strokeWidth={isActive ? "0.45" : "0.15"}
                opacity={isActive ? 0.9 : 0.35}
                strokeDasharray={isActive ? "none" : "1 1"}
                className="transition-all duration-500"
              />

              {/* Sub-branch lines extending from the ACTIVE domain node outwards */}
              {isActive &&
                domain.paths.map((_, pIdx) => {
                  const branchAngle = domain.angle + (pIdx - 1) * 20;
                  const branchCoords = getCoordinates(branchAngle, domain.distance + 10);
                  return (
                    <line
                      key={`subline-${pIdx}`}
                      x1={coords.x}
                      y1={coords.y}
                      x2={branchCoords.x}
                      y2={branchCoords.y}
                      stroke="var(--primary)"
                      strokeWidth="0.3"
                      strokeDasharray="0.8 0.8"
                      opacity="0.75"
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>

      {/* ── CENTER NODE: YOU ───────────────────────────────────────── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="relative flex flex-col items-center justify-center">
          {/* Signal radar wave */}
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-primary/40 animate-ping opacity-25" />
          
          {/* Glowing central core badge */}
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#161412] border-2 border-primary flex flex-col items-center justify-center shadow-lg shadow-amber-950/50">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-primary">
              YOU
            </span>
          </div>
          
          <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70 mt-1">
            Origin
          </span>
        </div>
      </div>

      {/* ── DOMAIN NODES & SUB-BRANCHES ───────────────────────────── */}
      {DOMAINS.map((domain) => {
        const coords = getCoordinates(domain.angle, domain.distance);
        const isActive = domain.id === activeDomainId;

        return (
          <div
            key={domain.id}
            className="absolute z-20 cursor-pointer"
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => {
              setActiveDomainId(domain.id);
              setAutoRotate(false);
            }}
            onMouseEnter={() => {
              setActiveDomainId(domain.id);
            }}
          >
            {/* Domain Node Button */}
            <div
              className={`group flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border transition-all duration-300 backdrop-blur-md ${
                isActive
                  ? "bg-[#1C1814] border-primary text-foreground shadow-md shadow-amber-950/40 scale-105"
                  : "bg-[#141210]/90 border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {/* Indicator dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? "bg-primary shadow-sm shadow-primary" : "bg-muted-foreground/40 group-hover:bg-primary/60"
                }`}
              />
              <span
                className={`text-[10px] sm:text-xs font-heading font-medium tracking-tight whitespace-nowrap ${
                  isActive ? "text-primary font-semibold" : ""
                }`}
              >
                {domain.label}
              </span>
            </div>

            {/* Sub-Branch Career Paths (Displayed when this node is active) */}
            {isActive && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5 pointer-events-auto">
                <div className="flex flex-col gap-1 w-44 sm:w-52 p-2 rounded-lg bg-[#141210]/95 border border-primary/30 shadow-xl backdrop-blur-md animate-fade-in-up">
                  <div className="flex items-center justify-between pb-1 border-b border-border/50 text-[9px] font-mono uppercase tracking-widest text-primary/80">
                    <span>Hierarchy</span>
                    <span>Pathways</span>
                  </div>
                  {domain.paths.map((path, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center justify-between text-left py-1 px-1.5 rounded hover:bg-white/5 transition-colors"
                    >
                      <div className="truncate">
                        <p className="text-[11px] font-medium text-foreground truncate">
                          {path.name}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground truncate">
                          {path.role}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-primary/60 shrink-0 ml-1">
                        →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Active Path Callout (Bottom-Left Telemetry Box) ─────────── */}
      <div className="hidden sm:flex absolute bottom-2 left-2 z-10 p-2.5 rounded-lg bg-[#131110]/85 border border-border/60 text-[10px] font-mono text-muted-foreground backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Vector Active:</span>
          <span className="text-foreground font-semibold uppercase">{activeDomain.label}</span>
          <span className="text-muted-foreground/60">({activeDomain.paths.length} Paths)</span>
        </div>
      </div>

      {/* ── Instrument Legend (Bottom-Right Telemetry) ─────────────── */}
      <div className="hidden sm:flex absolute bottom-2 right-2 z-10 p-2.5 rounded-lg bg-[#131110]/85 border border-border/60 text-[10px] font-mono text-muted-foreground backdrop-blur-sm">
        <span className="text-primary font-mono tracking-widest">NAV·GRID 0.88</span>
      </div>
    </div>
  );
}
