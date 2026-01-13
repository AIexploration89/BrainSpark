import type { Level, PuzzleMode } from '../types';

// Sliding Puzzle Levels (8 levels)
export const SLIDING_LEVELS: Level[] = [
  {
    id: 1,
    name: 'First Slide',
    mode: 'sliding',
    difficulty: 'beginner',
    gridSize: 3,
    timeLimit: 0,
    hints: 3,
    description: 'A simple 3x3 puzzle to get started',
  },
  {
    id: 2,
    name: 'Getting Warmer',
    mode: 'sliding',
    difficulty: 'beginner',
    gridSize: 3,
    timeLimit: 120,
    hints: 2,
    description: 'Beat the clock with this 3x3 puzzle',
  },
  {
    id: 3,
    name: 'Step Up',
    mode: 'sliding',
    difficulty: 'easy',
    gridSize: 4,
    timeLimit: 0,
    hints: 3,
    description: 'Try a larger 4x4 puzzle',
  },
  {
    id: 4,
    name: 'Speed Runner',
    mode: 'sliding',
    difficulty: 'easy',
    gridSize: 4,
    timeLimit: 180,
    hints: 2,
    description: 'Race against time on 4x4',
  },
  {
    id: 5,
    name: 'Big Board',
    mode: 'sliding',
    difficulty: 'medium',
    gridSize: 4,
    timeLimit: 150,
    hints: 1,
    description: 'Tighter time limit challenge',
  },
  {
    id: 6,
    name: 'Grid Master',
    mode: 'sliding',
    difficulty: 'medium',
    gridSize: 5,
    timeLimit: 0,
    hints: 2,
    description: 'The massive 5x5 grid awaits',
  },
  {
    id: 7,
    name: 'Time Crunch',
    mode: 'sliding',
    difficulty: 'hard',
    gridSize: 5,
    timeLimit: 300,
    hints: 1,
    description: '5x5 with a time limit',
  },
  {
    id: 8,
    name: 'Slide Champion',
    mode: 'sliding',
    difficulty: 'expert',
    gridSize: 5,
    timeLimit: 240,
    hints: 0,
    description: 'The ultimate sliding challenge',
  },
];

// Pattern Match Levels (8 levels)
export const PATTERN_MATCH_LEVELS: Level[] = [
  {
    id: 1,
    name: 'First Match',
    mode: 'pattern-match',
    difficulty: 'beginner',
    pairs: 4,
    shapes: ['circle', 'square'],
    colors: ['cyan', 'pink'],
    timeLimit: 0,
    hints: 3,
    description: '4 pairs with simple shapes',
  },
  {
    id: 2,
    name: 'Shape Safari',
    mode: 'pattern-match',
    difficulty: 'beginner',
    pairs: 6,
    shapes: ['circle', 'square', 'triangle'],
    colors: ['cyan', 'pink', 'green'],
    timeLimit: 60,
    hints: 2,
    description: '6 pairs with more variety',
  },
  {
    id: 3,
    name: 'Color Burst',
    mode: 'pattern-match',
    difficulty: 'easy',
    pairs: 8,
    shapes: ['circle', 'square', 'triangle', 'diamond'],
    colors: ['cyan', 'pink', 'green', 'purple'],
    timeLimit: 90,
    hints: 2,
    description: '8 pairs of colorful shapes',
  },
  {
    id: 4,
    name: 'Memory Lane',
    mode: 'pattern-match',
    difficulty: 'easy',
    pairs: 10,
    shapes: ['circle', 'square', 'triangle', 'diamond'],
    colors: ['cyan', 'pink', 'green', 'purple', 'yellow'],
    timeLimit: 120,
    hints: 2,
    description: '10 pairs to test your memory',
  },
  {
    id: 5,
    name: 'Pattern Pro',
    mode: 'pattern-match',
    difficulty: 'medium',
    pairs: 12,
    shapes: ['circle', 'square', 'triangle', 'diamond', 'star'],
    colors: ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'],
    timeLimit: 150,
    hints: 1,
    description: '12 pairs with all shapes',
  },
  {
    id: 6,
    name: 'Quick Eyes',
    mode: 'pattern-match',
    difficulty: 'medium',
    pairs: 12,
    shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'],
    colors: ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'],
    timeLimit: 90,
    hints: 1,
    description: 'Same pairs, less time',
  },
  {
    id: 7,
    name: 'Memory Master',
    mode: 'pattern-match',
    difficulty: 'hard',
    pairs: 15,
    shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'],
    colors: ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'],
    timeLimit: 180,
    hints: 1,
    description: '15 challenging pairs',
  },
  {
    id: 8,
    name: 'Pattern Champion',
    mode: 'pattern-match',
    difficulty: 'expert',
    pairs: 18,
    shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'],
    colors: ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'],
    timeLimit: 180,
    hints: 0,
    description: 'The ultimate memory test',
  },
];

// Sequence Puzzle Levels (8 levels)
export const SEQUENCE_LEVELS: Level[] = [
  {
    id: 1,
    name: 'Number Chain',
    mode: 'sequence',
    difficulty: 'beginner',
    sequenceType: 'numbers',
    sequenceLength: 5,
    hiddenCount: 1,
    timeLimit: 0,
    hints: 3,
    description: 'Complete simple number patterns',
  },
  {
    id: 2,
    name: 'Shape Flow',
    mode: 'sequence',
    difficulty: 'beginner',
    sequenceType: 'shapes',
    sequenceLength: 5,
    hiddenCount: 1,
    timeLimit: 60,
    hints: 2,
    description: 'Follow the shape sequence',
  },
  {
    id: 3,
    name: 'Color Wave',
    mode: 'sequence',
    difficulty: 'easy',
    sequenceType: 'colors',
    sequenceLength: 6,
    hiddenCount: 2,
    timeLimit: 90,
    hints: 2,
    description: 'Continue the color pattern',
  },
  {
    id: 4,
    name: 'Mixed Signals',
    mode: 'sequence',
    difficulty: 'easy',
    sequenceType: 'mixed',
    sequenceLength: 6,
    hiddenCount: 2,
    timeLimit: 120,
    hints: 2,
    description: 'Numbers and shapes combined',
  },
  {
    id: 5,
    name: 'Pattern Puzzle',
    mode: 'sequence',
    difficulty: 'medium',
    sequenceType: 'mixed',
    sequenceLength: 7,
    hiddenCount: 2,
    timeLimit: 120,
    hints: 1,
    description: 'More complex sequences',
  },
  {
    id: 6,
    name: 'Brain Bender',
    mode: 'sequence',
    difficulty: 'medium',
    sequenceType: 'mixed',
    sequenceLength: 8,
    hiddenCount: 3,
    timeLimit: 150,
    hints: 1,
    description: 'Multiple missing elements',
  },
  {
    id: 7,
    name: 'Sequence Sage',
    mode: 'sequence',
    difficulty: 'hard',
    sequenceType: 'mixed',
    sequenceLength: 9,
    hiddenCount: 3,
    timeLimit: 180,
    hints: 1,
    description: 'Long challenging sequences',
  },
  {
    id: 8,
    name: 'Pattern Champion',
    mode: 'sequence',
    difficulty: 'expert',
    sequenceType: 'mixed',
    sequenceLength: 10,
    hiddenCount: 4,
    timeLimit: 180,
    hints: 0,
    description: 'The ultimate sequence challenge',
  },
];

// Jigsaw Lite Levels (8 levels)
export const JIGSAW_LEVELS: Level[] = [
  {
    id: 1,
    name: 'Simple Shapes',
    mode: 'jigsaw',
    difficulty: 'beginner',
    pieceCount: 4,
    imageTheme: 'geometric',
    timeLimit: 0,
    hints: 3,
    description: '4 piece geometric puzzle',
  },
  {
    id: 2,
    name: 'Animal Friends',
    mode: 'jigsaw',
    difficulty: 'beginner',
    pieceCount: 6,
    imageTheme: 'animals',
    timeLimit: 90,
    hints: 2,
    description: '6 piece animal puzzle',
  },
  {
    id: 3,
    name: 'Space Adventure',
    mode: 'jigsaw',
    difficulty: 'easy',
    pieceCount: 9,
    imageTheme: 'space',
    timeLimit: 120,
    hints: 2,
    description: '9 piece space theme',
  },
  {
    id: 4,
    name: 'Nature Scene',
    mode: 'jigsaw',
    difficulty: 'easy',
    pieceCount: 9,
    imageTheme: 'nature',
    timeLimit: 150,
    hints: 2,
    description: '9 piece nature puzzle',
  },
  {
    id: 5,
    name: 'Robot Factory',
    mode: 'jigsaw',
    difficulty: 'medium',
    pieceCount: 12,
    imageTheme: 'robots',
    timeLimit: 180,
    hints: 1,
    description: '12 piece robot theme',
  },
  {
    id: 6,
    name: 'Ocean World',
    mode: 'jigsaw',
    difficulty: 'medium',
    pieceCount: 16,
    imageTheme: 'ocean',
    timeLimit: 240,
    hints: 1,
    description: '16 piece underwater scene',
  },
  {
    id: 7,
    name: 'City Skyline',
    mode: 'jigsaw',
    difficulty: 'hard',
    pieceCount: 16,
    imageTheme: 'city',
    timeLimit: 200,
    hints: 1,
    description: '16 pieces with time pressure',
  },
  {
    id: 8,
    name: 'Puzzle Master',
    mode: 'jigsaw',
    difficulty: 'expert',
    pieceCount: 20,
    imageTheme: 'abstract',
    timeLimit: 300,
    hints: 0,
    description: 'The ultimate jigsaw challenge',
  },
];

// Get all levels for a mode
export function getLevelsForMode(mode: PuzzleMode): Level[] {
  switch (mode) {
    case 'sliding':
      return SLIDING_LEVELS;
    case 'pattern-match':
      return PATTERN_MATCH_LEVELS;
    case 'sequence':
      return SEQUENCE_LEVELS;
    case 'jigsaw':
      return JIGSAW_LEVELS;
    default:
      return [];
  }
}

// Get a specific level
export function getLevel(mode: PuzzleMode, levelId: number): Level | undefined {
  const levels = getLevelsForMode(mode);
  return levels.find((l) => l.id === levelId);
}

// Get next level
export function getNextLevel(mode: PuzzleMode, currentLevelId: number): Level | undefined {
  const levels = getLevelsForMode(mode);
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  if (currentIndex >= 0 && currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return undefined;
}

// Get total level count
export function getTotalLevelCount(): number {
  return SLIDING_LEVELS.length + PATTERN_MATCH_LEVELS.length + SEQUENCE_LEVELS.length + JIGSAW_LEVELS.length;
}
