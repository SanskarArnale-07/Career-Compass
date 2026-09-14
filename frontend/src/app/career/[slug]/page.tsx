"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

import {
  getCareerBySlug,
  getAllCareers,
  getCareerSlug,
  type CareerDetail,
} from "@/lib/career-details";
import {
  getStrengthsAndGaps,
  getPersonalizedSkills,
  getMatchExplanation,
  type StoredResults,
  type PersonalizedSkill,
  type StrengthGapItem,
  type AlternativeCareer,
} from "@/lib/career-details/personalization";

import CareerHero from "@/components/career/CareerHero";
import CareerSnapshot from "@/components/career/CareerSnapshot";
import WhyThisCareer from "@/components/career/WhyThisCareer";
import SkillsNeeded from "@/components/career/SkillsNeeded";
import LearningRoadmap from "@/components/career/LearningRoadmap";
import ProjectsSection from "@/components/career/ProjectsSection";
import CareerProgression from "@/components/career/CareerProgression";
import JobPreparation from "@/components/career/JobPreparation";
import AlternativeCareers from "@/components/career/AlternativeCareers";

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<StoredResults | null>(null);

  const career: CareerDetail | undefined = getCareerBySlug(slug);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = sessionStorage.getItem("careerCompassResults");
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load results from sessionStorage", e);
    }
  }, []);

  const handleStartRoadmap = () => {
    if (!career) return;
    try {
      const existing = localStorage.getItem("careerCompassProgress");
      const progressData = existing ? JSON.parse(existing) : {};
      progressData.currentCareer = {
        slug: career.slug,
        title: career.title,
        careerName: career.careerName,
        startedAt:
          progressData.currentCareer?.slug === career.slug
            ? progressData.currentCareer.startedAt
            : Date.now(),
      };
      localStorage.setItem(
        "careerCompassProgress",
        JSON.stringify(progressData)
      );
    } catch (e) {
      console.error("Failed to update progress in localStorage", e);
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
    const popularCareers = getAllCareers().slice(0, 4);

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
          {popularCareers.map((c) => (
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
      matchPercentage = 72; // Default baseline alignment for exploratory pathways
      explanation = getMatchExplanation(
        results.trait_profile,
        career,
        matchPercentage
      );
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
    // Graceful unpersonalized fallback
    summary = `Explore core strengths and key development areas essential for succeeding in ${career.title}.`;
    strengths = [
      {
        title: "Domain Curiosity",
        status: "strong",
        explanation: `Natural interest and focus in ${career.category.toLowerCase()} concepts and problem solving.`,
      },
      {
        title: "Structured Execution",
        status: "developing",
        explanation: `Ability to take complex projects and break them down into actionable milestones.`,
      },
    ];
    gaps = [
      {
        title: "Core Technical Mastery",
        status: "developing",
        explanation: `Build specific domain tools and foundational principles from the roadmap below.`,
      },
      {
        title: "Portfolio Proof",
        status: "needs-work",
        explanation: `Having 2–3 deployed or published projects significantly increases credibility.`,
      },
    ];

    skills = career.skills.map((s, idx) => ({
      ...s,
      status: idx === 0 ? "strong" : idx < 3 ? "developing" : "needs-work",
    }));

    alternatives = career.relatedSlugs
      .map((s) => getCareerBySlug(s))
      .filter((c): c is CareerDetail => !!c)
      .slice(0, 3)
      .map((c) => ({
        careerName: c.careerName,
        slug: c.slug,
        matchPercentage: 0,
      }));
  }

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
            <span className="text-foreground font-medium truncate max-w-[180px] sm:max-w-none">
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

        {/* 2. Career Snapshot */}
        <section id="snapshot">
          <CareerSnapshot items={career.snapshot} />
        </section>

        {/* 3. Why This Career (Strengths & Gaps) */}
        <section id="why-this-career">
          <WhyThisCareer
            summary={summary}
            strengths={strengths}
            gaps={gaps}
          />
        </section>

        {/* 4. Skills Needed */}
        <section id="skills">
          <SkillsNeeded skills={skills} hasAssessment={hasAssessment} />
        </section>

        {/* 5. Phased Learning Roadmap */}
        <section id="roadmap">
          <LearningRoadmap phases={career.roadmap} />
        </section>

        {/* 6. Projects to Build */}
        <section id="projects">
          <ProjectsSection projects={career.projects} />
        </section>

        {/* 7. Career Progression */}
        <section id="progression">
          <CareerProgression stages={career.progression} />
        </section>

        {/* 8. Job Preparation Checklist */}
        <section id="preparation">
          <JobPreparation
            items={career.preparation}
            careerSlug={career.slug}
          />
        </section>

        {/* 9. Alternative Careers */}
        <section id="alternatives">
          <AlternativeCareers alternatives={alternatives} />
        </section>

        {/* 10. Bottom Action CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-[#0F172A] to-card p-8 sm:p-12 text-center">
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
              <button
                onClick={handleStartRoadmap}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                <span>Go to Roadmap Dashboard</span>
              </button>
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
