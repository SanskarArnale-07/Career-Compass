"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, type MotionValue, useTransform, useMotionValueEvent } from "framer-motion";

interface GlobeOverlayProps {
  progress: MotionValue<number>;
}

export function GlobeOverlay({ progress }: GlobeOverlayProps) {
  const [isInitialHero, setIsInitialHero] = useState(true);

  // Monitor scroll progress to strictly unmount the scroll indicator once exploring begins
  useMotionValueEvent(progress, "change", (latest) => {
    if (latest > 0.03 && isInitialHero) {
      setIsInitialHero(false);
    } else if (latest <= 0.03 && !isInitialHero) {
      setIsInitialHero(true);
    }
  });

  // Stage 0: Hero (0.00 -> 0.07) — quickly disappears as soon as user begins exploring
  const heroOpacity = useTransform(progress, [0, 0.02, 0.07], [1, 0.7, 0], { clamp: true });
  const heroY = useTransform(progress, [0, 0.07], [0, -20], { clamp: true });
  const heroPointerEvents = useTransform(progress, (v) => (v < 0.05 ? "auto" : "none"));
  const heroDisplay = useTransform(heroOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Stage 1: Traits (0.12 -> 0.32) — strictly separated, zero overlap
  const traitsOpacity = useTransform(progress, [0.12, 0.16, 0.28, 0.32], [0, 1, 1, 0], { clamp: true });
  const traitsY = useTransform(progress, [0.12, 0.16, 0.28, 0.32], [12, 0, 0, -12], { clamp: true });
  const traitsDisplay = useTransform(traitsOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Stage 2: Domains (0.35 -> 0.49) — strictly separated
  const domainsOpacity = useTransform(progress, [0.35, 0.39, 0.46, 0.49], [0, 1, 1, 0], { clamp: true });
  const domainsY = useTransform(progress, [0.35, 0.39, 0.46, 0.49], [12, 0, 0, -12], { clamp: true });
  const domainsDisplay = useTransform(domainsOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Stage 4: Trajectory (0.71 -> 0.82) — strictly fades out before CTA
  const trajectoryOpacity = useTransform(progress, [0.71, 0.74, 0.79, 0.82], [0, 1, 1, 0], { clamp: true });
  const trajectoryY = useTransform(progress, [0.71, 0.74, 0.79, 0.82], [12, 0, 0, -12], { clamp: true });
  const trajectoryDisplay = useTransform(trajectoryOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Stage 5: Final CTA (0.88 -> 1.00) — clean destination after 3D globe and trajectory are completely gone
  const ctaOpacity = useTransform(progress, [0.88, 0.94, 1.0], [0, 1, 1], { clamp: true });
  const ctaY = useTransform(progress, [0.88, 0.94, 1.0], [16, 0, 0], { clamp: true });
  const ctaPointerEvents = useTransform(progress, (v) => (v >= 0.89 ? "auto" : "none"));
  const ctaDisplay = useTransform(ctaOpacity, (v) => (v > 0.001 ? "flex" : "none"));

  // Indicator at bottom — fades out immediately upon scrolling
  const scrollIndicatorOpacity = useTransform(progress, [0, 0.02, 0.03], [1, 0.5, 0], { clamp: true });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-30">
      {/* ── TOP SHARED HEADLINE SLOT (Comfortably below 64px navbar with safe area) ── */}
      <div className="absolute top-20 sm:top-22 md:top-24 lg:top-26 inset-x-0 mx-auto max-w-xl px-4 flex flex-col items-center text-center pointer-events-none z-40">
        
        {/* Stage 1: Traits */}
        <motion.div
          style={{ opacity: traitsOpacity, y: traitsY, display: traitsDisplay }}
          className="flex-col items-center text-center"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-slate-100 tracking-tight mb-1">
            First, we understand you.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-sm mx-auto leading-relaxed">
            20 questions map 8 core dimensions around the globe.
          </p>
        </motion.div>

        {/* Stage 2: Domains */}
        <motion.div
          style={{ opacity: domainsOpacity, y: domainsY, display: domainsDisplay }}
          className="flex-col items-center text-center max-w-xl mx-auto"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-slate-100 tracking-tight mb-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Explore 6 Career Domains.
          </h2>
          <p className="text-sm sm:text-base md:text-[18px] lg:text-[19px] text-slate-200 font-normal max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Discover broad directions emerging across the globe.
          </p>
        </motion.div>

        {/* Stage 4: Trajectory */}
        <motion.div
          style={{ opacity: trajectoryOpacity, y: trajectoryY, display: trajectoryDisplay }}
          className="flex-col items-center text-center"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-slate-100 tracking-tight mb-1">
            Convergence to your path.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-sm mx-auto leading-relaxed">
            From possibilities to a structured roadmap.
          </p>
        </motion.div>
      </div>

      {/* ── STAGE 0: HERO (Sits comfortably below 64px navbar, does not cover globe) ── */}
      <motion.div
        style={{
          opacity: heroOpacity,
          y: heroY,
          pointerEvents: heroPointerEvents,
          display: heroDisplay,
        }}
        className="absolute inset-x-0 top-20 sm:top-22 md:top-24 lg:top-26 mx-auto max-w-2xl px-4 flex flex-col items-center text-center"
      >
        {/* Hero Heading: max ~56px desktop, compact leading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-heading font-bold text-slate-100 tracking-tight leading-[1.1] mb-2.5 max-w-xl drop-shadow-md">
          Your future has more than one direction.
        </h1>

        <p className="text-slate-300 font-light text-xs sm:text-sm max-w-md mb-5 leading-relaxed">
          Explore the world of careers. Find the direction that fits you.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 items-center">
          <Link
            href="/assessment"
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-cyan-500 px-6 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-950/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Take the Assessment</span>
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
          <Link
            href="/careers"
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-slate-700/80 bg-[#0B0E12]/80 px-5 text-xs sm:text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-[#141920] transition-colors"
          >
            Explore All Careers
          </Link>
        </div>
      </motion.div>

      {/* ── SCROLL TO EXPLORE INDICATOR (Strictly unmounted once user scrolls) ── */}
      {isInitialHero && (
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-6 inset-x-0 mx-auto flex flex-col items-center gap-1 text-slate-400 text-center pointer-events-none"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-cyan-400/90 font-medium">
            Scroll to explore
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
        </motion.div>
      )}

      {/* ── STAGE 5: FINAL CTA (Clean open destination, visually centered below navbar) ── */}
      <motion.div
        style={{
          opacity: ctaOpacity,
          y: ctaY,
          pointerEvents: ctaPointerEvents,
          display: ctaDisplay,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pt-12 sm:pt-14 px-4 text-center select-none z-50 pointer-events-none"
      >
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center pointer-events-auto">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] font-bold tracking-tight mb-3 text-slate-100 leading-[1.2] max-w-lg drop-shadow-[0_2px_24px_rgba(0,0,0,0.9)]">
            Your future shouldn&apos;t be a guess.
          </h2>

          <p className="text-sm sm:text-base text-slate-300/85 max-w-md mb-8 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Start with understanding yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 items-center">
            <Link
              href="/assessment"
              className="inline-flex h-11 sm:h-12 items-center justify-center rounded-xl bg-cyan-500 px-7 sm:px-8 text-sm sm:text-base font-semibold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Take the Assessment</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex h-11 sm:h-12 items-center justify-center rounded-xl border border-slate-700/80 bg-[#0B0E12]/80 px-6 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-[#141920] transition-colors"
            >
              Explore All Careers
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
