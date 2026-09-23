import { describe, it, expect } from "vitest";
import {
  CAREER_DOMAINS,
  getAllCareerDomains,
  getAllCareerPaths,
  getCareerHierarchy,
  getHierarchyBreadcrumbs,
} from "@/lib/career-hierarchy";
import {
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
  MAX_VISIBLE_CAREER_MATCHES,
  filterQualifiedMatches,
  sortCareerMatches,
  getRecommendedCareers,
  getTieredCareerMatches,
} from "@/lib/constants/matching";
import type { CareerMatch } from "@/lib/types/assessment";

describe("Career Hierarchy Taxonomy", () => {
  it("defines exactly 6 top-level career domains", () => {
    const domains = getAllCareerDomains();
    expect(domains.length).toBe(6);
    expect(domains.map((d) => d.id)).toEqual([
      "engineering-technology",
      "data-ai",
      "design-creative",
      "business-finance-management",
      "healthcare-sciences",
      "media-communications-social",
    ]);
  });

  it("contains all 12 canonical career paths across domains", () => {
    const paths = getAllCareerPaths();
    expect(paths.length).toBe(12);

    const expectedSlugs = [
      "software-development",
      "engineering",
      "ai-ml-data-science",
      "design-creative",
      "finance-investment",
      "management-product",
      "entrepreneurship",
      "medicine-healthcare",
      "scientific-research",
      "marketing-media",
      "law-policy",
      "psychology-social",
    ];

    const actualSlugs = paths.map((p) => p.slug);
    expect(actualSlugs).toEqual(expectedSlugs);
  });

  it("contains exactly 36 specializations (3 per path)", () => {
    const paths = getAllCareerPaths();
    const allSpecs = paths.flatMap((p) => p.specializations);
    expect(allSpecs.length).toBe(36);

    for (const p of paths) {
      expect(p.specializations.length).toBe(3);
    }
  });

  it("contains exactly 108 roles across specializations (3 per specialization)", () => {
    const paths = getAllCareerPaths();
    const allRoles = paths.flatMap((p) =>
      p.specializations.flatMap((s) => s.roles)
    );
    expect(allRoles.length).toBe(108);

    for (const p of paths) {
      for (const s of p.specializations) {
        expect(s.roles.length).toBe(3);
      }
    }
  });

  it("resolves hierarchy for all 12 career slugs", () => {
    const expectedSlugs = [
      "software-development",
      "engineering",
      "ai-ml-data-science",
      "design-creative",
      "finance-investment",
      "management-product",
      "entrepreneurship",
      "medicine-healthcare",
      "scientific-research",
      "marketing-media",
      "law-policy",
      "psychology-social",
    ];

    for (const slug of expectedSlugs) {
      const hierarchy = getCareerHierarchy(slug);
      expect(hierarchy).toBeDefined();
      expect(hierarchy?.domain).toBeDefined();
      expect(hierarchy?.path.slug).toBe(slug);
      expect(hierarchy?.breadcrumbs.length).toBeGreaterThanOrEqual(2);
      expect(hierarchy?.breadcrumbs.every((b) => b.trim().length > 0)).toBe(true);
    }
  });

  it("generates 4-level breadcrumbs for software development", () => {
    const breadcrumbs = getHierarchyBreadcrumbs("software-development");
    expect(breadcrumbs).toEqual([
      "Engineering & Technology",
      "Software Development",
      "Web & Application Engineering",
      "Frontend Developer",
    ]);
  });
});

describe("Meaningful Match Threshold & Scoring Rules", () => {
  it("enforces central threshold constant of 40%", () => {
    expect(CAREER_MATCH_THRESHOLD).toBe(40);
  });

  it("strictly filters career matches using 40% threshold without manipulating scores", () => {
    const testMatches: CareerMatch[] = [
      {
        career_name: "Software / App Development",
        match_percentage: 87.4,
        top_traits: ["TE", "AN"],
        explanation: "Strong alignment",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "AI / Machine Learning / Data Science",
        match_percentage: 72.0,
        top_traits: ["TE", "SC"],
        explanation: "Good alignment",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Engineering",
        match_percentage: 54.0,
        top_traits: ["AN", "TE"],
        explanation: "Moderate alignment",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "UI/UX & Digital Product Design",
        match_percentage: 40.0, // boundary: exactly 40%
        top_traits: ["CR"],
        explanation: "Passes threshold",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Finance & FinTech",
        match_percentage: 39.9, // boundary: just below 40%
        top_traits: ["BU"],
        explanation: "Below threshold",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Law & Governance",
        match_percentage: 23.0,
        top_traits: ["AN"],
        explanation: "Weak alignment",
        skill_gaps: [],
        next_steps: [],
      },
    ];

    const qualified = filterQualifiedMatches(testMatches, CAREER_MATCH_THRESHOLD);

    // Only matches >= 40% qualify
    expect(qualified.length).toBe(4);
    expect(qualified.map((c) => c.match_percentage)).toEqual([87.4, 72.0, 54.0, 40.0]);

    // Scores remain mathematically honest (no artificial inflation)
    expect(qualified[0].match_percentage).toBe(87.4);
    expect(qualified[3].match_percentage).toBe(40.0);

    // Verify 39.9% and 23% were hidden
    const hidden = testMatches.filter(
      (c) => !qualified.some((q) => q.career_name === c.career_name)
    );
    expect(hidden.length).toBe(2);
    expect(hidden.map((c) => c.match_percentage)).toEqual([39.9, 23.0]);
  });

  it("preserves descending score sorting among qualified careers", () => {
    const unsortedMatches: CareerMatch[] = [
      {
        career_name: "UI/UX",
        match_percentage: 45.0,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Software",
        match_percentage: 91.5,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Data Science",
        match_percentage: 63.2,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Low Score",
        match_percentage: 28.0,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
    ];

    const recommended = getRecommendedCareers(unsortedMatches);
    expect(recommended.length).toBe(3);
    expect(recommended.map((r) => r.match_percentage)).toEqual([91.5, 63.2, 45.0]);
  });

  it("returns an empty array when zero careers pass the threshold without lowering it", () => {
    const allWeakMatches: CareerMatch[] = [
      {
        career_name: "Career A",
        match_percentage: 35.0,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
      {
        career_name: "Career B",
        match_percentage: 22.4,
        top_traits: [],
        explanation: "",
        skill_gaps: [],
        next_steps: [],
      },
    ];

    const qualified = getRecommendedCareers(allWeakMatches, CAREER_MATCH_THRESHOLD);
    expect(qualified).toEqual([]);
    expect(qualified.length).toBe(0);
  });

  describe("Two-Tier Career Match Presentation System", () => {
    const makeMatch = (name: string, percentage: number): CareerMatch => ({
      career_name: name,
      match_percentage: percentage,
      top_traits: ["TE"],
      explanation: `Test match for ${name}`,
      skill_gaps: [],
      next_steps: [],
    });

    it("presents 87% / 72% / 54% as 3 Strong Matches (0 Worth Exploring)", () => {
      const matches: CareerMatch[] = [
        makeMatch("Software", 87.0),
        makeMatch("Data Science", 72.0),
        makeMatch("Engineering", 54.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches.length).toBe(3);
      expect(tiered.strongMatches.map((m) => m.match_percentage)).toEqual([87.0, 72.0, 54.0]);
      expect(tiered.explorationMatches.length).toBe(0);
      expect(tiered.allVisibleMatches.length).toBe(3);
      expect(tiered.allVisibleMatches.map((m) => m.match_percentage)).toEqual([87.0, 72.0, 54.0]);
    });

    it("presents 72% / 54% / 36% / 23% as 2 Strong + 1 Worth Exploring, with 23% hidden", () => {
      const matches: CareerMatch[] = [
        makeMatch("Software", 72.0),
        makeMatch("Data Science", 54.0),
        makeMatch("Design", 36.0),
        makeMatch("Finance", 23.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      // 2 Strong Matches (>= 40%)
      expect(tiered.strongMatches.length).toBe(2);
      expect(tiered.strongMatches.map((m) => m.match_percentage)).toEqual([72.0, 54.0]);

      // 1 Worth Exploring (>= 25% and < 40%, capped at 3 total visible)
      expect(tiered.explorationMatches.length).toBe(1);
      expect(tiered.explorationMatches[0].match_percentage).toBe(36.0);

      // 23% is strictly hidden (< 25%)
      expect(tiered.allVisibleMatches.length).toBe(3);
      expect(tiered.allVisibleMatches.map((m) => m.match_percentage)).toEqual([72.0, 54.0, 36.0]);
      expect(tiered.allVisibleMatches.some((m) => m.match_percentage === 23.0)).toBe(false);
    });

    it("presents 54% / 36% / 31% / 15% as 1 Strong + 2 Worth Exploring, with 15% hidden", () => {
      const matches: CareerMatch[] = [
        makeMatch("Software", 54.0),
        makeMatch("Design", 36.0),
        makeMatch("Marketing", 31.0),
        makeMatch("Healthcare", 15.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      // 1 Strong Match (>= 40%)
      expect(tiered.strongMatches.length).toBe(1);
      expect(tiered.strongMatches[0].match_percentage).toBe(54.0);

      // 2 Worth Exploring (>= 25% and < 40%)
      expect(tiered.explorationMatches.length).toBe(2);
      expect(tiered.explorationMatches.map((m) => m.match_percentage)).toEqual([36.0, 31.0]);

      // 15% is hidden (< 25%)
      expect(tiered.allVisibleMatches.length).toBe(3);
      expect(tiered.allVisibleMatches.map((m) => m.match_percentage)).toEqual([54.0, 36.0, 31.0]);
      expect(tiered.allVisibleMatches.some((m) => m.match_percentage === 15.0)).toBe(false);
    });

    it("caps maximum visible career paths at 3 even if more strong matches exist", () => {
      const matches: CareerMatch[] = [
        makeMatch("Career A", 92.0),
        makeMatch("Career B", 84.0),
        makeMatch("Career C", 75.0),
        makeMatch("Career D", 62.0),
        makeMatch("Career E", 45.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches.length).toBe(3);
      expect(tiered.strongMatches.map((m) => m.match_percentage)).toEqual([92.0, 84.0, 75.0]);
      expect(tiered.explorationMatches.length).toBe(0);
      expect(tiered.allVisibleMatches.length).toBe(3);
    });

    it("shows only qualifying exploration careers if only 1 or 2 careers are >= 25%", () => {
      const matches: CareerMatch[] = [
        makeMatch("Career A", 36.0),
        makeMatch("Career B", 31.0),
        makeMatch("Career C", 18.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches.length).toBe(0);
      expect(tiered.explorationMatches.length).toBe(2);
      expect(tiered.explorationMatches.map((m) => m.match_percentage)).toEqual([36.0, 31.0]);
      expect(tiered.allVisibleMatches.length).toBe(2);
    });

    it("shows zero visible careers when zero careers are >= 25% (triggers empty state)", () => {
      const matches: CareerMatch[] = [
        makeMatch("Career A", 23.0),
        makeMatch("Career B", 15.0),
        makeMatch("Career C", 12.0),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches.length).toBe(0);
      expect(tiered.explorationMatches.length).toBe(0);
      expect(tiered.allVisibleMatches.length).toBe(0);
    });

    it("strictly preserves original calculated scores without alteration or inflation", () => {
      const matches: CareerMatch[] = [
        makeMatch("Software", 73.456),
        makeMatch("Design", 38.123),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches[0].match_percentage).toBe(73.456);
      expect(tiered.explorationMatches[0].match_percentage).toBe(38.123);
      expect(tiered.allVisibleMatches[0].match_percentage).toBe(73.456);
      expect(tiered.allVisibleMatches[1].match_percentage).toBe(38.123);
    });

    it("correctly handles exact boundary values (40.0% and 25.0%)", () => {
      const matches: CareerMatch[] = [
        makeMatch("Borderline Strong", 40.0),
        makeMatch("Borderline Exploration", 25.0),
        makeMatch("Just Below Exploration", 24.9),
      ];

      const tiered = getTieredCareerMatches(matches);

      expect(tiered.strongMatches.length).toBe(1);
      expect(tiered.strongMatches[0].career_name).toBe("Borderline Strong");

      expect(tiered.explorationMatches.length).toBe(1);
      expect(tiered.explorationMatches[0].career_name).toBe("Borderline Exploration");

      expect(tiered.allVisibleMatches.length).toBe(2);
      expect(tiered.allVisibleMatches.some((m) => m.career_name === "Just Below Exploration")).toBe(false);
    });
  });
});

