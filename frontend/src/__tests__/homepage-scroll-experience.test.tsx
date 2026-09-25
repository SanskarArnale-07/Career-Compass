import { describe, it, expect } from "vitest";
import { heroText } from "@/components/home/typography";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";

describe("Homepage 2.0 Continuous Scroll Experience", () => {
  it("uses the revised clamp for hero heading size (clamp(3.25rem, 5.5vw, 5rem))", () => {
    expect(heroText).toContain("clamp(3.25rem,5.5vw,5rem)");
  });

  it("has canonical domains available for the 6 career domains scene", () => {
    expect(CAREER_DOMAINS.length).toBeGreaterThanOrEqual(6);
    const domainNames = CAREER_DOMAINS.slice(0, 6).map((d) => d.name);
    expect(domainNames).toContain("Engineering & Technology");
    expect(domainNames).toContain("Data & Artificial Intelligence");
    expect(CAREER_DOMAINS.map((d) => d.id)).toContain("data-ai");
  });

  it("verifies canonical branching data hierarchy for Engineering & Technology", () => {
    const engDomain = CAREER_DOMAINS.find((d) => d.id === "engineering-technology");
    expect(engDomain).toBeDefined();

    // Verify Paths branch
    const paths = engDomain!.paths;
    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(paths.map((p) => p.name)).toContain("Software Development");
    expect(paths.map((p) => p.name)).toContain("Core & Systems Engineering");

    // Verify Specializations branch under Software Development
    const softwarePath = paths.find((p) => p.id === "software-development")!;
    expect(softwarePath.specializations.length).toBe(3);
    const specNames = softwarePath.specializations.map((s) => s.name);
    expect(specNames).toContain("Web & Application Engineering");
    expect(specNames).toContain("Systems & Cloud Architecture");
    expect(specNames).toContain("Mobile & Platforms");

    // Verify Roles branch under Web & Application Engineering
    const webSpec = softwarePath.specializations.find((s) => s.id === "web-app-eng")!;
    expect(webSpec.roles.length).toBe(3);
    const roleTitles = webSpec.roles.map((r) => r.title);
    expect(roleTitles).toContain("Frontend Developer");
    expect(roleTitles).toContain("Backend Developer");
    expect(roleTitles).toContain("Full Stack Developer");
  });

  it("verifies 3D Career Globe experience components are exported properly", async () => {
    const { CareerGlobeExperience } = await import("@/components/home/globe/CareerGlobeExperience");
    expect(CareerGlobeExperience).toBeDefined();

    const { CareerGlobeCanvas } = await import("@/components/home/globe/CareerGlobeCanvas");
    expect(CareerGlobeCanvas).toBeDefined();

    const { CareerGlobeMesh } = await import("@/components/home/globe/CareerGlobeMesh");
    expect(CareerGlobeMesh).toBeDefined();

    const { DomainNodes } = await import("@/components/home/globe/DomainNodes");
    expect(DomainNodes).toBeDefined();

    const { TraitsConstellation } = await import("@/components/home/globe/TraitsConstellation");
    expect(TraitsConstellation).toBeDefined();

    const { HierarchySpatialReveal } = await import("@/components/home/globe/HierarchySpatialReveal");
    expect(HierarchySpatialReveal).toBeDefined();

    const { TrajectoryConvergence } = await import("@/components/home/globe/TrajectoryConvergence");
    expect(TrajectoryConvergence).toBeDefined();

    const { GlobeOverlay } = await import("@/components/home/globe/GlobeOverlay");
    expect(GlobeOverlay).toBeDefined();
  }, 45000);
});
