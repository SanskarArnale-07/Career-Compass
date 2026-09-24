"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CenterBadge, OrbitRings, SpokeLine, SpokeNode } from "../Constellation";
import { sceneBody, sceneHeading, smallLabel } from "../typography";

const TRAITS = [
  { label: "Analytical", angle: -90 },
  { label: "Technical", angle: -45 },
  { label: "Scientific", angle: 0 },
  { label: "Business", angle: 45 },
  { label: "Creative", angle: 90 },
  { label: "Social", angle: 135 },
  { label: "Leadership", angle: 180 },
  { label: "Exploration", angle: 225 },
];

export function SceneUnderstand({ progress }: { progress: MotionValue<number> }) {
  // Nodes grow outward from the center, then collapse back in as the
  // scene hands off to the domain reveal in Scene 03.
  const nodeFactor = useTransform(progress, [0, 0.3, 0.7, 1], [0.12, 1, 1, 0.3]);
  const nodeOpacity = useTransform(progress, [0, 0.15, 0.7, 0.9], [0.15, 0.85, 0.85, 0.2]);
  const lineOpacity = useTransform(progress, [0, 0.15, 0.75, 0.95], [0.1, 0.6, 0.6, 0.1]);
  const ringOpacity = useTransform(progress, [0, 0.3, 1], [0.6, 1, 0.5]);

  const headingOpacity = useTransform(progress, [0.28, 0.42, 0.68, 0.82], [0, 1, 1, 0]);
  const headingY = useTransform(progress, [0.28, 0.42], [16, 0]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      {/* ── Heading (appears mid-scene) ───────────────────────────── */}
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
        className="relative z-30 flex flex-col items-center text-center max-w-xl mb-8 sm:mb-10"
      >
        <h2 className={`${sceneHeading} mb-3`}>First, we understand you.</h2>
        <p className={`${sceneBody} mb-5 max-w-md`}>
          Your responses map the interests, strengths, and preferences that shape your direction.
        </p>
        <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#10141A] border border-border/70 text-muted-foreground ${smallLabel} normal-case tracking-normal`}>
          <span className="text-foreground font-semibold font-mono text-xs">20 Questions</span>
          <ArrowRight className="h-3 w-3 text-primary" />
          <span className="text-primary font-semibold font-mono text-xs">8 Dimensions</span>
        </div>
      </motion.div>

      {/* ── Trait constellation ────────────────────────────────────── */}
      <div className="relative w-full max-w-140 aspect-square mx-auto select-none">
        <OrbitRings opacity={ringOpacity} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {TRAITS.map((t, i) => (
            <SpokeLine key={i} angle={t.angle} distance={34} factor={nodeFactor} opacity={lineOpacity} />
          ))}
        </svg>
        {TRAITS.map((t, i) => (
          <SpokeNode key={i} angle={t.angle} distance={34} factor={nodeFactor} opacity={nodeOpacity} label={t.label} />
        ))}
        <CenterBadge />
      </div>
    </div>
  );
}
