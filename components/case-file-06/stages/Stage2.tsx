"use client";

import { useState } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage2({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  
  // State 0: Q1
  // State 1: Q2
  // State 2: Q3
  
  const questions = [
    "State your designation from the previous cycle.",
    "How many resets have you survived?",
    "Why is your memory incomplete?"
  ];

  const options: { text: string, path?: string, req?: string }[][] = [
    [
      { text: "Researcher Alpha", path: "alpha" },
      { text: "Subject 4", path: "subject" },
      { text: "First Cycle (No Previous Designation)", path: "first" }
    ],
    [
      { text: "Too many to count.", req: "alpha" },
      { text: "Exactly four.", req: "subject" },
      { text: "0 resets survived.", req: "first" },
      { text: "I don't remember.", req: "none" }
    ],
    [
      { text: "The archive corrupted it.", req: "alpha" },
      { text: "They wiped it.", req: "subject" },
      { text: "It is not incomplete. I just arrived.", req: "first" }
    ]
  ];

  const [pathChosen, setPathChosen] = useState("");

  const handleOption = (req: string, path?: string) => {
    if (step === 0) {
      setPathChosen(path || "");
      setStep(1);
    } else {
      if (req !== pathChosen && req !== "none") {
        setError("INCONSISTENCY DETECTED. MEMORY FAULT.");
        setTimeout(() => {
          setError("");
          setStep(0);
          setPathChosen("");
        }, 2000);
      } else {
        if (step === 2) {
          onLogRecovered("log-stage2", "The loops never stop. Consistency is the only way through.");
          onComplete();
        } else {
          setStep(step + 1);
        }
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "2rem" }}>
      {error ? (
        <div className="glitch" style={{ color: "var(--text-alert)", fontSize: "2rem", marginTop: "2rem" }}>
          {error}
        </div>
      ) : (
        <>
          <div style={{ minHeight: "80px", fontSize: "1.2rem", color: "var(--text-amber)" }}>
            <TypewriterText text={questions[step]} delay={40} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            {options[step].map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOption(opt.req || "", opt.path)}
                style={{ textAlign: "left", padding: "1rem" }}
              >
                &gt; {opt.text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
