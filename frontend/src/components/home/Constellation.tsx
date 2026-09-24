"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/** Converts a shared 0->1 "expansion factor" + a fixed angle/max-distance into
 *  polar coordinates (percentage, on a 0-100 viewBox centered at 50,50). */
export function usePolarPosition(
  factor: MotionValue<number>,
  angleDeg: number,
  maxDistance: number
) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = useTransform(factor, (f) => 50 + f * maxDistance * Math.cos(rad));
  const y = useTransform(factor, (f) => 50 + f * maxDistance * Math.sin(rad));
  return { x, y };
}

export function CenterBadge({
  opacity,
  scale,
  label = "YOU",
}: {
  opacity?: MotionValue<number>;
  scale?: MotionValue<number>;
  label?: string;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
      style={{ opacity, scale }}
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-primary/40 animate-ping opacity-20" />
        <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-[#141920] border-2 border-primary flex items-center justify-center shadow-lg shadow-cyan-950/50">
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-primary">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function OrbitRings({ opacity }: { opacity?: MotionValue<number> }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible", opacity }}
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--border)" strokeWidth="0.12" strokeDasharray="0.6 2.4" opacity="0.3" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="0.15" opacity="0.35" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="var(--border)" strokeWidth="0.15" opacity="0.3" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="var(--primary)" strokeWidth="0.3" opacity="0.4" />
    </motion.svg>
  );
}

export function SpokeLine({
  angle,
  distance,
  factor,
  opacity,
  active,
}: {
  angle: number;
  distance: number;
  factor: MotionValue<number>;
  opacity?: MotionValue<number> | number;
  active?: boolean;
}) {
  const { x, y } = usePolarPosition(factor, angle, distance);
  return (
    <motion.line
      x1="50"
      y1="50"
      x2={x}
      y2={y}
      stroke={active ? "var(--primary)" : "var(--border)"}
      strokeWidth={active ? 0.45 : 0.18}
      strokeDasharray={active ? "none" : "1 1"}
      style={{ opacity }}
    />
  );
}

export function SpokeNode({
  angle,
  distance,
  factor,
  opacity,
  label,
  active,
  dim,
  onActivate,
}: {
  angle: number;
  distance: number;
  factor: MotionValue<number>;
  opacity?: MotionValue<number> | number;
  label: string;
  active?: boolean;
  dim?: boolean;
  onActivate?: () => void;
}) {
  const { x, y } = usePolarPosition(factor, angle, distance);
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);

  return (
    <motion.div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, opacity }}
      onMouseEnter={onActivate}
    >
      <div
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border whitespace-nowrap backdrop-blur-md transition-colors duration-300 ${
          active
            ? "bg-[#141920] border-primary text-foreground shadow-md shadow-cyan-950/40"
            : dim
              ? "bg-[#10141A]/60 border-border/30 text-muted-foreground/50"
              : "bg-[#10141A]/90 border-border/70 text-muted-foreground"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            active ? "bg-primary shadow-sm shadow-primary" : "bg-muted-foreground/40"
          }`}
        />
        <span className={`text-[10px] sm:text-xs font-heading font-medium tracking-tight ${active ? "text-primary font-semibold" : ""}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
