"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

interface TrajectoryConvergenceProps {
  scrollProgress: number; // 0 to 1
}

const TRAJECTORY_STAGES = [
  {
    name: "CAREER",
    y: 1.08,
  },
  {
    name: "SKILLS",
    y: 0.36,
  },
  {
    name: "PROJECTS",
    y: -0.36,
  },
  {
    name: "ROADMAP",
    y: -1.08,
  },
];

export function TrajectoryConvergence({ scrollProgress }: TrajectoryConvergenceProps) {
  const pulseRef = useRef<THREE.Mesh>(null);

  // Separate opacities:
  // 1. lineOpacity: background beam remains subtly visible (~0.14) during final CTA
  // 2. nodesOpacity: waypoint spheres, rings, and HTML labels fade to 0 completely by 0.84 BEFORE CTA appears (0.88)
  const { lineOpacity, nodesOpacity, convergenceFactor, activeStep } = useMemo(() => {
    if (scrollProgress < 0.70) {
      return { lineOpacity: 0, nodesOpacity: 0, convergenceFactor: 0, activeStep: 0 };
    }

    // Line opacity: enters 0.70 -> 0.75, fades completely to 0 by 0.84 (zero trajectory remnants)
    let lOp = 0;
    if (scrollProgress >= 0.70 && scrollProgress <= 0.75) {
      lOp = (scrollProgress - 0.70) / (0.75 - 0.70);
    } else if (scrollProgress > 0.75 && scrollProgress <= 0.80) {
      lOp = 1;
    } else if (scrollProgress > 0.80 && scrollProgress <= 0.84) {
      lOp = 1 - (scrollProgress - 0.80) / (0.84 - 0.80);
    } else {
      lOp = 0; // Strictly 0 for scrollProgress > 0.84
    }

    // Nodes and labels opacity: MUST fade out completely before CTA!
    // Visible during 0.70 -> 0.80, strictly drops to 0 by 0.84!
    let nOp = 0;
    if (scrollProgress >= 0.70 && scrollProgress <= 0.74) {
      nOp = (scrollProgress - 0.70) / (0.74 - 0.70);
    } else if (scrollProgress > 0.74 && scrollProgress <= 0.80) {
      nOp = 1;
    } else if (scrollProgress > 0.80 && scrollProgress <= 0.84) {
      nOp = 1 - (scrollProgress - 0.80) / (0.84 - 0.80);
    } else {
      nOp = 0; // Strictly 0 for scrollProgress > 0.84
    }

    // How tightly converged into the vertical line (0 to 1)
    const conv = Math.min(1, Math.max(0, (scrollProgress - 0.70) / (0.78 - 0.70)));

    // Active stage lighting up along the trajectory (0 to 3)
    const step = Math.min(3, Math.max(0, (scrollProgress - 0.73) / 0.04));

    return {
      lineOpacity: Math.max(0, Math.min(1, lOp)),
      nodesOpacity: Math.max(0, Math.min(1, nOp)),
      convergenceFactor: conv,
      activeStep: step,
    };
  }, [scrollProgress]);

  // Pulse animation traveling along line (only active while waypoints are visible)
  useFrame((state) => {
    if (!pulseRef.current || nodesOpacity <= 0.001) return;
    const time = state.clock.getElapsedTime();
    const cycle = (time * 0.75) % 1;
    pulseRef.current.position.y = 1.18 - cycle * 2.36;
  });

  if (lineOpacity <= 0.001 && nodesOpacity <= 0.001) return null;

  const showWaypoints = nodesOpacity > 0.001;

  return (
    <group position={[0, -0.52, 0]}>
      {/* Central Luminous Trajectory Beam (Inherited from contracted globe) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.8, 16]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={lineOpacity * 0.38 * convergenceFactor} />
      </mesh>

      {/* Traveling Energy Pulse Beacon (strictly hidden once waypoints fade out) */}
      {showWaypoints && (
        <mesh ref={pulseRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={nodesOpacity * 0.9 * convergenceFactor} />
        </mesh>
      )}

      {/* 4 Connected Trajectory Waypoints (COMPLETELY unmounted when nodesOpacity <= 0.001) */}
      {showWaypoints &&
        TRAJECTORY_STAGES.map((stage, idx) => {
          const isReached = idx <= activeStep;
          const color = isReached ? "#00E5FF" : "#475569";

          return (
            <group key={stage.name} position={[0, stage.y, 0]}>
              {/* Waypoint Sphere Beacon */}
              <mesh>
                <sphereGeometry args={[isReached ? 0.065 : 0.048, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isReached ? 1.5 : 0.4}
                  transparent
                  opacity={nodesOpacity}
                />
              </mesh>

              {/* Glowing Accent Ring for Reached Waypoint */}
              {isReached && (
                <mesh>
                  <ringGeometry args={[0.09, 0.12, 24]} />
                  <meshBasicMaterial color="#00E5FF" transparent opacity={nodesOpacity * 0.5} side={THREE.DoubleSide} />
                </mesh>
              )}

              {/* Spatial Clean Short Label Beside Waypoint */}
              <Html
                position={[0.2, 0, 0]}
                style={{
                  pointerEvents: "none",
                  opacity: nodesOpacity * (isReached ? 1 : 0.45),
                }}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  <span className={`text-xs sm:text-[13px] font-mono tracking-widest font-semibold ${isReached ? "text-cyan-300" : "text-slate-500"}`}>
                    {stage.name}
                  </span>
                </div>
              </Html>
            </group>
          );
        })}
    </group>
  );
}
