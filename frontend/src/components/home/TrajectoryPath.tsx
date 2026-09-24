"use client";

import { Target, Cpu, FolderGit2, MapPin, type LucideIcon } from "lucide-react";
import { smallLabel } from "./typography";

interface TrajectoryNode {
  step: string;
  name: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tags: string[];
}

const TRAJECTORY_NODES: TrajectoryNode[] = [
  {
    step: "01",
    name: "CAREER",
    title: "Defined Target",
    desc: "Target role crystallized from your assessment profile",
    icon: Target,
    tags: ["Full Stack Developer", "Software Development"],
  },
  {
    step: "02",
    name: "SKILLS",
    title: "Core Competencies",
    desc: "Targeted skill gap analysis prioritized by market demand",
    icon: Cpu,
    tags: ["React & Next.js", "Node.js & APIs", "System Design"],
  },
  {
    step: "03",
    name: "PROJECTS",
    title: "Proof of Work",
    desc: "Curated portfolio projects demonstrating real technical depth",
    icon: FolderGit2,
    tags: ["Full-Stack SaaS Platform", "Distributed Microservice"],
  },
  {
    step: "04",
    name: "ROADMAP",
    title: "Structured Milestones",
    desc: "Step-by-step phased execution with guided next best actions",
    icon: MapPin,
    tags: ["Month 1: Core", "Month 2: Capstone", "Month 3: Launch"],
  },
];

interface TrajectoryPathProps {
  /** Optional active index (0 to 3) or fraction for live scroll state */
  activeStep?: number;
  isStatic?: boolean;
  /** Hide internal sub-header when used in Shared Headline Slot */
  hideHeader?: boolean;
}

export function TrajectoryPath({ activeStep = 3, isStatic: _isStatic = false, hideHeader = false }: TrajectoryPathProps) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none px-4">
      {/* ── Subtitle eyebrow ───────────────────────────────────────── */}
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2 ${smallLabel} text-[11px] sm:text-xs`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Single Trajectory &middot; 4 Connected Phases</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            The branching possibilities converge into one focused execution path.
          </p>
        </div>
      )}

      {/* ── One Continuous Line with 4 Lightweight Nodes ────────────── */}
      <div className="relative w-full flex flex-col items-center">
        {/* Continuous Central Vertical Line */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-linear-to-b from-primary via-primary/50 to-primary/20 pointer-events-none" />

        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {TRAJECTORY_NODES.map((node, idx) => {
            const Icon = node.icon;
            const isCompleted = idx <= activeStep;
            const isCurrent = idx === Math.floor(activeStep);

            return (
              <div
                key={node.name}
                className="relative flex items-start sm:items-center gap-4 sm:gap-6 group"
              >
                {/* WAYPOINT BEACON (Aligned on the continuous line) */}
                <div
                  className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ml-1.5 sm:ml-0 ${
                    isCompleted
                      ? "border-primary bg-[#141920] text-primary shadow-md shadow-cyan-950/50"
                      : "border-border/60 bg-[#10141A] text-muted-foreground/60"
                  } ${isCurrent ? "scale-110 ring-4 ring-primary/20" : ""}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {isCurrent && (
                    <span className="absolute -inset-1 rounded-full border border-primary animate-ping opacity-25" />
                  )}
                </div>

                {/* LIGHTWEIGHT NODE LABEL & DETAILS (No boxy disconnected card) */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-primary">
                        {node.step} &middot; {node.name}
                      </span>
                      <span className="text-foreground font-heading text-sm sm:text-base font-semibold">
                        {node.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>

                  {/* Micro Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0 sm:shrink-0">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-border/60 bg-[#10141A]/90 text-muted-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous line pointer extending to Final CTA */}
        <div className="w-px h-10 bg-linear-to-b from-primary/50 to-primary mt-2" />
      </div>
    </div>
  );
}
