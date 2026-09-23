import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function FinalCta() {
  return (
    <section className="py-28 md:py-36 w-full border-t border-border/40 relative overflow-hidden">
      {/* Warm ambient radial glow in background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,146,42,0.08),transparent_70%)]" 
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-mono text-primary mb-6">
          <Compass className="h-3.5 w-3.5" />
          <span>Set Your Bearing</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Your career shouldn&apos;t be a guess.
        </h2>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed font-light">
          Begin with a definitive map of your cognitive traits, natural strengths, and highest-alignment pathways.
        </p>
        
        <Link href="/assessment">
          <ShimmerButton
            shimmerColor="#D4A853"
            shimmerSize="0.1em"
            borderRadius="0.75rem"
            background="linear-gradient(to bottom, #C8922A, #A6751E)"
            className="shadow-lg shadow-amber-900/20"
          >
            <span className="flex items-center gap-2.5 px-6 py-1.5 text-base font-medium tracking-tight text-white">
              <span>Start Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </ShimmerButton>
        </Link>
      </div>
    </section>
  );
}
