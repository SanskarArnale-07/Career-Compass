/**
 * Personalized Roadmap Engine — Public API
 *
 * Single export point for personalized career roadmaps in Career Compass.
 */

import { generatePersonalizedRoadmap } from "./engine";
import type {
  PersonalizedRoadmap,
  RoadmapMilestone,
  ProgressionStage,
} from "./types";

export * from "./types";
export { generatePersonalizedRoadmap };

/**
 * Convenience helper: Retrieve milestones belonging to a specific stage.
 */
export function getMilestonesByStage(
  roadmap: PersonalizedRoadmap,
  stage: ProgressionStage
): RoadmapMilestone[] {
  return roadmap.milestones.filter((m) => m.phaseStage === stage);
}

/**
 * Convenience helper: Returns the immediate active/uncompleted milestone.
 */
export function getNextRoadmapMilestone(
  roadmap: PersonalizedRoadmap
): RoadmapMilestone | null {
  return roadmap.completionState.nextMilestone;
}

/**
 * Convenience helper: Generate a personalized roadmap directly from coach/dashboard context.
 */
export function getPersonalizedRoadmapForContext(params: {
  careerSlug: string;
  traitProfile?: Record<string, number> | null;
  progressState?: {
    completedPhases?: number[];
    completedTasks?: string[];
    completedSkills?: string[];
    completedProjects?: string[];
    weeklyPaceHours?: number;
  } | null;
  weeklyPaceHours?: number;
}): PersonalizedRoadmap {
  return generatePersonalizedRoadmap({
    career: params.careerSlug,
    traitProfile: params.traitProfile,
    progress: params.progressState,
    weeklyPaceHours: params.weeklyPaceHours,
  });
}
