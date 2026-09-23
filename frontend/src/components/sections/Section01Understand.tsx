"use client";

import { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";

interface TraitDimension {
  code: string;
  name: string;
}

const TRAITS: TraitDimension[] = [
  { code: "AN", name: "Analytical" },
  { code: "TE", name: "Technical" },
  { code: "SC", name: "Scientific" },
  { code: "BU", name: "Business" },
  { code: "CR", name: "Creative" },
  { code: "SO", name: "Social" },
  { code: "LE", name: "Leadership" },
  { code: "EX", name: "Exploration" },
];

export function Section01Understand() {
  const [activeTrait, setActiveTrait] = useState<TraitDimension>(TRAITS[0]);

  // Compute 8-sided geometry on an SVG viewBox of 220x220
  const center = 110;
  const radius = 72;
  const numPoints = TRAITS.length;

  const getPoint = (index: number, factor = 1) => {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const r = radius * factor;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Outer balanced perimeter ring points
  const outerPolygon = TRAITS.map((_, i) => {
    const pt = getPoint(i, 1.0);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Mid decorative ring points
  const midPolygon = TRAITS.map((_, i) => {
    const pt = getPoint(i, 0.6);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <section className="py-16 md:py-20 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ── LEFT COLUMN: Editorial Number & Concise Narrative ── */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-3">
              01
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Understand Yourself
            </h2>

            <p className="text-base sm:text-lg text-secondary-foreground leading-relaxed mb-6 font-light max-w-md">
              20 questions help map your interests, strengths and preferences across 8 dimensions.
            </p>

            {/* Simple concept pill: 20 Questions → 8 Traits */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#141210] border border-border/70 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">20 Questions</span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="text-primary font-semibold">8 Dimensions</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Single Balanced 8-Dimension Compass Visual ─ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[380px] aspect-square p-4">
              
              {/* SVG 8-Spoke Navigational Compass Star */}
              <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                {/* Concentric Guide Circles */}
                {[0.3, 0.65, 1.0].map((ring, idx) => (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius * ring}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.8"
                    strokeDasharray={idx === 2 ? "none" : "2 3"}
                    opacity="0.4"
                  />
                ))}

                {/* Inner Balanced Octagon Web */}
                <polygon
                  points={midPolygon}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="0.8"
                  opacity="0.3"
                />

                {/* Outer Balanced Octagon Boundary */}
                <polygon
                  points={outerPolygon}
                  fill="rgba(200, 146, 42, 0.03)"
                  stroke="rgba(200, 146, 42, 0.3)"
                  strokeWidth="1"
                />

                {/* 8 Radial Spokes */}
                {TRAITS.map((trait, idx) => {
                  const pt = getPoint(idx, 1.0);
                  const isSelected = activeTrait.code === trait.code;

                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={pt.x}
                      y2={pt.y}
                      stroke={isSelected ? "var(--primary)" : "var(--border)"}
                      strokeWidth={isSelected ? "1.4" : "0.8"}
                      opacity={isSelected ? "0.9" : "0.35"}
                      className="transition-colors duration-200"
                    />
                  );
                })}

                {/* Center Pivot Point */}
                <circle
                  cx={center}
                  cy={center}
                  r="3.5"
                  fill="var(--primary)"
                  opacity="0.8"
                />
                <circle
                  cx={center}
                  cy={center}
                  r="8"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="0.8"
                  opacity="0.3"
                />

                {/* 8 Axis Terminal Nodes */}
                {TRAITS.map((trait, idx) => {
                  const pt = getPoint(idx, 1.0);
                  const isSelected = activeTrait.code === trait.code;

                  return (
                    <g
                      key={trait.code}
                      className="cursor-pointer"
                      onClick={() => setActiveTrait(trait)}
                      onMouseEnter={() => setActiveTrait(trait)}
                    >
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="7"
                          fill="var(--primary)"
                          opacity="0.2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? "4" : "2.5"}
                        fill={isSelected ? "var(--primary)" : "var(--foreground)"}
                        stroke="#0E0C0A"
                        strokeWidth="1"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dimension Badges Positioned Around the Compass */}
              {TRAITS.map((trait, idx) => {
                const pt = getPoint(idx, 1.28);
                const isSelected = activeTrait.code === trait.code;

                return (
                  <button
                    key={trait.code}
                    onClick={() => setActiveTrait(trait)}
                    onMouseEnter={() => setActiveTrait(trait)}
                    className={`absolute text-xs font-mono px-2 py-0.5 rounded transition-all duration-200 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      isSelected
                        ? "text-primary font-semibold bg-[#1C1814] border border-primary/40 shadow-sm"
                        : "text-muted-foreground hover:text-foreground bg-[#141210]/70 border border-border/40"
                    }`}
                    style={{
                      left: `${(pt.x / 220) * 100}%`,
                      top: `${(pt.y / 220) * 100}%`,
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
