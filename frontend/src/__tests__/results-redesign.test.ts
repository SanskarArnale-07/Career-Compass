import { describe, it, expect } from "vitest";
import { getTieredCareerMatches, CAREER_MATCH_THRESHOLD, CAREER_EXPLORATION_THRESHOLD, MAX_VISIBLE_CAREER_MATCHES } from "@/lib/constants/matching";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { CareerMatches } from "@/components/results/CareerMatches";
import { ContributingTraitsVisual } from "@/components/results/ContributingTraitsVisual";
import { ProgressiveHierarchy } from "@/components/results/ProgressiveHierarchy";

describe("Results Page Redesign Specifications", () => {
  it("exports all redesigned results components properly", () => {
    expect(CareerMatches).toBeDefined();
    expect(ContributingTraitsVisual).toBeDefined();
    expect(ProgressiveHierarchy).toBeDefined();
  });

  it("strictly enforces matching tiers and thresholds: Strong (>=40%), Worth Exploring (25-39%)", () => {
    expect(CAREER_MATCH_THRESHOLD).toBe(40);
    expect(CAREER_EXPLORATION_THRESHOLD).toBe(25);
    expect(MAX_VISIBLE_CAREER_MATCHES).toBe(3);

    const mockCandidates = [
      { career_name: "Software / App Development", match_percentage: 85 },
      { career_name: "Data Science & AI", match_percentage: 60 },
      { career_name: "Design & Creative Strategy", match_percentage: 35 },
      { career_name: "Finance & Accounting", match_percentage: 20 }, // hidden
    ];

    const { strongMatches, explorationMatches, allVisibleMatches } = getTieredCareerMatches(mockCandidates);

    // Strong matches: >= 40%
    expect(strongMatches.length).toBe(2);
    expect(strongMatches.map((m) => m.career_name)).toEqual([
      "Software / App Development",
      "Data Science & AI",
    ]);

    // Exploration matches: 25-39%
    expect(explorationMatches.length).toBe(1);
    expect(explorationMatches[0].career_name).toBe("Design & Creative Strategy");

    // Hidden careers (< 25%) must never be visible
    expect(allVisibleMatches.some((m) => m.match_percentage < 25)).toBe(false);
    expect(allVisibleMatches.length).toBe(3);
  });

  it("caps visible career matches at a maximum of 3", () => {
    const mockCandidates = [
      { career_name: "Career A", match_percentage: 90 },
      { career_name: "Career B", match_percentage: 80 },
      { career_name: "Career C", match_percentage: 70 },
      { career_name: "Career D", match_percentage: 60 },
      { career_name: "Career E", match_percentage: 50 },
    ];

    const { strongMatches, explorationMatches, allVisibleMatches } = getTieredCareerMatches(mockCandidates);

    expect(strongMatches.length).toBe(3);
    expect(explorationMatches.length).toBe(0);
    expect(allVisibleMatches.length).toBe(3);
  });

  it("progressively structures hierarchy from Domain -> Path -> Specialization -> Role", () => {
    const hierarchy = getCareerHierarchy("Software / App Development");
    expect(hierarchy).toBeDefined();

    // 1. Domain
    expect(hierarchy?.domain.name).toBe("Engineering & Technology");

    // 2. Career Path
    expect(hierarchy?.path.name).toBe("Software Development");

    // 3. Specializations
    expect(hierarchy?.path.specializations.length).toBeGreaterThanOrEqual(1);
    const primarySpec = hierarchy?.path.specializations[0];
    expect(primarySpec?.name).toBe("Web & Application Engineering");

    // 4. Roles
    expect(primarySpec?.roles.length).toBeGreaterThanOrEqual(1);
    const roleTitles = primarySpec?.roles.map((r) => r.title);
    expect(roleTitles).toContain("Frontend Developer");
    expect(roleTitles).toContain("Backend Developer");
  });

  it("verifies canonical career paths under Engineering & Technology do not mix external domains like AI", () => {
    const hierarchy = getCareerHierarchy("Software / App Development");
    const domainPaths = hierarchy?.domain.paths ?? [];
    const pathNames = domainPaths.map((p) => p.name);

    // Canonical paths under Engineering & Technology
    expect(pathNames).toContain("Software Development");
    expect(pathNames).toContain("Core & Systems Engineering");

    // Must NOT contain paths from other domains such as AI / Data Science
    expect(pathNames).not.toContain("Artificial Intelligence");
    expect(pathNames).not.toContain("Data Science");
  });

  it("detects when all visible results are within the 25–39% exploration range", () => {
    const mockExplorationOnly = [
      { career_name: "Software / App Development", match_percentage: 35 },
      { career_name: "Design & Creative Strategy", match_percentage: 28 },
    ];

    const { strongMatches, explorationMatches } = getTieredCareerMatches(mockExplorationOnly);
    expect(strongMatches.length).toBe(0);
    expect(explorationMatches.length).toBe(2);
  });
});
