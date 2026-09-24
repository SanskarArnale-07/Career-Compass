"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { CenterBadge, OrbitRings, SpokeLine, SpokeNode } from "../Constellation";
import { sceneBody, sceneHeading } from "../typography";

// Real canonical domains — no hardcoded taxonomy. The story carries this
// same domain forward into Scene 04's career tree.
const LEAD_DOMAIN_ID = "engineering-technology";
const DOMAIN_ANGLES = [-90, -30, 30, 90, 150, 210];

const DOMAIN_NODES = CAREER_DOMAINS.slice(0, 6).map((domain, i) => ({
  id: domain.id,
  label: domain.name,
  angle: DOMAIN_ANGLES[i] ?? i * 60,
}));

export function SceneDirection({ progress }: { progress: MotionValue<number> }) {
  const nodeFactor = useTransform(progress, [0, 0.28], [0.25, 1]);

  const headingOpacity = useTransform(progress, [0.22, 0.36, 0.6, 0.74], [0, 1, 1, 0]);
  const headingY = useTransform(progress, [0.22, 0.36], [16, 0]);

  const ringOpacity = useTransform(progress, [0, 0.3, 1], [0.5, 1, 0.9]);

  // Generic reveal used by every non-lead domain node.
  const fadeOpacity = useTransform(progress, [0, 0.15, 0.55, 0.85], [0.1, 0.85, 0.85, 0.15]);
  // The lead domain stays bright the whole way through.
  const leadOpacity = useTransform(progress, [0, 0.15, 1], [0.1, 1, 1]);

  const branchOpacity = useTransform(progress, [0.7, 0.95], [0, 1]);
  const branchHeight = useTransform(progress, [0.7, 1], ["0%", "38%"]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
        className="relative z-30 flex flex-col items-center text-center max-w-xl mb-8 sm:mb-10"
      >
        <h2 className={`${sceneHeading} mb-3`}>Then, your direction starts to take shape.</h2>
        <p className={`${sceneBody} max-w-md`}>
          Your results highlight the career directions that align most closely with your profile.
        </p>
      </motion.div>

      <div className="relative w-full max-w-[560px] aspect-square mx-auto select-none">
        <OrbitRings opacity={ringOpacity} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {DOMAIN_NODES.map((d) => (
            <SpokeLine
              key={d.id}
              angle={d.angle}
              distance={35}
              factor={nodeFactor}
              opacity={d.id === LEAD_DOMAIN_ID ? leadOpacity : fadeOpacity}
              active={d.id === LEAD_DOMAIN_ID}
            />
          ))}
        </svg>
        {DOMAIN_NODES.map((d) => (
          <SpokeNode
            key={d.id}
            angle={d.angle}
            distance={35}
            factor={nodeFactor}
            opacity={d.id === LEAD_DOMAIN_ID ? leadOpacity : fadeOpacity}
            label={d.label}
            active={d.id === LEAD_DOMAIN_ID}
          />
        ))}
        <CenterBadge />

        {/* Branch cue continuing the lead domain forward into Scene 04 */}
        <motion.div
          className="absolute left-1/2 top-[85%] -translate-x-1/2 w-px bg-gradient-to-b from-primary/70 to-transparent"
          style={{ opacity: branchOpacity, height: branchHeight }}
        />
      </div>
    </div>
  );
}
