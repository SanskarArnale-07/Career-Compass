"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useReducedMotion, useMotionValueEvent } from "framer-motion";
import { CareerGlobeCanvas } from "./CareerGlobeCanvas";
import { GlobeOverlay } from "./GlobeOverlay";

export function CareerGlobeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [scrollVal, setScrollVal] = useState(0);

  // Single global scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal(latest);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fade out ambient vignette so final CTA sits on a clean near-black background
  const vignetteOpacity = scrollVal <= 0.80 ? 1 : Math.max(0, 1 - (scrollVal - 0.80) / 0.05);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600vh] sm:h-[800vh] lg:h-[1100vh] bg-[#080A0D]"
    >
      {/* ── ONE STICKY 100VH VIEWPORT ──────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#080A0D]">
        
        {/* Subtle Dark Futuristic Ambient Vignette (fades out for clean near-black CTA background) */}
        <div
          style={{ opacity: vignetteOpacity }}
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(14,165,233,0.06),transparent_80%)] transition-opacity duration-150"
        />

        {/* ── Real 3D Three.js Career Globe Canvas ───────────────────── */}
        {mounted && (
          <CareerGlobeCanvas
            scrollProgress={scrollVal}
            isReducedMotion={!!isReducedMotion}
          />
        )}

        {/* ── Minimalist Non-Intrusive HTML/React Overlay ────────────── */}
        <GlobeOverlay progress={scrollYProgress} />
      </div>
    </div>
  );
}
