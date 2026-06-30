"use client";

import React, { useState } from "react";
import { PuzzleProps } from "../types";

const STATEMENTS = [
  "If Statement 3 is true, then Statement 5 is false.",
  "Statement 4 is true.",
  "Either Statement 1 is false or Statement 6 is true.",
  "Statement 2 is true if and only if Statement 5 is false.",
  "Statement 3 is false.", // The Hallucination
  "At most one of Statements 1, 2, 3 is true.",
];

const PROGRESSIVE_HINTS = [
  "Start with statements that talk about themselves indirectly – they create chains.",
  "Assume all are true, then look for a statement that forces its own opposite.",
  "If Statement 5 were true, what would Statement 3 imply? Follow the loop.",
  "The hallucination is Statement 5. Read its words carefully.",
];

export default function FortuneTellerPuzzle({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hallucinationFound, setHallucinationFound] = useState<boolean>(false);
  const [answerInput, setAnswerInput] = useState<string>("");
  const [statusState, setStatusState] = useState<"IDLE" | "SUCCESS" | "FAIL">("IDLE");
  const [hintIndex, setHintIndex] = useState<number>(0);

  const playSound = (hookName: string) => {
    console.log(`[Audio Hook Triggered]: ${hookName}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(hookName));
    }
  };

  const handleCardClick = (idx: number) => {
    if (disabled) return;
    if (!hallucinationFound) {
      setSelectedCard(idx);
      playSound("onCardSelect");
    }
  };

  const verifyHallucination = () => {
    if (disabled) return;
    if (selectedCard === 4) {
      setHallucinationFound(true);
      playSound("onHallucinationCorrect");
    } else {
      setStatusState("FAIL");
      playSound("onFail");
      if (onFailed) {
        onFailed();
      }
      setTimeout(() => setStatusState("IDLE"), 3000);
    }
  };

  const verifyFinalWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (answerInput.trim().toUpperCase() === "PARADOX") {
      setStatusState("SUCCESS");
      playSound("onFinalWordCorrect");
      if (onSolved) {
        onSolved();
      }
    } else {
      setStatusState("FAIL");
      playSound("onFail");
      if (onFailed) {
        onFailed();
      }
      setTimeout(() => setStatusState("IDLE"), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0415] text-purple-100 flex flex-col items-center justify-between p-4 md:p-8 font-mono relative overflow-hidden select-none">
      {/* Mystical Velvet Ambient Smoke & Grid Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Header Profile Dashboard */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center border-b border-purple-900/50 pb-4 mb-6 z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-widest text-purple-400">
            CRIMSON CARNIVAL // SEGMENT_03
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            FILE PROFILE: CF-04-AB-2903 // THE FORTUNE TELLER
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            CONTRADICTION GRAPH DETECTION: ACTIVE
          </span>
        </div>
      </header>

      {/* Pulsing Crystal Ball Element */}
      <section className="flex flex-col items-center my-4 z-10 relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-950 to-indigo-900 border-2 border-purple-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-pulse">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-400/20 blur-[1px] flex items-center justify-center text-purple-300 text-xs text-center font-bold tracking-tighter uppercase px-2">
            🔮 ORACLE
          </div>
        </div>
        <p className="text-[10px] text-purple-400/50 uppercase tracking-widest mt-2">
          Ambient whispers surrounding canvas...
        </p>
      </section>

      {/* Ornate Tarot Prophecies Grid Section Layout */}
      <section className="w-full max-w-6xl mb-8 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATEMENTS.map((statement, idx) => {
            const isTargetCard = idx === 4;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`min-h-[220px] rounded-xl border p-5 flex flex-col justify-between transition-all duration-500 relative group overflow-hidden ${
                  hallucinationFound && isTargetCard
                    ? "bg-purple-900/20 border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.3)] rotate-y-180"
                    : selectedCard === idx
                    ? "bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-102"
                    : "bg-zinc-950/60 border-purple-950/80 hover:border-purple-800/60 hover:scale-101"
                } ${
                  disabled
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                }`}
              >
                {/* Decorative Tarot Borders borders line tags */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-purple-900/20 pointer-events-none rounded-lg group-hover:border-purple-800/30" />

                <div className="flex justify-between items-center border-b border-purple-950 pb-2 text-[10px] tracking-wider text-purple-400/60">
                  <span>PROPHECY_0{idx + 1}</span>
                  <span>CARD_INDEX</span>
                </div>

                <div className="py-4 text-center select-text">
                  {hallucinationFound && isTargetCard ? (
                    <p className="text-sm font-bold text-pink-400 tracking-widest uppercase animate-pulse">
                      {"THE KEY IS PARADOX"}
                    </p>
                  ) : (
                    <p className="text-xs md:text-sm text-zinc-300 font-serif leading-relaxed">
                      {statement}
                    </p>
                  )}
                </div>

                <div className="flex justify-center border-t border-purple-950/40 pt-2">
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      selectedCard === idx
                        ? "bg-purple-500 border-purple-400"
                        : "border-purple-900/60"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Control Deck Interface Layout grid panels */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start z-10">
        {/* Verification Logic Module Block panel */}
        <div className="bg-zinc-950/60 border border-purple-950 p-5 rounded-xl flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              CONTRADICTION ANALYSIS DECK
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase mb-4">
              Mark the targeted node containing the logical anomaly from the deck
              matrix.
            </p>
          </div>

          {!hallucinationFound ? (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-800 p-2 text-center rounded">
                {selectedCard !== null
                  ? `SUSPECTED ANOMALY: PROPHECY_0${selectedCard + 1}`
                  : "SELECT A TARGET PROPHECY CARD"}
              </div>
              <button
                onClick={verifyHallucination}
                disabled={selectedCard === null || disabled}
                className="w-full bg-purple-950/40 border border-purple-800/60 text-purple-300 text-xs font-bold py-2 rounded uppercase tracking-wider hover:bg-purple-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                SUBMIT SUSPECT MARK
              </button>
            </div>
          ) : (
            <form onSubmit={verifyFinalWord} className="space-y-3">
              <input
                type="text"
                placeholder="ENTER REVEALED SECRET WORD..."
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                disabled={statusState === "SUCCESS" || disabled}
                className="w-full bg-zinc-900/80 border border-purple-900/50 rounded px-3 py-2 text-xs uppercase tracking-widest text-pink-400 focus:outline-none focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={statusState === "SUCCESS" || disabled}
                className="w-full bg-pink-950/20 border border-pink-800/40 text-pink-400 text-xs font-bold py-2 rounded uppercase tracking-wider hover:bg-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PURGE CONTRADICTION
              </button>
            </form>
          )}

          <div className="mt-4 min-h-[40px] flex items-center justify-center">
            {statusState === "SUCCESS" && (
              <div className="w-full bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 rounded p-2 text-center text-xs font-extrabold tracking-widest">
                {"SEGMENT 03 STABILIZED – CONTRADICTION PURGED"}
              </div>
            )}
            {statusState === "FAIL" && (
              <div className="w-full bg-rose-950/40 border border-rose-500/50 text-rose-400 rounded p-2 text-center text-xs font-extrabold tracking-widest">
                {"THE THREADS DO NOT MEET // ANOMALY STILL WHISPERS"}
              </div>
            )}
          </div>
        </div>

        {/* Override Hint Controller Engine Module panel */}
        <div className="bg-zinc-950/60 border border-purple-950 p-5 rounded-xl flex flex-col justify-between h-full min-h-[220px] space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              THREAD OVERRIDE METRICS
            </h4>
            <div className="min-h-[60px] bg-zinc-900/30 rounded border border-purple-950/40 p-3 text-[11px] text-purple-300/80 tracking-tight leading-relaxed select-text">
              <span className="text-pink-500 font-bold">DECK_HINT_LOG:</span>{" "}
              {PROGRESSIVE_HINTS[hintIndex]}
            </div>
          </div>

          <button
            onClick={() =>
              setHintIndex((prev) => (prev + 1) % PROGRESSIVE_HINTS.length)
            }
            disabled={disabled}
            className="w-full bg-zinc-900 hover:bg-zinc-850 border border-purple-950 text-zinc-400 text-[10px] font-bold uppercase py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            DECRYPT NEXT SYSTEM HINT
          </button>
        </div>
      </section>

      {/* Dashboard Canvas footer metrics tag */}
      <footer className="w-full max-w-6xl text-center border-t border-purple-950/50 pt-4 mt-8 text-[9px] text-zinc-600 uppercase tracking-widest z-10">
        {"Crimson Carnival Internal Subsystem Terminal Grid V1.8.4 // SECURITY LEVEL CLEARANCE DETECTED"}
      </footer>
    </main>
  );
}
