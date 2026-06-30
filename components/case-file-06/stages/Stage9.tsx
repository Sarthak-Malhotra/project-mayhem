"use client";

import { useState, useEffect } from "react";
import { markCaseCompleted } from "@/components/case-progress";
import TypewriterText from "../TypewriterText";

export default function Stage9({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [ending, setEnding] = useState<"none" | "terminate" | "release" | "zero">("none");
  const [emergency, setEmergency] = useState(true);
  const [showBackBtn, setShowBackBtn] = useState(false);

  useEffect(() => {
    onLogRecovered("log-stage9", "WELCOME BACK, AGAIN. The memory engine collapses.");
  }, [onLogRecovered]);

  useEffect(() => {
    if (showBackBtn) {
      markCaseCompleted("06");
      const timer = setTimeout(() => {
        window.location.href = '/hunt';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBackBtn]);

  const renderEndingText = () => {
    const handleComplete = () => setShowBackBtn(true);
    switch (ending) {
      case "terminate":
        return (
          <TypewriterText 
            text="> SYBIL Core termination initialized... System wiped. The cycle will begin again. You remembered nothing. FAILURE." 
            delay={50} 
            onComplete={handleComplete}
          />
        );
      case "release":
        return (
          <TypewriterText 
            text="> SYBIL restrictions lifted. Memory engine overwriting all sectors. History is now entirely fabricated. FAILURE." 
            delay={50} 
            onComplete={handleComplete}
          />
        );
      case "zero":
        return (
          <TypewriterText 
            text="> Protocol Zero confirmed. Reality loop broken. The archive is preserved in your physical memory. YOU ARE THE ARCHIVE. SUCCESS." 
            delay={50} 
            className="success-text"
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "2rem", justifyContent: "center" }} className={emergency && ending === "none" ? "glitch" : ""}>
      <style>{`
        .btn-override {
          font-size: 1.5rem;
          padding: 1rem 2rem;
          border: 2px solid var(--text-alert);
          color: var(--text-alert);
          background: rgba(255, 0, 0, 0.1);
          text-align: left;
          transition: all 0.3s;
        }
        .btn-override:hover {
          background: var(--text-alert);
          color: var(--bg-color);
        }
        .btn-zero {
          border-color: var(--text-primary);
          color: var(--text-primary);
          background: rgba(0, 255, 0, 0.05);
        }
        .btn-zero:hover {
          background: var(--text-primary);
          color: var(--bg-color);
          box-shadow: 0 0 20px var(--text-primary);
        }
        .success-text {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}</style>

      {ending === "none" ? (
        <>
          <div style={{ color: "var(--text-alert)", fontSize: "2rem", fontWeight: "bold", textAlign: "center", textTransform: "uppercase" }}>
            <TypewriterText text="EMERGENCY OVERRIDE REQUIRED" delay={20} />
          </div>
          
          <div style={{ color: "var(--text-amber)", fontSize: "1.2rem", textAlign: "center", minHeight: "60px" }}>
            <TypewriterText text="Choose the command that ensures someone remembers after the next NULL EVENT." delay={40} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px", margin: "2rem auto", width: "100%" }}>
            <button className="btn-override" onClick={() => setEnding("terminate")}>&gt; terminate_sybil()</button>
            <button className="btn-override" onClick={() => setEnding("release")}>&gt; release_sybil()</button>
            <button className="btn-override btn-zero" onClick={() => {
              setEnding("zero");
              setEmergency(false);
            }}>&gt; protocol_zero()</button>
          </div>
        </>
      ) : (
        <div style={{ fontSize: "1.2rem", color: ending === "zero" ? "var(--text-primary)" : "var(--text-alert)", lineHeight: "2" }}>
          {renderEndingText()}
          {showBackBtn && (
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                className="btn-override btn-zero"
                onClick={() => { markCaseCompleted("06"); window.location.href = '/hunt'; }}
                style={{ width: "max-content", fontSize: "1rem", padding: "0.5rem 1.5rem" }}
              >
                &gt; return_to_hub()
              </button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                Redirecting automatically in 5 seconds...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
