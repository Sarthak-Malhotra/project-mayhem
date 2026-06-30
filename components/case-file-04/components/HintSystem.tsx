"use client";

import React, { useState } from "react";
import { HINTS } from "../constants";

interface HintSystemProps {
  disabled?: boolean;
}

export default function HintSystem({ disabled }: HintSystemProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const revealNext = () => {
    if (disabled) return;
    if (revealedCount < HINTS.length) {
      setRevealedCount((c) => c + 1);
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button
          id="hint-button"
          onClick={revealNext}
          disabled={disabled || revealedCount >= HINTS.length}
          className={`
            px-4 py-1.5 rounded text-xs font-mono uppercase tracking-widest border
            transition-all duration-200
            ${
              disabled || revealedCount >= HINTS.length
                ? "border-purple-900/20 text-purple-900/40 cursor-not-allowed"
                : "border-yellow-700/50 text-yellow-500/80 hover:border-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/5 active:scale-95"
            }
          `}
          aria-label="Reveal next hint"
        >
          {revealedCount >= HINTS.length
            ? "All Transmissions Received"
            : `Intercept Transmission ${revealedCount + 1}/${HINTS.length}`}
        </button>

        {revealedCount > 0 && (
          <button
            onClick={() => !disabled && setIsOpen((v) => !v)}
            disabled={disabled}
            className={`text-[10px] font-mono transition-colors ${
              disabled ? "text-purple-900/30 cursor-not-allowed" : "text-purple-400/50 hover:text-purple-400"
            }`}
            aria-label="Toggle hints panel"
          >
            [{isOpen ? "HIDE" : "SHOW"}]
          </button>
        )}
      </div>

      {isOpen && revealedCount > 0 && (
        <div className="bg-black/50 border border-yellow-900/30 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="px-3 py-1 border-b border-yellow-900/20 bg-yellow-950/10">
            <span className="text-[10px] font-mono text-yellow-600/60 uppercase tracking-widest">
              Intercepted Transmissions
            </span>
          </div>
          <div className="divide-y divide-yellow-900/10 p-1">
            {HINTS.slice(0, revealedCount).map((hint, i) => (
              <div
                key={i}
                className="px-3 py-2 flex gap-3 items-start"
              >
                <span className="text-yellow-600/40 text-[10px] font-mono mt-0.5 shrink-0">
                  0{i + 1}
                </span>
                <p className="text-yellow-200/70 text-xs font-mono leading-relaxed">
                  {hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
