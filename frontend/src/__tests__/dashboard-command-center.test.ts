import { describe, it, expect } from "vitest";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { generatePersonalizedRoadmap } from "@/lib/roadmap-engine";
import { calculateCareerProgressAndReadiness } from "@/lib/progress-engine";
import {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
} from "@/lib/recommendation-engine";
import {
  calculateTimeToReadiness,
  generateAdaptiveWeeklySprint,
} from "@/lib/career-details/roadmap-intelligence";
import { getPersonalizedSkills } from "@/lib/career-details/personalization";

describe("Dashboard Command Center & Information Architecture", () => {
  const career = getCareerIntelligence("software-development")!;
  const traitProfile = {
    AN: 80,
    TE: 85,
    SC: 70,
    BU: 50,
    CR: 40,
    SO: 60,
    LE: 55,
    EX: 65,
  };

  const progressState = {
    completedPhases: [1],
    completedTasks: ["prep_resume"],
    completedSkills: ["foundations-computer-science-fundamentals", "foundations-algorithms"],
    completedProjects: ["Developer Portfolio Site"],
    weeklyPaceHours: 10,
  };

  it("Level 1: resolves career identity and hierarchy domain correctly", () => {
    const hierarchy = getCareerHierarchy(career.slug);
    expect(hierarchy).not.toBeNull();
    expect(hierarchy?.domain.name).toBe("Engineering & Technology");
    expect(career.title).toBe("Software & App Developer");
  });

  it("Level 2: derives accurate roadmap progress and task counts without fake values", () => {
    const roadmap = generatePersonalizedRoadmap({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
    });

    const report = calculateCareerProgressAndReadiness({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
      roadmap,
    });

    expect(report.milestones.totalMilestonesCount).toBeGreaterThan(0);
    expect(report.roadmap.completionPercentage).toBeGreaterThanOrEqual(0);
    expect(report.roadmap.completionPercentage).toBeLessThanOrEqual(100);
    expect(report.roadmap.activePhaseNumber).toBe(2);
  });

  it("Level 3: derives Current Focus and integrates Next Best Action", () => {
    const roadmap = generatePersonalizedRoadmap({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
    });

    const report = calculateCareerProgressAndReadiness({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
      roadmap,
    });

    const recs = generateAdaptiveRecommendations({
      career,
      traitProfile,
      progress: progressState,
      roadmap,
      progressReport: report,
      weeklyPaceHours: 10,
    });

    const nextAction = mapRecommendationToNextBestAction(recs.primaryRecommendation);

    expect(nextAction).toBeDefined();
    expect(nextAction.title.length).toBeGreaterThan(0);
    expect(nextAction.actionText.length).toBeGreaterThan(0);
    expect(nextAction.estimatedTime.length).toBeGreaterThan(0);
    expect(nextAction.reasoning.length).toBeGreaterThan(0);
  });

  it("Level 4: derives compact top active skills and secondary readiness indicator", () => {
    const personalizedSkills = getPersonalizedSkills(traitProfile, career);
    expect(personalizedSkills.length).toBeGreaterThanOrEqual(5);

    const top5 = personalizedSkills.slice(0, 5);
    expect(top5.length).toBe(5);

    // Each skill has personalized status
    top5.forEach((skill) => {
      expect(["strong", "developing", "needs-work"]).toContain(skill.status);
    });

    const roadmap = generatePersonalizedRoadmap({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
    });

    const report = calculateCareerProgressAndReadiness({
      career,
      traitProfile,
      progress: progressState,
      weeklyPaceHours: 10,
      roadmap,
    });

    const readiness = report.compositeReadinessIndex;
    expect(readiness.overallScore).toBeGreaterThanOrEqual(0);
    expect(readiness.overallScore).toBeLessThanOrEqual(100);
    expect(readiness.pillars.foundations).toBeDefined();
    expect(readiness.pillars.skills).toBeDefined();
    expect(readiness.pillars.portfolio).toBeDefined();
  });

  it("Compact Study Pace: computes remaining timeline for Fast, Balanced, Steady", () => {
    const steadyPace = calculateTimeToReadiness(career, progressState, 5);
    const balancedPace = calculateTimeToReadiness(career, progressState, 10);
    const fastPace = calculateTimeToReadiness(career, progressState, 15);

    expect(fastPace.remainingWeeks).toBeLessThan(steadyPace.remainingWeeks);
    expect(balancedPace.remainingWeeks).toBeLessThanOrEqual(steadyPace.remainingWeeks);
    expect(fastPace.targetMonthYear).toBeDefined();
    expect(balancedPace.targetMonthYear).toBeDefined();
    expect(steadyPace.targetMonthYear).toBeDefined();
  });

  it("Adaptive Sprint: generates milestones without requiring full expanded view by default", () => {
    const sprintTasks = generateAdaptiveWeeklySprint(career, traitProfile, progressState);
    expect(sprintTasks.length).toBeGreaterThan(0);
    expect(sprintTasks[0].title).toBeDefined();
    expect(sprintTasks[0].priority).toBeDefined();
  });
});
