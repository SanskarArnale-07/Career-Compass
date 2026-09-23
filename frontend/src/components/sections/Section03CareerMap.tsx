"use client";

import Link from "next/link";
import { ArrowRight, GitBranch, Layers } from "lucide-react";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { CareerTreeExplorer } from "@/components/career/CareerTreeExplorer";

export function Section03CareerMap() {
  return (
    <section className="py-20 md:py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-4 block">
              03
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              One direction can lead to{" "}
              <span className="text-primary">many paths.</span>
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
              Explore how broad career domains branch into specialized paths and
              roles. Click any domain to expand.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Taxonomy Hierarchy
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-primary font-semibold bg-[#161412] px-3 py-1.5 rounded border border-primary/20">
              <Layers className="h-3 w-3" />
              <span>Domain</span>
              <span className="text-muted-foreground">→</span>
              <GitBranch className="h-3 w-3" />
              <span>Path</span>
              <span className="text-muted-foreground">→</span>
              <span>Specialization</span>
              <span className="text-muted-foreground">→</span>
              <span>Role</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/60">
              {CAREER_DOMAINS.length} domains ·{" "}
              {CAREER_DOMAINS.flatMap((d) => d.paths).length} paths ·{" "}
              {CAREER_DOMAINS.flatMap((d) =>
                d.paths.flatMap((p) => p.specializations)
              ).length}{" "}
              specializations
            </p>
          </div>
        </div>

        {/* ── Compact Interactive Tree (domains + paths only) ─────── */}
        <div className="rounded-2xl bg-[#0E0C0A] border border-border/70 p-5 sm:p-8 shadow-xl relative overflow-hidden mb-6">
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#C8922A_1px,transparent_1px),linear-gradient(to_bottom,#C8922A_1px,transparent_1px)] bg-[size:36px_36px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border/50">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                Live Career Hierarchy — click to explore
              </p>
            </div>
            {/* compact mode: domain + path expandable, but specializations shown inline */}
            <CareerTreeExplorer mode="full" showLines defaultDomainId="engineering-technology" />
          </div>
        </div>

        {/* ── CTA: Open full career map ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border/60 bg-[#141210]">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Explore the full career tree
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {CAREER_DOMAINS.flatMap((d) =>
                d.paths.flatMap((p) => p.specializations.flatMap((s) => s.roles))
              ).length}{" "}
              roles across all domains, interactive and expandable.
            </p>
          </div>
          <Link
            href="/career-map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all shrink-0"
          >
            Explore the Career Map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
