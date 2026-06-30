"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SECRET_WORD,
  NUM_GONDOLAS,
  ROTATION_INTERVAL_MS,
  MAX_LOG_ENTRIES,
  GHOST_PROBABILITY,
  SOUND_HOOKS,
} from "../constants";
import { gondolaValue } from "../lib/cipher";
import { GondolaState, LogEntry } from "../types";

// ─── Sound Hook Stubs ───────────────────────────────────────────────────────

function fireHook(name: string, detail?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

// ─── Main Hook ──────────────────────────────────────────────────────────────

export function useWheelEngine(disabled?: boolean) {
  const [rotationStep, setRotationStep] = useState(0);
  const [gondolas, setGondolas] = useState<GondolaState[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const glowTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const anomalyTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // ── Build gondola states for a given rotation step ──
  const buildGondolas = useCallback(
    (step: number, ghostSet: Set<number>, prev: GondolaState[]): GondolaState[] => {
      return Array.from({ length: NUM_GONDOLAS }, (_, i) => {
        const trueVal = gondolaValue(SECRET_WORD, i, step);
        const isGhost = ghostSet.has(i);
        const displayedNumber = isGhost
          ? // ghost: pick a "nearby" value that looks plausible but differs from true sequence
            ((trueVal + Math.floor(Math.random() * 5) + 1) % 26) + 1
          : trueVal;
        return {
          index: i,
          displayedNumber,
          isGhost,
          isGlowing: prev[i]?.isGlowing ?? false,
          isAnomaly: isGhost,
        };
      });
    },
    []
  );

  // ── Initialize ──
  useEffect(() => {
    setGondolas(buildGondolas(0, new Set(), []));
  }, [buildGondolas]);

  // ── Advance rotation ──
  const advance = useCallback(() => {
    if (disabled) return;
    setRotationStep((prev) => {
      const next = prev + 1;

      // decide which gondolas get a ghost value this tick
      const ghostSet = new Set<number>();
      Array.from({ length: NUM_GONDOLAS }, (_, i) => {
        if (Math.random() < GHOST_PROBABILITY) ghostSet.add(i);
      });

      setGondolas((prevGondolas) => {
        const next_gondolas = buildGondolas(next, ghostSet, prevGondolas);
        // clear anomaly flags after 600ms
        ghostSet.forEach((gi) => {
          if (anomalyTimers.current[gi]) clearTimeout(anomalyTimers.current[gi]);
          anomalyTimers.current[gi] = setTimeout(() => {
            setGondolas((g) =>
              g.map((gon) => (gon.index === gi ? { ...gon, isAnomaly: false } : gon))
            );
          }, 600);
        });
        if (ghostSet.size > 0) {
          fireHook(SOUND_HOOKS.onGhost, { ghostGondolas: Array.from(ghostSet), step: next });
        }
        return next_gondolas;
      });

      fireHook(SOUND_HOOKS.onRotation, { step: next });
      return next;
    });
  }, [buildGondolas, disabled]);

  // ── Auto-rotation timer ──
  useEffect(() => {
    if (!isRunning || disabled) return;
    const id = setInterval(advance, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isRunning, advance, disabled]);

  // ── Click a gondola → record it ──
  const clickGondola = useCallback(
    (gondolaIndex: number) => {
      if (disabled) return;
      setGondolas((prev) => {
        const gondola = prev[gondolaIndex];
        if (!gondola) return prev;

        // Add to log
        const entry: LogEntry = {
          id: `${Date.now()}-${gondolaIndex}-${Math.random()}`,
          gondolaIndex,
          displayedNumber: gondola.displayedNumber,
          rotationStep,
          isGhost: gondola.isGhost,
          timestamp: Date.now(),
        };

        setLog((l) => {
          const updated = [entry, ...l].slice(0, MAX_LOG_ENTRIES);
          return updated;
        });

        fireHook(SOUND_HOOKS.onGondolaClick, { gondolaIndex, value: gondola.displayedNumber });

        // Glow effect
        if (glowTimers.current[gondolaIndex])
          clearTimeout(glowTimers.current[gondolaIndex]);

        const withGlow = prev.map((g) =>
          g.index === gondolaIndex ? { ...g, isGlowing: true } : g
        );

        glowTimers.current[gondolaIndex] = setTimeout(() => {
          setGondolas((g) =>
            g.map((gon) =>
              gon.index === gondolaIndex ? { ...gon, isGlowing: false } : gon
            )
          );
        }, 800);

        return withGlow;
      });
    },
    [rotationStep, disabled]
  );

  // ── Toggle auto-run ──
  const toggleRunning = useCallback(() => {
    if (disabled) return;
    setIsRunning((v) => !v);
  }, [disabled]);

  // ── Validate answer ──
  const validateAnswer = useCallback((input: string): boolean => {
    return input.trim().toUpperCase() === SECRET_WORD;
  }, []);

  const totalRotations = Math.floor(rotationStep / NUM_GONDOLAS);

  return {
    rotationStep,
    gondolas,
    log,
    isRunning,
    totalRotations,
    advance,
    clickGondola,
    toggleRunning,
    validateAnswer,
  };
}
