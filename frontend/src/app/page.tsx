import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Particles } from "@/components/interactive/Particles";
import { BlurText } from "@/components/interactive/BlurText";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { HeroConstellation } from "@/components/interactive/HeroConstellation";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CareerMatchPreview } from "@/components/sections/CareerMatchPreview";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* 1. HERO SECTION — Cinematic centered composition */}
      <section className="relative flex flex-col items-center justify-center pt-28 pb-20 md:pt-40 md:pb-32 w-full overflow-hidden">
        {/* Particles — dimmer, atmospheric */}
        <Particles
          className="absolute inset-0 z-0 opacity-10"
          quantity={50}
          ease={80}
          staticity={40}
        />
        
        {/* Atmospheric warm radial glow */}
        <div className="absolute inset-0 z-0 bg-radial from-primary/6 via-background/95 to-background" />

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-5xl">
          
          {/* Eyebrow */}
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-8 animate-fade-in-up">
            Career Compass&ensp;/&ensp;Discovery
          </p>

          {/* Hero Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] max-w-4xl mb-6 leading-[1.05] text-foreground">
            <BlurText
              text="Find the career that actually fits you."
              delay={0.05}
              className="inline-block"
            />
          </h1>
          
          {/* Supporting line */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-14 leading-relaxed animate-fade-in-up delay-200">
            Understand your strengths. Discover your direction. Build your path.
          </p>

          {/* Constellation Visual */}
          <div className="w-full max-w-sm md:max-w-md mb-16 animate-fade-in-up delay-300">
            <HeroConstellation />
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 items-center animate-fade-in-up delay-500">
            <Link href="/assessment" className="inline-block">
              <ShimmerButton className="h-12 px-8 text-base font-semibold">
                <span className="flex items-center gap-2">
                  <span>Take the Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ShimmerButton>
            </Link>
            <div className="flex flex-col items-center">
              <Link 
                href="/careers" 
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore More Careers
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[11px] text-muted-foreground/50 mt-1">Curious about a different path?</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURES */}
      <Features />

      {/* 3. HOW IT WORKS */}
      <HowItWorks />

      {/* 4. CAREER MATCH PREVIEW */}
      <CareerMatchPreview />

      {/* 5. FINAL CTA */}
      <FinalCta />
      
    </div>
  );
}
