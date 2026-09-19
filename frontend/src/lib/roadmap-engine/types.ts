/**
 * Personalized Roadmap Engine — Types
 *
 * Defines the contract for dynamic, context-aware career roadmaps.
 */

import type { ProjectIdea, LearningResource, CareerIntelligence } from "../career-intelligence";

export type ProgressionStage =
  | "foundation"
  | "core-skills"
  | "applied-skills"
  | "projects"
  | "advanced-skills"
  | "career-prep";

export type StudentLevel = "beginner" | "intermediate" | "advanced" | "job-ready";

export interface MilestoneEffort {
  hours: number;
  durationText: string;
}

export interface MilestoneCompletionState {
  isCompleted: boolean;
  isUnlocked: boolean;
  inProgress: boolean;
}

export interface MilestoneRelevance {
  priority: "critical" | "high" | "standard" | "fast-track";
  isGapRemedy: boolean;
  isFastTracked: boolean;
  reason: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseStage: ProgressionStage;
  title: string;
  description: string;
  skills: string[];
  projects?: ProjectIdea[];
  resources: LearningResource[];
  estimatedEffort: MilestoneEffort;
  prerequisites: string[];
  completionState: MilestoneCompletionState;
  relevance: MilestoneRelevance;
  order: number;
}

export interface PersonalizedRoadmapPhase {
  id: string;
  stage: ProgressionStage;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  estimatedWeeks: number;
  milestones: RoadmapMilestone[];
  isCompleted: boolean;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface RoadmapCompletionState {
  overallProgressPercent: number;
  completedMilestoneIds: string[];
  totalMilestonesCount: number;
  completedMilestonesCount: number;
  activeMilestoneId: string | null;
  activePhaseStage: ProgressionStage;
  nextMilestone: RoadmapMilestone | null;
}

export interface PersonalizedRoadmap {
  /** Deterministic identifier based on career and context digest */
  roadmapId: string;

  /** Career overview reference */
  career: {
    id: string;
    slug: string;
    title: string;
    category: string;
  };

  /** Student proficiency level derived from context */
  studentLevel: StudentLevel;

  /** Phased progression list (6 canonical stages) */
  phases: PersonalizedRoadmapPhase[];

  /** Flattened list of all milestones in sequence */
  milestones: RoadmapMilestone[];

  /** Skills coverage summary */
  skills: {
    totalCount: number;
    masteredCount: number;
    inProgressCount: number;
    gapRemedySkills: string[];
    acceleratedSkills: string[];
  };

  /** Project milestones with difficulty tiers */
  projects: {
    totalCount: number;
    completedCount: number;
    items: ProjectIdea[];
    nextProject: ProjectIdea | null;
  };

  /** Curated resources across all milestones */
  resources: LearningResource[];

  /** Overall estimated effort based on study pace */
  estimatedEffort: {
    totalHours: number;
    totalWeeks: number;
    weeklyHours: number;
  };

  /** Global prerequisite dependency map (milestoneId -> prerequisite milestoneIds) */
  prerequisites: Record<string, string[]>;

  /** Current completion and active progress state */
  completionState: RoadmapCompletionState;
}

export interface StoredProgressState {
  completedPhases?: number[];
  completedTasks?: string[];
  completedSkills?: string[];
  completedProjects?: string[];
  weeklyPaceHours?: number;
}

export interface GenerateRoadmapInput {
  career: CareerIntelligence | string;
  traitProfile?: Record<string, number> | null;
  progress?: StoredProgressState | null;
  weeklyPaceHours?: number;
}
