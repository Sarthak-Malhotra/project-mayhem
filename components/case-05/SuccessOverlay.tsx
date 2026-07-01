"use client";

import React, { useState, useEffect } from "react";
import { successPhrases } from "./snippets";
import { CheckCircle } from "lucide-react";

interface SuccessOverlayProps {
  onComplete: () => void;
}

export function SuccessOverlay({ onComplete }: SuccessOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= successPhrases.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, successPhrases[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, 350); // Steady feedback speed

    return () => clearTimeout(timer);
  }, [currentLineIndex, onComplete]);

  return (
    <div className="absolute inset-0 bg-[#020204]/95 flex items-center justify-center p-6 z-30 select-none font-mono animate-fade-in">
      {/* Background neon green grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-sm p-6 border border-emerald-500 bg-zinc-950/90 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.15)] text-center space-y-5 relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        {/* Big Success Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
          <CheckCircle size={22} />
        </div>

        {/* Typed success feed */}
        <div className="space-y-2 py-2 text-xs md:text-sm text-zinc-300 font-mono flex flex-col items-center justify-center min-h-[90px]">
          {lines.map((line, idx) => {
            const isMatchHeader = line === "MATCH FOUND";
            return (
              <div 
                key={idx} 
                className={`animate-[slideUp_0.4s_ease-out_forwards] font-bold font-mono tracking-wide ${
                  isMatchHeader ? "text-emerald-400 text-sm tracking-[0.2em] mb-1" : "text-zinc-400 text-[11px]"
                }`}
              >
                {line}
              </div>
            );
          })}
          {currentLineIndex < successPhrases.length && (
            <div className="h-4 w-2 bg-emerald-500 animate-pulse mt-1" />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(4px); filter: blur(1px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

export default SuccessOverlay;
