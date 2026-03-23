"use client";
import { useEffect, useRef } from "react";
import { useSystem } from "@/context/SystemContext";
import { EffectComposer, Glitch, ToneMapping, Noise, Vignette } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Phase3_Breach() {
  const { status, setStatus } = useSystem();
  const { camera } = useThree();
  const initialCamPosRef = useRef(camera.position.clone());

  useEffect(() => {
    if (status === "BREACH") {
      // Audio logic: We use a simple web audio synth for a rhythmic siren
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); 
      oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      // Siren effect loop using setInterval
      const sirenInterval = setInterval(() => {
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); 
        oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.5);
      }, 500);

      oscillator.start();

      // Trigger phase 4 after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(sirenInterval);
        oscillator.stop();
        audioCtx.close();
        setStatus("REBOOT");
      }, 5000);

      return () => {
        clearInterval(sirenInterval);
        clearTimeout(timeout);
        try { oscillator.stop(); audioCtx.close(); } catch {}
      };
    }
  }, [status, setStatus]);

  useFrame(({ clock }) => {
    if (status === "BREACH") {
      // Camera shake effect
      const t = clock.getElapsedTime();
      camera.position.x = initialCamPosRef.current.x + Math.sin(t * 50) * 0.1;
      camera.position.y = initialCamPosRef.current.y + Math.cos(t * 60) * 0.1;
    } else {
      initialCamPosRef.current.copy(camera.position);
    }
  });

  if (status !== "BREACH") return null;

  return (
    <>
      <EffectComposer>
        <Glitch
          delay={new THREE.Vector2(0.1, 0.3)}
          duration={new THREE.Vector2(0.1, 0.5)}
          strength={new THREE.Vector2(0.4, 0.8)}
          mode={GlitchMode.SPORADIC}
          active={true}
          ratio={0.85}
        />
        <Noise opacity={0.25} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ToneMapping />
      </EffectComposer>

      <Html fullscreen zIndexRange={[100, 0]}>
        <div className="flex items-center justify-center w-screen h-screen bg-red-900/40 mix-blend-overlay pointer-events-none">
          <div className="animate-pulse">
            <h1 className="text-red-500 text-6xl md:text-8xl font-black tracking-widest uppercase"
                style={{ textShadow: "0 0 20px #FF0000" }}>
              CRITICAL BREACH
            </h1>
            <p className="text-red-400 text-2xl md:text-3xl tracking-[0.5em] text-center mt-4 uppercase">
              Core Data Wiping...
            </p>
          </div>
        </div>
      </Html>
    </>
  );
}
