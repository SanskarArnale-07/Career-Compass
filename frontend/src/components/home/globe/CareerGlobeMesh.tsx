"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CareerGlobeMeshProps {
  radius?: number;
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

// Pure deterministic pseudo-random generator for particle positions (React Compiler idempotent)
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

export function CareerGlobeMesh({
  radius = 2.4,
  scrollProgress,
  isReducedMotion = false,
}: CareerGlobeMeshProps) {
  const meshGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Master Globe Mesh Opacity:
  // Smoothly transitions the globe to strictly 0 opacity by 0.84 before final CTA appears
  const masterOpacity = useMemo(() => {
    if (scrollProgress < 0.72) return 1.0;
    if (scrollProgress >= 0.84) return 0.0;
    return 1 - (scrollProgress - 0.72) / (0.84 - 0.72);
  }, [scrollProgress]);

  // Contraction factor during Phase 5 (Globe -> Trajectory: 0.72 -> 0.84)
  // When scroll > 0.72, sphere contracts towards central column
  const contractFactor = useMemo(() => {
    if (scrollProgress < 0.72) return 1;
    if (scrollProgress >= 0.84) return 0.05;
    return 1 - (scrollProgress - 0.72) / (0.84 - 0.72);
  }, [scrollProgress]);

  // Opacity of wireframe fading out as it transforms into trajectory, reaching 0 by 0.84
  const wireframeOpacity = useMemo(() => {
    if (scrollProgress < 0.72) return 0.25;
    if (scrollProgress >= 0.84) return 0.0;
    return 0.25 * (1 - (scrollProgress - 0.72) / (0.84 - 0.72));
  }, [scrollProgress]);

  // Generate spherical particle star dust
  const particleData = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color("#00E5FF"); // Cyan
    const color2 = new THREE.Color("#38BDF8"); // Sky blue
    const color3 = new THREE.Color("#818CF8"); // Indigo-violet

    for (let i = 0; i < count; i++) {
      const u = pseudoRandom(i * 4 + 1);
      const v = pseudoRandom(i * 4 + 2);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.88 + pseudoRandom(i * 4 + 3) * 0.35);

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * sinPhi * Math.sin(theta);

      // Color variation
      const pick = pseudoRandom(i * 4 + 4);
      const c = pick < 0.4 ? color1 : pick < 0.8 ? color2 : color3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, colors };
  }, [radius]);

  // Continuous frame updates: apply scroll-driven rotation and subtle idle drift
  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;

    // Scroll drives the primary Y-axis rotation (0 to 180 degrees over timeline)
    const targetYRotation = scrollProgress * Math.PI * 2.2;
    const targetXRotation = Math.sin(scrollProgress * Math.PI) * 0.25;

    if (!isReducedMotion) {
      meshGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        meshGroupRef.current.rotation.y,
        targetYRotation,
        0.08
      );
      meshGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        meshGroupRef.current.rotation.x,
        targetXRotation,
        0.08
      );

      // Orbital gyroscopic rings subtle counter-rotations
      if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.15;
      if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.18;
      if (ring3Ref.current) ring3Ref.current.rotation.x -= delta * 0.12;
    } else {
      meshGroupRef.current.rotation.y = targetYRotation;
      meshGroupRef.current.rotation.x = targetXRotation;
    }
  });

  if (masterOpacity <= 0.001) return null;

  return (
    <group ref={meshGroupRef}>
      {/* ── Outer Scaled Group (Supports contraction into vertical trajectory) ── */}
      <group scale={[contractFactor, 1, contractFactor]}>
        
        {/* Occlusion Sphere: Provides authentic spatial depth across front and back */}
        <mesh>
          <sphereGeometry args={[radius * 0.96, 32, 32]} />
          <meshBasicMaterial color="#0B0E12" transparent opacity={0.82 * masterOpacity} />
        </mesh>

        {/* Spherical Wireframe Globe */}
        <mesh>
          <sphereGeometry args={[radius, 28, 22]} />
          <meshStandardMaterial
            wireframe
            color="#3B4653"
            emissive="#1E293B"
            emissiveIntensity={0.2}
            transparent
            opacity={wireframeOpacity}
          />
        </mesh>

        {/* Gyroscopic Orbital Ring 1: Equator */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.04, 0.007, 8, 80]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={wireframeOpacity * 1.4} />
        </mesh>

        {/* Gyroscopic Orbital Ring 2: Tilted Inclination 35deg */}
        <mesh ref={ring2Ref} rotation={[0.6, 0.4, 0]}>
          <torusGeometry args={[radius * 1.1, 0.006, 8, 80]} />
          <meshBasicMaterial color="#818CF8" transparent opacity={wireframeOpacity * 1.1} />
        </mesh>

        {/* Gyroscopic Orbital Ring 3: Tilted Inclination -45deg */}
        <mesh ref={ring3Ref} rotation={[-0.7, -0.3, 0.4]}>
          <torusGeometry args={[radius * 1.07, 0.006, 8, 80]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={wireframeOpacity * 1.2} />
        </mesh>

        {/* Floating Stellar Particles inside and around globe */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particleData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[particleData.colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            vertexColors
            transparent
            opacity={wireframeOpacity * 2.2}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}
