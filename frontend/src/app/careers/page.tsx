import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { getAllCareerIntelligence, type CareerIntelligence } from "@/lib/career-intelligence";
import { getCareerIcon } from "@/lib/career-icons";

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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>12 Exploration Pathways</span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Explore More Careers
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl font-light">
                Curious about careers beyond your personalized recommendations? Browse every domain below.
              </p>
            </div>

            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-md shadow-amber-950/20 transition-all shrink-0 self-start md:self-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>Take Assessment</span>
            </Link>
          </div>

          {/* Contextual Banner */}
          <div className="mb-12 p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-primary/15 border border-primary/25 text-primary shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Get personalized recommendations tailored to you
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-light">
                  Take the adaptive 5-minute assessment to see which trajectories align with your behavioral traits.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/results"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                View My Matches
              </Link>
              <Link
                href="/assessment"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                or take assessment
              </Link>
            </div>
          </div>

          {/* Careers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => {
              const IconComponent = getCareerIcon(career.careerName);
              const difficulty =
                career.snapshot.find((s) => s.label.includes("Difficulty"))?.value || "Moderate";
              const growth =
                career.snapshot.find((s) => s.label.includes("Growth"))?.value || "High";

              return (
                <Link
                  key={career.slug}
                  href={`/career/${career.slug}`}
                  className="group flex flex-col p-6 rounded-xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:bg-card-hover transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161412] text-[11px] font-mono font-medium text-muted-foreground border border-border/60">
                      {career.category}
                    </span>
                  </div>

                  <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 tracking-tight">
                    {career.title}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1 font-light">
                    {career.tagline}
                  </p>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>Diff: <strong className="text-foreground font-medium">{difficulty}</strong></span>
                      <span>Growth: <strong className="text-foreground font-medium">{growth}</strong></span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
