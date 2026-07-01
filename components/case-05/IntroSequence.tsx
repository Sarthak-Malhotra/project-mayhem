"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { introMetaLines, introTextLines } from "./snippets";
import { Terminal, ShieldAlert } from "lucide-react";

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState<"title" | "meta" | "progress" | "story" | "ready">("title");
  const [metaIndex, setMetaIndex] = useState(0);
  const [metaText, setMetaText] = useState("");
  const [progress, setProgress] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyText, setStoryText] = useState("");
  const [skipped, setSkipped] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [metaText, progress, storyText, stage]);

  // Handle entire skip action
  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  // Stage 1: Title Card Fade-In & Duration
  useEffect(() => {
    if (stage === "title") {
      const timer = setTimeout(() => {
        setStage("meta");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 2: Type Out Metadata Lines
  useEffect(() => {
    if (stage !== "meta" || skipped) return;

    const currentLine = introMetaLines[metaIndex];
    if (!currentLine) {
      // Done with metadata lines, move to progress bar
      setStage("progress");
      return;
    }

    let charIndex = 0;
    let tempText = "";
    const completedLines = introMetaLines.slice(0, metaIndex).join("\n");
    
    const interval = setInterval(() => {
      if (charIndex < currentLine.length) {
        const char = currentLine[charIndex];
        tempText += char;
        setMetaText(completedLines + (completedLines ? "\n" : "") + tempText);
        charIndex++;
      } else {
        clearInterval(interval);
        // Wait briefly before typing the next metadata line
        setTimeout(() => {
          setMetaIndex((prev) => prev + 1);
        }, 350);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [stage, metaIndex, skipped]);

  // Stage 3: Animate Progress Bar to 82% & Reveal Recovery Successful
  useEffect(() => {
    if (stage !== "progress" || skipped) return;

    const targetVal = 82;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetVal) {
          return prev + 2;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStage("story");
          }, 1000);
          return prev;
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [stage, skipped]);

  // Stage 4: Type Out Main Story Paragraphs
  useEffect(() => {
    if (stage !== "story" || skipped) return;

    const currentParagraph = introTextLines[storyIndex];
    if (!currentParagraph) {
      setStage("ready");
      return;
    }

    let charIndex = 0;
    let tempText = "";
    const completedParagraphs = introTextLines.slice(0, storyIndex).join("\n\n");

    const interval = setInterval(() => {
      if (charIndex < currentParagraph.length) {
        const char = currentParagraph[charIndex];
        tempText += char;
        setStoryText(completedParagraphs + (completedParagraphs ? "\n\n" : "") + tempText);
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStoryIndex((prev) => prev + 1);
        }, 600);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [stage, storyIndex, skipped]);

  if (skipped) return null;

  return (
    <div className="fixed inset-0 bg-[#020204] text-zinc-300 font-mono flex items-center justify-center p-4 z-50 overflow-hidden scanlines">
      {/* Subtle background ambient red/blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
      
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3 py-1 bg-zinc-950/80 border border-zinc-800 text-[10px] text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/40 rounded transition-all duration-300 z-55 cursor-pointer uppercase tracking-widest"
      >
        Skip Log
      </button>

      <div className="w-full max-w-2xl bg-zinc-950/80 border border-zinc-900 rounded-lg shadow-2xl p-4 md:p-5 relative flex flex-col max-h-[90vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3 select-none shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              CHRONOS DECRYPTOR v4.05
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Scrollable Output Viewport */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs md:text-sm text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        >
          <AnimatePresence mode="wait">
            {stage === "title" && (
              <motion.div
                key="title-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20"
              >
                <div className="p-3 bg-emerald-950/15 border border-emerald-500/20 rounded-full text-emerald-400 mb-2">
                  <ShieldAlert size={28} className="animate-pulse" />
                </div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-zinc-100 tracking-[0.25em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  THE BLUE LEDGER
                </h1>
                <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-500/70 font-mono">
                  // Anomalous Records Recovery Core
                </span>
              </motion.div>
            )}

            {stage !== "title" && (
              <div className="space-y-4 py-1">
                {/* Meta Details */}
                <div className="whitespace-pre-wrap text-emerald-500/90 leading-relaxed font-semibold">
                  {metaText}
                  {stage === "meta" && <span className="terminal-cursor text-emerald-400" />}
                </div>

                {/* Progress bar */}
                {(stage === "progress" || stage === "story" || stage === "ready") && (
                  <div className="space-y-1 animate-fade-in w-full max-w-sm">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      <span>Decompressing Memory Archives</span>
                      <span className="text-emerald-400">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden flex p-[1px]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] rounded-2xs"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {progress >= 82 && (
                      <div className="text-[10px] text-emerald-400/80 font-bold tracking-wider pt-0.5 uppercase animate-pulse">
                        [ RECOVERY SUCCESSFUL ]
                      </div>
                    )}
                  </div>
                )}

                {/* Story text */}
                {(stage === "story" || stage === "ready") && (
                  <div className="whitespace-pre-wrap text-zinc-300 leading-normal border-t border-zinc-900/60 pt-3 font-sans select-text">
                    {storyText}
                    {stage === "story" && <span className="terminal-cursor text-zinc-100" />}
                  </div>
                )}

                {/* Ready Status & Trigger */}
                {stage === "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pt-3.5 border-t border-zinc-900/60 flex flex-col gap-2 select-none"
                  >
                    <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                      // READY TO COMMENCE MEMORY RECONSTRUCTION
                    </div>
                    <button
                      onClick={onComplete}
                      className="w-full sm:w-auto px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs rounded border border-emerald-500 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 active:scale-98 text-center self-start"
                    >
                      BEGIN INVESTIGATION
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
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
export default IntroSequence;
