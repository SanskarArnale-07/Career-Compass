import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { getAllCareerIntelligence, type CareerIntelligence } from "@/lib/career-intelligence";
import { getCareerIcon } from "@/lib/career-icons";

export const metadata = {
  title: "Explore Careers | Career Compass",
  description:
    "Explore in-depth roadmaps, required skills, hands-on projects, and progression pathways across 12 high-impact career domains.",
};

export default function CareersPage() {
  const careers: CareerIntelligence[] = getAllCareerIntelligence();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>12 Exploration Pathways</span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Explore Careers
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-2xl">
                Deep-dive into verified skill trees, multi-phase learning roadmaps, portfolio projects, and job preparation checklists for every domain.
              </p>
            </div>

            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all shrink-0 self-start md:self-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>Take Assessment</span>
            </Link>
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
                  className="group flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/40 hover:bg-card-hover transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-muted/60 text-[11px] font-mono font-medium text-muted-foreground border border-border">
                      {career.category}
                    </span>
                  </div>

                  <h2 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {career.title}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 flex-1">
                    {career.tagline}
                  </p>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
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
