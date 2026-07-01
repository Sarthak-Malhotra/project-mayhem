"use client";

import React, { useEffect, useState } from "react";
import { markCaseCompleted } from "@/components/case-progress";
import { useCaseStore } from "../CaseFileProvider";
import { puzzlesConfig } from "../lib/puzzles.config";
import { PuzzleShell } from "./PuzzleShell";
import { Lock, CheckCircle2, Cpu, Trophy } from "lucide-react";
import { IntroSequence } from "@/components/case-05/IntroSequence";
import { ArchiveRecovered } from "@/components/case-05/ArchiveRecovered";
import { FinalLedger } from "@/components/case-05/FinalLedger";

export function PuzzleHub() {
  const activePuzzle = useCaseStore((state) => state.activePuzzle);
  const solved = useCaseStore((state) => state.solved);
  const scores = useCaseStore((state) => state.scores);
  const setActive = useCaseStore((state) => state.setActive);
  const totalScore = useCaseStore((state) => state.totalScore);

  const allSolved = solved.length === 8;

  // Intro sequence tracking
  const [introPlayed, setIntroPlayed] = useState(false);

  const handleIntroComplete = () => {
    setIntroPlayed(true);
  };

  // Archive recovery tracking (to prevent pops on page refreshes or hub re-loads)
  const [seenArchives, setSeenArchives] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ch-case-05-seen-archives");
    if (stored) {
      try {
        setSeenArchives(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  const markArchiveSeen = (id: number) => {
    const nextSeen = [...seenArchives, id];
    setSeenArchives(nextSeen);
    localStorage.setItem("ch-case-05-seen-archives", JSON.stringify(nextSeen));
  };

  // Check if any archive is completed but not seen yet
  const getPendingArchiveId = () => {
    if (!isLoaded) return null;
    if (solved.includes(1) && solved.includes(2) && !seenArchives.includes(1)) return 1;
    if (solved.includes(3) && solved.includes(4) && !seenArchives.includes(2)) return 2;
    if (solved.includes(5) && solved.includes(6) && !seenArchives.includes(3)) return 3;
    if (solved.includes(7) && solved.includes(8) && !seenArchives.includes(4)) return 4;
    return null;
  };

  const pendingArchiveId = getPendingArchiveId();

  // Auto-route to first unsolved puzzle when activePuzzle is null
  useEffect(() => {
    if (isLoaded && introPlayed && activePuzzle === null && !allSolved && pendingArchiveId === null) {
      const firstUnsolved = [1, 2, 3, 4, 5, 6, 7, 8].find(id => !solved.includes(id)) || 1;
      setActive(firstUnsolved);
    }
  }, [isLoaded, introPlayed, activePuzzle, solved, allSolved, pendingArchiveId, setActive]);

  // Render sequence
  if (!introPlayed) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  // Active puzzle takes priority — never interrupt a direct transition
  const activeConfig = puzzlesConfig.find((p) => p.id === activePuzzle);

  if (activeConfig) {
    const ActiveComponent = activeConfig.component;
    return (
      <PuzzleShell
        puzzleId={activeConfig.id}
        title={activeConfig.title}
        clue={activeConfig.clue}
      >
        <ActiveComponent />
      </PuzzleShell>
    );
  }

  // Only show archive interlude when not mid-puzzle (activePuzzle is null)
  if (pendingArchiveId !== null) {
    return <ArchiveRecovered archiveId={pendingArchiveId} onComplete={() => markArchiveSeen(pendingArchiveId)} />;
  }

  if (allSolved) {
    return <FinalLedger />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 font-mono text-xs">
      Initializing Chronos Anomaly Decryptor...
    </div>
  );
}

export default PuzzleHub;
