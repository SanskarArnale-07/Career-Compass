/**
 * Centralized Career Match & Recommendation Configuration
 *
 * Configurable thresholds and sorting utilities for assessment results.
 * Preserves mathematical score honesty with zero score inflation.
 */

export const CAREER_MATCH_THRESHOLD = 40;
export const CAREER_EXPLORATION_THRESHOLD = 25;
export const MAX_VISIBLE_CAREER_MATCHES = 3;

export interface TieredCareerMatches<T> {
  strongMatches: T[];
  explorationMatches: T[];
  allVisibleMatches: T[];
}

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

/**
 * Partitions career matches into a two-tier presentation system:
 * - Tier 1 — Strong Matches: match_percentage >= 40%
 * - Tier 2 — Worth Exploring: match_percentage >= 25% and < 40%, shown only if
 *   fewer than 3 careers qualify for the 40% threshold, up to a maximum of 3 total visible careers.
 *
 * Scoring integrity:
 * - Zero score inflation or rounding manipulation.
 * - Careers < 25% are strictly hidden.
 * - At most 3 total career paths are visible in the primary experience.
 */
export function getTieredCareerMatches<T extends { match_percentage: number }>(
  matches: T[],
  strongThreshold: number = CAREER_MATCH_THRESHOLD,
  explorationThreshold: number = CAREER_EXPLORATION_THRESHOLD,
  maxTotal: number = MAX_VISIBLE_CAREER_MATCHES
): TieredCareerMatches<T> {
  if (!matches || !Array.isArray(matches)) {
    return { strongMatches: [], explorationMatches: [], allVisibleMatches: [] };
  }

  const sorted = sortCareerMatches(matches);
  const strongCandidates = sorted.filter((m) => m.match_percentage >= strongThreshold);

  if (strongCandidates.length >= maxTotal) {
    const strong = strongCandidates.slice(0, maxTotal);
    return {
      strongMatches: strong,
      explorationMatches: [],
      allVisibleMatches: strong,
    };
  }

  const strongMatches = strongCandidates;
  const needed = maxTotal - strongMatches.length;

  const explorationCandidates = sorted.filter(
    (m) => m.match_percentage >= explorationThreshold && m.match_percentage < strongThreshold
  );

  const explorationMatches = explorationCandidates.slice(0, needed);
  const allVisibleMatches = [...strongMatches, ...explorationMatches];

  return {
    strongMatches,
    explorationMatches,
    allVisibleMatches,
  };
}
