"use client";

import { useState } from "react";

export default function Stage8({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    if (success) return;
    setSuccess(true);
    setTimeout(() => {
      onLogRecovered("log-stage8", "Reality survives because someone remembers.");
      onComplete();
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        .hidden-text::selection {
          background-color: var(--text-primary);
          color: var(--bg-color);
        }
        .hidden-text::-moz-selection {
          background-color: var(--text-primary);
          color: var(--bg-color);
        }
      `}</style>
      
      <div style={{
        background: "#fff", /* crisp document */
        width: "80%",
        height: "60%",
        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
        position: "relative",
        cursor: "text",
        padding: "3rem"
      }}>
        {success ? (
          <div className="glitch" style={{ color: "#000", fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginTop: "20%" }}>
            VERIFIED
          </div>
        ) : (
          <>
            <p style={{ color: "#f0f0f0", fontSize: "0.8rem", fontStyle: "italic", marginBottom: "2rem" }}>
              Faint white text is hidden here.
            </p>

            <div style={{ marginTop: "15%", textAlign: "center", lineHeight: "2" }}>
              <span className="hidden-text" style={{ color: "#fff", fontSize: "1.2rem", userSelect: "text" }}>
                The archive is compromised.
              </span>
              <br/>
              <span className="hidden-text" style={{ color: "#fff", fontSize: "1.2rem", userSelect: "text" }}>
                They wiped the core.
              </span>
              <br/><br/>
              <span 
                className="hidden-text" 
                style={{ 
                  color: "#fff", 
                  fontSize: "1.2rem", 
                  userSelect: "text",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onClick={handleClick}
              >
                [ Reality survives because someone remembers. ]
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
