"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Compass,
  Sparkles,
  Zap,
  ChevronRight,
  AlertCircle,
  Share2,
  Check,
  Map,
  Layers,
  Code2,
} from "lucide-react";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

import {
  getAllCareerIntelligence,
  resolveCareerIntelligence,
  type CareerIntelligence,
} from "@/lib/career-intelligence";
import { getCareerSlug } from "@/lib/career-details";
import {
  getStrengthsAndGaps,
  getPersonalizedSkills,
  getMatchExplanation,
  type StoredResults,
  type PersonalizedSkill,
  type StrengthGapItem,
  type AlternativeCareer,
} from "@/lib/career-details/personalization";
import { loadCareerJourney, setSelectedCareer } from "@/lib/persistence";

import CareerHero from "@/components/career/CareerHero";
import CareerSnapshot from "@/components/career/CareerSnapshot";
import WhyThisCareer from "@/components/career/WhyThisCareer";
import SkillsNeeded from "@/components/career/SkillsNeeded";
import LearningRoadmap from "@/components/career/LearningRoadmap";
import ProjectsSection from "@/components/career/ProjectsSection";
import CareerProgression from "@/components/career/CareerProgression";
import JobPreparation from "@/components/career/JobPreparation";
import AlternativeCareers from "@/components/career/AlternativeCareers";
import CareerConstellation from "@/components/career/CareerConstellation";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "roadmap" | "projects" | "all">("overview");

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const isClient = useIsClient();
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<StoredResults | null>(null);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const career: CareerIntelligence | undefined = resolveCareerIntelligence(slug);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const journey = loadCareerJourney();
        if (journey.assessment?.results) {
          setResults(journey.assessment.results as StoredResults);
        } else {
          const stored = sessionStorage.getItem("careerCompassResults");
          if (stored) {
            setResults(JSON.parse(stored));
          }
        }
        if (journey.progress?.completedPhases) {
          setCompletedPhases(journey.progress.completedPhases);
        }
      } catch (e) {
        console.error("Failed to load results", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleStartRoadmap = () => {
    if (!career) return;
    try {
      setSelectedCareer(career.slug);
    } catch (e) {
      console.error("Failed to update progress", e);
    }
    router.push("/dashboard");
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">
            Loading career insights...
          </p>
        </div>
      </div>
    );
  }

  // ── 404 Not Found State ─────────────────────────────────────────
  if (!career) {
    const popularCareers: CareerIntelligence[] = getAllCareerIntelligence().slice(0, 4);

    return (
      <div className="container mx-auto px-4 py-20 max-w-3xl text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Career Direction Not Found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          We couldn&apos;t find details for &ldquo;{slug}&rdquo;. Explore one of
          these high-demand pathways or take the assessment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-10 text-left">
          {popularCareers.map((c: CareerIntelligence) => (
            <Link
              key={c.slug}
              href={`/career/${c.slug}`}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card-hover transition-colors group flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {c.title}
                </p>
                <p className="text-xs text-muted-foreground">{c.category}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/results"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Back to Results
          </Link>
          <Link
            href="/careers"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
          >
            Explore All Careers
          </Link>
        </div>
      </div>
    );
  }

  // ── Personalization computation ────────────────────────────────
  const hasAssessment = !!(results && results.trait_profile);

  let matchPercentage: number | undefined;
  let explanation: string | undefined;
  let strengths: StrengthGapItem[] = [];
  let gaps: StrengthGapItem[] = [];
  let summary = "";
  let skills: PersonalizedSkill[] = [];
  let alternatives: AlternativeCareer[] = [];

  if (hasAssessment && results) {
    const currentMatch = results.top_careers.find(
      (c) =>
        getCareerSlug(c.career_name) === slug ||
        c.career_name.toLowerCase() === career.careerName.toLowerCase()
    );

    if (currentMatch) {
      matchPercentage = currentMatch.match_percentage;
      explanation = getMatchExplanation(
        results.trait_profile,
        career,
        matchPercentage
      );
    } else {
      matchPercentage = undefined;
      explanation = `This career was not among your top assessment recommendations, but you can explore its roadmap and required competencies below.`;
    }

    const sg = getStrengthsAndGaps(results.trait_profile, career);
    strengths = sg.strengths;
    gaps = sg.gaps;
    summary = sg.summary;

    skills = getPersonalizedSkills(results.trait_profile, career);

    alternatives = results.top_careers
      .filter((c) => getCareerSlug(c.career_name) !== slug)
      .slice(0, 3)
      .map((c) => ({
        careerName: c.career_name,
        slug: getCareerSlug(c.career_name),
        matchPercentage: c.match_percentage,
      }));
  } else {
    // Honest unassessed exploration baseline
    summary = `Take the assessment to discover your personalized alignment, validated strengths, and tailored recommendations for ${career.title}.`;
    strengths = [];
    gaps = [];

    skills = career.skills.map((s) => ({
      ...s,
      status: "developing",
    }));

    alternatives = career.relatedSlugs
      .map((s) => resolveCareerIntelligence(s))
      .filter((c): c is CareerIntelligence => !!c)
      .slice(0, 3)
      .map((c) => ({
        careerName: c.careerName,
        slug: c.slug,
        matchPercentage: 0,
      }));
  }

  const relatedList = (career?.relatedSlugs || [])
    .map((s) => resolveCareerIntelligence(s))
    .filter((c): c is CareerIntelligence => !!c)
    .map((c) => ({ title: c.title, slug: c.slug, category: c.category }));

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Utility / Breadcrumb bar */}
      <div className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
            <Link
              href="/"
              className="hover:text-foreground transition-colors shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <Link
              href="/results"
              className="hover:text-foreground transition-colors shrink-0"
            >
              Results
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="text-foreground font-medium truncate max-w-45 sm:max-w-none">
              {career.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-8 space-y-16 sm:space-y-20">
        {/* Banner if user has not taken the assessment */}
        {!hasAssessment && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary/15 border border-primary/25 text-primary shrink-0 mt-0.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Viewing General Roadmap Mode
                </p>
                <p className="text-xs sm:text-sm text-secondary-foreground mt-0.5">
                  Take the free 5-minute Career Compass assessment to unlock
                  your personalized fit score, strength matches, and custom
                  skill gaps.
                </p>
              </div>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shrink-0 transition-colors shadow-sm"
            >
              <span>Take Assessment</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}

        {/* 1. Hero */}
        <section id="hero">
          <CareerHero
            career={career}
            matchPercentage={matchPercentage}
            explanation={explanation}
            onStartRoadmap={handleStartRoadmap}
          />
        </section>

        {/* Editorial Content Category Tabs */}
        <div className="border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-12 z-20 py-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none" role="tablist">
            {[
              { id: "overview" as const, label: "Overview & Fit", icon: Compass },
              { id: "skills" as const, label: "Skills Needed", icon: Sparkles },
              { id: "roadmap" as const, label: "Phased Roadmap", icon: Map },
              { id: "projects" as const, label: "Projects & Career Path", icon: Code2 },
              { id: "all" as const, label: "All Insights", icon: Layers },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-16 sm:space-y-20">
          {/* Overview Tab Content */}
          {(activeTab === "overview" || activeTab === "all") && (
            <div className="space-y-16 sm:space-y-20">
              <section id="snapshot">
                <CareerSnapshot items={career.snapshot} />
              </section>

              <section id="why-this-career">
                <WhyThisCareer
                  summary={summary}
                  strengths={strengths}
                  gaps={gaps}
                />
              </section>

              <section id="constellation">
                <CareerConstellation career={career} relatedCareers={relatedList} />
              </section>
            </div>
          )}

          {/* Skills Tab Content */}
          {(activeTab === "skills" || activeTab === "all") && (
            <section id="skills">
              <SkillsNeeded skills={skills} hasAssessment={hasAssessment} />
            </section>
          )}

          {/* Roadmap Tab Content */}
          {(activeTab === "roadmap" || activeTab === "all") && (
            <section id="roadmap">
              <LearningRoadmap phases={career.roadmap} completedPhases={completedPhases} />
            </section>
          )}

          {/* Projects & Progression Tab Content */}
          {(activeTab === "projects" || activeTab === "all") && (
            <div className="space-y-16 sm:space-y-20">
              <section id="projects">
                <ProjectsSection projects={career.projects} />
              </section>

              <section id="progression">
                <CareerProgression stages={career.progression} />
              </section>

              <section id="preparation">
                <JobPreparation
                  items={career.preparation}
                  careerSlug={career.slug}
                />
              </section>

              <section id="alternatives">
                <AlternativeCareers alternatives={alternatives} />
              </section>
            </div>
          )}
        </div>

        {/* 10. Bottom Action CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-r from-card via-[#161412] to-card p-8 sm:p-12 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
              <Compass className="h-3.5 w-3.5" />
              <span>Take Action Today</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to pursue {career.title}?
            </h2>
            <p className="text-secondary-foreground text-sm sm:text-base mb-8 leading-relaxed">
              Track your weekly milestones, mark off preparation tasks, and follow
              your step-by-step roadmap on your personal dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ShimmerButton
                onClick={handleStartRoadmap}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold shadow-lg shadow-primary/25"
              >
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Go to Roadmap Dashboard</span>
                </span>
              </ShimmerButton>
              <Link
                href="/results"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-card-hover transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Results</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
