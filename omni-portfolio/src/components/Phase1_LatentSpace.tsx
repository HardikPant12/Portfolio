"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSystem } from "@/context/SystemContext";
import { Html } from "@react-three/drei";
import gsap from "gsap";

const PARTICLE_COUNT = 50000;
const CONNECTION_DISTANCE = 2;
const MAX_CONNECTIONS = 100;

export function Phase1_LatentSpace() {
  const { status, setStatus } = useSystem();
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { camera } = useThree();

  // Generate particle positions
  const { positions, dummy } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 20 + Math.random() * 30; // 20 to 50
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return { positions, dummy };
  }, []);

  // Update particle matrices
  useMemo(() => {
    if (!particlesRef.current) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  // Shader material for neon-cyan glow
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#00FFFF") },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vPosition;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist);
          gl_FragColor = vec4(uColor, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (status !== "STABLE" && status !== "TRANSITION" && status !== "REBOOT") return;
    if (particlesRef.current) {
      if (status === "STABLE") {
        particlesRef.current.rotation.y += 0.001; // Slow default rotation
      }
    }

    // Magnetic Mouse Logic (simplified for performance)
    if (linesRef.current && status === "STABLE") {
      const mouse = new THREE.Vector3(
        (state.pointer.x * state.viewport.width) / 2,
        (state.pointer.y * state.viewport.height) / 2,
        0
      );
      // Transform mouse to camera space roughly (for interaction plane)
      mouse.unproject(state.camera);
      mouse.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / mouse.z;
      const mousePos = new THREE.Vector3().copy(state.camera.position).add(mouse.multiplyScalar(distance));

      // Check distance against a subset of particles (first 1000 for perf)
      const linePositions = [];
      let connections = 0;
      for (let i = 0; i < 1000 && connections < MAX_CONNECTIONS; i++) {
        const p = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        if (particlesRef.current) {
          p.applyMatrix4(particlesRef.current.matrixWorld);
        }
        if (p.distanceTo(mousePos) < CONNECTION_DISTANCE) {
          linePositions.push(mousePos.x, mousePos.y, mousePos.z);
          linePositions.push(p.x, p.y, p.z);
          connections++;
        }
      }

      linesRef.current.geometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    } else if (linesRef.current) {
        linesRef.current.geometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
    }
  });

  const handleAccess = () => {
    setStatus("TRANSITION");
    // Warp speed camera animation
    gsap.to(camera.position, {
      z: -100, // fly through
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        // Prepare for Phase 2
      }
    });
  };

  return (
    <>
      <instancedMesh
        ref={particlesRef}
        args={[new THREE.SphereGeometry(0.05, 8, 8), shaderMaterial, PARTICLE_COUNT]}
      />
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#00FFFF" transparent opacity={0.4} />
      </lineSegments>

      {status === "STABLE" && (
        <Html center>
          <button
            onClick={handleAccess}
            className="px-6 py-3 border border-cyan-400 text-cyan-400 bg-black/60 hover:bg-cyan-400/20 backdrop-blur-md rounded transition-all font-mono tracking-widest uppercase"
            style={{ textShadow: "0 0 8px rgba(0, 255, 255, 0.8)", boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)" }}
          >
            [ ACCESS_DATABASE ]
          </button>
        </Html>
      )}
    </>
  );
}
