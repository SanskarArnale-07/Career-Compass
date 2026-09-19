/**
 * Career Journey Persistence Engine — Implementation
 *
 * Implements:
 * - Minimum necessary source data persistence
 * - On-demand calculation of derived data (roadmaps, readiness, recommendations)
 * - Automatic migration from legacy keys (careerCompassProgress, careerCompassResults)
 * - Safe memory fallback for SSR / disabled storage
 * - Dual-sync for backward compatibility
 * - Graceful failure handling
 */

import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
} from "../career-intelligence";
import {
  generatePersonalizedRoadmap,
  type PersonalizedRoadmap,
} from "../roadmap-engine";
import {
  calculateCareerProgressAndReadiness,
  type CareerReadinessReport,
} from "../progress-engine";
import {
  generateAdaptiveRecommendations,
  type AdaptiveRecommendationsResult,
} from "../recommendation-engine";
import {
  buildCareerContext,
  type CareerCoachContext,
} from "../career-details/career-context";
import type { StoredResults } from "../career-details/personalization";
import type {
  CareerJourneySourceData,
  HydratedJourneyState,
  SaveJourneyOptions,
  UserProgressSourceData,
} from "./types";

export const JOURNEY_STORAGE_KEY = "career_compass_journey_v1";
export const LEGACY_PROGRESS_KEY = "careerCompassProgress";
export const LEGACY_RESULTS_KEY = "careerCompassResults";
export const LEGACY_ASSESSMENT_KEY = "careerCompassAssessment";

export const STORAGE_KEYS = {
  JOURNEY_V1: JOURNEY_STORAGE_KEY,
  LEGACY_PROGRESS: LEGACY_PROGRESS_KEY,
  LEGACY_RESULTS: LEGACY_RESULTS_KEY,
  LEGACY_ASSESSMENT: LEGACY_ASSESSMENT_KEY,
} as const;

// ── In-Memory Fallback Store (SSR / Incognito / Quota Exceeded) ──────

const memoryStore: Record<string, string> = {};

export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__cc_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function getItem(key: string): string | null {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStore[key] ?? null;
    }
  }
  return memoryStore[key] ?? null;
}

function setItem(key: string, value: string): boolean {
  memoryStore[key] = value;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("localStorage quota exceeded or disabled, using in-memory store", e);
      return false;
    }
  }
  return true;
}

function removeItem(key: string): void {
  delete memoryStore[key];
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

// ── Default State ──────────────────────────────────────────────────

export function getDefaultJourneyState(): CareerJourneySourceData {
  const fallbackCareer = getAllCareerIntelligence()[0] || {
    id: "software-development",
    slug: "software-development",
    title: "Software & App Developer",
    careerName: "Software & App Developer",
  };

  const now = Date.now();

  return {
    version: 1,
    assessment: {
      completed: false,
      results: null,
      traitProfile: null,
    },
    selectedCareer: {
      slug: fallbackCareer.slug,
      title: fallbackCareer.title,
      careerName: fallbackCareer.careerName,
      category: fallbackCareer.category,
      startedAt: now,
      lastActiveAt: now,
    },
    progress: {
      completedPhases: [],
      completedTasks: [],
      completedSkills: [],
      completedProjects: [],
      weeklyPaceHours: 10,
      customTasks: [],
    },
    preferences: {
      lastViewedMilestoneId: null,
      dismissedRecommendationIds: [],
    },
  };
}

// ── Legacy Migration Engine ────────────────────────────────────────

function migrateFromLegacy(): CareerJourneySourceData | null {
  try {
    let hasLegacy = false;
    const defaultState = getDefaultJourneyState();

    // 1. Check legacy progress
    const legacyProgStr = getItem(LEGACY_PROGRESS_KEY);
    if (legacyProgStr) {
      hasLegacy = true;
      const parsedProg = JSON.parse(legacyProgStr);
      if (parsedProg.currentCareer?.slug) {
        defaultState.selectedCareer.slug = parsedProg.currentCareer.slug;
        defaultState.selectedCareer.title = parsedProg.currentCareer.title || defaultState.selectedCareer.title;
        defaultState.selectedCareer.careerName = parsedProg.currentCareer.careerName || defaultState.selectedCareer.careerName;
        defaultState.selectedCareer.startedAt = parsedProg.currentCareer.startedAt || defaultState.selectedCareer.startedAt;
      }
      if (Array.isArray(parsedProg.completedPhases)) {
        defaultState.progress.completedPhases = parsedProg.completedPhases;
      }
      if (Array.isArray(parsedProg.completedTasks)) {
        defaultState.progress.completedTasks = parsedProg.completedTasks;
      }
      if (Array.isArray(parsedProg.completedSkills)) {
        defaultState.progress.completedSkills = parsedProg.completedSkills;
      }
      if (Array.isArray(parsedProg.completedProjects)) {
        defaultState.progress.completedProjects = parsedProg.completedProjects;
      }
      if (typeof parsedProg.weeklyPaceHours === "number") {
        defaultState.progress.weeklyPaceHours = parsedProg.weeklyPaceHours;
      }
      if (Array.isArray(parsedProg.customTasks)) {
        defaultState.progress.customTasks = parsedProg.customTasks;
      }
    }

    // 2. Check legacy results (sessionStorage or localStorage)
    let legacyResultsStr = getItem(LEGACY_RESULTS_KEY);
    if (!legacyResultsStr && typeof window !== "undefined") {
      try {
        legacyResultsStr = window.sessionStorage?.getItem(LEGACY_RESULTS_KEY);
      } catch {
        // ignore
      }
    }

    if (legacyResultsStr) {
      hasLegacy = true;
      const parsedResults = JSON.parse(legacyResultsStr);
      defaultState.assessment = {
        completed: true,
        results: parsedResults,
        traitProfile: parsedResults.trait_profile || null,
        completedAt: Date.now(),
      };

      // If user hadn't explicitly chosen a career, use top match from assessment
      if (!legacyProgStr && parsedResults.top_careers?.[0]?.career_name) {
        const topCareerName = parsedResults.top_careers[0].career_name;
        const match = resolveCareerIntelligence(topCareerName);
        if (match) {
          defaultState.selectedCareer.slug = match.slug;
          defaultState.selectedCareer.title = match.title;
          defaultState.selectedCareer.careerName = match.careerName;
        }
      }
    }

    // 3. Check legacy survey answers
    let legacyAnswersStr = getItem(LEGACY_ASSESSMENT_KEY);
    if (!legacyAnswersStr && typeof window !== "undefined") {
      try {
        legacyAnswersStr = window.sessionStorage?.getItem(LEGACY_ASSESSMENT_KEY);
      } catch {
        // ignore
      }
    }
    if (legacyAnswersStr) {
      hasLegacy = true;
      defaultState.assessment.answers = JSON.parse(legacyAnswersStr);
    }

    if (hasLegacy) {
      // Save the synthesized v1 journey
      setItem(JOURNEY_STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }
  } catch (e) {
    console.warn("Legacy migration failed safely:", e);
  }

  return null;
}

// ── Master Load & Save Functions ───────────────────────────────────

/**
 * Load persistent Career Journey source data.
 * Safely handles missing data, legacy migration, and corrupted storage.
 */
export function loadCareerJourney(): CareerJourneySourceData {
  try {
    const raw = getItem(JOURNEY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) {
        return {
          version: 1,
          assessment: {
            completed: !!parsed.assessment?.completed,
            results: parsed.assessment?.results || null,
            traitProfile: parsed.assessment?.traitProfile || parsed.assessment?.results?.trait_profile || null,
            answers: parsed.assessment?.answers,
            completedAt: parsed.assessment?.completedAt,
          },
          selectedCareer: {
            slug: parsed.selectedCareer?.slug || "software-development",
            title: parsed.selectedCareer?.title || "Software & App Developer",
            careerName: parsed.selectedCareer?.careerName || "Software & App Developer",
            category: parsed.selectedCareer?.category,
            startedAt: parsed.selectedCareer?.startedAt || Date.now(),
            lastActiveAt: parsed.selectedCareer?.lastActiveAt || Date.now(),
          },
          progress: {
            completedPhases: Array.isArray(parsed.progress?.completedPhases) ? parsed.progress.completedPhases : [],
            completedTasks: Array.isArray(parsed.progress?.completedTasks) ? parsed.progress.completedTasks : [],
            completedSkills: Array.isArray(parsed.progress?.completedSkills) ? parsed.progress.completedSkills : [],
            completedProjects: Array.isArray(parsed.progress?.completedProjects) ? parsed.progress.completedProjects : [],
            weeklyPaceHours: typeof parsed.progress?.weeklyPaceHours === "number" ? parsed.progress.weeklyPaceHours : 10,
            customTasks: Array.isArray(parsed.progress?.customTasks) ? parsed.progress.customTasks : [],
          },
          preferences: {
            lastViewedMilestoneId: parsed.preferences?.lastViewedMilestoneId || null,
            dismissedRecommendationIds: Array.isArray(parsed.preferences?.dismissedRecommendationIds)
              ? parsed.preferences.dismissedRecommendationIds
              : [],
          },
        };
      }
    }

    // Attempt migration from legacy storage if no v1 journey exists yet
    const migrated = migrateFromLegacy();
    if (migrated) return migrated;

    // Default virgin state
    return getDefaultJourneyState();
  } catch (e) {
    console.error("Failed to load career journey, using safe default state:", e);
    return getDefaultJourneyState();
  }
}

/**
 * Save persistent Career Journey source data.
 * Merges updates, updates activity timestamp, and syncs legacy keys.
 */
export function saveCareerJourney(
  updates: Partial<CareerJourneySourceData>,
  options?: SaveJourneyOptions
): boolean {
  try {
    const current = loadCareerJourney();

    const merged: CareerJourneySourceData = {
      version: 1,
      assessment: {
        ...current.assessment,
        ...(updates.assessment || {}),
      },
      selectedCareer: {
        ...current.selectedCareer,
        ...(updates.selectedCareer || {}),
        lastActiveAt: Date.now(),
      },
      progress: {
        ...current.progress,
        ...(updates.progress || {}),
      },
      preferences: {
        ...current.preferences,
        ...(updates.preferences || {}),
      },
    };

    const saved = setItem(JOURNEY_STORAGE_KEY, JSON.stringify(merged));

    // Legacy key sync: disabled by default to prevent data divergence.
    // Legacy reads for migration remain active in migrateFromLegacy().
    // Opt in explicitly with { syncLegacyKeys: true } if needed.
    if (options?.syncLegacyKeys === true) {
      try {
        const legacyProg = {
          currentCareer: {
            slug: merged.selectedCareer.slug,
            title: merged.selectedCareer.title,
            careerName: merged.selectedCareer.careerName,
            startedAt: merged.selectedCareer.startedAt,
          },
          completedPhases: merged.progress.completedPhases,
          completedTasks: merged.progress.completedTasks,
          completedSkills: merged.progress.completedSkills,
          completedProjects: merged.progress.completedProjects,
          weeklyPaceHours: merged.progress.weeklyPaceHours,
          customTasks: merged.progress.customTasks,
        };
        setItem(LEGACY_PROGRESS_KEY, JSON.stringify(legacyProg));

        if (merged.assessment.results) {
          const resStr = JSON.stringify(merged.assessment.results);
          setItem(LEGACY_RESULTS_KEY, resStr);
          if (typeof window !== "undefined") {
            try {
              window.sessionStorage?.setItem(LEGACY_RESULTS_KEY, resStr);
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore legacy sync failures
      }
    }

    return saved;
  } catch (e) {
    console.error("Failed to save career journey:", e);
    return false;
  }
}

// ── Specialized Mutation Helpers ───────────────────────────────────

/**
 * Update user progress state (phases, tasks, skills, projects, pace).
 */
export function updateCareerProgress(
  updates: Partial<UserProgressSourceData>
): CareerJourneySourceData {
  const current = loadCareerJourney();
  const nextProgress: UserProgressSourceData = {
    ...current.progress,
    ...updates,
  };
  saveCareerJourney({ progress: nextProgress });
  return loadCareerJourney();
}

/**
 * Switch or set the active career track.
 * Preserves progress history and assessment data.
 */
export function setSelectedCareer(careerSlug: string): CareerJourneySourceData {
  const current = loadCareerJourney();
  const intel: CareerIntelligence | undefined = resolveCareerIntelligence(careerSlug);

  const canonicalSlug = intel?.slug || careerSlug;
  const title = intel?.title || careerSlug;
  const careerName = intel?.careerName || title;
  const isSameCareer = current.selectedCareer.slug === canonicalSlug;

  const nextSelected = {
    slug: canonicalSlug,
    title,
    careerName,
    category: intel?.category,
    startedAt: isSameCareer ? current.selectedCareer.startedAt : Date.now(),
    lastActiveAt: Date.now(),
  };

  saveCareerJourney({ selectedCareer: nextSelected });
  return loadCareerJourney();
}

/**
 * Save assessment survey answers and scoring result.
 */
export function saveAssessmentResult(
  results: StoredResults,
  answers?: Record<string, string | number>
): CareerJourneySourceData {
  const current = loadCareerJourney();

  let autoSelectedSlug = current.selectedCareer.slug;
  if (!current.assessment.completed && results.top_careers?.[0]?.career_name) {
    const topName = results.top_careers[0].career_name;
    const match = resolveCareerIntelligence(topName);
    if (match) autoSelectedSlug = match.slug;
  }

  const intel = resolveCareerIntelligence(autoSelectedSlug);

  saveCareerJourney({
    assessment: {
      completed: true,
      results,
      traitProfile: results.trait_profile || null,
      answers: answers || current.assessment.answers,
      completedAt: Date.now(),
    },
    selectedCareer: {
      slug: autoSelectedSlug,
      title: intel?.title || autoSelectedSlug,
      careerName: intel?.careerName || autoSelectedSlug,
      startedAt: current.selectedCareer.startedAt,
      lastActiveAt: Date.now(),
    },
  });

  return loadCareerJourney();
}

/**
 * Reset career journey state.
 * By default resets progress while optionally preserving assessment traits.
 */
export function resetCareerJourney(options?: {
  keepAssessment?: boolean;
}): CareerJourneySourceData {
  const current = loadCareerJourney();
  const defaultState = getDefaultJourneyState();

  const nextState: CareerJourneySourceData = {
    ...defaultState,
    assessment: options?.keepAssessment
      ? current.assessment
      : defaultState.assessment,
    selectedCareer: {
      ...defaultState.selectedCareer,
      slug: current.selectedCareer.slug,
      title: current.selectedCareer.title,
      careerName: current.selectedCareer.careerName,
    },
  };

  setItem(JOURNEY_STORAGE_KEY, JSON.stringify(nextState));

  // Sync / remove legacy keys
  try {
    removeItem(LEGACY_PROGRESS_KEY);
    if (!options?.keepAssessment) {
      removeItem(LEGACY_RESULTS_KEY);
      removeItem(LEGACY_ASSESSMENT_KEY);
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage?.removeItem(LEGACY_RESULTS_KEY);
          window.sessionStorage?.removeItem(LEGACY_ASSESSMENT_KEY);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  return nextState;
}

// ── On-Demand Hydration Engine (DERIVED DATA) ───────────────────────

/**
 * Derives dynamic roadmaps, progress metrics, and recommendations
 * directly on-the-fly from persistent source data.
 * Guarantees zero stale duplication of derived data.
 */
export function getHydratedJourneyState(): HydratedJourneyState {
  const source = loadCareerJourney();
  const career = resolveCareerIntelligence(source.selectedCareer.slug) || getAllCareerIntelligence()[0];

  const traits = source.assessment.traitProfile;
  const progressState = {
    completedPhases: source.progress.completedPhases,
    completedTasks: source.progress.completedTasks,
    completedSkills: source.progress.completedSkills,
    completedProjects: source.progress.completedProjects,
    weeklyPaceHours: source.progress.weeklyPaceHours,
  };

  // 1. Derive Roadmap Plan
  const roadmap: PersonalizedRoadmap = generatePersonalizedRoadmap({
    career,
    traitProfile: traits,
    progress: progressState,
    weeklyPaceHours: progressState.weeklyPaceHours,
  });

  // 2. Derive Progress & Readiness Report
  const readiness: CareerReadinessReport = calculateCareerProgressAndReadiness({
    career,
    traitProfile: traits,
    progress: progressState,
    roadmap,
    weeklyPaceHours: progressState.weeklyPaceHours,
  });

  // 3. Derive Adaptive Recommendations
  const recommendations: AdaptiveRecommendationsResult = generateAdaptiveRecommendations({
    career,
    traitProfile: traits,
    progress: progressState,
    roadmap,
    progressReport: readiness,
    weeklyPaceHours: progressState.weeklyPaceHours,
  });

  // 4. Derive Career Context for Coach & Dashboard
  const context: CareerCoachContext = buildCareerContext({
    careerSlug: source.selectedCareer.slug,
    storedProgress: {
      currentCareer: {
        slug: source.selectedCareer.slug,
        title: source.selectedCareer.title,
        careerName: source.selectedCareer.careerName,
        startedAt: source.selectedCareer.startedAt,
      },
      completedPhases: source.progress.completedPhases,
      completedTasks: source.progress.completedTasks,
      completedSkills: source.progress.completedSkills,
      completedProjects: source.progress.completedProjects,
      weeklyPaceHours: source.progress.weeklyPaceHours,
      customTasks: source.progress.customTasks,
    },
    storedResults: source.assessment.results,
  });

  return {
    source,
    activeCareer: career,
    context,
    roadmap,
    readiness,
    recommendations,
  };
}
