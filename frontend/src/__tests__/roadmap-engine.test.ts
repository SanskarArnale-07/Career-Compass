import { describe, it, expect } from "vitest";
import { generatePersonalizedRoadmap } from "@/lib/roadmap-engine";
import { getCareerIntelligence } from "@/lib/career-intelligence";

describe("Roadmap Engine", () => {
  const techCareer = getCareerIntelligence("software-development")!;
  const medCareer = getCareerIntelligence("medicine-healthcare")!;
  const lawCareer = getCareerIntelligence("law-policy")!;
  const designCareer = getCareerIntelligence("design-creative")!;

  it("generates deterministic 6-phase roadmap for software development", () => {
    const roadmap1 = generatePersonalizedRoadmap(techCareer, {
      traitProfile: { AN: 75, TE: 80 },
      weeklyHours: 10,
    });

    const roadmap2 = generatePersonalizedRoadmap(techCareer, {
      traitProfile: { AN: 75, TE: 80 },
      weeklyHours: 10,
    });

    expect(roadmap1.phases.length).toBe(6);
    expect(roadmap1.roadmapId).toBe(roadmap2.roadmapId);
    expect(roadmap1.phases[1].title).toBe("2. Core Technical Competencies");
    expect(roadmap1.phases[3].title).toBe("4. Portfolio Projects & System Building");
  });

  it("generates domain-aware stage titles for medicine / healthcare", () => {
    const medRoadmap = generatePersonalizedRoadmap(medCareer, {
      weeklyHours: 15,
    });

    expect(medRoadmap.phases.length).toBe(6);
    expect(medRoadmap.phases[0].title).toBe("1. Basic Medical Sciences & Human Biology");
    expect(medRoadmap.phases[1].title).toBe("2. Core Clinical Knowledge & Reasoning");
    expect(medRoadmap.phases[2].title).toBe("3. Diagnostic Practice & Patient Care");
    expect(medRoadmap.phases[3].title).toBe("4. Clinical Case Studies & Healthcare Exposure");
    expect(medRoadmap.phases[4].title).toBe("5. Clinical Specialization & Evidence-Based Medicine");
    expect(medRoadmap.phases[5].title).toBe("6. Medical Licensing & Internship Readiness");

    // Check milestones don't use software "developer toolchain" or "cloud deployment"
    const titles = medRoadmap.milestones.map((m) => m.title);
    expect(titles.some((t) => t.includes("Developer Toolchain"))).toBe(false);
    expect(titles.some((t) => t.includes("Cloud Deployment"))).toBe(false);
  });

  it("generates domain-aware stage titles for law & governance", () => {
    const lawRoadmap = generatePersonalizedRoadmap(lawCareer, {
      weeklyHours: 10,
    });

    expect(lawRoadmap.phases[0].title).toBe("1. Legal Foundations & Jurisprudence");
    expect(lawRoadmap.phases[1].title).toBe("2. Core Statutes, Case Law & Substantive Law");
    expect(lawRoadmap.phases[2].title).toBe("3. Legal Research, Drafting & Mooting");
    expect(lawRoadmap.phases[3].title).toBe("4. Legal Briefs, Policy Papers & Legal Aid");
    expect(lawRoadmap.phases[5].title).toBe("6. Bar Examination & Chamber Readiness");
  });

  it("generates domain-aware stage titles for design & creative", () => {
    const designRoadmap = generatePersonalizedRoadmap(designCareer, {
      weeklyHours: 12,
    });

    expect(designRoadmap.phases[0].title).toBe("1. Visual Fundamentals & Design Principles");
    expect(designRoadmap.phases[1].title).toBe("2. Core UX/UI Methodologies & Tooling");
    expect(designRoadmap.phases[2].title).toBe("3. Interactive Prototyping & Design Systems");
    expect(designRoadmap.phases[3].title).toBe("4. Portfolio Case Studies & Client Projects");
    expect(designRoadmap.phases[5].title).toBe("6. Portfolio Showcase & Design Critique Readiness");
  });

  it("fast-tracks foundation milestone when student has high aptitude in primary traits", () => {
    const roadmap = generatePersonalizedRoadmap(techCareer, {
      traitProfile: { TE: 85, AN: 80 },
      weeklyHours: 10,
    });

    const m1 = roadmap.milestones.find((m) => m.id === "software-development-foundation-01");
    expect(m1?.relevance.priority).toBe("fast-track");
    expect(m1?.relevance.isFastTracked).toBe(true);
  });

  it("marks foundation milestone as critical gap remedy when student has low trait score", () => {
    const roadmap = generatePersonalizedRoadmap(techCareer, {
      traitProfile: { TE: 20, AN: 25 },
      weeklyHours: 10,
    });

    const m1 = roadmap.milestones.find((m) => m.id === "software-development-foundation-01");
    expect(m1?.relevance.priority).toBe("critical");
    expect(m1?.relevance.isGapRemedy).toBe(true);
  });

  it("calculates progress percentages correctly with completed phases", () => {
    const roadmap = generatePersonalizedRoadmap(techCareer, {
      progressState: {
        completedPhases: [1, 2],
        completedSkills: [],
        completedProjects: [],
        completedTasks: [],
      },
    });

    expect(roadmap.completionState.completedMilestonesCount).toBeGreaterThan(0);
    expect(roadmap.completionState.overallProgressPercent).toBeGreaterThan(0);
  });
});
