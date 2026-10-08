"use client";

import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Layers,
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Calendar,
} from "lucide-react";
import type { StudentPersona } from "@/lib/profile/profile-utils";
import type { CareerHierarchyMatch } from "@/lib/career-hierarchy/types";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
  };
  persona: StudentPersona;
  displayHierarchy: CareerHierarchyMatch | null | undefined;
  topMatchScore?: number;
  startedAt?: number;
  selectedSlug?: string;
  careerTitle?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function formatStartedDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileHeader({
  user,
  persona,
  displayHierarchy,
  topMatchScore,
  startedAt,
  selectedSlug = "software-development",
  careerTitle,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-black/20">
      {/* Subtle radial ambient highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative flex flex-col md:flex-row md:items-start gap-6">
        {/* Avatar with cyan accent ring */}
        <div className="relative shrink-0 self-start">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-[#10141A] border-2 border-primary/40 flex items-center justify-center text-primary font-heading text-3xl font-bold shadow-lg shadow-primary/10">
            {getInitials(user.name)}
          </div>
          <span
            className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#10141A] border border-primary/40 text-primary shadow-xs"
            title="Verified Assessment Profile"
          >
            <CheckCircle2 className="h-4 w-4" />
          </span>
        </div>

        {/* Identity & Career Persona */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Verified Profile
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">
              {user.email}
            </p>
          </div>

          {/* Persona Archetype Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground">Archetype:</span>
            <span className="font-semibold text-primary">{persona.archetype}</span>
          </div>

          {/* 1. Career Snapshot Box */}
          <div className="p-4 rounded-xl bg-[#0B0E12]/80 border border-border/80 text-xs sm:text-sm text-secondary-foreground leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Career Snapshot</span>
            </div>
            <p className="text-slate-200">
              {persona.executiveSummary}
            </p>
          </div>

          {/* Career Trajectory Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {displayHierarchy && (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141920] border border-border text-xs font-mono text-muted-foreground">
                  <Layers className="h-3 w-3 text-primary/70" />
                  {displayHierarchy.domain.name}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-xs font-mono text-primary font-semibold">
                  {careerTitle || displayHierarchy.path.name}
                </span>
              </>
            )}

            {topMatchScore !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
                {Math.round(topMatchScore)}% Match
              </span>
            )}

            {startedAt && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/80 font-mono ml-auto">
                <Calendar className="h-3 w-3" />
                Journey started {formatStartedDate(startedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 self-start w-full md:w-auto pt-2 md:pt-0">
          <Link
            href="/dashboard"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all text-center"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>My Roadmap</span>
          </Link>
          <Link
            href="/results"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-[#141920] text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors text-center"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Results</span>
          </Link>
          <Link
            href={`/career/${selectedSlug}`}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border/70 bg-[#10141A] text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-center"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Career Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
