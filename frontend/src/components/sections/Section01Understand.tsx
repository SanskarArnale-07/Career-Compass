"use client";

import { useState } from "react";

interface TraitDimension {
  code: string;
  name: string;
  score: number; // percentage benchmark
  tagline: string;
}

const TRAITS: TraitDimension[] = [
  { code: "AN", name: "Analytical", score: 88, tagline: "Systematic logic & structural pattern recognition" },
  { code: "TE", name: "Technical", score: 92, tagline: "Engineering fluency, systems architecture & tooling" },
  { code: "SC", name: "Scientific", score: 76, tagline: "Empirical hypothesis, verification & deep inquiry" },
  { code: "BU", name: "Business", score: 64, tagline: "Value mechanics, resource leverage & strategic positioning" },
  { code: "CR", name: "Creative", score: 82, tagline: "Aesthetic synthesis, lateral problem solving & vision" },
  { code: "SO", name: "Social", score: 70, tagline: "Human empathy, team dynamics & community impact" },
  { code: "LE", name: "Leadership", score: 78, tagline: "Direction setting, initiative ownership & momentum" },
  { code: "EX", name: "Exploration", score: 90, tagline: "Curiosity, adaptability & frontier navigation" },
];

export function Section01Understand() {
  const [activeTrait, setActiveTrait] = useState<TraitDimension>(TRAITS[0]);

  // Compute 8-sided polygon coordinates on an SVG viewBox of 200x200
  const center = 100;
  const radius = 70;
  const numPoints = TRAITS.length;

  const getPoint = (index: number, valueFactor: number) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = radius * valueFactor;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon points for the active profile
  const polygonPoints = TRAITS.map((t, i) => {
    const pt = getPoint(i, t.score / 100);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <section className="py-20 md:py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Large Editorial Number & Core Narrative ── */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Editorial Number */}
            <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-4">
              01
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Understand Yourself
            </h2>

            <p className="text-base sm:text-lg text-secondary-foreground leading-relaxed mb-8 max-w-lg font-light">
              Your assessment maps your interests, strengths and cognitive traits across 8 dimensions.
            </p>

            {/* Subtle trait telemetry readout */}
            <div className="p-4 rounded-lg bg-[#141210] border border-border/60 w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-muted-foreground uppercase tracking-wider">Active Dimension</span>
                <span className="text-primary font-bold">{activeTrait.code} · {activeTrait.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeTrait.tagline}
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Subtle 8-Dimensional Radar Representation ─ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square p-2">
              
              {/* SVG 8-Axis Radar Chart */}
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Background grid concentric circles */}
                {[0.25, 0.5, 0.75, 1.0].map((ring, idx) => (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius * ring}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.8"
                    strokeDasharray={idx === 3 ? "none" : "2 3"}
                    opacity="0.5"
                  />
                ))}

                {/* 8 Radial Axis Lines */}
                {TRAITS.map((_, idx) => {
                  const pt = getPoint(idx, 1.05);
                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="var(--border)"
                      strokeWidth="0.7"
                      opacity="0.4"
                    />
                  );
                })}

                {/* Shaded Profile Polygon */}
                <polygon
                  points={polygonPoints}
                  fill="var(--primary)"
                  fillOpacity="0.08"
                  stroke="var(--primary)"
                  strokeWidth="1.2"
                  className="transition-all duration-300"
                />

                {/* Axis Node Points & Interactive Circles */}
                {TRAITS.map((trait, idx) => {
                  const pt = getPoint(idx, trait.score / 100);
                  const isSelected = activeTrait.code === trait.code;

                  return (
                    <g key={trait.code} className="cursor-pointer" onClick={() => setActiveTrait(trait)}>
                      {/* Active pulse */}
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="6"
                          fill="var(--primary)"
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}
                      {/* Node circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? "3.5" : "2"}
                        fill={isSelected ? "var(--primary)" : "var(--foreground)"}
                        stroke="#0E0E0E"
                        strokeWidth="1"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Trait Label Badges Arranged Around Chart */}
              {TRAITS.map((trait, idx) => {
                const pt = getPoint(idx, 1.25);
                const isSelected = activeTrait.code === trait.code;

                return (
                  <button
                    key={trait.code}
                    onClick={() => setActiveTrait(trait)}
                    onMouseEnter={() => setActiveTrait(trait)}
                    className={`absolute text-[11px] font-mono px-2 py-0.5 rounded transition-all duration-200 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      isSelected
                        ? "text-primary font-semibold bg-[#1C1814] border border-primary/40 shadow-sm"
                        : "text-muted-foreground hover:text-foreground bg-[#141210]/60 border border-transparent"
                    }`}
                    style={{
                      left: `${(pt.x / 200) * 100}%`,
                      top: `${(pt.y / 200) * 100}%`,
                    }}
                  >
                    <span>{trait.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
