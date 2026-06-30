"use client";

import { useState } from "react";
import TypewriterText from "../TypewriterText";

export default function Stage3({ onComplete, onLogRecovered }: { onComplete: () => void, onLogRecovered: (id: string, text: string) => void }) {
  const [logs, setLogs] = useState([
    { id: 4, text: "[14:02] Containment protocol initiated. Sector 4 sealed." },
    { id: 1, text: "[08:00] SYBIL Core online. Memory engine initialized." },
    { id: 5, text: "[16:00] System restart. Cycle 2 begins." },
    { id: 3, text: "[13:45] The Incident. Data breach across all sectors." },
    { id: 2, text: "[10:15] First anomalies detected in memory archive." },
  ]);

  const [success, setSuccess] = useState(false);

  const moveLog = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= logs.length) return;
    const newLogs = [...logs];
    const temp = newLogs[index];
    newLogs[index] = newLogs[index + direction];
    newLogs[index + direction] = temp;
    setLogs(newLogs);
    checkOrder(newLogs);
  };

  const checkOrder = (currentLogs: typeof logs) => {
    const isOrdered = currentLogs.every((log, i) => log.id === i + 1);
    if (isOrdered) {
      setSuccess(true);
      setTimeout(() => {
        onLogRecovered("log-stage3", "The timeline records events in the order they truly occurred, not the order anyone remembers them.");
        onComplete();
      }, 3000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "2rem" }}>
      <div style={{ minHeight: "60px", color: "var(--text-amber)" }}>
        <TypewriterText text="The timeline records events in the order they truly occurred, not the order anyone remembers them." delay={30} />
      </div>

      {success ? (
        <div className="glitch" style={{ color: "var(--text-primary)", fontSize: "2rem", textAlign: "center", marginTop: "4rem" }}>
          TIMELINE SYNCHRONIZED
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {logs.map((log, i) => (
            <div key={log.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "rgba(51, 255, 51, 0.1)",
              border: "1px solid var(--text-primary)",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button 
                  onClick={() => moveLog(i, -1)} 
                  disabled={i === 0}
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                >▲</button>
                <button 
                  onClick={() => moveLog(i, 1)} 
                  disabled={i === logs.length - 1}
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                >▼</button>
              </div>
              <div style={{ flex: 1, fontFamily: "var(--font-mono)" }}>
                {log.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
