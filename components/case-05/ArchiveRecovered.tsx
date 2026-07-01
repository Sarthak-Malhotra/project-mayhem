"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { archiveSnippets } from "./snippets";
import { FolderCheck, LockKeyhole, Terminal } from "lucide-react";

interface ArchiveRecoveredProps {
  archiveId: number;
  onComplete: () => void;
}

export function ArchiveRecovered({ archiveId, onComplete }: ArchiveRecoveredProps) {
  const snippet = archiveSnippets[archiveId];
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [currentLineText, setCurrentLineText] = useState("");
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside terminal box
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [typedLines, currentLineText]);

  useEffect(() => {
    if (!snippet) {
      onComplete();
      return;
    }

    const lines = snippet.body;
    if (lineIndex >= lines.length) {
      setIsDone(true);
      return;
    }

    const currentLine = lines[lineIndex];
    let charIndex = 0;
    let tempText = "";

    const interval = setInterval(() => {
      if (charIndex < currentLine.length) {
        tempText += currentLine[charIndex];
        setCurrentLineText(tempText);
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTypedLines((prev) => [...prev, currentLine]);
          setCurrentLineText("");
          setLineIndex((prev) => prev + 1);
        }, 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [lineIndex, snippet]);

  if (!snippet) return null;

  return (
    <div className="fixed inset-0 bg-[#020205]/95 backdrop-blur-md text-zinc-300 font-mono flex items-center justify-center p-4 z-40 overflow-hidden scanlines animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.02),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-xl bg-zinc-950/90 border border-emerald-500/30 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.1)] p-6 relative flex flex-col max-h-[85vh]">
        {/* Glowing border top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 select-none shrink-0">
          <div className="flex items-center gap-2">
            <FolderCheck size={15} className="text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              ARCHIVE COMPILATION SYNC
            </span>
          </div>
          <span className="px-1.5 py-0.5 bg-emerald-950/40 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
            RECOVERED
          </span>
        </div>

        {/* Content Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto pr-2 space-y-6 text-xs md:text-sm text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          {/* Main Recovered Block */}
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-black tracking-widest text-zinc-100 uppercase">
              {snippet.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>SECTION:</span>
              <span className="text-emerald-500">{snippet.section}</span>
            </div>
          </div>

          {/* Recovered Records Checkbox List */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-md space-y-2">
            <div className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mb-1 flex items-center gap-1">
              <LockKeyhole size={11} className="text-zinc-600" />
              SYNCHRONIZED DATA RECORDS:
            </div>
            {snippet.records.map((record, index) => (
              <div key={index} className="flex items-center gap-2 text-zinc-300 text-xs font-semibold">
                <span className="text-emerald-500">✓</span>
                <span>{record}</span>
              </div>
            ))}
          </div>

          {/* Story insights (Typewriter stream) */}
          <div className="space-y-4 pt-2 border-t border-zinc-900/50 leading-relaxed text-zinc-300 font-serif select-text">
            {typedLines.map((line, idx) => (
              <p key={idx} className="animate-fade-in">
                {line}
              </p>
            ))}
            
            {!isDone && (
              <p>
                {currentLineText}
                <span className="terminal-cursor text-emerald-500" />
              </p>
            )}
          </div>

          {/* Skip / Acknowledge Action */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-6 border-t border-zinc-900/50 flex flex-col gap-2 select-none"
            >
              <button
                onClick={onComplete}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider text-[11px] rounded border border-emerald-800/80 cursor-pointer shadow-md hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300 active:scale-98 text-center flex items-center justify-center gap-2"
              >
                <Terminal size={12} />
                <span>Continue Reconstruction</span>
              </button>
            </motion.div>
          )}
        </div>
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
export default ArchiveRecovered;
