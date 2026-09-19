/**
 * Career Journey Persistence — Types
 *
 * Defines the strict separation between:
 * 1. SOURCE DATA: minimal persistent state of user choices & completions
 * 2. DERIVED DATA: dynamic calculations from intelligence, context, and roadmap engines
 */

import type { StoredResults, TraitProfile } from "../career-details/personalization";
import type { CareerCoachContext } from "../career-details/career-context";
import type { CareerReadinessReport } from "../progress-engine";
import type { AdaptiveRecommendationsResult } from "../recommendation-engine";
import type { PersonalizedRoadmap } from "../roadmap-engine";

export interface CustomTaskItem {
  id: string;
  text: string;
  category: string;
  done: boolean;
  createdAt?: number;
}

export interface UserAssessmentSourceData {
  completed: boolean;
  results: StoredResults | null;
  traitProfile: TraitProfile | null;
  answers?: Record<string, string | number>;
  completedAt?: number;
}

export interface UserCareerTargetSourceData {
  slug: string;
  title: string;
  careerName: string;
  startedAt: number;
  lastActiveAt: number;
}

export interface UserProgressSourceData {
  completedPhases: number[];
  completedTasks: string[];
  completedSkills: string[];
  completedProjects: string[];
  weeklyPaceHours: number;
  customTasks: CustomTaskItem[];
}

export interface UserPreferencesSourceData {
  lastViewedMilestoneId?: string | null;
  dismissedRecommendationIds?: string[];
}

/**
 * The canonical source-of-truth persistent state.
 * Only stores what the user actually chose or completed.
 * Derived metrics are calculated on-the-fly.
 */
export interface CareerJourneySourceData {
  version: 1;
  assessment: UserAssessmentSourceData;
  selectedCareer: UserCareerTargetSourceData;
  progress: UserProgressSourceData;
  preferences: UserPreferencesSourceData;
}

/**
 * Hydrated state returned when engines calculate derived values
 * from the persistent source data.
 */
export interface HydratedJourneyState {
  source: CareerJourneySourceData;
  context: CareerCoachContext;
  roadmap: PersonalizedRoadmap;
  readiness: CareerReadinessReport;
  recommendations: AdaptiveRecommendationsResult;
}

export interface SaveJourneyOptions {
  syncLegacyKeys?: boolean;
}
