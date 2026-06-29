"use client";

import { useState, useEffect } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage1({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [matrix, setMatrix] = useState<string[]>([]);
  const [frozen, setFrozen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [showNote, setShowNote] = useState(false);
  
  const anomaly = "ℵ";

  useEffect(() => {
    // Generate rapid hex stream
    let interval: NodeJS.Timeout;
    if (!frozen) {
      interval = setInterval(() => {
        const chars = "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;':,./<>?";
        const newMatrix = Array.from({ length: 15 }, () => 
          Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        );
        setMatrix(newMatrix);
      }, 100);

      // Freeze after 4 seconds
      setTimeout(() => {
        clearInterval(interval);
        setFrozen(true);
        // Inject the anomaly
        const chars = "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;':,./<>?";
        const finalMatrix = Array.from({ length: 15 }, () => 
          Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        );
        
        // Randomly place anomaly
        const row = Math.floor(Math.random() * 15);
        const col = Math.floor(Math.random() * 40);
        finalMatrix[row] = finalMatrix[row].substring(0, col) + anomaly + finalMatrix[row].substring(col + 1);
        
        setMatrix(finalMatrix);
        setShowNote(true);
      }, 4000);
    }
    
    return () => clearInterval(interval);
  }, [frozen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === anomaly) {
      onLogRecovered("log-stage1", "Every integrity test failed for the same reason. SYBIL insisted one symbol never belonged to the archive. None of us could see it.");
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // screen shake/red flash length
      setInputValue("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }} className={error ? "glitch" : ""}>
      <div style={{ marginBottom: "1rem", minHeight: "60px" }}>
        {frozen && (
          <TypewriterText 
            text="Every integrity test failed for the same reason. SYBIL insisted one symbol never belonged to the archive. None of us could see it." 
            delay={30}
          />
        )}
      </div>
      
      <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
        <div style={{ 
          flex: 1, 
          background: "#000", 
          border: "1px solid var(--text-muted)", 
          padding: "1rem", 
          fontFamily: "var(--font-mono)", 
          fontSize: "0.85rem",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          color: frozen ? "var(--text-muted)" : "var(--text-primary)"
        }}>
          {frozen ? (
            // Render characters so the anomaly can be clicked
            matrix.join("\n").split("").map((char, idx) => (
              <span 
                key={idx} 
                onClick={() => {
                  if (char === anomaly) setInputValue(anomaly);
                }}
                style={{ cursor: char === anomaly ? "pointer" : "default" }}
              >
                {char}
              </span>
            ))
          ) : (
            matrix.join("\n")
          )}
        </div>

        {showNote && (
          <div style={{
            width: "200px",
            background: "#f4f1a1",
            color: "#333",
            padding: "1rem",
            transform: "rotate(2deg)",
            boxShadow: "2px 4px 10px rgba(0,0,0,0.5)",
            fontFamily: "'Comic Sans MS', cursive, sans-serif",
            fontSize: "0.9rem",
            alignSelf: "flex-start",
            animation: "fadein 1s"
          }}>
            <strong>Annotation:</strong><br/>
            Look closely. It's hiding in plain sight. It doesn't belong.<br/><br/>
            <em>(Find the strange symbol and type it, or just click it.)</em>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>INPUT_ANOMALY &gt;</span>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!frozen}
            autoFocus
            style={{ 
              flex: 1, 
              color: error ? "var(--text-alert)" : "var(--text-primary)",
              borderBottomColor: error ? "var(--text-alert)" : "var(--text-primary)"
            }}
          />
          <button type="submit" disabled={!frozen}>VERIFY</button>
        </form>
      </div>

      <style>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
