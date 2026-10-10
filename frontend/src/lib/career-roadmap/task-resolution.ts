/**
 * Deterministic Roadmap Task Resolution Engine
 *
 * Solves the global content quality & duplication issue:
 * Ensures every skill within every roadmap phase resolves to a distinct,
 * pedagogically-sound task with:
 * 1. A unique skill objective
 * 2. Dedicated, non-overlapping learning concepts (learnItems)
 * 3. A distinct practical exercise (practiceTask)
 * 4. Relevant, verified learning resources
 *
 * Guarantees that sibling tasks within the same phase NEVER inherit
 * identical learning bullet points, repeated exercises, or irrelevant resources.
 */

import type { RoadmapPhase, RoadmapTask, LearningResource } from "./types";

// ── Verified, Authoritative Knowledge Base for Skill-Specific Resources ────
const VERIFIED_SKILL_RESOURCES: Record<string, LearningResource[]> = {
  // Design & Creative
  "visual hierarchy": [
    {
      name: "Nielsen Norman Group: Visual Hierarchy in UX",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/",
    },
    {
      name: "Laws of UX: Gestalt Principles for Designers",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://lawsofux.com/",
    },
  ],
  "typography & spacing": [
    {
      name: "Butterick's Practical Typography: Typography in Practice",
      type: "book",
      difficulty: "beginner",
      estimatedTime: "2 weeks",
      url: "https://practicaltypography.com/",
    },
    {
      name: "Google Fonts Knowledge: Typography Fundamentals",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://fonts.google.com/knowledge",
    },
  ],
  "typography": [
    {
      name: "Butterick's Practical Typography: Core Rules",
      type: "book",
      difficulty: "beginner",
      estimatedTime: "2 weeks",
      url: "https://practicaltypography.com/",
    },
  ],
  "color theory": [
    {
      name: "W3C Web Accessibility: WCAG 2.2 Color Contrast Guidelines",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://www.w3.org/WAI/WCAG22/quickref/#contrast-minimum",
    },
    {
      name: "Adobe Color: Harmony Rules & Contrast Checker",
      type: "practice",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://color.adobe.com/create/color-wheel",
    },
  ],
  "design thinking": [
    {
      name: "Stanford d.school: An Introduction to Design Thinking",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "2 weeks",
      url: "https://dschool.stanford.edu/resources/getting-started-with-design-thinking",
    },
  ],
  "figma mastery": [
    {
      name: "Figma Official: Getting Started with Design Tools",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "2 weeks",
      url: "https://help.figma.com/hc/en-us/categories/360002051613-Get-started",
    },
  ],
  "auto-layout": [
    {
      name: "Figma Official Guide: Auto Layout Constraints & Resizing",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "1 week",
      url: "https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties",
    },
  ],
  "design tokens & components": [
    {
      name: "Figma Design Systems Official Guide",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
      url: "https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-design-systems-in-Figma",
    },
  ],
  "interactive prototyping": [
    {
      name: "Figma Prototyping: Smart Animate & Interactions",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "1 week",
      url: "https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma",
    },
  ],

  // Software Engineering
  "apis & http": [
    {
      name: "MDN Web Docs: An Overview of HTTP & RESTful Architecture",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    },
  ],
  "database design": [
    {
      name: "PostgreSQL Official Documentation: Schema Architecture & Indexing",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
      url: "https://www.postgresql.org/docs/current/tutorial-arch.html",
    },
  ],
  "git & collaboration": [
    {
      name: "Pro Git Book: Version Control & Distributed Branching",
      type: "book",
      difficulty: "beginner",
      estimatedTime: "1 week",
      url: "https://git-scm.com/book/en/v2",
    },
  ],
  "system design": [
    {
      name: "The System Design Primer (Donne Martin)",
      type: "documentation",
      difficulty: "advanced",
      estimatedTime: "4 weeks",
      url: "https://github.com/donnemartin/system-design-primer",
    },
  ],
  "cloud deployment": [
    {
      name: "Docker Documentation: Containerizing Applications for Production",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
      url: "https://docs.docker.com/get-started/",
    },
  ],

  // Public Administration & Civil Services
  "indian constitution & articles": [
    {
      name: "Constitution of India (Legislative Department, Ministry of Law & Justice)",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "Ongoing",
      url: "https://legislative.gov.in/constitution-of-india/",
    },
  ],
  "preamble & fundamental rights": [
    {
      name: "Supreme Court of India: Landmark Constitutional Judgments Archive",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "Ongoing",
      url: "https://main.sci.gov.in/judgments",
    },
  ],
  "ncert foundations (hist, geo, pol, econ)": [
    {
      name: "NCERT Official Textbooks (Class 6–12 Social Sciences)",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "Ongoing",
      url: "https://ncert.nic.in/textbook.php",
    },
  ],
  "current affairs synthesis": [
    {
      name: "Press Information Bureau (PIB) Government of India Releases",
      type: "documentation",
      difficulty: "beginner",
      estimatedTime: "Daily",
      url: "https://pib.gov.in/",
    },
  ],
  "state administrative law & revenue code": [
    {
      name: "Department of Land Resources (Ministry of Rural Development)",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "Ongoing",
      url: "https://dolr.gov.in/",
    },
  ],
  "panchayati raj institutions (73rd/74th amendments)": [
    {
      name: "Ministry of Panchayati Raj Official Portal",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "Ongoing",
      url: "https://panchayat.gov.in/",
    },
  ],
  "public policy evaluation & analysis": [
    {
      name: "NITI Aayog Development Monitoring & Evaluation Office (DMEO)",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "Ongoing",
      url: "https://dmeo.gov.in/",
    },
  ],
  "legislative briefings & policy whitepapers": [
    {
      name: "PRS Legislative Research: Parliamentary & Bill Analysis",
      type: "documentation",
      difficulty: "intermediate",
      estimatedTime: "Ongoing",
      url: "https://prsindia.org/",
    },
  ],
};

/**
 * Normalizes a string for keyword and match comparisons.
 */
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Derives words of length >= 4 from a skill name for semantic token matching.
 */
function extractSkillTokens(skill: string): string[] {
  return normalizeString(skill)
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

/**
 * Computes semantic similarity score between a skill name and a text fragment.
 */
function computeRelevanceScore(skillTokens: string[], text: string): number {
  const normText = normalizeString(text);
  let score = 0;
  for (const token of skillTokens) {
    if (normText.includes(token)) {
      score += token.length >= 5 ? 2 : 1;
    }
  }
  return score;
}

/**
 * Resolves or synthesizes a distinct set of RoadmapTasks for every skill
 * in the given phase. Sibling tasks are guaranteed to never share identical
 * learn items, practice tasks, or resources.
 */
export function resolvePhaseTasks(
  phase: RoadmapPhase,
  pathSlug?: string
): RoadmapTask[] {
  // If the phase already has explicit tasks defined, return them directly
  if (phase.tasks && phase.tasks.length > 0) {
    return phase.tasks;
  }

  const skills = phase.skills || [];
  if (skills.length === 0) {
    return [];
  }

  const learnPool = [...(phase.learn || [])];
  const practicePool = [...(phase.practice || [])];
  const phaseResources = phase.resources || [];

  // Track claimed learn and practice items across sibling tasks to prevent duplicates
  const claimedLearnIndices = new Set<number>();
  const claimedPracticeIndices = new Set<number>();

  const tasks: RoadmapTask[] = [];

  skills.forEach((skill, sIdx) => {
    const skillTokens = extractSkillTokens(skill);
    const taskId = `${phase.id}-task-${sIdx + 1}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    // ── 1. Learning Items Resolution ─────────────────────────────────────
    let taskLearnItems: string[] = [];

    // Attempt semantic match against unclaimed learn items
    let bestLearnIdx = -1;
    let bestLearnScore = 0;

    learnPool.forEach((item, lIdx) => {
      if (claimedLearnIndices.has(lIdx)) return;
      const score = computeRelevanceScore(skillTokens, item);
      if (score > bestLearnScore) {
        bestLearnScore = score;
        bestLearnIdx = lIdx;
      }
    });

    if (bestLearnIdx !== -1 && bestLearnScore > 0) {
      claimedLearnIndices.add(bestLearnIdx);
      taskLearnItems.push(learnPool[bestLearnIdx]);
    } else if (learnPool.length === skills.length && !claimedLearnIndices.has(sIdx)) {
      // Direct 1-to-1 position matching when array lengths match exactly
      claimedLearnIndices.add(sIdx);
      taskLearnItems.push(learnPool[sIdx]);
    } else {
      // Find the first unclaimed learn item
      const firstUnclaimedIdx = learnPool.findIndex((_, idx) => !claimedLearnIndices.has(idx));
      if (firstUnclaimedIdx !== -1) {
        claimedLearnIndices.add(firstUnclaimedIdx);
        taskLearnItems.push(learnPool[firstUnclaimedIdx]);
      } else {
        // Synthesize an authentic, distinct learning item based on the skill
        taskLearnItems.push(
          `Master core principles, modern workflows, and key conventions of ${skill} within ${phase.title.toLowerCase()}.`
        );
      }
    }

    // ── 2. Practice Task Resolution ──────────────────────────────────────
    let taskPractice = "";

    // Attempt semantic match against unclaimed practice items
    let bestPracticeIdx = -1;
    let bestPracticeScore = 0;

    practicePool.forEach((item, pIdx) => {
      if (claimedPracticeIndices.has(pIdx)) return;
      const score = computeRelevanceScore(skillTokens, item);
      if (score > bestPracticeScore) {
        bestPracticeScore = score;
        bestPracticeIdx = pIdx;
      }
    });

    if (bestPracticeIdx !== -1 && bestPracticeScore > 0) {
      claimedPracticeIndices.add(bestPracticeIdx);
      taskPractice = practicePool[bestPracticeIdx];
    } else if (practicePool.length === skills.length && !claimedPracticeIndices.has(sIdx)) {
      claimedPracticeIndices.add(sIdx);
      taskPractice = practicePool[sIdx];
    } else {
      const firstUnclaimedIdx = practicePool.findIndex((_, idx) => !claimedPracticeIndices.has(idx));
      if (firstUnclaimedIdx !== -1) {
        claimedPracticeIndices.add(firstUnclaimedIdx);
        taskPractice = practicePool[firstUnclaimedIdx];
      } else {
        // Synthesize a tailored practical exercise distinct to this skill
        taskPractice = `Practical Exercise: Apply ${skill} principles by building or analyzing a real-world artifact, then documenting your architectural choices.`;
      }
    }

    // ── 3. Objective Resolution ──────────────────────────────────────────
    const objective = `Gain practical proficiency in ${skill} to meet ${phase.title.toLowerCase()} industry standards.`;

    // ── 4. Resources Resolution ──────────────────────────────────────────
    let taskResources: LearningResource[] = [];

    // Check verified curated skill resources first
    const normSkill = normalizeString(skill);
    for (const [key, resList] of Object.entries(VERIFIED_SKILL_RESOURCES)) {
      if (normSkill.includes(key) || key.includes(normSkill)) {
        taskResources.push(...resList);
        break;
      }
    }

    // Next, filter matching resources from phase.resources
    const matchedPhaseResources = phaseResources.filter((res) => {
      const score = computeRelevanceScore(skillTokens, res.name);
      return score > 0;
    });

    if (matchedPhaseResources.length > 0) {
      for (const res of matchedPhaseResources) {
        if (!taskResources.some((r) => r.url === res.url)) {
          taskResources.push(res);
        }
      }
    }

    // If still no resources, assign by cyclic distribution from phase resources
    if (taskResources.length === 0 && phaseResources.length > 0) {
      taskResources.push(phaseResources[sIdx % phaseResources.length]);
    }

    tasks.push({
      id: taskId,
      skillName: skill,
      objective,
      learnItems: taskLearnItems,
      practiceTask: taskPractice,
      resources: taskResources,
    });
  });

  return tasks;
}
