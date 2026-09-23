"use client";

import { useEffect, useState } from "react";

// Constellation node positions (percentage-based, relative to container)
const NODES = [
  { x: 18, y: 22, label: "Design", delay: 0 },
  { x: 75, y: 15, label: "Engineering", delay: 0.8 },
  { x: 85, y: 55, label: "Data", delay: 1.6 },
  { x: 70, y: 82, label: "Business", delay: 2.4 },
  { x: 25, y: 78, label: "Research", delay: 0.4 },
  { x: 10, y: 50, label: "Healthcare", delay: 1.2 },
  { x: 42, y: 10, label: "Technology", delay: 2.0 },
  { x: 58, y: 88, label: "Creative", delay: 2.8 },
];

// Trajectory lines from center to nodes
const TRAJECTORIES = [
  { endX: 18, endY: 22 },
  { endX: 75, endY: 15 },
  { endX: 85, endY: 55 },
  { endX: 70, endY: 82 },
  { endX: 25, endY: 78 },
  { endX: 10, endY: 50 },
  { endX: 42, endY: 10 },
  { endX: 58, endY: 88 },
];

export function HeroConstellation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto" aria-hidden="true">
      {/* Ambient glow behind everything */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-primary/8 blur-[80px]" />
      </div>

      {/* SVG Canvas for orbits and trajectories */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Orbit rings */}
        <circle
          cx="50" cy="50" r="18"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.2"
          opacity="0.5"
          className="animate-slow-rotate"
          style={{ transformOrigin: "50px 50px" }}
        />
        <circle
          cx="50" cy="50" r="32"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.15"
          opacity="0.35"
          className="animate-slow-rotate"
          style={{ transformOrigin: "50px 50px", animationDuration: "90s", animationDirection: "reverse" }}
        />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.1"
          opacity="0.2"
        />

        {/* Trajectory lines from center to nodes */}
        {TRAJECTORIES.map((t, i) => (
          <line
            key={`traj-${i}`}
            x1="50" y1="50"
            x2={t.endX} y2={t.endY}
            stroke="var(--border)"
            strokeWidth="0.12"
            opacity={mounted ? 0.3 : 0}
            style={{
              transition: `opacity 1.5s ease ${i * 0.15}s`,
            }}
          />
        ))}

        {/* Central amber pulse */}
        <circle
          cx="50" cy="50" r="4"
          fill="var(--primary)"
          opacity="0.15"
          className="animate-pulse-glow"
        />
        <circle
          cx="50" cy="50" r="2.5"
          fill="var(--primary)"
          opacity="0.25"
          className="animate-pulse-glow"
          style={{ animationDelay: "0.5s" }}
        />
        {/* Center dot */}
        <circle
          cx="50" cy="50" r="1.2"
          fill="var(--primary)"
          opacity="0.9"
        />

        {/* "YOU" label */}
        <text
          x="50" y="55.5"
          textAnchor="middle"
          fill="var(--primary)"
          fontSize="2"
          fontFamily="var(--font-heading)"
          fontWeight="600"
          letterSpacing="0.15em"
          opacity="0.7"
        >
          YOU
        </text>
      </svg>

      {/* Constellation star nodes */}
      {NODES.map((node, i) => (
        <div
          key={`node-${i}`}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: mounted ? 1 : 0,
            transition: `opacity 0.8s ease ${node.delay + 0.5}s, transform 0.8s ease ${node.delay + 0.5}s`,
          }}
        >
          {/* Star dot */}
          <div
            className="animate-float-gentle"
            style={{ animationDelay: `${node.delay * 0.7}s`, animationDuration: `${3.5 + i * 0.3}s` }}
          >
            <div className="relative flex items-center justify-center">
              {/* Glow */}
              <div className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 blur-sm" />
              {/* Dot */}
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-foreground/40 border border-foreground/10" />
            </div>
          </div>
        </div>
      ))}

      {/* Small decorative dots scattered on orbits */}
      {[
        { x: 50, y: 5, size: 1 },
        { x: 95, y: 50, size: 0.8 },
        { x: 50, y: 95, size: 0.6 },
        { x: 5, y: 50, size: 0.8 },
        { x: 82, y: 18, size: 0.5 },
        { x: 18, y: 82, size: 0.5 },
      ].map((dot, i) => (
        <div
          key={`dec-${i}`}
          className="absolute rounded-full bg-foreground/15"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size * 3}px`,
            height: `${dot.size * 3}px`,
            transform: "translate(-50%, -50%)",
            opacity: mounted ? 0.4 : 0,
            transition: `opacity 2s ease ${1 + i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
