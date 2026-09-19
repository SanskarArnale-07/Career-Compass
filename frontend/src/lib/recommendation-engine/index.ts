/**
 * Adaptive Recommendation Engine — Public API
 *
 * Single export point for explainable, deterministic career recommendations
 * across Career Compass.
 */

import {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
} from "./engine";
import type {
  GenerateRecommendationsInput,
  AdaptiveRecommendation,
} from "./types";

export * from "./types";
export {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
};

/**
 * Convenience helper: Retrieve the single highest-priority recommendation.
 */
export function getPrimaryAdaptiveRecommendation(
  input: GenerateRecommendationsInput
): AdaptiveRecommendation {
  return generateAdaptiveRecommendations(input).primaryRecommendation;
}
