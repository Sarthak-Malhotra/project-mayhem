"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { getApps, initializeApp, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { PuzzleProps } from "../types";

// ── FIREBASE CONFIGURATION ──
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DB_ID || "ai-studio-9e71cb0f-bd4b-4e61-98ec-bb0abdd53047");

interface Piece {
  id: number;
  dataUrl: string;
}

interface LeaderboardEntry {
  teamName: string;
  secondsTaken: number;
}

// ── AUDIO BEEP GENERATOR ──
const playBeep = (freq = 600, duration = 0.08) => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Audio context initialization blocked or failed
  }
};

// ── FORMAT TIME ──
const formatTime = (totalSecs: number): string => {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// ── TICKET VECTOR GENERATION ──
const generateTicketImage = async (): Promise<string> => {
  if (typeof window === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  // Generate QR Code as data URL
  const qrDataUrl = await QRCode.toDataURL("CAN YOU SEE ME?", {
    version: 1,
    width: 220,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });

  // Load QR image
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.src = qrDataUrl;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

  // Background Gradient
  const bgGrad = ctx.createRadialGradient(250, 250, 50, 250, 250, 350);
  bgGrad.addColorStop(0, "#50090e");
  bgGrad.addColorStop(1, "#1b0204");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 500, 500);

  // Borders
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#dbac49";
  ctx.strokeRect(15, 15, 470, 470);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(219, 172, 73, 0.4)";
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(23, 23, 454, 454);
  ctx.setLineDash([]);

  // Stars
  const drawCornerStar = (cx: number, cy: number) => {
    ctx.fillStyle = "#dbac49";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? 8 : 3;
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
  };
  drawCornerStar(35, 35);
  drawCornerStar(465, 35);
  drawCornerStar(35, 465);
  drawCornerStar(465, 465);

  // Scallops
  const drawNotch = (cx: number, cy: number, r: number) => {
    ctx.fillStyle = "#0A0A0A";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#dbac49";
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
    ctx.stroke();
  };
  drawNotch(15, 250, 18);
  drawNotch(485, 250, 18);
  drawNotch(250, 15, 18);
  drawNotch(250, 485, 18);

  // Header Title
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 4;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffe4a0";
  ctx.font = "bold 36px serif";
  ctx.fillText("THE CARNIVAL", 250, 72);

  ctx.strokeStyle = "#dbac49";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 96);
  ctx.bezierCurveTo(200, 102, 300, 102, 350, 96);
  ctx.stroke();

  ctx.fillStyle = '#dbac49';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('• ADMIT ONE GUEST •', 250, 116);

  // QR Frame and Image
  ctx.fillStyle = "#dbac49";
  ctx.fillRect(136, 136, 228, 228);
  ctx.fillStyle = "#fcfcf0";
  ctx.fillRect(140, 140, 220, 220);
  ctx.drawImage(qrImg, 140, 140, 220, 220);

  // Footer text
  ctx.fillStyle = "#ffe4a0";
  ctx.font = "11px monospace";
  ctx.fillText("S E R I A L   N o .   0 6 - 2 3 - 2 0 2 6", 250, 395);

  ctx.fillStyle = "#dbac49";
  ctx.font = "italic 15px Georgia, serif";
  ctx.fillText("“A ticket for those who seek the unseen.”", 250, 422);

  ctx.fillStyle = "#7a1921";
  ctx.font = "bold 12px monospace";
  ctx.fillText("VOID IF TORN OR SEPARATED", 250, 452);

  // Fold creases
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(219, 172, 73, 0.15)";
  ctx.beginPath();
  ctx.moveTo(15, 120);
  ctx.lineTo(485, 380);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(15, 380);
  ctx.lineTo(485, 120);
  ctx.stroke();

  return canvas.toDataURL("image/png");
};

export default function BrokenTicket({
  onSolved,
  onFailed,
  disabled = false,
}: PuzzleProps) {
  const [stage, setStage] = useState<"searching" | "puzzle" | "scanning" | "victory">("searching");
  const [teamName, setTeamName] = useState<string>("");
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [ticketFullImage, setTicketFullImage] = useState<string | null>(null);

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [board, setBoard] = useState<(number | null)[]>(Array(25).fill(null));
  const [tray, setTray] = useState<number[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [selectedBoardIndex, setSelectedBoardIndex] = useState<number | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);
  const [loadingPuzzle, setLoadingPuzzle] = useState<boolean>(false);

  const [searchError, setSearchError] = useState<string | null>(null);
  const [puzzleError, setPuzzleError] = useState<string | null>(null);
  const [scanningError, setScanningError] = useState<string | null>(null);
  const [wordInput, setWordInput] = useState<string>("");

  // ── TIMER RUNTIME EFFECT ──
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if ((stage === "puzzle" || stage === "scanning") && !disabled) {
      timerInterval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [stage, disabled]);

  // ── PUZZLE INITIALIZATION EFFECT ──
  useEffect(() => {
    if (stage === "puzzle" && pieces.length === 0) {
      setLoadingPuzzle(true);
      generateTicketImage()
        .then((imgUrl) => {
          setTicketFullImage(imgUrl);
          const img = new window.Image();
          img.src = imgUrl;
          img.onload = () => {
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = 100;
            sliceCanvas.height = 100;
            const sctx = sliceCanvas.getContext("2d");
            if (!sctx) {
              setLoadingPuzzle(false);
              return;
            }

            const generatedPieces: Piece[] = [];
            for (let r = 0; r < 5; r++) {
              for (let c = 0; c < 5; c++) {
                const pid = r * 5 + c;
                sctx.clearRect(0, 0, 100, 100);
                sctx.drawImage(img, c * 100, r * 100, 100, 100, 0, 0, 100, 100);
                generatedPieces.push({
                  id: pid,
                  dataUrl: sliceCanvas.toDataURL("image/png"),
                });
              }
            }
            setPieces(generatedPieces);

            const idxArr = Array.from({ length: 25 }, (_, i) => i);
            idxArr.sort(() => Math.random() - 0.5);
            setTray(idxArr);
            setBoard(Array(25).fill(null));
            setSelectedPieceId(null);
            setSelectedBoardIndex(null);
            setLoadingPuzzle(false);
          };
        })
        .catch((err) => {
          console.error("Failed to generate ticket:", err);
          setLoadingPuzzle(false);
        });
    }
  }, [stage, pieces.length]);

  // ── AUTO-SOLVED DETECTOR ──
  useEffect(() => {
    if (stage === "puzzle" && board.length === 25 && board.every((val, idx) => val === idx)) {
      const timer = setTimeout(() => {
        setStage("scanning");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [board, stage]);

  // ── AUTO-DISMISS PUZZLE ERROR EFFECT ──
  useEffect(() => {
    if (puzzleError) {
      const timer = setTimeout(() => {
        setPuzzleError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [puzzleError]);

  // ── SAVE & LOAD FIRESTORE LEADERBOARD ──
  const saveTeamScore = async (team: string, duration: number) => {
    try {
      await addDoc(collection(db, "leaderboard"), {
        teamName: team,
        secondsTaken: duration,
        solvedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Firebase save failed:", err);
    }
  };

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const q = query(
        collection(db, "leaderboard"),
        orderBy("secondsTaken", "asc"),
        limit(30)
      );
      const snapshot = await getDocs(q);
      const entries: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          teamName: data.teamName || "Anonymous Team",
          secondsTaken: Number(data.secondsTaken) || 0,
        });
      });
      setLeaderboard(entries);
    } catch (err) {
      console.error("Firebase load failed:", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // ── CLICKS & ACTIONS ──
  const handleStartInfiltration = () => {
    if (disabled) return;
    if (!teamName.trim()) {
      setSearchError("Please enter a team name to continue.");
      return;
    }
    setSearchError(null);
    setSecondsElapsed(0);
    setStage("puzzle");
  };

  const handleTrayClick = (id: number) => {
    if (disabled) return;
    playBeep(550);
    setSelectedPieceId((prev) => (prev === id ? null : id));
    setSelectedBoardIndex(null);
  };

  const handleBoardClick = (index: number) => {
    if (disabled) return;
    playBeep(500);

    // Place from Tray to empty Board cell
    if (selectedPieceId !== null && board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = selectedPieceId;
      setBoard(newBoard);
      setTray((prev) => prev.filter((id) => id !== selectedPieceId));
      setSelectedPieceId(null);
      return;
    }

    // Move Board piece to another empty Board cell
    if (selectedBoardIndex !== null && board[index] === null) {
      const moveId = board[selectedBoardIndex];
      if (moveId !== null) {
        const newBoard = [...board];
        newBoard[index] = moveId;
        newBoard[selectedBoardIndex] = null;
        setBoard(newBoard);
        setSelectedBoardIndex(null);
      }
      return;
    }

    // Select Board piece
    if (board[index] !== null) {
      if (selectedBoardIndex === index) {
        setSelectedBoardIndex(null);
      } else {
        setSelectedBoardIndex(index);
        setSelectedPieceId(null);
      }
    }
  };

  const handleReturnToTray = () => {
    if (disabled) return;
    if (selectedBoardIndex === null) return;
    const pid = board[selectedBoardIndex];
    if (pid === null) return;

    playBeep(450);
    const newBoard = [...board];
    newBoard[selectedBoardIndex] = null;
    setBoard(newBoard);

    setTray((prev) => [...prev, pid].sort((a, b) => a - b));
    setSelectedBoardIndex(null);
  };

  const handleReset = () => {
    if (disabled) return;
    playBeep(400);
    const idxArr = Array.from({ length: 25 }, (_, i) => i);
    idxArr.sort(() => Math.random() - 0.5);
    setTray(idxArr);
    setBoard(Array(25).fill(null));
    setSelectedPieceId(null);
    setSelectedBoardIndex(null);
    setPuzzleError(null);
  };

  const handleQuickSolve = () => {
    if (disabled) return;
    playBeep(700);
    setBoard(Array.from({ length: 25 }, (_, i) => i));
    setTray([]);
    setSelectedPieceId(null);
    setSelectedBoardIndex(null);
    setPuzzleError(null);
    setTimeout(() => {
      setStage("scanning");
    }, 400);
  };

  const handleSubmitPuzzle = () => {
    if (disabled) return;
    const correctCount = board.filter((id, i) => id === i).length;
    if (correctCount === 25) {
      playBeep(900, 0.15);
      setStage("scanning");
    } else {
      playBeep(250, 0.25);
      const placedCount = board.filter((b) => b !== null).length;
      if (placedCount < 25) {
        setPuzzleError(
          `Please place all 25 pieces on the board first (${placedCount}/25 placed).`
        );
      } else {
        setPuzzleError(
          "The ticket fibers are still misaligned. Swap pieces to match the pattern correctly!"
        );
      }
    }
  };

  const handleVerifyAnswer = async () => {
    if (disabled) return;
    const val = wordInput.trim().toUpperCase();
    const cleanInput = val.replace(/[?.,!"]/g, "").replace(/\s+/g, "");
    const cleanSecret = "CANYOUSEEME";

    if (cleanInput === cleanSecret) {
      playBeep(900, 0.2);
      setStage("victory");
      await saveTeamScore(teamName, secondsElapsed);
      await loadLeaderboard();
      if (onSolved) {
        onSolved();
      }
    } else {
      playBeep(250, 0.25);
      setScanningError("The security sequence rejected your verification key.");
      if (onFailed) {
        onFailed();
      }
    }
  };

  const handleRestart = () => {
    if (disabled) return;
    playBeep(350);
    setTeamName("");
    setWordInput("");
    setSearchError(null);
    setScanningError(null);
    setPuzzleError(null);
    setSecondsElapsed(0);
    setBoard(Array(25).fill(null));
    setTray([]);
    setPieces([]);
    setStage("searching");
  };

  const correctCount = board.filter((id, i) => id === i).length;

  return (
    <div className="broken-ticket-container min-h-screen text-[#F5F5F5] flex flex-col justify-start selection:bg-red-950 selection:text-red-200 relative overflow-hidden w-full select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap");
        .broken-ticket-container {
          font-family: "Inter", sans-serif;
          background-color: #0a0a0a;
        }
        .broken-ticket-container .font-mono {
          font-family: "JetBrains Mono", monospace !important;
        }
      `,
        }}
      />

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.06)_0%,transparent_60%)] pointer-events-none z-0"></div>

      {/* Top Header Navigation */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-20 w-full bg-zinc-950/80 backdrop-blur-sm relative">
        <div className="text-xs tracking-[0.25em] uppercase font-bold text-red-500">
          BROKEN TICKET
        </div>

        {/* Stopwatch Countdown timer on the top right */}
        {stage !== "searching" && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:inline">
              CYCLE DURATION:
            </span>
            <div className="text-xs font-mono font-bold bg-red-950/45 px-3 py-1.5 border border-red-900/30 text-red-400 rounded-sm">
              ⏰ {formatTime(secondsElapsed)}
            </div>
          </div>
        )}
      </nav>

      {/* Main Game Context Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10 relative">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* STAGE 1: SEARCHING / TEAM REGISTRATION */}
          {stage === "searching" && (
            <div className="w-full max-w-md bg-zinc-950/40 border border-white/5 p-6 sm:p-8 rounded">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                  CHALLENGE GATES
                </h1>
                <p className="text-xs text-white/40 font-mono tracking-wider uppercase mt-1">
                  Assemble the ticket to decrypt the passphrase
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/40 block mb-1.5 font-bold">
                    Team Identifier Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleStartInfiltration();
                    }}
                    className="w-full bg-zinc-900/60 border border-white/10 rounded px-3 py-2.5 text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-red-500 text-white transition-colors placeholder:text-white/10 disabled:opacity-50"
                    placeholder="ENTER TEAM NAME"
                    maxLength={24}
                  />
                </div>

                {searchError && (
                  <div className="flex items-center gap-2 text-rose-400 bg-red-950/40 border border-red-900/60 p-3 rounded text-[11px] font-mono">
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    <span>{searchError}</span>
                  </div>
                )}

                <button
                  onClick={handleStartInfiltration}
                  disabled={disabled}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 font-mono text-xs uppercase tracking-widest font-black text-white rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/30 disabled:opacity-50"
                >
                  BEGIN INFILTRATION
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: TICKET PUZZLE */}
          {stage === "puzzle" && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                  Assemble Scrambled Fragments
                </h2>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  No margins, no guide frames — align fibers to assemble the passkey
                </p>
              </div>

              {loadingPuzzle ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-3"></div>
                  <p className="font-mono text-[9px] text-red-500 uppercase tracking-widest animate-pulse">
                    Slicing Fibers...
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {/* Mini Row */}
                  <div className="flex items-center justify-between gap-4 bg-zinc-950 border border-white/5 px-2.5 py-1.5 rounded text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40">PLACED:</span>
                      <span className="text-red-500 font-bold">
                        {correctCount}/25
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {selectedBoardIndex !== null && (
                        <button
                          onClick={handleReturnToTray}
                          disabled={disabled}
                          className="px-2 py-0.5 bg-red-950 border border-red-900/50 hover:bg-red-900 text-rose-200 text-[9px] rounded cursor-pointer disabled:opacity-50"
                        >
                          Return
                        </button>
                      )}
                      <button
                        onClick={handleReset}
                        disabled={disabled}
                        className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white/50 hover:text-white rounded text-[9px] cursor-pointer disabled:opacity-50"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleQuickSolve}
                        disabled={disabled}
                        className="flex items-center gap-1 px-2 py-0.5 bg-red-950 border border-red-900 text-white text-[9px] rounded cursor-pointer disabled:opacity-50"
                      >
                        ✨ Solve
                      </button>
                    </div>
                  </div>

                  {/* Main Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
                    {/* Grid Board */}
                    <div className="md:col-span-7 flex flex-col items-center">
                      <div className="grid grid-cols-5 gap-[1px] bg-zinc-900 border border-white/10 rounded overflow-hidden w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
                        {board.map((pid, idx) => {
                          const belongs = pid !== null;
                          const isSelected = selectedBoardIndex === idx;
                          const matched = belongs
                            ? pieces.find((p) => p.id === pid)
                            : null;

                          return (
                            <div
                              key={idx}
                              onClick={() => handleBoardClick(idx)}
                              className={`relative select-none cursor-pointer aspect-square flex items-center justify-center transition-all bg-zinc-950 border border-white/5 ${
                                isSelected
                                  ? "ring-2 ring-red-500 z-10"
                                  : "hover:bg-white/[0.02]"
                              } ${disabled ? "pointer-events-none opacity-50" : ""}`}
                            >
                              <span className="absolute text-[8px] font-mono text-white/10 z-0">
                                {idx + 1}
                              </span>
                              {belongs && matched && (
                                <img
                                  src={matched.dataUrl}
                                  alt=""
                                  className="w-full h-full object-cover absolute inset-0 pointer-events-none rounded-sm"
                                />
                              )}
                              {selectedPieceId !== null && !belongs && (
                                <div className="absolute inset-0 bg-red-500/10 border border-dashed border-red-500/30 animate-pulse pointer-events-none"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tray */}
                    <div className="md:col-span-5 w-full">
                      <div className="bg-zinc-950/40 border border-white/5 rounded p-2 h-[180px] md:h-[320px] overflow-y-auto">
                        {tray.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-mono text-white/30 uppercase">
                              Empty
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 md:grid-cols-4 gap-1.5">
                            {tray.map((pid) => {
                              const item = pieces.find((p) => p.id === pid);
                              const isSelected = selectedPieceId === pid;
                              if (!item) return null;

                              return (
                                <div
                                  key={pid}
                                  onClick={() => handleTrayClick(pid)}
                                  className={`relative aspect-square bg-zinc-900 border rounded p-0.5 cursor-pointer select-none transition-transform hover:scale-105 ${
                                    isSelected
                                      ? "border-red-500 ring-1 ring-red-500 bg-zinc-800"
                                      : "border-white/5 hover:border-white/10"
                                  } ${disabled ? "pointer-events-none opacity-50" : ""}`}
                                >
                                  <img
                                    src={item.dataUrl}
                                    alt=""
                                    className="w-full h-full object-cover rounded pointer-events-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button Row */}
                  <div className="mt-6 w-full flex flex-col items-center gap-2">
                    <button
                      onClick={handleSubmitPuzzle}
                      disabled={disabled}
                      className="w-full max-w-[320px] py-3 bg-red-600 hover:bg-red-500 font-mono text-xs uppercase tracking-widest font-black text-white rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/30 disabled:opacity-50"
                    >
                      SUBMIT ARRANGEMENT
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                    {puzzleError && (
                      <div className="flex items-center gap-2 text-rose-400 bg-red-950/40 border border-red-900/60 p-2.5 rounded text-[10px] font-mono max-w-[320px] w-full text-left">
                        <svg
                          className="w-3.5 h-3.5 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        <span>{puzzleError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: SCANNING PASSCODE ENTRY */}
          {stage === "scanning" && (
            <div className="w-full max-w-md bg-zinc-950 border border-white/10 p-6 sm:p-8 rounded shadow-2xl flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-4 font-bold">
                // FRAGMENTS REASSEMBLED INSTANTLY
              </span>

              {/* Completed high-res scannable ticket rendering destination */}
              <div className="relative border border-white/5 rounded overflow-hidden p-2 bg-white flex items-center justify-center max-w-[260px] aspect-square w-full mb-6">
                <div className="w-full h-full flex items-center justify-center relative aspect-square">
                  {ticketFullImage && (
                    <Image
                      src={ticketFullImage}
                      alt="Scanned Passkey"
                      fill
                      className="object-contain rounded"
                      unoptimized
                    />
                  )}
                </div>
                {/* Laser overlay lines */}
                <div className="absolute inset-x-0 h-0.5 bg-red-600/30 top-1/3 animate-pulse pointer-events-none"></div>
              </div>

              <div className="w-full space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyAnswer();
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2.5 text-center text-sm font-mono uppercase tracking-widest focus:outline-none focus:border-red-500 placeholder:opacity-20 text-white disabled:opacity-50"
                    placeholder="ENTER SCANNED ANSWER"
                  />
                </div>

                {scanningError && (
                  <div className="flex items-center gap-2 text-rose-400 bg-red-950/35 border border-red-900/50 p-2.5 rounded text-[10px] font-mono text-left">
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    <span>{scanningError}</span>
                  </div>
                )}

                <button
                  onClick={handleVerifyAnswer}
                  disabled={disabled}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest rounded cursor-pointer font-bold transition-all disabled:opacity-50"
                >
                  SUBMIT ANSWER
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: VICTORY & SCORES */}
          {stage === "victory" && (
            <div className="w-full max-w-lg bg-zinc-950 border border-white/10 p-6 sm:p-8 rounded shadow-2xl flex flex-col items-center">
              {/* Trophy SVG header */}
              <div className="w-12 h-12 bg-red-950/20 border border-red-900 rounded-full flex items-center justify-center mb-4 text-red-500">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.22-1.2 4.14-3 5.37V15a4 4 0 0 1-8 0v-.63c-1.8-1.23-3-3.15-3-5.37A7 7 0 0 1 12 2Z" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tight text-center">
                Trial Completed
              </h2>
              <p className="text-xs text-white/40 font-mono uppercase tracking-widest text-center mt-1">
                Chronos Gate sequence unlocked!
              </p>

              <div className="bg-zinc-900/60 border border-white/5 rounded px-4 py-3 w-full my-6 text-center text-sm font-mono leading-relaxed">
                🏆 Team <span className="text-white font-bold">{teamName.toUpperCase()}</span> finalized in{" "}
                <span className="text-red-500 font-bold">
                  {formatTime(secondsElapsed)}
                </span>
                !
              </div>

              {/* Scoreboard table */}
              <div className="w-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <span>TEAM PERFORMANCE LEADERBOARD</span>
                  <span>DURATION</span>
                </div>

                {/* List entries */}
                {loadingLeaderboard ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-2"></div>
                    <span className="text-[9px] font-mono text-white/30 uppercase">
                      Querying active records...
                    </span>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="py-6 text-center text-white/30 font-mono text-xs">
                    No teams registered yet.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {leaderboard.map((entry, index) => {
                      const isCurrent =
                        entry.teamName.trim().toUpperCase() ===
                        teamName.trim().toUpperCase();
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between py-1.5 px-3 rounded text-xs font-mono ${
                            isCurrent
                              ? "bg-red-950/25 border border-red-900/40 text-red-200"
                              : "bg-zinc-900/30 border border-white/[0.01] text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-bold text-red-500/80 w-5">
                              #{index + 1}
                            </span>
                            <span className="truncate max-w-[180px] uppercase font-semibold text-white/90">
                              {entry.teamName}
                            </span>
                          </div>
                          <span className="font-bold text-red-300 opacity-90">
                            {formatTime(entry.secondsTaken)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleRestart}
                disabled={disabled}
                className="mt-6 flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none disabled:opacity-50"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M16 3h5v5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 21H3v-5" />
                </svg>
                Restart New Run
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
