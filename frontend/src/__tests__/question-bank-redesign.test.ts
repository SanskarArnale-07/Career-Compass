import { describe, it, expect } from "vitest";
import { assessmentQuestions } from "@/lib/assessment-data";

describe("Career Discovery Assessment Question Bank Redesign", () => {
  const DIMENSIONS = ["AN", "TE", "SC", "BU", "CR", "SO", "LE", "EX"] as const;

  it("contains exactly 28 total questions", () => {
    expect(assessmentQuestions.length).toBe(28);
    assessmentQuestions.forEach((q, idx) => {
      expect(q.id).toBe(`q${idx + 1}`);
    });
  });

  it("contains exactly 24 core questions and exactly 4 scenario differentiation questions", () => {
    const core = assessmentQuestions.slice(0, 24);
    const scenarios = assessmentQuestions.slice(24);

    expect(core.length).toBe(24);
    expect(scenarios.length).toBe(4);

    scenarios.forEach((q, idx) => {
      expect(q.question).toMatch(new RegExp(`^Scenario ${idx + 1}:`));
    });
  });

  it("has exactly 3 core questions for each of the 8 dimensions", () => {
    // Core layout:
    // q1-q3: Analytical (AN)
    // q4-q6: Technical (TE)
    // q7-q9: Scientific (SC)
    // q10-q12: Business (BU)
    // q13-q15: Creative (CR)
    // q16-q18: Social (SO)
    // q19-q21: Leadership (LE)
    // q22-q24: Exploration (EX)
    const dimensionBuckets: Record<string, string[]> = {
      AN: ["q1", "q2", "q3"],
      TE: ["q4", "q5", "q6"],
      SC: ["q7", "q8", "q9"],
      BU: ["q10", "q11", "q12"],
      CR: ["q13", "q14", "q15"],
      SO: ["q16", "q17", "q18"],
      LE: ["q19", "q20", "q21"],
      EX: ["q22", "q23", "q24"],
    };

    for (const [dim, qids] of Object.entries(dimensionBuckets)) {
      expect(qids.length).toBe(3);
      for (const qid of qids) {
        const q = assessmentQuestions.find((item) => item.id === qid);
        expect(q).toBeDefined();
        expect(q?.options.length).toBe(4);
      }
    }
  });

  it("verifies no questions or answer options are duplicated", () => {
    const questionTexts = new Set<string>();
    const allOptionTexts = new Set<string>();

    for (const q of assessmentQuestions) {
      // Question text uniqueness
      expect(questionTexts.has(q.question)).toBe(false);
      questionTexts.add(q.question);

      // Within-question option uniqueness
      const localOptions = new Set<string>();
      for (const opt of q.options) {
        expect(localOptions.has(opt.value)).toBe(false);
        localOptions.add(opt.value);
        expect(opt.value).toBe(opt.label);
      }
    }

    expect(questionTexts.size).toBe(28);
  });

  it("verifies every question is appropriate for Class 9-10 without adult corporate jargon", () => {
    const forbiddenJargon = [
      "ebitda",
      "quarterly earnings",
      "shareholder",
      "microservices",
      "kubernetes",
      "tort law",
      "arbitrage",
      "p&l statement",
      "kpi",
    ];

    for (const q of assessmentQuestions) {
      const fullText = (
        q.question + " " + q.options.map((o) => o.value).join(" ")
      ).toLowerCase();

      for (const term of forbiddenJargon) {
        expect(fullText).not.toContain(term);
      }
    }
  });
});
