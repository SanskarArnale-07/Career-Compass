import { describe, it, expect } from "vitest";
import { buildCareerContext } from "@/lib/career-details/career-context";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import {
  generateLocalCoachResponse,
  detectCareerFromQueryOrHistory,
  extractTwoCareersForComparison,
  buildCoachSystemPrompt,
  matchesKeyword,
} from "@/lib/coach/coach-engine";

describe("Career Companion Comprehensive Audit & Behavioral Suite", () => {
  const softwareCareer = getCareerIntelligence("software-development")!;
  const cybersecurityCareer = getCareerIntelligence("cybersecurity")!;

  // Profile with completed assessment
  const assessedContext = buildCareerContext(
    softwareCareer,
    { TE: 90, AN: 85, CR: 70, LD: 60 },
    {
      completedPhases: [1],
      completedSkills: ["sw-1"],
      completedProjects: [],
      completedTasks: [],
    },
    {
      storedResults: {
        recommended_stream: "Science with Computer Science",
        stream_fit_score: 92,
        top_careers: [
          {
            career_name: "Software Development",
            match_percentage: 88,
            explanation: "Exceptional alignment with algorithmic thinking and software architecture.",
          },
          {
            career_name: "Cybersecurity & Defense",
            match_percentage: 82,
            explanation: "Strong investigative and systems defense mindset.",
          },
          {
            career_name: "Data Analytics & Insights",
            match_percentage: 79,
            explanation: "Analytical pattern-matching aptitude.",
          },
        ],
        trait_profile: { TE: 90, AN: 85, CR: 70, LD: 60 },
        dimension_scores: {},
        completed_at: "2026-09-20T10:00:00Z",
      } as any,
    }
  );

  // Profile with NO assessment (unassessed explorer)
  const unassessedContext = buildCareerContext(
    softwareCareer,
    undefined,
    undefined,
    undefined
  );

  // ──────────────────────────────────────────────────────────────────────────
  // A. Different questions about the same career
  // ──────────────────────────────────────────────────────────────────────────
  describe("A. Different questions about the same career produce distinct, specific answers", () => {
    it("provides 3 completely distinct answers for how to become, first skills, and day-to-day", async () => {
      const q1 = "How do I become a cybersecurity analyst?";
      const q2 = "What skills should I learn first for cybersecurity?";
      const q3 = "What does a cybersecurity analyst do day to day?";

      const res1 = await generateLocalCoachResponse(q1, assessedContext);
      const res2 = await generateLocalCoachResponse(q2, assessedContext);
      const res3 = await generateLocalCoachResponse(q3, assessedContext);

      // Verify all 3 mention Cybersecurity
      expect(res1).toMatch(/Cybersecurity/i);
      expect(res2).toMatch(/Cybersecurity/i);
      expect(res3).toMatch(/Cybersecurity/i);

      // Verify Q1 focuses on pathway / college degrees / streams
      expect(res1).toMatch(/Class 11–12 Stream|College Education|degree/i);
      expect(res1).not.toContain("Here is what daily work typically looks like");

      // Verify Q2 focuses on starter skills / beginner learning
      expect(res2).toMatch(/foundational skills to learn first/i);
      expect(res2).toMatch(/TCP\/IP|Wireshark|Linux|tools|Network/i);

      // Verify Q3 focuses on daily tasks and responsibilities
      expect(res3).toMatch(/daily work typically looks like/i);
      expect(res3).not.toMatch(/foundational skills to learn first/i);

      // Verify outputs are distinct
      expect(res1).not.toBe(res2);
      expect(res2).not.toBe(res3);
      expect(res1).not.toBe(res3);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // B. Questions about completely different careers
  // ──────────────────────────────────────────────────────────────────────────
  describe("B. Questions about completely different careers", () => {
    it("answers specifically about the queried career rather than defaulting to the page career", async () => {
      // Even though assessedContext has active career = Software Development:
      const resCyber = await generateLocalCoachResponse("How do I become a cybersecurity analyst?", assessedContext);
      const resUIUX = await generateLocalCoachResponse("Is UI/UX design a good career for me?", assessedContext);
      const resUPSC = await generateLocalCoachResponse("How can I prepare for UPSC?", assessedContext);

      expect(resCyber).toMatch(/Cybersecurity/i);
      expect(resCyber).not.toMatch(/Designer/i);

      expect(resUIUX).toMatch(/Designer|Design/i);
      expect(resUIUX).not.toMatch(/Cybersecurity/i);

      expect(resUPSC).toContain("UPSC Civil Services");
      expect(resUPSC).toMatch(/Prelims|Mains|NCERT/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // C. Personalization questions using actual assessment data
  // ──────────────────────────────────────────────────────────────────────────
  describe("C. Personalization questions using actual assessment data", () => {
    it("uses student's real top traits and match percentages when assessed", async () => {
      const res = await generateLocalCoachResponse("What careers match my strengths?", assessedContext);

      expect(res).toMatch(/strongest traits are/i);
      expect(res).toContain("Software Development");
      expect(res).toContain("88% match");
      expect(res).toMatch(/Cybersecurity/i);
      expect(res).toContain("82% match");
      expect(res).toMatch(/Data Analytics/i);
      expect(res).toContain("79% match");
    });

    it("honestly explains unassessed status without hallucinating scores", async () => {
      const res = await generateLocalCoachResponse("What careers match my strengths?", unassessedContext);

      expect(res).toContain("haven't completed the Career Compass assessment yet");
      expect(res).toMatch(/5-minute psychometric assessment/i);
      expect(res).not.toMatch(/\d+%\s*match/);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // D. Follow-up questions relying on previous conversation messages
  // ──────────────────────────────────────────────────────────────────────────
  describe("D. Follow-up questions relying on previous conversation messages", () => {
    it("resolves 'What should I learn first?' to Cybersecurity based on conversation history", async () => {
      // Turn 1 history establishes user is talking about cybersecurity
      const history = [
        { role: "user" as const, content: "I'm interested in cybersecurity" },
        {
          role: "assistant" as const,
          content: "That's great! **Cybersecurity & Defense** is an exciting pathway centered on protecting digital systems.",
        },
      ];

      // Turn 2 follow-up query without explicitly re-mentioning cybersecurity
      const followUp = "What should I learn first?";
      const res = await generateLocalCoachResponse(followUp, assessedContext, history);

      // Must resolve to Cybersecurity & Defense, NOT active career (Software Development)
      expect(res).toMatch(/Cybersecurity/i);
      expect(res).toMatch(/foundational skills to learn first/i);
      expect(res).toMatch(/TCP\/IP|Wireshark|Linux/i);
    });

    it("uses target career on page when no career is in query or history", async () => {
      const res = await generateLocalCoachResponse("What should I learn first?", assessedContext);

      // Default active career is Software Development
      expect(res).toContain("Software Development");
      expect(res).toMatch(/foundational skills to learn first/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // E. Career comparisons
  // ──────────────────────────────────────────────────────────────────────────
  describe("E. Career comparisons", () => {
    it("compares two distinct careers with specific tools and decision advice", async () => {
      const res = await generateLocalCoachResponse(
        "Compare software engineering and data analytics",
        assessedContext
      );

      expect(res).toContain("Software Development");
      expect(res).toMatch(/Data Analytics/i);
      expect(res).toMatch(/How to choose/i);
      expect(res).toMatch(/building systems|investigating trends|data/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // F. Roadmap and next-step questions
  // ──────────────────────────────────────────────────────────────────────────
  describe("F. Roadmap and next-step questions", () => {
    it("gives active phase milestone and actionable advice", async () => {
      const res = await generateLocalCoachResponse(
        "What should I do next in my current roadmap?",
        assessedContext
      );

      expect(res).toContain("Software Development");
      expect(res).toMatch(/Phase \d+/i);
      expect(res).toMatch(/immediate next milestone/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // G. Questions about Civil Services in India
  // ──────────────────────────────────────────────────────────────────────────
  describe("G. Questions about Civil Services in India", () => {
    it("provides accurate UPSC CSE roadmap for Indian school students", async () => {
      const res = await generateLocalCoachResponse("How can I prepare for UPSC?", assessedContext);

      expect(res).toContain("UPSC Civil Services");
      expect(res).toMatch(/IAS, IPS/i);
      expect(res).toMatch(/any academic stream/i);
      expect(res).toMatch(/Preliminary Exam|Main Written Exam|Personality Test/i);
      expect(res).toMatch(/NCERT/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // H. Questions unrelated to career guidance
  // ──────────────────────────────────────────────────────────────────────────
  describe("H. Questions unrelated to career guidance", () => {
    it("politely redirects off-topic questions without generic career summaries", async () => {
      const res = await generateLocalCoachResponse("What is the capital of France?", assessedContext);

      expect(res).toMatch(/Career Companion/i);
      expect(res).toMatch(/encyclopedia|search engine/i);
      expect(res).not.toContain("### 💼 What Being a");
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // I. Missing profile information
  // ──────────────────────────────────────────────────────────────────────────
  describe("I. Missing profile information", () => {
    it("handles fit evaluation honestly when unassessed", async () => {
      const res = await generateLocalCoachResponse(
        "Is UI/UX design a good career for me?",
        unassessedContext
      );

      expect(res).toMatch(/Designer|Design/i);
      expect(res).toMatch(/Once you complete the 5-minute Career Compass assessment/i);
      expect(res).not.toMatch(/\d+%\s*match/);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // J. Word-boundary safety & helper functions
  // ──────────────────────────────────────────────────────────────────────────
  describe("J. Robust Keyword & Substring Safety", () => {
    it("does not match 'ca' inside 'career' or other words", () => {
      expect(matchesKeyword("why did i get this career?", "ca")).toBe(false);
      expect(matchesKeyword("what does this career involve?", "ca")).toBe(false);
      expect(matchesKeyword("because of my interest", "ca")).toBe(false);
      expect(matchesKeyword("i want to study ca", "ca")).toBe(true);
      expect(matchesKeyword("how to become a CA?", "ca")).toBe(true);
    });

    it("detects multi-word career keywords safely", () => {
      expect(matchesKeyword("how do i prepare for upsc cse?", "upsc cse")).toBe(true);
      expect(matchesKeyword("tell me about ui/ux design", "ui/ux")).toBe(true);
    });

    it("builds anti-hallucination system prompt with active and catalog context", () => {
      const prompt = buildCoachSystemPrompt(assessedContext);
      expect(prompt).toContain("ALWAYS ANSWER THE EXACT QUESTION ASKED");
      expect(prompt).toContain("MULTI-TURN CONVERSATION MEMORY");
      expect(prompt).toContain("Software Development");
      expect(prompt).toContain("28 career pathways");
    });
  });
});
