import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TopTraitsSection } from "@/components/profile/TopTraitsSection";
import { TopCareerDirectionsSection } from "@/components/profile/TopCareerDirectionsSection";
import { NextStepCTA } from "@/components/profile/NextStepCTA";
import {
  deriveStudentPersona,
  deriveStreamSuitability,
  deriveWhyFitReasoning,
  deriveWorkLearningStyle,
} from "@/lib/profile/profile-utils";
import type { CareerMatch, TraitProfile } from "@/lib/types/assessment";

describe("Redesigned Minimal Student Profile (4 Core Elements Architecture)", () => {
  const mockUser = {
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
  };

  const mockTraits: TraitProfile = {
    TE: 94,
    AN: 89,
    CR: 78,
    SC: 65,
    BU: 52,
    LE: 45,
    EX: 40,
    SO: 35,
  };

  const mockPersona = deriveStudentPersona(mockTraits, "Software Development");

  const mockMatches: CareerMatch[] = [
    {
      career_name: "Software / App Development",
      match_percentage: 96,
      top_traits: ["Technical", "Analytical"],
      explanation: "Direct synergy with algorithmic architecture and digital product creation.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "AI / Machine Learning / Data Science",
      match_percentage: 91,
      top_traits: ["Analytical", "Technical"],
      explanation: "High alignment with mathematical modeling and machine intelligence systems.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Product & Technology Management",
      match_percentage: 84,
      top_traits: ["Technical", "Creative"],
      explanation: "Cross-functional bridge combining architectural vision and user empathy.",
      skill_gaps: [],
      next_steps: [],
    },
    {
      career_name: "Cybersecurity & Information Defense",
      match_percentage: 79,
      top_traits: ["Technical", "Analytical"],
      explanation: "Systematic threat modeling and security posture analysis.",
      skill_gaps: [],
      next_steps: [],
    },
  ];

  describe("A. Your Career Snapshot", () => {
    it("renders concise personalized 1-sentence/2-3 line summary without competing action buttons in minimal mode", () => {
      const html = renderToStaticMarkup(
        <ProfileHeader
          user={mockUser}
          persona={mockPersona}
          minimal={true}
        />
      );

      // Student identity & archetype
      expect(html).toContain("Ananya Deshmukh");
      expect(html).toContain("ananya.d@example.com");
      expect(html).toContain("Career Snapshot");
      expect(html).toContain("Archetype:");
      expect(html).toContain(mockPersona.archetype);

      // Personalized executive summary reflects actual assessment results
      expect(html).toContain(mockPersona.executiveSummary);
      expect(mockPersona.executiveSummary.length).toBeLessThan(350);

      // Minimal mode omits the row of 3 competing dashboard buttons
      expect(html).not.toContain("My Roadmap");
      expect(html).not.toContain("Career Guide");
    });
  });

  describe("B. Your Top Strengths", () => {
    it("displays strictly the three strongest traits with icon, trait name, and strength label", () => {
      const html = renderToStaticMarkup(
        <TopTraitsSection
          topStrengths={mockPersona.topStrengths}
          allTraits={mockPersona.allTraits}
          limit={3}
          minimal={true}
        />
      );

      // Header
      expect(html).toContain("Your Top Strengths");

      // Exactly the top 3 traits
      expect(html).toContain("Technical Aptitude");
      expect(html).toContain("Analytical Thinking");
      expect(html).toContain("Creative Expression");

      // 4th and lower traits must not be rendered in default minimal view
      expect(html).not.toContain("Scientific Curiosity");
      expect(html).not.toContain("Business &amp; Strategy");

      // Each top trait includes score and strength tier badge
      expect(html).toContain("94%");
      expect(html).toContain("89%");
      expect(html).toContain("78%");
      expect(html).toContain("Dominant Strength");

      // Secondary disclosure action is available
      expect(html).toContain("View All 8 Dimensions");
    });
  });

  describe("C. Careers to Explore", () => {
    it("displays strictly the three most relevant career paths with icon, name, brief reason, and Explore All action", () => {
      const html = renderToStaticMarkup(
        <TopCareerDirectionsSection
          matches={mockMatches}
          limit={3}
          minimal={true}
          exploreAllHref="/careers"
        />
      );

      // Header
      expect(html).toContain("Careers to Explore");
      expect(html).toContain("The 3 most relevant career paths");

      // Exactly 3 career recommendations
      expect(html).toContain("Software Development");
      expect(html).toContain("Artificial Intelligence &amp; Data");
      expect(html).toContain("Product &amp; Technology Management");

      // 4th career is excluded
      expect(html).not.toContain("Cybersecurity &amp; Defense");

      // Brief relevance reasons
      expect(html).toContain("Direct synergy with algorithmic architecture");
      expect(html).toContain("High alignment with mathematical modeling");

      // Match percentages
      expect(html).toContain("96% Match");
      expect(html).toContain("91% Match");

      // ONE clear action: Explore All Careers
      expect(html).toContain("Explore All Careers");
      expect(html).toContain('href="/careers"');
    });

    it("handles fewer than 3 matches gracefully without fabricating fake data", () => {
      const singleMatch = [mockMatches[0]];
      const html = renderToStaticMarkup(
        <TopCareerDirectionsSection
          matches={singleMatch}
          limit={3}
          minimal={true}
        />
      );

      expect(html).toContain("Software Development");
      expect(html).not.toContain("Artificial Intelligence &amp; Data");
      expect(html).toContain("Showing top 1 recommended careers");
    });
  });

  describe("D. One Clear Next Action", () => {
    it("displays single primary call to action without competing secondary buttons in minimal mode", () => {
      const html = renderToStaticMarkup(
        <NextStepCTA
          exploreMatchesHref="/results"
          minimal={true}
        />
      );

      expect(html).toContain("Ready to Explore Your Career Matches?");
      expect(html).toContain("Explore Your Career Matches");
      expect(html).toContain('href="/results"');

      // Competing secondary button is removed in minimal mode
      expect(html).not.toContain("Continue Roadmap");
    });
  });
});
