import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TopTraitsSection } from "@/components/profile/TopTraitsSection";
import { TopCareerDirectionsSection } from "@/components/profile/TopCareerDirectionsSection";
import { NextStepCTA } from "@/components/profile/NextStepCTA";
import { ProgressiveInsightsDisclosure } from "@/components/profile/ProgressiveInsightsDisclosure";
import {
  deriveStudentPersona,
  deriveStreamSuitability,
  deriveWhyFitReasoning,
  deriveWorkLearningStyle,
} from "@/lib/profile/profile-utils";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import type { CareerMatch, TraitProfile } from "@/lib/types/assessment";

describe("Profile Page Minimal-First & Progressive Disclosure Architecture", () => {
  const mockUser = {
    name: "Rohan Patel",
    email: "rohan.patel@example.com",
  };

  const mockTraits: TraitProfile = {
    TE: 92,
    AN: 88,
    SC: 74,
    CR: 62,
    BU: 50,
    LE: 48,
    EX: 45,
    SO: 40,
  };

  const mockPersona = deriveStudentPersona(mockTraits, "Software Development");
  const mockStreamSuitability = deriveStreamSuitability(null, mockTraits);
  const mockWhyFit = deriveWhyFitReasoning(mockTraits, "Software Development");
  const mockWorkStyle = deriveWorkLearningStyle(mockTraits);
  const mockHierarchy = getCareerHierarchy("software-development");
  const mockCareer = getCareerIntelligence("software-development");

  const mockMatches: CareerMatch[] = [
    {
      career_name: "Software / App Development",
      match_percentage: 95,
      top_traits: ["Technical", "Analytical"],
      explanation: "Direct cognitive synergy with algorithmic architecture and systems design.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "AI / Machine Learning / Data Science",
      match_percentage: 90,
      top_traits: ["Analytical", "Scientific"],
      explanation: "Empirical hypothesis testing and probabilistic modeling synergy.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Product & Technology Management",
      match_percentage: 82,
      top_traits: ["Technical", "Business"],
      explanation: "Cross-functional bridge translating user requirements into technical builds.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Cybersecurity & Information Defense",
      match_percentage: 78,
      top_traits: ["Technical", "Analytical"],
      explanation: "Threat modeling and systematic defense verification.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Hardware & Embedded Systems",
      match_percentage: 65,
      top_traits: ["Technical"],
      explanation: "Physical-layer microcontroller and logic circuit design.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Civil Services & Public Administration",
      match_percentage: 42,
      top_traits: ["Social"],
      explanation: "Alternative trajectory requiring broader humanities and policy orientation.",
      skill_gaps: [],
      next_steps: [],
    },
  ];

  describe("1. Career Snapshot (Who am I?)", () => {
    it("renders identity, archetype, and explicit concise Career Snapshot summary (max 2-3 lines)", () => {
      const html = renderToStaticMarkup(
        <ProfileHeader
          user={mockUser}
          persona={mockPersona}
          displayHierarchy={mockHierarchy}
          topMatchScore={95}
          selectedSlug="software-development"
          careerTitle="Software Development"
        />
      );

      expect(html).toContain("Rohan Patel");
      expect(html).toContain("rohan.patel@example.com");
      expect(html).toContain("Career Snapshot");
      expect(html).toContain("Archetype:");
      expect(html).toContain(mockPersona.archetype);
      // Executive summary provides personalized 2-3 line narrative
      expect(html).toContain(mockPersona.executiveSummary);
      expect(mockPersona.executiveSummary.length).toBeLessThan(350);
    });
  });

  describe("2. Top Strengths (What am I strongest at?)", () => {
    it("shows strictly the top 3 strongest traits by default with short interpretations", () => {
      const html = renderToStaticMarkup(
        <TopTraitsSection
          topStrengths={mockPersona.topStrengths}
          allTraits={mockPersona.allTraits}
          limit={3}
        />
      );

      // Top 3 should be visible
      expect(html).toContain("Technical Aptitude");
      expect(html).toContain("Analytical Thinking");
      expect(html).toContain("Scientific Curiosity");

      // 4th trait (Creative Expression, CR: 62) must NOT be shown by default
      expect(html).not.toContain("Creative Expression");
      expect(html).not.toContain("Business &amp; Strategy");

      // Displays short interpretation (keyCapability) for each top trait
      expect(html).toContain("Translates abstract ideas into working technical architectures");
      expect(html).toContain("Deconstructs complex multi-variable problems");
      expect(html).toContain("Applies evidence-driven investigation");

      // Allows progressive disclosure to view all 8 dimensions
      expect(html).toContain("View All 8 Dimensions");
    });
  });

  describe("3. Top Career Directions (What career directions should I explore?)", () => {
    it("shows only 3–5 strongest career pathways and avoids dumping nested specializations or micro-roles", () => {
      const html = renderToStaticMarkup(
        <TopCareerDirectionsSection
          matches={mockMatches}
          limit={4}
        />
      );

      // Expect section title and top recommendations badge
      expect(html).toContain("Top Career Directions");
      expect(html).toContain("Top Recommendations");

      // Top pathways displayed with canonical titles
      expect(html).toContain("Software Development");
      expect(html).toContain("Artificial Intelligence &amp; Data");
      expect(html).toContain("Product &amp; Technology Management");
      expect(html).toContain("Cybersecurity &amp; Defense");

      // 5th and 6th lower-tier/alternative pathways should be omitted from default 4-item view
      expect(html).not.toContain("Hardware &amp; Embedded Systems");
      expect(html).not.toContain("Civil Services &amp; Public Administration");

      // Verifies no micro-role dump or deep specialization lists on default view
      expect(html).not.toContain("Specializations:");
      expect(html).not.toContain("Sub-disciplines");

      // Each item contains match score and direct explore link
      expect(html).toContain("95% Match");
      expect(html).toContain("Explore Pathway");
    });
  });

  describe("4. Next Step CTA", () => {
    it("renders prominent 'Explore Your Career Matches' primary action and roadmap secondary link", () => {
      const html = renderToStaticMarkup(
        <NextStepCTA
          exploreMatchesHref="/results"
          roadmapHref="/dashboard"
          activeCareerTitle="Software Development"
        />
      );

      expect(html).toContain("Recommended Next Step");
      expect(html).toContain("Explore Your Career Matches");
      expect(html).toContain("Continue Roadmap (Software Development)");
    });
  });

  describe("5. Progressive Disclosure of In-Depth Intelligence", () => {
    it("keeps detailed sections encapsulated and ready for on-demand disclosure", () => {
      const closedHtml = renderToStaticMarkup(
        <ProgressiveInsightsDisclosure
          isOpen={false}
          onToggle={() => {}}
          overallPercent={30}
          topCareerName="Software Development"
          topCareerScore={95}
          topTraitLabel="Technical Aptitude"
          topTraitScore={92}
          primaryStream="Science (PCM / PCB)"
          weeklyPaceHours={10}
          rankedStreams={mockStreamSuitability.rankedStreams}
          whyFitReasoning={mockWhyFit}
          workLearningStyle={mockWorkStyle}
          strongMatches={mockMatches.slice(0, 3)}
          explorationMatches={mockMatches.slice(3)}
          allVisibleMatches={mockMatches}
          career={mockCareer}
          completedPhases={1}
          totalPhases={5}
          masteredSkills={3}
          totalSkills={25}
          nextMilestone="Master Node.js"
          selectedSlug="software-development"
        />
      );

      // In closed state: shows progressive disclosure banner but hides heavy nested cards
      expect(closedHtml).toContain("In-Depth Assessment Intelligence &amp; Analysis");
      expect(closedHtml).toContain("Explore Detailed Intelligence");
      expect(closedHtml).not.toContain("Key Performance &amp; Alignment Metrics");
      expect(closedHtml).not.toContain("Optimal Environment");

      // In opened state: reveals stream suitability, work style, why-fit, and full career matches
      const openHtml = renderToStaticMarkup(
        <ProgressiveInsightsDisclosure
          isOpen={true}
          onToggle={() => {}}
          overallPercent={30}
          topCareerName="Software Development"
          topCareerScore={95}
          topTraitLabel="Technical Aptitude"
          topTraitScore={92}
          primaryStream="Science (PCM / PCB)"
          weeklyPaceHours={10}
          rankedStreams={mockStreamSuitability.rankedStreams}
          whyFitReasoning={mockWhyFit}
          workLearningStyle={mockWorkStyle}
          strongMatches={mockMatches.slice(0, 3)}
          explorationMatches={mockMatches.slice(3)}
          allVisibleMatches={mockMatches}
          career={mockCareer}
          completedPhases={1}
          totalPhases={5}
          masteredSkills={3}
          totalSkills={25}
          nextMilestone="Master Node.js"
          selectedSlug="software-development"
        />
      );

      expect(openHtml).toContain("Key Performance &amp; Alignment Metrics");
      expect(openHtml).toContain("Academic Stream Suitability");
      expect(openHtml).toContain("Science (PCM / PCB)");
      expect(openHtml).toContain("Why These Careers Fit You");
      expect(openHtml).toContain("Work &amp; Learning Style Profile");
      expect(openHtml).toContain("Optimal Environment");
      expect(openHtml).toContain("Career Trajectories Grouped by Relevance");
      expect(openHtml).toContain("Active Career Track");
      expect(openHtml).toContain("Navigation &amp; Exploration Hub");
    });
  });
});
