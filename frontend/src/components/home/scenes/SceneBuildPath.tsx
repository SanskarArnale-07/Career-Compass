"use client";

import { Target, Cpu, FolderGit2, MapPin, ArrowRight, ArrowDown, type LucideIcon } from "lucide-react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { sceneBody, sceneHeading } from "../typography";

interface Stage {
  name: string;
  title: string;
  icon: LucideIcon;
}

const STAGES: Stage[] = [
  { name: "CAREER", title: "Defined Target", icon: Target },
  { name: "SKILLS", title: "Core Competencies", icon: Cpu },
  { name: "PROJECTS", title: "Proof of Work", icon: FolderGit2 },
  { name: "ROADMAP", title: "Structured Journey", icon: MapPin },
];

function StageCard({
  stage,
  isLast,
  opacity,
  y,
}: {
  stage: Stage;
  isLast: boolean;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const Icon = stage.icon;
  return (
    <div className="flex flex-col md:flex-row items-center">
      <motion.div
        style={{ opacity, y }}
        className="w-full md:w-40 lg:w-44 p-3.5 rounded-xl border border-border/60 bg-[#10141A] text-center md:text-left"
      >
        <div className="flex items-center gap-2 md:gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#141920] border border-border/60 flex items-center justify-center text-primary shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary font-semibold block">
              {stage.name}
            </span>
            <p className="font-heading text-xs sm:text-sm font-semibold text-foreground">{stage.title}</p>
          </div>
        </div>
      </motion.div>

      {!isLast && (
        <motion.div style={{ opacity }} className="py-2 md:py-0 md:px-2 shrink-0 flex items-center justify-center text-muted-foreground/40">
          <ArrowRight className="h-4 w-4 hidden md:block" />
          <ArrowDown className="h-4 w-4 block md:hidden" />
        </motion.div>
      )}
    </div>
  );
}

export function SceneBuildPath({ progress }: { progress: MotionValue<number> }) {
  const headingOpacity = useTransform(progress, [0.05, 0.2, 0.55, 0.7], [0, 1, 1, 0]);
  const headingY = useTransform(progress, [0.05, 0.2], [16, 0]);

  // Stages reveal sequentially, then everything quiets down together
  // as the scene hands off to the closing message.
  const quietFade = useTransform(progress, [0.65, 0.85], [1, 0]);

  // One explicit pair of motion values per stage (4 stages, fixed at
  // build time) so each stage reveals in sequence, then joins the
  // shared quiet-fade above.
  const stage1Opacity = useTransform(progress, [0.22, 0.32, 0.65, 0.85], [0, 1, 1, 0]);
  const stage1Y = useTransform(progress, [0.22, 0.32], [14, 0]);
  const stage2Opacity = useTransform(progress, [0.3, 0.4, 0.65, 0.85], [0, 1, 1, 0]);
  const stage2Y = useTransform(progress, [0.3, 0.4], [14, 0]);
  const stage3Opacity = useTransform(progress, [0.38, 0.48, 0.65, 0.85], [0, 1, 1, 0]);
  const stage3Y = useTransform(progress, [0.38, 0.48], [14, 0]);
  const stage4Opacity = useTransform(progress, [0.46, 0.56, 0.65, 0.85], [0, 1, 1, 0]);
  const stage4Y = useTransform(progress, [0.46, 0.56], [14, 0]);

  const stageOpacities = [stage1Opacity, stage2Opacity, stage3Opacity, stage4Opacity];
  const stageYs = [stage1Y, stage2Y, stage3Y, stage4Y];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      <motion.div style={{ opacity: headingOpacity, y: headingY }} className="text-center max-w-xl mb-8 sm:mb-10">
        <h2 className={`${sceneHeading} mb-3`}>And then, you build your path.</h2>
        <p className={`${sceneBody} max-w-md mx-auto`}>
          Once you know your direction, Career Compass turns it into a practical journey you can work through step by step.
        </p>
      </motion.div>

      <motion.div style={{ opacity: quietFade }} className="flex flex-col md:flex-row items-center gap-1">
        {STAGES.map((stage, idx) => (
          <StageCard
            key={stage.name}
            stage={stage}
            isLast={idx === STAGES.length - 1}
            opacity={stageOpacities[idx]}
            y={stageYs[idx]}
          />
        ))}
      </motion.div>
    </div>
  );
}
