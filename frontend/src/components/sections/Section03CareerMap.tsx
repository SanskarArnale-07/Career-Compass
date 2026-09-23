"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CareerTreeExplorer } from "@/components/career/CareerTreeExplorer";

export function Section03CareerMap() {
  return (
    <section className="py-16 md:py-20 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-3 block">
              03
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              One direction can lead to many paths.
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
              Explore how broad career domains branch into specialized disciplines and trajectories.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141210] border border-border/70 text-xs font-mono text-muted-foreground self-start md:self-auto shrink-0">
            <span>Domain</span>
            <span>→</span>
            <span>Path</span>
            <span>→</span>
            <span className="text-foreground font-semibold">Specialization</span>
          </div>
        </div>

        {/* ── Compact Interactive Tree Preview (Domain → Path → Specialization) ── */}
        <div className="rounded-2xl bg-[#0E0C0A] border border-border/70 p-5 sm:p-7 shadow-xl relative overflow-hidden mb-6">
          <div className="relative z-10">
            <CareerTreeExplorer
              mode="compact"
              showLines
              defaultDomainId="engineering-technology"
            />
          </div>
        </div>

        {/* ── CTA: Open Full Career Map ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border/60 bg-[#141210]">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ready to explore all career branches?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Access the complete interactive architecture across all domains and roles.
            </p>
          </div>
          <Link
            href="/career-map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md shadow-amber-950/30 transition-all shrink-0 cursor-pointer"
          >
            <span>Explore the Career Map</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
