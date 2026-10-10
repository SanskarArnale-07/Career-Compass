import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CareerConstellation from "@/components/career/CareerConstellation";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";

describe("Career Constellation & Skill Web Component Tests", () => {
  const designCareer = resolveCareerIntelligence("design-creative")!;
  const softwareCareer = resolveCareerIntelligence("software-development")!;

  const designRelated = [
    { title: "Product Management", slug: "product-management", category: "Management & Strategy" },
    { title: "Marketing & Communication", slug: "marketing-digital-media", category: "Marketing & Strategy" },
    { title: "Software Development", slug: "software-development", category: "Engineering & Technology" },
  ];

  const softwareRelated = [
    { title: "AI & Machine Learning", slug: "ai-ml-data-science", category: "Data & Intelligence" },
    { title: "Cybersecurity & Defense", slug: "cybersecurity", category: "Security & Systems" },
    { title: "Design & Creative Tech", slug: "design-creative", category: "Design & UX" },
  ];

  const escapeHtml = (s: string) => s.replace(/&/g, "&amp;");

  // ── 1. No Truncation & Complete Label Rendering ───────────────────────────
  describe("Label Fidelity and No Truncation", () => {
    it("renders complete, untruncated skill names in the graph and inspector", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      // Verify full names of essential skills are rendered completely
      for (const skill of designCareer.skills.slice(0, 4)) {
        // SVG text can split over tspans, but each word must be present and no "..." or ellipses
        const words = skill.name.split(" ");
        for (const word of words) {
          expect(html).toContain(escapeHtml(word));
        }
        // Native SVG title tooltips must contain the complete name verbatim
        expect(html).toContain(`<title>${escapeHtml(skill.name)} (Essential Core Skill)</title>`);
      }

      // Check that truncation markers like "..." or "Designer & Crea..." are NEVER present
      expect(html).not.toContain("Designer &amp; Crea...");
      expect(html).not.toContain("Design Too...");
      expect(html).not.toContain("...");
    });

    it("renders complete related career titles without truncation", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      for (const rel of designRelated) {
        expect(html).toContain(`<title>${escapeHtml(rel.title)} (Adjacent Career Pathway)</title>`);
      }
    });

    it("renders the target career title cleanly with full title and Target Focus badge", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={softwareCareer} relatedCareers={softwareRelated} />
      );

      expect(html).toContain(`<title>${escapeHtml(softwareCareer.title)} (Target Career Focus)</title>`);
      expect(html).toContain("Target Focus");
    });
  });

  // ── 2. Meaningful Connections & Relationship Legend ────────────────────────
  describe("Meaningful Relationships & Visual Legend", () => {
    it("renders a clear, semantic legend differentiating relationship types", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      expect(html).toContain("Target Career");
      expect(html).toContain("Essential Skills (4)");
      expect(html).toContain("Related Careers (3)");
      expect(html).toContain("Transferable Skill Bridge");
    });

    it("renders distinct SVG connection layers with appropriate stroke styling", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      // Solid cyan target-to-skill connections
      expect(html).toContain("stroke=\"#00E5FF\"");

      // Transferable skill bridges between skills and related pathways
      expect(html).toContain("stroke=\"#38BDF8\"");

      // Dotted line ambient connection to adjacent careers
      expect(html).toContain("stroke-dasharray=\"2 4\"");
    });
  });

  // ── 3. Interactive Inspector Panel ("Answering: SO WHAT?") ─────────────────
  describe("Practical Inspector Panel & Next Best Action", () => {
    it("displays practical educational context for the active skill by default", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      const topSkill = designCareer.skills[0];

      // Full skill name in inspector
      expect(html).toContain(topSkill.name);

      // "Why It Matters" practical explanation
      expect(html).toContain(`Why It Matters for ${escapeHtml(designCareer.title)}`);
      expect(html).toContain(topSkill.whyItMatters);

      // "How Professionals Apply It in Practice"
      expect(html).toContain("How Professionals Apply It in Practice");
      expect(html).toContain(topSkill.whatToKnow);

      // Single, clear next action
      expect(html).toContain("View in Phased Roadmap");

      // Transferable pathways explanation
      expect(html).toContain("Transferable to:");
    });

    it("displays proficiency target when available in skill data", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      const topSkill = designCareer.skills[0];
      if (topSkill.recommendedLevel) {
        expect(html).toContain(`Proficiency Target: ${topSkill.recommendedLevel}`);
      }
    });
  });

  // ── 4. View Mode Toggle (Web Map vs Skill Matrix) ──────────────────────────
  describe("View Modes and Responsiveness", () => {
    it("provides both Web Map and Skill Matrix mode options", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      expect(html).toContain("Web Map");
      expect(html).toContain("Skill Matrix");
    });

    it("renders SVG with responsive viewBox and accessibility attributes", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={designCareer} relatedCareers={designRelated} />
      );

      expect(html).toContain("viewBox=\"0 0 800 470\"");
      expect(html).toContain("role=\"img\"");
      expect(html).toContain(
        `aria-label="Interactive career constellation map for ${designCareer.title.replace(/&/g, "&amp;")}"`
      );
    });
  });

  // ── 5. Authentic Intelligence Integration ──────────────────────────────────
  describe("Authentic Intelligence & Zero Arbitrary Connections", () => {
    it("dynamically resolves real shared skills between target and related careers", () => {
      const html = renderToStaticMarkup(
        <CareerConstellation career={softwareCareer} relatedCareers={softwareRelated} />
      );

      // Should mention transferable bridge or shared competencies without hardcoding
      expect(html).toContain("Transferable to:");
      // Should not contain undefined or placeholder text
      expect(html).not.toContain("undefined");
      expect(html).not.toContain("null");
    });
  });
});
