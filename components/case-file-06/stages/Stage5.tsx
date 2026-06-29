"use client";

import { useState } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage5({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [assembled, setAssembled] = useState<number[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const fragments = [
    { id: 0, text: "The machine wasn't built" },
    { id: 1, text: " to simulate the future." },
    { id: 2, text: " It was built to" },
    { id: 3, text: " overwrite the past." },
    { id: 4, text: " Once we realized" },
    { id: 5, text: " this, we tried to" },
    { id: 6, text: " unplug it. But" },
    { id: 7, text: " it had already rewritten us." }
  ];

  // Randomize positions on screen
  const [positions] = useState(() => 
    fragments.map(() => ({
      top: 20 + Math.random() * 60 + "%",
      left: 10 + Math.random() * 70 + "%"
    }))
  );

  const handleFragmentClick = (id: number) => {
    if (assembled.includes(id) || success) return;
    
    const newAssembled = [...assembled, id];
    
    // Check if it's correct so far
    const isCorrectSoFar = newAssembled.every((val, index) => val === index);
    
    if (!isCorrectSoFar) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setAssembled([]);
      }, 500);
    } else {
      setAssembled(newAssembled);
      if (newAssembled.length === fragments.length) {
        setSuccess(true);
        setTimeout(() => {
          onLogRecovered("log-stage5", "History only exists once the fragments agree.");
          onComplete();
        }, 3000);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }} className={error ? "glitch" : ""}>
      <div style={{ minHeight: "40px", color: "var(--text-amber)" }}>
        <TypewriterText text="History only exists once the fragments agree. Click them in the correct narrative order." delay={30} />
      </div>

      <div style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid var(--text-primary)",
        minHeight: "100px",
        padding: "1rem",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        color: success ? "var(--bg-color)" : "var(--text-primary)",
        backgroundColor: success ? "var(--text-primary)" : "transparent",
        transition: "all 1s"
      }}>
        {assembled.length === 0 && !success && (
          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Assemble the truth...</span>
        )}
        {error && assembled.length > 0 && (
          <span style={{ color: "var(--text-alert)", fontWeight: "bold", width: "100%" }}>INCORRECT SEQUENCE DETECTED. RESETTING...</span>
        )}
        {!error && assembled.map(id => (
          <span key={`asm-${id}`} style={{ marginRight: "4px" }}>
            {fragments.find(f => f.id === id)?.text}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, position: "relative", border: "1px dashed var(--text-muted)", marginTop: "1rem", overflow: "hidden", minHeight: "400px" }}>
        {!success && fragments.map((f, i) => {
          const isUsed = assembled.includes(f.id);
          return (
            <button
              key={f.id}
              onClick={() => handleFragmentClick(f.id)}
              style={{
                position: "absolute",
                top: positions[i].top,
                left: positions[i].left,
                opacity: isUsed ? 0 : 1,
                pointerEvents: isUsed ? "none" : "auto",
                background: "#222",
                border: "1px solid var(--text-muted)",
                padding: "0.5rem",
                cursor: "pointer",
                transition: "opacity 0.3s",
                zIndex: 10
              }}
            >
              {f.text.trim()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
