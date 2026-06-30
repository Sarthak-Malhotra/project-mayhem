"use client";

import React, { useEffect } from "react";
import { markCaseCompleted } from "@/components/case-progress";
import { useCaseStore } from "../CaseFileProvider";
import { puzzlesConfig } from "../lib/puzzles.config";
import { PuzzleShell } from "./PuzzleShell";
import { Lock, CheckCircle2, Cpu, Trophy } from "lucide-react";

export function PuzzleHub() {
  const activePuzzle = useCaseStore((state) => state.activePuzzle);
  const solved = useCaseStore((state) => state.solved);
  const scores = useCaseStore((state) => state.scores);
  const setActive = useCaseStore((state) => state.setActive);
  const totalScore = useCaseStore((state) => state.totalScore);

  const allSolved = solved.length === 8;

  useEffect(() => {
    if (allSolved) {
      markCaseCompleted("05");
      const timer = setTimeout(() => {
        window.location.href = '/hunt';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [allSolved]);

  // Find active puzzle config if one is selected
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

  if (allSolved) {
    return (
      <div className="space-y-8 select-none font-mono text-zinc-100 flex flex-col items-center justify-center py-16 text-center relative z-20">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Trophy size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-widest text-emerald-400 font-serif uppercase">
          Timeline Fully Stabilized
        </h2>
        <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
          All eight space-time anomalies have been sealed and chronological flow has been restored to the core.
        </p>
        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            onClick={() => { markCaseCompleted("05"); window.location.href = '/hunt'; }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            ◈ Return to Hub
          </button>
          <span className="text-[10px] text-zinc-500">
            Redirecting automatically in 5 seconds...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none font-mono text-zinc-100">
      {/* Welcome & Stats Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md rounded-lg relative overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,rgba(16,185,129,0.01)_95%),linear-gradient(to_right,transparent_95%,rgba(16,185,129,0.01)_95%)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="text-left space-y-2 relative z-10 max-w-2xl">
          <h2 className="text-xl font-bold tracking-wider text-emerald-400 font-serif uppercase">
            Chronos Timeline Analyzer
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">
            Chronological disturbance detected. Eight timeline anomalies have ruptured the space-time core. Select a coordinate node below to decrypt, review logs, and stabilize the anchor.
          </p>
        </div>

        <div className="flex items-center gap-4 px-5 py-3.5 bg-black/40 border border-zinc-800/80 rounded-md shrink-0 text-left relative z-10">
          <Trophy className="text-emerald-400 shrink-0" size={20} />
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
              TIMELINE RECOVERY
            </div>
            <div className="text-lg font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              {totalScore} / 2400 <span className="text-xs text-zinc-500 font-normal">PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Puzzles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {puzzlesConfig.map((puzzle) => {
          const isSolved = solved.includes(puzzle.id);
          const pointsEarned = scores[puzzle.id] || 0;
          const isLocked = false; 

          return (
            <button
              key={puzzle.id}
              type="button"
              onClick={() => !isLocked && setActive(puzzle.id)}
              disabled={isLocked}
              className={`group flex flex-col justify-between text-left p-5 border rounded-lg transition-all duration-300 relative overflow-hidden select-none min-h-[170px] ${
                isSolved
                  ? "bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.03)] cursor-pointer"
                  : isLocked
                  ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50"
                  : "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] cursor-pointer hover:-translate-y-0.5"
              }`}
            >
              {/* Dynamic decorative visual element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
                    ANOMALY #{String(puzzle.id).padStart(2, "0")}
                  </span>
                  {isSolved ? (
                    <CheckCircle2 size={14} className="text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
                  ) : isLocked ? (
                    <Lock size={12} className="text-zinc-600" />
                  ) : (
                    <Cpu size={12} className="text-zinc-500 group-hover:text-emerald-400 group-hover:rotate-12 transition-all duration-300" />
                  )}
                </div>

                <div>
                  <h3 className={`font-serif text-sm font-bold uppercase tracking-wide transition-colors ${
                    isSolved 
                      ? "text-emerald-400/90" 
                      : "text-zinc-200 group-hover:text-emerald-400"
                  }`}>
                    {puzzle.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono line-clamp-2">
                    {puzzle.clue}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-900/60 w-full flex items-center justify-between text-[9px] text-zinc-500">
                <span>RECOVERY VALUE:</span>
                {isSolved ? (
                  <span className="font-bold text-emerald-400 font-mono">
                    +{pointsEarned} PTS
                  </span>
                ) : (
                  <span className="font-mono text-zinc-400">
                    {puzzle.points} PTS
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PuzzleHub;
