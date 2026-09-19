/**
 * Career Progress & Readiness Engine — Public API
 *
 * Single export point for deterministic progress calculations and multi-dimensional
 * readiness assessments across Career Compass.
 */

import {
  calculateCareerProgressAndReadiness,
  calculateSkillProgress,
  calculateMilestoneProgress,
  calculateProjectProgress,
  calculatePreparationProgress,
  calculateRoadmapProgress,
  calculateTransparentReadinessIndicators,
  deriveIndicatorStatus,
} from "./engine";

export * from "./types";
export {
  calculateCareerProgressAndReadiness,
  calculateSkillProgress,
  calculateMilestoneProgress,
  calculateProjectProgress,
  calculatePreparationProgress,
  calculateRoadmapProgress,
  calculateTransparentReadinessIndicators,
  deriveIndicatorStatus,
};
