"use client";

import { motion } from "framer-motion";
import { FolderKanban, Star, Zap, Crown } from "lucide-react";
import type { ProjectIdea, ProjectDifficulty } from "@/lib/career-details/types";

interface ProjectsSectionProps {
  projects: ProjectIdea[];
}

const DIFFICULTY_CONFIG: Record<ProjectDifficulty, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; border: string; bg: string }> = {
  beginner: { label: "Beginner", icon: Star, color: "text-muted-foreground", border: "border-border/80", bg: "bg-[#10141A]" },
  intermediate: { label: "Intermediate", icon: Zap, color: "text-primary", border: "border-primary/25", bg: "bg-primary/5" },
  advanced: { label: "Advanced", icon: Crown, color: "text-[#818CF8]", border: "border-[#818CF8]/30", bg: "bg-[#818CF8]/10" },
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <FolderKanban className="h-6 w-6 text-primary" />
        Projects to Build
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-2xl">
        Build these projects to develop practical skills and create a portfolio that stands out.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => {
          const config = DIFFICULTY_CONFIG[project.difficulty];
          const DiffIcon = config.icon;
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`group rounded-xl border ${config.border} ${config.bg} p-6 hover:shadow-lg transition-all duration-300 flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <DiffIcon className={`h-5 w-5 ${config.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{project.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.skills.map((skill) => (
                  <span key={skill} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="mb-4 flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className={`h-1.5 w-1.5 rounded-full ${config.color.replace("text-", "bg-")} shrink-0 mt-1.5`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Portfolio Value */}
              <div className="pt-3 border-t border-border/60">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Portfolio Value</h4>
                <p className="text-xs text-foreground/80 leading-relaxed">{project.portfolioValue}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
