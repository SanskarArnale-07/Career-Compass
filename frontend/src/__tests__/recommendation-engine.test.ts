import { describe, it, expect } from "vitest";
import {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
} from "@/lib/recommendation-engine";
import { generatePersonalizedRoadmap } from "@/lib/roadmap-engine";
import { calculateCareerProgressAndReadiness } from "@/lib/progress-engine";
import { getCareerIntelligence } from "@/lib/career-intelligence";

describe("Recommendation Engine", () => {
  const techCareer = getCareerIntelligence("software-development")!;

  it("recommends foundational milestone for new student with zero progress", () => {
    const roadmap = generatePersonalizedRoadmap(techCareer, { weeklyHours: 10 });
    const progress = calculateCareerProgressAndReadiness(techCareer, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    const recommendations = generateAdaptiveRecommendations(
      techCareer,
      roadmap,
      progress,
      null
    );

    expect(recommendations.primaryRecommendation).toBeDefined();
    expect(recommendations.primaryRecommendation.priority).toBe("critical");
    expect(recommendations.primaryRecommendation.category).toBe("learn");
    expect(roadmap.estimatedEffort.weeklyHours).toBe(10);
  });

  it("correctly maps recommendation to NextBestAction shape for dashboard and coach", () => {
    const roadmap = generatePersonalizedRoadmap(techCareer, { weeklyHours: 10 });
    const progress = calculateCareerProgressAndReadiness(techCareer, null, {
      completedPhases: [],
      completedSkills: [],
      completedProjects: [],
      completedTasks: [],
    });

    const recommendations = generateAdaptiveRecommendations(
      techCareer,
      roadmap,
      progress,
      null
    );

    const nba = mapRecommendationToNextBestAction(recommendations.primaryRecommendation);
    expect(nba.id).toBeTruthy();
    expect(nba.title).toBeTruthy();
    expect(nba.estimatedTime).toBeTruthy();
    expect(nba.reasoning).toBeTruthy();
  });

  it("prioritizes project deliverables when student advances to practitioner stage", () => {
    const allSkills = techCareer.skills.map((s) => s.id);
    const progress = calculateCareerProgressAndReadiness(
      techCareer,
      { TE: 70, AN: 65 },
      {
        completedPhases: [1, 2, 3],
        completedSkills: allSkills.slice(0, 4),
        completedProjects: [],
        completedTasks: [],
      }
    );

    const roadmap = generatePersonalizedRoadmap(techCareer, {
      traitProfile: { TE: 70, AN: 65 },
      progressState: {
        completedPhases: [1, 2, 3],
        completedSkills: allSkills.slice(0, 4),
        completedProjects: [],
        completedTasks: [],
      },
    });

    const recommendations = generateAdaptiveRecommendations(
      techCareer,
      roadmap,
      progress,
      { TE: 70, AN: 65 }
    );

    expect(recommendations.recommendations.length).toBeGreaterThan(0);
    expect(recommendations.primaryRecommendation).toBeDefined();
    expect(recommendations.primaryRecommendation.title).toBeTruthy();
    const hasProjectRec = recommendations.recommendations.some(
      (r) => r.type === "missing-project" || r.category === "build"
    );
    expect(hasProjectRec).toBe(true);
  });
});
