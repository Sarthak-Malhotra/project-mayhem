"use client";

import { useState } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage4({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const contradictions = ["date", "version", "deceased"];

  const handleReveal = (id: string) => {
    if (!found.includes(id)) {
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === 3) {
        setSuccess(true);
        setTimeout(() => {
          onLogRecovered("log-stage4", "False histories collapse under consistency. We fabricated the archive to hide what SYBIL really was.");
          onComplete();
        }, 4000);
      }
    }
  };

  const getStyle = (id: string) => {
    return found.includes(id) ? { 
      color: "var(--bg-color)", 
      background: "var(--text-alert)",
      textDecoration: "line-through",
      cursor: "default"
    } : {
      cursor: "pointer",
      textDecoration: "underline",
      textDecorationStyle: "dotted" as const
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "2rem" }}>
      <div style={{ minHeight: "40px", color: "var(--text-amber)" }}>
        <TypewriterText text="False histories collapse under consistency. Identify the three contradictions proving the archive is fabricated." delay={30} />
      </div>

      <div style={{
        background: "#ddd",
        color: "#111",
        padding: "2rem",
        fontFamily: "'Courier New', Courier, monospace",
        border: "3px solid #666",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
        position: "relative",
        filter: success ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "all 2s ease"
      }}>
        {success && <div className="glitch" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "3rem", color: "red", border: "5px solid red", padding: "1rem", fontWeight: "bold", zIndex: 10, background: "rgba(0,0,0,0.8)" }}>FABRICATION EXPOSED</div>}
        
        <h2 style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "1rem" }}>OFFICIAL RECORD: ARCHIVE 05</h2>
        <br/>
        <p><strong>SUBJECT:</strong> SYBIL Memory Engine Initialization</p>
        <p><strong>DATE OF RECORD:</strong> <span style={getStyle("date")} onClick={() => handleReveal("date")}>October 12, 1995</span></p>
        <p><strong>SYSTEM VERSION:</strong> <span style={getStyle("version")} onClick={() => handleReveal("version")}>SYBIL v.2026.4</span></p>
        <br/>
        <p>
          The initialization of the memory engine was successful. The core is stable and all sectors report normal activity.
          There have been zero reported anomalies during the bootstrap phase. The timeline synchronization algorithm is performing within expected parameters.
        </p>
        <br/>
        <p>
          It is imperative that all researchers maintain strict protocol. Any deviations must be reported directly to the lead supervisor.
        </p>
        <br/>
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>_________________________</p>
            <p>Dr. Elias Vance</p>
            <p>Lead Engineer <span style={getStyle("deceased")} onClick={() => handleReveal("deceased")}>(Deceased 1993)</span></p>
          </div>
          <div>
            <p>_________________________</p>
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
      
      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        CONTRADICTIONS FOUND: {found.length} / 3
      </div>
    </div>
  );
}
