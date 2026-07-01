"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export interface NarrativeStep {
  type: "text" | "heading" | "spacer" | "divider" | "progress" | "button";
  content?: string;
  animate?: "typewriter" | "fade" | "none";
  speed?: number; // character interval for typewriter (ms) or delay
  delayBefore?: number; // ms to wait before showing this step
  delayAfter?: number; // ms to wait after completing this step before moving next
  className?: string;
  // For progress bars
  start?: number;
  end?: number;
  // For buttons
  action?: string;
}

interface TerminalSequenceProps {
  steps: NarrativeStep[];
  onComplete?: () => void;
  onAction?: (action: string) => void;
}

export default function TerminalSequence({
  steps,
  onComplete,
  onAction,
}: TerminalSequenceProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterCharIndex, setTypewriterCharIndex] = useState(0);
  const [progressVal, setProgressVal] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Auto-scroll to bottom of the sequence
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [activeStepIndex, typewriterText, progressVal]);

  const currentStep = steps[activeStepIndex];

  useEffect(() => {
    let isCancelled = false;

    // Reset state for new step
    setTypewriterText("");
    setTypewriterCharIndex(0);
    setIsWaiting(false);

    if (!currentStep) {
      if (onCompleteRef.current && !isCancelled) {
        onCompleteRef.current();
      }
      return;
    }

    const runStep = async () => {
      // 1. Wait before starting if delayBefore is specified
      if (currentStep.delayBefore && currentStep.delayBefore > 0) {
        setIsWaiting(true);
        await new Promise((resolve) => setTimeout(resolve, currentStep.delayBefore));
        if (isCancelled) return;
        setIsWaiting(false);
      }

      // 2. Perform step animation logic
      if (currentStep.type === "text" || currentStep.type === "heading") {
        const textContent = currentStep.content || "";
        const mode = currentStep.animate || "typewriter";

        if (mode === "typewriter") {
          const speed = currentStep.speed || 30;
          let tempText = "";
          for (let i = 0; i < textContent.length; i++) {
            if (isCancelled) return;
            tempText += textContent[i];
            setTypewriterText(tempText);
            setTypewriterCharIndex(i + 1);
            await new Promise((resolve) => setTimeout(resolve, speed));
          }
        } else {
          if (isCancelled) return;
          setTypewriterText(textContent);
          setTypewriterCharIndex(textContent.length);
        }
      } else if (currentStep.type === "progress") {
        const start = currentStep.start ?? 0;
        const end = currentStep.end ?? 100;
        if (isCancelled) return;
        setProgressVal(start);

        // Animate progress value smoothly over 1.2s
        const stepsCount = 30;
        const intervalMs = 1200 / stepsCount;
        for (let i = 0; i <= stepsCount; i++) {
          if (isCancelled) return;
          const val = Math.round(start + ((end - start) * i) / stepsCount);
          setProgressVal(val);
          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
      }

      if (isCancelled) return;

      // 3. Wait after finishing if delayAfter is specified
      if (currentStep.delayAfter && currentStep.delayAfter > 0) {
        await new Promise((resolve) => setTimeout(resolve, currentStep.delayAfter));
      }

      if (isCancelled) return;

      // 4. Move to next step if it's not a blocking button step
      if (currentStep.type !== "button") {
        setActiveStepIndex((prev) => prev + 1);
      }
    };

    runStep();

    return () => {
      isCancelled = true;
    };
  }, [activeStepIndex, currentStep, steps]);

  // Handle button clicks
  const handleButtonClick = (action?: string) => {
    if (action === "next") {
      setActiveStepIndex((prev) => prev + 1);
    } else if (onAction && action) {
      onAction(action);
    }
  };

  return (
    <div className="w-full flex flex-col font-mono text-sm leading-relaxed text-zinc-300 relative">
      <div className="space-y-2 pr-2 max-h-[80vh] overflow-y-auto animate-fade-in" ref={containerRef}>
        {steps.slice(0, activeStepIndex).map((step, idx) => (
          <div key={idx}>
            {renderStaticStep(step)}
          </div>
        ))}

        {/* Currently animating/active step */}
        {currentStep && !isWaiting && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {renderActiveStep(
              currentStep,
              typewriterText,
              typewriterCharIndex,
              progressVal,
              handleButtonClick
            )}
          </motion.div>
        )}
      </div>

      {/* Embedded Terminal Styles */}
      <style jsx global>{`
        .terminal-blink {
          display: inline-block;
          width: 8px;
          height: 14px;
          background-color: currentColor;
          margin-left: 4px;
          vertical-align: middle;
          animation: terminal-cursor-blink 1s step-end infinite;
        }
        @keyframes terminal-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Renders finished steps statically (no animations)
function renderStaticStep(step: NarrativeStep) {
  const className = step.className || "";

  switch (step.type) {
    case "text":
      return <div className={`whitespace-pre-line text-zinc-300 ${className}`}>{step.content}</div>;
    case "heading":
      return <h3 className={`whitespace-pre-line ${className}`}>{step.content}</h3>;
    case "spacer":
      return <div style={{ height: step.content ? Number(step.content) : 16 }} />;
    case "divider":
      return (
        <div className="text-zinc-750 select-none py-1 overflow-hidden whitespace-nowrap">
          {step.content || "══════════════════════════════════════════════════════"}
        </div>
      );
    case "progress":
      return (
        <div className="w-full max-w-md my-4">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1.5 font-bold uppercase tracking-wider font-mono">
            <span>Archive Integrity Check</span>
            <span className="text-cyan-400">{step.end}%</span>
          </div>
          <div className="h-3 w-full bg-zinc-950/80 border border-zinc-800 rounded-sm overflow-hidden flex p-[2px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] rounded-2xs transition-all duration-300"
              style={{ width: `${step.end}%` }}
            />
          </div>
        </div>
      );
    case "button":
      return null; // A clicked/passed button disappears from the stream
    default:
      return null;
  }
}

// Renders the currently animating step
function renderActiveStep(
  step: NarrativeStep,
  typewriterText: string,
  charIndex: number,
  progressVal: number,
  onBtnClick: (action?: string) => void
) {
  const className = step.className || "";
  const animateMode = step.animate || "typewriter";

  switch (step.type) {
    case "text":
      if (animateMode === "typewriter") {
        return (
          <div className={`whitespace-pre-line text-zinc-300 ${className}`}>
            {typewriterText}
            {charIndex < (step.content || "").length && <span className="terminal-blink text-cyan-400" />}
          </div>
        );
      } else if (animateMode === "fade") {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: (step.speed || 800) / 1000 }}
            className={`whitespace-pre-line text-zinc-300 ${className}`}
          >
            {step.content}
          </motion.div>
        );
      }
      return <div className={`whitespace-pre-line text-zinc-300 ${className}`}>{step.content}</div>;

    case "heading":
      if (animateMode === "typewriter") {
        return (
          <h3 className={`whitespace-pre-line ${className}`}>
            {typewriterText}
            {charIndex < (step.content || "").length && <span className="terminal-blink text-cyan-400" />}
          </h3>
        );
      } else if (animateMode === "fade") {
        return (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: (step.speed || 800) / 1000 }}
            className={`whitespace-pre-line ${className}`}
          >
            {step.content}
          </motion.h3>
        );
      }
      return <h3 className={`whitespace-pre-line ${className}`}>{step.content}</h3>;

    case "spacer":
      return <div style={{ height: step.content ? Number(step.content) : 16 }} />;

    case "divider":
      return (
        <div className="text-zinc-750 select-none py-1 overflow-hidden whitespace-nowrap">
          {step.content || "══════════════════════════════════════════════════════"}
        </div>
      );

    case "progress":
      return (
        <div className="w-full max-w-md my-4">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1.5 font-bold uppercase tracking-wider font-mono">
            <span>Archive Integrity Check</span>
            <span className="text-cyan-400">{progressVal}%</span>
          </div>
          <div className="h-3 w-full bg-zinc-950/80 border border-zinc-800 rounded-sm overflow-hidden flex p-[2px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] rounded-2xs"
              style={{ width: `${progressVal}%` }}
            />
          </div>
        </div>
      );

    case "button":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`mt-6 flex ${className || "justify-start"}`}
        >
          <button
            onClick={() => onBtnClick(step.action)}
            className="px-8 py-3 bg-zinc-900 border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/20 rounded-md font-bold tracking-widest text-xs uppercase cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-98 transition-all font-mono"
          >
            {step.content}
          </button>
        </motion.div>
      );

    default:
      return null;
  }
}
