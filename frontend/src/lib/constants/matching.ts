/**
 * Centralized Career Match & Recommendation Configuration
 *
 * Configurable thresholds and sorting utilities for assessment results.
 * Preserves mathematical score honesty with zero score inflation.
 */

export const CAREER_MATCH_THRESHOLD = 40;

/**
 * Filters career matches to only those meeting or exceeding the minimum threshold.
 * Original calculated scores are strictly preserved.
 */
export function filterQualifiedMatches<T extends { match_percentage: number }>(
  matches: T[],
  threshold: number = CAREER_MATCH_THRESHOLD
): T[] {
  if (!matches || !Array.isArray(matches)) return [];
  return matches.filter((item) => item.match_percentage >= threshold);
}

/**
 * Sorts career matches in descending order by original match percentage.
 */
export function sortCareerMatches<T extends { match_percentage: number }>(
  matches: T[]
): T[] {
  if (!matches || !Array.isArray(matches)) return [];
  return [...matches].sort((a, b) => b.match_percentage - a.match_percentage);
}

/**
 * Filters and sorts career matches in one clean operation.
 */
export function getRecommendedCareers<T extends { match_percentage: number }>(
  matches: T[],
  threshold: number = CAREER_MATCH_THRESHOLD
): T[] {
  return sortCareerMatches(filterQualifiedMatches(matches, threshold));
}
