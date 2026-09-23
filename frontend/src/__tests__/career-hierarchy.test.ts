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
  filterQualifiedMatches,
  sortCareerMatches,
  getRecommendedCareers,
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
});
