import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Level, Cell, GameResult, LevelProgress } from '../types';
import { SCORING, getLevelById } from '../data/levels';

interface MemoryGameStore {
  // Game state
  gameState: GameState;
  currentLevel: Level | null;
  cells: Cell[];
  pattern: number[];           // Array of cell IDs in the pattern
  playerSelections: number[];  // Array of cell IDs player has selected
  currentPatternIndex: number; // Which cell in pattern is being shown

  // Timing
  startTime: number | null;
  completionTime: number | null;

  // Stats for current round
  streak: number;

  // Results
  lastResults: GameResult | null;

  // Actions
  setGameState: (state: GameState) => void;
  selectLevel: (level: Level) => void;
  initializeGrid: () => void;
  generatePattern: () => void;
  showNextPatternCell: () => void;
  selectCell: (cellId: number) => void;
  startPlaying: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  completeGame: () => void;
  failGame: () => void;
}

interface MemoryProgressStore {
  levelProgress: Record<number, LevelProgress>;
  updateLevelProgress: (levelId: number, result: GameResult) => void;
  getLevelProgress: (levelId: number) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: number) => boolean;
}

// Helper to create initial grid
function createGrid(size: number): Cell[] {
  const cells: Cell[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const id = row * size + col;
      cells.push({
        id,
        row,
        col,
        isActive: false,
        isSelected: false,
        isInPattern: false,
      });
    }
  }
  return cells;
}

// Helper to generate random pattern
function generateRandomPattern(gridSize: number, patternLength: number): number[] {
  const totalCells = gridSize * gridSize;
  const indices: number[] = [];

  while (indices.length < patternLength) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  return indices;
}

// Calculate score
function calculateScore(
  correctCells: number,
  totalCells: number,
  wrongCells: number,
  completionTime: number,
  maxTime: number,
  streak: number,
  difficulty: Level['difficulty']
): GameResult {
  const accuracy = totalCells > 0 ? (correctCells / totalCells) * 100 : 0;
  const isPerfect = correctCells === totalCells && wrongCells === 0;

  // Base score
  let score = correctCells * SCORING.BASE_POINTS_PER_CELL;

  // Time bonus (faster = more points)
  const timeRemaining = Math.max(0, maxTime - completionTime);
  const timeBonus = Math.floor((timeRemaining / 1000) * SCORING.TIME_BONUS_MULTIPLIER * 100);

  // Streak bonus
  const streakBonus = streak * SCORING.STREAK_BONUS_MULTIPLIER;

  // Perfect bonus
  if (isPerfect) {
    score += SCORING.PERFECT_BONUS;
  }

  // Apply difficulty multiplier
  const difficultyMultiplier = SCORING.DIFFICULTY_MULTIPLIER[difficulty];
  score = Math.floor((score + timeBonus + streakBonus) * difficultyMultiplier);

  return {
    score,
    accuracy,
    timeBonus,
    streakBonus,
    totalCells,
    correctCells,
    wrongCells,
    completionTime,
    level: 0, // Will be set by caller
    isPerfect,
  };
}

export const useMemoryGameStore = create<MemoryGameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  currentLevel: null,
  cells: [],
  pattern: [],
  playerSelections: [],
  currentPatternIndex: -1,
  startTime: null,
  completionTime: null,
  streak: 0,
  lastResults: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectLevel: (level) => {
    set({
      currentLevel: level,
      gameState: 'countdown',
    });
    // Initialize after state change
    setTimeout(() => get().initializeGrid(), 0);
  },

  initializeGrid: () => {
    const { currentLevel } = get();
    if (!currentLevel) return;

    const cells = createGrid(currentLevel.gridSize);
    set({
      cells,
      pattern: [],
      playerSelections: [],
      currentPatternIndex: -1,
      streak: 0,
      startTime: null,
      completionTime: null,
    });
  },

  generatePattern: () => {
    const { currentLevel, cells } = get();
    if (!currentLevel) return;

    const pattern = generateRandomPattern(currentLevel.gridSize, currentLevel.patternLength);

    // Mark cells in pattern
    const updatedCells = cells.map(cell => ({
      ...cell,
      isInPattern: pattern.includes(cell.id),
      isActive: false,
      isSelected: false,
      isCorrect: undefined,
    }));

    set({
      pattern,
      cells: updatedCells,
      currentPatternIndex: -1,
      gameState: 'showing',
    });
  },

  showNextPatternCell: () => {
    const { pattern, currentPatternIndex, cells, currentLevel } = get();
    if (!currentLevel) return;

    const nextIndex = currentPatternIndex + 1;

    // Check if we've shown all cells
    if (nextIndex >= pattern.length) {
      // Reset all cells to inactive and switch to playing
      const resetCells = cells.map(cell => ({
        ...cell,
        isActive: false,
      }));
      set({
        cells: resetCells,
        currentPatternIndex: -1,
      });
      get().startPlaying();
      return;
    }

    // Activate current cell, deactivate previous
    const updatedCells = cells.map(cell => ({
      ...cell,
      isActive: cell.id === pattern[nextIndex],
    }));

    set({
      cells: updatedCells,
      currentPatternIndex: nextIndex,
    });
  },

  selectCell: (cellId) => {
    const { gameState, cells, pattern, playerSelections, streak, currentLevel } = get();
    if (gameState !== 'playing' || !currentLevel) return;

    // Can't select already selected cells
    if (playerSelections.includes(cellId)) return;

    const isCorrect = pattern.includes(cellId);
    const newSelections = [...playerSelections, cellId];
    let newStreak = streak;

    if (isCorrect) {
      newStreak++;
    } else {
      newStreak = 0;
    }

    // Update cell state
    const updatedCells = cells.map(cell => {
      if (cell.id === cellId) {
        return {
          ...cell,
          isSelected: true,
          isCorrect,
        };
      }
      return cell;
    });

    set({
      cells: updatedCells,
      playerSelections: newSelections,
      streak: newStreak,
    });

    // Check if player has selected enough cells
    const correctSelections = newSelections.filter(id => pattern.includes(id)).length;
    const wrongSelections = newSelections.filter(id => !pattern.includes(id)).length;

    // Game ends when:
    // 1. Player has found all pattern cells, or
    // 2. Player has made too many wrong guesses (more than 2), or
    // 3. Player has made enough selections (pattern length + 2 wrong allowed)
    const maxWrongAllowed = 2;

    if (correctSelections === pattern.length) {
      // Success!
      setTimeout(() => get().completeGame(), 300);
    } else if (wrongSelections > maxWrongAllowed) {
      // Too many mistakes
      setTimeout(() => get().failGame(), 300);
    }
  },

  startPlaying: () => {
    set({
      gameState: 'playing',
      startTime: Date.now(),
    });
  },

  pauseGame: () => {
    const { gameState } = get();
    if (gameState === 'playing') {
      set({ gameState: 'paused' });
    }
  },

  resumeGame: () => {
    const { gameState } = get();
    if (gameState === 'paused') {
      set({ gameState: 'playing' });
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      currentLevel: null,
      cells: [],
      pattern: [],
      playerSelections: [],
      currentPatternIndex: -1,
      startTime: null,
      completionTime: null,
      streak: 0,
      lastResults: null,
    });
  },

  completeGame: () => {
    const { currentLevel, pattern, playerSelections, startTime, streak } = get();
    if (!currentLevel || !startTime) return;

    const completionTime = Date.now() - startTime;
    const correctCells = playerSelections.filter(id => pattern.includes(id)).length;
    const wrongCells = playerSelections.filter(id => !pattern.includes(id)).length;

    // Max time is based on pattern length and display time
    const maxTime = currentLevel.patternLength * currentLevel.displayTime +
                    currentLevel.patternLength * 2000; // 2 seconds per cell for input

    const result = calculateScore(
      correctCells,
      pattern.length,
      wrongCells,
      completionTime,
      maxTime,
      streak,
      currentLevel.difficulty
    );
    result.level = currentLevel.id;

    set({
      gameState: 'results',
      completionTime,
      lastResults: result,
    });
  },

  failGame: () => {
    const { currentLevel, pattern, playerSelections, startTime, streak } = get();
    if (!currentLevel) return;

    const completionTime = startTime ? Date.now() - startTime : 0;
    const correctCells = playerSelections.filter(id => pattern.includes(id)).length;
    const wrongCells = playerSelections.filter(id => !pattern.includes(id)).length;

    const result = calculateScore(
      correctCells,
      pattern.length,
      wrongCells,
      completionTime,
      0,
      streak,
      currentLevel.difficulty
    );
    result.level = currentLevel.id;

    set({
      gameState: 'failed',
      completionTime,
      lastResults: result,
    });
  },
}));

export const useMemoryProgressStore = create<MemoryProgressStore>()(
  persist(
    (set, get) => ({
      levelProgress: {
        1: {
          levelId: 1,
          highScore: 0,
          bestAccuracy: 0,
          timesPlayed: 0,
          timesCompleted: 0,
          unlocked: true,
        },
      },

      updateLevelProgress: (levelId, result) => {
        const { levelProgress } = get();
        const current = levelProgress[levelId] || {
          levelId,
          highScore: 0,
          bestAccuracy: 0,
          timesPlayed: 0,
          timesCompleted: 0,
          unlocked: true,
        };

        const updated: LevelProgress = {
          ...current,
          highScore: Math.max(current.highScore, result.score),
          bestAccuracy: Math.max(current.bestAccuracy, result.accuracy),
          timesPlayed: current.timesPlayed + 1,
          timesCompleted: result.isPerfect || result.accuracy >= 70
            ? current.timesCompleted + 1
            : current.timesCompleted,
        };

        // Check if next level should be unlocked
        const nextLevel = getLevelById(levelId + 1);
        let nextLevelProgress = levelProgress[levelId + 1];

        if (nextLevel && result.accuracy >= (nextLevel.unlockRequirement || 0)) {
          nextLevelProgress = {
            levelId: levelId + 1,
            highScore: 0,
            bestAccuracy: 0,
            timesPlayed: 0,
            timesCompleted: 0,
            unlocked: true,
          };
        }

        set({
          levelProgress: {
            ...levelProgress,
            [levelId]: updated,
            ...(nextLevelProgress ? { [levelId + 1]: nextLevelProgress } : {}),
          },
        });
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress[levelId];
      },

      isLevelUnlocked: (levelId) => {
        const { levelProgress } = get();
        if (levelId === 1) return true;

        const progress = levelProgress[levelId];
        if (progress?.unlocked) return true;

        // Check if previous level has high enough score
        const prevProgress = levelProgress[levelId - 1];
        const level = getLevelById(levelId);

        if (!level || !prevProgress) return false;
        return prevProgress.bestAccuracy >= (level.unlockRequirement || 0);
      },
    }),
    {
      name: 'memory-matrix-progress',
    }
  )
);
