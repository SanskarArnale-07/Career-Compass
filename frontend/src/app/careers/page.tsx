import Link from "next/link";
import { Compass, Sparkles, CompassIcon } from "lucide-react";
import { getAllCareerPaths, CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { CareersDirectoryFilter } from "@/components/career/CareersDirectoryFilter";

export const metadata = {
  title: "Explore More Careers | Career Compass",
  description:
    "Explore career directions across technology, business, health, creativity, science, and more. Browse in-depth roadmaps, skill trees, and specialization paths.",
};

export default function CareersPage() {
  const paths = getAllCareerPaths();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ── Directory Hero Header ───────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>{CAREER_DOMAINS.length} Domains · {paths.length} Career Paths</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Explore More Careers
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl font-light leading-relaxed">
                Explore career directions across technology, business, health, creativity, science, and more.
              </p>
            </div>

            {/* Product Distinction & CTA: What exists vs What fits me */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-muted-foreground/80 bg-[#12161F] border border-border/70 rounded-lg px-3 py-1.5">
                <span className="text-primary font-semibold">What exists</span>
                <span className="text-muted-foreground/40">·</span>
                <span>Catalogue Directory</span>
              </div>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-md shadow-cyan-950/30 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Get My Matches</span>
              </Link>
            </div>
          </div>

          {/* ── Exploration Guidance Banner ─────────────────────────── */}
          <div className="mb-8 p-4 rounded-xl bg-[#0D1117] border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <CompassIcon className="h-4 w-4 text-primary shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Student Exploration Guide:</strong> Select any career discipline below to drill down into its specializations, roles, and learning roadmaps.
              </span>
            </div>
            <span className="text-[11px] font-mono text-primary/90 shrink-0">
              {paths.length} disciplines available
            </span>
          </div>

          {/* ── Career Directory Filter & Path Cards ────────────────── */}
          <CareersDirectoryFilter paths={paths} />

        </div>
      </main>
    </div>
  );
}
