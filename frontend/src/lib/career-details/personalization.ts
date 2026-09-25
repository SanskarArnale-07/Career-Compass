/**
 * Personalization — trait-based career detail enrichment.
 *
 * Pure functions.  No I/O, no side-effects.
 * Takes a user's trait profile + career detail and produces
 * personalized strengths, gaps, skill statuses, and explanations.
 */

import type { CareerDetail, SkillNode, SkillStatus, StrengthGapItem } from "./types";
import type { TraitProfile, CareerMatch as CareerMatchResult, AssessmentResponse as StoredResults } from "@/lib/types/assessment";
import { isStrongMatch, isExplorationMatch } from "@/lib/constants/matching";
export type { StrengthGapItem, TraitProfile, CareerMatchResult, StoredResults };

// Human-readable trait labels
const TRAIT_LABELS: Record<string, string> = {
  AN: "Analytical Thinking",
  TE: "Technical Aptitude",
  SC: "Scientific Curiosity",
  BU: "Business & Strategic Mindset",
  CR: "Creative Expression",
  SO: "Social & Interpersonal Skills",
  LE: "Leadership & Initiative",
  EX: "Exploration & Adaptability",
};

// ── Score → status mapping ─────────────────────────────────────────
function scoreToStatus(score: number): SkillStatus {
  if (score >= 60) return "strong";
  if (score >= 35) return "developing";
  return "needs-work";
}

// ── Personalized strengths & gaps ──────────────────────────────────

interface StrengthGapResult {
  strengths: StrengthGapItem[];
  gaps: StrengthGapItem[];
  summary: string;
}

/**
 * Analyse the user's trait profile against a career's primary traits
 * and produce personalised strength / gap items.
 */
export function getStrengthsAndGaps(
  traits: TraitProfile,
  career: CareerDetail
): StrengthGapResult {
  const traitEntries = Object.entries(traits) as [string, number][];
  const primarySet = new Set(career.primaryTraits);

  const strengths: StrengthGapItem[] = [];
  const gaps: StrengthGapItem[] = [];

  // Primary traits of this career
  for (const code of career.primaryTraits) {
    const score = (traits as Record<string, number>)[code] ?? 0;
    const status = scoreToStatus(score);
    const label = TRAIT_LABELS[code] || code;

    const item: StrengthGapItem = {
      title: label,
      status,
      explanation: buildTraitExplanation(code, score, career.title),
    };

    if (status === "strong" || status === "developing") {
      strengths.push(item);
    } else {
      gaps.push(item);
    }
  }

  // Also surface the user's highest non-primary traits as bonus strengths
  const sorted = traitEntries
    .filter(([code]) => !primarySet.has(code))
    .sort((a, b) => b[1] - a[1]);

  for (const [code, score] of sorted.slice(0, 2)) {
    if (score >= 50) {
      strengths.push({
        title: TRAIT_LABELS[code] || code,
        status: scoreToStatus(score),
        explanation: `Your ${(TRAIT_LABELS[code] || code).toLowerCase()} can complement your work in ${career.title}.`,
      });
    }
  }

  // Remaining low-scoring primary traits as gaps
  // (already handled above — add any relevant non-primary gaps)
  const relevantTraitCodes = new Set(
    career.skills.flatMap((s) => s.relevantTraits)
  );
  for (const [code, score] of traitEntries) {
    if (!primarySet.has(code) && relevantTraitCodes.has(code) && score < 35) {
      gaps.push({
        title: TRAIT_LABELS[code] || code,
        status: "needs-work",
        explanation: `Developing your ${(TRAIT_LABELS[code] || code).toLowerCase()} will help in certain aspects of ${career.title}.`,
      });
    }
  }

  // Build summary
  const strongCount = strengths.filter((s) => s.status === "strong").length;
  let summary: string;
  if (strongCount >= 2) {
    summary = `Your assessment shows strong alignment in ${strongCount} key areas for ${career.title}. You have a solid foundation to build on.`;
  } else if (strongCount === 1) {
    summary = `You have a strong foundation in one key area for ${career.title}, with several developing skills that can grow quickly.`;
  } else {
    summary = `Your assessment points to foundational strengths you can build on to explore ${career.title} further.`;
  }

  return { strengths, gaps, summary };
}

function buildTraitExplanation(
  traitCode: string,
  score: number,
  careerTitle: string
): string {
  const label = (TRAIT_LABELS[traitCode] || traitCode).toLowerCase();

  if (score >= 70) {
    return `You scored very strongly in ${label}, which is highly relevant to ${careerTitle}.`;
  }
  if (score >= 50) {
    return `You scored well in ${label}, giving you a good foundation for ${careerTitle}.`;
  }
  if (score >= 35) {
    return `Your ${label} is developing — focused practice will strengthen this for ${careerTitle}.`;
  }
  return `Building your ${label} will be important for success in ${careerTitle}.`;
}

// ── Skill status personalisation ───────────────────────────────────

export interface PersonalizedSkill extends SkillNode {
  status: SkillStatus;
}

/**
 * Assign a status to each skill node based on the user's trait profile.
 * Skills whose relevant traits are strong → "strong", etc.
 */
export function getPersonalizedSkills(
  traits: TraitProfile,
  career: CareerDetail
): PersonalizedSkill[] {
  return career.skills.map((skill) => {
    const traitScores = skill.relevantTraits.map(
      (code) => (traits as Record<string, number>)[code] ?? 0
    );
    const avgScore =
      traitScores.length > 0
        ? traitScores.reduce((a, b) => a + b, 0) / traitScores.length
        : 0;

    return {
      ...skill,
      status: scoreToStatus(avgScore),
    };
  });
}

function getCareerTraitPhrasing(primaryTraits: string[]): string {
  const traitMap: Record<string, string> = {
    TE: "technical",
    AN: "analytical",
    CR: "creative",
    BU: "business and strategic",
    SO: "social and interpersonal",
    LE: "leadership and execution",
    SC: "scientific inquiry",
    EX: "cross-disciplinary exploration",
  };
  const words = primaryTraits.map(
    (code) => traitMap[code] || (TRAIT_LABELS[code] || code).toLowerCase()
  );
  if (words.length >= 2) {
    return `${words[0]} and ${words[1]} thinking`;
  }
  if (words.length === 1) {
    return `${words[0]} thinking`;
  }
  return "core cognitive strengths";
}

/**
 * Build a personalized explanation for the career hero section.
 * Aligns strictly with canonical match classifications (Strong Match vs Worth Exploring).
 */
export function getMatchExplanation(
  traits: TraitProfile,
  career: CareerDetail,
  matchPercentage?: number
): string {
  const traitsText = getCareerTraitPhrasing(career.primaryTraits);

  if (typeof matchPercentage === "number") {
    if (isStrongMatch(matchPercentage)) {
      return `Your profile shows strong alignment with ${career.title}, particularly in ${traitsText}.`;
    }
    if (isExplorationMatch(matchPercentage)) {
      return `Your profile shows this is a direction worth exploring within ${career.title}, with developing alignment in ${traitsText}.`;
    }
  }

  // Fallback if matchPercentage is not available directly
  const strongTraits = career.primaryTraits
    .filter((code) => ((traits as Record<string, number>)[code] ?? 0) >= 40)
    .map((code) => (TRAIT_LABELS[code] || code).toLowerCase());

  if (strongTraits.length >= 1) {
    const traitStr = strongTraits.slice(0, 2).join(" and ");
    return `Your profile shows strong alignment with ${career.title}, particularly in ${traitStr}.`;
  }

  return `Your profile indicates an exploratory connection with ${career.title}, with meaningful potential to build foundational skills.`;
}

// ── Alternative careers from results ───────────────────────────────

export interface AlternativeCareer {
  careerName: string;
  slug: string;
  matchPercentage: number;
}
