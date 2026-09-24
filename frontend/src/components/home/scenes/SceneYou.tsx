"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { CenterBadge, OrbitRings, SpokeLine, usePolarPosition } from "../Constellation";
import { heroText, sceneBody, smallLabel } from "../typography";

// Small, unlabeled ambient nodes — decorative only at this stage.
// (The real, labeled domain/trait constellations appear later in the
// story — this scene never repeats them, per the "no duplication" rule.)
const AMBIENT_NODES = [-90, -38, 14, 68, 125, 180, 232].map((angle, i) => ({
  angle,
  distance: 34 + (i % 2 === 0 ? 2 : -2),
}));

function AmbientDot({
  angle,
  distance,
  factor,
  opacity,
}: {
  angle: number;
  distance: number;
  factor: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const { x, y } = usePolarPosition(factor, angle, distance);
  return <motion.circle cx={x} cy={y} r={0.9} fill="var(--primary)" style={{ opacity }} />;
}

export function SceneYou({ progress }: { progress: MotionValue<number> }) {
  // Hero copy: fully present, then fades + shrinks as the story begins.
  const heroOpacity = useTransform(progress, [0, 0.22, 0.5], [1, 1, 0]);
  const heroScale = useTransform(progress, [0, 0.5], [1, 0.82]);
  const heroY = useTransform(progress, [0, 0.5], [0, -40]);

  // Constellation: starts as a modest visual, grows to dominate the frame.
  const constellationScale = useTransform(progress, [0, 0.3, 1], [0.82, 0.9, 1.15]);
  const ringOpacity = useTransform(progress, [0, 0.3, 1], [0.5, 0.8, 1]);
  const nodeFactor = useTransform(progress, [0.15, 0.55], [0.78, 1]);
  const nodeOpacity = useTransform(progress, [0.15, 0.4, 0.75, 1], [0, 0.6, 0.6, 0.15]);
  const centerScale = useTransform(progress, [0, 0.6, 1], [1, 1.05, 1.15]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_45%,rgba(200,146,42,0.06),transparent_70%)]" />

      {/* ── Hero copy (fades as scroll begins) ───────────────────── */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mb-6 sm:mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#10141A] text-muted-foreground mb-5 ${smallLabel}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Navigation Instrument &middot; Career Intelligence</span>
        </div>

        <h1 className={`${heroText} mb-4`}>Your future has more than one direction.</h1>

        <p className={`${sceneBody} max-w-xl mb-8`}>
          Career Compass helps you understand where your strengths point &mdash; and what to do next.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/assessment"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Take the Assessment</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/careers"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-[#10141A] px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors"
          >
            Explore More Careers
          </Link>
        </div>
      </motion.div>

      {/* ── Constellation: center of the whole story ─────────────── */}
      <motion.div
        style={{ scale: constellationScale }}
        className="relative w-full max-w-155 aspect-square mx-auto select-none"
      >
        <OrbitRings opacity={ringOpacity} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {AMBIENT_NODES.map((n, i) => (
            <SpokeLine key={i} angle={n.angle} distance={n.distance} factor={nodeFactor} opacity={nodeOpacity} />
          ))}
          {AMBIENT_NODES.map((n, i) => (
            <AmbientDot key={i} angle={n.angle} distance={n.distance} factor={nodeFactor} opacity={nodeOpacity} />
          ))}
        </svg>
        <CenterBadge scale={centerScale} />
      </motion.div>
    </div>
  );
}
