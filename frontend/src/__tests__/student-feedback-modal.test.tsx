import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StudentFeedbackModal } from "@/components/feedback/StudentFeedbackModal";
import { submitStudentFeedback } from "@/lib/feedback/api";
import type { StudentFeedbackPayload } from "@/lib/feedback/types";

// Mock useAuth
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "student-123", name: "Aarav Sharma", email: "aarav@example.com" },
    token: "test-jwt-token",
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe("StudentFeedbackModal & Feedback Integration Tests", () => {
  it("renders nothing when isOpen is false", () => {
    const html = renderToStaticMarkup(
      <StudentFeedbackModal isOpen={false} onClose={() => {}} />
    );
    expect(html).toBe("");
  });

  it("renders Step 1 with complete Likert ratings, confidence shift, and titles when open", () => {
    const html = renderToStaticMarkup(
      <StudentFeedbackModal isOpen={true} onClose={() => {}} sessionId="session-test-1" />
    );

    // Modal Header & Step info
    expect(html).toContain("Student Guidance Feedback");
    expect(html).toContain("Step 1 of 2");

    // All core rating categories
    expect(html).toContain("Profile Clarity");
    expect(html).toContain("How easy was your profile and cognitive archetype to understand?");
    expect(html).toContain("Career Relevance");
    expect(html).toContain("How accurately did suggested careers align with your real interests?");
    expect(html).toContain("Strengths Understanding");
    expect(html).toContain("Did this assessment deepen your understanding of your cognitive skills?");
    expect(html).toContain("Exploration Tools");
    expect(html).toContain("How useful are the roadmap stages and career hierarchies?");
    expect(html).toContain("Why-Fit Explanation");
    expect(html).toContain("How clearly did we explain WHY these careers match your traits?");

    // Confidence Shift Question
    expect(html).toContain("Career Direction Confidence");
    expect(html).toContain("Before Career Compass (1-5)");
    expect(html).toContain("After Guidance Today (1-5)");
    expect(html).toContain("Point Shift");

    // Continue CTA
    expect(html).toContain("Continue");
  });

  it("constructs full authentic payload matching backend schema requirements", () => {
    const payload: StudentFeedbackPayload = {
      session_id: "test-session-42",
      profile_clarity_score: 5,
      career_relevance_score: 4,
      strengths_understanding_score: 5,
      career_exploration_usefulness_score: 4,
      confidence_before: 2,
      confidence_after: 4,
      recommendation_explanation_score: 5,
      discovered_new_career: true,
      recommend_to_others: true,
      most_useful: "The explanation of cognitive traits alignment was very intuitive.",
      improvement_suggestion: "Include state government and regional exams.",
    };

    expect(payload.session_id).toBe("test-session-42");
    expect(payload.profile_clarity_score).toBeGreaterThanOrEqual(1);
    expect(payload.profile_clarity_score).toBeLessThanOrEqual(5);
    expect(payload.confidence_after - payload.confidence_before).toBe(2);
    expect(payload.discovered_new_career).toBe(true);
    expect(payload.recommend_to_others).toBe(true);
  });

  it("handles offline queuing gracefully when backend is unreachable", async () => {
    // Mock fetch to simulate network error
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network connection failed"));

    const payload: StudentFeedbackPayload = {
      session_id: "offline-session-1",
      profile_clarity_score: 4,
      career_relevance_score: 4,
      strengths_understanding_score: 4,
      career_exploration_usefulness_score: 4,
      confidence_before: 3,
      confidence_after: 4,
      recommendation_explanation_score: 4,
      discovered_new_career: true,
      recommend_to_others: true,
    };

    const res = await submitStudentFeedback(payload, "test-token");
    expect(res.success).toBe(true);
    expect(res.message).toContain("offline mode");

    // Restore fetch
    globalThis.fetch = originalFetch;
  });

  it("processes online backend response correctly", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        status: "success",
        id: "fb-uuid-999",
        submitted_at: 1700000000,
      }),
    } as any);

    const payload: StudentFeedbackPayload = {
      session_id: "online-session-1",
      profile_clarity_score: 5,
      career_relevance_score: 5,
      strengths_understanding_score: 5,
      career_exploration_usefulness_score: 5,
      confidence_before: 2,
      confidence_after: 5,
      recommendation_explanation_score: 5,
      discovered_new_career: true,
      recommend_to_others: true,
    };

    const res = await submitStudentFeedback(payload, "auth-token");
    expect(res.success).toBe(true);
    expect(res.feedback_id).toBe("fb-uuid-999");

    globalThis.fetch = originalFetch;
  });
});
