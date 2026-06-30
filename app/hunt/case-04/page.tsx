"use client";

import React, { useState } from "react";
import { CaseFile04Puzzle, MirrorScriptPuzzle, FortuneTellerPuzzle, ShootingRangeLogsPuzzle, BrokenTicketPuzzle, AudioGamePuzzle, SteganographyPuzzle, TechnicalPuzzle } from "@/components/case-file-04";

export default function Page() {
  const [stage, setStage] = useState<"wheel" | "mirror" | "fortune" | "shooting" | "ticket" | "audio" | "steg" | "tech">("wheel");

  if (stage === "wheel") {
    return <CaseFile04Puzzle onSolved={() => setStage("mirror")} />;
  }

  if (stage === "mirror") {
    return <MirrorScriptPuzzle onSolved={() => setStage("fortune")} />;
  }

  if (stage === "fortune") {
    return <FortuneTellerPuzzle onSolved={() => setStage("shooting")} />;
  }

  if (stage === "shooting") {
    return <ShootingRangeLogsPuzzle onSolved={() => setStage("ticket")} />;
  }

  if (stage === "ticket") {
    return <BrokenTicketPuzzle onSolved={() => setStage("audio")} />;
  }

  if (stage === "audio") {
    return <AudioGamePuzzle onSolved={() => setStage("steg")} />;
  }

  if (stage === "steg") {
    return <SteganographyPuzzle onSolved={() => setStage("tech")} />;
  }

  return <TechnicalPuzzle />;
}
