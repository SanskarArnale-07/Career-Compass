"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const TRAITS_DATA = [
  { label: "Analytical", angle: 0, elevation: 0.1 },
  { label: "Technical", angle: Math.PI * 0.25, elevation: 0.4 },
  { label: "Scientific", angle: Math.PI * 0.5, elevation: -0.2 },
  { label: "Business", angle: Math.PI * 0.75, elevation: 0.3 },
  { label: "Creative", angle: Math.PI * 1.0, elevation: -0.35 },
  { label: "Social", angle: Math.PI * 1.25, elevation: 0.25 },
  { label: "Leadership", angle: Math.PI * 1.5, elevation: -0.15 },
  { label: "Exploration", angle: Math.PI * 1.75, elevation: 0.45 },
];

interface TraitsConstellationProps {
  scrollProgress: number; // 0 to 1
  radius?: number;
}

export function TraitsConstellation({
  scrollProgress,
  radius = 2.4,
}: TraitsConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Active in scroll window 0.12 -> 0.38
  const { opacity, expansion } = useMemo(() => {
    if (scrollProgress < 0.12 || scrollProgress > 0.40) {
      return { opacity: 0, expansion: 0 };
    }
    let op = 0;
    if (scrollProgress >= 0.12 && scrollProgress <= 0.18) {
      op = (scrollProgress - 0.12) / (0.18 - 0.12);
    } else if (scrollProgress > 0.18 && scrollProgress <= 0.32) {
      op = 1;
    } else {
      op = 1 - (scrollProgress - 0.32) / (0.40 - 0.32);
    }

    // Radial expansion from core (0.2 -> 1.0)
    let exp = 0.2;
    if (scrollProgress >= 0.12 && scrollProgress <= 0.22) {
      exp = 0.2 + 0.8 * ((scrollProgress - 0.12) / (0.22 - 0.12));
    } else if (scrollProgress > 0.22 && scrollProgress <= 0.32) {
      exp = 1.0;
    } else {
      exp = 1.0 - 0.2 * ((scrollProgress - 0.32) / (0.40 - 0.32));
    }

    return { opacity: Math.max(0, Math.min(1, op)), expansion: exp };
  }, [scrollProgress]);

  // Compute 3D spoke lines from center to each trait node
  const traitPositions = useMemo(() => {
    const currentRadius = radius * 1.15 * expansion;
    return TRAITS_DATA.map((t) => {
      const cosEl = Math.cos(t.elevation);
      const x = currentRadius * Math.cos(t.angle) * cosEl;
      const y = currentRadius * Math.sin(t.elevation);
      const z = currentRadius * Math.sin(t.angle) * cosEl;
      return {
        ...t,
        position: new THREE.Vector3(x, y, z),
      };
    });
  }, [radius, expansion]);

  // Spoke lines buffer
  const spokeBuffer = useMemo(() => {
    const points: number[] = [];
    traitPositions.forEach((t) => {
      // From near center (0,0,0) to trait node
      points.push(0, 0, 0);
      points.push(t.position.x, t.position.y, t.position.z);
    });
    return new Float32Array(points);
  }, [traitPositions]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Gentle counter-rotation to give multidimensional depth
    groupRef.current.rotation.y = scrollProgress * Math.PI * 1.8;
    groupRef.current.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.15;
  });

  if (opacity <= 0.001) return null;

  return (
    <group ref={groupRef}>
      {/* Radial Energy Filaments */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[spokeBuffer, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#818CF8"
          transparent
          opacity={opacity * 0.4}
        />
      </lineSegments>

      {/* 8 Trait Beacons */}
      {traitPositions.map((t) => (
        <group key={t.label} position={t.position}>
          <mesh>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#818CF8" />
          </mesh>

          <Html
            position={[0, 0.1, 0]}
            center
            style={{
              pointerEvents: "none",
              opacity,
              transition: "opacity 0.2s ease",
            }}
          >
            <div className="flex items-center gap-1 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              <span className="text-[10px] font-mono text-indigo-200/90 tracking-wide">
                {t.label}
              </span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
