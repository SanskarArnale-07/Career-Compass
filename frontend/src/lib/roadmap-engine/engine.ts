/**
 * Personalized Roadmap Engine — Implementation
 *
 * Deterministic generator that synthesizes Career Intelligence,
 * Assessment Trait Profile, and Student Progress State into an
 * adaptive, 6-stage personalized roadmap.
 */

import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
} from "../career-intelligence";
import type {
  PersonalizedRoadmap,
  PersonalizedRoadmapPhase,
  RoadmapMilestone,
  ProgressionStage,
  StudentLevel,
  RoadmapCompletionState,
  GenerateRoadmapInput,
  MilestoneRelevance,
} from "./types";

// ── Canonical Progression Stage Definitions ──────────────────────────

interface StageMeta {
  stage: ProgressionStage;
  title: string;
  description: string;
  defaultHours: number;
}

const CANONICAL_STAGES: StageMeta[] = [
  {
    stage: "foundation",
    title: "1. Foundation & Mental Models",
    description: "Build domain intuition, core terminology, and prerequisite problem-solving fundamentals.",
    defaultHours: 35,
  },
  {
    stage: "core-skills",
    title: "2. Core Technical Competencies",
    description: "Master the essential tools, languages, and core methodologies required in professional practice.",
    defaultHours: 50,
  },
  {
    stage: "applied-skills",
    title: "3. Applied Practice & Workflows",
    description: "Translate theoretical knowledge into working prototypes, scripts, and guided implementations.",
    defaultHours: 40,
  },
  {
    stage: "projects",
    title: "4. Portfolio Projects & System Building",
    description: "Design and build standalone, verifiable projects demonstrating end-to-end execution.",
    defaultHours: 60,
  },
  {
    stage: "advanced-skills",
    title: "5. Advanced Specialization & Architecture",
    description: "Deep-dive into performance optimization, advanced paradigms, and edge-case mastery.",
    defaultHours: 45,
  },
  {
    stage: "career-prep",
    title: "6. Career Preparation & Industry Proof",
    description: "Assemble your portfolio case studies, prepare technical narratives, and target entry roles.",
    defaultHours: 25,
  },
];

// ── Helper: Deterministic Hash Generator ─────────────────────────────

function createDeterministicDigest(
  careerId: string,
  level: string,
  traits?: Record<string, number> | null,
  completedCount: number = 0
): string {
  let seed = 0;
  const str = `${careerId}-${level}-${completedCount}-${JSON.stringify(traits || {})}`;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return seed.toString(36).padStart(6, "0");
}

// ── Helper: Evaluate Student Level ───────────────────────────────────

function evaluateStudentLevel(
  career: CareerIntelligence,
  traits: Record<string, number> | null | undefined,
  completedPhasesCount: number,
  completedProjectsCount: number
): StudentLevel {
  const primaryTraits = career.primaryTraits || [];
  let primaryAvg = 50;

  if (traits && primaryTraits.length > 0) {
    const sum = primaryTraits.reduce((acc, code) => acc + (traits[code] || 0), 0);
    primaryAvg = sum / primaryTraits.length;
  }

  if (completedPhasesCount >= 4 || completedProjectsCount >= 2) {
    return "job-ready";
  }
  if (completedPhasesCount >= 2 || (completedProjectsCount >= 1 && primaryAvg >= 60)) {
    return "advanced";
  }
  if (completedPhasesCount >= 1 || primaryAvg >= 55) {
    return "intermediate";
  }
  return "beginner";
}

// ── Main Deterministic Engine ────────────────────────────────────────

export function generatePersonalizedRoadmap(input: GenerateRoadmapInput): PersonalizedRoadmap {
  // 1. Resolve Canonical Career
  const career: CareerIntelligence =
    typeof input.career === "string"
      ? resolveCareerIntelligence(input.career) || getAllCareerIntelligence()[0]
      : input.career;

  const traits = input.traitProfile || null;
  const progress = input.progress || {};
  const weeklyHours = Math.max(2, input.weeklyPaceHours || progress.weeklyPaceHours || 10);

  const completedPhases = new Set(progress.completedPhases || []);
  const completedTasks = new Set(progress.completedTasks || []);
  const completedSkills = new Set((progress.completedSkills || []).map((s) => s.toLowerCase()));
  const completedProjects = new Set((progress.completedProjects || []).map((p) => p.toLowerCase()));

  // 2. Evaluate Student Level
  const studentLevel = evaluateStudentLevel(
    career,
    traits,
    completedPhases.size,
    completedProjects.size
  );

  // 3. Trait Strengths and Gaps Analysis
  const traitStrengths: string[] = [];
  const traitGaps: string[] = [];

  if (traits) {
    for (const [code, score] of Object.entries(traits)) {
      if (score >= 60) traitStrengths.push(code);
      else if (score < 35) traitGaps.push(code);
    }
  }

  const hasHighPrimaryAptitude = career.primaryTraits.some((code) =>
    traitStrengths.includes(code)
  );
  const hasPrimaryGap = career.primaryTraits.some((code) =>
    traitGaps.includes(code)
  );

  // 4. Milestone Generation per Canonical Stage
  const allMilestones: RoadmapMilestone[] = [];
  const prereqMap: Record<string, string[]> = {};
  const phases: PersonalizedRoadmapPhase[] = [];

  let globalOrder = 1;

  for (let stageIdx = 0; stageIdx < CANONICAL_STAGES.length; stageIdx++) {
    const meta = CANONICAL_STAGES[stageIdx];
    const stageMilestones: RoadmapMilestone[] = [];

    switch (meta.stage) {
      case "foundation": {
        // Milestone 1: Core Fundamentals & Principles
        const m1Skills = career.beginnerSkills.slice(0, 2);
        const m1Completed =
          completedPhases.has(1) ||
          m1Skills.every((s) => completedSkills.has(s.toLowerCase()));

        const m1Relevance: MilestoneRelevance = hasHighPrimaryAptitude
          ? {
              priority: "fast-track",
              isGapRemedy: false,
              isFastTracked: true,
              reason: `High natural alignment with ${career.title} foundational thinking. Accelerate through basics.`,
            }
          : hasPrimaryGap
          ? {
              priority: "critical",
              isGapRemedy: true,
              isFastTracked: false,
              reason: `Essential prerequisite to address foundational trait gaps before moving into technical execution.`,
            }
          : {
              priority: "standard",
              isGapRemedy: false,
              isFastTracked: false,
              reason: `Standard domain baseline curriculum for ${career.title}.`,
            };

        const m1: RoadmapMilestone = {
          id: `${career.id}-foundation-01`,
          phaseStage: "foundation",
          title: `Foundations of ${career.title}`,
          description: `Master fundamental terminology, core logic, and basic principles of ${career.category.toLowerCase()}.`,
          skills: m1Skills,
          resources: (career.roadmap[0]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 15,
            durationText: "1–2 weeks",
          },
          prerequisites: [],
          completionState: {
            isCompleted: m1Completed,
            isUnlocked: true,
            inProgress: !m1Completed,
          },
          relevance: m1Relevance,
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Milestone 2: Environmental Setup & Basic Tools
        const m2Skills = career.beginnerSkills.slice(2, 4);
        const m2Completed =
          completedPhases.has(1) ||
          (m2Skills.length > 0 && m2Skills.every((s) => completedSkills.has(s.toLowerCase())));

        const m2: RoadmapMilestone = {
          id: `${career.id}-foundation-02`,
          phaseStage: "foundation",
          title: "Environment Setup & Developer Toolchain",
          description: `Configure your working environment with essential industry tools (${career.toolsTechnologies.slice(0, 3).join(", ") || "core tools"}).`,
          skills: m2Skills.length > 0 ? m2Skills : [career.toolsTechnologies[0] || "Toolchain Setup"],
          resources: (career.roadmap[0]?.resources || []).slice(2, 4),
          estimatedEffort: {
            hours: 15,
            durationText: "1–2 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: m2Completed,
            isUnlocked: m1Completed,
            inProgress: m1Completed && !m2Completed,
          },
          relevance: {
            priority: "standard",
            isGapRemedy: false,
            isFastTracked: hasHighPrimaryAptitude,
            reason: "Hands-on workflow setup required for all downstream deliverables.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }

      case "core-skills": {
        // Core Technical Milestone 1
        const coreSkills1 = career.intermediateSkills.slice(0, 2);
        const m1Completed =
          completedPhases.has(2) ||
          coreSkills1.every((s) => completedSkills.has(s.toLowerCase()));

        const prevMilestone = allMilestones[allMilestones.length - 1];
        const isUnlocked = prevMilestone ? prevMilestone.completionState.isCompleted : true;

        const m1: RoadmapMilestone = {
          id: `${career.id}-core-01`,
          phaseStage: "core-skills",
          title: `Core Competencies: ${coreSkills1[0] || "Technical Architecture"}`,
          description: `Develop disciplined proficiency in ${coreSkills1.join(" and ") || "core systems"}.`,
          skills: coreSkills1,
          resources: (career.roadmap[1]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 25,
            durationText: "2–3 weeks",
          },
          prerequisites: [`${career.id}-foundation-02`],
          completionState: {
            isCompleted: m1Completed,
            isUnlocked,
            inProgress: isUnlocked && !m1Completed,
          },
          relevance: {
            priority: hasPrimaryGap ? "critical" : "high",
            isGapRemedy: hasPrimaryGap,
            isFastTracked: false,
            reason: "Core engine required for solving non-trivial domain problems.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Core Technical Milestone 2: Tooling & Data Architecture
        const coreSkills2 = career.intermediateSkills.slice(2, 4);
        const m2Completed =
          completedPhases.has(3) ||
          (coreSkills2.length > 0 && coreSkills2.every((s) => completedSkills.has(s.toLowerCase())));

        const m2: RoadmapMilestone = {
          id: `${career.id}-core-02`,
          phaseStage: "core-skills",
          title: `Data Architecture & Tool Mastery`,
          description: `Deepen your command of ${career.toolsTechnologies.slice(3, 6).join(", ") || "advanced tooling"} and relational workflows.`,
          skills: coreSkills2.length > 0 ? coreSkills2 : ["Architecture & Schemas"],
          resources: (career.roadmap[2]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 25,
            durationText: "2–3 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: m2Completed,
            isUnlocked: m1Completed,
            inProgress: m1Completed && !m2Completed,
          },
          relevance: {
            priority: "high",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Connects isolated components into functioning pipelines.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }

      case "applied-skills": {
        // Milestone 1: Guided Prototype / Lab
        const appliedProj = career.recommendedProjects.find(
          (p) => p.difficulty === "beginner"
        ) || career.recommendedProjects[0];

        const m1Completed =
          appliedProj &&
          completedProjects.has(appliedProj.title.toLowerCase());

        const prevMilestone = allMilestones[allMilestones.length - 1];
        const isUnlocked = prevMilestone ? prevMilestone.completionState.isCompleted : true;

        const m1: RoadmapMilestone = {
          id: `${career.id}-applied-01`,
          phaseStage: "applied-skills",
          title: `Guided Implementation: ${appliedProj?.title || "Starter Prototype"}`,
          description: appliedProj?.description || "Apply core concepts to build a working prototype with verified outputs.",
          skills: appliedProj?.skills || career.intermediateSkills.slice(0, 2),
          projects: appliedProj ? [appliedProj] : undefined,
          resources: (career.roadmap[1]?.resources || []).slice(2, 4),
          estimatedEffort: {
            hours: 20,
            durationText: "2 weeks",
          },
          prerequisites: [`${career.id}-core-02`],
          completionState: {
            isCompleted: !!m1Completed,
            isUnlocked,
            inProgress: isUnlocked && !m1Completed,
          },
          relevance: {
            priority: "high",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Validates ability to write working solutions outside of tutorial environments.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Milestone 2: Testing, Debugging & Integration
        const m2Completed = completedPhases.has(4);
        const m2: RoadmapMilestone = {
          id: `${career.id}-applied-02`,
          phaseStage: "applied-skills",
          title: "Integration, Testing & Quality Assurance",
          description: "Implement automated testing, edge-case validation, and modular error handling.",
          skills: ["Testing & Quality", "Error Handling"],
          resources: (career.roadmap[3]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 20,
            durationText: "2 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: m2Completed,
            isUnlocked: !!m1Completed,
            inProgress: !!m1Completed && !m2Completed,
          },
          relevance: {
            priority: "standard",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Differentiates production engineers from tutorial learners.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }

      case "projects": {
        // Milestone 1: Substantial Portfolio Project
        const intermediateProj =
          career.recommendedProjects.find((p) => p.difficulty === "intermediate") ||
          career.recommendedProjects[1] ||
          career.recommendedProjects[0];

        const m1Completed =
          intermediateProj &&
          completedProjects.has(intermediateProj.title.toLowerCase());

        const prevMilestone = allMilestones[allMilestones.length - 1];
        const isUnlocked = prevMilestone ? prevMilestone.completionState.isCompleted : true;

        const m1: RoadmapMilestone = {
          id: `${career.id}-project-01`,
          phaseStage: "projects",
          title: `Full Project Build: ${intermediateProj?.title || "Core Portfolio Project"}`,
          description: intermediateProj?.description || "Architect and deliver a full-featured project demonstrating end-to-end domain skills.",
          skills: intermediateProj?.skills || career.intermediateSkills,
          projects: intermediateProj ? [intermediateProj] : undefined,
          resources: (career.roadmap[2]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 35,
            durationText: "3–4 weeks",
          },
          prerequisites: [`${career.id}-applied-02`],
          completionState: {
            isCompleted: !!m1Completed,
            isUnlocked,
            inProgress: isUnlocked && !m1Completed,
          },
          relevance: {
            priority: "critical",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Primary recruiter evaluation artifact. Demonstrates real-world software craft.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Milestone 2: Deployment & CI/CD
        const m2Completed = completedPhases.has(5);
        const m2: RoadmapMilestone = {
          id: `${career.id}-project-02`,
          phaseStage: "projects",
          title: "Cloud Deployment & Continuous Delivery",
          description: "Deploy your project live to production with custom domain, automated builds, and public documentation.",
          skills: ["Cloud Deployment", "CI/CD & DevOps"],
          resources: (career.roadmap[4]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 25,
            durationText: "2 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: m2Completed,
            isUnlocked: !!m1Completed,
            inProgress: !!m1Completed && !m2Completed,
          },
          relevance: {
            priority: "high",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Live verifiable URLs increase interview callback rates by >3x.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }

      case "advanced-skills": {
        // Milestone 1: Advanced Specialization
        const advSkills1 = career.advancedSkills.slice(0, 2);
        const m1Completed =
          completedPhases.has(6) ||
          advSkills1.every((s) => completedSkills.has(s.toLowerCase()));

        const prevMilestone = allMilestones[allMilestones.length - 1];
        const isUnlocked = prevMilestone ? prevMilestone.completionState.isCompleted : true;

        const m1: RoadmapMilestone = {
          id: `${career.id}-adv-01`,
          phaseStage: "advanced-skills",
          title: `Advanced Focus: ${advSkills1[0] || "Specialization & Scale"}`,
          description: `Master high-order capabilities in ${advSkills1.join(" and ") || "complex systems"}.`,
          skills: advSkills1,
          resources: (career.roadmap[5]?.resources || []).slice(0, 2),
          estimatedEffort: {
            hours: 25,
            durationText: "2–3 weeks",
          },
          prerequisites: [`${career.id}-project-02`],
          completionState: {
            isCompleted: m1Completed,
            isUnlocked,
            inProgress: isUnlocked && !m1Completed,
          },
          relevance: {
            priority: "standard",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Elevates your candidate profile from junior entry to high-potential hire.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Milestone 2: Advanced Capstone Deliverable
        const advancedProj =
          career.recommendedProjects.find((p) => p.difficulty === "advanced") ||
          career.recommendedProjects[2] ||
          career.recommendedProjects[career.recommendedProjects.length - 1];

        const m2Completed =
          advancedProj &&
          completedProjects.has(advancedProj.title.toLowerCase());

        const m2: RoadmapMilestone = {
          id: `${career.id}-adv-02`,
          phaseStage: "advanced-skills",
          title: `Capstone Deliverable: ${advancedProj?.title || "Advanced Capstone"}`,
          description: advancedProj?.description || "Build a sophisticated capstone exhibiting performance, scalability, and clean modular code.",
          skills: advancedProj?.skills || career.advancedSkills,
          projects: advancedProj ? [advancedProj] : undefined,
          resources: (career.roadmap[5]?.resources || []).slice(2, 4),
          estimatedEffort: {
            hours: 30,
            durationText: "3 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: !!m2Completed,
            isUnlocked: m1Completed,
            inProgress: m1Completed && !m2Completed,
          },
          relevance: {
            priority: "high",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Capstone centerpiece for senior portfolio review and technical interviews.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }

      case "career-prep": {
        // Milestone 1: Technical Portfolio & Resume
        const prepItem1 = career.preparation[0];
        const m1Completed =
          prepItem1 && completedTasks.has(prepItem1.id);

        const prevMilestone = allMilestones[allMilestones.length - 1];
        const isUnlocked = prevMilestone ? prevMilestone.completionState.isCompleted : true;

        const m1: RoadmapMilestone = {
          id: `${career.id}-prep-01`,
          phaseStage: "career-prep",
          title: "Portfolio Showcase & Resume Narrative",
          description: "Curate your project case studies, write concise architectural descriptions, and optimize your resume for applicant screening.",
          skills: ["Portfolio Presentation", "Technical Storytelling"],
          resources: [],
          estimatedEffort: {
            hours: 15,
            durationText: "1–2 weeks",
          },
          prerequisites: [`${career.id}-adv-01`],
          completionState: {
            isCompleted: !!m1Completed,
            isUnlocked,
            inProgress: isUnlocked && !m1Completed,
          },
          relevance: {
            priority: "critical",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Turns finished code into hired opportunities.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m1);

        // Milestone 2: Technical Interview & Outreach Strategy
        const prepItem2 = career.preparation[1];
        const m2Completed =
          prepItem2 && completedTasks.has(prepItem2.id);

        const m2: RoadmapMilestone = {
          id: `${career.id}-prep-02`,
          phaseStage: "career-prep",
          title: "Technical Interview Readiness & Application Sprint",
          description: "Practice mock behavioral and technical interviews, identify target companies, and initiate direct outreach.",
          skills: ["Interviewing", "Industry Networking"],
          resources: [],
          estimatedEffort: {
            hours: 15,
            durationText: "1–2 weeks",
          },
          prerequisites: [m1.id],
          completionState: {
            isCompleted: !!m2Completed,
            isUnlocked: !!m1Completed,
            inProgress: !!m1Completed && !m2Completed,
          },
          relevance: {
            priority: "critical",
            isGapRemedy: false,
            isFastTracked: false,
            reason: "Final milestone to secure your target role or internship.",
          },
          order: globalOrder++,
        };
        stageMilestones.push(m2);
        break;
      }
    }

    // Build Phase Object
    const stageCompleted = stageMilestones.every((m) => m.completionState.isCompleted);
    const stageUnlocked = stageMilestones.some((m) => m.completionState.isUnlocked);
    const stageCompletedCount = stageMilestones.filter((m) => m.completionState.isCompleted).length;
    const progressPercent = Math.round((stageCompletedCount / stageMilestones.length) * 100);

    const phaseHours = stageMilestones.reduce((acc, m) => acc + m.estimatedEffort.hours, 0);
    const phaseWeeks = Math.max(1, Math.ceil(phaseHours / weeklyHours));

    const phase: PersonalizedRoadmapPhase = {
      id: `phase-${meta.stage}`,
      stage: meta.stage,
      title: meta.title,
      description: meta.description,
      order: stageIdx + 1,
      estimatedHours: phaseHours,
      estimatedWeeks: phaseWeeks,
      milestones: stageMilestones,
      isCompleted: stageCompleted,
      isUnlocked: stageUnlocked,
      progressPercent,
    };

    phases.push(phase);

    for (const m of stageMilestones) {
      allMilestones.push(m);
      prereqMap[m.id] = m.prerequisites;
    }
  }

  // 5. Compute Global Roadmap Completion State
  const completedMilestoneIds = allMilestones
    .filter((m) => m.completionState.isCompleted)
    .map((m) => m.id);

  const completedCount = completedMilestoneIds.length;
  const totalCount = allMilestones.length;
  const overallProgressPercent = Math.round((completedCount / totalCount) * 100);

  const activeMilestone =
    allMilestones.find((m) => m.completionState.isUnlocked && !m.completionState.isCompleted) ||
    allMilestones[allMilestones.length - 1];

  const activePhase =
    phases.find((p) => p.isUnlocked && !p.isCompleted) ||
    phases[phases.length - 1];

  const completionState: RoadmapCompletionState = {
    overallProgressPercent,
    completedMilestoneIds,
    totalMilestonesCount: totalCount,
    completedMilestonesCount: completedCount,
    activeMilestoneId: activeMilestone?.id || null,
    activePhaseStage: activePhase?.stage || "foundation",
    nextMilestone: activeMilestone || null,
  };

  // 6. Skills, Projects & Resources Aggregation
  const gapRemedySkills = allMilestones
    .filter((m) => m.relevance.isGapRemedy)
    .flatMap((m) => m.skills);

  const acceleratedSkills = allMilestones
    .filter((m) => m.relevance.isFastTracked)
    .flatMap((m) => m.skills);

  const totalHours = allMilestones.reduce((acc, m) => acc + m.estimatedEffort.hours, 0);
  const totalWeeks = Math.max(1, Math.ceil(totalHours / weeklyHours));

  const allProjects = career.recommendedProjects || [];
  const completedProjectsCount = allProjects.filter((p) =>
    completedProjects.has(p.title.toLowerCase())
  ).length;

  const nextProject =
    allProjects.find((p) => !completedProjects.has(p.title.toLowerCase())) || null;

  const allResources = allMilestones.flatMap((m) => m.resources);

  // 7. Deterministic Roadmap ID
  const roadmapId = `roadmap-${career.id}-${studentLevel}-${createDeterministicDigest(
    career.id,
    studentLevel,
    traits,
    completedCount
  )}`;

  return {
    roadmapId,
    career: {
      id: career.id,
      slug: career.slug,
      title: career.title,
      category: career.category,
    },
    studentLevel,
    phases,
    milestones: allMilestones,
    skills: {
      totalCount: career.requiredSkills.length,
      masteredCount: completedSkills.size,
      inProgressCount: Math.max(0, career.requiredSkills.length - completedSkills.size),
      gapRemedySkills: Array.from(new Set(gapRemedySkills)),
      acceleratedSkills: Array.from(new Set(acceleratedSkills)),
    },
    projects: {
      totalCount: allProjects.length,
      completedCount: completedProjectsCount,
      items: allProjects,
      nextProject,
    },
    resources: allResources,
    estimatedEffort: {
      totalHours,
      totalWeeks,
      weeklyHours,
    },
    prerequisites: prereqMap,
    completionState,
  };
}
