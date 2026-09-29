import { describe, it, expect } from "vitest";
import { getCareerHierarchy, getAllCareerPaths } from "@/lib/career-hierarchy";
import {
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
  isStrongMatch,
  isExplorationMatch,
  getMatchTier,
  getMatchTierLabel,
  getTieredCareerMatches,
} from "@/lib/constants/matching";
import type { CareerMatch } from "@/lib/types/assessment";

describe("Career Results Hierarchy, Calibration & Layout Validation", () => {
  // ── 1. TEST 3+ DIFFERENT SELECTED CAREER PATHS ──────────────────────────────
  describe("Selected Career -> Career Areas -> Roles Hierarchy", () => {
    const testCareers = [
      {
        input: "Marketing / Media / Communications",
        expectedSlug: "marketing-media",
        expectedSpecializations: [
          "Growth & Performance Marketing",
          "Brand Communications & Public Relations",
          "Digital Media & Content Production",
        ],
      },
      {
        input: "Law / Public Policy",
        expectedSlug: "law-policy",
        expectedSpecializations: [
          "Corporate & Commercial Law",
          "Public Policy & Legislative Governance",
          "Litigation & Dispute Resolution",
        ],
      },
      {
        input: "Design / Creative Arts",
        expectedSlug: "design-creative",
        expectedSpecializations: [
          "Product Experience & UX Research",
          "Design Systems & UI Engineering",
          "Accessibility, Usability & Service Design",
        ],
      },
      {
        input: "Psychology / Social Impact",
        expectedSlug: "psychology-social",
        expectedSpecializations: [
          "Counseling & Mental Health",
          "Organizational & Behavioral Psychology",
          "Social Impact & Community Development",
        ],
      },
    ];

    for (const { input, expectedSlug, expectedSpecializations } of testCareers) {
      it(`resolves "${input}" to correct path and specializations`, () => {
        const hierarchy = getCareerHierarchy(input);
        expect(hierarchy).toBeDefined();
        expect(hierarchy?.path.slug).toBe(expectedSlug);

        // Verify every career area (specialization) belongs to the selected career path
        const specNames = hierarchy?.path.specializations.map((s) => s.name) ?? [];
        for (const expectedSpec of expectedSpecializations) {
          expect(specNames).toContain(expectedSpec);
        }

        // Verify specialization -> role relationships
        for (const spec of hierarchy?.path.specializations ?? []) {
          expect(spec.roles.length).toBeGreaterThanOrEqual(2);
          for (const role of spec.roles) {
            expect(role.id).toBeDefined();
            expect(role.title).toBeDefined();
            expect(role.title.trim().length).toBeGreaterThan(0);
            expect(role.description).toBeDefined();
          }
        }
      });
    }

    it("verifies Marketing / Media / Communications NEVER leaks Law roles or specializations", () => {
      const mktHierarchy = getCareerHierarchy("Marketing / Media / Communications");
      expect(mktHierarchy).toBeDefined();
      expect(mktHierarchy?.path.slug).toBe("marketing-media");

      const specNames = mktHierarchy?.path.specializations.map((s) => s.name) ?? [];
      expect(specNames).not.toContain("Corporate & Commercial Law");
      expect(specNames).not.toContain("Public Policy, Governance & Regulatory Affairs");
      expect(specNames).not.toContain("Litigation, Advocacy & Human Rights");

      const allRoles = mktHierarchy?.path.specializations.flatMap((s) => s.roles.map((r) => r.title)) ?? [];
      expect(allRoles).not.toContain("Corporate Lawyer");
      expect(allRoles).not.toContain("Public Policy Analyst");
      expect(allRoles).toContain("Growth Marketing Specialist");
    });
  });

  // ── 2. SCORE INTERPRETATION BANDS & BOUNDARIES ──────────────────────────────
  describe("Score Interpretation Bands at 39, 40, 59, 60", () => {
    it("strictly verifies score bands at boundary values", () => {
      // 39% -> < 40%, hidden / not actively recommended
      expect(isStrongMatch(39)).toBe(false);
      expect(isExplorationMatch(39)).toBe(false);
      expect(getMatchTier(39)).toBe("hidden");
      expect(getMatchTierLabel(39)).toBe("");

      // 40% -> 40–59%, MAYBE EXPLORE
      expect(isStrongMatch(40)).toBe(false);
      expect(isExplorationMatch(40)).toBe(true);
      expect(getMatchTier(40)).toBe("maybe_explore");
      expect(getMatchTierLabel(40)).toBe("MAYBE EXPLORE");

      // 59% -> 40–59%, MAYBE EXPLORE
      expect(isStrongMatch(59)).toBe(false);
      expect(isExplorationMatch(59)).toBe(true);
      expect(getMatchTier(59)).toBe("maybe_explore");
      expect(getMatchTierLabel(59)).toBe("MAYBE EXPLORE");

      // 60% -> >= 60%, WORTH EXPLORING
      expect(isStrongMatch(60)).toBe(true);
      expect(isExplorationMatch(60)).toBe(false);
      expect(getMatchTier(60)).toBe("worth_exploring");
      expect(getMatchTierLabel(60)).toBe("WORTH EXPLORING");

      // Boundary around 39.9% and 40.0%
      expect(isStrongMatch(39.9)).toBe(false);
      expect(isExplorationMatch(39.9)).toBe(false);
      expect(getMatchTierLabel(39.9)).toBe("");

      expect(isStrongMatch(40.0)).toBe(false);
      expect(isExplorationMatch(40.0)).toBe(true);
      expect(getMatchTierLabel(40.0)).toBe("MAYBE EXPLORE");

      // Boundary around 59.9% and 60.0%
      expect(isStrongMatch(59.9)).toBe(false);
      expect(isExplorationMatch(59.9)).toBe(true);
      expect(getMatchTierLabel(59.9)).toBe("MAYBE EXPLORE");

      expect(isStrongMatch(60.0)).toBe(true);
      expect(getMatchTierLabel(60.0)).toBe("WORTH EXPLORING");
    });

    it("verifies getTieredCareerMatches partitions according to 60 / 40 bands and excludes < 40", () => {
      const mockMatches: CareerMatch[] = [
        {
          career_name: "Marketing / Media / Communications",
          match_percentage: 68.4,
          top_traits: ["CR", "BU"],
          explanation: "Strong fit",
          skill_gaps: [],
          next_steps: [],
        },
        {
          career_name: "Law / Public Policy",
          match_percentage: 54.0,
          top_traits: ["AN", "LE"],
          explanation: "Moderate fit",
          skill_gaps: [],
          next_steps: [],
        },
        {
          career_name: "Design / Creative Arts",
          match_percentage: 42.0,
          top_traits: ["CR"],
          explanation: "Exploratory fit",
          skill_gaps: [],
          next_steps: [],
        },
        {
          career_name: "Finance / Investment Banking",
          match_percentage: 38.0, // < 40, must be excluded!
          top_traits: ["AN", "BU"],
          explanation: "Low fit",
          skill_gaps: [],
          next_steps: [],
        },
      ];

      const tiered = getTieredCareerMatches(mockMatches);

      // Strong matches: >= 60%
      expect(tiered.strongMatches.length).toBe(1);
      expect(tiered.strongMatches[0].career_name).toBe("Marketing / Media / Communications");
      expect(tiered.strongMatches[0].match_percentage).toBe(68.4);

      // Exploration matches: 40–59%
      expect(tiered.explorationMatches.length).toBe(2);
      expect(tiered.explorationMatches.map((m) => m.career_name)).toEqual([
        "Law / Public Policy",
        "Design / Creative Arts",
      ]);

      // All visible matches: capped at 3, excludes < 40%
      expect(tiered.allVisibleMatches.length).toBe(3);
      expect(tiered.allVisibleMatches.some((m) => m.match_percentage < 40)).toBe(false);
      expect(tiered.allVisibleMatches.some((m) => m.career_name === "Finance / Investment Banking")).toBe(false);
    });
  });

  // ── 3. DYNAMIC CAREER COUNT ────────────────────────────────────────────────
  describe("Dynamic Career Count", () => {
    it("derives career count dynamically from canonical registry", () => {
      const paths = getAllCareerPaths();
      expect(paths.length).toBe(25);
    });
  });
});
