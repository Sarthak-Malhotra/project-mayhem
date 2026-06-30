// ─── Caesar Cipher Logic ────────────────────────────────────────────────────

/**
 * Convert a letter (A-Z) to its 1-indexed numeric value.
 * A=1, B=2, … Z=26
 */
export function letterToNumber(letter: string): number {
  const ch = letter.toUpperCase().charCodeAt(0);
  if (ch < 65 || ch > 90) throw new Error(`Not a letter: ${letter}`);
  return ch - 64; // A=1
}

/**
 * Apply Caesar cipher shift to a numeric letter value.
 * Shift wraps within 1–26 (letter space).
 *
 * @param value    — base numeric value (1–26)
 * @param shift    — rotation step (will be taken mod 17, then mod 26 for wrap)
 * @returns shifted numeric value (1–26)
 */
export function caesarShift(value: number, shift: number): number {
  // shift mod 17 gives the gondola's rotation-index shift
  const s = shift % 17;
  // then wrap within 1–26
  return ((value - 1 + s) % 26) + 1;
}

/**
 * Given the secret word, a gondola index (0–16), and the current rotation step,
 * return the number displayed in that gondola.
 *
 * True value: letter at (gondolaIndex % word.length) shifted by rotationStep % 17.
 */
export function gondolaValue(
  secretWord: string,
  gondolaIndex: number,
  rotationStep: number
): number {
  const letter = secretWord[gondolaIndex % secretWord.length];
  const base = letterToNumber(letter);
  return caesarShift(base, rotationStep);
}

/**
 * Reverse the Caesar shift — given a displayed value and the rotation step,
 * recover the base value (1–26), then convert back to a letter.
 */
export function reverseShift(displayed: number, rotationStep: number): number {
  const s = rotationStep % 17;
  return ((displayed - 1 - s + 26 * 17) % 26) + 1;
}

/**
 * Convert a numeric value (1–26) back to its letter.
 */
export function numberToLetter(value: number): string {
  return String.fromCharCode(64 + ((value - 1) % 26) + 1);
}
