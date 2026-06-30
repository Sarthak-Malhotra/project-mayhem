"use client";

import React, { useState, useCallback } from "react";
import FerrisWheel from "./components/FerrisWheel";
import LogPanel from "./components/LogPanel";
import HintSystem from "./components/HintSystem";
import SubmitPanel from "./components/SubmitPanel";
import { useWheelEngine } from "./hooks/useWheelEngine";
import { SOUND_HOOKS } from "./constants";
import { PuzzleProps } from "./types";

export default function CaseFile04Puzzle({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const {
    rotationStep,
    gondolas,
    log,
    isRunning,
    totalRotations,
    advance,
    clickGondola,
    toggleRunning,
    validateAnswer,
  } = useWheelEngine(disabled);

  const [solved, setSolved] = useState(false);

  const handleSuccess = useCallback(() => {
    setSolved(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SOUND_HOOKS.onSuccess));
    }
    if (onSolved) {
      onSolved();
    }
  }, [onSolved]);

  const handleFailed = useCallback(() => {
    if (onFailed) {
      onFailed();
    }
  }, [onFailed]);

  return (
    <main className="min-h-screen bg-[#0a0008] relative overflow-x-hidden">
      {/* ── Embed CSS Animations for self-containment ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ghost-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #dc143c; }
          50%       { opacity: 0.6; box-shadow: 0 0 20px #dc143c, 0 0 40px #8b0000; }
        }
        @keyframes success-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ghost-row {
          animation: ghost-pulse 0.6s ease-in-out;
        }
        .success-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 215, 0, 0.15) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: success-shimmer 1.5s linear infinite;
        }
      `}} />

      {/* ── Atmospheric background layers ── */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0008_100%)]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffd700 1px, transparent 1px), linear-gradient(90deg, #ffd700 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Ambient glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-900/10 rounded-full blur-3xl" />
        {/* Ambient glow bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* ── Header ── */}
        <header className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />
            <span className="text-[10px] font-mono text-red-600/60 tracking-widest uppercase">
              CF-04-AB-2903
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/60 to-transparent" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 uppercase">
            Cycle of 17
          </h1>

          <p className="text-xs font-mono text-purple-300/50 tracking-widest">
            Crimson Carnival — Haunted Containment Mechanism
          </p>

          {/* Status bar */}
          <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
            <StatusBadge label="Step" value={rotationStep} />
            <StatusBadge label="Cycle" value={`${totalRotations}/2`} />
            <StatusBadge
              label="Logged"
              value={`${log.length}/34`}
              pulse={log.length > 0}
            />
            <StatusBadge
              label="Engine"
              value={isRunning ? "RUNNING" : "PAUSED"}
              highlight={isRunning}
            />
          </div>
        </header>

        {/* ── Ferris Wheel ── */}
        <section
          aria-label="Ferris wheel"
          className="relative"
        >
          {/* Decorative frame */}
          <div className="absolute -inset-4 rounded-2xl border border-purple-900/20 pointer-events-none" />
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-b from-purple-950/10 to-transparent pointer-events-none" />

          <FerrisWheel
            gondolas={gondolas}
            rotationStep={rotationStep}
            onGondolaClick={clickGondola}
            disabled={disabled}
          />

          {/* Instruction overlay */}
          <p className="text-center text-[10px] font-mono text-purple-400/30 mt-1">
            ↑ CLICK GONDOLA TO RECORD · AUTO-ROTATES EVERY 3s ↑
          </p>
        </section>

        {/* ── Controls ── */}
        <section
          aria-label="Wheel controls"
          className="flex items-center justify-center gap-3"
        >
          <button
            id="advance-button"
            onClick={advance}
            disabled={disabled}
            className={`px-5 py-2 rounded border border-yellow-700/50 text-yellow-400/80 text-xs font-mono uppercase tracking-widest hover:border-yellow-500 hover:text-yellow-300 hover:bg-yellow-500/5 transition-all duration-200 active:scale-95 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Advance wheel one step"
          >
            ▶ Advance
          </button>

          <button
            id="toggle-button"
            onClick={toggleRunning}
            disabled={disabled}
            className={`px-5 py-2 rounded border text-xs font-mono uppercase tracking-widest transition-all duration-200 active:scale-95 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${
              isRunning
                ? "border-red-700/50 text-red-400/70 hover:border-red-600 hover:text-red-300 hover:bg-red-900/10"
                : "border-green-700/50 text-green-400/70 hover:border-green-600 hover:text-green-300 hover:bg-green-900/10"
            }`}
            aria-label={isRunning ? "Pause auto-rotation" : "Resume auto-rotation"}
          >
            {isRunning ? "⏸ Pause" : "⏵ Resume"}
          </button>
        </section>

        {/* ── Divider ── */}
        <Divider label="Observations" />

        {/* ── Log ── */}
        <section aria-label="Observation log">
          <LogPanel log={log} />
        </section>

        {/* ── Divider ── */}
        <Divider label="Transmissions" />

        {/* ── Hints ── */}
        <section aria-label="Hint system">
          <HintSystem disabled={disabled} />
        </section>

        {/* ── Divider ── */}
        <Divider label="Decode" />

        {/* ── Submit ── */}
        <section aria-label="Answer submission">
          <SubmitPanel
            onValidate={validateAnswer}
            onSuccess={handleSuccess}
            onFailed={handleFailed}
            disabled={disabled}
          />
        </section>

        {/* ── Footer ── */}
        <footer className="text-center pb-4">
          <p className="text-[9px] font-mono text-purple-900/40 tracking-widest uppercase">
            The wheel has been turning for 17 years · It will turn 17 more
          </p>
        </footer>
      </div>
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({
  label,
  value,
  pulse,
  highlight,
}: {
  label: string;
  value: string | number;
  pulse?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-black/30 border border-purple-900/30 rounded px-2.5 py-1">
      <span className="text-[9px] font-mono uppercase text-purple-400/50 tracking-widest">
        {label}
      </span>
      <span
        className={`text-xs font-mono font-bold ${
          highlight ? "text-green-400" : "text-yellow-400"
        } ${pulse ? "animate-pulse" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-800/30 to-transparent" />
      <span className="text-[9px] font-mono text-purple-500/40 tracking-widest uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-800/30 to-transparent" />
    </div>
  );
}
