"use client";

import React, { useState, useEffect } from "react";
import { markCaseCompleted } from "@/components/case-progress";
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

interface ChallengeItem {
  id: string;
  title: string;
  level: "EASY" | "MEDIUM" | "HARD";
  targets: string[];
  correct: number;
  codeBlock: React.ReactNode;
}

export default function Technical({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [selections, setSelections] = useState<{ [key: string]: number | null }>({
    net_easy: null,
    net_med: null,
    net_hard: null,
    asm_easy: null,
    asm_med: null,
    asm_hard: null,
  });

  const [solved, setSolved] = useState<boolean>(false);

  const challenges: ChallengeItem[] = [
    // --- SECTION 1: NETWORK INTERFACES ---
    {
      id: "net_easy",
      title: "Challenge 1: Subnet Boundary Drift",
      level: "EASY",
      targets: ["IP: 192.168.4.15", "IP: 192.168.4.250", "IP: 192.168.5.1"],
      correct: 2,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          <span className="text-[#5f6368] italic"># SECURITY PROTOCOL BLOCK: Drop packets originating outside core segment</span>{"\n"}
          <span className="text-[#cc7832] font-bold">const</span> ALLOWED_MASK = 192.168.4.0/24;
        </pre>
      ),
    },
    {
      id: "net_med",
      title: "Challenge 2: Supernet Allocation Leak",
      level: "MEDIUM",
      targets: ["IP: 10.10.7.255", "IP: 10.10.9.14", "IP: 10.10.11.200"],
      correct: 0,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          <span className="text-[#5f6368] italic">// Structural assignment boundaries inside target routers</span>{"\n"}
          <span className="text-[#cc7832] font-bold">struct</span> Route {'{'} uint32_t net_id; uint8_t mask; {'}'};{"\n"}
          Route trap_zone = {'{'} 101080, 22 {'}'}; <span className="text-[#5f6368] italic">// Resolves from 10.10.8.0 to 10.10.11.255</span>
        </pre>
      ),
    },
    {
      id: "net_hard",
      title: "Challenge 3: DHCP Rogue Broadcast Matrix",
      level: "HARD",
      targets: ["IP: 172.16.35.40", "IP: 172.16.47.255", "IP: 172.16.40.1"],
      correct: 1,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          <span className="text-[#5f6368] italic">// Host reservation logs for structural lease map: 172.16.32.0/20</span>{"\n"}
          <span className="text-[#5f6368] italic">// Valid host pool bounds: 172.16.32.1 through 172.16.47.254</span>
        </pre>
      ),
    },
    // --- SECTION 2: COMPILER OPTIMIZATION TRAPS ---
    {
      id: "asm_easy",
      title: "Challenge 4: Line Counter Step",
      level: "EASY",
      targets: ["EAX = 5", "EBX = 15", "EBX = 0"],
      correct: 1,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          MOV EAX, <span className="text-[#6897bb]">3</span>{"\n"}
          MOV EBX, <span className="text-[#6897bb]">0</span>{"\n"}
          RUN_LOOP:{"\n"}
          ADD EBX, <span className="text-[#6897bb]">5</span>{"\n"}
          DEC EAX{"\n"}
          JNZ RUN_LOOP
        </pre>
      ),
    },
    {
      id: "asm_med",
      title: "Challenge 5: The Dead Branch Illusion",
      level: "MEDIUM",
      targets: ["EAX = 220", "EAX = 20", "EAX = 10"],
      correct: 1,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          MOV EAX, <span className="text-[#6897bb]">10</span>{"\n"}
          MOV EBX, <span className="text-[#6897bb]">2</span>{"\n"}
          CMP EAX, <span className="text-[#6897bb]">10</span>{"\n"}
          JZ SKIP_BLOCK{"\n"}
          ADD EBX, <span className="text-[#6897bb]">20</span>{"\n"}
          SKIP_BLOCK:{"\n"}
          MUL EBX
        </pre>
      ),
    },
    {
      id: "asm_hard",
      title: "Challenge 6: Bitwise Obfuscation Matrix",
      level: "HARD",
      targets: ["EAX = 18", "EAX = 8", "EAX = 2"],
      correct: 2,
      codeBlock: (
        <pre className="font-mono text-xs md:text-sm text-[#a9b7c6] leading-relaxed">
          MOV EAX, 0x01{"\n"}
          SHL EAX, <span className="text-[#6897bb]">3</span>{"\n"}
          MOV EBX, 0x0A{"\n"}
          XOR EAX, EBX
        </pre>
      ),
    },
  ];

  const handleSelect = (chId: string, idx: number) => {
    if (disabled || solved) return;
    playBeep(450 + idx * 50, 0.06);
    
    setSelections((prev) => ({
      ...prev,
      [chId]: idx,
    }));
  };

  // Evaluate progress and validity
  useEffect(() => {
    const keys = Object.keys(selections);
    const complete = keys.every((k) => selections[k] !== null);
    
    if (complete) {
      const correct = keys.every((k) => {
        const item = challenges.find((c) => c.id === k);
        return item ? selections[k] === item.correct : false;
      });

      if (correct && !solved) {
        playBeep(880, 0.2);
        setSolved(true);
        if (onSolved) {
          onSolved();
        }
      } else if (!correct) {
        if (onFailed) onFailed();
      }
    }
  }, [selections, solved, onSolved, onFailed]);

  useEffect(() => {
    if (solved) {
      markCaseCompleted("04");
      const timer = setTimeout(() => {
        window.location.href = '/hunt';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [solved]);

  // Status message rendering
  const getStatusMessage = () => {
    const keys = Object.keys(selections);
    const complete = keys.every((k) => selections[k] !== null);
    if (solved) {
      return (
        <span className="text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
          🎯 COMPLETE SYSTEM MATCH: All ranges successfully synchronized. Perfect file accuracy.
        </span>
      );
    }
    if (complete) {
      return (
        <span className="text-red-400 font-bold uppercase tracking-widest">
          ⚠️ CALIBRATION FAIL: Variable discrepancy identified inside code logs. Re-observe steps.
        </span>
      );
    }
    return (
      <span className="text-zinc-500 uppercase tracking-widest">
        SYSTEM STATUS: Awaiting input selections for all 6 target ranges...
      </span>
    );
  };

  return (
    <div className="tech-game-container min-h-screen text-[#F5F5F5] flex flex-col justify-start selection:bg-red-950 selection:text-red-200 relative overflow-hidden w-full select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap");
        .tech-game-container {
          font-family: "Inter", sans-serif;
          background-color: #0b0c10;
        }
        .tech-game-container .font-mono {
          font-family: "JetBrains Mono", monospace !important;
        }
      `,
        }}
      />

      {/* Grid overlay background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.025)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* Top Header Bar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-20 w-full bg-zinc-950/80 backdrop-blur-sm relative">
        <div className="text-xs tracking-[0.25em] uppercase font-bold text-red-500">
          SHOOTING RANGE VERIFIER
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:inline">
            SECURITY DECK:
          </span>
          <div className="text-xs font-mono font-bold bg-red-950/45 px-3 py-1.5 border border-red-900/30 text-red-400 rounded-sm">
            🎯 CF-04-RANGE-SYNC
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 z-10 relative max-w-6xl mx-auto w-full">
        
        <header className="w-full text-center border-b border-zinc-800/80 pb-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-red-600 uppercase">
            The Cryptic Shooting Range
          </h1>
          <p className="text-xs font-mono text-zinc-500 max-w-2xl mx-auto mt-2 uppercase tracking-wide">
            Evaluate the variables and hit submit on the target you believe holds
            the anomaly. No verification assistance is provided.
          </p>
        </header>

        {/* Section 1: Network Interfaces */}
        <div className="w-full space-y-6 mb-10">
          <h2 className="text-lg font-extrabold tracking-widest text-white uppercase border-b border-zinc-800 pb-2">
            RANGE ONE: NETWORK INTERFACES
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {challenges.slice(0, 3).map((ch) => {
              const selectedIdx = selections[ch.id];
              return (
                <div key={ch.id} className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 backdrop-blur-sm">
                  {/* Left Side: Targets */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-white tracking-wider">{ch.title}</h3>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          ch.level === "EASY" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/30" : 
                          ch.level === "MEDIUM" ? "bg-orange-950/50 text-orange-400 border border-orange-900/30" : 
                          "bg-purple-950/50 text-purple-400 border border-purple-900/30"
                        }`}>
                          {ch.level}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {ch.targets.map((target, idx) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <div key={idx} className="flex justify-between items-center bg-[#3a2212]/30 border border-[#3a2212]/50 p-3 rounded-xl shadow-inner select-none transition-all">
                              <span className="text-xs font-mono text-zinc-300">
                                <strong className="text-red-400 mr-2">TARGET [{String.fromCharCode(65 + idx)}]</strong>
                                {target}
                              </span>
                              <button
                                onClick={() => handleSelect(ch.id, idx)}
                                disabled={disabled || solved}
                                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-red-600 border-red-500 text-black shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                    : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {isSelected ? "TARGET SET" : "SUBMIT"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Code Box */}
                  <div className="bg-black/90 p-4 rounded-xl border border-zinc-900 flex items-center overflow-x-auto min-h-[100px] select-text">
                    {ch.codeBlock}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Compiler Optimization Traps */}
        <div className="w-full space-y-6 mb-10">
          <h2 className="text-lg font-extrabold tracking-widest text-white uppercase border-b border-zinc-800 pb-2">
            RANGE TWO: COMPILER OPTIMIZATION TRAPS
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {challenges.slice(3, 6).map((ch) => {
              const selectedIdx = selections[ch.id];
              return (
                <div key={ch.id} className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 backdrop-blur-sm">
                  {/* Left Side: Targets */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-white tracking-wider">{ch.title}</h3>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          ch.level === "EASY" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/30" : 
                          ch.level === "MEDIUM" ? "bg-orange-950/50 text-orange-400 border border-orange-900/30" : 
                          "bg-purple-950/50 text-purple-400 border border-purple-900/30"
                        }`}>
                          {ch.level}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {ch.targets.map((target, idx) => {
                          const isSelected = selectedIdx === idx;
                          return (
                            <div key={idx} className="flex justify-between items-center bg-[#3a2212]/30 border border-[#3a2212]/50 p-3 rounded-xl shadow-inner select-none transition-all">
                              <span className="text-xs font-mono text-zinc-300">
                                <strong className="text-red-400 mr-2">TARGET [{String.fromCharCode(65 + idx)}]</strong>
                                {target}
                              </span>
                              <button
                                onClick={() => handleSelect(ch.id, idx)}
                                disabled={disabled || solved}
                                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-red-600 border-red-500 text-black shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                    : "bg-black/40 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {isSelected ? "TARGET SET" : "SUBMIT"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Code Box */}
                  <div className="bg-black/90 p-4 rounded-xl border border-zinc-900 flex items-center overflow-x-auto min-h-[100px] select-text">
                    {ch.codeBlock}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Feedback Console */}
        <div className="w-full bg-[#11141a] border border-zinc-800 rounded-xl p-5 text-center shadow-lg mb-8">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
            Decryption Output Log
          </div>
          <div className="text-sm font-mono leading-relaxed">
            {getStatusMessage()}
          </div>
          {solved && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => { markCaseCompleted("04"); window.location.href = '/hunt'; }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                ◈ Return to Hub
              </button>
              <span className="text-[10px] text-zinc-500 font-mono">
                Redirecting automatically in 5 seconds...
              </span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
