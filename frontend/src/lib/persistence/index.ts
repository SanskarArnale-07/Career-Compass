/**
 * Career Journey Persistence — Public API
 *
 * Single export point for persistent user and career state in Career Compass.
 */

export * from "./types";
export {
  JOURNEY_STORAGE_KEY,
  LEGACY_PROGRESS_KEY,
  LEGACY_RESULTS_KEY,
  LEGACY_ASSESSMENT_KEY,
  isStorageAvailable,
  getDefaultJourneyState,
  loadCareerJourney,
  saveCareerJourney,
  updateCareerProgress,
  setSelectedCareer,
  saveAssessmentResult,
  resetCareerJourney,
  getHydratedJourneyState,
} from "./storage";
