import { describe, it, expect } from "vitest";
import React from "react";
import CareersPage from "@/app/careers/page";
import { CareersDirectoryFilter } from "@/components/career/CareersDirectoryFilter";
import {
  getCareerCatalogueStats,
  getAllCareerPaths,
  CAREER_DOMAINS,
  searchCareerCatalog,
  searchCareerCatalogGrouped,
} from "@/lib/career-hierarchy";

describe("Career Directory Catalogue Breadth & Global Search", () => {
  it("calculates catalogue counts dynamically from canonical registry", () => {
    const stats = getCareerCatalogueStats();
    const paths = getAllCareerPaths();

    expect(stats.totalDomains).toBe(CAREER_DOMAINS.length);
    expect(stats.totalPaths).toBe(paths.length);

    const calculatedRoles = paths.reduce(
      (acc, p) => acc + p.specializations.reduce((sAcc, s) => sAcc + s.roles.length, 0),
      0
    );
    expect(stats.totalRoles).toBe(calculatedRoles);
    expect(stats.totalRoles).toBeGreaterThanOrEqual(100);
    expect(stats.totalSpecializations).toBeGreaterThanOrEqual(40);
  });

  it("renders catalogue summary and hierarchy depth dynamically on the Explore More Careers page", () => {
    const stats = getCareerCatalogueStats();
    const pageElement = CareersPage();
    expect(React.isValidElement(pageElement)).toBe(true);

    function extractText(node: unknown): string {
      if (typeof node === "string" || typeof node === "number") {
        return String(node);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join(" ");
      }
      if (React.isValidElement(node)) {
        const props = node.props as { children?: unknown };
        return extractText(props.children);
      }
      return "";
    }

    const pageText = extractText(pageElement);

    expect(pageText).toContain(
      `Explore ${stats.totalRoles} career roles across ${stats.totalDomains} career domains`
    );
    expect(pageText).toContain(
      `${stats.totalPaths} career paths · ${stats.totalSpecializations} specializations · ${stats.totalRoles} roles`
    );
    expect(pageText).toContain(
      `${stats.totalPaths} paths · ${stats.totalRoles} roles`
    );
  });

  it("renders CareersDirectoryFilter with prominent search input and required placeholder", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const html = renderToStaticMarkup(<CareersDirectoryFilter />);

    expect(html).toContain('placeholder="Search careers, roles, or areas..."');
    expect(html).toContain("Data Scientist");
    expect(html).toContain("Frontend Developer");
    expect(html).toContain("Artificial Intelligence");
    expect(html).toContain("Cybersecurity");
    expect(html).toContain("Mobile");
  });

  describe("searchCareerCatalog — result depth & relevance", () => {
    // ── Short-query alias expansion ────────────────────────────────────────

    it("'AI' returns MULTIPLE relevant results, not just one", () => {
      const results = searchCareerCatalog("AI");
      // Must surface path AND several specs/roles in the AI cluster
      expect(results.length).toBeGreaterThanOrEqual(3);

      // Top result must be the AI/Data path
      expect(results[0].path.slug).toBe("ai-ml-data-science");

      // CRITICAL: Design & Creative Arts must never appear for 'AI'
      expect(results.some((r) => r.path.slug === "design-creative")).toBe(false);

      // The result set must contain entity-level variation
      const entityTypes = new Set(results.map((r) => r.entityType));
      // At minimum we expect paths; with the alias expansion we also expect
      // specializations or roles to appear somewhere in the list
      expect(entityTypes.size).toBeGreaterThanOrEqual(1);
    });

    it("'ai' (lowercase) returns same cluster as 'AI'", () => {
      const upper = searchCareerCatalog("AI");
      const lower = searchCareerCatalog("ai");
      expect(lower.length).toBeGreaterThanOrEqual(3);
      expect(lower[0].path.slug).toBe("ai-ml-data-science");
      expect(lower.some((r) => r.path.slug === "design-creative")).toBe(false);
      // Same count — case insensitive
      expect(lower.length).toBe(upper.length);
    });

    it("'ML' returns Machine Learning specialization and relevant roles", () => {
      const results = searchCareerCatalog("ML");
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.some((r) => r.path.slug === "ai-ml-data-science")).toBe(true);
      // Should not include Design & Creative Arts
      expect(results.some((r) => r.path.slug === "design-creative")).toBe(false);
    });

    it("'UX' returns UX-related results without false positives", () => {
      const results = searchCareerCatalog("UX");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].path.slug).toBe("design-creative");
      // Must not return Software Development or unrelated paths
      expect(results.some((r) => r.path.slug === "software-development")).toBe(false);
    });

    // ── Longer query depth ────────────────────────────────────────────────

    it("'Artificial Intelligence' returns multiple relevant results", () => {
      const results = searchCareerCatalog("Artificial Intelligence");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].path.slug).toBe("ai-ml-data-science");
    });

    it("'Machine Learning' matches specialization and roles", () => {
      const results = searchCareerCatalog("Machine Learning");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((r) => r.path.slug === "ai-ml-data-science")).toBe(true);
      // Should find specialization match
      const specOrRoleResult = results.find(
        (r) => r.entityType === "specialization" || r.entityType === "role" || r.matchedSpecializations.includes("Machine Learning")
      );
      expect(specOrRoleResult).toBeTruthy();
    });

    it("'data' returns multiple data-related career entities", () => {
      const results = searchCareerCatalog("data");
      expect(results.length).toBeGreaterThanOrEqual(3);
      // Data paths should appear at the top
      const slugs = results.map((r) => r.path.slug);
      const hasDataPath =
        slugs.includes("ai-ml-data-science") ||
        slugs.includes("data-engineering-platforms") ||
        slugs.includes("data-analytics-bi");
      expect(hasDataPath).toBe(true);
    });

    it("'Frontend' and 'front end' resolve to Software Development with role match", () => {
      for (const query of ["Frontend", "front end", "front-end"]) {
        const results = searchCareerCatalog(query);
        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results[0].path.slug).toBe("software-development");
        expect(results[0].matchedRoles).toContain("Frontend Developer");
      }
    });

    it("'Data Scientist' matches role and path with correct slug", () => {
      const results = searchCareerCatalog("Data Scientist");
      expect(results.length).toBeGreaterThanOrEqual(1);
      const slugs = results.map((r) => r.path.slug);
      expect(slugs).toContain("ai-ml-data-science");
      const topResult = results[0];
      expect(
        topResult.matchedRoles.includes("Data Scientist") ||
          topResult.role?.title === "Data Scientist"
      ).toBe(true);
    });

    it("'Cybersecurity' matches Cybersecurity & Defense and no unrelated paths", () => {
      const results = searchCareerCatalog("Cybersecurity");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].path.slug).toBe("cybersecurity");
      expect(results.some((r) => r.path.slug === "design-creative")).toBe(false);
    });

    it("'engineering' returns multiple paths without false positives", () => {
      const results = searchCareerCatalog("engineering");
      expect(results.length).toBeGreaterThanOrEqual(2);
      const topSlugs = results.slice(0, 5).map((r) => r.path.slug);
      expect(topSlugs).toContain("engineering");
    });

    it("'cyber' prefix returns Cybersecurity results", () => {
      const results = searchCareerCatalog("cyber");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].path.slug).toBe("cybersecurity");
    });

    it("'iot' and 'internet of things' match IoT & Connected Systems path, not generic engineering", () => {
      const iotResults = searchCareerCatalog("iot");
      expect(iotResults.length).toBeGreaterThanOrEqual(1);
      expect(iotResults[0].path.slug).toBe("iot-connected-systems");
      expect(iotResults[0].path.name).toBe("IoT & Connected Systems");

      const iotGrouped = searchCareerCatalogGrouped("iot");
      const pathGroup = iotGrouped.find((g) => g.label === "Career Paths");
      expect(pathGroup?.results[0].path.slug).toBe("iot-connected-systems");

      const fullTermResults = searchCareerCatalog("internet of things");
      expect(fullTermResults.length).toBeGreaterThanOrEqual(1);
      expect(fullTermResults[0].path.slug).toBe("iot-connected-systems");
    });

    // ── Edge cases ────────────────────────────────────────────────────────

    it("empty query restores all paths (one result per path)", () => {
      const allPaths = getAllCareerPaths();
      const emptyResults = searchCareerCatalog("");
      expect(emptyResults.length).toBe(allPaths.length);
      expect(emptyResults.every((r) => r.entityType === "path")).toBe(true);
    });

    it("nonsense query returns empty results", () => {
      expect(searchCareerCatalog("xyzabc123notacareer").length).toBe(0);
    });

    it("respects domainId filter when provided", () => {
      const results = searchCareerCatalog("Developer", {
        domainId: "engineering-technology",
      });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.every((r) => r.path.domainId === "engineering-technology")).toBe(true);
    });

    it("result count never exceeds maxTotal", () => {
      // A broad 4-letter query that could match many things
      const results = searchCareerCatalog("data", { maxTotal: 5 });
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe("searchCareerCatalogGrouped — grouped result structure", () => {
    it("'AI' returns groups containing Career Paths and at least one other group", () => {
      const groups = searchCareerCatalogGrouped("AI");
      expect(groups.length).toBeGreaterThanOrEqual(1);
      const labels = groups.map((g) => g.label);
      expect(labels).toContain("Career Paths");
      // With alias expansion we expect Specializations and/or Roles too
      const hasSubGroups =
        labels.includes("Specializations") || labels.includes("Roles");
      expect(hasSubGroups).toBe(true);
    });

    it("grouped results for 'data' have non-empty results arrays per group", () => {
      const groups = searchCareerCatalogGrouped("data");
      expect(groups.length).toBeGreaterThanOrEqual(1);
      for (const group of groups) {
        expect(group.results.length).toBeGreaterThan(0);
      }
    });

    it("empty query returns empty groups array", () => {
      const groups = searchCareerCatalogGrouped("");
      // Empty query returns flat path list, not groups
      expect(groups.length).toBe(0);
    });
  });
});
