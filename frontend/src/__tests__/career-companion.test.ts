import { describe, it, expect } from "vitest";
import { buildCareerContext } from "@/lib/career-details/career-context";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { generateLocalCoachResponse } from "@/lib/coach/coach-engine";

describe("Career Companion Conversational Behavior", () => {
  const career = getCareerIntelligence("scientific-research")!;

  const assessedContext = buildCareerContext(
    career,
    { TE: 85, AN: 90, CR: 75 },
    {
      completedPhases: [1],
      completedSkills: ["res-1"],
      completedProjects: [],
      completedTasks: [],
    },
    {
      storedResults: {
        recommended_stream: "Science",
        stream_fit_score: 88,
        top_careers: [
          {
            career_name: "Scientific Research",
            match_percentage: 75,
            explanation: "Strong alignment in analytical reasoning and curiosity.",
          },
        ],
        trait_profile: { TE: 85, AN: 90, CR: 75 },
        dimension_scores: {},
        completed_at: "2026-09-19T12:00:00Z",
      } as any,
    }
  );

  // 1. Natural conversation for "hello"
  it("responds to 'hello' with a friendly natural greeting without a career report", async () => {
    const response = await generateLocalCoachResponse("hello", assessedContext);

    // Natural & brief
    expect(response).toBe("Hey! 👋 What can I help you with?");
    // Must NOT contain career analysis or report headers
    expect(response).not.toContain("Research Scientist");
    expect(response).not.toContain("Career Compass Guidance");
    expect(response).not.toContain("Bottleneck");
  });

  // 2. Natural conversation for "thanks"
  it("responds to 'thanks' with a friendly brief acknowledgement", async () => {
    const response = await generateLocalCoachResponse("thanks", assessedContext);

    // Natural & brief
    expect(response).toBe("You're welcome! Want to explore anything else?");
    // Must NOT contain career report
    expect(response).not.toContain("Research Scientist");
    expect(response).not.toContain("Roadmap");
  });

  // 3. "what does this career involve?"
  it("answers 'what does this career involve?' concisely using career context without enterprise headers", async () => {
    const response = await generateLocalCoachResponse(
      "what does this career involve?",
      assessedContext
    );

    // Uses career context
    expect(response).toContain("Research Scientist");
    expect(response).toContain("daily work");
    // No enterprise report headers
    expect(response).not.toContain("Career Compass Guidance");
    expect(response).not.toContain("### 💼 What Being a");
    expect(response).not.toContain("Role Progression Ladder");
    // Concise: not a giant wall of text
    const lines = response.split("\n").filter((l) => l.trim().length > 0);
    expect(lines.length).toBeLessThanOrEqual(10);
  });

  // 4. "what skills do I need?"
  it("answers 'what skills do I need?' with Class 9-10 friendly wording and no dashboard headings", async () => {
    const response = await generateLocalCoachResponse(
      "what skills do I need?",
      assessedContext
    );

    // Uses friendly Class 9-10 wording
    expect(response).toMatch(/Skills you can work on next|Good areas to focus on/i);
    // Avoids corporate/report headings
    expect(response).not.toContain("Skill Gap Analysis");
    expect(response).not.toContain("Priority Missing Skills");
    expect(response).not.toContain("Immediate Bottlenecks");
    expect(response).not.toContain("Transparent Skill Inventory");
    expect(response).not.toContain("Curriculum Tier Coverage");
    expect(response).not.toMatch(/\d+%\s*Readiness/i);
  });

  // 5. "why did I get this career?"
  it("answers 'why did I get this career?' with consistent match score and student-friendly explanation", async () => {
    const response = await generateLocalCoachResponse(
      "why did I get this career?",
      assessedContext
    );

    // Consistent match percentage precision (75% match, same as page)
    expect(response).toContain("75% match");
    expect(response).not.toMatch(/75\.\d+%/);
    // Student-friendly explanation
    expect(response).toMatch(/analytical|curiosity/i);
    // Avoids giant multi-section breakdown
    expect(response).not.toContain("Trait Synergy & Match Rationale");
    expect(response).not.toMatch(/\d+%\s*Readiness/i);
  });

  // 6. "what should I study after 10th?"
  it("answers 'what should I study after 10th?' with stream guidance for Class 11-12", async () => {
    const response = await generateLocalCoachResponse(
      "what should I study after 10th?",
      assessedContext
    );

    // Mentions recommended stream for 11-12
    expect(response).toMatch(/Science/i);
    expect(response).toContain("Class 11–12");
    // Explains pathway concisely
    expect(response).toMatch(/Bachelor|degree/i);
    // No conflicting readiness percentage
    expect(response).not.toMatch(/\d+%\s*Readiness/i);
  });

  // Score precision consistency verification (e.g. 75.1% displayed as 75%)
  it("formats decimal match percentage consistently with page display (Math.round)", async () => {
    const decimalContext = {
      ...assessedContext,
      career: {
        ...assessedContext.career,
        matchPercentage: 75.1,
      },
    };

    const response = await generateLocalCoachResponse(
      "why did I get this career?",
      decimalContext
    );

    expect(response).toContain("75% match");
    expect(response).not.toContain("75.1%");
  });
});
