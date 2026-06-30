export interface PuzzleProps {
  onSolved?: () => void;
  onFailed?: () => void;
  disabled?: boolean;
}

export interface GondolaState {
  index: number;           // 0–16
  displayedNumber: number; // current number shown
  isGhost: boolean;        // is this a "ghost" anomaly tick?
  isGlowing: boolean;      // briefly lit after click
  isAnomaly: boolean;      // current gondola is in anomaly state
}

export interface LogEntry {
  id: string;
  gondolaIndex: number;
  displayedNumber: number;
  rotationStep: number;
  isGhost: boolean;
  timestamp: number;
}

export interface WheelState {
  rotationStep: number;       // current rotation (0–∞)
  gondolas: GondolaState[];
  log: LogEntry[];
  isRunning: boolean;
  totalRotations: number;     // how many full cycles completed
}
