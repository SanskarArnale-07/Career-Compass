"use client";

/**
 * HeroConstellation — An abstract SVG-based career trajectory visual.
 *
 * Represents: YOU → multiple possible directions → clearer career path.
 * Uses orbit rings, radial lines, constellation nodes, and a warm amber pulse.
 * All animation is CSS-driven for performance.
 */
export function HeroConstellation() {
  const nodes = [
    { cx: 50, cy: 12, label: "Engineer" },
    { cx: 88, cy: 32, label: "Designer" },
    { cx: 82, cy: 72, label: "Analyst" },
    { cx: 50, cy: 90, label: "Scientist" },
    { cx: 18, cy: 72, label: "Writer" },
    { cx: 12, cy: 32, label: "Strategist" },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square select-none" aria-hidden="true">
      {/* Atmospheric amber glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-primary/8 blur-3xl rounded-full animate-pulse-glow" />

      {/* SVG Constellation */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orbit rings */}
        <g className="animate-orbit-slow" style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="38" stroke="var(--border)" strokeWidth="0.15" opacity="0.5" />
        </g>
        <g className="animate-orbit-reverse" style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="28" stroke="var(--border)" strokeWidth="0.15" opacity="0.4" />
        </g>
        <g className="animate-orbit" style={{ transformOrigin: "50% 50%" }}>
          <circle cx="50" cy="50" r="18" stroke="var(--border)" strokeWidth="0.2" opacity="0.3" />
        </g>

        {/* Radial trajectory lines from center to each node */}
        {nodes.map((node, i) => (
          <line
            key={`line-${i}`}
            x1="50"
            y1="50"
            x2={node.cx}
            y2={node.cy}
            stroke="var(--border)"
            strokeWidth="0.15"
            opacity="0.4"
            strokeDasharray="1 1.5"
          />
        ))}

        {/* Constellation nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            {/* Outer glow */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="2"
              fill="var(--primary)"
              opacity="0.08"
            />
            {/* Node dot */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="0.8"
              fill="var(--foreground)"
              opacity="0.5"
            />
            {/* Label */}
            <text
              x={node.cx}
              y={node.cy - 2.5}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="2"
              fontFamily="var(--font-sans)"
              letterSpacing="0.08"
              opacity="0.6"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Center point — YOU */}
        {/* Amber pulse ring */}
        <circle
          cx="50" cy="50" r="4"
          stroke="var(--primary)"
          strokeWidth="0.2"
          fill="none"
          opacity="0.25"
          className="animate-pulse-glow"
          style={{ transformOrigin: "50% 50%" }}
        />
        {/* Inner warm glow */}
        <circle
          cx="50" cy="50" r="2.5"
          fill="var(--primary)"
          opacity="0.12"
        />
        {/* Core dot */}
        <circle
          cx="50" cy="50" r="1.2"
          fill="var(--primary)"
          opacity="0.9"
        />
        {/* Center label */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fill="var(--foreground)"
          fontSize="2.2"
          fontFamily="var(--font-heading)"
          fontWeight="600"
          letterSpacing="0.15"
          opacity="0.7"
        >
          YOU
        </text>
      </svg>

      {/* Outer subtle ring accent (CSS) */}
      <div className="absolute inset-4 rounded-full border border-border/20 pointer-events-none" />
    </div>
  );
}
