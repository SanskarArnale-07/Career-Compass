import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  deriveStudentPersona,
  deriveWorkLearningStyle,
  deriveNextSteps,
  deriveWhyFitReasoning,
} from "@/lib/profile/profile-utils";
import { WorkLearningStyleSection } from "@/components/profile/WorkLearningStyleSection";
import { NextStepsSection } from "@/components/profile/NextStepsSection";
import {
  VERIFIED_RESOURCES,
  RESOURCE_CATEGORIES,
} from "@/lib/resources/resources-data";
import type { TraitProfile } from "@/lib/types/assessment";

describe("Feedback, Work/Learning Style, Resources, and Research Tests", () => {
  const mockTechTraits: TraitProfile = {
    TE: 90,
    AN: 85,
    SC: 70,
    BU: 40,
    CR: 50,
    SO: 45,
    LE: 50,
    EX: 55,
  };

  const mockCivilTraits: TraitProfile = {
    TE: 40,
    AN: 85,
    SC: 60,
    BU: 70,
    CR: 45,
    SO: 80,
    LE: 85,
    EX: 60,
  };

  it("derives nuanced Work & Learning Style profile correctly for technical profile", () => {
    const style = deriveWorkLearningStyle(mockTechTraits);
    expect(style.environmentPreference.title).toBe("Research & Rigorous Investigation Workspace");
    expect(style.problemSolvingMode.title).toBe("Deconstructive & Algorithmic");
    expect(style.collaborationDynamic.title).toBe("Focused Autonomous Contributor with Async Alignment");
    expect(style.structureVsFlexibility.score).toBeGreaterThanOrEqual(50);
    expect(style.cognitiveDimensions.length).toBe(3);
  });

  it("derives collaborative & stakeholder-focused work style for leadership/social profile", () => {
    const style = deriveWorkLearningStyle(mockCivilTraits);
    expect(style.environmentPreference.title).toBe("Collaborative Team & Stakeholder Hub");
    expect(style.collaborationDynamic.title).toBe("Active Team Orchestrator & Facilitator");
  });

  it("derives tailored next steps for Civil Services with official constitutional and portal pathways", () => {
    const persona = deriveStudentPersona(mockCivilTraits, "IAS / District Magistrate");
    const steps = deriveNextSteps(persona, "IAS / District Magistrate", "upsc-civil-services");

    expect(steps.length).toBe(4);
    expect(steps[0].title).toContain("Constitutional");
    expect(steps[0].href).toContain("/resources?category=government");
    expect(steps[1].title).toContain("Exam Route vs. Service");
    expect(steps[3].category).toBe("feedback");
  });

  it("derives tailored next steps for Software Development with hands-on project and roadmap steps", () => {
    const persona = deriveStudentPersona(mockTechTraits, "Software Development");
    const steps = deriveNextSteps(persona, "Software Development", "software-development");

    expect(steps.length).toBe(4);
    expect(steps[0].title).toContain("Hands-On Projects in Software Development");
    expect(steps[1].href).toBe("/dashboard");
    expect(steps[3].category).toBe("feedback");
  });

  it("derives explainable WhyFit reasoning customized for Civil Services vs Tech", () => {
    const techReasoning = deriveWhyFitReasoning(mockTechTraits, "Software Development");
    expect(techReasoning.pillars[0].title).toBe("Systematic Problem Solving");

    const civilReasoning = deriveWhyFitReasoning(mockCivilTraits, "UPSC Civil Services (IAS / IPS)");
    expect(civilReasoning.narrative).toContain("Public administration");
    expect(civilReasoning.pillars[0].title).toBe("Systemic Policy & Governance Decomposition");
  });

  it("renders WorkLearningStyleSection static markup without crashing", () => {
    const style = deriveWorkLearningStyle(mockTechTraits);
    const html = renderToStaticMarkup(<WorkLearningStyleSection style={style} />);

    expect(html).toContain("Work &amp; Learning Style Profile");
    expect(html).toContain("Optimal Environment");
    expect(html).toContain("Structure vs. Flexibility");
    expect(html).toContain("Cognitive Architecture");
  });

  it("renders NextStepsSection static markup with action links and badges", () => {
    const persona = deriveStudentPersona(mockTechTraits, "Software Development");
    const steps = deriveNextSteps(persona, "Software Development", "software-development");
    const html = renderToStaticMarkup(<NextStepsSection steps={steps} />);

    expect(html).toContain("Recommended Next Steps &amp; Action Plan");
    expect(html).toContain("Immediate Focus");
    expect(html).toContain("Build Hands-On Projects in Software Development");
  });

  it("validates Verified Resources database contains authentic, authoritative sources across 8 categories", () => {
    expect(RESOURCE_CATEGORIES.length).toBe(9); // All + 8 categories
    expect(VERIFIED_RESOURCES.length).toBeGreaterThanOrEqual(16);

    const categoriesInResources = new Set(VERIFIED_RESOURCES.map((r) => r.category));
    expect(categoriesInResources.has("civil-services")).toBe(true);
    expect(categoriesInResources.has("computer-science")).toBe(true);
    expect(categoriesInResources.has("data-ai")).toBe(true);
    expect(categoriesInResources.has("business-strategy")).toBe(true);
    expect(categoriesInResources.has("creative-design")).toBe(true);
    expect(categoriesInResources.has("healthcare")).toBe(true);
    expect(categoriesInResources.has("core-engineering")).toBe(true);
    expect(categoriesInResources.has("foundational")).toBe(true);

    // Verify all URLs are valid https
    for (const res of VERIFIED_RESOURCES) {
      expect(res.url.startsWith("https://")).toBe(true);
      expect(res.provider.length).toBeGreaterThan(0);
      expect(res.title.length).toBeGreaterThan(0);
    }

    // Verify specific authoritative anchors
    const urls = VERIFIED_RESOURCES.map((r) => r.url);
    expect(urls.some((u) => u.includes("upsc.gov.in"))).toBe(true);
    expect(urls.some((u) => u.includes("ncert.nic.in"))).toBe(true);
    expect(urls.some((u) => u.includes("developer.mozilla.org"))).toBe(true);
    expect(urls.some((u) => u.includes("nptel.ac.in"))).toBe(true);
    expect(urls.some((u) => u.includes("ncbi.nlm.nih.gov"))).toBe(true);
  });
});
