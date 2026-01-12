// Memory Matrix Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'level-select'   // Choose difficulty/level
  | 'countdown'      // Pre-game countdown
  | 'showing'        // Pattern is being displayed
  | 'playing'        // Player is inputting pattern
  | 'paused'         // Game paused
  | 'results'        // Success - show results
  | 'failed';        // Failed - show failure screen

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Level {
  id: number;
  name: string;
  gridSize: number;         // 3 = 3x3, 4 = 4x4, etc.
  patternLength: number;    // How many cells light up
  displayTime: number;      // ms each cell stays lit
  difficulty: Difficulty;
  description: string;
  unlockRequirement?: number; // Previous level's minimum score to unlock
}

export interface Cell {
  id: number;
  row: number;
  col: number;
  isActive: boolean;        // Currently lit up in pattern
  isSelected: boolean;      // Player has selected this
  isCorrect?: boolean;      // Was this selection correct
  isInPattern: boolean;     // Part of the target pattern
}

export interface GameResult {
  score: number;
  accuracy: number;         // Percentage of correct cells
  timeBonus: number;        // Bonus for quick completion
  streakBonus: number;      // Bonus for consecutive correct
  totalCells: number;       // Total pattern cells
  correctCells: number;     // How many player got right
  wrongCells: number;       // How many wrong selections
  completionTime: number;   // Time in ms to complete
  level: number;
  isPerfect: boolean;       // 100% accuracy
}

export interface GameStats {
  highScore: number;
  perfectRounds: number;
  totalRounds: number;
  longestStreak: number;
  averageAccuracy: number;
  levelsCompleted: number;
}

export interface LevelProgress {
  levelId: number;
  highScore: number;
  bestAccuracy: number;
  timesPlayed: number;
  timesCompleted: number;
  unlocked: boolean;
}
