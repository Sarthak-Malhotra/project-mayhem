"use client";

import React, { useEffect } from "react";
import CaseGuard from "@/components/CaseGuard";

export default function MorseTransmissionPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/hunt/case-09";
    }
  }, []);

  return (
    <CaseGuard caseId="09">
      <div className="min-h-screen w-full bg-black flex items-center justify-center font-mono text-cyan-400 text-xs">
        REDIRECTING TO SYSTEM ARCHIVE CONSOLE...
      </div>
    </CaseGuard>
  );
}
