"use client";

import React, { useState } from "react";
import { PuzzleProps } from "../types";

export default function MirrorScriptPuzzle({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const CORRECT_ANSWER = "carnival 17";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (answer.toLowerCase().trim() === CORRECT_ANSWER) {
      setIsCorrect(true);
      setSubmitted(true);
      if (onSolved) {
        onSolved();
      }
    } else {
      setIsCorrect(false);
      setSubmitted(true);
      if (onFailed) {
        onFailed();
      }
    }
  };

  const codeSnippet = `function reveal() {
    const key = "LAVINRAC";
    const step1 = key.split("").reverse().join("");
    const step2 = step1.toLowerCase();
    return step2 + " 17";
}
// O/p : carnival 17`;

  const mirroredCode = codeSnippet
    .split("\n")
    .map((line) => {
      if (line.includes("const step1 =")) {
        return "????????????";
      }
      return line;
    })
    .join("\n");

  return (
    <div className="min-h-screen bg-black text-red-600 p-8 font-mono flex flex-col items-center justify-center space-y-8">
      <div className="max-w-2xl w-full border-2 border-red-900 p-6 rounded-lg bg-zinc-900 shadow-[0_0_20px_rgba(153,27,27,0.4)]">
        <h1 className="text-3xl font-bold mb-4 text-center uppercase tracking-widest border-b border-red-900 pb-2">
          Case File: CF-04-AB-2903
        </h1>
        <p className="text-zinc-400 mb-6 italic text-center">
          "The reflections are not showing us; they are showing everything that came before us."
        </p>

        <div className="relative group">
          <div
            className="bg-black p-6 rounded border border-red-800 text-red-500 whitespace-pre overflow-x-auto font-mono text-sm leading-relaxed"
            style={{ transform: "scaleX(-1)" }}
          >
            {mirroredCode}
          </div>
          <div className="absolute -top-8 left-0 text-xs text-zinc-500 animate-pulse">
            Hint: Hold a mirror to the screen or use your phone's camera in selfie mode.
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={disabled}
            placeholder="Enter the output word..."
            className="bg-zinc-800 border border-red-900 text-red-400 p-3 rounded w-full max-w-xs text-center outline-none focus:ring-2 focus:ring-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled}
            className="bg-red-900 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors uppercase font-bold tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>

        {submitted && (
          <div
            className={`mt-6 text-center font-bold ${
              isCorrect ? "text-green-500" : "text-red-600"
            }`}
          >
            {isCorrect
              ? "ACCESS GRANTED: Fragment Restored"
              : "ACCESS DENIED: Incorrect Reflection"}
          </div>
        )}
      </div>
    </div>
  );
}
