import type { Level } from '../types';

export const levels: Level[] = [
  // Easy levels - 3x3 grid
  {
    id: 1,
    name: 'First Steps',
    gridSize: 3,
    patternLength: 3,
    displayTime: 800,
    difficulty: 'easy',
    description: 'Remember 3 cells on a tiny grid',
  },
  {
    id: 2,
    name: 'Getting Started',
    gridSize: 3,
    patternLength: 4,
    displayTime: 700,
    difficulty: 'easy',
    description: 'A little more to remember',
    unlockRequirement: 70,
  },
  {
    id: 3,
    name: 'Warming Up',
    gridSize: 3,
    patternLength: 5,
    displayTime: 600,
    difficulty: 'easy',
    description: 'Five cells, faster pace',
    unlockRequirement: 70,
  },

  // Medium levels - 4x4 grid
  {
    id: 4,
    name: 'Grid Expansion',
    gridSize: 4,
    patternLength: 4,
    displayTime: 700,
    difficulty: 'medium',
    description: 'Bigger grid, new challenge!',
    unlockRequirement: 75,
  },
  {
    id: 5,
    name: 'Memory Builder',
    gridSize: 4,
    patternLength: 5,
    displayTime: 650,
    difficulty: 'medium',
    description: 'Five cells to track',
    unlockRequirement: 75,
  },
  {
    id: 6,
    name: 'Quick Thinker',
    gridSize: 4,
    patternLength: 6,
    displayTime: 600,
    difficulty: 'medium',
    description: 'Six cells, faster display',
    unlockRequirement: 75,
  },
  {
    id: 7,
    name: 'Pattern Pro',
    gridSize: 4,
    patternLength: 7,
    displayTime: 550,
    difficulty: 'medium',
    description: 'Seven cells to master',
    unlockRequirement: 80,
  },

  // Hard levels - 5x5 grid
  {
    id: 8,
    name: 'Big League',
    gridSize: 5,
    patternLength: 6,
    displayTime: 600,
    difficulty: 'hard',
    description: 'Welcome to the 5x5 grid!',
    unlockRequirement: 80,
  },
  {
    id: 9,
    name: 'Memory Master',
    gridSize: 5,
    patternLength: 8,
    displayTime: 550,
    difficulty: 'hard',
    description: 'Eight cells on the big grid',
    unlockRequirement: 80,
  },
  {
    id: 10,
    name: 'Brain Blitz',
    gridSize: 5,
    patternLength: 9,
    displayTime: 500,
    difficulty: 'hard',
    description: 'Nine cells, lightning fast',
    unlockRequirement: 85,
  },
  {
    id: 11,
    name: 'Elite Challenge',
    gridSize: 5,
    patternLength: 10,
    displayTime: 450,
    difficulty: 'hard',
    description: 'Ten cells to remember!',
    unlockRequirement: 85,
  },

  // Extreme levels - 6x6 grid
  {
    id: 12,
    name: 'Extreme Entry',
    gridSize: 6,
    patternLength: 8,
    displayTime: 550,
    difficulty: 'extreme',
    description: 'The ultimate 6x6 grid',
    unlockRequirement: 85,
  },
  {
    id: 13,
    name: 'Mind Bender',
    gridSize: 6,
    patternLength: 10,
    displayTime: 500,
    difficulty: 'extreme',
    description: 'Ten cells on the mega grid',
    unlockRequirement: 90,
  },
  {
    id: 14,
    name: 'Neural Network',
    gridSize: 6,
    patternLength: 12,
    displayTime: 450,
    difficulty: 'extreme',
    description: 'A dozen cells to track',
    unlockRequirement: 90,
  },
  {
    id: 15,
    name: 'Memory Legend',
    gridSize: 6,
    patternLength: 14,
    displayTime: 400,
    difficulty: 'extreme',
    description: 'The ultimate memory test!',
    unlockRequirement: 90,
  },
];

export function getLevelById(id: number): Level | undefined {
  return levels.find(level => level.id === id);
}

export function getLevelsByDifficulty(difficulty: Level['difficulty']): Level[] {
  return levels.filter(level => level.difficulty === difficulty);
}

export function getNextLevel(currentId: number): Level | undefined {
  return levels.find(level => level.id === currentId + 1);
}

export function isLevelUnlocked(levelId: number, previousBestScore: number): boolean {
  const level = getLevelById(levelId);
  if (!level) return false;
  if (levelId === 1) return true;
  if (!level.unlockRequirement) return true;
  return previousBestScore >= level.unlockRequirement;
}

// Scoring constants
export const SCORING = {
  BASE_POINTS_PER_CELL: 100,
  TIME_BONUS_MULTIPLIER: 0.5,     // Points per second saved
  STREAK_BONUS_MULTIPLIER: 25,    // Extra points per streak level
  PERFECT_BONUS: 500,             // Bonus for 100% accuracy
  DIFFICULTY_MULTIPLIER: {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    extreme: 3.0,
  },
} as const;
