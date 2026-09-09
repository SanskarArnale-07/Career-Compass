"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (status === "resolving") {
      setHasResolved(true);
      const t = setTimeout(() => {
        onCompleteRef.current?.();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [status]);

  // ── Rank helpers ──────────────────────────────────────────────────────────
  const getRank = (name: string) =>
    hasResolved ? topCareerNames.indexOf(name) : -1;

  const orbitOpacity = (_name: string): number => {
    if (!hasResolved) return 1;
    return 0.85; // All career directions stay active and bright
  };

  const orbitScale = (_name: string): number => {
    if (!hasResolved) return 1;
    return 1;
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full"
      aria-live="polite"
      aria-label={
        hasResolved
          ? "Career directions mapped"
          : "Discovering career directions"
      }
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: hasResolved ? 1 : 0.4 }}
        transition={{ duration: 1.2 }}
      >
        <div className="w-72 h-72 sm:w-96 sm:h-96 bg-primary/15 rounded-full blur-3xl" />
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

          const HALF_ICON = 22; // px — half of ~44px container

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
                    ? { duration: 0.6, ease: "easeOut" }
                    : {
                        x: { duration: dur, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
                        y: { duration: dur * 0.88, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
                        opacity: { duration: 0.8, delay: index * 0.05 },
                        scale:   { duration: 0.8, delay: index * 0.05 },
                      }
                }
              >
                <div
                  className={`rounded-xl border transition-all duration-500 ${
                    hasResolved
                      ? "p-2 sm:p-2.5 bg-card/95 border-primary/40 shadow-sm shadow-primary/20 text-primary"
                      : "p-2 sm:p-2.5 bg-card border-border hover:border-primary/40 text-muted-foreground"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
                      hasResolved ? "text-primary" : "text-muted-foreground"
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
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center text-center px-6"
          >
            <span className="font-heading text-lg sm:text-xl font-bold tracking-widest text-foreground mb-2">
              CAREER <span className="text-primary">✦</span> COMPASS
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
            <button
              type="button"
              onClick={() => onCompleteRef.current?.()}
              className="mt-4 pointer-events-auto text-[11px] text-muted-foreground/70 hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
            >
              Skip to results &rarr;
            </button>
          </motion.div>

          {/* Resolution state — multiple directions ready */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: hasResolved ? 1 : 0, scale: hasResolved ? 1 : 0.85 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 90, damping: 18 }}
            className="absolute flex flex-col items-center text-center px-4"
          >
            <div className="mb-2.5 p-4 rounded-2xl bg-primary/20 border border-primary/40 shadow-xl shadow-primary/25">
              <span className="text-2xl text-primary font-bold">🧭</span>
            </div>

            <p className="text-muted-foreground text-[11px] sm:text-xs font-medium mb-1">
              Analysis complete
            </p>
            <h3 className="font-heading text-base sm:text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
              Your Career Directions
            </h3>
            <div className="inline-flex items-center bg-primary/15 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-medium tracking-wide">
              Synthesizing possibilities...
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
