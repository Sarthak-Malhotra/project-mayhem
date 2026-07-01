"use client";

import { useState, useEffect } from "react";
import { useCaseStore } from "../CaseFileProvider";
import { calcScore } from "../lib/scoring";
import { matchAnswer } from "../lib/answerMatcher";
import { puzzlesConfig } from "../lib/puzzles.config";

export function useAnswerValidation(puzzleId: number) {
  const [inputValue, setInputValue] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isPartial, setIsPartial] = useState(false);
  const [message, setMessage] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const solved = useCaseStore((state) => state.solved);
  const hintsUsedMap = useCaseStore((state) => state.hintsUsed);
  const solvePuzzle = useCaseStore((state) => state.solvePuzzle);

  const isSolved = solved.includes(puzzleId);
  const hintsUsedCount = hintsUsedMap[puzzleId] || 0;

  // Reset input state when puzzle ID changes or is solved
  useEffect(() => {
    setInputValue("");
    setIsShaking(false);
    setIsPartial(false);
    setMessage("");
    setWrongAttempts(0);
  }, [puzzleId, isSolved]);

  const submitAnswer = () => {
    if (isSolved) return;

    const config = puzzlesConfig.find((p) => p.id === puzzleId);
    if (!config) {
      setMessage("Error: Puzzle configuration not found.");
      return;
    }

    const result = matchAnswer(inputValue, config);

    if (result.matched) {
      // Calculate final score based on hints used
      const finalScore = calcScore(config.points, hintsUsedCount);
      solvePuzzle(puzzleId, finalScore);
      setIsPartial(false);
      setMessage("");
    } else if (result.partial) {
      setIsPartial(true);
      setMessage("INCOMPLETE MATCH - Include the full answer. Try again.");
    } else {
      setIsPartial(false);
      setIsShaking(true);
      setWrongAttempts((prev) => prev + 1);
      setMessage("NO HISTORICAL CORRELATION DETECTED - Archive remains unstable.");
      
      // Auto-reset shake state after animation duration (e.g. 500ms)
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  return {
    inputValue,
    setInputValue,
    isShaking,
    isPartial,
    isSolved,
    message,
    wrongAttempts,
    submitAnswer,
  };
}
