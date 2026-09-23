import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroConstellation } from "@/components/interactive/HeroConstellation";
import { Section01Understand } from "@/components/sections/Section01Understand";
import { Section02FindDirection } from "@/components/sections/Section02FindDirection";
import { Section03CareerMap } from "@/components/sections/Section03CareerMap";
import { Section04BuildPath } from "@/components/sections/Section04BuildPath";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* ── 1. HERO SECTION: Centered Editorial Hero with Constellation as Main Visual ── */}
      <section className="relative flex flex-col items-center justify-center pt-16 pb-16 sm:pt-24 sm:pb-20 w-full overflow-hidden">
        
        {/* Subtle atmospheric glow behind the hero */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_45%,rgba(200,146,42,0.06),transparent_70%)]" />

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-5xl">
          
          {/* Eyebrow / Masthead indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#141210] text-[11px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Navigation Instrument &middot; Career Intelligence</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground max-w-4xl mb-5 leading-[1.06]">
            Your future has more than one direction.
          </h1>
          
          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-secondary-foreground max-w-2xl mb-10 leading-relaxed font-light">
            Career Compass helps you understand where your strengths point &mdash; and what to do next.
          </p>

          {/* MAIN VISUAL: The Career Constellation Instrument */}
          <div className="w-full my-4">
            <HeroConstellation />
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-amber-950/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Take the Assessment</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link 
              href="/careers" 
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-[#141210] px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#1A1612] transition-colors"
            >
              Explore More Careers
            </Link>
          </div>

        </div>
      </section>

      {/* ── 2. SECTION 01 — UNDERSTAND YOURSELF ───────────────────── */}
      <Section01Understand />

      {/* ── 3. SECTION 02 — FIND YOUR DIRECTION ───────────────────── */}
      <Section02FindDirection />

      {/* ── 4. SECTION 03 — YOUR CAREER MAP ───────────────────────── */}
      <Section03CareerMap />

      {/* ── 5. SECTION 04 — BUILD YOUR PATH ───────────────────────── */}
      <Section04BuildPath />

      {/* ── 6. FINAL CTA ───────────────────────────────────────────── */}
      <FinalCta />
      
    </div>
  );
}
