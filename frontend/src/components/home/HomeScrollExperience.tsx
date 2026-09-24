"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { BranchingCareerTree } from "./BranchingCareerTree";
import { TrajectoryPath } from "./TrajectoryPath";
import { StaticHomeStory } from "./StaticHomeStory";
import { heroText, sceneHeading, sceneBody, smallLabel } from "./typography";

// 8 Foundation traits radiating during Phase 1 (Understand)
const TRAITS = [
  { label: "Analytical", angle: -90 },
  { label: "Technical", angle: -45 },
  { label: "Scientific", angle: 0 },
  { label: "Business", angle: 45 },
  { label: "Creative", angle: 90 },
  { label: "Social", angle: 135 },
  { label: "Leadership", angle: 180 },
  { label: "Exploration", angle: 225 },
];

// 6 Canonical domains arranged symmetrically during Phase 2 (Discover Direction)
const DOMAIN_ANGLES = [-90, -30, 30, 90, 150, 210];
const DOMAINS_LIST = CAREER_DOMAINS.slice(0, 6).map((d, i) => ({
  id: d.id,
  name: d.name,
  angle: DOMAIN_ANGLES[i] ?? i * 60,
  pathCount: d.paths.length,
}));

// Milestones for the edge progress rail
const MILESTONES = [
  { id: "you", label: "YOU" },
  { id: "traits", label: "TRAITS" },
  { id: "domains", label: "DOMAINS" },
  { id: "tree", label: "TREE" },
  { id: "path", label: "PATH" },
];

export function HomeScrollExperience() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Single global scroll progress (0 -> 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ────────────────────────────────────────────────────────────────
  // 1. HERO TIMING (0.00 -> 0.16)
  // Hero is dominant initially, then translates up, scales down, and exits completely.
  // ────────────────────────────────────────────────────────────────
  const heroOpacity = useTransform(scrollYProgress, [0, 0.10, 0.16], [1, 1, 0], { clamp: true });
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -40], { clamp: true });
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.85], { clamp: true });
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.12 ? "auto" : "none"));
  const heroDisplay = useTransform(heroOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 2. CONSTELLATION & YOU COMPASS (0.00 -> 0.54)
  // Background element during Hero, expands for Traits & Domains, then contracts and exits.
  // ────────────────────────────────────────────────────────────────
  const constellationOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.48, 0.54],
    [0.7, 1, 1, 0],
    { clamp: true }
  );
  const constellationScale = useTransform(
    scrollYProgress,
    [0, 0.16, 0.35, 0.54],
    [0.85, 1, 1.05, 0.9],
    { clamp: true }
  );
  const centerBadgeOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.48, 0.54],
    [0.85, 1, 1, 0],
    { clamp: true }
  );
  const centerBadgeScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.28, 0.48],
    [1, 0.9, 1.05, 0.9],
    { clamp: true }
  );
  const constellationDisplay = useTransform(constellationOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 3. PHASE 1: 8 TRAITS (0.14 -> 0.38)
  // Radial spokes expand from YOU. Tightly crossfaded.
  // ────────────────────────────────────────────────────────────────
  const traitsOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.18, 0.34, 0.38],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const traitsY = useTransform(
    scrollYProgress,
    [0.14, 0.18, 0.34, 0.38],
    [20, 0, 0, -20],
    { clamp: true }
  );
  const traitsDisplay = useTransform(traitsOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 4. PHASE 2: 6 CAREER DOMAINS (0.36 -> 0.54)
  // Synthesizes traits into 6 equal canonical directions. Pre-assessment copy.
  // ────────────────────────────────────────────────────────────────
  const domainsOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.40, 0.50, 0.54],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const domainsY = useTransform(
    scrollYProgress,
    [0.36, 0.40, 0.50, 0.54],
    [20, 0, 0, -20],
    { clamp: true }
  );
  const domainsDisplay = useTransform(domainsOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 5. PHASE 3: BRANCHING CAREER TREE (0.52 -> 0.72)
  // Demonstrates genuine multi-level taxonomy branching.
  // ────────────────────────────────────────────────────────────────
  const treeOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.56, 0.68, 0.72],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const treeY = useTransform(
    scrollYProgress,
    [0.52, 0.56, 0.68, 0.72],
    [25, 0, 0, -25],
    { clamp: true }
  );
  const treeScale = useTransform(
    scrollYProgress,
    [0.52, 0.58, 0.68, 0.72],
    [0.94, 1, 1, 0.88],
    { clamp: true }
  );
  const treePointerEvents = useTransform(scrollYProgress, (v) =>
    v >= 0.54 && v <= 0.70 ? "auto" : "none"
  );
  const treeDisplay = useTransform(treeOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 6. PHASE 4: SINGLE TRAJECTORY PATH (0.70 -> 0.94)
  // The tree collapses into 1 continuous vertical trajectory line with 4 nodes.
  // ────────────────────────────────────────────────────────────────
  const pathOpacity = useTransform(
    scrollYProgress,
    [0.70, 0.74, 0.90, 0.94],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const pathY = useTransform(
    scrollYProgress,
    [0.70, 0.74, 0.90, 0.94],
    [25, 0, 0, -25],
    { clamp: true }
  );
  const pathDisplay = useTransform(pathOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // ────────────────────────────────────────────────────────────────
  // 7. PHASE 5: FINAL CTA (0.92 -> 1.00)
  // Continuous trajectory leads into final action waypoint.
  // ────────────────────────────────────────────────────────────────
  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.92, 0.96, 1],
    [0, 1, 1],
    { clamp: true }
  );
  const ctaY = useTransform(
    scrollYProgress,
    [0.92, 0.96, 1],
    [25, 0, 0],
    { clamp: true }
  );
  const ctaScale = useTransform(
    scrollYProgress,
    [0.92, 0.97],
    [0.94, 1],
    { clamp: true }
  );
  const ctaPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.94 ? "auto" : "none"));
  const ctaDisplay = useTransform(ctaOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Scrubber progress rail
  const scrubberHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduceMotion) {
    return <StaticHomeStory />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[650vh] sm:h-[900vh] lg:h-[1300vh] bg-background"
    >
      {/* ── ONE STICKY 100VH VIEWPORT ──────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-background select-none">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_50%_at_50%_45%,rgba(200,146,42,0.08),transparent_75%)]" />

        {/* ── Desktop Milestone Progress Scrubber Rail ─────────────── */}
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-end gap-3 pointer-events-none">
          <div className="relative w-0.5 h-36 bg-border/40 rounded-full overflow-hidden">
            <motion.div style={{ height: scrubberHeight }} className="w-full bg-primary" />
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            {MILESTONES.map((m) => (
              <span key={m.id} className="text-[9px] font-mono tracking-widest text-muted-foreground/60">
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── SHARED HEADLINE SLOT (Stages 1 through 4) ─────────────── */}
        {/* Exactly ONE headline is dominant at any moment; shared anchor position near top */}
        <div className="absolute top-10 sm:top-14 md:top-16 inset-x-0 mx-auto max-w-2xl px-4 flex flex-col items-center text-center pointer-events-none z-40">
          
          {/* Headline 1: UNDERSTAND (0.14 -> 0.38) */}
          <motion.div
            style={{ opacity: traitsOpacity, y: traitsY, display: traitsDisplay }}
            className="flex-col items-center text-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2.5 ${smallLabel} text-[11px] sm:text-xs`}>
              <span>01 &middot; THE FOUNDATION</span>
            </div>
            <h2 className={`${sceneHeading} mb-2`}>First, we understand you.</h2>
            <p className={`${sceneBody} max-w-md mx-auto text-xs sm:text-sm`}>
              Your responses map the interests, strengths, and preferences that shape your direction.
            </p>
          </motion.div>

          {/* Headline 2: DOMAINS (0.36 -> 0.54) */}
          <motion.div
            style={{ opacity: domainsOpacity, y: domainsY, display: domainsDisplay }}
            className="flex-col items-center text-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2.5 ${smallLabel} text-[11px] sm:text-xs`}>
              <span>02 &middot; THE HORIZONS</span>
            </div>
            <h2 className={`${sceneHeading} mb-2`}>Then, your direction starts to take shape.</h2>
            <p className={`${sceneBody} max-w-md mx-auto text-xs sm:text-sm`}>
              Your assessment will reveal the career directions that align most closely with you.
            </p>
          </motion.div>

          {/* Headline 3: CAREER TREE (0.52 -> 0.72) */}
          <motion.div
            style={{ opacity: treeOpacity, y: treeY, display: treeDisplay }}
            className="flex-col items-center text-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2 ${smallLabel} text-[11px] sm:text-xs`}>
              <span>03 &middot; THE HIERARCHY</span>
            </div>
            <h2 className={`${sceneHeading} mb-1.5`}>One direction can lead to many paths.</h2>
            <p className={`${sceneBody} max-w-md mx-auto text-xs sm:text-sm`}>
              Explore how broad career domains branch into specialized paths and concrete roles.
            </p>
          </motion.div>

          {/* Headline 4: TRAJECTORY PATH (0.70 -> 0.94) */}
          <motion.div
            style={{ opacity: pathOpacity, y: pathY, display: pathDisplay }}
            className="flex-col items-center text-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-2 ${smallLabel} text-[11px] sm:text-xs`}>
              <span>04 &middot; THE TRAJECTORY</span>
            </div>
            <h2 className={`${sceneHeading} mb-1.5`}>And then, you build your path.</h2>
            <p className={`${sceneBody} max-w-md mx-auto text-xs sm:text-sm`}>
              The branching possibilities converge into a single forward path of skills, projects, and milestones.
            </p>
          </motion.div>
        </div>

        {/* ── CENTRAL SHARED STAGE: VISUAL PRIMITIVES ────────────────── */}

        {/* 1. ATMOSPHERIC CONSTELLATION & YOU COMPASS (Stages 0 - 2) */}
        <motion.div
          style={{
            opacity: constellationOpacity,
            scale: constellationScale,
            display: constellationDisplay,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="relative w-full max-w-145 aspect-square mx-auto">
            {/* Concentric Orbit Rings */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="0.12" strokeDasharray="0.6 2.4" opacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="0.15" opacity="0.35" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="var(--border)" strokeWidth="0.15" opacity="0.3" />
              <circle cx="50" cy="50" r="9" fill="none" stroke="var(--primary)" strokeWidth="0.3" opacity="0.4" />
            </svg>

            {/* Central YOU Compass Beacon */}
            <motion.div
              style={{ opacity: centerBadgeOpacity, scale: centerBadgeScale }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-primary/40 animate-ping opacity-20" />
                <div className="h-10 w-10 sm:h-13 sm:w-13 rounded-full bg-[#141920] border-2 border-primary flex items-center justify-center shadow-lg shadow-cyan-950/50">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-primary">
                    YOU
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 2. HERO CONTENT (0.00 -> 0.16) */}
        {/* Centered initially, scales down, fades out, and cleanly leaves the stage */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
            pointerEvents: heroPointerEvents,
            display: heroDisplay,
          }}
          className="relative z-30 flex flex-col items-center text-center max-w-3xl px-4"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#10141A] text-muted-foreground mb-5 ${smallLabel}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Navigation Instrument &middot; Career Intelligence</span>
          </div>

          <h1 className={`${heroText} mb-4`}>
            Your future has more than one direction.
          </h1>

          <p className={`${sceneBody} max-w-xl mb-8`}>
            Career Compass helps you understand where your strengths point &mdash; and what to do next.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Take the Assessment</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-[#10141A] px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors"
            >
              Explore More Careers
            </Link>
          </div>
        </motion.div>

        {/* 3. TRAITS SPOKES (0.14 -> 0.38) */}
        <motion.div
          style={{
            opacity: traitsOpacity,
            display: traitsDisplay,
          }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-full max-w-135 aspect-square mx-auto pointer-events-auto">
            {TRAITS.map((t) => {
              const rad = (t.angle * Math.PI) / 180;
              const maxDist = 34; // percentage radius from center
              const xPos = 50 + maxDist * Math.cos(rad);
              const yPos = 50 + maxDist * Math.sin(rad);

              return (
                <div key={t.label} className="contents">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ overflow: "visible" }}
                  >
                    <line
                      x1="50"
                      y1="50"
                      x2={xPos}
                      y2={yPos}
                      stroke="var(--border)"
                      strokeWidth="0.22"
                      strokeDasharray="1 1"
                      opacity="0.6"
                    />
                  </svg>
                  <div
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                    }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-[#10141A]/95 backdrop-blur-md shadow-md shadow-cyan-950/20 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[11px] sm:text-xs font-heading font-medium text-foreground">
                        {t.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 4. CAREER DOMAINS (0.36 -> 0.54) */}
        <motion.div
          style={{
            opacity: domainsOpacity,
            display: domainsDisplay,
          }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-full max-w-140 aspect-square mx-auto pointer-events-auto">
            {DOMAINS_LIST.map((domain) => {
              const rad = (domain.angle * Math.PI) / 180;
              const maxDist = 36;
              const xPos = 50 + maxDist * Math.cos(rad);
              const yPos = 50 + maxDist * Math.sin(rad);

              return (
                <div key={domain.id} className="contents">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ overflow: "visible" }}
                  >
                    <line
                      x1="50"
                      y1="50"
                      x2={xPos}
                      y2={yPos}
                      stroke="var(--primary)"
                      strokeWidth="0.28"
                      strokeDasharray="2 2"
                      opacity="0.7"
                    />
                  </svg>
                  <div
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                    }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/50 bg-[#141920]/95 backdrop-blur-md shadow-md shadow-cyan-950/30 whitespace-nowrap hover:border-primary transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs sm:text-sm font-heading font-semibold text-foreground">
                        {domain.name}
                      </span>
                      <span className="text-[9px] font-mono text-primary/70 border-l border-border/60 pl-1.5">
                        {domain.pathCount} Paths
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 5. BRANCHING CAREER TREE (0.52 -> 0.72) */}
        <motion.div
          style={{
            opacity: treeOpacity,
            scale: treeScale,
            pointerEvents: treePointerEvents,
            display: treeDisplay,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-24 sm:pt-28 pb-6 px-4 overflow-hidden"
        >
          <BranchingCareerTree hideHeader />
          
          <div className="mt-3 sm:mt-4">
            <Link
              href="/career-map"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-mono font-semibold text-xs transition-colors"
            >
              <span>Explore Complete 108-Role Career Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* 6. TRAJECTORY PATH (0.70 -> 0.94) */}
        <motion.div
          style={{
            opacity: pathOpacity,
            display: pathDisplay,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-24 sm:pt-28 pb-6 px-4 overflow-hidden pointer-events-none"
        >
          <TrajectoryPath hideHeader />
        </motion.div>

        {/* 7. FINAL CTA (0.92 -> 1.00) */}
        <motion.div
          style={{
            opacity: ctaOpacity,
            y: ctaY,
            scale: ctaScale,
            pointerEvents: ctaPointerEvents,
            display: ctaDisplay,
          }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-4 text-center select-none"
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Ambient Compass Beacon */}
            <div className="w-12 h-12 rounded-full border border-primary/40 bg-[#141920] flex items-center justify-center text-primary mb-6 shadow-lg shadow-cyan-950/50">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#10141A] text-muted-foreground mb-4 ${smallLabel}`}>
              <span>05 &middot; Begin Your Journey</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
              Your career shouldn&apos;t be a guess.
            </h2>

            <p className="text-sm sm:text-lg text-secondary-foreground max-w-md mb-8 font-light leading-relaxed">
              Start with understanding yourself.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/assessment"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Take the Assessment</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-[#10141A] px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors"
              >
                Explore All Careers
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
