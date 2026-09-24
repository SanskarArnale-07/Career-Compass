"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Layers, GitBranch, Sparkles } from "lucide-react";
import { CareerTreeExplorer } from "@/components/career/CareerTreeExplorer";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";

function CareerMapContent() {
  const searchParams = useSearchParams();
  const domain = searchParams?.get("domain") || undefined;
  const path = searchParams?.get("path") || undefined;
  const spec = searchParams?.get("spec") || undefined;
  const matchStr = searchParams?.get("match");
  const matchPct = matchStr ? parseInt(matchStr, 10) : undefined;

  return (
    <CareerTreeExplorer
      defaultDomainId={domain}
      defaultPathSlug={path}
      defaultSpecId={spec}
      highlightedPathSlug={path}
      highlightedMatchPct={matchPct}
      mode="full"
      showLines
    />
  );
}

export default function CareerMapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Atmospheric background ───────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <main className="relative z-10 py-14 md:py-20 pb-28">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-5">
              <Compass className="h-3.5 w-3.5" />
              <span>Career Hierarchy Explorer</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.08]">
              One direction can lead to{" "}
              <span className="text-primary">many paths.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
              Explore how broad career domains branch into specialized paths,
              disciplines, and roles. Click any level to expand.
            </p>

            {/* Hierarchy badge */}
            <div className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10141A] border border-border text-xs font-mono text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary/70" />
              <span className="text-primary/80">Domain</span>
              <span className="text-border mx-1">→</span>
              <GitBranch className="h-3 w-3 text-primary/60" />
              <span>Path</span>
              <span className="text-border mx-1">→</span>
              <span>Specialization</span>
              <span className="text-border mx-1">→</span>
              <span>Role</span>
            </div>
          </div>

          {/* ── Stats row ────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-10 max-w-2xl mx-auto">
            {[
              { n: CAREER_DOMAINS.length, label: "Domains" },
              {
                n: CAREER_DOMAINS.flatMap((d) => d.paths).length,
                label: "Career Paths",
              },
              {
                n: CAREER_DOMAINS.flatMap((d) =>
                  d.paths.flatMap((p) => p.specializations)
                ).length,
                label: "Specializations",
              },
            ].map(({ n, label }) => (
              <div
                key={label}
                className="flex flex-col items-center py-4 rounded-xl bg-card border border-border/60"
              >
                <span className="font-heading text-2xl font-bold text-primary tabular-nums">
                  {n}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Interactive Tree ─────────────────────────────────────── */}
          <div className="rounded-2xl border border-border/70 bg-[#0B0E12] p-5 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[linear-gradient(to_right,#00E5FF_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                    Interactive Career Tree — click to explore
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/50 hidden sm:inline">
                  Single source of truth: CAREER_DOMAINS
                </span>
              </div>

              <Suspense
                fallback={
                  <div className="py-20 text-center text-xs font-mono text-muted-foreground">
                    Loading career tree...
                  </div>
                }
              >
                <CareerMapContent />
              </Suspense>
            </div>
          </div>

          {/* ── CTA Strip ────────────────────────────────────────────── */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Find My Best Career Match
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border bg-[#10141A] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors"
            >
              Browse Career Library
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
