import { useState, useEffect, useCallback } from 'react';

export interface Player {
  x: number;
  y: number;
  facing: number;
}

export interface Puzzle {
  type: string;
  pattern?: number[];
  question?: string;
  answer?: string;
  sequenceLength?: number;
}

export interface Anomaly {
  id: string;
  puzzles: Puzzle[];
  solved: boolean;
}

export interface Level {
  map: number[][];
  anomalies: Record<string, Anomaly>;
  start: Player;
}

interface ActiveAnomaly extends Anomaly {
  key: string;
}

const LEVELS: Level[] = [
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    anomalies: {
      "27,13": {
        id: "a1",
        puzzles: [
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "question", question: "", answer: "" }
        ],
        solved: false
      },
      "15,17": {
        id: "a2",
        puzzles: [
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "question", question: "", answer: "" },
          { type: "lights_out", pattern: [1, 4, 7] }
        ],
        solved: false
      },
      "25,24": {
        id: "a3",
        puzzles: [
          { type: "question", question: "", answer: "" },
          { type: "question", question: "", answer: "" },
          { type: "sequence", sequenceLength: 3 }
        ],
        solved: false
      },
      "25,16": {
        id: "a4",
        puzzles: [
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "question", question: "", answer: "" },
          { type: "sequence", sequenceLength: 3 }
        ],
        solved: false
      },
      "17,21": {
        id: "a5",
        puzzles: [
          { type: "question", question: "", answer: "" },
          { type: "question", question: "", answer: "" },
          { type: "question", question: "", answer: "" }
        ],
        solved: false
      },
      "17,1": {
        id: "a6",
        puzzles: [
          { type: "question", question: "", answer: "" },
          { type: "sequence", sequenceLength: 3 },
          { type: "question", question: "", answer: "" }
        ],
        solved: false
      },
      "9,5": {
        id: "a7",
        puzzles: [
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "sequence", sequenceLength: 3 },
          { type: "question", question: "", answer: "" }
        ],
        solved: false
      },
      "11,21": {
        id: "a8",
        puzzles: [
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "lights_out", pattern: [1, 4, 7] },
          { type: "lights_out", pattern: [1, 4, 7] }
        ],
        solved: false
      }
    },
    start: { x: 1, y: 1, facing: 1 }
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    anomalies: {},
    start: { x: 7, y: 13, facing: 0 }
  }
];

export function useGameEngine() {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [player, setPlayer] = useState<Player>(LEVELS[0].start);
  const [anomalies, setAnomalies] = useState<Record<string, Anomaly>>(LEVELS[0].anomalies);
  const [activeAnomaly, setActiveAnomaly] = useState<ActiveAnomaly | null>(null);

  const [showStory, setShowStory] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    async function loadQuestionsAndProgress() {
      try {
        const qRes = await fetch("/api/questions?caseId=01");
        const qData = await qRes.json();
        
        const pRes = await fetch("/api/progress?caseId=01");
        const pData = await pRes.json();
        const solvedAnomalies = pData.success && Array.isArray(pData.progress?.solvedAnomalies) 
          ? pData.progress.solvedAnomalies 
          : [];

        if (qData.success && qData.questions) {
          setAnomalies(prev => {
            const updated = { ...prev };
            
            qData.questions.forEach((q: { anomalyId: string; puzzleIndex: number; question: string; answer: string }) => {
              if (updated[q.anomalyId] && updated[q.anomalyId].puzzles[q.puzzleIndex]) {
                updated[q.anomalyId] = {
                  ...updated[q.anomalyId],
                  puzzles: updated[q.anomalyId].puzzles.map((p, idx) => {
                    if (idx === q.puzzleIndex) {
                      return { ...p, question: q.question, answer: q.answer };
                    }
                    return p;
                  })
                };
              }
            });

            solvedAnomalies.forEach((anomalyKey: string) => {
              if (updated[anomalyKey]) {
                updated[anomalyKey].solved = true;
              }
            });

            return updated;
          });
        }

        if (pData.success) {
          if (pData.progress?.player) {
            setPlayer(pData.progress.player);
          }
          if (pData.progress?.levelIndex !== undefined) {
            setLevelIndex(pData.progress.levelIndex);
          }
        }
      } catch (err) {
        console.error("Failed to load DB questions or progress for Case 1:", err);
      }
    }
    loadQuestionsAndProgress();
  }, []);

  // Save player position and level index with a 1-second debounce
  useEffect(() => {
    if (player.x === LEVELS[0].start.x && player.y === LEVELS[0].start.y && levelIndex === 0) return;

    const handler = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: "01", key: "player", value: player }),
      }).catch((err) => console.error("Failed to save player position:", err));

      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: "01", key: "levelIndex", value: levelIndex }),
      }).catch((err) => console.error("Failed to save level index:", err));
    }, 1000);

    return () => clearTimeout(handler);
  }, [player, levelIndex]);

  const currentLevel = LEVELS[levelIndex];
  const allSolved = Object.values(anomalies).every(a => a.solved);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayer(prev => {
      let nx = prev.x;
      let ny = prev.y;

      if (prev.facing === 0) { nx += dx; ny -= dy; }
      else if (prev.facing === 1) { nx += dy; ny += dx; }
      else if (prev.facing === 2) { nx -= dx; ny += dy; }
      else if (prev.facing === 3) { nx -= dy; ny -= dx; }

      if (ny >= 0 && ny < currentLevel.map.length && nx >= 0 && nx < currentLevel.map[0].length) {
        const targetTile = currentLevel.map[ny][nx];
        if (targetTile === 1) return prev;

        if (targetTile === 2) {
          const key = `${ny},${nx}`;
          if (anomalies[key] && !anomalies[key].solved) {
            setActiveAnomaly({ key, ...anomalies[key] });
            return prev;
          }
        }

        if (targetTile === 3) {
          if (allSolved) {
            if (levelIndex < LEVELS.length - 1) {
              const nextLevelIndex = levelIndex + 1;
              setLevelIndex(nextLevelIndex);
              setAnomalies(LEVELS[nextLevelIndex].anomalies);
              return LEVELS[nextLevelIndex].start;
            } else {
              setGameWon(true);
              return { ...prev, x: nx, y: ny };
            }
          }
          return prev;
        }

        if (targetTile === 4) {
          setShowStory(true);
          return prev;
        }

        return { ...prev, x: nx, y: ny };
      }
      return prev;
    });
  }, [anomalies, allSolved, currentLevel, levelIndex]);

  const turnPlayer = useCallback((dir: number) => {
    setPlayer(prev => ({
      ...prev,
      facing: (prev.facing + dir + 4) % 4
    }));
  }, []);

  useEffect(() => {
    if (activeAnomaly || showStory || gameWon) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': movePlayer(0, 1); break;
        case 's': case 'arrowdown': movePlayer(0, -1); break;
        case 'a': case 'arrowleft': turnPlayer(-1); break;
        case 'd': case 'arrowright': turnPlayer(1); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, turnPlayer, activeAnomaly, showStory, gameWon]);

  const solveAnomaly = (key: string) => {
    setAnomalies(prev => {
      const updated = {
        ...prev,
        [key]: { ...prev[key], solved: true }
      };

      const solvedIds = Object.keys(updated).filter(k => updated[k].solved);
      
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: '01', key: 'solvedAnomalies', value: solvedIds })
      }).catch(err => console.error('Failed to save Case 1 progress:', err));

      return updated;
    });
    setActiveAnomaly(null);
  };

  const closeAnomaly = () => setActiveAnomaly(null);

  const finishStory = () => {
    setShowStory(false);
    setGameWon(true);
  };

  return {
    player,
    anomalies,
    activeAnomaly,
    solveAnomaly,
    closeAnomaly,
    gameWon,
    allSolved,
    movePlayer,
    turnPlayer,
    levelIndex,
    currentMap: currentLevel.map,
    showStory,
    finishStory
  };
}
