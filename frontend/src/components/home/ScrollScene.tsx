"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, type MotionValue } from "framer-motion";

interface ScrollSceneProps {
  /** Height of the tall scroll container, in viewport-height units. */
  heightVh?: number;
  className?: string;
  /** Extra classes for the sticky inner viewport. */
  viewportClassName?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}

/**
 * Conceptual structure (per the homepage scroll-story spec):
 *
 *   <tall container>                 (heightVh)
 *     └── sticky 100vh viewport
 *           progress 0 -> 1 mapped across the tall container's scroll range
 *
 * This does NOT hijack scroll — it's a normal sticky element. The user
 * scrolls at their own pace; we just read scrollYProgress against this
 * section's own bounds and let each scene interpolate its own animation
 * states from it.
 */
export function ScrollScene({
  heightVh = 300,
  className = "",
  viewportClassName = "",
  children,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      style={{ height: `${heightVh}vh` }}
      className={`relative w-full ${className}`}
    >
      <div
        className={`sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center ${viewportClassName}`}
      >
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
