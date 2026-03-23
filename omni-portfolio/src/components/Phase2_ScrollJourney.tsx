"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSystem } from "@/context/SystemContext";
import { MeshTransmissionMaterial, Text } from "@react-three/drei";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function Phase2_ScrollJourney() {
  const { status, setStatus } = useSystem();
  const { camera } = useThree();
  const curveRef = useRef<THREE.CubicBezierCurve3 | null>(null);

  useEffect(() => {
    // Define the camera path
    curveRef.current = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 5),     // Start point (Phase 1)
      new THREE.Vector3(0, 0, 0),     // Control point 1
      new THREE.Vector3(0, 0, -20),   // Control point 2
      new THREE.Vector3(0, 0, -50)    // End point (Projects)
    );

    // Initial GSAP setup for camera ScrollTrigger
    // We bind the scroll to camera position if in TRANSITION
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        if (!curveRef.current) return;
        const progress = self.progress;
        
        // Follow curve
        const point = curveRef.current.getPoint(progress);
        camera.position.copy(point);
        
        // Trigger Phase 3 Breach at the end
        if (progress > 0.95 && status !== "BREACH" && status !== "REBOOT") {
          setStatus("BREACH");
        } else if (progress < 0.95 && status === "BREACH") {
          // Allow scrolling back to fix state if needed
          setStatus("TRANSITION");
        }
      }
    });

    return () => {
      st.kill();
    };
  }, [camera, status, setStatus]);

  if (status === "STABLE" || status === "REBOOT") return null;

  return (
    <group position={[0, 0, -25]}>
      {/* Section 1: Vertical Neon Line */}
      <mesh position={[-3, 0, 10]}>
        <cylinderGeometry args={[0.05, 0.05, 20, 16]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.8} />
      </mesh>
      
      {/* Section 2: Projects (3-column grid) */}
      <group position={[0, 0, -20]}>
        <Text position={[0, 5, 0]} fontSize={2} color="#ffffff" anchorX="center" anchorY="middle">
          PROJECT ARCHIVE
        </Text>
        
        {/* Project Card 1 */}
        <mesh position={[-5, 0, 0]}>
          <planeGeometry args={[4, 6]} />
          <MeshTransmissionMaterial 
            backside
            samples={16}
            thickness={2}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.0}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
          <Text position={[0, 0, 0.1]} fontSize={0.5} color="#ffffff">Neural Net</Text>
        </mesh>

        {/* Project Card 2 */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4, 6]} />
          <MeshTransmissionMaterial 
            backside
            samples={16}
            thickness={2}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
          />
          <Text position={[0, 0, 0.1]} fontSize={0.5} color="#ffffff">Quantum AI</Text>
        </mesh>

        {/* Project Card 3 (Trigger Final) */}
        <mesh position={[5, 0, 0]}>
          <planeGeometry args={[4, 6]} />
          <MeshTransmissionMaterial 
            backside
            samples={16}
            thickness={2}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
          />
          <Text position={[0, 0, 0.1]} fontSize={0.5} color="#ffffff">Core System</Text>
        </mesh>
      </group>
    </group>
  );
}
