import Link from "next/link";
import { ArrowRight, Compass, Sparkles, GitBranch } from "lucide-react";
import { getAllCareerIntelligence, type CareerIntelligence } from "@/lib/career-intelligence";
import { getCareerIcon } from "@/lib/career-icons";
import { getCareerHierarchy, CAREER_DOMAINS } from "@/lib/career-hierarchy";
import { CareerTreeExplorer } from "@/components/career/CareerTreeExplorer";
import { CareersDirectoryFilter } from "@/components/career/CareersDirectoryFilter";

export const metadata = {
  title: "Explore More Careers | Career Compass",
  description:
    "Curious about careers beyond your personalized recommendations? Browse in-depth roadmaps, skill trees, and learning paths across 12 high-impact career domains.",
};

export default function CareersPage() {
  const careers: CareerIntelligence[] = getAllCareerIntelligence();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* ── Header ────────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>{careers.length} Career Domains</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Explore More Careers
              </h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl font-light">
                Browse every career domain. Click any card to see the full roadmap, skills, and resources.
              </p>
            </div>

            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-md shadow-amber-950/20 transition-all shrink-0 self-start md:self-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>Get My Matches</span>
            </Link>
          </div>

          {/* ── Interactive Hierarchy Tree ─────────────────────────── */}
          <div className="mb-10 rounded-2xl border border-border/70 bg-[#0D0C0A] p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#C8922A_1px,transparent_1px),linear-gradient(to_bottom,#C8922A_1px,transparent_1px)] bg-[size:36px_36px]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                    Career Hierarchy Tree — click to explore
                  </p>
                </div>
                <Link
                  href="/career-map"
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-primary hover:underline"
                >
                  <GitBranch className="h-3 w-3" />
                  Full map
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>

              <CareerTreeExplorer mode="full" showLines />
            </div>
          </div>

          {/* ── Secondary Convenience: Career Directory Search & Filter ── */}
          <div className="pt-4 border-t border-border/50">
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                Directory Lookup
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quick filter for direct roadmaps, or explore the tree branches above.
              </p>
            </div>
            <CareersDirectoryFilter careers={careers} />
          </div>
        </div>
      </main>
    </div>
  );
}
