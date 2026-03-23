"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Phase1_LatentSpace } from "./Phase1_LatentSpace";
import { Phase2_ScrollJourney } from "./Phase2_ScrollJourney";
import { Phase3_Breach } from "./Phase3_Breach";
import { Phase4_Reboot } from "./Phase4_Reboot";
import { useSystem } from "@/context/SystemContext";

export default function CanvasContainer() {
  const { status } = useSystem();

  useEffect(() => {
    if (status === "BREACH") {
      document.documentElement.style.setProperty("--primary-color", "#FF0000");
    } else {
      document.documentElement.style.setProperty("--primary-color", "#00FFFF");
    }
  }, [status]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-transparent">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Phase1_LatentSpace />
          <Phase2_ScrollJourney />
          <Phase3_Breach />
          <Phase4_Reboot />
        </Suspense>
      </Canvas>
    </div>
  );
}
