"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CAREER_ICON_MAP } from "@/lib/career-icons";

interface CareerDiscoveryAnimationProps {
  status: "discovering" | "resolving";
  topCareer?: { name: string; matchPercentage: number };
  onComplete?: () => void;
  topCareerNames?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBITAL POSITIONS — [left%, top%] relative to the square container.
//
// Each icon's CENTER is placed at these coordinates.
// The outer wrapper div uses negative margins (–22px each axis) to shift the
// ~44px icon box so its centre lands exactly on the coordinate, completely
// avoiding any CSS-transform / Framer-Motion collision.
//
// Central safe zone: roughly [28 %–72 %, 28 %–72 %]. No icon is placed there.
// Orbit follows an elliptical path (wider horizontally because most screens are
// landscape); small manual adjustments give a natural constellation feel.
// ─────────────────────────────────────────────────────────────────────────────
const ORBIT: [number, number][] = [
  [50,  4],   //  0 — 12 o'clock
  [72,  9],   //  1 — ~1 o'clock
  [88, 23],   //  2 — ~2 o'clock
  [93, 43],   //  3 — 3 o'clock
  [91, 63],   //  4 — ~4 o'clock
  [74, 79],   //  5 — ~5 o'clock
  [50, 85],   //  6 — 6 o'clock
  [26, 79],   //  7 — ~7 o'clock
  [ 9, 63],   //  8 — ~8 o'clock
  [ 7, 43],   //  9 — 9 o'clock
  [12, 23],   // 10 — ~10 o'clock
  [28,  9],   // 11 — ~11 o'clock
];

// Floating keyframes per icon (pixels).
// Values are intentionally small (≤ 8 px) and roughly tangential so icons
// stay in their orbital lane and never drift toward the centre.
const FLOAT_X: number[][] = [
  [ 0,  3,  0, -3,  0],   //  0
  [ 3,  5,  3,  0,  3],   //  1
  [ 5,  5,  3,  5,  5],   //  2
  [ 5,  3,  5,  6,  5],   //  3
  [ 5,  3,  5,  3,  5],   //  4
  [ 2,  0, -2,  0,  2],   //  5
  [ 0, -3,  0,  3,  0],   //  6
  [-3, -5, -3,  0, -3],   //  7
  [-5, -5, -3, -5, -5],   //  8
  [-5, -3, -5, -6, -5],   //  9
  [-5, -3, -5, -3, -5],   // 10
  [-2,  0,  2,  0, -2],   // 11
];
const FLOAT_Y: number[][] = [
  [-5, -3,  0,  3,  5].map(v => v * -1),   //  0 — drifts up/down
  [-4, -2,  0,  2, -4],                     //  1
  [-2,  0,  3,  0, -2],                     //  2
  [ 0,  3,  5,  3,  0],                     //  3
  [ 3,  5,  6,  5,  3],                     //  4
  [ 5,  6,  5,  4,  5],                     //  5
  [ 5,  3,  0, -3, -5].map(v => v * -1),   //  6
  [ 4,  2,  0, -2,  4],                     //  7
  [ 2,  0, -3,  0,  2],                     //  8
  [ 0, -3, -5, -3,  0],                     //  9
  [-3, -5, -6, -5, -3],                     // 10
  [-5, -6, -5, -4, -5],                     // 11
];
const FLOAT_DURATION = [4.8, 5.2, 5.6, 4.6, 5.0, 4.4, 5.4, 5.8, 4.2, 5.6, 4.8, 5.0];

// ─────────────────────────────────────────────────────────────────────────────

export function CareerDiscoveryAnimation({
  status,
  topCareer,
  onComplete,
  topCareerNames = [],
}: CareerDiscoveryAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasResolved, setHasResolved] = useState(false);

  const iconEntries = useMemo(() => Object.entries(CAREER_ICON_MAP), []);

  const loadingTexts = [
    "Mapping your possibilities...",
    "Connecting your strengths...",
    "Finding your direction...",
  ];
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  useEffect(() => {
    if (status === "discovering") {
      const interval = setInterval(
        () => setLoadingTextIdx((p) => (p + 1) % loadingTexts.length),
        1400
      );
      return () => clearInterval(interval);
    }
  }, [status, loadingTexts.length]);

  useEffect(() => {
    if (status === "resolving" && topCareer && !hasResolved) {
      setHasResolved(true);
      const t = setTimeout(() => onComplete?.(), 3800);
      return () => clearTimeout(t);
    }
  }, [status, topCareer, hasResolved, onComplete]);

  // ── Rank helpers ──────────────────────────────────────────────────────────
  const getRank = (name: string) =>
    hasResolved ? topCareerNames.indexOf(name) : -1;

  const orbitOpacity = (name: string): number => {
    if (!hasResolved) return 1;
    if (name === topCareer?.name) return 0;    // winner leaves orbit
    const r = getRank(name);
    if (r === 1 || r === 2) return 0.65;
    if (r === 3 || r === 4) return 0.55;
    return 0.40;
  };

  const orbitScale = (name: string): number => {
    if (!hasResolved) return 1;
    if (name === topCareer?.name) return 0.4;
    const r = getRank(name);
    if (r === 1 || r === 2) return 0.85;
    return 0.75;
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full"
      aria-live="polite"
      aria-label={
        hasResolved
          ? `Career result: ${topCareer?.name}`
          : "Discovering career matches"
      }
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: hasResolved ? 1 : 0.35 }}
        transition={{ duration: 1.2 }}
      >
        <div className="w-72 h-72 sm:w-96 sm:h-96 bg-primary/8 rounded-full blur-3xl" />
      </motion.div>

      {/*
        Square orbit container.
        Icons are positioned absolutely inside it.
        The inner center overlay sits on top via absolute + inset-0.

        Size is clamped: on mobile it fills 92 vw; caps at 560 px on desktop.
        We use the same square for both axes so ORBIT percentages map cleanly.
      */}
      <div
        className="relative"
        style={{ width: "min(92vw, 560px)", height: "min(92vw, 560px)" }}
      >

        {/* ── Orbital icons ────────────────────────────────────────────── */}
        {iconEntries.map(([careerName, Icon], index) => {
          const [lPct, tPct] = ORBIT[index % ORBIT.length];

          /*
           * Architecture:
           *   outer div  — static CSS position (left/top + negative margin)
           *                completely separate from Framer Motion transforms
           *   motion.div — handles opacity, scale, and subtle px float ONLY
           *
           * This avoids the Framer Motion "transform replacement" bug where
           * setting transform in style gets overwritten by the animated transform.
           *
           * Icon container is ~44 px (p-2.5 × 2 = 20 px + icon 24 px).
           * Negative margin of –22 px centres it on the coordinate.
           */
          const HALF_ICON = 22; // px — half of ~44px container

          const isWinner = topCareer?.name === careerName;

          const floatXKeys = prefersReducedMotion ? [0] : FLOAT_X[index % FLOAT_X.length];
          const floatYKeys = prefersReducedMotion ? [0] : FLOAT_Y[index % FLOAT_Y.length];
          const dur = FLOAT_DURATION[index % FLOAT_DURATION.length];

          return (
            <div
              key={careerName}
              style={{
                position: "absolute",
                left: `${lPct}%`,
                top: `${tPct}%`,
                marginLeft: `-${HALF_ICON}px`,
                marginTop: `-${HALF_ICON}px`,
                zIndex: 10,
              }}
              title={careerName}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={
                  hasResolved
                    ? {
                        x: 0,
                        y: 0,
                        opacity: orbitOpacity(careerName),
                        scale: orbitScale(careerName),
                      }
                    : {
                        x: floatXKeys,
                        y: floatYKeys,
                        opacity: 1,
                        scale: 1,
                      }
                }
                transition={
                  hasResolved
                    ? { duration: 0.8, ease: "easeOut" }
                    : {
                        x: { duration: dur, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
                        y: { duration: dur * 0.88, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
                        opacity: { duration: 0.8, delay: index * 0.07 },
                        scale:   { duration: 0.8, delay: index * 0.07 },
                      }
                }
              >
                <div
                  className={`rounded-xl border transition-all duration-700 ${
                    hasResolved && !isWinner
                      ? "p-2 sm:p-2.5 bg-card/90 border-primary/20 shadow-sm shadow-primary/10"
                      : "p-2 sm:p-2.5 bg-card border-border/60 hover:border-primary/30"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-700 ${
                      hasResolved && !isWinner
                        ? "text-primary/60"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* ── Centre overlay ───────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">

          {/* Discovery state */}
          <motion.div
            animate={{ opacity: hasResolved ? 0 : 1, scale: hasResolved ? 0.9 : 1 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center text-center px-6"
          >
            <span className="font-heading text-lg sm:text-xl font-bold tracking-widest text-foreground mb-2">
              CAREER ✦ COMPASS
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm text-muted-foreground"
              >
                {loadingTexts[loadingTextIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Resolution state — winner card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: hasResolved ? 1 : 0, scale: hasResolved ? 1 : 0.8 }}
            transition={{ delay: 0.35, duration: 0.7, type: "spring", stiffness: 80, damping: 16 }}
            className="absolute flex flex-col items-center text-center px-4"
          >
            {/* Winner icon in centre */}
            {topCareer &&
              (() => {
                const WinnerIcon = CAREER_ICON_MAP[topCareer.name];
                return WinnerIcon ? (
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: hasResolved ? 1 : 0.4, opacity: hasResolved ? 1 : 0 }}
                    transition={{ delay: 0.55, type: "spring", stiffness: 70, damping: 14 }}
                    className="mb-2.5 p-4 sm:p-5 rounded-2xl bg-primary/15 border border-primary/40 shadow-2xl shadow-primary/30"
                  >
                    <WinnerIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </motion.div>
                ) : null;
              })()}

            <p className="text-muted-foreground text-[11px] sm:text-xs font-medium mb-1">
              Your profile currently shows a strong fit with
            </p>
            <h3 className="font-heading text-base sm:text-xl md:text-2xl font-bold text-foreground mb-2.5 leading-tight max-w-[180px] sm:max-w-[240px]">
              {topCareer?.name}
            </h3>
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/30 text-green-500 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
              {topCareer?.matchPercentage}% Match
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
