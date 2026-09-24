/**
 * Shared responsive type scale for the homepage scroll-story.
 * Uses clamp() so sizing scales continuously across breakpoints instead
 * of jumping at hard sm/md/lg steps.
 */
export const heroText =
  "font-heading font-bold tracking-tight text-foreground leading-[1.05] text-[clamp(3.25rem,5.5vw,5rem)]";

export const sceneHeading =
  "font-heading font-bold tracking-tight text-foreground leading-[1.1] text-[clamp(2.25rem,4vw,3.5rem)]";

export const sceneBody =
  "text-secondary-foreground font-light leading-relaxed text-[clamp(1rem,1.2vw,1.125rem)]";

export const smallLabel =
  "font-mono uppercase tracking-[0.2em] text-[12px] sm:text-[13px]";
