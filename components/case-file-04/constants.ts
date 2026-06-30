// ─── Case File 04 — Constants ───────────────────────────────────────────────
// CF-04-AB-2903 | Crimson Carnival Case File

export const SECRET_WORD = "CARNIVAL";           // 8 letters, cycles through 17 gondolas
export const NUM_GONDOLAS = 17;
export const ROTATION_INTERVAL_MS = 3000;        // auto-advance every 3 s
export const MAX_LOG_ENTRIES = 34;               // 2 full cycles
export const HINTS_VISIBLE_COUNT = 10;           // show up to N log lines on screen

export const HINTS: string[] = [
  "The wheel remembers a number it learned 17 years ago.",
  "Ignore the glows that fade too quickly.",
  "Each full rotation tells the same story. Write it down.",
  "Count the steps between identical numbers. The shift equals the step number.",
];

// Ghost probability per rotation tick (0–1)
export const GHOST_PROBABILITY = 0.25;

// Audio hook names (stubs — connect later)
export const SOUND_HOOKS = {
  onRotation: "onRotation",
  onGhost: "onGhost",
  onSuccess: "onSuccess",
  onError: "onError",
  onGondolaClick: "onGondolaClick",
} as const;

export const SUCCESS_MESSAGE = "SEGMENT 01 STABILIZED";
export const FAILURE_MESSAGE = "PATTERN MISMATCH – RE-OBSERVE";
