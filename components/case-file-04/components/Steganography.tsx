"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PuzzleProps } from "../types";

// ── PLAY BEEP STUB ──
const playBeep = (freq = 600, duration = 0.08) => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // ignore
  }
};

export default function Steganography({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [ans1, setAns1] = useState<string>("");
  const [ans2, setAns2] = useState<string>("");
  const [ans3, setAns3] = useState<string>("");

  const [solved1, setSolved1] = useState<boolean>(false);
  const [solved2, setSolved2] = useState<boolean>(false);
  const [solved3, setSolved3] = useState<boolean>(false);

  const [err1, setErr1] = useState<string>("");
  const [err2, setErr2] = useState<string>("");
  const [err3, setErr3] = useState<string>("");

  const [allSolved, setAllSolved] = useState<boolean>(false);

  const checkAnswer = (num: number, inputVal: string) => {
    if (disabled || allSolved) return;
    
    const cleanInput = inputVal
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();

    if (num === 1) {
      if (cleanInput === "CARNIVAL CAROUSEL") {
        playBeep(880, 0.15);
        setSolved1(true);
        setErr1("");
      } else {
        playBeep(250, 0.2);
        setErr1("DECRYPTION ERROR: KEY MISMATCH");
        if (onFailed) onFailed();
      }
    } else if (num === 2) {
      if (cleanInput === "ANOMALY DETECTED") {
        playBeep(880, 0.15);
        setSolved2(true);
        setErr2("");
      } else {
        playBeep(250, 0.2);
        setErr2("DECRYPTION ERROR: KEY MISMATCH");
        if (onFailed) onFailed();
      }
    } else if (num === 3) {
      if (cleanInput === "FATE WAS ALREADY WRITTEN") {
        playBeep(880, 0.15);
        setSolved3(true);
        setErr3("");
      } else {
        playBeep(250, 0.2);
        setErr3("DECRYPTION ERROR: KEY MISMATCH");
        if (onFailed) onFailed();
      }
    }
  };

  // Check if all nodes are solved
  useEffect(() => {
    if (solved1 && solved2 && solved3 && !allSolved) {
      setAllSolved(true);
      if (onSolved) {
        onSolved();
      }
    }
  }, [solved1, solved2, solved3, allSolved, onSolved]);

  return (
    <div className="steg-game-container min-h-screen text-[#F5F5F5] flex flex-col justify-start selection:bg-crimson selection:text-red-100 relative overflow-hidden w-full select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap");
        .steg-game-container {
          font-family: "Inter", sans-serif;
          background-color: #030005;
        }
        .steg-game-container h1 {
          font-family: "Orbitron", sans-serif;
        }
        .steg-game-container .font-mono {
          font-family: "JetBrains Mono", monospace !important;
        }
      `,
        }}
      />

      {/* Atmospheric dark red overlays */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_top,rgba(220,20,60,0.06)_0%,transparent_60%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_left,rgba(220,20,60,0.05)_0%,transparent_70%)] pointer-events-none z-0"></div>

      {/* Navigation Bar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-20 w-full bg-zinc-950/80 backdrop-blur-sm relative">
        <div className="text-xs tracking-[0.25em] uppercase font-bold text-red-500">
          STEGANOGRAPHY MONITOR
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:inline">
            CORE LEVEL:
          </span>
          <div className="text-xs font-mono font-bold bg-red-950/45 px-3 py-1.5 border border-red-900/30 text-red-400 rounded-sm animate-pulse">
            ☣️ DECRYPTING NODE
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10 relative">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          
          <div className="text-center space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-wider text-red-600 uppercase">
              FIND WHAT'S HIDDEN
            </h1>
            <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mt-1">
              Decode everything. The final word is hidden across all three nodes.
            </p>
          </div>

          {/* Success Panel if all Decrypted */}
          {allSolved && (
            <div className="w-full bg-emerald-950/40 border border-emerald-500/35 p-6 rounded-2xl text-center space-y-2 animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-black uppercase text-emerald-300">
                DECRYPTION LOCK STABILIZED
              </h2>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                All nodes resolved. Sector 04 sequence unlocked completely.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
            
            {/* NODE 1: Visual Steganography */}
            <div className={`flex flex-col justify-between bg-zinc-950/45 border ${solved1 ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-white/5"} rounded-2xl p-5 backdrop-blur-sm relative`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">NODE_01 // VISUAL</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    solved1 ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" : "bg-red-950/45 text-red-400 border border-red-900/30"
                  }`}>
                    {solved1 ? "RESOLVED" : "LOCKED"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Every show begins with an invitation. Every invitation hides intent.
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    To enter, speak the name of the place itself.
                  </p>
                </div>

                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-900 bg-black flex items-center justify-center">
                  <Image
                    src="/case-04/steganography-image.png"
                    alt="Visual Steganography Clue"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  placeholder="DECRYPT ANSWER"
                  value={ans1}
                  onChange={(e) => setAns1(e.target.value)}
                  disabled={disabled || solved1 || allSolved}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") checkAnswer(1, ans1);
                  }}
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-center text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 text-white disabled:opacity-50"
                />
                
                {err1 && (
                  <div className="text-[9px] font-mono text-center text-red-400 bg-red-950/30 border border-red-900/50 py-1.5 rounded">
                    {err1}
                  </div>
                )}

                <button
                  onClick={() => checkAnswer(1, ans1)}
                  disabled={disabled || solved1 || allSolved}
                  className="w-full py-2.5 bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-200 font-mono text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {solved1 ? "NODE UNLOCKED" : "DECRYPT"}
                </button>
              </div>
            </div>

            {/* NODE 2: Zero-Width Text */}
            <div className={`flex flex-col justify-between bg-zinc-950/45 border ${solved2 ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-white/5"} rounded-2xl p-5 backdrop-blur-sm relative`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">NODE_02 // RAW DATA</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    solved2 ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" : "bg-red-950/45 text-red-400 border border-red-900/30"
                  }`}>
                    {solved2 ? "RESOLVED" : "LOCKED"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Look in-between to see what is hidden.
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Copy the string below and extract zero-width bytes to reveal.
                  </p>
                </div>

                <div className="bg-black/85 border border-zinc-900 p-4 rounded-xl font-mono text-xs leading-relaxed text-zinc-400 select-text overflow-y-auto max-h-[160px] cursor-text">
                  T⁣h‌e‍ ⁣c⁣a​r​n‌i﻿v⁢a‍l‍ ⁠s​l​e​e​p⁢s‌ ⁠b‍y‍ ‌d⁤a﻿y‌,⁢ ‌b‍u⁣t﻿ ‌a⁠t⁠ ⁣m​i‌d⁣n⁢i⁢g⁠h​t⁢ ‍i​t‍s⁣ ⁢f⁠o‌r⁣g⁠o⁤t‍t‍e⁠n⁤ ‌v‍o‌i‍c⁢e‍s⁤ ﻿b⁣e⁠g⁣i⁢n​ ⁠t﻿o speak again.
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  placeholder="DECRYPT ANSWER"
                  value={ans2}
                  onChange={(e) => setAns2(e.target.value)}
                  disabled={disabled || solved2 || allSolved}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") checkAnswer(2, ans2);
                  }}
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-center text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 text-white disabled:opacity-50"
                />
                
                {err2 && (
                  <div className="text-[9px] font-mono text-center text-red-400 bg-red-950/30 border border-red-900/50 py-1.5 rounded">
                    {err2}
                  </div>
                )}

                <button
                  onClick={() => checkAnswer(2, ans2)}
                  disabled={disabled || solved2 || allSolved}
                  className="w-full py-2.5 bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-200 font-mono text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {solved2 ? "NODE UNLOCKED" : "DECRYPT"}
                </button>
              </div>
            </div>

            {/* NODE 3: Audio Steganography */}
            <div className={`flex flex-col justify-between bg-zinc-950/45 border ${solved3 ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-white/5"} rounded-2xl p-5 backdrop-blur-sm relative`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">NODE_03 // ACOUSTIC</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    solved3 ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" : "bg-red-950/45 text-red-400 border border-red-900/30"
                  }`}>
                    {solved3 ? "RESOLVED" : "LOCKED"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Audio Steganography
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Listen to the transmission closely to retrieve the passcode sequence.
                  </p>
                </div>

                <div className="bg-black/90 p-4 rounded-xl border border-zinc-900 flex flex-col justify-center items-center h-[120px] select-none">
                  {/* Standard Next.js Audio tag */}
                  <audio
                    src="/audio/steganography-audio.mp3"
                    controls
                    className="w-full accent-red-600"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  placeholder="DECRYPT ANSWER"
                  value={ans3}
                  onChange={(e) => setAns3(e.target.value)}
                  disabled={disabled || solved3 || allSolved}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") checkAnswer(3, ans3);
                  }}
                  className="w-full bg-zinc-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-center text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 text-white disabled:opacity-50"
                />
                
                {err3 && (
                  <div className="text-[9px] font-mono text-center text-red-400 bg-red-950/30 border border-red-900/50 py-1.5 rounded">
                    {err3}
                  </div>
                )}

                <button
                  onClick={() => checkAnswer(3, ans3)}
                  disabled={disabled || solved3 || allSolved}
                  className="w-full py-2.5 bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-200 font-mono text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {solved3 ? "NODE UNLOCKED" : "DECRYPT"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
