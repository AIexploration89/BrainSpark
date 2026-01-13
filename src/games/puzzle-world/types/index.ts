// Puzzle World Types

export type GameState =
  | 'menu'
  | 'mode-select'
  | 'level-select'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'results'
  | 'failed';

export type PuzzleMode = 'sliding' | 'pattern-match' | 'sequence' | 'jigsaw';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

// Sliding Puzzle Types
export interface SlidingTile {
  id: number;
  value: number | null; // null = empty tile
  position: number;
  isCorrect: boolean;
}

// Pattern Match Types
export type PatternShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'hexagon';
export type PatternColor = 'cyan' | 'pink' | 'green' | 'purple' | 'yellow' | 'orange';

export interface PatternCard {
  id: number;
  shape: PatternShape;
  color: PatternColor;
  isFlipped: boolean;
  isMatched: boolean;
}

// Sequence Puzzle Types
export type SequenceType = 'numbers' | 'shapes' | 'colors' | 'mixed';

export interface SequenceItem {
  id: number;
  value: string | number;
  type: 'number' | 'shape' | 'color';
  isHidden: boolean;
  isAnswer: boolean;
}

// Jigsaw Lite Types
export interface JigsawPiece {
  id: number;
  shape: string; // SVG path or shape identifier
  correctPosition: { x: number; y: number };
  currentPosition: { x: number; y: number } | null;
  rotation: number;
  isPlaced: boolean;
}

// Level Configuration
export interface Level {
  id: number;
  name: string;
  mode: PuzzleMode;
  difficulty: Difficulty;
  // Sliding config
  gridSize?: number;
  // Pattern match config
  pairs?: number;
  shapes?: PatternShape[];
  colors?: PatternColor[];
  // Sequence config
  sequenceType?: SequenceType;
  sequenceLength?: number;
  hiddenCount?: number;
  // Jigsaw config
  pieceCount?: number;
  imageTheme?: string;
  // Common
  timeLimit?: number; // in seconds, 0 = no limit
  hints?: number;
  description: string;
}

export interface LevelResults {
  levelId: number;
  mode: PuzzleMode;
  completed: boolean;
  score: number;
  stars: number; // 0-3
  time: number; // in seconds
  moves: number;
  hintsUsed: number;
  accuracy: number; // 0-100
}

export interface LevelProgress {
  levelId: number;
  mode: PuzzleMode;
  completed: boolean;
  bestScore: number;
  bestStars: number;
  bestTime: number;
  attempts: number;
}

// Mode metadata
export interface ModeInfo {
  id: PuzzleMode;
  name: string;
  icon: string;
  color: string;
  description: string;
  levelCount: number;
}

// Constants
export const MODES: ModeInfo[] = [
  {
    id: 'sliding',
    name: 'Sliding Puzzle',
    icon: '🔢',
    color: 'cyan',
    description: 'Slide tiles to arrange them in order',
    levelCount: 8,
  },
  {
    id: 'pattern-match',
    name: 'Pattern Match',
    icon: '🎴',
    color: 'pink',
    description: 'Find matching pairs of shapes',
    levelCount: 8,
  },
  {
    id: 'sequence',
    name: 'Sequence Master',
    icon: '🔮',
    color: 'purple',
    description: 'Complete the pattern sequence',
    levelCount: 8,
  },
  {
    id: 'jigsaw',
    name: 'Jigsaw Lite',
    icon: '🧩',
    color: 'green',
    description: 'Fit the pieces into place',
    levelCount: 8,
  },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, { multiplier: number; label: string; color: string }> = {
  beginner: { multiplier: 1.0, label: 'Beginner', color: 'neon-green' },
  easy: { multiplier: 1.2, label: 'Easy', color: 'neon-cyan' },
  medium: { multiplier: 1.5, label: 'Medium', color: 'neon-yellow' },
  hard: { multiplier: 2.0, label: 'Hard', color: 'neon-orange' },
  expert: { multiplier: 3.0, label: 'Expert', color: 'neon-pink' },
};

export const PATTERN_SHAPES: PatternShape[] = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
export const PATTERN_COLORS: PatternColor[] = ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'];

// Star thresholds (percentage of optimal score)
export const STAR_THRESHOLDS = {
  one: 0.4,
  two: 0.7,
  three: 0.9,
};
