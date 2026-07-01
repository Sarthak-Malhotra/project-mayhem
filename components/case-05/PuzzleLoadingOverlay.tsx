"use client";

import React, { useState, useEffect } from "react";
import { loadingPhrases } from "./snippets";
import { Loader2 } from "lucide-react";

interface PuzzleLoadingOverlayProps {
  onComplete: () => void;
}

export function PuzzleLoadingOverlay({ onComplete }: PuzzleLoadingOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [activePhraseSet] = useState(() => {
    // Pick one of the loading phrase arrays randomly
    const idx = Math.floor(Math.random() * loadingPhrases.length);
    return loadingPhrases[idx];
  });
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= activePhraseSet.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 350);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, activePhraseSet[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, 220); // Quick incremental typing

    return () => clearTimeout(timer);
  }, [currentLineIndex, activePhraseSet, onComplete]);

  return (
    <div className="absolute inset-0 bg-[#020204]/90 backdrop-blur-xs flex items-center justify-center p-6 z-30 select-none font-mono">
      <div className="w-full max-w-sm p-5 border border-zinc-900 bg-zinc-950/80 rounded-md shadow-xl text-left space-y-4">
        {/* Header telemetry status */}
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
          <span>SYSTEM LOADING</span>
          <Loader2 size={10} className="animate-spin text-emerald-400" />
        </div>

        {/* Output lines */}
        <div className="space-y-1.5 min-h-[90px] flex flex-col justify-end text-[11px] text-zinc-400 leading-relaxed font-mono">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 animate-fade-in text-emerald-500/90">
              <span className="text-[9px] text-emerald-600 font-bold font-mono">◈</span>
              <span>{line}</span>
            </div>
          ))}
          {currentLineIndex < activePhraseSet.length && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-700 font-bold font-mono">◈</span>
              <span className="h-4 w-1.5 bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Small fast loading bar */}
        <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full relative">
          <div className="h-full bg-emerald-500 absolute left-0 top-0 animate-[loading-bar_1.4s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { left: -40%; width: 40%; }
          50% { left: 20%; width: 60%; }
          100% { left: 100%; width: 10%; }
        }
      `}</style>
    </div>
  );
}

export default PuzzleLoadingOverlay;
