"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CAREER_DOMAINS } from "@/lib/career-hierarchy";

interface DomainNodesProps {
  radius?: number;
  scrollProgress: number; // 0 to 1
  activeDomainId?: string;
  onSelectDomain?: (id: string) => void;
}

// Spherical anchors for the 6 canonical domains (theta, phi in radians)
// Domain 0 is positioned so it rotates across the front-center of the viewport during 0.35 -> 0.49
const DOMAIN_COORDINATES = [
  { theta: Math.PI * 1.12, phi: Math.PI * 0.48 }, // 0: Engineering & Technology (Front-Center)
  { theta: Math.PI * 1.45, phi: Math.PI * 0.36 }, // 1: Data & AI (Upper Right)
  { theta: Math.PI * 1.78, phi: Math.PI * 0.54 }, // 2: Design & Creative (Rear Right)
  { theta: Math.PI * 0.11, phi: Math.PI * 0.38 }, // 3: Business & Management (Top)
  { theta: Math.PI * 0.44, phi: Math.PI * 0.58 }, // 4: Healthcare & Sciences (Rear Left)
  { theta: Math.PI * 0.77, phi: Math.PI * 0.36 }, // 5: Media & Social Impact (Upper Left)
];

// Helper to compute orthogonal tangent vectors u, v for any unit normal vector n
function computeTangentBasis(n: THREE.Vector3): { u: THREE.Vector3; v: THREE.Vector3 } {
  const up = Math.abs(n.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(n, up).normalize();
  const v = new THREE.Vector3().crossVectors(n, u).normalize();
  return { u, v };
}

// Helper to get offset position on sphere surface given normal n, angular distance delta, and bearing alpha
function getSphericalOffset(
  n: THREE.Vector3,
  u: THREE.Vector3,
  v: THREE.Vector3,
  delta: number,
  alpha: number,
  r: number
): THREE.Vector3 {
  const cosDelta = Math.cos(delta);
  const sinDelta = Math.sin(delta);
  const cosAlpha = Math.cos(alpha);
  const sinAlpha = Math.sin(alpha);

  const pos = new THREE.Vector3()
    .copy(n)
    .multiplyScalar(cosDelta)
    .addScaledVector(u, sinDelta * cosAlpha)
    .addScaledVector(v, sinDelta * sinAlpha)
    .normalize()
    .multiplyScalar(r);

  return pos;
}

export function DomainNodes({
  radius = 2.4,
  scrollProgress,
  activeDomainId = "engineering-technology",
}: DomainNodesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Contraction factor during Phase 5 (0.72 -> 0.84)
  const contractFactor = useMemo(() => {
    if (scrollProgress < 0.72) return 1;
    if (scrollProgress > 0.84) return 0.0;
    return 1 - (scrollProgress - 0.72) / (0.84 - 0.72);
  }, [scrollProgress]);

  // Nodes visibility opacity (strictly reaches 0 by 0.84 before CTA)
  const nodesOpacity = useMemo(() => {
    if (scrollProgress < 0.10) return 0.7 + scrollProgress * 2.0;
    if (scrollProgress < 0.72) return 1.0;
    if (scrollProgress > 0.84) return 0.0;
    return 1 - (scrollProgress - 0.72) / (0.84 - 0.72);
  }, [scrollProgress]);

  // Build the entire hierarchical 3D constellation across the globe:
  // Domains (6) -> Paths (18) -> Roles / Specializations (54+)
  const {
    domainNodes,
    pathNodes,
    roleNodes,
    networkLines,
  } = useMemo(() => {
    const dNodes: Array<{
      id: string;
      name: string;
      position: THREE.Vector3;
      isActive: boolean;
      color: string;
    }> = [];

    const pNodes: Array<{
      id: string;
      position: THREE.Vector3;
      color: string;
      parentPosition: THREE.Vector3;
    }> = [];

    const rNodes: Array<{
      id: string;
      position: THREE.Vector3;
      color: string;
      parentPosition: THREE.Vector3;
    }> = [];

    const linePoints: number[] = [];

    const colors = ["#00E5FF", "#38BDF8", "#818CF8", "#00E5FF", "#38BDF8", "#818CF8"];
    const rGlobe = radius * 1.015;

    // 1. Process each domain
    CAREER_DOMAINS.slice(0, 6).forEach((domain, dIdx) => {
      const coord = DOMAIN_COORDINATES[dIdx] || { theta: 0, phi: Math.PI / 2 };
      const x = rGlobe * Math.sin(coord.phi) * Math.cos(coord.theta);
      const y = rGlobe * Math.cos(coord.phi);
      const z = rGlobe * Math.sin(coord.phi) * Math.sin(coord.theta);
      const domainPos = new THREE.Vector3(x, y, z);
      const domainNormal = domainPos.clone().normalize();
      const { u, v } = computeTangentBasis(domainNormal);

      const isLead = domain.id === activeDomainId;
      const domainColor = isLead ? "#00E5FF" : colors[dIdx % colors.length];

      dNodes.push({
        id: domain.id,
        name: domain.name,
        position: domainPos,
        isActive: isLead,
        color: domainColor,
      });

      // 2. Process paths under this domain (up to 3 paths)
      const domainPaths = domain.paths.slice(0, 3);
      domainPaths.forEach((path, pIdx) => {
        // Distribute paths radially around domain hub
        const pathAngle = (2 * Math.PI * pIdx) / domainPaths.length + 0.35;
        const pathDelta = 0.24; // ~14 degrees on sphere surface
        const pathPos = getSphericalOffset(domainNormal, u, v, pathDelta, pathAngle, rGlobe);

        const pathColor = pIdx === 0 ? "#00E5FF" : pIdx === 1 ? "#38BDF8" : "#818CF8";
        pNodes.push({
          id: `${domain.id}-p-${path.id}`,
          position: pathPos,
          color: pathColor,
          parentPosition: domainPos,
        });

        // Add line filament from domain hub to path node
        // Create an arc lifted slightly off the sphere
        const midPath = domainPos.clone().add(pathPos).multiplyScalar(0.5).normalize().multiplyScalar(rGlobe * 1.01);
        const pathCurve = new THREE.QuadraticBezierCurve3(domainPos, midPath, pathPos);
        const arcPoints = pathCurve.getPoints(8);
        for (let k = 0; k < arcPoints.length - 1; k++) {
          linePoints.push(
            arcPoints[k].x, arcPoints[k].y, arcPoints[k].z,
            arcPoints[k + 1].x, arcPoints[k + 1].y, arcPoints[k + 1].z
          );
        }

        // 3. Process roles / specializations under this path (up to 3 roles per path)
        const pathNormal = pathPos.clone().normalize();
        const { u: pu, v: pv } = computeTangentBasis(pathNormal);
        const roles = (path.specializations[0]?.roles || []).slice(0, 3);
        const numRoles = Math.max(roles.length, 3);

        for (let rIdx = 0; rIdx < numRoles; rIdx++) {
          const roleAngle = pathAngle + (rIdx - 1) * 0.45;
          const roleDelta = 0.16; // ~9 degrees from path
          const rolePos = getSphericalOffset(pathNormal, pu, pv, roleDelta, roleAngle, rGlobe);
          const roleColor = rIdx === 0 ? "#38BDF8" : rIdx === 1 ? "#818CF8" : "#64748B";

          rNodes.push({
            id: `${path.id}-r-${rIdx}`,
            position: rolePos,
            color: roleColor,
            parentPosition: pathPos,
          });

          // Micro-filament from path to role
          linePoints.push(
            pathPos.x, pathPos.y, pathPos.z,
            rolePos.x, rolePos.y, rolePos.z
          );
        }
      });
    });

    // 4. Great-Circle Inter-Domain Highways connecting adjacent domain hubs
    for (let i = 0; i < dNodes.length; i++) {
      const start = dNodes[i].position;
      const end = dNodes[(i + 1) % dNodes.length].position;

      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(rGlobe * 1.025);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(14);

      for (let k = 0; k < curvePoints.length - 1; k++) {
        linePoints.push(
          curvePoints[k].x, curvePoints[k].y, curvePoints[k].z,
          curvePoints[k + 1].x, curvePoints[k + 1].y, curvePoints[k + 1].z
        );
      }
    }

    // 5. Cross-domain highway links (e.g. Engineering <-> Business, Data & AI <-> Design)
    const crossLinks = [
      [0, 3], // Engineering <-> Business
      [1, 0], // Data & AI <-> Engineering
      [1, 3], // Data & AI <-> Business
      [2, 5], // Design <-> Media
    ];

    crossLinks.forEach(([a, b]) => {
      if (dNodes[a] && dNodes[b]) {
        const start = dNodes[a].position;
        const end = dNodes[b].position;
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(rGlobe * 1.03);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const curvePoints = curve.getPoints(12);

        for (let k = 0; k < curvePoints.length - 1; k++) {
          linePoints.push(
            curvePoints[k].x, curvePoints[k].y, curvePoints[k].z,
            curvePoints[k + 1].x, curvePoints[k + 1].y, curvePoints[k + 1].z
          );
        }
      }
    });

    return {
      domainNodes: dNodes,
      pathNodes: pNodes,
      roleNodes: rNodes,
      networkLines: new Float32Array(linePoints),
    };
  }, [radius, activeDomainId]);

  // Continuous frame updates: apply scroll-driven rotation matching the globe
  useFrame(() => {
    if (!groupRef.current) return;
    const targetYRotation = scrollProgress * Math.PI * 2.2;
    const targetXRotation = Math.sin(scrollProgress * Math.PI) * 0.25;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetYRotation,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetXRotation,
      0.08
    );
  });

  if (nodesOpacity <= 0.001) return null;

  // Domain label is only visible when user has scrolled into domain exploration range (0.32 -> 0.52)
  const isDomainActivePhase = scrollProgress >= 0.32 && scrollProgress <= 0.52;

  return (
    <group ref={groupRef}>
      <group scale={[contractFactor, 1, contractFactor]}>
        
        {/* Constellation Network Line Filaments */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[networkLines, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#38BDF8"
            transparent
            opacity={nodesOpacity * 0.28}
          />
        </lineSegments>

        {/* 1. Level 3 Nodes: Many small glowing specialization & role nodes across the globe */}
        {roleNodes.map((node) => (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[0.024, 10, 10]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.6}
              transparent
              opacity={nodesOpacity * 0.85}
            />
          </mesh>
        ))}

        {/* 2. Level 2 Nodes: Career Path beacons */}
        {pathNodes.map((node) => (
          <mesh key={node.id} position={node.position}>
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.9}
              transparent
              opacity={nodesOpacity * 0.9}
            />
          </mesh>
        ))}

        {/* 3. Level 1 Nodes: 6 Primary Domain Hubs */}
        {domainNodes.map((domain) => {
          const isLead = domain.isActive;

          return (
            <group key={domain.id} position={domain.position}>
              {/* Primary Hub Beacon Sphere */}
              <mesh>
                <sphereGeometry args={[isLead ? 0.078 : 0.058, 16, 16]} />
                <meshStandardMaterial
                  color={domain.color}
                  emissive={domain.color}
                  emissiveIntensity={isLead ? 1.6 : 0.9}
                />
              </mesh>

              {/* Glowing Pulse Ring for the focal domain */}
              {isLead && (
                <mesh>
                  <ringGeometry args={[0.10, 0.13, 24]} />
                  <meshBasicMaterial
                    color="#00E5FF"
                    transparent
                    opacity={nodesOpacity * 0.65}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}

              {/* Only the active domain gets a label, and ONLY during domain exploration phase */}
              {isLead && isDomainActivePhase && (
                <Html
                  position={[0, 0.18, 0]}
                  center
                  style={{
                    pointerEvents: "none",
                    opacity: nodesOpacity,
                    transition: "opacity 0.25s ease",
                  }}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-[85vw] px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300 animate-pulse" />
                    <span className="text-lg sm:text-xl md:text-2xl font-heading font-bold tracking-tight text-cyan-200">
                      {domain.name}
                    </span>
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
