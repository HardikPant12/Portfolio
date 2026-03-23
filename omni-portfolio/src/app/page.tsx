"use client";

import CanvasContainer from "@/components/CanvasContainer";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-between p-0 m-0 bg-black w-full text-white" style={{ height: "400vh" }}>
      {/* 3D WebGL Layer - Pinned */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <CanvasContainer />
      </div>
      
      {/* UI Overlay Layer (if needed) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        {/* Placeholder for optional HTML overlays tied to scroll */}
      </div>
    </main>
  );
}


