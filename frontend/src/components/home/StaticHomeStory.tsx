import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { heroText, sceneBody, sceneHeading, smallLabel } from "./typography";
import { BranchingCareerTree } from "./BranchingCareerTree";
import { TrajectoryPath } from "./TrajectoryPath";

const TRAITS = [
  { label: "Analytical", desc: "Logical reasoning & pattern analysis" },
  { label: "Technical", desc: "System architecture & engineering" },
  { label: "Scientific", desc: "Empirical inquiry & research" },
  { label: "Business", desc: "Commercial strategy & resource allocation" },
  { label: "Creative", desc: "Design, synthesis & novel concepts" },
  { label: "Social", desc: "Empathy, communication & collaboration" },
  { label: "Leadership", desc: "Vision, execution & coordination" },
  { label: "Exploration", desc: "Curiosity, adaptability & discovery" },
];

export function StaticHomeStory() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* ── 01. YOU / HERO ────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-20 sm:pt-28 sm:pb-24 w-full overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(0,229,255,0.07),transparent_70%)]" />
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#10141A] text-muted-foreground mb-6 ${smallLabel}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Navigation Instrument &middot; Career Intelligence</span>
          </div>

          <h1 className={`${heroText} max-w-3xl mb-5`}>
            Your future has more than one direction.
          </h1>

          <p className={`${sceneBody} max-w-2xl mb-10`}>
            Career Compass helps you understand where your strengths point &mdash; and what to do next.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-cyan-950/30 transition-all cursor-pointer"
            >
              <span>Take the Assessment</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-[#10141A] px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors"
            >
              Explore More Careers
            </Link>
          </div>
        </div>
      </section>

      {/* ── 02. UNDERSTAND: 8 TRAITS ──────────────────────────────── */}
      <section className="py-20 md:py-24 w-full border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-3 ${smallLabel}`}>
            <span>01 &middot; THE FOUNDATION</span>
          </div>
          <h2 className={`${sceneHeading} mb-3`}>First, we understand you.</h2>
          <p className={`${sceneBody} max-w-xl mb-10`}>
            Your responses map the interests, strengths, and preferences that shape your direction.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
            {TRAITS.map((t) => (
              <div
                key={t.label}
                className="p-4 rounded-xl border border-border/70 bg-[#10141A] flex flex-col items-center text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mb-2" />
                <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground">
                  {t.label}
                </h3>
                <p className="text-[11px] text-muted-foreground font-light mt-1">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#10141A] border border-border/70 text-muted-foreground text-xs">
            <span className="text-foreground font-semibold font-mono">20 Questions</span>
            <ArrowRight className="h-3 w-3 text-primary" />
            <span className="text-primary font-semibold font-mono">8 Dimensions</span>
          </div>
        </div>
      </section>

      {/* ── 03. DISCOVER: 6 CAREER DOMAINS ────────────────────────── */}
      <section className="py-20 md:py-24 w-full border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-3 ${smallLabel}`}>
            <span>02 &middot; THE HORIZONS</span>
          </div>
          <h2 className={`${sceneHeading} mb-3`}>Then, your direction starts to take shape.</h2>
          <p className={`${sceneBody} max-w-xl mb-10`}>
            Your assessment will reveal the career directions that align most closely with you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full text-left">
            {CAREER_DOMAINS.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-xl border border-border/70 bg-[#10141A] flex flex-col justify-between hover:border-primary/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {d.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {d.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-primary">
                  <span>{d.paths.length} Career Paths</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. CAREER TREE: BRANCHING TAXONOMY ────────────────────── */}
      <section className="py-20 md:py-24 w-full border-b border-border/40">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-3 ${smallLabel}`}>
            <span>03 &middot; THE HIERARCHY</span>
          </div>
          <h2 className={`${sceneHeading} mb-3`}>One direction can lead to many paths.</h2>
          <p className={`${sceneBody} max-w-xl mb-8`}>
            Explore how broad career domains branch into specialized paths, specializations, and concrete roles.
          </p>

          <BranchingCareerTree isStatic />

          <div className="mt-10">
            <Link
              href="/career-map"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold text-xs tracking-wide uppercase font-mono transition-colors"
            >
              <span>Explore the Complete 108-Role Career Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 05. BUILD PATH: SINGLE CONTINUOUS TRAJECTORY ────────────── */}
      <section className="py-20 md:py-24 w-full border-b border-border/40">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-[#141920] text-primary mb-3 ${smallLabel}`}>
            <span>04 &middot; THE TRAJECTORY</span>
          </div>
          <h2 className={`${sceneHeading} mb-3`}>And then, you build your path.</h2>
          <p className={`${sceneBody} max-w-xl mb-10`}>
            Once you choose a direction, Career Compass translates it into a continuous roadmap of skills, proof-of-work projects, and milestones.
          </p>

          <TrajectoryPath isStatic />
        </div>
      </section>

      {/* ── 06. FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 w-full relative overflow-hidden text-center">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-[#10141A] text-muted-foreground mb-6 ${smallLabel}`}>
            <span>Ready to Begin?</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Your career shouldn&apos;t be a guess.
          </h2>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-md mb-8 font-light leading-relaxed">
            Start with understanding yourself.
          </p>
          <Link
            href="/assessment"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary-hover shadow-lg shadow-cyan-950/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Take the Assessment</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
