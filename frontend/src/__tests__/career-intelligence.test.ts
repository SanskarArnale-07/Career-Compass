import { describe, it, expect } from "vitest";
import {
  getAllCareerIntelligence,
  getAllCareerSlugs,
  getCareerIntelligence,
  resolveCareerIntelligence,
  getCareerSlug,
  CAREER_INTELLIGENCE_REGISTRY,
} from "@/lib/career-intelligence";

describe("Career Intelligence Registry", () => {
  it("registers all 24 canonical career paths", () => {
    const all = getAllCareerIntelligence();
    expect(all.length).toBe(24);

    const slugs = getAllCareerSlugs();
    expect(slugs.length).toBe(24);
  });

  it("resolves career by exact slug", () => {
    const sw = getCareerIntelligence("software-development");
    expect(sw).toBeDefined();
    expect(sw?.title).toBe("Software Development");
    expect(sw?.category).toBe("Technology");

    const med = getCareerIntelligence("medicine-healthcare");
    expect(med).toBeDefined();
    expect(med?.title).toBe("Medical & Healthcare Professional");
    expect(med?.category).toBe("Healthcare & Life Sciences");
  });

  it("resolves career from backend name or aliases", () => {
    const resolvedFromBackendName = resolveCareerIntelligence("Software Development");
    expect(resolvedFromBackendName).toBeDefined();
    expect(resolvedFromBackendName?.slug).toBe("software-development");

    const resolvedFromLaw = resolveCareerIntelligence("Law & Governance");
    expect(resolvedFromLaw).toBeDefined();
    expect(resolvedFromLaw?.slug).toBe("law-policy");

    const resolvedFromFinance = resolveCareerIntelligence("Finance / Investment Banking");
    expect(resolvedFromFinance).toBeDefined();
    expect(resolvedFromFinance?.slug).toBe("finance-investment");
  });

  it("handles case-insensitive and whitespace-tolerant lookups", () => {
    const c1 = resolveCareerIntelligence("  SOFTWARE-DEVELOPMENT  ");
    expect(c1?.slug).toBe("software-development");

    const c2 = resolveCareerIntelligence("Medicine / Healthcare");
    expect(c2?.slug).toBe("medicine-healthcare");
  });

  it("returns undefined for non-existent career identifiers", () => {
    expect(getCareerIntelligence("non-existent-career-xyz")).toBeUndefined();
    expect(resolveCareerIntelligence("")).toBeUndefined();
    expect(resolveCareerIntelligence("astronomy-rocketry-unknown")).toBeUndefined();
  });

  it("verifies all careers contain structured required curricula and tools", () => {
    const all = getAllCareerIntelligence();
    for (const career of all) {
      expect(career.id).toBeTruthy();
      expect(career.title).toBeTruthy();
      expect(career.category).toBeTruthy();
      expect(career.roadmap.length).toBeGreaterThan(0);
      expect(career.skills.length).toBeGreaterThan(0);
      expect(career.toolsTechnologies.length).toBeGreaterThan(0);
      expect(career.responsibilities.length).toBeGreaterThan(0);
      expect(career.primaryTraits.length).toBeGreaterThan(0);
    }
  });

  it("converts names correctly using getCareerSlug", () => {
    expect(getCareerSlug("Software Development")).toBe("software-development");
    expect(getCareerSlug("AI / Machine Learning / Data Science")).toBe("ai-ml-data-science");
    expect(getCareerSlug("Design / Creative Arts")).toBe("design-creative");
  });
});
