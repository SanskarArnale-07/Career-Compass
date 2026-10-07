import { describe, it, expect } from "vitest";
import { assessmentQuestions } from "@/lib/assessment-data";
import { LEGACY_ASSESSMENT_KEY } from "@/lib/persistence/storage";

describe("Assessment Experience Redesign & Integrity", () => {
  it("contains exactly 28 curated questions", () => {
    expect(assessmentQuestions.length).toBe(28);
    assessmentQuestions.forEach((q, idx) => {
      expect(q.id).toBe(`q${idx + 1}`);
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.options.length).toBe(4);
    });
  });

  it("ensures exactly 24 core questions and 4 scenario questions", () => {
    const coreQuestions = assessmentQuestions.slice(0, 24);
    const scenarioQuestions = assessmentQuestions.slice(24);

    expect(coreQuestions.length).toBe(24);
    expect(scenarioQuestions.length).toBe(4);

    // Scenario questions start with Scenario 1, Scenario 2, etc.
    scenarioQuestions.forEach((q, idx) => {
      expect(q.question).toContain(`Scenario ${idx + 1}:`);
    });
  });

  it("ensures each option has valid value and label matching backend scoring expectation", () => {
    assessmentQuestions.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.value).toBeDefined();
        expect(opt.label).toBeDefined();
        expect(opt.value.trim().length).toBeGreaterThan(0);
        expect(opt.label.trim().length).toBeGreaterThan(0);
        expect(opt.value).toBe(opt.label);
      });
    });
  });

  it("calculates progress percentage accurately across all 28 steps", () => {
    const percentages = assessmentQuestions.map((_, idx) =>
      Math.round(((idx + 1) / assessmentQuestions.length) * 100)
    );

    expect(percentages[0]).toBe(4); // Q1: 4%
    expect(percentages[6]).toBe(25); // Q7: 25%
    expect(percentages[13]).toBe(50); // Q14: 50%
    expect(percentages[20]).toBe(75); // Q21: 75%
    expect(percentages[27]).toBe(100); // Q28: 100%
  });

  it("uses the canonical storage key for seamless handoff to results page", () => {
    expect(LEGACY_ASSESSMENT_KEY).toBe("careerCompassAssessment");
  });

  it("ensures all question options can be serialized to JSON answers record", () => {
    const mockAnswers: Record<string, string> = {};
    assessmentQuestions.forEach((q) => {
      mockAnswers[q.id] = q.options[0].value;
    });

    const serialized = JSON.stringify(mockAnswers);
    const parsed = JSON.parse(serialized);

    expect(Object.keys(parsed).length).toBe(28);
    expect(parsed.q1).toBe(assessmentQuestions[0].options[0].value);
    expect(parsed.q28).toBe(assessmentQuestions[27].options[0].value);
  });

  it("dynamically formats response collected count from assessment questions length", () => {
    const totalQuestions = assessmentQuestions.length;
    const expectedCompletionLabel = `Responses collected (${totalQuestions} of ${totalQuestions})`;
    expect(totalQuestions).toBe(28);
    expect(expectedCompletionLabel).toBe("Responses collected (28 of 28)");
  });
});
