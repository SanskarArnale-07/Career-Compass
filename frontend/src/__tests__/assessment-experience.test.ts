import { describe, it, expect } from "vitest";
import { assessmentQuestions } from "@/lib/assessment-data";
import { LEGACY_ASSESSMENT_KEY } from "@/lib/persistence/storage";

describe("Assessment Experience Redesign & Integrity", () => {
  it("contains exactly 20 curated questions", () => {
    expect(assessmentQuestions.length).toBe(20);
    assessmentQuestions.forEach((q, idx) => {
      expect(q.id).toBe(`q${idx + 1}`);
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("ensures each option has valid value and label matching backend scoring expectation", () => {
    assessmentQuestions.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.value).toBeDefined();
        expect(opt.label).toBeDefined();
        expect(opt.value.trim().length).toBeGreaterThan(0);
        expect(opt.label.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("calculates progress percentage accurately across all 20 steps", () => {
    const percentages = assessmentQuestions.map((_, idx) =>
      Math.round(((idx + 1) / assessmentQuestions.length) * 100)
    );

    expect(percentages[0]).toBe(5); // Q1: 5%
    expect(percentages[5]).toBe(30); // Q6: 30%
    expect(percentages[9]).toBe(50); // Q10: 50%
    expect(percentages[19]).toBe(100); // Q20: 100%
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

    expect(Object.keys(parsed).length).toBe(20);
    expect(parsed.q1).toBe(assessmentQuestions[0].options[0].value);
    expect(parsed.q20).toBe(assessmentQuestions[19].options[0].value);
  });
});
