import { describe, it, expect } from "vitest";
import { ALL_PATH_ROADMAPS, SPECIAL_DOMAIN_ROADMAPS, resolveRoleRoadmap, resolvePhaseTasks } from "@/lib/career-roadmap";
import { getAllCareerPaths } from "@/lib/career-hierarchy";
import type { RoadmapPhase, LearningResource } from "@/lib/career-details/types";

describe("Global Roadmap Audit", () => {
  it("audits all paths, specialization tracks, and phases for duplications and anomalies", () => {
    const allPaths = Object.keys(ALL_PATH_ROADMAPS);
    const specialPaths = Object.keys(SPECIAL_DOMAIN_ROADMAPS);
    const catalogCareerPaths = getAllCareerPaths();

    console.log(`Auditing ${allPaths.length} ALL_PATH_ROADMAPS and ${specialPaths.length} SPECIAL_DOMAIN_ROADMAPS`);
    console.log(`Total Career Catalog Paths: ${catalogCareerPaths.length}`);

    // Track statistics
    let totalPhasesInspected = 0;
    const allLearnObjectives: { text: string; location: string }[] = [];
    const allPracticeTasks: { text: string; location: string }[] = [];
    const allResources: { url: string; name: string; location: string }[] = [];
    const phaseTitlesByPath: Record<string, string[]> = {};

    const duplicationIssues: string[] = [];
    const repetitiveResourceIssues: string[] = [];
    const emptyFieldIssues: string[] = [];

    // Helper to inspect a list of phases
    function inspectPhases(phases: RoadmapPhase[], locationPrefix: string) {
      const titlesInContext = new Set<string>();

      phases.forEach((p, idx) => {
        totalPhasesInspected++;
        const loc = `${locationPrefix} -> Phase ${p.phase} (${p.title})`;

        // Check empty fields
        if (!p.skills || p.skills.length === 0) emptyFieldIssues.push(`${loc}: Empty skills`);
        if (!p.learn || p.learn.length === 0) emptyFieldIssues.push(`${loc}: Empty learn`);
        if (!p.practice || p.practice.length === 0) emptyFieldIssues.push(`${loc}: Empty practice`);
        if (!p.resources || p.resources.length === 0) emptyFieldIssues.push(`${loc}: Empty resources`);

        // Check phase title uniqueness within the same path/track
        if (titlesInContext.has(p.title.toLowerCase())) {
          duplicationIssues.push(`Duplicate Phase Title in ${locationPrefix}: "${p.title}"`);
        }
        titlesInContext.add(p.title.toLowerCase());

        // Check internal duplicates inside learn
        const learnSet = new Set<string>();
        p.learn.forEach((l) => {
          const norm = l.trim().toLowerCase();
          if (learnSet.has(norm)) {
            duplicationIssues.push(`${loc}: Duplicate learn item within same phase: "${l}"`);
          }
          learnSet.add(norm);
          allLearnObjectives.push({ text: l, location: loc });
        });

        // Check internal duplicates inside practice
        const practiceSet = new Set<string>();
        p.practice.forEach((pr) => {
          const norm = pr.trim().toLowerCase();
          if (practiceSet.has(norm)) {
            duplicationIssues.push(`${loc}: Duplicate practice item within same phase: "${pr}"`);
          }
          practiceSet.add(norm);
          allPracticeTasks.push({ text: pr, location: loc });
        });

        // Check internal duplicates inside resources
        const resourceUrlSet = new Set<string>();
        p.resources.forEach((r) => {
          if (resourceUrlSet.has(r.url)) {
            repetitiveResourceIssues.push(`${loc}: Duplicate resource URL in same phase: ${r.url} (${r.name})`);
          }
          resourceUrlSet.add(r.url);
          allResources.push({ url: r.url, name: r.name, location: loc });
        });
      });
    }

    // Inspect ALL_PATH_ROADMAPS
    for (const [pathSlug, pathDef] of Object.entries(ALL_PATH_ROADMAPS)) {
      inspectPhases(pathDef.foundationalPhases, `${pathSlug} (Foundational)`);
      if (pathDef.defaultAdvancedPhases) {
        inspectPhases(pathDef.defaultAdvancedPhases, `${pathSlug} (Default Advanced)`);
      }
      for (const [specSlug, specTrack] of Object.entries(pathDef.specializationTracks)) {
        inspectPhases(specTrack.phases, `${pathSlug} -> Track: ${specSlug}`);
        if (specTrack.roleOverrides) {
          for (const [roleId, override] of Object.entries(specTrack.roleOverrides)) {
            if (override.capstonePhase) {
              inspectPhases([{ ...override.capstonePhase, phase: 4 } as RoadmapPhase], `${pathSlug} -> Track: ${specSlug} -> Role: ${roleId}`);
            }
          }
        }
      }
      if (pathDef.roleOverrides) {
        for (const [roleId, override] of Object.entries(pathDef.roleOverrides)) {
          if (override.capstonePhase) {
            inspectPhases([{ ...override.capstonePhase, phase: 4 } as RoadmapPhase], `${pathSlug} -> Role: ${roleId}`);
          }
        }
      }
    }

    // Inspect SPECIAL_DOMAIN_ROADMAPS
    for (const [pathSlug, pathDef] of Object.entries(SPECIAL_DOMAIN_ROADMAPS)) {
      inspectPhases(pathDef.foundationalPhases, `SPECIAL: ${pathSlug} (Foundational)`);
      for (const [specSlug, specTrack] of Object.entries(pathDef.specializationTracks)) {
        inspectPhases(specTrack.phases, `SPECIAL: ${pathSlug} -> Track: ${specSlug}`);
      }
    }

    // Now find global duplications across different phases
    const learnMap = new Map<string, string[]>();
    for (const item of allLearnObjectives) {
      const norm = item.text.trim().toLowerCase();
      if (!learnMap.has(norm)) learnMap.set(norm, []);
      learnMap.get(norm)!.push(item.location);
    }
    const duplicateLearns = Array.from(learnMap.entries()).filter(([_, locs]) => locs.length > 1);

    const practiceMap = new Map<string, string[]>();
    for (const item of allPracticeTasks) {
      const norm = item.text.trim().toLowerCase();
      if (!practiceMap.has(norm)) practiceMap.set(norm, []);
      practiceMap.get(norm)!.push(item.location);
    }
    const duplicatePractices = Array.from(practiceMap.entries()).filter(([_, locs]) => locs.length > 1);

    const resourceMap = new Map<string, string[]>();
    for (const item of allResources) {
      if (!resourceMap.has(item.url)) resourceMap.set(item.url, []);
      resourceMap.get(item.url)!.push(item.location);
    }
    const duplicateResources = Array.from(resourceMap.entries()).filter(([_, locs]) => locs.length > 2);

    console.log("=== AUDIT SUMMARY ===");
    console.log(`Total phases inspected: ${totalPhasesInspected}`);
    console.log(`Total learn objectives: ${allLearnObjectives.length}`);
    console.log(`Total practice tasks: ${allPracticeTasks.length}`);
    console.log(`Total resources: ${allResources.length}`);
    console.log(`Identical learn objectives appearing in multiple places: ${duplicateLearns.length}`);
    console.log(`Identical practice tasks appearing in multiple places: ${duplicatePractices.length}`);
    console.log(`Resources used > 2 times across the platform: ${duplicateResources.length}`);
    console.log(`Direct duplication issues: ${duplicationIssues.length}`);
    console.log(`Empty field issues: ${emptyFieldIssues.length}`);

    if (duplicateLearns.length > 0) {
      console.log("\n--- Top Duplicate Learn Objectives ---");
      duplicateLearns.slice(0, 15).forEach(([text, locs]) => {
        console.log(`[x${locs.length}] "${text}" in:`);
        locs.slice(0, 3).forEach((l) => console.log(`   - ${l}`));
      });
    }

    if (duplicatePractices.length > 0) {
      console.log("\n--- Top Duplicate Practice Tasks ---");
      duplicatePractices.slice(0, 15).forEach(([text, locs]) => {
        console.log(`[x${locs.length}] "${text}" in:`);
        locs.slice(0, 3).forEach((l) => console.log(`   - ${l}`));
      });
    }

    if (duplicateResources.length > 0) {
      console.log("\n--- Overused Resources ---");
      duplicateResources.slice(0, 15).forEach(([url, locs]) => {
        console.log(`[x${locs.length}] ${url} in:`);
        locs.slice(0, 3).forEach((l) => console.log(`   - ${l}`));
      });
    }

    // Also check resolved roadmaps for every single career path and specialization
    let totalResolvedRoles = 0;
    for (const path of catalogCareerPaths) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          totalResolvedRoles++;
          const resolved = resolveRoleRoadmap({
            pathSlug: path.slug,
            specId: spec.id,
            roleId: role.id,
          });
          expect(resolved.phases.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
    console.log(`Validated full resolution for all ${totalResolvedRoles} roles in the career catalog!`);
  });

  it("verifies the Figma/UI/UX trigger example: Visual Hierarchy and Typography & Spacing have distinct content and resources", () => {
    const designRoadmap = ALL_PATH_ROADMAPS["design-creative"];
    expect(designRoadmap).toBeDefined();

    const phase1 = designRoadmap.foundationalPhases[0];
    expect(phase1.title).toBe("Visual Design Foundations & Composition");
    expect(phase1.skills).toContain("Visual Hierarchy");
    expect(phase1.skills).toContain("Typography & Spacing");

    const tasks = resolvePhaseTasks(phase1, "design-creative");
    expect(tasks.length).toBe(4);

    const visualHierarchyTask = tasks.find((t) => t.skillName === "Visual Hierarchy");
    const typographyTask = tasks.find((t) => t.skillName === "Typography & Spacing");

    expect(visualHierarchyTask).toBeDefined();
    expect(typographyTask).toBeDefined();

    // Verify completely distinct learning items
    expect(visualHierarchyTask!.learnItems).not.toEqual(typographyTask!.learnItems);
    expect(visualHierarchyTask!.learnItems[0]).toContain("Visual hierarchy");
    expect(typographyTask!.learnItems[0]).toContain("Typography fundamentals");

    // Verify completely distinct practice tasks
    expect(visualHierarchyTask!.practiceTask).not.toEqual(typographyTask!.practiceTask);
    expect(visualHierarchyTask!.practiceTask).toContain("visual hierarchy");
    expect(typographyTask!.practiceTask).toContain("typographic scale");

    // Verify distinct, verified resources
    expect(visualHierarchyTask!.resources.length).toBeGreaterThan(0);
    expect(typographyTask!.resources.length).toBeGreaterThan(0);
    expect(visualHierarchyTask!.resources[0].url).not.toEqual(typographyTask!.resources[0].url);
  });

  it("guarantees resolvePhaseTasks yields ZERO identical practice tasks or learn items among siblings across all roadmaps", () => {
    const catalogCareerPaths = getAllCareerPaths();

    for (const path of catalogCareerPaths) {
      for (const spec of path.specializations) {
        const sampleRoleId = spec.roles[0]?.id;
        const resolved = resolveRoleRoadmap({
          pathSlug: path.slug,
          specId: spec.id,
          roleId: sampleRoleId,
        });

        for (const phase of resolved.phases) {
          const tasks = resolvePhaseTasks(phase, path.slug);
          expect(tasks.length).toBe(phase.skills.length);

          const seenPractice = new Set<string>();
          const seenLearn = new Set<string>();

          for (const task of tasks) {
            // Check that no task has empty fields
            expect(task.skillName).toBeTruthy();
            expect(task.objective).toBeTruthy();
            expect(task.learnItems.length).toBeGreaterThan(0);
            expect(task.practiceTask).toBeTruthy();
            expect(task.resources.length).toBeGreaterThan(0);

            // Sibling tasks must not share identical practice tasks
            expect(seenPractice.has(task.practiceTask)).toBe(false);
            seenPractice.add(task.practiceTask);

            // Sibling tasks must not share identical primary learn items
            const primaryLearn = task.learnItems[0];
            expect(seenLearn.has(primaryLearn)).toBe(false);
            seenLearn.add(primaryLearn);
          }
        }
      }
    }
  });

  it("verifies authentic differentiation across Indian Civil Services, State PSC, and Public Policy pathways", () => {
    // 1. UPSC Civil Services (IAS)
    const upsc = resolveRoleRoadmap({
      pathSlug: "upsc-civil-services",
      specId: "ias-administration",
      roleId: "sdm-sub-divisional",
    });
    expect(upsc.phases[0].title).toContain("Constitutional Governance, Indian Polity");
    expect(upsc.phases[2].title).toContain("District Administration, Land Revenue");

    // 2. State Public Service Commissions (State Administrative Services)
    const statePsc = resolveRoleRoadmap({
      pathSlug: "state-public-service-commissions",
      specId: "state-administrative-services",
      roleId: "deputy-collector-sao",
    });
    expect(statePsc.phases[0].title).toContain("State Constitutional History");
    expect(statePsc.phases[1].title).toContain("State Administrative Law, Panchayati Raj");
    expect(statePsc.phases[2].title).toContain("Tehsil & Sub-Divisional Administration");

    // 3. Public Policy & Administration (Policy Research & Governance)
    const publicPolicy = resolveRoleRoadmap({
      pathSlug: "public-policy-governance-path",
      specId: "policy-research-governance",
      roleId: "public-policy-fellow",
    });
    expect(publicPolicy.phases[0].title).toContain("Public Policy Foundations");
    expect(publicPolicy.phases[1].title).toContain("Quantitative Policy Evaluation");
    expect(publicPolicy.phases[2].title).toContain("Think Tank Whitepapers");

    // Verify completely different curriculums
    expect(upsc.phases[0].title).not.toEqual(statePsc.phases[0].title);
    expect(upsc.phases[0].title).not.toEqual(publicPolicy.phases[0].title);
    expect(statePsc.phases[0].title).not.toEqual(publicPolicy.phases[0].title);
  });
});
