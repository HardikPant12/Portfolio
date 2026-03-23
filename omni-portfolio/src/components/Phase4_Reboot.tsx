"use client";

import { useEffect } from "react";
import { useSystem } from "@/context/SystemContext";
import { Html } from "@react-three/drei";

export function Phase4_Reboot() {
  const { status, setStatus } = useSystem();

  useEffect(() => {
    if (status === "REBOOT") {
      const resetTimeout = setTimeout(() => {
        // Return camera to top by scrolling to top
        window.scrollTo({ top: 0, behavior: "auto" });
        setStatus("STABLE");
      }, 5000); // 5 sec reboot sequence

      return () => clearTimeout(resetTimeout);
    }
  }, [status, setStatus]);

  if (status !== "REBOOT") return null;

  return (
    <Html fullscreen zIndexRange={[200, 0]}>
      <div className="absolute inset-0 bg-black flex flex-col justify-end p-8 pointer-events-auto z-50 overflow-hidden w-screen h-screen">
        <div className="font-mono text-green-500 text-xl tracking-widest"
             style={{ textShadow: "0 0 10px #00FF00" }}>
          <p className="animate-pulse typing-effect">
            &gt; RESTORING SYSTEM BACKUP... [DONE].
          </p>
        </div>
      </div>
      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        .typing-effect {
          overflow: hidden;
          white-space: nowrap;
          border-right: .15em solid #00FF00;
          animation: typing 2s steps(40, end), blink-caret .75s step-end infinite;
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #00FF00; }
        }
      `}</style>
    </Html>
  );
}
