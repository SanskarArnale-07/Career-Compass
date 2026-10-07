import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMetricsRow } from "@/components/profile/ProfileMetricsRow";
import { TopTraitsSection } from "@/components/profile/TopTraitsSection";
import { StreamSuitabilitySection } from "@/components/profile/StreamSuitabilitySection";
import { WhyFitSection } from "@/components/profile/WhyFitSection";
import { GroupedCareerMatchesSection } from "@/components/profile/GroupedCareerMatchesSection";
import { RoadmapMomentumSection } from "@/components/profile/RoadmapMomentumSection";
import {
  deriveStudentPersona,
  deriveStreamSuitability,
  deriveWhyFitReasoning,
} from "@/lib/profile/profile-utils";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import type { CareerMatch, TraitProfile } from "@/lib/types/assessment";

describe("Career Compass Profile Page Component Tests", () => {
  const mockUser = {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
  };

  const mockTraits: TraitProfile = {
    TE: 88,
    AN: 84,
    SC: 70,
    BU: 45,
    CR: 52,
    SO: 40,
    LE: 55,
    EX: 60,
  };

  const mockPersona = deriveStudentPersona(mockTraits, "Software Development");
  const mockStreamSuitability = deriveStreamSuitability(null, mockTraits);
  const mockWhyFit = deriveWhyFitReasoning(mockTraits, "Software Development");
  const mockHierarchy = getCareerHierarchy("software-development");
  const mockCareer = getCareerIntelligence("software-development");

  const mockMatches: CareerMatch[] = [
    {
      career_name: "Software / App Development",
      match_percentage: 92,
      top_traits: ["Technical", "Analytical"],
      explanation: "Excellent fit for technical and analytical systems.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "AI / Machine Learning / Data Science",
      match_percentage: 86,
      top_traits: ["Analytical", "Scientific"],
      explanation: "High alignment with statistical modeling.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Engineering",
      match_percentage: 54,
      top_traits: ["Technical"],
      explanation: "Exploration path for physical and electrical engineering.",
      skill_gaps: [],
      next_steps: [],
    },
  ];

  it("renders ProfileHeader with student identity, persona archetype, executive summary, and action links", () => {
    const html = renderToStaticMarkup(
      <ProfileHeader
        user={mockUser}
        persona={mockPersona}
        displayHierarchy={mockHierarchy}
        topMatchScore={92}
        startedAt={1700000000000}
        selectedSlug="software-development"
        careerTitle="Software Development"
      />
    );

    expect(html).toContain("Aarav Sharma");
    expect(html).toContain("aarav.sharma@example.com");
    expect(html).toContain("Verified Profile");
    expect(html).toContain("Archetype:");
    expect(html).toContain(mockPersona.archetype);
    expect(html).toContain("Software Development");
    expect(html).toContain("92% Match");
    expect(html).toContain("My Roadmap");
    expect(html).toContain("Results");
  });

  it("renders ProfileMetricsRow with all five key summary metrics", () => {
    const html = renderToStaticMarkup(
      <ProfileMetricsRow
        roadmapPercent={25}
        topCareerName="Software Development"
        topCareerScore={92}
        topTraitLabel="Technical Aptitude"
        topTraitScore={88}
        primaryStream="Science (PCM / PCB)"
        weeklyPaceHours={10}
      />
    );

    expect(html).toContain("Roadmap Progress");
    expect(html).toContain("25%");
    expect(html).toContain("Top Career Fit");
    expect(html).toContain("92%");
    expect(html).toContain("Core Aptitude");
    expect(html).toContain("88%");
    expect(html).toContain("Science");
    expect(html).toContain("10h");
  });

  it("renders TopTraitsSection with top strengths, scores, and capability explanations", () => {
    const html = renderToStaticMarkup(
      <TopTraitsSection
        topStrengths={mockPersona.topStrengths}
        allTraits={mockPersona.allTraits}
      />
    );

    expect(html).toContain("Strongest Traits &amp; Cognitive Fingerprint");
    expect(html).toContain("Technical Aptitude");
    expect(html).toContain("Analytical Thinking");
    expect(html).toContain("88%");
    expect(html).toContain("84%");
    expect(html).toContain("Dominant Strength");
  });

  it("renders StreamSuitabilitySection with ranked academic streams and foundation guidance", () => {
    const html = renderToStaticMarkup(
      <StreamSuitabilitySection
        rankedStreams={mockStreamSuitability.rankedStreams}
        primaryRecommendation={mockStreamSuitability.primaryRecommendation}
      />
    );

    expect(html).toContain("Academic Stream Suitability");
    expect(html).toContain("Science (PCM / PCB)");
    expect(html).toContain("Primary Academic Fit");
    expect(html).toContain("Commerce &amp; Economics");
    expect(html).toContain("Arts &amp; Humanities");
  });

  it("renders WhyFitSection with personalized narrative and 3 value pillars", () => {
    const html = renderToStaticMarkup(
      <WhyFitSection reasoning={mockWhyFit} />
    );

    expect(html).toContain("Why These Careers Fit You");
    expect(html).toContain("Systematic Problem Solving");
    expect(html).toContain("High Learning Velocity");
    expect(html).toContain("Transferable Career Core");
  });

  it("renders GroupedCareerMatchesSection with relevance tiers and links", () => {
    const strong = [mockMatches[0], mockMatches[1]];
    const exploration = [mockMatches[2]];

    const html = renderToStaticMarkup(
      <GroupedCareerMatchesSection
        strongMatches={strong}
        explorationMatches={exploration}
        allMatches={mockMatches}
      />
    );

    expect(html).toContain("Career Trajectories Grouped by Relevance");
    expect(html).toContain("Primary &amp; High-Fit Pathways");
    expect(html).toContain("Software Development");
    expect(html).toContain("Adjacent &amp; Growth Directions");
    expect(html).toContain("Engineering");
    expect(html).toContain("View Guide");
  });

  it("renders RoadmapMomentumSection with active career, stage, milestone, and CTA", () => {
    const html = renderToStaticMarkup(
      <RoadmapMomentumSection
        career={mockCareer}
        overallPercent={25}
        completedPhases={1}
        totalPhases={5}
        masteredSkills={4}
        totalSkills={28}
        currentPhaseTitle="Stage 2: Modern Web & System Design"
        nextMilestone="Master Relational Databases & SQL"
        selectedSlug="software-development"
      />
    );

    expect(html).toContain("Active Career Track");
    expect(html).toContain("Software Development");
    expect(html).toContain("25%");
    expect(html).toContain("1 / 5 stages completed");
    expect(html).toContain("Stage 2: Modern Web &amp; System Design");
    expect(html).toContain("Master Relational Databases &amp; SQL");
    expect(html).toContain("Continue Roadmap");
  });
});
