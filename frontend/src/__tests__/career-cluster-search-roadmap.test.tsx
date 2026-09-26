import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  searchCareerCatalog,
  searchCareerCatalogGrouped,
  getCareerHierarchy,
  getRoleHierarchy,
  getAllCareerPaths,
} from "@/lib/career-hierarchy";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";
import { CareersDirectoryFilter } from "@/components/career/CareersDirectoryFilter";

describe("Career Directory Cluster Search & Roadmap Deep-linking", () => {
  // ── 1. Broad Queries Cluster Representation ─────────────────────────────────
  describe("Broad Queries Cluster Representation", () => {
    const broadQueries = [
      { query: "IoT", expectedPathSlug: "iot-connected-systems", minTotal: 10 },
      { query: "AI", expectedPathSlug: "ai-ml-data-science", minTotal: 10 },
      { query: "Law", expectedPathSlug: "law-policy", minTotal: 10 },
      { query: "Cyber", expectedPathSlug: "cybersecurity", minTotal: 12 },
      { query: "Data", expectedPathSlug: "ai-ml-data-science", minTotal: 15 },
      { query: "Design", expectedPathSlug: "design-creative", minTotal: 15 },
      { query: "Engineering", expectedPathSlug: "engineering", minTotal: 15 },
      { query: "Healthcare", expectedPathSlug: "medicine-healthcare", minTotal: 12 },
      { query: "Finance", expectedPathSlug: "finance-investment", minTotal: 12 },
    ];

    broadQueries.forEach(({ query, expectedPathSlug, minTotal }) => {
      it(`broad query "${query}" surfaces full cluster with >= ${minTotal} results and all entity levels`, () => {
        const flatResults = searchCareerCatalog(query);
        expect(flatResults.length).toBeGreaterThanOrEqual(minTotal);

        const groups = searchCareerCatalogGrouped(query);
        const groupLabels = groups.map((g) => g.label);

        // Broad queries must surface paths, specializations, and roles
        expect(groupLabels).toContain("Career Paths");
        expect(groupLabels).toContain("Specializations");
        expect(groupLabels).toContain("Roles");

        // Paths must come first for broad queries
        expect(groups[0].label).toBe("Career Paths");

        // The expected canonical path must be present in the path results
        const pathGroup = groups.find((g) => g.label === "Career Paths");
        const pathSlugs = pathGroup?.results.map((r) => r.path.slug);
        expect(pathSlugs).toContain(expectedPathSlug);

        // Every role result must have targetRoadmapUrl
        const roleGroup = groups.find((g) => g.label === "Roles");
        expect(roleGroup).toBeDefined();
        expect(roleGroup!.results.length).toBeGreaterThan(0);
        for (const roleResult of roleGroup!.results) {
          expect(roleResult.targetRoadmapUrl).toMatch(/^\/career\/[a-z0-9-]+(\?tab=roadmap.*)?#roadmap$/);
        }
      });
    });
  });

  // ── 2. Specific Role Queries ────────────────────────────────────────────────
  describe("Specific Role Queries", () => {
    const specificQueries = [
      {
        query: "Data Scientist",
        expectedRoleTitle: "Data Scientist",
        expectedPathSlug: "ai-ml-data-science",
      },
      {
        query: "Corporate Lawyer",
        expectedRoleTitle: "Corporate Legal Associate",
        expectedPathSlug: "law-policy",
      },
      {
        query: "Frontend Developer",
        expectedRoleTitle: "Frontend Developer",
        expectedPathSlug: "software-development",
      },
    ];

    specificQueries.forEach(({ query, expectedRoleTitle, expectedPathSlug }) => {
      it(`specific query "${query}" ranks Roles first and marks top role as isSpecificRoleMatch`, () => {
        const groups = searchCareerCatalogGrouped(query);
        expect(groups.length).toBeGreaterThan(0);

        // For specific role queries, Roles group must appear first!
        expect(groups[0].label).toBe("Roles");

        const topRole = groups[0].results[0];
        expect(topRole.entityType).toBe("role");
        expect(topRole.role).toBeDefined();
        expect(topRole.role?.title).toBe(expectedRoleTitle);
        expect(topRole.path.slug).toBe(expectedPathSlug);
        expect(topRole.isSpecificRoleMatch).toBe(true);

        // Validate direct deep-link target roadmap URL
        expect(topRole.targetRoadmapUrl).toBe(
          `/career/${topRole.path.slug}?tab=roadmap&spec=${topRole.specialization?.id}&role=${topRole.role?.id}#roadmap`
        );
      });
    });
  });

  // ── 3. Role-to-Roadmap Integrity across Entire Registry ─────────────────────
  describe("Role-to-Roadmap Integrity across All Roles", () => {
    const allPaths = getAllCareerPaths();
    const allRoles = allPaths.flatMap((p) =>
      p.specializations.flatMap((s) =>
        s.roles.map((r) => ({ role: r, spec: s, path: p }))
      )
    );

    it(`verifies all ${allRoles.length} roles resolve to active parent paths and intelligence roadmaps`, () => {
      expect(allRoles.length).toBeGreaterThanOrEqual(200);

      for (const { role, spec, path } of allRoles) {
        // Reverse lookup must resolve accurately
        const hierarchy = getRoleHierarchy(role.id);
        expect(hierarchy).toBeDefined();
        expect(hierarchy?.path.slug).toBe(path.slug);
        expect(hierarchy?.specialization.id).toBe(spec.id);

        // Intelligence roadmap must resolve for parent path
        const intelligence = resolveCareerIntelligence(path.slug);
        expect(intelligence).toBeDefined();
        expect(intelligence?.roadmap).toBeDefined();
        expect(intelligence?.roadmap.length).toBeGreaterThan(0);
      }
    });
  });

  // ── 4. UI Rendering & Browse Integration ────────────────────────────────────
  describe("UI Rendering & Browse Integration", () => {
    it("renders CareersDirectoryFilter directory markup with all domains and paths", () => {
      const html = renderToStaticMarkup(<CareersDirectoryFilter />);
      expect(html).toContain("Search careers, roles, or areas");
      expect(html).toContain("Engineering &amp; Technology");
      expect(html).toContain("All Paths (25)");
    });

    it("verifies grouped results structure for specific role produces role-first grouping with direct roadmap link", () => {
      const groups = searchCareerCatalogGrouped("Data Scientist");
      expect(groups[0].label).toBe("Roles");
      const topRole = groups[0].results[0];
      expect(topRole.isSpecificRoleMatch).toBe(true);
      expect(topRole.targetRoadmapUrl).toBe(
        "/career/ai-ml-data-science?tab=roadmap&spec=data-science&role=data-scientist#roadmap"
      );
    });
  });
});
