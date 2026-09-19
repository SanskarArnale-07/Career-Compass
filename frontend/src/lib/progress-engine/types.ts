/**
 * Career Progress & Readiness Engine — Types
 *
 * Defines the contract for transparent, multi-dimensional progress tracking
 * and career readiness evaluation.
 */

import type {
  CareerIntelligence,
  ProjectIdea,
  PreparationItem,
  ProjectDifficulty,
} from "../career-intelligence";
import type {
  PersonalizedRoadmap,
  RoadmapMilestone,
  ProgressionStage,
} from "../roadmap-engine";
import type {
  CareerReadinessResult,
  UserProgressState,
} from "../career-details/roadmap-intelligence";

export interface TierCoverage {
  total: number;
  completed: number;
  percentage: number;
}

export interface SkillProgressSummary {
  completedSkills: string[];
  incompleteSkills: string[];
  totalSkillsCount: number;
  completedSkillsCount: number;
  completionPercentage: number; // 0–100
  coverageByTier: {
    beginner: TierCoverage;
    intermediate: TierCoverage;
    advanced: TierCoverage;
  };
}

export interface StageMilestoneCoverage {
  total: number;
  completed: number;
  percentage: number;
}

export interface MilestoneProgressSummary {
  completedMilestones: string[];
  totalMilestonesCount: number;
  completedMilestonesCount: number;
  completionPercentage: number; // 0–100
  completedByStage: Record<ProgressionStage, StageMilestoneCoverage>;
  activeStage: ProgressionStage;
  nextMilestone: RoadmapMilestone | null;
}

export interface ProjectProgressSummary {
  completedProjects: string[];
  totalProjectsCount: number;
  completedProjectsCount: number;
  completionPercentage: number; // 0–100
  completedByDifficulty: Record<ProjectDifficulty, { total: number; completed: number }>;
  nextProjectToBuild: ProjectIdea | null;
}

export interface PreparationProgressSummary {
  completedTasks: string[];
  totalTasksCount: number;
  completedTasksCount: number;
  completionPercentage: number; // 0–100
  pendingTasks: PreparationItem[];
  isInternshipReady: boolean;
}

export interface RoadmapProgressSummary {
  completedPhases: number[];
  totalPhasesCount: number;
  completedPhasesCount: number;
  completionPercentage: number; // 0–100
  activePhaseNumber: number;
  activePhaseTitle: string;
}

export type IndicatorStatus = "unstarted" | "in-progress" | "proficient" | "mastered";

export interface ReadinessIndicator {
  id: string;
  label: string;
  status: IndicatorStatus;
  percentage: number; // 0–100
  detail: string;
  contributingFactors: string[];
}

export interface CareerReadinessReport {
  careerId: string;
  careerTitle: string;
  studentLevel: string;

  /** Transparent progress dimensions */
  skills: SkillProgressSummary;
  milestones: MilestoneProgressSummary;
  projects: ProjectProgressSummary;
  roadmap: RoadmapProgressSummary;
  preparation: PreparationProgressSummary;

  /** Multi-dimensional transparent readiness indicators */
  indicators: {
    foundations: ReadinessIndicator;
    skills: ReadinessIndicator;
    portfolio: ReadinessIndicator;
    preparation: ReadinessIndicator;
    overallReadiness: ReadinessIndicator;
  };

  /** Backward-compatible 3-pillar readiness model */
  compositeReadinessIndex: CareerReadinessResult;

  /** Career gateway qualifications */
  isJobReady: boolean;
  isInternshipReady: boolean;

  /** High-leverage next action summary */
  nextActionRationale: string;
}

export interface CalculateProgressInput {
  career: CareerIntelligence | string;
  traitProfile?: Record<string, number> | null;
  progress?: Partial<UserProgressState> | null;
  weeklyPaceHours?: number;
  roadmap?: PersonalizedRoadmap | null;
}
