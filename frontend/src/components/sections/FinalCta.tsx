import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-20 md:py-24 w-full border-t border-border/40 relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,146,42,0.06),transparent_70%)]" 
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 flex flex-col items-center text-center">
        {/* Heading */}
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
          Your career shouldn&apos;t be a guess.
        </h2>
        
        {/* Supporting text */}
        <p className="text-base sm:text-lg text-secondary-foreground max-w-md mb-8 leading-relaxed font-light">
          Start with understanding yourself.
        </p>
        
        {/* Primary CTA */}
        <Link
          href="/assessment"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-amber-950/30 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Take the Assessment</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
