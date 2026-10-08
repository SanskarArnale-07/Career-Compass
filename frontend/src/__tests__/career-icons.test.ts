import { describe, it, expect } from "vitest";
import {
  getCareerIcon,
  getCareerIconName,
  getSpecializationIcon,
  getDomainIcon,
  CAREER_ICON_MAP,
  SPECIALIZATION_ICON_MAP,
} from "../lib/career-icons";
import { getAllCareerPaths } from "../lib/career-hierarchy";
import {
  Code2,
  ShieldCheck,
  BrainCircuit,
  ChartNoAxesCombined,
  Stethoscope,
  Scale,
  Building2,
  PanelsTopLeft,
  Palette,
  PenTool,
  Brush,
  Layers,
  Gamepad2,
  Film,
  Clapperboard,
  Briefcase,
  Compass,
} from "lucide-react";

describe("Career Compass Central Icon Mapping (career-icons.ts)", () => {
  describe("1. Canonical Career Paths Icon Accuracy", () => {
    it("assigns Code2 for Software Development", () => {
      expect(getCareerIcon("software-development")).toBe(Code2);
      expect(getCareerIcon("Software Development")).toBe(Code2);
      expect(getCareerIconName("software-development")).toBe("Code2");
    });

    it("assigns ShieldCheck for Cybersecurity", () => {
      expect(getCareerIcon("cybersecurity")).toBe(ShieldCheck);
      expect(getCareerIcon("Cybersecurity & Defense")).toBe(ShieldCheck);
      expect(getCareerIconName("cybersecurity")).toBe("ShieldCheck");
    });

    it("assigns BrainCircuit for Data & AI", () => {
      expect(getCareerIcon("ai-ml-data-science")).toBe(BrainCircuit);
      expect(getCareerIcon("Artificial Intelligence & Data")).toBe(BrainCircuit);
      expect(getCareerIconName("ai-ml-data-science")).toBe("BrainCircuit");
    });

    it("assigns ChartNoAxesCombined for Finance", () => {
      expect(getCareerIcon("finance-investment")).toBe(ChartNoAxesCombined);
      expect(getCareerIcon("Finance & FinTech")).toBe(ChartNoAxesCombined);
      expect(getCareerIconName("finance-investment")).toBe("ChartNoAxesCombined");
    });

    it("assigns Stethoscope for Medicine & Healthcare", () => {
      expect(getCareerIcon("medicine-healthcare")).toBe(Stethoscope);
      expect(getCareerIcon("Clinical Medicine & Patient Care")).toBe(Stethoscope);
      expect(getCareerIconName("medicine-healthcare")).toBe("Stethoscope");
    });

    it("assigns Scale for Law & Policy", () => {
      expect(getCareerIcon("law-policy")).toBe(Scale);
      expect(getCareerIcon("Legal Systems & Public Policy")).toBe(Scale);
      expect(getCareerIconName("law-policy")).toBe("Scale");
    });

    it("assigns Building2 for Engineering & Architecture", () => {
      expect(getCareerIcon("engineering")).toBe(Building2);
      expect(getCareerIcon("Core & Systems Engineering")).toBe(Building2);
      expect(getCareerIconName("engineering")).toBe("Building2");
    });

    it("assigns PanelsTopLeft for UI/UX & Product Design", () => {
      expect(getCareerIcon("design-creative")).toBe(PanelsTopLeft);
      expect(getCareerIcon("UI/UX & Product Design")).toBe(PanelsTopLeft);
      expect(getCareerIcon("Digital Product & UI/UX Design")).toBe(PanelsTopLeft);
      expect(getCareerIconName("design-creative")).toBe("PanelsTopLeft");
      expect(getCareerIconName("UI/UX & Product Design")).toBe("PanelsTopLeft");
    });

    it("assigns Brush for Visual Brand & Spatial Design", () => {
      expect(getCareerIcon("visual-brand-communication")).toBe(Brush);
      expect(getCareerIcon("Visual Brand & Spatial Design")).toBe(Brush);
      expect(getCareerIcon("Brand & Visual Design")).toBe(Brush);
      expect(getCareerIconName("visual-brand-communication")).toBe("Brush");
      expect(getCareerIconName("Visual Brand & Spatial Design")).toBe("Brush");
    });

    it("assigns Gamepad2 for Game & Interactive Media", () => {
      expect(getCareerIcon("game-multimedia-design")).toBe(Gamepad2);
      expect(getCareerIcon("Game & Interactive Media")).toBe(Gamepad2);
      expect(getCareerIcon("Game Design")).toBe(Gamepad2);
      expect(getCareerIconName("game-multimedia-design")).toBe("Gamepad2");
      expect(getCareerIconName("Game Design")).toBe("Gamepad2");
    });

    it("assigns Clapperboard for Animation & 3D Media", () => {
      expect(getCareerIcon("animation-3d-media")).toBe(Clapperboard);
      expect(getCareerIcon("Animation & 3D Media")).toBe(Clapperboard);
      expect(getCareerIconName("animation-3d-media")).toBe("Clapperboard");
      expect(getCareerIconName("Animation & 3D Media")).toBe("Clapperboard");
    });

    it("assigns distinct, unique semantic icons to all creative category paths (no shared generic Palette icon)", () => {
      const uiUxIcon = getCareerIcon("UI/UX & Product Design");
      const visualBrandIcon = getCareerIcon("Visual Brand & Spatial Design");
      const gameMediaIcon = getCareerIcon("Game & Interactive Media");
      const animationIcon = getCareerIcon("Animation & 3D Media");

      expect(uiUxIcon).toBe(PanelsTopLeft);
      expect(visualBrandIcon).toBe(Brush);
      expect(gameMediaIcon).toBe(Gamepad2);
      expect(animationIcon).toBe(Clapperboard);

      // Verify each path has its unique semantic icon
      const icons = [uiUxIcon, visualBrandIcon, gameMediaIcon, animationIcon];
      const uniqueIcons = new Set(icons);
      expect(uniqueIcons.size).toBe(4);
      expect(icons).not.toContain(Palette);
    });
  });

  describe("2. Specialization Icons Accuracy", () => {
    it("maps UI/UX specializations accurately (PenTool, Palette)", () => {
      expect(getSpecializationIcon("ux-product-experience", "design-creative")).toBe(PenTool);
      expect(getSpecializationIcon("design-systems-ui", "design-creative")).toBe(Palette);
    });

    it("maps Visual Branding specializations accurately (Brush, Layers)", () => {
      expect(getSpecializationIcon("brand-identity", "visual-brand-communication")).toBe(Brush);
      expect(getSpecializationIcon("motion-spatial", "visual-brand-communication")).toBe(Layers);
    });

    it("maps Game Design specializations accurately (Gamepad2)", () => {
      expect(getSpecializationIcon("gameplay-mechanics", "game-multimedia-design")).toBe(Gamepad2);
    });

    it("maps Animation specializations accurately (Clapperboard)", () => {
      expect(getSpecializationIcon("character-animation", "animation-3d-media")).toBe(Clapperboard);
    });
  });

  describe("3. Full Career Taxonomy Audit (No Generic Briefcase Icons)", () => {
    it("ensures all canonical career paths resolve to valid, non-Briefcase icons", () => {
      const allPaths = getAllCareerPaths();
      expect(allPaths.length).toBeGreaterThanOrEqual(20);

      for (const path of allPaths) {
        const iconBySlug = getCareerIcon(path.slug);
        const iconByName = getCareerIcon(path.name);
        const iconName = getCareerIconName(path.slug);

        // None should resolve to generic Briefcase
        expect(iconBySlug).not.toBe(Briefcase);
        expect(iconByName).not.toBe(Briefcase);
        expect(iconName).not.toBe("Briefcase");

        // None should resolve to default Compass fallback when slug or name is looked up
        expect(iconBySlug).not.toBe(Compass);
        expect(iconByName).not.toBe(Compass);
        expect(iconName).not.toBe("Compass");
      }
    });

    it("ensures all specializations across all career paths resolve to meaningful icons", () => {
      const allPaths = getAllCareerPaths();
      let totalSpecs = 0;

      for (const path of allPaths) {
        for (const spec of path.specializations) {
          totalSpecs++;
          const specIcon = getSpecializationIcon(spec.id, path.slug);

          // None should be generic Briefcase
          expect(specIcon).not.toBe(Briefcase);
          // Should be a valid Lucide component
          expect(typeof specIcon).toBe("object");
        }
      }

      expect(totalSpecs).toBeGreaterThanOrEqual(60);
    });
  });

  describe("4. Fallbacks and Edge Cases", () => {
    it("returns Compass when identifier is undefined or null", () => {
      expect(getCareerIcon(undefined)).toBe(Compass);
      expect(getCareerIcon(null)).toBe(Compass);
      expect(getCareerIconName(null)).toBe("Compass");
    });

    it("falls back to parent path icon if specialization is unknown", () => {
      const fallbackIcon = getSpecializationIcon("unknown-spec", "cybersecurity");
      expect(fallbackIcon).toBe(ShieldCheck);
    });

    it("falls back to keyword matching if unrecognized slug contains keywords", () => {
      expect(getCareerIcon("custom-cloud-architect-role")).toBe(CAREER_ICON_MAP["cloud-infrastructure"]);
      expect(getCareerIcon("junior-game-dev")).toBe(Gamepad2);
    });
  });
});
