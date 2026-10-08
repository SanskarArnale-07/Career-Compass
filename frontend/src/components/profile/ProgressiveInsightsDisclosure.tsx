"use client";

import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  FolderArchive,
  BarChart3,
  ArrowRight,
  Layers,
} from "lucide-react";
import { ProfileMetricsRow } from "./ProfileMetricsRow";
import { StreamSuitabilitySection } from "./StreamSuitabilitySection";
import { WhyFitSection } from "./WhyFitSection";
import { WorkLearningStyleSection } from "./WorkLearningStyleSection";
import { GroupedCareerMatchesSection } from "./GroupedCareerMatchesSection";
import { RoadmapMomentumSection } from "./RoadmapMomentumSection";
import type { CareerMatch } from "@/lib/types/assessment";
import type {
  StreamSuitabilityItem,
  WhyFitReasoning,
  WorkLearningStyle,
} from "@/lib/profile/profile-utils";
import type { getCareerIntelligence } from "@/lib/career-intelligence";

interface ProgressiveInsightsDisclosureProps {
  isOpen: boolean;
  onToggle: () => void;
  // Summary Metrics
  overallPercent: number;
  topCareerName: string;
  topCareerScore?: number;
  topTraitLabel: string;
  topTraitScore?: number;
  primaryStream: string;
  weeklyPaceHours: number;
  // Stream suitability
  rankedStreams: StreamSuitabilityItem[];
  // Why fit
  whyFitReasoning: WhyFitReasoning;
  // Work learning style
  workLearningStyle: WorkLearningStyle;
  // Career matches
  strongMatches: CareerMatch[];
  explorationMatches: CareerMatch[];
  allVisibleMatches: CareerMatch[];
  // Roadmap momentum
  career: ReturnType<typeof getCareerIntelligence>;
  completedPhases: number;
  totalPhases: number;
  masteredSkills: number;
  totalSkills: number;
  currentPhaseTitle?: string;
  nextMilestone: string;
  selectedSlug: string;
}

export function ProgressiveInsightsDisclosure({
  isOpen,
  onToggle,
  overallPercent,
  topCareerName,
  topCareerScore,
  topTraitLabel,
  topTraitScore,
  primaryStream,
  weeklyPaceHours,
  rankedStreams,
  whyFitReasoning,
  workLearningStyle,
  strongMatches,
  explorationMatches,
  allVisibleMatches,
  career,
  completedPhases,
  totalPhases,
  masteredSkills,
  totalSkills,
  currentPhaseTitle,
  nextMilestone,
  selectedSlug,
}: ProgressiveInsightsDisclosureProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all shadow-md shadow-black/10">
      {/* Accordion / Disclosure Header Toggle */}
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                In-Depth Assessment Intelligence &amp; Analysis
              </h3>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary/15 border border-secondary/25 text-secondary">
                {isOpen ? "Expanded" : "On-Demand"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Stream suitability, 3-pillar career reasoning, work style profile, and full trajectory catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-mono text-primary font-semibold hidden md:inline">
            {isOpen ? "Collapse Detailed Intelligence" : "Explore Detailed Intelligence"}
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#141920] border border-border flex items-center justify-center text-primary">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Progressively Disclosed Sections */}
      {isOpen && (
        <div className="p-5 sm:p-6 pt-2 border-t border-border/60 space-y-6">
          {/* 1. Summary Metrics Row */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                Key Performance &amp; Alignment Metrics
              </h4>
            </div>
            <ProfileMetricsRow
              roadmapPercent={overallPercent}
              topCareerName={topCareerName}
              topCareerScore={topCareerScore}
              topTraitLabel={topTraitLabel}
              topTraitScore={topTraitScore}
              primaryStream={primaryStream}
              weeklyPaceHours={weeklyPaceHours}
            />
          </div>

          {/* 2. Side-by-Side: Academic Stream Suitability & Career Alignment Reasoning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreamSuitabilitySection
              rankedStreams={rankedStreams}
              primaryRecommendation={primaryStream}
            />
            <WhyFitSection reasoning={whyFitReasoning} />
          </div>

          {/* 3. Work & Learning Style Profile */}
          <WorkLearningStyleSection style={workLearningStyle} />

          {/* 4. Complete Grouped Career Matches (Primary + Exploration Tiers) */}
          <GroupedCareerMatchesSection
            strongMatches={strongMatches}
            explorationMatches={explorationMatches}
            allMatches={allVisibleMatches}
          />

          {/* 5. Roadmap Momentum */}
          <RoadmapMomentumSection
            career={career}
            overallPercent={overallPercent}
            completedPhases={completedPhases}
            totalPhases={totalPhases}
            masteredSkills={masteredSkills}
            totalSkills={totalSkills}
            currentPhaseTitle={currentPhaseTitle}
            nextMilestone={nextMilestone}
            selectedSlug={selectedSlug}
          />

          {/* 6. Ecosystem Navigation Hub */}
          <div className="rounded-2xl border border-border/80 bg-[#0B0E12]/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Navigation &amp; Exploration Hub
              </p>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                Career Compass Ecosystem
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                {
                  href: "/dashboard",
                  icon: LayoutDashboard,
                  label: "My Roadmap Dashboard",
                  sub: "Full stage → skill → task journey",
                },
                {
                  href: "/results",
                  icon: ClipboardCheck,
                  label: "Assessment Results",
                  sub: "Detailed psychometric responses",
                },
                {
                  href: `/career/${selectedSlug}`,
                  icon: BookOpen,
                  label: "Career Guide",
                  sub: career?.title ?? "Full deep-dive",
                },
                {
                  href: "/coach",
                  icon: Sparkles,
                  label: "Career Coach AI",
                  sub: "Interactive path advisory",
                },
                {
                  href: "/resources",
                  icon: FolderArchive,
                  label: "Verified Learning Resources",
                  sub: "Authoritative study hubs & courses",
                },
                {
                  href: "/research",
                  icon: BarChart3,
                  label: "Research & Analytics",
                  sub: "Evaluation metrics & utilization",
                },
              ].map(({ href, icon: Icon, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-[#0E1217] hover:border-primary/40 hover:bg-[#141920] transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {label}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {sub}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
