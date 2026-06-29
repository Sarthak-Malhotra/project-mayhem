"use client";

import { useState } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage6({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [activeFrame, setActiveFrame] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // The shifting dot positions across 4 frames
  const anomalyPositions = [
    { top: "30%", left: "25%" },
    { top: "45%", left: "40%" },
    { top: "60%", left: "55%" },
    { top: "75%", left: "70%" }
  ];

  const handleAnomalyClick = () => {
    if (success) return;
    setSuccess(true);
    setTimeout(() => {
      onLogRecovered("log-stage6", "We spent weeks looking for what appeared. We should have been looking for what moved.");
      onComplete();
    }, 3000);
  };

  const handleWrongClick = () => {
    if (success) return;
    setError(true);
    setTimeout(() => setError(false), 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }} className={error ? "glitch" : ""}>
      <div style={{ minHeight: "40px", color: "var(--text-amber)" }}>
        <TypewriterText text="We spent weeks looking for what appeared. We should have been looking for what moved." delay={30} />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {[0, 1, 2, 3].map(frame => (
          <button 
            key={frame}
            onClick={() => setActiveFrame(frame)}
            style={{ 
              flex: 1, 
              background: activeFrame === frame ? "var(--text-primary)" : "transparent",
              color: activeFrame === frame ? "var(--bg-color)" : "var(--text-primary)",
              borderBottom: activeFrame === frame ? "none" : "1px solid var(--text-primary)"
            }}
          >
            CAM_0{frame + 1}
          </button>
        ))}
      </div>

      <div 
        onClick={handleWrongClick}
        style={{ 
          flex: 1, 
          border: "2px solid var(--text-muted)", 
          position: "relative",
          background: "repeating-linear-gradient( 45deg, #111, #111 10px, #1a1a1a 10px, #1a1a1a 20px )",
          overflow: "hidden"
        }}
      >
        {success && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "2rem", color: "var(--text-primary)", background: "var(--bg-color)", padding: "1rem", border: "2px solid var(--text-primary)", zIndex: 10 }}>
            SUBJECT ISOLATED
          </div>
        )}

        {/* Static background elements (furniture, machines, walls) that don't move */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "100px", height: "50px", border: "1px solid #444", background: "#222" }}></div>
        <div style={{ position: "absolute", top: "70%", left: "80%", width: "40px", height: "100px", border: "1px solid #444", background: "#222" }}></div>
        <div style={{ position: "absolute", top: "40%", left: "50%", width: "80px", height: "80px", border: "1px dashed #444", borderRadius: "50%" }}></div>

        {/* The shifting anomaly */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            handleAnomalyClick();
          }}
          style={{
            position: "absolute",
            top: anomalyPositions[activeFrame].top,
            left: anomalyPositions[activeFrame].left,
            width: "8px",
            height: "8px",
            background: success ? "var(--text-primary)" : "rgba(255, 255, 255, 0.4)",
            boxShadow: success ? "0 0 10px var(--text-primary)" : "none",
            cursor: "crosshair",
            transition: "all 0.1s"
          }}
        ></div>
      </div>
    </div>
  );
}
