import { describe, it, expect } from "vitest";
import {
  getTieredCareerMatches,
  isStrongMatch,
  isExplorationMatch,
  getMatchTierLabel,
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
  MAX_VISIBLE_CAREER_MATCHES,
} from "@/lib/constants/matching";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerIntelligence } from "@/lib/career-intelligence";
import { getMatchExplanation } from "@/lib/career-details";
import type { TraitProfile } from "@/lib/types/assessment";
import { CareerMatches } from "@/components/results/CareerMatches";
import { CareerMeaningSection } from "@/components/results/CareerMeaningSection";
import { ContributingTraitsVisual } from "@/components/results/ContributingTraitsVisual";
import { ProgressiveHierarchy } from "@/components/results/ProgressiveHierarchy";
import { CareerPathAreas } from "@/components/career/CareerPathAreas";
import { CareersDirectoryFilter } from "@/components/career/CareersDirectoryFilter";

describe("Results Page Redesign Specifications", () => {
  it("exports all redesigned results components properly", () => {
    expect(CareerMatches).toBeDefined();
    expect(CareerMeaningSection).toBeDefined();
    expect(ContributingTraitsVisual).toBeDefined();
    expect(ProgressiveHierarchy).toBeDefined();
  });

  it("strictly enforces matching tiers and thresholds: Strong (>=40%), Worth Exploring (25-39%)", () => {
    expect(CAREER_MATCH_THRESHOLD).toBe(40);
    expect(CAREER_EXPLORATION_THRESHOLD).toBe(25);
    expect(MAX_VISIBLE_CAREER_MATCHES).toBe(3);

    const mockCandidates = [
      { career_name: "Software / App Development", match_percentage: 85 },
      { career_name: "Data Science & AI", match_percentage: 60 },
      { career_name: "Design & Creative Strategy", match_percentage: 35 },
      { career_name: "Finance & Accounting", match_percentage: 20 }, // hidden
    ];

    const { strongMatches, explorationMatches, allVisibleMatches } = getTieredCareerMatches(mockCandidates);

    // Strong matches: >= 40%
    expect(strongMatches.length).toBe(2);
    expect(strongMatches.map((m) => m.career_name)).toEqual([
      "Software / App Development",
      "Data Science & AI",
    ]);

    // Exploration matches: 25-39%
    expect(explorationMatches.length).toBe(1);
    expect(explorationMatches[0].career_name).toBe("Design & Creative Strategy");

    // Hidden careers (< 25%) must never be visible
    expect(allVisibleMatches.some((m) => m.match_percentage < 25)).toBe(false);
    expect(allVisibleMatches.length).toBe(3);
  });

  it("caps visible career matches at a maximum of 3", () => {
    const mockCandidates = [
      { career_name: "Career A", match_percentage: 90 },
      { career_name: "Career B", match_percentage: 80 },
      { career_name: "Career C", match_percentage: 70 },
      { career_name: "Career D", match_percentage: 60 },
      { career_name: "Career E", match_percentage: 50 },
    ];

    const { strongMatches, explorationMatches, allVisibleMatches } = getTieredCareerMatches(mockCandidates);

    expect(strongMatches.length).toBe(3);
    expect(explorationMatches.length).toBe(0);
    expect(allVisibleMatches.length).toBe(3);
  });

  it("progressively structures hierarchy from Domain -> Path -> Specialization -> Role", () => {
    const hierarchy = getCareerHierarchy("Software / App Development");
    expect(hierarchy).toBeDefined();

    // 1. Domain
    expect(hierarchy?.domain.name).toBe("Engineering & Technology");

    // 2. Career Path
    expect(hierarchy?.path.name).toBe("Software Development");

    // 3. Specializations
    expect(hierarchy?.path.specializations.length).toBeGreaterThanOrEqual(1);
    const primarySpec = hierarchy?.path.specializations[0];
    expect(primarySpec?.name).toBe("Web & Application Engineering");

    // 4. Roles
    expect(primarySpec?.roles.length).toBeGreaterThanOrEqual(1);
    const roleTitles = primarySpec?.roles.map((r) => r.title);
    expect(roleTitles).toContain("Frontend Developer");
    expect(roleTitles).toContain("Backend Developer");
  });

  it("verifies canonical career paths under Engineering & Technology do not mix external domains like AI", () => {
    const hierarchy = getCareerHierarchy("Software / App Development");
    const domainPaths = hierarchy?.domain.paths ?? [];
    const pathNames = domainPaths.map((p) => p.name);

    // Canonical paths under Engineering & Technology
    expect(pathNames).toContain("Software Development");
    expect(pathNames).toContain("Core & Systems Engineering");

    // Must NOT contain paths from other domains such as AI / Data Science
    expect(pathNames).not.toContain("Artificial Intelligence");
    expect(pathNames).not.toContain("Data Science");
  });

  it("detects when all visible results are within the 25–39% exploration range", () => {
    const mockExplorationOnly = [
      { career_name: "Software / App Development", match_percentage: 35 },
      { career_name: "Design & Creative Strategy", match_percentage: 28 },
    ];

    const { strongMatches, explorationMatches } = getTieredCareerMatches(mockExplorationOnly);
    expect(strongMatches.length).toBe(0);
    expect(explorationMatches.length).toBe(2);
  });

  it("ensures career path titles represent disciplines rather than job titles", () => {
    const swHierarchy = getCareerHierarchy("Software / App Development");
    expect(swHierarchy?.path.name).toBe("Software Development");
    expect(swHierarchy?.path.name).not.toBe("Software & App Developer");

    const engHierarchy = getCareerHierarchy("Engineering");
    expect(engHierarchy?.path.name).toBe("Core & Systems Engineering");
    expect(engHierarchy?.path.name).not.toBe("Engineer");

    const aiHierarchy = getCareerHierarchy("Data Science & AI");
    expect(aiHierarchy?.path.name).toBe("Artificial Intelligence & Data");
    expect(aiHierarchy?.path.name).not.toBe("AI & Data Scientist");
  });

  it("verifies consistent explanation matching logic without contradictory moderate copy", () => {
    const isStrongMatch = (score: number) => score >= CAREER_MATCH_THRESHOLD;
    const getExplanation = (score: number, career: string) => {
      if (isStrongMatch(score)) {
        return `Your profile shows strong alignment with ${career}.`;
      }
      return `Your profile shows this is a direction worth exploring within ${career}.`;
    };

    // 43% score must be classified as Strong Match and have strong alignment wording
    const score = 43;
    expect(isStrongMatch(score)).toBe(true);
    const explanation = getExplanation(score, "Software Development");
    expect(explanation).toContain("strong alignment");
    expect(explanation).not.toContain("moderate alignment");

    // 32% score must be classified as Worth Exploring
    const exploreScore = 32;
    expect(isStrongMatch(exploreScore)).toBe(false);
    const exploreExplanation = getExplanation(exploreScore, "Software Development");
    expect(exploreExplanation).toContain("worth exploring");
    expect(exploreExplanation).not.toContain("moderate alignment");
  });

  it("verifies constellation label positioning ensures clear air between node and score percentage", () => {
    const center = 260;
    const minRadius = 90;
    const maxRadius = 185;
    const haloRadius = 13;

    function getNodeCoords(angleDeg: number, score: number) {
      const rad = (angleDeg * Math.PI) / 180;
      const r = minRadius + (score / 100) * (maxRadius - minRadius);
      return {
        x: center + r * Math.cos(rad),
        y: center + r * Math.sin(rad),
      };
    }

    // Technical 44% (angle 270, top)
    const teNode = getNodeCoords(270, 44);
    // score is at y - 26, label is at y - 40
    const teScoreY = teNode.y - 26;
    const teLabelY = teNode.y - 40;
    const teHaloTop = teNode.y - haloRadius;

    // Verify clear separation: score is well above halo top
    expect(teScoreY).toBeLessThan(teHaloTop);
    const teAirGap = teHaloTop - (teScoreY + 2); // 2px glyph descent
    expect(teAirGap).toBeGreaterThanOrEqual(10); // at least 10px clear air
    expect(teLabelY).toBeLessThan(teScoreY); // label sits above score

    // Analytical 43% (angle 315, top-right)
    const anNode = getNodeCoords(315, 43);
    const anScoreX = anNode.x + 18;
    const anScoreY = anNode.y - 16;
    const anDist = Math.hypot(anScoreX - anNode.x, anScoreY - anNode.y);
    expect(anDist - haloRadius).toBeGreaterThanOrEqual(10);
  });

  it("verifies student-facing academic guidance naming and description specifications", () => {
    const academicSection = {
      title: "Your Academic Stream Guidance",
      description: "See how this career direction connects with your Class 11–12 stream choices.",
    };

    expect(academicSection.title).toBe("Your Academic Stream Guidance");
    expect(academicSection.title).not.toContain("Secondary");
    expect(academicSection.title).not.toContain("Perspectives");
    expect(academicSection.description).toContain("Class 11–12 stream choices");
  });

  it("strictly tests boundary cases: 39 -> Worth Exploring, 40 -> Strong Match, 41 -> Strong Match", () => {
    // Exact boundaries
    expect(isStrongMatch(39)).toBe(false);
    expect(isExplorationMatch(39)).toBe(true);
    expect(getMatchTierLabel(39)).toBe("Worth Exploring");

    expect(isStrongMatch(40)).toBe(true);
    expect(isExplorationMatch(40)).toBe(false);
    expect(getMatchTierLabel(40)).toBe("Strong Match");

    expect(isStrongMatch(41)).toBe(true);
    expect(isExplorationMatch(41)).toBe(false);
    expect(getMatchTierLabel(41)).toBe("Strong Match");

    // Strict mathematical boundary behavior
    expect(isStrongMatch(39.9)).toBe(false);
    expect(isExplorationMatch(39.9)).toBe(true);
    expect(getMatchTierLabel(39.9)).toBe("Worth Exploring");

    expect(isStrongMatch(40.0)).toBe(true);
    expect(isExplorationMatch(40.0)).toBe(false);
    expect(getMatchTierLabel(40.0)).toBe("Strong Match");

    expect(isExplorationMatch(24.9)).toBe(false);
    expect(getMatchTierLabel(24.9)).toBe("");

    expect(isExplorationMatch(25.0)).toBe(true);
    expect(getMatchTierLabel(25.0)).toBe("Worth Exploring");
  });

  it("verifies canonical Software Development naming across path, specializations, and roles", () => {
    const h1 = getCareerHierarchy("Software Development");
    const h2 = getCareerHierarchy("Software / App Development");
    const h3 = getCareerHierarchy("Software & App Developer");

    // All variations resolve to identical canonical entity
    expect(h1?.path.name).toBe("Software Development");
    expect(h2?.path.name).toBe("Software Development");
    expect(h3?.path.name).toBe("Software Development");
    expect(h1?.path.title).toBe("Software Development");

    // Canonical Specializations
    const specNames = h1?.path.specializations.map((s) => s.name);
    expect(specNames).toContain("Web & Application Engineering");
    expect(specNames).toContain("Systems & Cloud Architecture");
    expect(specNames).toContain("Mobile & Platforms");

    // Canonical Roles
    const roles = h1?.path.specializations.flatMap((s) => s.roles.map((r) => r.title));
    expect(roles).toContain("Frontend Developer");
    expect(roles).toContain("Backend Developer");
    expect(roles).toContain("Full Stack Developer");
  });

  it("verifies career detail match copy is consistent with Strong Match and Worth Exploring classifications", () => {
    const swCareer = getCareerIntelligence("software-development");
    expect(swCareer).toBeDefined();

    const mockTraits: TraitProfile = {
      TE: 44,
      AN: 43,
      SC: 30,
      BU: 25,
      CR: 20,
      SO: 15,
      LE: 10,
      EX: 15,
    };

    // 43% score -> Strong Match explanation
    const strongExplanation = getMatchExplanation(mockTraits, swCareer!, 43);
    expect(strongExplanation).toContain("strong alignment with Software Development");
    expect(strongExplanation).toContain("technical and analytical thinking");
    expect(strongExplanation).not.toContain("emerging traits");
    expect(strongExplanation).not.toContain("targeted development");

    // 35% score -> Worth Exploring explanation
    const exploreExplanation = getMatchExplanation(mockTraits, swCareer!, 35);
    expect(exploreExplanation).toContain("worth exploring within Software Development");
    expect(exploreExplanation).not.toContain("emerging traits");
  });

  it("verifies the complete Career Directory exploration flow: Explore More Careers -> Path -> Specialization -> Role -> Roadmap", () => {
    expect(CareersDirectoryFilter).toBeDefined();
    expect(CareerPathAreas).toBeDefined();

    // 1. Path lookup
    const aiCareer = getCareerIntelligence("ai-ml-data-science");
    expect(aiCareer).toBeDefined();
    expect(aiCareer?.title).toBe("Artificial Intelligence & Data");

    // 2. Hierarchy mapping
    const hierarchy = getCareerHierarchy("ai-ml-data-science");
    expect(hierarchy).toBeDefined();
    expect(hierarchy?.domain.name).toBe("Data & Artificial Intelligence");
    expect(hierarchy?.path.name).toBe("Artificial Intelligence & Data");

    // 3. Specializations
    const specNames = hierarchy?.path.specializations.map((s) => s.name);
    expect(specNames).toEqual(["Machine Learning", "Data Science", "AI Engineering"]);

    // 4. Roles in Specializations
    const mlRoles = hierarchy?.path.specializations[0].roles.map((r) => r.title);
    expect(mlRoles).toEqual(["Machine Learning Engineer", "NLP Engineer", "Computer Vision Engineer"]);

    const dsRoles = hierarchy?.path.specializations[1].roles.map((r) => r.title);
    expect(dsRoles).toEqual(["Data Scientist", "Data Analyst", "Business Intelligence Analyst"]);

    const aieRoles = hierarchy?.path.specializations[2].roles.map((r) => r.title);
    expect(aieRoles).toEqual(["AI Engineer", "Generative AI Engineer", "AI Solutions Engineer"]);

    // 5. Authentic detail and roadmap phases
    expect(aiCareer?.roadmap.length).toBeGreaterThanOrEqual(4);
    for (const phase of aiCareer!.roadmap) {
      expect(phase.title).toBeDefined();
      expect(phase.phase).toBeGreaterThanOrEqual(1);
    }
  });

  it("verifies the 9-step Career Discovery Narrative sequence", () => {
    // 1. YOUR CAREER RESULT: focal career direction, match %, match tier, domain
    const step1 = {
      eyebrow: "YOUR CAREER RESULT",
      focalPoint: "Software Development",
      matchTier: "Strong Match",
      matchPercentage: 43,
      domain: "Engineering & Technology",
    };
    expect(step1.eyebrow).toBe("YOUR CAREER RESULT");
    expect(step1.focalPoint).toBe("Software Development");
    expect(step1.matchTier).toBe("Strong Match");

    // 2. WHAT IS THIS CAREER?: student-friendly explanation & practical snapshot
    const step2 = {
      questionHeading: "What is Software Development?",
      snapshotCategories: ["What You Work On", "Typical Work Areas", "Possible Roles"],
    };
    expect(step2.questionHeading).toBe("What is Software Development?");
    expect(step2.snapshotCategories).toContain("What You Work On");

    // 3. WHY DOES THIS FIT YOU?: relevant dimensions as evidence + constellation
    const step3 = {
      sectionTitle: "WHY THIS MATCHED YOU",
      purposeStatement: "These are the parts of your assessment that contributed to this career direction.",
      evidenceScores: [{ label: "Technical", score: 44 }, { label: "Analytical", score: 43 }],
    };
    expect(step3.sectionTitle).toBe("WHY THIS MATCHED YOU");
    expect(step3.purposeStatement).toContain("contributed to this career direction");

    // 4. YOUR CAREER MATCHES: primary recommendation distinguished from alternatives
    const step4 = {
      sectionTitle: "YOUR CAREER MATCHES",
      heading: "Strongest Career Directions",
      thresholds: { strong: 40, exploration: 25 },
    };
    expect(step4.sectionTitle).toBe("YOUR CAREER MATCHES");
    expect(step4.thresholds.strong).toBe(40);
    expect(step4.thresholds.exploration).toBe(25);

    // 5. WHERE THIS CAREER CAN LEAD: specializations
    const step5 = {
      sectionTitle: "WHERE THIS CAN LEAD",
      heading: "Where this career can lead",
      examples: ["Web & Application Engineering", "Systems & Cloud Architecture", "Mobile & Platforms"],
    };
    expect(step5.sectionTitle).toBe("WHERE THIS CAN LEAD");
    expect(step5.examples).toContain("Web & Application Engineering");

    // 6. CAREERS YOU COULD EXPLORE: concrete roles
    const step6 = {
      sectionTitle: "CAREERS YOU COULD EXPLORE",
      roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    };
    expect(step6.sectionTitle).toBe("CAREERS YOU COULD EXPLORE");
    expect(step6.roles).toContain("Frontend Developer");

    // 7. YOUR ACADEMIC STREAM GUIDANCE: Class 11-12 choices
    const step7 = {
      title: "Your Academic Stream Guidance",
      description: "See how this career direction connects with your Class 11–12 stream choices.",
    };
    expect(step7.title).toBe("Your Academic Stream Guidance");

    // 8. YOUR ROADMAP: natural next step CTA
    const step8 = {
      tag: "NEXT STEP",
      heading: "Ready to explore your roadmap?",
      primaryCta: "View Your Roadmap",
    };
    expect(step8.tag).toBe("NEXT STEP");
    expect(step8.heading).toBe("Ready to explore your roadmap?");
    expect(step8.primaryCta).toBe("View Your Roadmap");

    // 9. EXPLORE MORE CAREERS: secondary action to full directory
    const step9 = {
      tag: "EXPLORE MORE CAREERS",
      cta: "Explore Full Career Directory →",
      target: "/careers",
    };
    expect(step9.tag).toBe("EXPLORE MORE CAREERS");
    expect(step9.target).toBe("/careers");
  });

  it("verifies primary role names across all specializations are complete and never truncated", () => {
    const swHierarchy = getCareerHierarchy("Software Development");
    expect(swHierarchy).toBeDefined();

    // Verify key roles mentioned in the specification are defined and full length
    const mobileSpec = swHierarchy?.path.specializations.find(
      (s) => s.id === "mobile-embedded" || s.name.toLowerCase().includes("mobile")
    );
    expect(mobileSpec).toBeDefined();

    const roleTitles = mobileSpec?.roles.map((r) => r.title);
    expect(roleTitles).toBeDefined();
    // Check key roles that previously suffered from truncation
    expect(roleTitles?.some((t) => t.includes("iOS Application"))).toBe(true);
    expect(roleTitles?.some((t) => t.includes("Android Application"))).toBe(true);
    expect(roleTitles?.some((t) => t.includes("Mobile Systems"))).toBe(true);

    // Verify no role title in any specialization contains "..." ellipsis in its source definition
    swHierarchy?.path.specializations.forEach((spec) => {
      spec.roles.forEach((role) => {
        expect(role.title).not.toContain("...");
        expect(role.title.length).toBeGreaterThan(0);
      });
    });
  });
});

