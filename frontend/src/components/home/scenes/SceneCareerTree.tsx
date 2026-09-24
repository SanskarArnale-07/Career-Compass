"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { sceneBody, sceneHeading, smallLabel } from "../typography";

// Real data, one canonical branch — never a fabricated hierarchy.
const domain = CAREER_DOMAINS.find((d) => d.id === "engineering-technology")!;
const path = domain.paths.find((p) => p.id === "software-development") ?? domain.paths[0];
const specialization =
  path.specializations.find((s) => s.id === "web-app-eng") ?? path.specializations[0];
const roles = specialization.roles.slice(0, 3);

function Connector({ opacity, heightPx = 28 }: { opacity: MotionValue<number>; heightPx?: number }) {
  return (
    <motion.div
      style={{ opacity, height: heightPx }}
      className="w-px bg-linear-to-b from-primary/60 to-primary/10 mx-auto"
    />
  );
}

function TreeNode({
  label,
  sub,
  opacity,
  y,
  emphasis = "normal",
}: {
  label: string;
  sub?: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  emphasis?: "root" | "normal" | "leaf";
}) {
  const base =
    emphasis === "root"
      ? "border-primary bg-[#141920] text-foreground shadow-md shadow-cyan-950/30 px-5 py-2.5"
      : emphasis === "leaf"
        ? "border-border/60 bg-[#10141A]/90 text-muted-foreground px-3 py-1.5"
        : "border-border/80 bg-[#141920] text-foreground px-4 py-2";

  return (
    <motion.div style={{ opacity, y }} className="flex flex-col items-center">
      <div className={`rounded-xl border ${base} text-center`}>
        <p className={`font-heading font-semibold ${emphasis === "leaf" ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
          {label}
        </p>
        {sub && <p className="text-[10px] font-mono text-primary/70 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

export function SceneCareerTree({ progress }: { progress: MotionValue<number> }) {
  const domainOpacity = useTransform(progress, [0, 0.15], [0, 1]);
  const domainY = useTransform(progress, [0, 0.15], [16, 0]);

  const connector1 = useTransform(progress, [0.12, 0.24], [0, 1]);

  const pathOpacity = useTransform(progress, [0.2, 0.35], [0, 1]);
  const pathY = useTransform(progress, [0.2, 0.35], [16, 0]);

  const connector2 = useTransform(progress, [0.32, 0.44], [0, 1]);

  const specOpacity = useTransform(progress, [0.4, 0.55], [0, 1]);
  const specY = useTransform(progress, [0.4, 0.55], [16, 0]);

  const connector3 = useTransform(progress, [0.52, 0.64], [0, 1]);

  const rolesOpacity = useTransform(progress, [0.6, 0.78], [0, 1]);
  const rolesY = useTransform(progress, [0.6, 0.78], [14, 0]);

  const headingOpacity = useTransform(progress, [0.72, 0.86], [0, 1]);
  const headingY = useTransform(progress, [0.72, 0.86], [16, 0]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      <motion.div
        style={{ opacity: headingOpacity, y: headingY }}
        className="text-center max-w-xl mb-6 sm:mb-8"
      >
        <h2 className={`${sceneHeading} mb-2`}>One direction can lead to many paths.</h2>
        <p className={`${sceneBody} max-w-md mx-auto`}>
          Explore how broad career domains branch into specialized paths and roles.
        </p>
      </motion.div>

      <div className="flex flex-col items-center">
        <TreeNode label={domain.name.toUpperCase()} opacity={domainOpacity} y={domainY} emphasis="root" />
        <Connector opacity={connector1} />
        <TreeNode label={path.name} sub="Path" opacity={pathOpacity} y={pathY} />
        <Connector opacity={connector2} />
        <TreeNode label={specialization.name} sub="Specialization" opacity={specOpacity} y={specY} />
        <Connector opacity={connector3} heightPx={20} />

        <motion.div
          style={{ opacity: rolesOpacity, y: rolesY }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl"
        >
          {roles.map((role) => (
            <div key={role.id} className="flex flex-col items-center">
              <div className="w-px h-3 bg-primary/30" />
              <div className="rounded-lg border border-border/60 bg-[#10141A]/90 px-3 py-1.5 text-center">
                <p className="text-xs sm:text-sm font-heading font-medium text-muted-foreground">
                  {role.title}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div style={{ opacity: headingOpacity }} className="mt-6 sm:mt-8">
        <Link
          href="/career-map"
          className={`inline-flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors ${smallLabel} normal-case tracking-normal font-semibold`}
        >
          <span>Explore the Career Map</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
