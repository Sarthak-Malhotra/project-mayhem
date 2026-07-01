"use client";

import React, { useMemo, useState } from "react";
import { useCaseStore } from "../CaseFileProvider";
import { puzzlesConfig } from "../lib/puzzles.config";
import { ArrowRight, ShieldCheck, Share2 } from "lucide-react";

interface SolvedRevealProps {
  puzzleId: number;
}

export function SolvedReveal({ puzzleId }: SolvedRevealProps) {
  const [copied, setCopied] = useState(false);
  const solved = useCaseStore((state) => state.solved);
  const scores = useCaseStore((state) => state.scores);
  const setActive = useCaseStore((state) => state.setActive);
  const durations = useCaseStore((state) => state.puzzleDurations) || {};
  const duration = durations[puzzleId] || 42;

  const config = puzzlesConfig.find((p) => p.id === puzzleId);
  const score = scores[puzzleId] || 0;
  const maxScore = config ? config.points : 300;

  // Generate particles only once on mount per puzzle
  const particles = useMemo(() => {
    const colors = [
      "#10b981", // emerald-500
      "#34d399", // emerald-400
      "#059669", // emerald-600
      "#60a5fa", // blue-400
      "#3b82f6", // blue-500
      "#f59e0b", // amber-500
      "#fbbf24", // amber-400
      "#ec4899", // pink-500
    ];
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.random() * 720;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 8;
      const delay = Math.random() * 0.15;
      const duration = 1.2 + Math.random() * 1.0;
      const isCircle = Math.random() > 0.5;

      return {
        id: i,
        tx: `${tx}px`,
        ty: `${ty}px`,
        rot: `${rot}deg`,
        color,
        size: `${size}px`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        borderRadius: isCircle ? "50%" : "2px",
      };
    });
  }, [puzzleId]);

  const nextUnsolvedId = useMemo(() => {
    for (let i = puzzleId + 1; i <= 8; i++) {
      if (!solved.includes(i)) return i;
    }
    for (let i = 1; i < puzzleId; i++) {
      if (!solved.includes(i)) return i;
    }
    return null;
  }, [puzzleId, solved]);

  if (!config) return null;

  return (
    <div className="w-full max-w-xl mx-auto my-8 relative text-center font-mono">
      {/* Confetti Explosion Container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
        <style>{`
          @keyframes confetti-burst {
            0% {
              transform: translate(0, 0) scale(1.5) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0.2) rotate(var(--rot));
              opacity: 0;
            }
          }
          .animate-confetti-burst {
            animation: confetti-burst var(--dur) cubic-bezier(0.15, 0.85, 0.35, 1) var(--delay) forwards;
          }
        `}</style>
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-confetti-burst"
            style={
              {
                "--tx": p.tx,
                "--ty": p.ty,
                "--rot": p.rot,
                "--dur": p.duration,
                "--delay": p.delay,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.borderRadius,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Main Solved Panel */}
      <div className="border border-emerald-500 bg-zinc-950/80 rounded-lg p-6 md:p-8 relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col items-center">
        {/* Glow overlay */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        {/* Success Icon */}
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-full text-emerald-400 mb-4 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.3)]">
          <ShieldCheck size={36} />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-emerald-400 uppercase tracking-widest mb-1.5 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] text-center">
          Timeline Stabilized
        </h2>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
          // DECRYPTION STATUS: SUCCESSFUL
        </span>

        {/* Lore Text */}
        <div className="w-full px-4 py-4 bg-zinc-900/40 border border-zinc-900 rounded text-xs md:text-sm text-zinc-300 leading-relaxed text-left font-serif mb-6 relative">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-500/40 uppercase tracking-widest font-bold">
            HISTORICAL LOG
          </div>
          <p className="pt-4">{config.lore}</p>
        </div>

        {/* Action Button & Share Button Row */}
        <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            type="button"
            onClick={() => {
              const puzzleSlug = config.title;
              const text = `I stabilized Anomaly P${String(puzzleId).padStart(2, "0")} (${puzzleSlug}) in Cryptic Hunt Case 05!`;
              navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 min-h-[44px]"
            aria-label="Share puzzle result"
          >
            <Share2 size={14} className={copied ? "text-emerald-400" : ""} />
            <span>{copied ? "Copied!" : "Share Result"}</span>
          </button>

          {nextUnsolvedId ? (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-98 min-h-[44px]"
            >
              <span>Proceed to Next Anomaly</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 min-h-[44px]"
            >
              <span>Return to Mission Control</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SolvedReveal;
