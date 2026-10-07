"use client";

import { Map, Trophy, BrainCircuit, GraduationCap, Clock } from "lucide-react";

interface ProfileMetricsRowProps {
  roadmapPercent: number;
  topCareerName: string;
  topCareerScore?: number;
  topTraitLabel: string;
  topTraitScore?: number;
  primaryStream: string;
  weeklyPaceHours: number;
}

export function ProfileMetricsRow({
  roadmapPercent,
  topCareerName,
  topCareerScore,
  topTraitLabel,
  topTraitScore,
  primaryStream,
  weeklyPaceHours,
}: ProfileMetricsRowProps) {
  const cards = [
    {
      icon: Map,
      label: "Roadmap Progress",
      value: `${roadmapPercent}%`,
      subtext: "overall completion",
      accent: true,
    },
    {
      icon: Trophy,
      label: "Top Career Fit",
      value: topCareerScore ? `${Math.round(topCareerScore)}%` : "—",
      subtext: topCareerName,
      accent: false,
    },
    {
      icon: BrainCircuit,
      label: "Core Aptitude",
      value: topTraitScore ? `${Math.round(topTraitScore)}%` : "—",
      subtext: topTraitLabel,
      accent: false,
    },
    {
      icon: GraduationCap,
      label: "Academic Stream",
      value: primaryStream.split(" ")[0] || "Science",
      subtext: primaryStream,
      accent: false,
    },
    {
      icon: Clock,
      label: "Weekly Pace",
      value: `${weeklyPaceHours}h`,
      subtext: "active commitment",
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border bg-card flex flex-col justify-between transition-all ${
              card.accent
                ? "border-primary/40 bg-primary/5 shadow-xs shadow-primary/10"
                : "border-border/70 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {card.label}
              </span>
              <Icon
                className={`h-3.5 w-3.5 ${
                  card.accent ? "text-primary" : "text-muted-foreground/60"
                }`}
              />
            </div>
            <div>
              <div
                className={`font-heading text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${
                  card.accent ? "text-primary" : "text-foreground"
                }`}
              >
                {card.value}
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5" title={card.subtext}>
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
