import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RoadmapStagePanel from "@/components/dashboard/RoadmapStagePanel";
import type { RoadmapPhase } from "@/lib/career-details/types";

const mockPhase: RoadmapPhase = {
  id: "test-phase-2",
  phase: 2,
  title: "Data Analysis & Computation",
  description: "Learn to analyze data scientifically and use computational tools for research.",
  estimatedDuration: "Ongoing (Class 11-12)",
  skills: ["Data Analysis & Statistics", "Computational Tools"],
  learn: ["Statistics fundamentals", "Python/R for data analysis"],
  practice: ["Analyze 3 public scientific datasets", "Create publication-quality plots"],
  build: "A data analysis project on a publicly available research dataset",
  resources: [
    {
      name: "Khan Academy — Statistics",
      type: "course",
      difficulty: "beginner",
      estimatedTime: "4 weeks",
      url: "https://www.khanacademy.org/math/statistics-probability",
    },
    {
      name: "Overleaf LaTeX Tutorial",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://www.overleaf.com/learn",
    },
  ],
};

const mockFinalPhase: RoadmapPhase = {
  id: "test-phase-3",
  phase: 3,
  title: "Research Practice & Communication",
  description: "Practice the full research cycle — from question to publication.",
  estimatedDuration: "4–8 weeks",
  skills: ["Academic Writing & Communication"],
  learn: ["Literature review techniques"],
  practice: ["Write a 5-page research report"],
  build: "A complete research project",
  resources: [],
};

describe("RoadmapStagePanel UI & Layout Validation", () => {
  it("renders stage header with numeric badge, active styling, and student-age duration formatting", () => {
    const html = renderToStaticMarkup(
      <RoadmapStagePanel
        phase={mockPhase}
        phaseIndex={1}
        totalPhases={3}
        isCompleted={false}
        isActive={true}
        completedSkills={new Set()}
        onTogglePhase={() => {}}
        onToggleSkill={() => {}}
      />
    );

    // Stage header & progression
    expect(html).toContain("02");
    expect(html).toContain("Active Journey • Stage 2 of 3");
    expect(html).toContain("Data Analysis &amp; Computation");
    expect(html).toContain("border-l-4 border-l-primary");

    // Student-age language: replaces "Ongoing (Class 11-12)" with future-oriented prep wording
    expect(html).toContain("Foundations (Prep for Class 11–12)");
    expect(html).not.toContain("Ongoing (Class 11-12)");

    // Skills use clean stacked full-width layout to eliminate empty grid areas
    expect(html).toContain("space-y-2.5");
    expect(html).toContain("Data Analysis &amp; Statistics");
    expect(html).toContain("Computational Tools");

    // Step 4 Milestone project is present
    expect(html).toContain("Stage Milestone Project");
    expect(html).toContain("A data analysis project on a publicly available research dataset");
    expect(html).toContain("Up next: Stage 3 of 3");
  });

  it("renders completed stage styling with emerald checkmark and 'completed' wording", () => {
    const html = renderToStaticMarkup(
      <RoadmapStagePanel
        phase={mockPhase}
        phaseIndex={1}
        totalPhases={3}
        isCompleted={true}
        isActive={false}
        completedSkills={new Set(["data-analysis-&-computation-data-analysis-&-statistics"])}
        onTogglePhase={() => {}}
        onToggleSkill={() => {}}
      />
    );

    expect(html).toContain("✓");
    expect(html).toContain("Stage 2 Complete");
    expect(html).toContain("1/2 completed");
    expect(html).not.toContain("mastered");
  });

  it("renders final stage footer with foundation milestone wording, not industry readiness", () => {
    const html = renderToStaticMarkup(
      <RoadmapStagePanel
        phase={mockFinalPhase}
        phaseIndex={2}
        totalPhases={3}
        isCompleted={false}
        isActive={true}
        completedSkills={new Set()}
        onTogglePhase={() => {}}
        onToggleSkill={() => {}}
      />
    );

    expect(html).toContain("Final Stage • Advanced Foundations &amp; Projects");
    expect(html).not.toContain("Full Industry Readiness");
  });
});
