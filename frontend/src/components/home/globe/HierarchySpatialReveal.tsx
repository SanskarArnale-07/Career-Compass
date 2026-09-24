"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";

interface HierarchySpatialRevealProps {
  scrollProgress: number; // 0 to 1
  radius?: number;
}

// Canonical hierarchy branch data for Engineering & Technology
const domain = CAREER_DOMAINS[0]; // Engineering & Technology
const pathSoftware = domain.paths[0]; // Software Development
const specWeb = pathSoftware.specializations[0]; // Web & Application Engineering
const targetRole = specWeb.roles[2]; // Full Stack Developer

export function HierarchySpatialReveal({
  scrollProgress,
  radius = 2.4,
}: HierarchySpatialRevealProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Active in range 0.48 -> 0.74
  const { masterOpacity, pathProgress, specProgress, roleProgress } = useMemo(() => {
    if (scrollProgress < 0.48 || scrollProgress > 0.75) {
      return { masterOpacity: 0, pathProgress: 0, specProgress: 0, roleProgress: 0 };
    }

    // Master fade in and out
    let master = 1;
    if (scrollProgress >= 0.48 && scrollProgress <= 0.53) {
      master = (scrollProgress - 0.48) / (0.53 - 0.48);
    } else if (scrollProgress > 0.53 && scrollProgress <= 0.69) {
      master = 1;
    } else {
      master = 1 - (scrollProgress - 0.69) / (0.75 - 0.69);
    }

    // Progressive stage unfolds:
    // 1. Paths appear: 0.50 -> 0.56
    const pProg = Math.max(0, Math.min(1, (scrollProgress - 0.50) / 0.06));
    // 2. Specs appear: 0.56 -> 0.62
    const sProg = Math.max(0, Math.min(1, (scrollProgress - 0.56) / 0.06));
    // 3. Roles appear: 0.62 -> 0.68
    const rProg = Math.max(0, Math.min(1, (scrollProgress - 0.62) / 0.06));

    return {
      masterOpacity: Math.max(0, Math.min(1, master)),
      pathProgress: pProg,
      specProgress: sProg,
      roleProgress: rProg,
    };
  }, [scrollProgress]);

  // Spatial Positions anchored to the front of the globe, branching into positive Z (towards camera)
  // Positioned comfortably below the 64px navbar, well within safe viewport frustum across all desktop resolutions
  const rootPos = useMemo(() => new THREE.Vector3(0, 0.24, radius * 0.95), [radius]);

  // Level 1: Paths (Compact horizontal spread)
  const pathSoftwarePos = useMemo(
    () => new THREE.Vector3(-0.48 * pathProgress, 0.02, radius * 0.95 + 0.35 * pathProgress),
    [pathProgress, radius]
  );
  const pathSystemsPos = useMemo(
    () => new THREE.Vector3(0.44 * pathProgress, 0.02, radius * 0.95 + 0.22 * pathProgress),
    [pathProgress, radius]
  );

  // Level 2: Specializations under Software Development
  const specWebPos = useMemo(
    () => new THREE.Vector3(-0.56 * specProgress, -0.22, radius * 0.95 + 0.60 * specProgress),
    [specProgress, radius]
  );
  const specCloudPos = useMemo(
    () => new THREE.Vector3(-0.2 * specProgress, -0.34, radius * 0.95 + 0.48 * specProgress),
    [specProgress, radius]
  );
  const specMobilePos = useMemo(
    () => new THREE.Vector3(0.12 * specProgress, -0.34, radius * 0.95 + 0.48 * specProgress),
    [specProgress, radius]
  );

  // Level 3: Concrete Roles under Web & App Engineering
  const role1Pos = useMemo(
    () => new THREE.Vector3(-0.66 * roleProgress, -0.46, radius * 0.95 + 0.82 * roleProgress),
    [roleProgress, radius]
  );
  const role2Pos = useMemo(
    () => new THREE.Vector3(-0.44 * roleProgress, -0.52, radius * 0.95 + 0.86 * roleProgress),
    [roleProgress, radius]
  );
  const role3Pos = useMemo(
    () => new THREE.Vector3(-0.16 * roleProgress, -0.46, radius * 0.95 + 0.90 * roleProgress),
    [roleProgress, radius]
  );

  // Active path line buffer (bright cyan)
  const activeBranchLines = useMemo(() => {
    const lines: number[] = [];
    if (pathProgress > 0.05) {
      lines.push(rootPos.x, rootPos.y, rootPos.z, pathSoftwarePos.x, pathSoftwarePos.y, pathSoftwarePos.z);
    }
    if (specProgress > 0.05) {
      lines.push(pathSoftwarePos.x, pathSoftwarePos.y, pathSoftwarePos.z, specWebPos.x, specWebPos.y, specWebPos.z);
    }
    if (roleProgress > 0.05) {
      lines.push(specWebPos.x, specWebPos.y, specWebPos.z, role3Pos.x, role3Pos.y, role3Pos.z);
    }
    return new Float32Array(lines);
  }, [rootPos, pathSoftwarePos, specWebPos, role3Pos, pathProgress, specProgress, roleProgress]);

  // Inactive sibling lines buffer (dim slate)
  const inactiveSiblingLines = useMemo(() => {
    const lines: number[] = [];
    if (pathProgress > 0.05) {
      lines.push(rootPos.x, rootPos.y, rootPos.z, pathSystemsPos.x, pathSystemsPos.y, pathSystemsPos.z);
    }
    if (specProgress > 0.05) {
      lines.push(pathSoftwarePos.x, pathSoftwarePos.y, pathSoftwarePos.z, specCloudPos.x, specCloudPos.y, specCloudPos.z);
      lines.push(pathSoftwarePos.x, pathSoftwarePos.y, pathSoftwarePos.z, specMobilePos.x, specMobilePos.y, specMobilePos.z);
    }
    if (roleProgress > 0.05) {
      lines.push(specWebPos.x, specWebPos.y, specWebPos.z, role1Pos.x, role1Pos.y, role1Pos.z);
      lines.push(specWebPos.x, specWebPos.y, specWebPos.z, role2Pos.x, role2Pos.y, role2Pos.z);
    }
    return new Float32Array(lines);
  }, [
    rootPos,
    pathSystemsPos,
    pathSoftwarePos,
    specCloudPos,
    specMobilePos,
    specWebPos,
    role1Pos,
    role2Pos,
    pathProgress,
    specProgress,
    roleProgress,
  ]);

  if (masterOpacity <= 0.001) return null;

  return (
    <group ref={groupRef}>
      {/* Active Connecting Branch Filaments (Vibrant Cyan) */}
      {activeBranchLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[activeBranchLines, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00E5FF"
            transparent
            opacity={masterOpacity * 0.65}
          />
        </lineSegments>
      )}

      {/* Inactive Sibling Filaments (Dim Slate) */}
      {inactiveSiblingLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[inactiveSiblingLines, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#334155"
            transparent
            opacity={masterOpacity * 0.25}
          />
        </lineSegments>
      )}

      {/* ACTIVE DOMAIN NODE (Root: Engineering & Tech) */}
      <group position={rootPos}>
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.5} />
        </mesh>
        <Html
          position={[0, 0.12, 0]}
          center
          style={{ pointerEvents: "none", opacity: masterOpacity }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-pulse" />
            <span className="text-lg sm:text-xl font-heading font-bold text-cyan-200 tracking-tight">
              {domain.name.replace("Technology", "Tech")}
            </span>
          </div>
        </Html>
      </group>

      {/* LEVEL 1: PATHS */}
      {pathProgress > 0.05 && (
        <>
          {/* Active Path: Software Development */}
          <group position={pathSoftwarePos}>
            <mesh>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.3} />
            </mesh>
            <Html
              position={[0, 0.11, 0]}
              center
              style={{ pointerEvents: "none", opacity: masterOpacity * pathProgress }}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-sm sm:text-base font-heading font-semibold text-cyan-300 tracking-tight">
                  {pathSoftware.name}
                </span>
              </div>
            </Html>
          </group>

          {/* Sibling Path: Core & Systems Engineering (Mesh dimmed, label HIDDEN) */}
          <group position={pathSystemsPos}>
            <mesh>
              <sphereGeometry args={[0.04, 14, 14]} />
              <meshStandardMaterial color="#334155" emissive="#1E293B" emissiveIntensity={0.2} />
            </mesh>
          </group>
        </>
      )}

      {/* LEVEL 2: SPECIALIZATIONS */}
      {specProgress > 0.05 && (
        <>
          {/* Active Spec: Web & Apps */}
          <group position={specWebPos}>
            <mesh>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.2} />
            </mesh>
            <Html
              position={[0, 0.10, 0]}
              center
              style={{ pointerEvents: "none", opacity: masterOpacity * specProgress }}
            >
              <div className="flex items-center gap-1 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
                <span className="text-xs sm:text-sm font-heading font-medium text-cyan-200">
                  {specWeb.name.replace("Application Engineering", "Apps")}
                </span>
              </div>
            </Html>
          </group>

          {/* Sibling Specs: Dimmed, labels HIDDEN */}
          <group position={specCloudPos}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#334155" emissive="#1E293B" emissiveIntensity={0.15} />
            </mesh>
          </group>

          <group position={specMobilePos}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#334155" emissive="#1E293B" emissiveIntensity={0.15} />
            </mesh>
          </group>
        </>
      )}

      {/* LEVEL 3: CONCRETE ROLES */}
      {roleProgress > 0.05 && (
        <>
          {/* Active Role: Full Stack Developer */}
          <group position={role3Pos}>
            <mesh>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial
                color="#00E5FF"
                emissive="#00E5FF"
                emissiveIntensity={1.6}
              />
            </mesh>

            {/* Glowing Accent Ring */}
            <mesh>
              <ringGeometry args={[0.085, 0.11, 20]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>

            <Html
              position={[0, 0.11, 0]}
              center
              style={{ pointerEvents: "none", opacity: masterOpacity * roleProgress }}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_10px_rgba(0,229,255,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-200 animate-pulse" />
                <span className="text-xs sm:text-sm font-heading font-bold text-white tracking-tight">
                  {targetRole.title}
                </span>
              </div>
            </Html>
          </group>

          {/* Sibling Roles: Dimmed, labels HIDDEN */}
          <group position={role1Pos}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#334155" emissive="#1E293B" emissiveIntensity={0.15} />
            </mesh>
          </group>

          <group position={role2Pos}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#334155" emissive="#1E293B" emissiveIntensity={0.15} />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
}
