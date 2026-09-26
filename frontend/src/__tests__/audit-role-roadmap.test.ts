import { describe, it } from "vitest";
import { getAllCareerDomains, getAllCareerPaths, getRoleHierarchy } from "@/lib/career-hierarchy";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";
import fs from "fs";
import path from "path";

describe("Role -> Roadmap Comprehensive Audit", () => {
  it("audits every single concrete role across all domains and paths", () => {
    const domains = getAllCareerDomains();
    const allPaths = getAllCareerPaths();

    // 12 curated career paths with handcrafted roadmaps in src/lib/career-details/careers/
    const CURATED_SLUGS = new Set([
      "software-development",
      "ai-ml-data",
      "design-creative",
      "engineering",
      "medicine",
      "law-policy",
      "finance",
      "management",
      "marketing-media",
      "psychology-social",
      "scientific-research",
      "entrepreneurship",
    ]);

    interface RoleAuditRecord {
      roleId: string;
      roleTitle: string;
      isEntryLevel: boolean;
      domainId: string;
      domainName: string;
      pathSlug: string;
      pathName: string;
      specId: string;
      specName: string;
      navigationUrl: string;
      directRoleRoadmapExists: boolean;
      pathRoadmapExists: boolean;
      pathRoadmapPhasesCount: number;
      pathRoadmapPhaseTitles: string[];
      isCuratedPath: boolean;
      status: "Correct" | "Missing" | "Broken" | "Incorrect" | "Shared-Valid" | "Shared-Questionable";
      classificationReason: string;
      priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
    }

    const auditRecords: RoleAuditRecord[] = [];

    // First, inspect what resolveCareerIntelligence returns for each of the 25 paths:
    console.log("=== PATH ROADMAP RESOLUTION AUDIT ===");
    for (const d of domains) {
      console.log(`\nDomain: ${d.name} (${d.paths.length} paths)`);
      for (const p of d.paths) {
        const intel = resolveCareerIntelligence(p.slug);
        const isFromBase = Boolean(intel && intel.id !== p.slug);
        const phases = intel?.roadmap || [];
        console.log(`  Path: [${p.slug}] "${p.name}"`);
        console.log(`    Resolved to: id="${intel?.id}", title="${intel?.title}", isFromBase=${isFromBase}, phasesCount=${phases.length}`);
        console.log(`    Phases: ${phases.map((ph) => `[${ph.phase}] ${ph.title}`).join(" -> ")}`);
      }
    }

            // Check if there is any role-specific roadmap directly in registry
            // (resolveCareerIntelligence by default falls back to path if passed role ID,
            // so we check whether resolveCareerIntelligence(role.id) returns a role-specific ID or the path ID)
            const roleIntel = resolveCareerIntelligence(role.id);
            const directRoleRoadmapExists = Boolean(roleIntel && roleIntel.id === role.id && roleIntel.id !== cPath.slug);

            const pathRoadmapExists = pathRoadmap.length > 0;
            const phaseTitles = pathRoadmap.map((p) => `Phase ${p.phase}: ${p.title}`);

            let status: RoleAuditRecord["status"] = "Shared-Valid";
            let reason = "";
            let priority: RoleAuditRecord["priority"] = "LOW";

            if (!pathRoadmapExists) {
              status = "Missing";
              reason = `No roadmap exists for parent career path ${cPath.slug}`;
              priority = "HIGH";
            } else if (cPath.slug === "software-development") {
              if (spec.id === "mobile-app-eng") {
                // iOS Developer, Android Developer, Cross-Platform Mobile Engineer
                status = "Incorrect";
                reason = "Mobile development role points to Web Backend SWE roadmap (Phase 4: Node/Express/Django Backend APIs) with ZERO mobile platform milestones (Swift, SwiftUI, Kotlin, Jetpack Compose, Flutter).";
                priority = "CRITICAL";
              } else if (spec.id === "systems-cloud") {
                // Cloud Systems Architect, DevOps, Distributed Systems
                status = "Shared-Questionable";
                reason = "Cloud Systems and DevOps roles share a Web Application SWE roadmap whose Phase 4 is web application backend APIs rather than cloud infrastructure, CI/CD, Kubernetes, and IaC.";
                priority = "MEDIUM";
              } else if (role.id === "frontend-dev") {
                status = "Shared-Questionable";
                reason = "Frontend Developer role receives a roadmap that requires Backend Development (Phase 4) and full backend system design, with no dedicated UI/React/Next.js/CSS architecture phase.";
                priority = "MEDIUM";
              } else {
                // Backend Developer, Full Stack Developer
                status = "Shared-Valid";
                reason = "Shared foundational software development roadmap covers algorithms, databases, backend APIs, and systems design appropriately.";
                priority = "LOW";
              }
            } else if (cPath.slug === "ai-ml-data-science") {
              if (spec.id === "data-science-analytics" && (role.id === "business-intelligence-analyst" || role.id === "data-analyst")) {
                status = "Shared-Questionable";
                reason = "Data Analyst / BI Analyst receives an intensive AI/ML research roadmap covering Deep Learning, NLP/LLMs, and Computer Vision rather than business analytics, SQL, Tableau/PowerBI, and metrics.";
                priority = "MEDIUM";
              } else {
                status = "Shared-Valid";
                reason = "AI/ML and Data Science roles share appropriate statistical learning, ML modeling, and production deployment milestones.";
                priority = "LOW";
              }
            } else if (cPath.slug === "core-systems-engineering") {
              if (spec.id === "iot-edge-engineering") {
                status = "Shared-Questionable";
                reason = "IoT / Edge Engineering roles receive Core Systems Engineering roadmap which emphasizes general mechanical and embedded systems rather than connected IoT protocols, edge computing, and cloud telemetry.";
                priority = "MEDIUM";
              } else {
                status = "Shared-Valid";
                reason = "Physical systems and hardware engineering roles share core engineering and CAD/fabrication curriculum.";
                priority = "LOW";
              }
            } else if (cPath.slug === "legal-practice-advocacy") {
              if (spec.id === "policy-governance") {
                status = "Shared-Questionable";
                reason = "Public policy and regulatory roles receive courtroom litigation / bar prep curriculum instead of policy drafting, public administration, and regulatory analysis.";
                priority = "MEDIUM";
              } else {
                status = "Shared-Valid";
                reason = "Litigation, corporate law, and defense roles share common foundational LLB curriculum, bar prep, and case analysis.";
                priority = "LOW";
              }
            } else if (cPath.slug === "clinical-medicine-healthcare") {
              if (spec.id === "allied-health-diagnostics") {
                status = "Shared-Questionable";
                reason = "Radiology and diagnostic technology roles share physician MBBS / medical residency roadmap with medical entrance and surgical rotations.";
                priority = "MEDIUM";
              } else {
                status = "Shared-Valid";
                reason = "Core medical doctor roles appropriately share foundational MBBS, clinical rotations, and medical licensing milestones.";
                priority = "LOW";
              }
            } else if (cPath.slug === "visual-ui-ux-design") {
              if (spec.id === "game-3d-visual-design") {
                status = "Shared-Questionable";
                reason = "3D Game Environment Artist and 3D Asset Artists receive a 2D Product UI/UX roadmap (Figma, user interviews, journey mapping, WCAG design systems) rather than 3D modeling (Blender/Maya, Unreal Engine, shaders, texturing).";
                priority = "MEDIUM";
              } else {
                status = "Shared-Valid";
                reason = "UI/UX, Product Design, and Design Systems roles share appropriate product design, prototyping, and user research milestones.";
                priority = "LOW";
              }
            } else {
              // For all other synthesized paths in the 25-path hierarchy:
              // Check if the path's synthesized roadmap aligns well with this specialization.
              // In buildCareerIntelligenceFromHierarchy:
              // Phase 1 has general foundation
              // Phase 2 has skills from primarySpecialization (the first specialization in the path!)
              // Phase 3 has senior roles
              // Phase 4 has capstone
              const isPrimarySpec = cPath.specializations[0]?.id === spec.id;
              if (isPrimarySpec) {
                status = "Shared-Valid";
                reason = `Role belongs to the primary specialization (${spec.name}) directly highlighted in Phase 2 of this career path roadmap.`;
                priority = "LOW";
              } else {
                // Secondary/tertiary specialization under a synthesized path
                status = "Shared-Questionable";
                reason = `Role is in secondary specialization (${spec.name}), but the path roadmap specifically hardcodes Phase 2 focus onto the primary specialization (${cPath.specializations[0]?.name}).`;
                priority = "MEDIUM";
              }
            }

            auditRecords.push({
              roleId: role.id,
              roleTitle: role.title,
              isEntryLevel: role.isEntryLevel ?? false,
              domainId: domain.id,
              domainName: domain.name,
              pathSlug: cPath.slug,
              pathName: cPath.name,
              specId: spec.id,
              specName: spec.name,
              navigationUrl: navUrl,
              directRoleRoadmapExists,
              pathRoadmapExists,
              pathRoadmapPhasesCount: pathRoadmap.length,
              pathRoadmapPhaseTitles: phaseTitles,
              isCuratedPath: isCurated,
              status,
              classificationReason: reason,
              priority,
            });
          }
        }
      }
    }

    // Domain-by-domain aggregation
    const domainStats: Record<string, {
      name: string;
      totalRoles: number;
      correct: number;
      missing: number;
      broken: number;
      incorrect: number;
      sharedValid: number;
      sharedQuestionable: number;
      problemRoles: { role: string; path: string; spec: string; status: string; reason: string; priority: string }[];
    }> = {};

    for (const d of domains) {
      domainStats[d.id] = {
        name: d.name,
        totalRoles: 0,
        correct: 0,
        missing: 0,
        broken: 0,
        incorrect: 0,
        sharedValid: 0,
        sharedQuestionable: 0,
        problemRoles: [],
      };
    }

    for (const r of auditRecords) {
      const ds = domainStats[r.domainId];
      if (!ds) continue;
      ds.totalRoles++;
      if (r.status === "Correct") ds.correct++;
      else if (r.status === "Missing") ds.missing++;
      else if (r.status === "Broken") ds.broken++;
      else if (r.status === "Incorrect") ds.incorrect++;
      else if (r.status === "Shared-Valid") ds.sharedValid++;
      else if (r.status === "Shared-Questionable") ds.sharedQuestionable++;

      if (r.status === "Incorrect" || r.status === "Broken" || r.status === "Missing" || r.status === "Shared-Questionable") {
        ds.problemRoles.push({
          role: r.roleTitle,
          path: r.pathName,
          spec: r.specName,
          status: r.status,
          reason: r.classificationReason,
          priority: r.priority,
        });
      }
    }

    const totalRoles = auditRecords.length;
    const totalCorrect = auditRecords.filter((r) => r.status === "Correct").length;
    const totalMissing = auditRecords.filter((r) => r.status === "Missing").length;
    const totalBroken = auditRecords.filter((r) => r.status === "Broken").length;
    const totalIncorrect = auditRecords.filter((r) => r.status === "Incorrect").length;
    const totalSharedValid = auditRecords.filter((r) => r.status === "Shared-Valid").length;
    const totalSharedQuestionable = auditRecords.filter((r) => r.status === "Shared-Questionable").length;

    const criticalRoles = auditRecords.filter((r) => r.priority === "CRITICAL");
    const highRoles = auditRecords.filter((r) => r.priority === "HIGH");
    const mediumRoles = auditRecords.filter((r) => r.priority === "MEDIUM");
    const lowRoles = auditRecords.filter((r) => r.priority === "LOW");

    const auditOutput = {
      summary: {
        totalRoles,
        totalCorrect,
        totalMissing,
        totalBroken,
        totalIncorrect,
        totalSharedValid,
        totalSharedQuestionable,
        criticalCount: criticalRoles.length,
        highCount: highRoles.length,
        mediumCount: mediumRoles.length,
        lowCount: lowRoles.length,
      },
      domainBreakdown: domainStats,
      criticalRoles: criticalRoles.map((r) => ({
        role: r.roleTitle,
        path: r.pathName,
        spec: r.specName,
        reason: r.classificationReason,
      })),
      mediumRoles: mediumRoles.map((r) => ({
        role: r.roleTitle,
        path: r.pathName,
        spec: r.specName,
        reason: r.classificationReason,
      })),
    };

    const outPath = "C:/Users/Sanskar Arnale/.gemini/antigravity-ide/brain/8783d1ca-6ab7-4ad4-83ba-6e17b35153a9/scratch/role_roadmap_audit_results.json";
    fs.writeFileSync(outPath, JSON.stringify(auditOutput, null, 2));

    console.log("=== ROLE -> ROADMAP AUDIT SUMMARY ===");
    console.log(JSON.stringify(auditOutput.summary, null, 2));

    for (const [did, dData] of Object.entries(domainStats)) {
      console.log(`\n--- Domain: ${dData.name} ---`);
      console.log(`Total Roles: ${dData.totalRoles}`);
      console.log(`Correct: ${dData.correct}`);
      console.log(`Missing: ${dData.missing}`);
      console.log(`Broken: ${dData.broken}`);
      console.log(`Incorrect: ${dData.incorrect}`);
      console.log(`Shared but valid: ${dData.sharedValid}`);
      console.log(`Shared/questionable: ${dData.sharedQuestionable}`);
      if (dData.problemRoles.length > 0) {
        console.log(`Problematic roles (${dData.problemRoles.length}):`);
        dData.problemRoles.forEach((pr) => {
          console.log(`  - [${pr.priority}] ${pr.role} (${pr.path} -> ${pr.spec}): ${pr.status} - ${pr.reason}`);
        });
      }
    }
  });
});
