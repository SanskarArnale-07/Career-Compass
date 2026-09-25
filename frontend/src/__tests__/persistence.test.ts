import { describe, it, expect, beforeEach } from "vitest";
import {
  loadCareerJourney,
  saveCareerJourney,
  setSelectedCareer,
  resetCareerJourney,
  getHydratedJourneyState,
  STORAGE_KEYS,
} from "@/lib/persistence";

describe("Persistence & Storage Layer", () => {
  // In-memory mock localStorage
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
    // Mock global window and localStorage
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    };

    Object.defineProperty(global, "window", {
      value: { localStorage: mockStorage },
      writable: true,
      configurable: true,
    });
  });

  it("loads clean default state for first-time visitor", () => {
    const journey = loadCareerJourney();
    expect(journey.version).toBe(1);
    expect(journey.assessment.completed).toBe(false);
    expect(journey.assessment.results).toBeNull();
    expect(journey.assessment.traitProfile).toBeNull();
    expect(journey.selectedCareer.slug).toBe("software-development");
    expect(journey.progress.completedPhases).toEqual([]);
    expect(journey.progress.completedSkills).toEqual([]);
  });

  it("saves and reloads canonical journey data", () => {
    saveCareerJourney({
      selectedCareer: {
        slug: "software-development",
        title: "Software Development",
        careerName: "Software Development",
        category: "Technology",
        startedAt: 1726747200000,
        lastActiveAt: 1726747200000,
      },
      progress: {
        completedPhases: [1],
        completedSkills: ["prog-1"],
        completedProjects: [],
        completedTasks: [],
        weeklyPaceHours: 10,
        customTasks: [],
      },
    });

    const loaded = loadCareerJourney();
    expect(loaded.selectedCareer?.slug).toBe("software-development");
    expect(loaded.progress.completedPhases).toEqual([1]);
    expect(loaded.progress.completedSkills).toEqual(["prog-1"]);
  });

  it("switches career cleanly without stale title metadata", () => {
    // Select first career
    setSelectedCareer("software-development");
    let state = loadCareerJourney();
    expect(state.selectedCareer?.slug).toBe("software-development");
    expect(state.selectedCareer?.title).toBe("Software Development");

    // Switch to medicine
    setSelectedCareer("medicine-healthcare");
    state = loadCareerJourney();
    expect(state.selectedCareer?.slug).toBe("medicine-healthcare");
    expect(state.selectedCareer?.title).toBe("Medical & Healthcare Professional");
    expect(state.selectedCareer?.category).toBe("Healthcare & Life Sciences");
  });

  it("does not write to legacy keys by default", () => {
    saveCareerJourney({
      selectedCareer: {
        slug: "law-policy",
        title: "Legal & Policy Professional",
        careerName: "Law / Public Policy",
        category: "Law & Governance",
        startedAt: 1726747200000,
        lastActiveAt: 1726747200000,
      },
    });

    // Canonical key must exist
    expect(store[STORAGE_KEYS.JOURNEY_V1]).toBeDefined();
    // Legacy keys should NOT be written by default
    expect(store[STORAGE_KEYS.LEGACY_PROGRESS]).toBeUndefined();
    expect(store[STORAGE_KEYS.LEGACY_RESULTS]).toBeUndefined();
  });

  it("resets journey completely on resetCareerJourney()", () => {
    setSelectedCareer("engineering");
    expect(loadCareerJourney().selectedCareer.slug).toBe("engineering");

    resetCareerJourney();
    const clean = loadCareerJourney();
    expect(clean.assessment.completed).toBe(false);
    expect(clean.assessment.results).toBeNull();
    expect(clean.progress.completedPhases).toEqual([]);
    expect(clean.progress.completedSkills).toEqual([]);
  });

  it("hydrates full engine state from stored source data", () => {
    setSelectedCareer("design-creative");
    const hydrated = getHydratedJourneyState();
    expect(hydrated).toBeDefined();
    expect(hydrated?.activeCareer.slug).toBe("design-creative");
    expect(hydrated?.roadmap.phases.length).toBe(6);
    expect(hydrated?.readiness).toBeDefined();
    expect(hydrated?.recommendations).toBeDefined();
  });
});
