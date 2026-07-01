"use client";

import React, { useState, useEffect, useRef } from "react";
import { finalLogLines, finalAccessLines } from "./snippets";
import { Trophy, AlertTriangle, ShieldCheck, Database } from "lucide-react";
import { markCaseCompleted } from "@/components/case-progress";

export function FinalLedger() {
  const [stage, setStage] = useState<"compiling" | "records" | "logs" | "access" | "done">("compiling");
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [currentLogText, setCurrentLogText] = useState("");
  const [accessLines, setAccessLines] = useState<string[]>([]);
  const [currentAccessIndex, setCurrentAccessIndex] = useState(0);
  const [countdown, setCountdown] = useState(6);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [progress, logLines, currentLogText, accessLines, stage]);

  // Stage 1: Compilation Progress
  useEffect(() => {
    if (stage !== "compiling") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 4;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStage("records");
          }, 800);
          return prev;
        }
      });
    }, 45);

    return () => clearInterval(interval);
  }, [stage]);

  // Stage 2: Records List Display
  useEffect(() => {
    if (stage !== "records") return;

    // Show records list for 2 seconds, then transition to final log text
    const timer = setTimeout(() => {
      setStage("logs");
    }, 2500);

    return () => clearTimeout(timer);
  }, [stage]);

  // Stage 3: Type out final log text line-by-line
  useEffect(() => {
    if (stage !== "logs") return;

    if (currentLogIndex >= finalLogLines.length) {
      setStage("access");
      return;
    }

    const currentLine = finalLogLines[currentLogIndex];
    let charIndex = 0;
    let tempText = "";

    const interval = setInterval(() => {
      if (charIndex < currentLine.length) {
        tempText += currentLine[charIndex];
        setCurrentLogText(tempText);
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLogLines((prev) => [...prev, currentLine]);
          setCurrentLogText("");
          setCurrentLogIndex((prev) => prev + 1);
        }, 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [stage, currentLogIndex]);

  // Stage 4: Type out access credentials
  useEffect(() => {
    if (stage !== "access") return;

    if (currentAccessIndex >= finalAccessLines.length) {
      setStage("done");
      // Double check case is marked completed
      markCaseCompleted("05");
      return;
    }

    const timer = setTimeout(() => {
      setAccessLines((prev) => [...prev, finalAccessLines[currentAccessIndex]]);
      setCurrentAccessIndex((prev) => prev + 1);
    }, 400); // Quick sequential reveal

    return () => clearTimeout(timer);
  }, [stage, currentAccessIndex]);

  // Stage 5: Final Countdown & Auto Redirect
  useEffect(() => {
    if (stage !== "done") return;

    if (countdown <= 0) {
      window.location.href = "/hunt";
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [stage, countdown]);

  const records = [
    "Fast Inverse Square Root",
    "Wilhelm Scream",
    "Taured",
    "Kryptos",
    "Deep Blue",
    "Voyager",
    "Demon Core",
    "Poe Cipher"
  ];

  const handleManualReturn = () => {
    markCaseCompleted("05");
    window.location.href = "/hunt";
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 font-mono text-zinc-300 bg-zinc-950/80 border border-zinc-900 rounded-lg shadow-2xl p-6 relative flex flex-col max-h-[85vh] select-text">
      {/* Top ambient strip */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-cyan-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            BLUE LEDGER SYSTEM REBUILD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded animate-pulse">
            RESTORED
          </span>
        </div>
      </div>

      {/* Output Console Box */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-6 text-xs md:text-sm text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent min-h-[350px]"
      >
        {/* Compilation progress */}
        <div className="space-y-1.5 w-full max-w-sm">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>COMPILING BLUE LEDGER...</span>
            <span className="text-cyan-400">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden flex p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] rounded-2xs transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress >= 100 && (
            <div className="text-[10px] text-cyan-400 font-bold tracking-wider pt-1 uppercase">
              RECONSTRUCTION COMPLETE
            </div>
          )}
        </div>

        {/* Recovered records checklist */}
        {(stage === "records" || stage === "logs" || stage === "access" || stage === "done") && (
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-md space-y-2 max-w-md animate-fade-in">
            <div className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mb-1">
              RECOVERED HISTORICAL RECORDS:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {records.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 text-zinc-300">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final log report (Typewriter style) */}
        {(stage === "logs" || stage === "access" || stage === "done") && (
          <div className="space-y-4 pt-3 border-t border-zinc-900/60 leading-relaxed text-zinc-300 font-serif border-dashed">
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">
              FINAL INVESTIGATION LOG
            </div>
            {logLines.map((line, idx) => (
              <p key={idx} className="animate-fade-in text-[12px] md:text-[13px]">
                {line}
              </p>
            ))}
            {stage === "logs" && (
              <p className="text-[12px] md:text-[13px]">
                {currentLogText}
                <span className="terminal-cursor text-cyan-400" />
              </p>
            )}
          </div>
        )}

        {/* Access upgrade details */}
        {(stage === "access" || stage === "done") && (
          <div className="pt-4 border-t border-zinc-900/60 font-mono space-y-2 border-dashed">
            {accessLines.map((line, idx) => {
              const isStatusHeader = line.startsWith("ACCESS STATUS") || line.startsWith("NEW EVIDENCE");
              return (
                <div
                  key={idx}
                  className={`animate-fade-in ${
                    isStatusHeader 
                      ? "text-cyan-400 font-bold tracking-wider text-[11px] uppercase" 
                      : "text-zinc-500 text-[10px] pl-2 border-l border-zinc-800"
                  }`}
                >
                  {isStatusHeader ? `◈ ${line}` : `// ${line}`}
                </div>
              );
            })}
          </div>
        )}

        {/* Finished / Redirect Prompt */}
        {stage === "done" && (
          <div className="pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in select-none">
            <div className="text-[10px] text-zinc-500">
              Redirecting automatically to Hunt board in {countdown}s...
            </div>
            <button
              onClick={handleManualReturn}
              className="px-6 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-400 font-bold uppercase tracking-wider text-[10px] rounded border border-cyan-800/80 cursor-pointer shadow-md hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 active:scale-98 text-center"
            >
              Complete Stabilization
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .terminal-cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background-color: currentColor;
          margin-left: 4px;
          vertical-align: middle;
          animation: terminal-blink 1s step-end infinite;
        }
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
export default FinalLedger;
