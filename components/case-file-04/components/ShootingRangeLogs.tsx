"use client";

import React, { useState } from "react";
import { PuzzleProps } from "../types";

// --- Types ---
interface Packet {
  id: string;
  timestamp: string;
  sourceIP: string;
  destPort: number;
  protocol: string;
  sequence: number;
  flags: string;
  isAnomaly: boolean;
}

// --- Hardcoded Data aligned with Case File CF-04-AB-2903 ---
const LOG_DATA: Packet[] = [
  {
    id: "PKT-01",
    timestamp: "02:44:12.102",
    sourceIP: "10.17.4.12",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1017,
    flags: "SYN",
    isAnomaly: false,
  },
  {
    id: "PKT-02",
    timestamp: "02:44:12.119",
    sourceIP: "10.17.9.84",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1034,
    flags: "ACK",
    isAnomaly: false,
  },
  {
    id: "PKT-03",
    timestamp: "02:44:12.136",
    sourceIP: "10.17.2.19",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1051,
    flags: "ACK",
    isAnomaly: false,
  },
  {
    id: "PKT-04",
    timestamp: "02:44:12.153",
    sourceIP: "192.168.1.105",
    destPort: 443,
    protocol: "HTTPS",
    sequence: 9942,
    flags: "PUSH",
    isAnomaly: true,
  }, // The Intruder
  {
    id: "PKT-05",
    timestamp: "02:44:12.170",
    sourceIP: "10.17.5.33",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1068,
    flags: "ACK",
    isAnomaly: false,
  },
  {
    id: "PKT-06",
    timestamp: "02:44:12.187",
    sourceIP: "10.17.1.50",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1085,
    flags: "FIN",
    isAnomaly: false,
  },
  {
    id: "PKT-07",
    timestamp: "02:44:12.204",
    sourceIP: "10.17.8.11",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1102,
    flags: "ACK",
    isAnomaly: false,
  },
  {
    id: "PKT-08",
    timestamp: "02:44:12.221",
    sourceIP: "10.17.3.76",
    destPort: 8080,
    protocol: "TCP",
    sequence: 1119,
    flags: "ACK",
    isAnomaly: false,
  },
];

// Payload Mapping injected directly into DOM for netrunner inspection loops
const HIDDEN_PAYLOAD_MAP = {
  "PKT-01": "CAROUSEL",
  "PKT-02": "TICKET_STUB",
  "PKT-03": "COTTON_CANDY",
  "PKT-04": "INTRUDER_17", // Malicious payload signature
  "PKT-05": "FERRIS_WHEEL",
  "PKT-06": "FUN_HOUSE",
  "PKT-07": "POPCORN_STAND",
  "PKT-08": "MIRROR_MAZE",
};

const PROGRESSIVE_HINTS = [
  "The sign above you isn’t decoration. Read it.",
  "All but one packet carry the carnival’s signature rhythm. Look at the Sequence numbers and subnets (10.17.x.x).",
  "The cards only show the headers. The payload is carried elsewhere on the page's HTML structure.",
  "Open your Browser Developer Tools (F12 / Right Click -> Inspect), check the Elements panel, and find the script block with ID 'hidden-payloads' to reveal the raw string maps!",
];

export default function ShootingRangeLogsPuzzle({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showSourceHint, setShowSourceHint] = useState<boolean>(false);
  const [answerInput, setAnswerInput] = useState<string>("");
  const [statusState, setStatusState] = useState<"IDLE" | "SUCCESS" | "FAIL">("IDLE");
  const [devToolsOpened, setDevToolsOpened] = useState<boolean>(false);

  // Sound placeholders mapped natively from requirements specification
  const playSound = (hookName: string) => {
    console.log(`[Audio Engine Triggered]: ${hookName}`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(hookName));
    }
  };

  const handleTargetSelect = (pkt: Packet) => {
    if (disabled) return;
    setSelectedPacket(pkt);
    playSound("onTargetClick");
  };

  const triggerSourceHintToggle = () => {
    if (disabled) return;
    setShowSourceHint(true);
    setDevToolsOpened(true); // Triggers faint neon tracking lines on anomaly target
    playSound("onSourceHint");
  };

  const verifyPuzzleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (answerInput.trim().toUpperCase() === "INTRUDER_17") {
      setStatusState("SUCCESS");
      playSound("onCorrect");
      if (onSolved) {
        onSolved();
      }
    } else {
      setStatusState("FAIL");
      playSound("onFail");
      if (onFailed) {
        onFailed();
      }
      setTimeout(() => setStatusState("IDLE"), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-4 md:p-8 font-mono select-none relative overflow-x-hidden">
      {/* Hidden JSON Script Metadata Injection Point for DevTools netrunner evaluation loops */}
      <script
        id="hidden-payloads"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HIDDEN_PAYLOAD_MAP, null, 2),
        }}
      />

      {/* Background Aesthetic Ambient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.3)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Header Panel */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center border-b border-purple-900/40 pb-4 mb-6 z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-purple-400 bg-clip-text">
            CRIMSON CARNIVAL // SEC-SEC-LOGS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            FILE PROFILE: CF-04-AB-2903 // LEVEL_02
          </p>
        </div>
        <div className="mt-2 sm:mt-0 text-right">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            NODE STABILIZATION LOOP: RETRIEVING
          </span>
        </div>
      </header>

      {/* Cryptic Hanging Sign Glitch Grid */}
      <section className="w-full max-w-4xl text-center mb-8 z-10">
        <div className="bg-red-950/30 border-2 border-dashed border-red-600/50 rounded-lg p-4 md:p-6 shadow-[0_0_25px_rgba(220,38,38,0.05)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <h2 className="text-red-500 font-extrabold text-sm md:text-lg tracking-widest uppercase animate-pulse select-text">
            “The good ones breathe in steps of SEVENTEEN. The intruder forgets the
            rhythm.”
          </h2>
          <p className="text-[10px] text-zinc-500 mt-2 tracking-tight uppercase">
            System Analysis Note: The terminal verifies tracking configuration, not
            bullet accuracy.
          </p>
        </div>
      </section>

      {/* Interactive Gallery Targets Row Grid Layout */}
      <section className="w-full max-w-6xl bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 mb-8 backdrop-blur-sm shadow-inner relative z-10">
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-t-xl" />
        <h3 className="text-xs text-zinc-400 mb-6 uppercase tracking-widest text-center border-b border-zinc-800 pb-2">
          LOG TRACK SELECTION GALLERYPLATES (8 UNITS DETECTED)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center justify-center">
          {LOG_DATA.map((pkt, index) => (
            <div
              key={pkt.id}
              onClick={() => handleTargetSelect(pkt)}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 relative group p-2 rounded-lg bg-zinc-950/20 hover:bg-purple-950/10 border ${
                selectedPacket?.id === pkt.id
                  ? "border-purple-500 bg-purple-950/20 scale-105"
                  : "border-transparent"
              } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              {/* Target Circular Plate Plate Vector Component Design representation */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 relative transition-transform duration-500 group-hover:rotate-12 ${
                  pkt.isAnomaly && devToolsOpened
                    ? "border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.4)] animate-pulse"
                    : "border-zinc-700 bg-zinc-800/40 group-hover:border-purple-600/50"
                }`}
              >
                {/* Visual Bullet Holes decoration */}
                <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-zinc-950 border border-zinc-800" />
                <div className="absolute bottom-4 right-3 w-1.5 h-1.5 rounded-full bg-zinc-950 border border-zinc-700" />
                <div className="w-8 h-8 rounded-full border border-dashed border-zinc-600/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-zinc-500 group-hover:text-purple-400 transition-colors">
                    0{index + 1}
                  </span>
                </div>
              </div>

              {/* Target ID Identifier Label Tag */}
              <div className="mt-3 text-center">
                <span className="text-[11px] font-bold tracking-wider text-zinc-400 group-hover:text-zinc-200">
                  {pkt.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Modal Zoom Inspection Card Deck Panel Overlay */}
      <section className="w-full max-w-4xl min-h-[180px] bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 md:p-6 mb-8 transition-all duration-300 relative z-10 flex flex-col justify-center items-center">
        {selectedPacket ? (
          <div className="w-full max-w-2xl bg-zinc-950 border border-purple-900/50 rounded-lg p-5 relative shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-2 right-3 text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              EXPANDED CAPTURE
            </div>
            <h4 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 mb-4 flex justify-between items-center">
              <span>HEADER DUMP: {selectedPacket.id}</span>
              <span
                className={`text-[10px] ${
                  selectedPacket.isAnomaly
                    ? "text-pink-400 animate-pulse"
                    : "text-zinc-600"
                }`}
              >
                {selectedPacket.isAnomaly
                  ? "FLAGGED TRAFFIC ANOMALY"
                  : "STABLE CARNIVAL SYSTEM LOG"}
              </span>
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs md:text-sm">
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  Timestamp:
                </span>{" "}
                <span className="text-zinc-300 font-bold ml-1">
                  {selectedPacket.timestamp}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  Source IP:
                </span>{" "}
                <span className="text-zinc-300 font-bold ml-1">
                  {selectedPacket.sourceIP}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  Dest Port:
                </span>{" "}
                <span className="text-zinc-300 font-bold ml-1">
                  {selectedPacket.destPort}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  Protocol:
                </span>{" "}
                <span className="text-zinc-300 font-bold ml-1">
                  {selectedPacket.protocol}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  Seq Number:
                </span>{" "}
                <span className="text-purple-400 font-bold ml-1">
                  {selectedPacket.sequence}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase text-[11px]">
                  TCP Flags:
                </span>{" "}
                <span className="text-zinc-300 font-bold ml-1">
                  {selectedPacket.flags}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-500 py-8">
            <p className="text-xs uppercase tracking-widest">
              Select a shooting target from the shelf above to verify headers
            </p>
          </div>
        )}
      </section>

      {/* Bottom Control Actions & Hint Systems Canvas */}
      <section className="w-full max-w-4xl bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 mb-8 backdrop-blur-sm relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hints Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-purple-400 uppercase">
              HINT SYSTEM SYSTEM_DECRYPT
            </h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded p-4 min-h-[80px] flex items-center justify-center text-center">
              <p className="text-xs text-zinc-400 leading-relaxed">
                {PROGRESSIVE_HINTS[hintIndex]}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setHintIndex((prev) => (prev + 1) % PROGRESSIVE_HINTS.length)
                }
                disabled={disabled}
                className="px-3 py-1.5 bg-purple-950/50 hover:bg-purple-900/50 border border-purple-800 text-[11px] font-bold text-purple-300 rounded transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT HINT
              </button>
              {!showSourceHint && (
                <button
                  onClick={triggerSourceHintToggle}
                  disabled={disabled}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-[11px] font-bold text-zinc-300 rounded transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  DECRYPT SIGNATURES
                </button>
              )}
            </div>
          </div>

          {/* Submission Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-purple-400 uppercase">
              SUBMIT ANOMALOUS PAYLOAD SIGNATURE
            </h3>
            <form onSubmit={verifyPuzzleAnswer} className="space-y-3">
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                disabled={statusState === "SUCCESS" || disabled}
                placeholder="Enter payload signature (e.g. INTRUDER_XX)"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded p-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={statusState === "SUCCESS" || disabled}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ANALYZE & SUBMIT
              </button>
            </form>

            {/* Status Feedback */}
            {statusState === "SUCCESS" && (
              <div className="bg-emerald-950/30 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded text-center animate-bounce">
                [SUCCESS] Malicious payload verified! Sector secured.
              </div>
            )}
            {statusState === "FAIL" && (
              <div className="bg-red-950/30 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center animate-pulse">
                [ACCESS DENIED] Incorrect signature match. Try again.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Decorative Canvas Footer elements metrics block */}
      <footer className="w-full max-w-6xl border-t border-zinc-900 pt-4 mt-auto text-center z-10">
        <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
          Crimson Carnival Internal Subsystem Terminal Grid V1.8.4 // SECURITY LEVEL CLEARANCE DETECTED
        </p>
      </footer>
    </main>
  );
}
