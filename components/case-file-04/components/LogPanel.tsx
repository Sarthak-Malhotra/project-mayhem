"use client";

import React from "react";
import { LogEntry } from "../types";

interface LogPanelProps {
  log: LogEntry[];
}

export default function LogPanel({ log }: LogPanelProps) {
  const display = log.slice(0, 10);

  return (
    <div
      className="w-full max-w-lg mx-auto"
      role="log"
      aria-label="Observation log"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <h2 className="text-xs font-mono uppercase tracking-widest text-yellow-500/70">
          Observation Log — {log.length} / 34 entries
        </h2>
      </div>

      {/* Log table */}
      <div className="bg-black/40 border border-purple-900/50 rounded-lg overflow-hidden backdrop-blur-sm">
        {/* Column headers */}
        <div className="grid grid-cols-4 px-3 py-1.5 border-b border-purple-900/30 bg-purple-950/20">
          <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">Step</span>
          <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">Gondola</span>
          <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">Value</span>
          <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">Status</span>
        </div>

        {display.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-purple-400/40 text-xs font-mono">
              [ CLICK A GONDOLA TO BEGIN RECORDING ]
            </p>
          </div>
        ) : (
          <div className="divide-y divide-purple-900/20">
            {display.map((entry, idx) => (
              <div
                key={entry.id}
                className={`grid grid-cols-4 px-3 py-1.5 transition-colors ${
                  idx === 0 ? "bg-purple-900/10" : ""
                } ${entry.isGhost ? "ghost-row" : ""}`}
              >
                <span
                  className={`text-xs font-mono ${
                    entry.isGhost ? "text-red-400" : "text-yellow-500/70"
                  }`}
                >
                  {entry.rotationStep}
                </span>
                <span
                  className={`text-xs font-mono ${
                    entry.isGhost ? "text-red-400" : "text-purple-300"
                  }`}
                >
                  #{entry.gondolaIndex}
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    entry.isGhost ? "text-red-400 animate-pulse" : "text-yellow-400"
                  }`}
                >
                  {entry.displayedNumber}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase ${
                    entry.isGhost
                      ? "text-red-500"
                      : "text-green-500/60"
                  }`}
                >
                  {entry.isGhost ? "⚠ GHOST" : "● TRUE"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-0.5 bg-purple-900/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-700 via-yellow-500 to-red-700 transition-all duration-500"
          style={{ width: `${Math.min((log.length / 34) * 100, 100)}%` }}
        />
      </div>
      <p className="text-[10px] font-mono text-purple-400/40 mt-1 text-right">
        {log.length >= 17
          ? "✓ Enough data to attempt decoding"
          : `${17 - log.length} more observations needed`}
      </p>
    </div>
  );
}
