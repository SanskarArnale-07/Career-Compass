import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function FinalCta() {
  return (
    <section className="py-20 md:py-24 w-full border-t border-border/40 relative overflow-hidden">
      {/* Warm ambient radial glow in background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,146,42,0.08),transparent_70%)]" 
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 flex flex-col items-center text-center">
        {/* Subtle compass badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary mb-6">
          <Compass className="h-3.5 w-3.5" />
          <span>Begin Navigation</span>
        </div>

        {/* Heading */}
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
          Your career shouldn&apos;t be a guess.
        </h2>
        
        {/* Supporting text */}
        <p className="text-base sm:text-lg text-secondary-foreground max-w-md mb-8 leading-relaxed font-light">
          Start with understanding yourself.
        </p>
        
        {/* Primary CTA */}
        <Link href="/assessment">
          <ShimmerButton
            shimmerColor="#D4A853"
            shimmerSize="0.1em"
            borderRadius="0.75rem"
            background="linear-gradient(to bottom, #C8922A, #A6751E)"
            className="shadow-lg shadow-amber-900/20"
          >
            <span className="flex items-center gap-2.5 px-7 py-2 text-base font-semibold tracking-tight text-white">
              <span>Take the Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </ShimmerButton>
        </Link>
      </div>
    </section>
  );
}
