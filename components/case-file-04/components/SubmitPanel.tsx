"use client";

import React, { useState, useRef, useEffect } from "react";
import { SUCCESS_MESSAGE, FAILURE_MESSAGE } from "../constants";

interface SubmitPanelProps {
  onValidate: (input: string) => boolean;
  onSuccess: () => void;
  onFailed?: () => void;
  disabled?: boolean;
}

type Status = "idle" | "success" | "failure";

export default function SubmitPanel({
  onValidate,
  onSuccess,
  onFailed,
  disabled,
}: SubmitPanelProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    // don't auto-focus to avoid janky mobile UX
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !input.trim()) return;

    const correct = onValidate(input);
    setAttempts((a) => a + 1);

    if (correct) {
      setStatus("success");
      onSuccess();
    } else {
      setStatus("failure");
      if (onFailed) {
        onFailed();
      }
      // Reset failure after 2.5 s
      setTimeout(() => setStatus("idle"), 2500);
      inputRef.current?.select();
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="relative border border-yellow-500/60 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm p-6">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 success-shimmer pointer-events-none" />

          <div className="relative text-center space-y-3">
            <div className="text-yellow-400 text-2xl font-mono font-bold tracking-widest animate-pulse">
              ✦ {SUCCESS_MESSAGE} ✦
            </div>
            <p className="text-yellow-200/60 text-sm font-mono">
              The wheel stops recording.
            </p>
            <div className="text-xs font-mono text-purple-300/50 mt-2">
              CF-04-AB-2903 | SEGMENT LOCKED
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`border rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 ${
          status === "failure"
            ? "border-red-500/60 bg-red-950/20"
            : "border-purple-800/40 bg-black/40"
        }`}
      >
        <div className="px-3 py-1.5 border-b border-purple-900/30 bg-purple-950/20">
          <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">
            Decode Submission — CF-04-AB-2903
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="answer-input"
              className="text-xs font-mono text-purple-300/70 uppercase tracking-widest"
            >
              Enter decoded word
            </label>
            <input
              ref={inputRef}
              id="answer-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="_ _ _ _ _ _ _ _"
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              disabled={disabled}
              className={`
                w-full bg-black/60 border rounded px-4 py-2.5
                font-mono text-lg tracking-[0.3em] text-center
                placeholder:text-purple-900/40 placeholder:tracking-[0.3em]
                focus:outline-none transition-all duration-200
                ${
                  status === "failure"
                    ? "border-red-500/70 text-red-400 focus:border-red-400"
                    : "border-purple-700/50 text-yellow-300 focus:border-yellow-500/60"
                }
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
              aria-label="Answer input"
              aria-describedby="submit-status"
            />
          </div>

          {/* Status message */}
          <div id="submit-status" aria-live="assertive" className="min-h-[20px]">
            {status === "failure" && (
              <p className="text-red-400 text-xs font-mono text-center animate-pulse">
                ⚠ {FAILURE_MESSAGE}
                {attempts > 2 && " — Consult the intercepted transmissions."}
              </p>
            )}
          </div>

          <button
            id="submit-button"
            type="submit"
            disabled={disabled || !input.trim()}
            className={`
              w-full py-2.5 rounded border font-mono text-sm uppercase tracking-widest
              transition-all duration-200 active:scale-95
              ${
                !disabled && input.trim()
                  ? "border-red-700/60 text-red-300 bg-red-950/30 hover:border-red-500 hover:bg-red-900/30 hover:text-red-200"
                  : "border-purple-900/20 text-purple-900/30 cursor-not-allowed"
              }
            `}
          >
            ⊕ Transmit Sequence
          </button>
        </form>
      </div>

      {attempts > 0 && (
        <p className="text-center text-[10px] font-mono text-purple-400/30 mt-2">
          {attempts} attempt{attempts !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
