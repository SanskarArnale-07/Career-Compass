import { describe, it, expect } from "vitest";
import { calculateCareerProgressAndReadiness } from "@/lib/progress-engine";
import { getCareerIntelligence } from "@/lib/career-intelligence";

describe("Progress Engine & Readiness Scoring", () => {
  const techCareer = getCareerIntelligence("software-development")!;
  const medCareer = getCareerIntelligence("medicine-healthcare")!;

  it("calculates 0% readiness baseline for new unassessed student", () => {
    const report = calculateCareerProgressAndReadiness(techCareer, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    expect(report.indicators.foundations.percentage).toBe(0);
    expect(report.indicators.portfolio.percentage).toBe(0);
    expect(report.compositeReadinessIndex.tierLevel).toBe(1);
    expect(report.compositeReadinessIndex.tierName).toBe("Explorer");
  });

  it("provides domain-aware tier unlock requirements for medicine", () => {
    const report = calculateCareerProgressAndReadiness(medCareer, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    const nextReq = report.compositeReadinessIndex.nextTierRequirement;
    expect(nextReq).toContain("foundational study modules");
  });

  it("advances tier when foundations and skills progress", () => {
    const allSkills = techCareer.skills.map((s) => s.id);
    const report = calculateCareerProgressAndReadiness(
      techCareer,
      { TE: 75, AN: 70 },
      {
        completedPhases: [1, 2, 3],
        completedSkills: allSkills.slice(0, 5),
        completedProjects: ["Portfolio Website"],
        completedTasks: ["prep-1", "prep-2"],
      }
    );

    expect(report.indicators.foundations.percentage).toBeGreaterThan(30);
    expect(report.indicators.skills.percentage).toBeGreaterThan(30);
    expect(report.compositeReadinessIndex.overallScore).toBeGreaterThanOrEqual(25);
    expect(report.compositeReadinessIndex.tierLevel).toBeGreaterThanOrEqual(2);
  });

  it("reaches Career Ready tier when near completion", () => {
    const allSkills = techCareer.skills.map((s) => s.id);
    const allPhases = techCareer.roadmap.map((r) => r.phase);
    const allTasks = techCareer.preparation.map((p) => p.id);
    const allProjects = techCareer.projects.map((p) => p.title);

    const report = calculateCareerProgressAndReadiness(
      techCareer,
      { TE: 90, AN: 85 },
      {
        completedPhases: allPhases,
        completedSkills: allSkills,
        completedProjects: allProjects,
        completedTasks: allTasks,
      }
    );

    expect(report.compositeReadinessIndex.overallScore).toBeGreaterThanOrEqual(80);
    expect(report.compositeReadinessIndex.tierLevel).toBe(4);
    expect(report.compositeReadinessIndex.tierName).toBe("Career Ready");
  });
});
