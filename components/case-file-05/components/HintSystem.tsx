"use client";

import React, { useState } from "react";
import { useHints } from "../hooks/useHints";
import { HelpCircle, ChevronDown, ChevronUp, Lock, Unlock } from "lucide-react";

interface HintSystemProps {
  puzzleId: number;
}

export function HintSystem({ puzzleId }: HintSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    unlockedCount,
    availableHints,
    unlockedHints,
    unlockNextHint,
    maxHints,
  } = useHints(puzzleId);

  if (availableHints.length === 0) return null;

  return (
    <div className="w-full max-w-xl mx-auto border border-zinc-800/80 rounded bg-zinc-950/40 backdrop-blur-sm font-mono overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs text-zinc-400 hover:text-emerald-400 bg-zinc-900/40 hover:bg-zinc-900/60 cursor-pointer select-none transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-zinc-500" />
          <span className="tracking-wider uppercase font-bold text-[10px]">
            Decryption Support System ({unlockedCount}/{maxHints} Unlocked)
          </span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 border-t border-zinc-900/60 space-y-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed text-left border-l-2 border-amber-500/50 pl-2">
            // Decrypting supporting evidence...
          </div>

          <div className="space-y-3">
            {availableHints.map((hintText, index) => {
              const hintNumber = index + 1;
              const isUnlocked = index < unlockedCount;
              const isNextToUnlock = index === unlockedCount;

              return (
                <div
                  key={index}
                  className={`p-3 border rounded transition-all duration-300 text-left ${
                    isUnlocked
                      ? "bg-zinc-900/35 border-zinc-800 text-zinc-300"
                      : isNextToUnlock
                      ? "bg-zinc-950 border-dashed border-amber-900/40 text-zinc-500"
                      : "bg-zinc-950/20 border-zinc-900/40 text-zinc-600 select-none opacity-40 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">
                      Hint #{hintNumber}
                    </span>
                    {isUnlocked ? (
                      <Unlock size={11} className="text-emerald-500" />
                    ) : (
                      <Lock size={11} className="text-zinc-600" />
                    )}
                  </div>

                  {isUnlocked ? (
                    <p className="text-xs italic leading-relaxed text-zinc-300 font-mono pl-2 border-l-2 border-emerald-800/40">
                      {hintText}
                    </p>
                  ) : isNextToUnlock ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <p className="text-xs font-mono text-zinc-500">
                        Decrypt secondary node.
                      </p>
                      <button
                        type="button"
                        onClick={unlockNextHint}
                        className="px-3 py-1.5 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/60 hover:border-amber-800 text-[10px] font-bold text-amber-400 rounded cursor-pointer transition-all duration-300 active:scale-98 shrink-0"
                      >
                        UNLOCK HINT
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-zinc-600">
                      Locked. Solve preceding hints first.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default HintSystem;
