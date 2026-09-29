/**
 * Centralized Career Match & Recommendation Configuration
 *
 * Configurable thresholds and sorting utilities for assessment results.
 * Preserves mathematical score honesty with zero score inflation.
 *
 * Interpretation Bands:
 * - >= 60% → "WORTH EXPLORING"
 * - 40–59% → "MAYBE EXPLORE"
 * - < 40% → do not actively recommend/expose as a primary match
 */

export const CAREER_MATCH_THRESHOLD = 60;
export const CAREER_EXPLORATION_THRESHOLD = 40;
export const MAX_VISIBLE_CAREER_MATCHES = 3;

/**
 * Static theoretical maxima for the 12 assessment career clusters.
 * Derived deterministically from the 28 single-choice questions.
 */
export const CAREER_THEORETICAL_MAX: Record<string, number> = {
  "Software / App Development": 82.66,
  "AI / Machine Learning / Data Science": 68.11,
  "Engineering": 69.31,
  "Medicine / Healthcare": 65.43,
  "Scientific Research": 86.36,
  "Finance / Investment Banking": 78.62,
  "Entrepreneurship": 89.97,
  "Management / Product Management": 71.66,
  "Marketing / Media / Communications": 51.94,
  "Design / Creative Arts": 69.07,
  "Law / Public Policy": 59.11,
  "Psychology / Social Impact": 60.07,
};

/**
 * Calibrates a raw career match percentage to a true 0–100 scale using the
 * scoring system's static theoretical maximum for that career.
 * If the score is already calibrated (or no theoretical max is defined),
 * it preserves the score.
 */
export function calibrateCareerScore(careerName: string, score: number): number {
  const max = CAREER_THEORETICAL_MAX[careerName];
  if (!max || max >= 100) return score;
  if (score > max) return score; // Already calibrated/normalized
  return Math.min(100, Math.round(((score / max) * 100) * 10) / 10);
}

export interface TieredCareerMatches<T> {
  strongMatches: T[];
  explorationMatches: T[];
  allVisibleMatches: T[];
}

/**
 * Evaluates whether a score qualifies as Worth Exploring (>= 60%).
 */
export function isStrongMatch(score: number): boolean {
  return score >= CAREER_MATCH_THRESHOLD;
}

/**
 * Evaluates whether a score qualifies as Maybe Explore (40% <= score < 60%).
 */
export function isExplorationMatch(score: number): boolean {
  return score >= CAREER_EXPLORATION_THRESHOLD && score < CAREER_MATCH_THRESHOLD;
}

export type MatchTier = "worth_exploring" | "maybe_explore" | "hidden";

/**
 * Determines the canonical tier for a given score.
 */
export function getMatchTier(score: number): MatchTier {
  if (score >= CAREER_MATCH_THRESHOLD) return "worth_exploring";
  if (score >= CAREER_EXPLORATION_THRESHOLD) return "maybe_explore";
  return "hidden";
}

/**
 * Returns the human-readable canonical tier label.
 * - >= 60% → "WORTH EXPLORING"
 * - 40–59% → "MAYBE EXPLORE"
 * - < 40% → "" (not actively recommended)
 */
export function getMatchTierLabel(score: number): "WORTH EXPLORING" | "MAYBE EXPLORE" | "" {
  const tier = getMatchTier(score);
  if (tier === "worth_exploring") return "WORTH EXPLORING";
  if (tier === "maybe_explore") return "MAYBE EXPLORE";
  return "";
}

/**
 * Filters career matches to only those meeting or exceeding the minimum threshold (>= 40%).
 * Original calculated scores are strictly preserved.
 */
export function filterQualifiedMatches<T extends { match_percentage: number }>(
  matches: T[],
  threshold: number = CAREER_EXPLORATION_THRESHOLD
): T[] {
  if (!matches || !Array.isArray(matches)) return [];
  return matches.filter((item) => item.match_percentage >= threshold);
}

/**
 * Sorts career matches in descending order by match percentage.
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
  threshold: number = CAREER_EXPLORATION_THRESHOLD
): T[] {
  return sortCareerMatches(filterQualifiedMatches(matches, threshold));
}

/**
 * Partitions career matches into a two-tier presentation system:
 * - Tier 1 — Worth Exploring: match_percentage >= 60%
 * - Tier 2 — Maybe Explore: match_percentage >= 40% and < 60%, shown only if
 *   fewer than 3 careers qualify for the 60% threshold, up to a maximum of 3 total visible careers.
 *
 * Scoring integrity:
 * - Zero artificial score inflation.
 * - Careers < 40% are strictly excluded from active recommendation.
 * - At most 3 total career paths are visible in the primary experience.
 */
export function getTieredCareerMatches<T extends { match_percentage: number; career_name?: string }>(
  matches: T[],
  strongThreshold: number = CAREER_MATCH_THRESHOLD,
  explorationThreshold: number = CAREER_EXPLORATION_THRESHOLD,
  maxTotal: number = MAX_VISIBLE_CAREER_MATCHES
): TieredCareerMatches<T> {
  if (!matches || !Array.isArray(matches)) {
    return { strongMatches: [], explorationMatches: [], allVisibleMatches: [] };
  }

  const sorted = sortCareerMatches(matches);
  const strongCandidates = sorted.filter((m) => isStrongMatch(m.match_percentage));

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

  const explorationCandidates = sorted.filter((m) => isExplorationMatch(m.match_percentage));

  const explorationMatches = explorationCandidates.slice(0, needed);
  const allVisibleMatches = [...strongMatches, ...explorationMatches];

  return {
    strongMatches,
    explorationMatches,
    allVisibleMatches,
  };
}
