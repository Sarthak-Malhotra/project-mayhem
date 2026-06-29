"use client";

import { useEffect, useState } from "react";

export default function Sidebar({ logs, stage }: { logs: { id: string; text: string }[], stage: number }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Trigger pulse on stage change
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <section>
        <h3 style={{ borderBottom: "1px solid var(--text-muted)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-amber)", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Inventory
        </h3>
        <div style={{
          padding: "1rem",
          border: "1px dashed var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          transition: "all 0.3s ease",
          boxShadow: pulse ? "0 0 15px var(--text-primary) inset" : "none",
          borderColor: pulse ? "var(--text-primary)" : "var(--text-muted)"
        }}>
          <div style={{ 
            width: "30px", 
            height: "30px", 
            background: "var(--text-primary)", 
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            animation: pulse ? "blink 0.1s infinite" : "none"
          }}></div>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>The Artifact in Hand</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Resonates faintly.</div>
          </div>
        </div>
      </section>
      
      <section>
        <h3 style={{ borderBottom: "1px solid var(--text-muted)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-amber)", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Recovered Notes
        </h3>
        {logs.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>No notes recovered.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                background: "rgba(255, 176, 0, 0.1)",
                borderLeft: "3px solid var(--text-amber)",
                padding: "0.75rem",
                fontSize: "0.85rem",
                lineHeight: "1.4"
              }}>
                {log.text}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
