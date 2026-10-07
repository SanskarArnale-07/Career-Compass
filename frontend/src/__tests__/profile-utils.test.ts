import { describe, it, expect } from "vitest";
import {
  deriveStudentPersona,
  deriveStreamSuitability,
  deriveWhyFitReasoning,
  CANONICAL_TRAIT_CONFIG,
} from "@/lib/profile/profile-utils";
import type { TraitProfile, StreamResult } from "@/lib/types/assessment";

describe("Profile Personalization Utilities", () => {
  it("derives Analytical Systems Architect for high TE and AN", () => {
    const traits: TraitProfile = {
      TE: 88,
      AN: 82,
      SC: 65,
      BU: 45,
      CR: 50,
      SO: 40,
      LE: 55,
      EX: 60,
    };

    const persona = deriveStudentPersona(traits, "Software Development");
    expect(persona.archetype).toBe("Analytical Systems Architect");
    expect(persona.topStrengths.length).toBe(4);
    expect(persona.topStrengths[0].code).toBe("TE");
    expect(persona.topStrengths[0].score).toBe(88);
    expect(persona.topStrengths[0].tier).toBe("Dominant Strength");
    expect(persona.topStrengths[1].code).toBe("AN");
    expect(persona.topStrengths[1].score).toBe(82);
    expect(persona.executiveSummary).toContain("Technical Aptitude (88%)");
    expect(persona.executiveSummary).toContain("Software Development");
  });

  it("handles empty or partial traits gracefully with safe defaults", () => {
    const persona = deriveStudentPersona(null);
    expect(persona.archetype).toBeDefined();
    expect(persona.topStrengths.length).toBe(4);
    expect(persona.allTraits.length).toBe(8);
  });

  it("derives stream suitability when StreamResult is provided", () => {
    const streamResult: StreamResult = {
      scores: {
        science: 62.5,
        commerce: 24.5,
        arts: 13.0,
      },
      recommendation: "science",
      descriptions: {
        science: "Science pathway",
      },
    };

    const suitability = deriveStreamSuitability(streamResult);
    expect(suitability.rankedStreams[0].key).toBe("science");
    expect(suitability.rankedStreams[0].score).toBe(62.5);
    expect(suitability.rankedStreams[0].badgeLabel).toBe("Primary Academic Fit");
    expect(suitability.rankedStreams[1].key).toBe("commerce");
    expect(suitability.rankedStreams[2].key).toBe("arts");
  });

  it("calculates stream suitability fallback from traits when StreamResult is absent", () => {
    const traits: TraitProfile = {
      TE: 85,
      SC: 80,
      AN: 75,
      BU: 30,
      LE: 30,
      EX: 40,
      CR: 25,
      SO: 20,
    };

    const suitability = deriveStreamSuitability(null, traits);
    expect(suitability.rankedStreams[0].key).toBe("science");
    expect(suitability.rankedStreams[0].score).toBeGreaterThan(50);
  });

  it("generates compact Why These Careers Fit You reasoning with 3 key pillars", () => {
    const traits: TraitProfile = {
      TE: 90,
      AN: 85,
      SC: 70,
      BU: 40,
      CR: 50,
      SO: 45,
      LE: 50,
      EX: 60,
    };

    const whyFit = deriveWhyFitReasoning(traits, "Software Development");
    expect(whyFit.headline).toContain("Technical");
    expect(whyFit.headline).toContain("Analytical");
    expect(whyFit.narrative).toContain("Software Development");
    expect(whyFit.pillars.length).toBe(3);
    expect(whyFit.pillars[0].title).toBe("Systematic Problem Solving");
  });
});
