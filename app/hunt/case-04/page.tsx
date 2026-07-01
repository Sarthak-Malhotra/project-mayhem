"use client";

import React, { useState, useEffect } from "react";
import { CaseFile04Puzzle, MirrorScriptPuzzle, FortuneTellerPuzzle, ShootingRangeLogsPuzzle, BrokenTicketPuzzle, AudioGamePuzzle, SteganographyPuzzle, TechnicalPuzzle } from "@/components/case-file-04";

type StageType = "wheel" | "mirror" | "fortune" | "shooting" | "ticket" | "audio" | "steg" | "tech";

export default function Page() {
  const [stage, setStage] = useState<StageType>("wheel");

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/progress?caseId=04");
        const data = await res.json();
        if (data.success && data.progress?.stage) {
          setStage(data.progress.stage);
        }
      } catch (err) {
        console.error("Failed to load Case 4 progress:", err);
      }
    }
    loadProgress();
  }, []);

  const saveStage = (newStage: StageType) => {
    setStage(newStage);
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId: "04", key: "stage", value: newStage }),
    }).catch((err) => console.error("Failed to save Case 4 progress:", err));
  };

  if (stage === "wheel") {
    return <CaseFile04Puzzle onSolved={() => saveStage("mirror")} />;
  }

  if (stage === "mirror") {
    return <MirrorScriptPuzzle onSolved={() => saveStage("fortune")} />;
  }

  if (stage === "fortune") {
    return <FortuneTellerPuzzle onSolved={() => saveStage("shooting")} />;
  }

  if (stage === "shooting") {
    return <ShootingRangeLogsPuzzle onSolved={() => saveStage("ticket")} />;
  }

  if (stage === "ticket") {
    return <BrokenTicketPuzzle onSolved={() => saveStage("audio")} />;
  }

  if (stage === "audio") {
    return <AudioGamePuzzle onSolved={() => saveStage("steg")} />;
  }

  if (stage === "steg") {
    return <SteganographyPuzzle onSolved={() => saveStage("tech")} />;
  }

  return <TechnicalPuzzle />;
}
