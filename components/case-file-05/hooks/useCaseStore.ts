import { createStore } from "zustand"

export interface CaseStore {
  solved: number[]
  hintsUsed: Record<number, number> // puzzleId -> count (0-3)
  scores: Record<number, number>    // puzzleId -> score
  totalScore: number
  activePuzzle: number | null
  startedAt: number                 // Date.now() on first load
  puzzleStartedAt: Record<number, number> // puzzleId -> startTime
  puzzleDurations: Record<number, number> // puzzleId -> duration in seconds
  seenArchives: number[]
  hydrated: boolean
  setHydrated: (h: boolean) => void
  solvePuzzle: (id: number, score: number) => void
  useHint: (id: number) => void
  setActive: (id: number | null) => void
  markArchiveSeen: (id: number) => void
  reset: () => void
}

export type CaseStoreApi = ReturnType<typeof createCaseStore>

export const createCaseStore = () => {
  return createStore<CaseStore>()(
    (set) => ({
      solved: [],
      hintsUsed: {},
      scores: {},
      totalScore: 0,
      activePuzzle: null,
      startedAt: typeof window !== "undefined" ? Date.now() : 0,
      puzzleStartedAt: {},
      puzzleDurations: {},
      seenArchives: [],
      hydrated: false,
      setHydrated: (h) => set({ hydrated: h }),
      solvePuzzle: (id, score) =>
        set((state) => {
          if (state.solved.includes(id)) return state;
          const newSolved = [...state.solved, id];
          const newScores = { ...state.scores, [id]: score };
          const newTotal = Object.values(newScores).reduce((a, b) => a + b, 0);

          const startTime = state.puzzleStartedAt[id] || state.startedAt || Date.now();
          const elapsed = Date.now() - startTime;
          const seconds = Math.max(1, Math.round(elapsed / 1000));
          const newDurations = { ...state.puzzleDurations, [id]: seconds };

          return {
            solved: newSolved,
            scores: newScores,
            totalScore: newTotal,
            puzzleDurations: newDurations,
          };
        }),
      useHint: (id) =>
        set((state) => {
          const current = state.hintsUsed[id] || 0;
          if (current >= 3) return state;
          return {
            hintsUsed: {
              ...state.hintsUsed,
              [id]: current + 1,
            },
          };
        }),
      setActive: (id) =>
        set((state) => {
          const updates: Partial<CaseStore> = { activePuzzle: id };
          if (id !== null && !state.solved.includes(id) && !state.puzzleStartedAt[id]) {
            updates.puzzleStartedAt = {
              ...state.puzzleStartedAt,
              [id]: Date.now(),
            };
          }
          return updates;
        }),
      markArchiveSeen: (id) =>
        set((state) => {
          if (state.seenArchives.includes(id)) return state;
          return {
            seenArchives: [...state.seenArchives, id],
          };
        }),
      reset: () =>
        set({
          solved: [],
          hintsUsed: {},
          scores: {},
          totalScore: 0,
          activePuzzle: null,
          startedAt: Date.now(),
          puzzleStartedAt: {},
          puzzleDurations: {},
          seenArchives: [],
          hydrated: false,
        }),
    })
  );
};
