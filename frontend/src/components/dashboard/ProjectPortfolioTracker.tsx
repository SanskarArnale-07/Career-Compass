"use client";

import {
  FolderKanban,
  CheckCircle2,
  Circle,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import type { ProjectIdea, ProjectDifficulty } from "@/lib/career-details/types";

interface ProjectPortfolioTrackerProps {
  projects: ProjectIdea[];
  completedProjects: string[];
  onToggleProject: (projectTitle: string) => void;
}

const DIFFICULTY_CONFIG: Record<
  ProjectDifficulty,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; border: string; bg: string }
> = {
  beginner: {
    label: "Beginner",
    icon: Star,
    color: "text-muted-foreground",
    border: "border-border/80",
    bg: "bg-[#141920]",
  },
  intermediate: {
    label: "Intermediate",
    icon: Zap,
    color: "text-sky-300",
    border: "border-sky-500/25",
    bg: "bg-sky-500/10",
  },
  advanced: {
    label: "Advanced",
    icon: Crown,
    color: "text-indigo-300",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
  },
};

export default function ProjectPortfolioTracker({
  projects,
  completedProjects,
  onToggleProject,
}: ProjectPortfolioTrackerProps) {
  const completedSet = new Set(completedProjects);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/70">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Portfolio Project Milestones
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Practical proofs of competence. Checking off projects advances your Portfolio Readiness pillar.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary self-start sm:self-auto">
          {completedProjects.length} of {projects.length} Built
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const isDone = completedSet.has(project.title);
          const diff = DIFFICULTY_CONFIG[project.difficulty] || DIFFICULTY_CONFIG.beginner;
          const DiffIcon = diff.icon;

          return (
            <div
              key={project.title}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isDone
                  ? "border-border/70 bg-[#10141A]"
                  : "border-border/70 bg-[#141920] hover:border-primary/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${diff.bg} ${diff.color} ${diff.border}`}
                  >
                    <DiffIcon className="h-3 w-3" />
                    {diff.label}
                  </span>

                  <button
                    onClick={() => onToggleProject(project.title)}
                    className="cursor-pointer transition-transform active:scale-90"
                    title={isDone ? "Mark project in-progress" : "Mark project completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-primary/70 fill-primary/10" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>

                <h4
                  className={`font-heading text-base font-bold mb-1.5 transition-colors ${
                    isDone ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {project.title}
                </h4>

                <p className="text-xs text-secondary-foreground mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block">
                    Core Deliverables:
                  </span>
                  <ul className="space-y-1 text-xs text-foreground">
                    {project.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {project.portfolioValue}
                </span>

                <button
                  onClick={() => onToggleProject(project.title)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isDone
                      ? "border border-border/80 bg-[#141920] text-muted-foreground hover:text-foreground"
                      : "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-sm"
                  }`}
                >
                  {isDone ? "Built" : "Mark Built"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
