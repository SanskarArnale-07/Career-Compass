import { describe, it, expect } from "vitest";
import { buildCareerContext } from "@/lib/career-details/career-context";
import { getCareerIntelligence } from "@/lib/career-intelligence";

describe("Career Context & Unassessed Honesty", () => {
  const career = getCareerIntelligence("software-development")!;

  it("builds honest unassessed context when no assessment is provided", () => {
    const context = buildCareerContext(career, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    // Unassessed users must have undefined match percentage (not fabricated 75%)
    expect(context.career.matchPercentage).toBeUndefined();
    // Strengths and gaps must not be fabricated
    expect(context.assessmentInterpretation.strengths).toEqual([]);
    expect(context.assessmentInterpretation.gaps).toEqual([]);
    // Assessment summary must be clear
    expect(context.userProfile.assessmentSummary).toContain("Assessment not completed");
    expect(context.assessmentInterpretation.whyCareerMatches).toContain("Take the assessment");
    // All skills should default to neutral developing status, not first=strong
    expect(context.skills.mastered).toEqual([]);
  });

  it("builds personalized context when valid assessment results are provided", () => {
    const context = buildCareerContext(
      career,
      { TE: 85, AN: 80, CR: 60 },
      {
        completedPhases: [1],
        completedSkills: ["prog-1"],
        completedProjects: [],
        completedTasks: [],
      },
      {
        storedResults: {
          recommended_stream: "Science",
          stream_fit_score: 85,
          top_careers: [
            {
              career_name: "Software Development",
              match_percentage: 92,
              explanation: "Outstanding alignment in technical problem-solving.",
            },
          ],
          trait_profile: { TE: 85, AN: 80, CR: 60 },
          dimension_scores: {},
          completed_at: "2026-09-19T12:00:00Z",
        } as any,
      }
    );

    // Real match percentage from results
    expect(context.career.matchPercentage).toBe(92);
    expect(context.userProfile.hasAssessment).toBe(true);
    // Real strengths and gaps from traits
    expect(context.assessmentInterpretation.strengths.length).toBeGreaterThan(0);
    expect(context.assessmentInterpretation.whyCareerMatches).toContain(
      "Outstanding alignment"
    );
  });

  it("includes canonical roadmap plan and progress report in unified context", () => {
    const context = buildCareerContext(career, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    expect(context.roadmapPlan).toBeDefined();
    expect(context.roadmapPlan?.phases.length).toBe(6);
    expect(context.progressReport).toBeDefined();
    expect(context.readiness).toBeDefined();
    expect(context.recommendations).toBeDefined();
  });
});
