/**
 * Canonical Career Roadmap Resolver
 *
 * Implements the 3-tier Hybrid Roadmap Architecture:
 * PATH FOUNDATION -> SPECIALIZATION TRACK -> OPTIONAL ROLE CAPSTONE
 *
 * Resolution flow:
 * 1. Resolve path definition from pathSlug (or infer from roleId/specId).
 * 2. Select the specialization track matching specId (or infer from roleId).
 * 3. Apply role-specific capstone/override when educationally justified.
 * 4. Return one cleanly composed, sequentially-numbered roadmap with stable IDs.
 */

import type {
  PathRoadmapDefinition,
  ResolveRoleRoadmapParams,
  ComposedRoleRoadmap,
  RoadmapPhase,
  RoleRoadmapOverride,
  SpecializationTrack,
} from "./types";
import { HANDCRAFTED_PATH_ROADMAPS } from "./tracks/handcrafted-paths";
import { SYNTHESIZED_PATH_ROADMAPS } from "./tracks/synthesized-paths";
import {
  UPSC_CIVIL_SERVICES_ROADMAP,
  STATE_PSC_ROADMAP,
  PUBLIC_POLICY_ROADMAP,
} from "./tracks/civil-services-path";
import {
  getRoleHierarchy,
  getSpecializationHierarchy,
  getCareerHierarchy,
  getAllCareerPaths,
} from "../career-hierarchy/registry";

// ── Master Catalog of Path Roadmaps ────────────────────────────────────────

export const ALL_PATH_ROADMAPS: Record<string, PathRoadmapDefinition> = {
  ...HANDCRAFTED_PATH_ROADMAPS,
  ...SYNTHESIZED_PATH_ROADMAPS,
};

// ── Dedicated Public Governance / Civil Services Roadmaps ──────────────────
export const SPECIAL_DOMAIN_ROADMAPS: Record<string, PathRoadmapDefinition> = {
  "upsc-civil-services": UPSC_CIVIL_SERVICES_ROADMAP,
  "state-public-service-commissions": STATE_PSC_ROADMAP,
  "public-policy-governance-path": PUBLIC_POLICY_ROADMAP,
};

// ── Known Role ID Aliases ──────────────────────────────────────────────────

const ROLE_ID_ALIASES: Record<string, string[]> = {
  "pentester": ["penetration-tester", "ethical-hacker"],
  "penetration-tester": ["pentester", "ethical-hacker"],
  "digital-forensics-investigator": ["dfir-investigator", "forensics-investigator"],
  "dfir-investigator": ["digital-forensics-investigator", "forensics-investigator"],
  "security-grc-analyst": ["grc-analyst", "security-compliance-analyst"],
  "grc-analyst": ["security-grc-analyst", "security-compliance-analyst"],
  "clinical-trials-coord": ["clinical-trials-manager", "clinical-trial-coordinator"],
  "clinical-trials-manager": ["clinical-trials-coord", "clinical-trial-coordinator"],
  "clinical-trial-coordinator": ["clinical-trials-coord", "clinical-trials-manager"],
  "algo-trader": ["algorithmic-trader", "algorithmic-strategies-developer"],
  "algorithmic-trader": ["algo-trader", "algorithmic-strategies-developer"],
  "corporate-associate": ["corporate-lawyer", "corporate-counsel"],
  "corporate-lawyer": ["corporate-associate", "corporate-counsel"],
  "cloud-solutions-arch": ["cloud-systems-architect", "cloud-architect"],
  "cloud-systems-architect": ["cloud-solutions-arch", "cloud-architect"],
  "cloud-architect": ["cloud-solutions-arch", "cloud-systems-architect"],
  "game-audio-designer": ["interactive-game-audio-designer"],
  "interactive-game-audio-designer": ["game-audio-designer"],
  "ios-dev": ["ios-developer", "ios-engineer", "ios-application-engineer"],
  "ios-application-engineer": ["ios-dev", "ios-developer"],
  "android-dev": ["android-developer", "android-engineer"],
  "plc-programmer": ["plc-engineer"],
  "ux-researcher": ["user-experience-researcher"],
  "vc-analyst": ["venture-capital-analyst"],
  "bi-data-analyst": ["data-analyst"],
  "data-analyst": ["bi-data-analyst"],
  "frontend-dev": ["frontend-developer"],
  "backend-dev": ["backend-developer"],
};

// ── Helper: Find Role Override ─────────────────────────────────────────────

function findRoleOverride(
  roleId: string,
  track?: SpecializationTrack,
  pathDef?: PathRoadmapDefinition
): RoleRoadmapOverride | undefined {
  const candidateKeys = [roleId, ...(ROLE_ID_ALIASES[roleId] || [])];

  // 1. Check in the selected specialization track
  if (track?.roleOverrides) {
    for (const key of candidateKeys) {
      if (track.roleOverrides[key]) {
        return track.roleOverrides[key];
      }
    }
  }

  // 2. Check across all specialization tracks in the path definition
  if (pathDef?.specializationTracks) {
    for (const t of Object.values(pathDef.specializationTracks)) {
      if (t.roleOverrides) {
        for (const key of candidateKeys) {
          if (t.roleOverrides[key]) {
            return t.roleOverrides[key];
          }
        }
      }
    }
  }

  // 3. Check direct path role overrides
  if (pathDef?.roleOverrides) {
    for (const key of candidateKeys) {
      if (pathDef.roleOverrides[key]) {
        return pathDef.roleOverrides[key];
      }
    }
  }

  return undefined;
}

// ── Canonical Roadmap Resolver ─────────────────────────────────────────────

/**
 * Resolves a tailored, hybrid roadmap for any Career Path, Specialization, or Role.
 *
 * Guarantees:
 * - Path foundation is always respected and preserved.
 * - Selected specialization determines the intermediate/advanced phases (no specializations[0] bias).
 * - Target role receives its educational capstone override when justified.
 * - Always falls back gracefully without breaking if an ID is missing or deprecated.
 * - Produces sequentially numbered phases with stable, deterministic IDs.
 */
export function resolveRoleRoadmap({
  pathSlug,
  specId,
  roleId,
}: ResolveRoleRoadmapParams): ComposedRoleRoadmap {
  let resolvedPathSlug = (pathSlug || "").trim();
  let resolvedSpecId = (specId || "").trim() || undefined;
  const resolvedRoleId = (roleId || "").trim() || undefined;

  // 1. If roleId is provided, attempt to infer missing pathSlug or specId from the career registry
  if (resolvedRoleId) {
    const roleHierarchy = getRoleHierarchy(resolvedRoleId);
    if (roleHierarchy) {
      if (!resolvedPathSlug || (!ALL_PATH_ROADMAPS[resolvedPathSlug] && !SPECIAL_DOMAIN_ROADMAPS[resolvedPathSlug])) {
        resolvedPathSlug = roleHierarchy.path.slug;
      }
      if (!resolvedSpecId) {
        resolvedSpecId = roleHierarchy.spec.id;
      }
    } else {
      // Check aliases for roleHierarchy
      const aliases = ROLE_ID_ALIASES[resolvedRoleId] || [];
      for (const a of aliases) {
        const h = getRoleHierarchy(a);
        if (h) {
          if (!resolvedPathSlug || (!ALL_PATH_ROADMAPS[resolvedPathSlug] && !SPECIAL_DOMAIN_ROADMAPS[resolvedPathSlug])) {
            resolvedPathSlug = h.path.slug;
          }
          if (!resolvedSpecId) {
            resolvedSpecId = h.spec.id;
          }
          break;
        }
      }
    }
  }

  // 2. If specId is provided and pathSlug is still missing, infer pathSlug from spec
  if (resolvedSpecId && (!resolvedPathSlug || (!ALL_PATH_ROADMAPS[resolvedPathSlug] && !SPECIAL_DOMAIN_ROADMAPS[resolvedPathSlug]))) {
    const specHierarchy = getSpecializationHierarchy(resolvedSpecId);
    if (specHierarchy) {
      resolvedPathSlug = specHierarchy.path.slug;
    }
  }

  // 3. Fallback pathSlug resolution using path registry lookup
  if (!ALL_PATH_ROADMAPS[resolvedPathSlug] && !SPECIAL_DOMAIN_ROADMAPS[resolvedPathSlug]) {
    const careerHierarchy = getCareerHierarchy(resolvedPathSlug);
    if (careerHierarchy && (ALL_PATH_ROADMAPS[careerHierarchy.path.slug] || SPECIAL_DOMAIN_ROADMAPS[careerHierarchy.path.slug])) {
      resolvedPathSlug = careerHierarchy.path.slug;
    } else {
      // Default to software-development if completely unrecognized
      resolvedPathSlug = "software-development";
    }
  }

  const pathDef =
    SPECIAL_DOMAIN_ROADMAPS[resolvedPathSlug] ||
    ALL_PATH_ROADMAPS[resolvedPathSlug] ||
    ALL_PATH_ROADMAPS["software-development"];

  // 4. Resolve Specialization Track
  let selectedSpecTrack: SpecializationTrack | undefined;
  if (resolvedSpecId && pathDef.specializationTracks[resolvedSpecId]) {
    selectedSpecTrack = pathDef.specializationTracks[resolvedSpecId];
  } else if (resolvedSpecId) {
    // Case-insensitive or name match
    const lower = resolvedSpecId.toLowerCase();
    for (const [key, track] of Object.entries(pathDef.specializationTracks)) {
      if (key.toLowerCase() === lower || track.name.toLowerCase() === lower) {
        selectedSpecTrack = track;
        resolvedSpecId = key;
        break;
      }
    }
  }

  // 5. Resolve Role Override
  const roleOverride = resolvedRoleId
    ? findRoleOverride(resolvedRoleId, selectedSpecTrack, pathDef)
    : undefined;

  // 6. Compose the Raw Roadmap Phases
  // A. Foundational phases (Tier 1)
  const basePhases = pathDef.foundationalPhases.map((p) => ({ ...p }));

  // B. Specialization track phases (Tier 2)
  let trackPhases: RoadmapPhase[] = [];
  if (selectedSpecTrack && selectedSpecTrack.phases.length > 0) {
    trackPhases = selectedSpecTrack.phases.map((p) => ({ ...p }));
  } else if (pathDef.defaultAdvancedPhases && pathDef.defaultAdvancedPhases.length > 0) {
    trackPhases = pathDef.defaultAdvancedPhases.map((p) => ({ ...p }));
  }

  // C. Role Capstone Override (Tier 3)
  if (roleOverride?.capstonePhase) {
    const capstone = roleOverride.capstonePhase;
    const lastTrackPhase = trackPhases[trackPhases.length - 1];

    // If the track already has advanced phases and the last phase has comparable duration or is a capstone,
    // replace the last phase with the role-specific capstone; otherwise append.
    if (lastTrackPhase && trackPhases.length >= 2 && lastTrackPhase.estimatedDuration === capstone.estimatedDuration) {
      trackPhases[trackPhases.length - 1] = {
        ...lastTrackPhase,
        id: capstone.id,
        title: capstone.title,
        description: capstone.description,
        estimatedDuration: capstone.estimatedDuration,
        skills: capstone.skills,
        learn: capstone.learn,
        practice: capstone.practice,
        build: capstone.build,
        resources: capstone.resources,
      };
    } else {
      trackPhases.push({
        id: capstone.id,
        phase: basePhases.length + trackPhases.length + 1,
        title: capstone.title,
        description: capstone.description,
        estimatedDuration: capstone.estimatedDuration,
        skills: capstone.skills,
        learn: capstone.learn,
        practice: capstone.practice,
        build: capstone.build,
        resources: capstone.resources,
      });
    }
  } else if (roleOverride?.phaseModifications) {
    // Apply granular modifications to the target phase
    const mod = roleOverride.phaseModifications;
    const targetIdx = (mod.targetPhaseNumber ? mod.targetPhaseNumber - 1 : trackPhases.length - 1);
    if (trackPhases[targetIdx]) {
      const target = trackPhases[targetIdx];
      trackPhases[targetIdx] = {
        ...target,
        title: mod.title || target.title,
        description: mod.description || target.description,
        skills: mod.skillsToAdd ? [...target.skills, ...mod.skillsToAdd] : target.skills,
        learn: mod.learnToAdd ? [...target.learn, ...mod.learnToAdd] : target.learn,
        practice: mod.practiceToAdd ? [...target.practice, ...mod.practiceToAdd] : target.practice,
        build: mod.buildOverride || target.build,
        resources: mod.resourcesToAdd ? [...target.resources, ...mod.resourcesToAdd] : target.resources,
      };
    }
  }

  // 7. Assemble and Renumber All Phases Sequentially with Stable IDs
  const combinedRawPhases = [...basePhases, ...trackPhases];
  const finalSpecSlug = selectedSpecTrack?.id || "foundation";

  const composedPhases: RoadmapPhase[] = combinedRawPhases.map((phase, idx) => {
    const phaseNumber = idx + 1;
    return {
      ...phase,
      phase: phaseNumber,
      // Deterministic, stable ID without raw array indices
      id: `${pathDef.pathSlug}-${finalSpecSlug}-phase-${phaseNumber}`,
    };
  });

  // 8. Determine Granularity Level
  const granularity: "PATH" | "SPECIALIZATION" | "ROLE" = roleOverride
    ? "ROLE"
    : selectedSpecTrack
    ? "SPECIALIZATION"
    : "PATH";

  return {
    pathSlug: pathDef.pathSlug,
    pathName: pathDef.pathName,
    specId: selectedSpecTrack?.id,
    specName: selectedSpecTrack?.name,
    roleId: roleOverride?.roleId || resolvedRoleId,
    roleTitle: roleOverride?.roleTitle,
    granularity,
    phases: composedPhases,
    meta: {
      foundationalPhasesCount: basePhases.length,
      specializationPhasesCount: selectedSpecTrack?.phases.length || 0,
      hasRoleOverride: !!roleOverride,
    },
  };
}

/**
 * Returns summary statistics about registered roadmaps.
 */
export function getRoadmapInventoryStats() {
  const pathSlugs = Object.keys(ALL_PATH_ROADMAPS);
  let totalSpecTracks = 0;
  let totalRoleOverrides = 0;

  for (const path of Object.values(ALL_PATH_ROADMAPS)) {
    totalSpecTracks += Object.keys(path.specializationTracks).length;
    if (path.roleOverrides) {
      totalRoleOverrides += Object.keys(path.roleOverrides).length;
    }
    for (const spec of Object.values(path.specializationTracks)) {
      if (spec.roleOverrides) {
        totalRoleOverrides += Object.keys(spec.roleOverrides).length;
      }
    }
  }

  return {
    totalPaths: pathSlugs.length,
    totalSpecTracks,
    totalRoleOverrides,
  };
}
