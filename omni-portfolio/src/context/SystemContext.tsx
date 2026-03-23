"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type SystemStatus = "STABLE" | "TRANSITION" | "REACHED_CORE" | "BREACH" | "REBOOT";

interface SystemContextProps {
  status: SystemStatus;
  setStatus: (status: SystemStatus) => void;
}

const SystemContext = createContext<SystemContextProps | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SystemStatus>("STABLE");

  return (
    <SystemContext.Provider value={{ status, setStatus }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
}
