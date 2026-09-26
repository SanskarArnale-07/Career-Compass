import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getCareerHierarchy,
  getAllCareerPaths,
  searchCareerCatalog,
  searchCareerCatalogGrouped,
} from "@/lib/career-hierarchy";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";
import { CareerPathAreas } from "@/components/career/CareerPathAreas";

describe("Career Directory Hierarchy Visibility & Progressive Disclosure", () => {
  // ── 1. Cybersecurity & Defense Hierarchy & Integrity ──────────────────────
  describe("Cybersecurity & Defense Hierarchy", () => {
    it("resolves canonical hierarchy with exact counts and no duplicate roles", () => {
      const hierarchy = getCareerHierarchy("cybersecurity");
      expect(hierarchy).toBeDefined();
      if (!hierarchy) return;

      expect(hierarchy.path.name).toBe("Cybersecurity & Defense");
      expect(hierarchy.path.slug).toBe("cybersecurity");

      // Verify exact count of 5 specializations
      const specs = hierarchy.path.specializations;
      expect(specs.length).toBe(5);

      const specNames = specs.map((s) => s.name);
      expect(specNames).toContain("Offensive Security & Red Teaming");
      expect(specNames).toContain("Defensive Security & Blue Teaming (SecOps)");
      expect(specNames).toContain("Cloud & Application Security (DevSecOps)");
      expect(specNames).toContain("Digital Forensics & Threat Intelligence (DFIR)");
      expect(specNames).toContain("Governance, Risk, Compliance (GRC) & Security Architecture");

      // Verify total of 15 roles (3 per specialization)
      const allRoles = specs.flatMap((s) => s.roles);
      expect(allRoles.length).toBe(15);

      // Verify no duplicate role IDs or titles
      const roleIds = new Set(allRoles.map((r) => r.id));
      const roleTitles = new Set(allRoles.map((r) => r.title));
      expect(roleIds.size).toBe(15);
      expect(roleTitles.size).toBe(15);

      // Verify specific roles exist under each specialization
      const offensive = specs.find((s) => s.id === "offensive-security");
      expect(offensive?.roles.map((r) => r.title)).toEqual([
        "Red Team Cybersecurity Operator",
        "Penetration Tester (Ethical Hacker)",
        "Vulnerability Researcher & Exploit Analyst",
      ]);

      const secOps = specs.find((s) => s.id === "sec-operations");
      expect(secOps?.roles.map((r) => r.title)).toEqual([
        "Blue Team & SOC Analyst",
        "Incident Response Specialist",
        "Cyber Threat Hunter & Detection Engineer",
      ]);

      const cloudSec = specs.find((s) => s.id === "cloud-identity-sec");
      expect(cloudSec?.roles.map((r) => r.title)).toEqual([
        "Application Security Engineer (AppSec)",
        "DevSecOps Engineer",
        "Cloud Security Architect",
      ]);

      const dfir = specs.find((s) => s.id === "digital-forensics-dfir");
      expect(dfir?.roles.map((r) => r.title)).toEqual([
        "Digital Forensics Investigator",
        "Malware Analyst & Reverse Engineer",
        "Cyber Threat Intelligence Analyst",
      ]);

      const grc = specs.find((s) => s.id === "governance-risk-compliance");
      expect(grc?.roles.map((r) => r.title)).toEqual([
        "Cybersecurity GRC Analyst",
        "Information Systems Auditor",
        "Cybersecurity Architect",
      ]);
    });

    it("resolves CareerIntelligence for cybersecurity without 404", () => {
      const intel = resolveCareerIntelligence("cybersecurity");
      expect(intel).toBeDefined();
      if (!intel) return;

      expect(intel.slug).toBe("cybersecurity");
      expect(intel.title).toBe("Cybersecurity & Defense");
      expect(intel.category).toBe("Engineering & Technology");
      expect(intel.roleProgression.length).toBe(15);
    });

    it("renders CareerPathAreas with complete 5-specialization structure and role disclosure", () => {
      const intel = resolveCareerIntelligence("cybersecurity");
      expect(intel).toBeDefined();
      if (!intel) return;

      const html = renderToStaticMarkup(<CareerPathAreas career={intel} />);

      // Section title and canonical count
      expect(html).toContain("Cybersecurity &amp; Defense");
      expect(html).toContain("5 Specializations · 15 Roles");

      // All 5 specializations visible with descriptions and role counts
      expect(html).toContain("Offensive Security &amp; Red Teaming");
      expect(html).toContain("Defensive Security &amp; Blue Teaming (SecOps)");
      expect(html).toContain("Cloud &amp; Application Security (DevSecOps)");
      expect(html).toContain("Digital Forensics &amp; Threat Intelligence (DFIR)");
      expect(html).toContain("Governance, Risk, Compliance (GRC) &amp; Security Architecture");
      expect(html).toContain("3 roles");

      // Default active specialization reveals its roles
      expect(html).toContain("Roles in Offensive Security &amp; Red Teaming");
      expect(html).toContain("Red Team Cybersecurity Operator");
      expect(html).toContain("Penetration Tester (Ethical Hacker)");
      expect(html).toContain("Vulnerability Researcher &amp; Exploit Analyst");
    });

    it("supports deep linking to specific specialization (e.g. Cloud & Application Security)", () => {
      const intel = resolveCareerIntelligence("cybersecurity");
      expect(intel).toBeDefined();
      if (!intel) return;

      const html = renderToStaticMarkup(
        <CareerPathAreas career={intel} initialSpecId="cloud-identity-sec" />
      );

      expect(html).toContain("Roles in Cloud &amp; Application Security (DevSecOps)");
      expect(html).toContain("Application Security Engineer (AppSec)");
      expect(html).toContain("DevSecOps Engineer");
      expect(html).toContain("Cloud Security Architect");
    });
  });

  // ── 2. Software Development Hierarchy & Integrity ─────────────────────────
  describe("Software Development Hierarchy", () => {
    it("resolves canonical hierarchy with exact counts and no duplicate roles", () => {
      const hierarchy = getCareerHierarchy("software-development");
      expect(hierarchy).toBeDefined();
      if (!hierarchy) return;

      expect(hierarchy.path.name).toBe("Software Development");
      expect(hierarchy.path.slug).toBe("software-development");

      const specs = hierarchy.path.specializations;
      expect(specs.length).toBe(3);

      const specNames = specs.map((s) => s.name);
      expect(specNames).toContain("Web & Application Engineering");
      expect(specNames).toContain("Systems & Cloud Architecture");
      expect(specNames).toContain("Mobile & Platforms");

      const allRoles = specs.flatMap((s) => s.roles);
      expect(allRoles.length).toBe(9);

      const roleIds = new Set(allRoles.map((r) => r.id));
      const roleTitles = new Set(allRoles.map((r) => r.title));
      expect(roleIds.size).toBe(9);
      expect(roleTitles.size).toBe(9);
    });

    it("renders CareerPathAreas for Software Development with full hierarchy", () => {
      const intel = resolveCareerIntelligence("software-development");
      expect(intel).toBeDefined();
      if (!intel) return;

      const html = renderToStaticMarkup(<CareerPathAreas career={intel} />);

      expect(html).toContain("Software Development");
      expect(html).toContain("3 Specializations · 9 Roles");
      expect(html).toContain("Web &amp; Application Engineering");
      expect(html).toContain("Systems &amp; Cloud Architecture");
      expect(html).toContain("Mobile &amp; Platforms");

      // Default active specialization shows Web & Application Engineering roles
      expect(html).toContain("Roles in Web &amp; Application Engineering");
      expect(html).toContain("Frontend Developer");
      expect(html).toContain("Backend Developer");
      expect(html).toContain("Full Stack Developer");
    });
  });

  // ── 3. Artificial Intelligence & Data Hierarchy & Integrity ───────────────
  describe("Artificial Intelligence & Data Hierarchy", () => {
    it("resolves canonical hierarchy with exact counts and no duplicate roles", () => {
      const hierarchy = getCareerHierarchy("ai-ml-data-science");
      expect(hierarchy).toBeDefined();
      if (!hierarchy) return;

      expect(hierarchy.path.name).toBe("Artificial Intelligence & Data");
      expect(hierarchy.path.slug).toBe("ai-ml-data-science");

      const specs = hierarchy.path.specializations;
      expect(specs.length).toBe(3);

      const specNames = specs.map((s) => s.name);
      expect(specNames).toContain("Machine Learning");
      expect(specNames).toContain("Data Science");
      expect(specNames).toContain("AI Engineering");

      const allRoles = specs.flatMap((s) => s.roles);
      expect(allRoles.length).toBe(9);

      const roleIds = new Set(allRoles.map((r) => r.id));
      const roleTitles = new Set(allRoles.map((r) => r.title));
      expect(roleIds.size).toBe(9);
      expect(roleTitles.size).toBe(9);
    });

    it("renders CareerPathAreas for Artificial Intelligence & Data with full hierarchy", () => {
      const intel = resolveCareerIntelligence("ai-ml-data-science");
      expect(intel).toBeDefined();
      if (!intel) return;

      const html = renderToStaticMarkup(<CareerPathAreas career={intel} />);

      expect(html).toContain("Artificial Intelligence &amp; Data");
      expect(html).toContain("3 Specializations · 9 Roles");
      expect(html).toContain("Machine Learning");
      expect(html).toContain("Data Science");
      expect(html).toContain("AI Engineering");

      // First active specialization reveals Machine Learning roles
      expect(html).toContain("Roles in Machine Learning");
      expect(html).toContain("Machine Learning Engineer");
      expect(html).toContain("NLP Engineer");
      expect(html).toContain("Computer Vision Engineer");
    });
  });

  // ── 4. Search vs Browse Separation ─────────────────────────────────────────
  describe("Search vs Browse Separation", () => {
    it("search for 'cyber' returns focused search matches, not the entire tree dump", () => {
      const searchResults = searchCareerCatalog("cyber");
      expect(searchResults.length).toBeGreaterThanOrEqual(1);

      // Top search result is Cybersecurity & Defense path
      expect(searchResults[0].path.slug).toBe("cybersecurity");

      // Search results do not dump all 9 roles into the flat search item
      const topResult = searchResults[0];
      expect(topResult.matchedRoles.length).toBeLessThanOrEqual(9);

      // Grouped search separates into paths, specializations, and roles
      const groups = searchCareerCatalogGrouped("cyber");
      expect(groups.length).toBeGreaterThanOrEqual(1);
    });

    it("browsing the path provides access to all specializations and all roles", () => {
      const hierarchy = getCareerHierarchy("cybersecurity");
      expect(hierarchy).toBeDefined();
      if (!hierarchy) return;

      // In browse mode, all 5 specializations are accessible
      expect(hierarchy.path.specializations.length).toBe(5);

      // In browse mode, all 15 roles are accessible across the 5 specializations
      const totalRoles = hierarchy.path.specializations.reduce(
        (acc, s) => acc + s.roles.length,
        0
      );
      expect(totalRoles).toBe(15);
    });

    it("searching for 'cyber' surfaces prominent fields including Red Team and Blue Team", () => {
      const groups = searchCareerCatalogGrouped("cyber");
      const roleGroup = groups.find((g) => g.label === "Roles");
      const specGroup = groups.find((g) => g.label === "Specializations");

      expect(roleGroup).toBeDefined();
      expect(specGroup).toBeDefined();

      const roleTitles = roleGroup?.results.map((r) => r.role?.title);
      expect(roleTitles).toContain("Red Team Cybersecurity Operator");
      expect(roleTitles).toContain("Blue Team & SOC Analyst");
      expect(roleTitles).toContain("Penetration Tester (Ethical Hacker)");

      const specNames = specGroup?.results.map((s) => s.specialization?.name);
      expect(specNames).toContain("Offensive Security & Red Teaming");
      expect(specNames).toContain("Defensive Security & Blue Teaming (SecOps)");
    });

    it("searching for 'red team' and 'blue team' directly surfaces the corresponding roles", () => {
      const redTeamResults = searchCareerCatalog("red team");
      const redTeamRoles = redTeamResults
        .filter((r) => r.entityType === "role")
        .map((r) => r.role?.title);
      expect(redTeamRoles).toContain("Red Team Cybersecurity Operator");

      const blueTeamResults = searchCareerCatalog("blue team");
      const blueTeamRoles = blueTeamResults
        .filter((r) => r.entityType === "role")
        .map((r) => r.role?.title);
      expect(blueTeamRoles).toContain("Blue Team & SOC Analyst");
    });
  });
});
