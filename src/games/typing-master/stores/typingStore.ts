import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameMode,
  TypingLevel,
  Keystroke,
  KeyError,
  GameResults,
  LevelProgress,
  TypingProgress,
  Character,
  WordRainWord,
} from '../types';
import { isLevelUnlocked } from '../data/levels';

interface TypingGameState {
  // Game configuration
  currentLevel: TypingLevel | null;
  currentMode: GameMode;

  // Text state
  targetText: string;
  characters: Character[];
  currentIndex: number;

  // Metrics
  startTime: number | null;
  keystrokes: Keystroke[];
  errors: KeyError[];
  correctStreak: number;
  maxStreak: number;

  // Game state
  gameState: 'menu' | 'level-select' | 'mode-select' | 'countdown' | 'playing' | 'paused' | 'results' | 'failed';
  isComplete: boolean;

  // Timer (for timed modes)
  timeRemaining: number | null;
  timerDuration: number | null;

  // Word Rain specific
  wordRainWords: WordRainWord[];
  wordRainLives: number;
  wordRainScore: number;

  // Results
  lastResults: GameResults | null;

  // Actions
  setGameState: (state: TypingGameState['gameState']) => void;
  selectLevel: (level: TypingLevel) => void;
  selectMode: (mode: GameMode) => void;
  setTargetText: (text: string) => void;
  startGame: () => void;
  handleKeyPress: (key: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  completeGame: () => void;
  failGame: () => void;
  updateTimer: (remaining: number) => void;
  setTimerDuration: (duration: number) => void;

  // Word Rain actions
  addWordRainWord: (word: WordRainWord) => void;
  updateWordRainWord: (id: string, updates: Partial<WordRainWord>) => void;
  removeWordRainWord: (id: string) => void;
  loseWordRainLife: () => void;
  addWordRainScore: (points: number) => void;

  // Computed getters
  getWpm: () => number;
  getCpm: () => number;
  getAccuracy: () => number;
}

interface TypingProgressState {
  progress: TypingProgress;

  // Actions
  updateLevelProgress: (levelId: number, results: GameResults) => void;
  isLevelUnlocked: (levelId: number) => boolean;
  getLevelProgress: (levelId: number) => LevelProgress | null;
  resetProgress: () => void;
}

const defaultProgress: TypingProgress = {
  levels: {},
  currentLevel: 1,
  totalXpEarned: 0,
  totalSparksEarned: 0,
};

// Game state store (non-persisted)
export const useTypingGameStore = create<TypingGameState>((set, get) => ({
  // Initial state
  currentLevel: null,
  currentMode: 'practice',
  targetText: '',
  characters: [],
  currentIndex: 0,
  startTime: null,
  keystrokes: [],
  errors: [],
  correctStreak: 0,
  maxStreak: 0,
  gameState: 'menu',
  isComplete: false,
  timeRemaining: null,
  timerDuration: null,
  wordRainWords: [],
  wordRainLives: 3,
  wordRainScore: 0,
  lastResults: null,

  // Actions
  setGameState: (gameState) => set({ gameState }),

  selectLevel: (level) => set({ currentLevel: level, gameState: 'mode-select' }),

  selectMode: (mode) => set({ currentMode: mode }),

  setTargetText: (text) => {
    const characters: Character[] = text.split('').map((char, index) => ({
      char,
      state: index === 0 ? 'current' : 'pending',
      index,
    }));
    set({ targetText: text, characters, currentIndex: 0 });
  },

  startGame: () => {
    const { currentMode, timerDuration } = get();
    set({
      gameState: 'playing',
      startTime: Date.now(),
      keystrokes: [],
      errors: [],
      correctStreak: 0,
      maxStreak: 0,
      currentIndex: 0,
      isComplete: false,
      timeRemaining: currentMode === 'time-attack' && timerDuration ? timerDuration : null,
      wordRainWords: [],
      wordRainLives: 3,
      wordRainScore: 0,
    });

    // Reset character states
    const { characters } = get();
    const resetChars = characters.map((char, idx) => ({
      ...char,
      state: idx === 0 ? 'current' : 'pending',
    })) as Character[];
    set({ characters: resetChars });
  },

  handleKeyPress: (key) => {
    const { characters, currentIndex, keystrokes, errors, correctStreak, maxStreak, currentMode } = get();

    if (currentIndex >= characters.length) return;

    const expectedChar = characters[currentIndex].char;
    const isCorrect = key.toLowerCase() === expectedChar.toLowerCase() ||
                      (key === expectedChar); // For exact match including case

    // Record keystroke
    const keystroke: Keystroke = {
      key,
      expected: expectedChar,
      timestamp: Date.now(),
      correct: isCorrect,
    };

    const newKeystrokes = [...keystrokes, keystroke];

    // Update errors if incorrect
    let newErrors = [...errors];
    if (!isCorrect) {
      const existingError = newErrors.find(e => e.expected === expectedChar);
      if (existingError) {
        existingError.count++;
      } else {
        newErrors.push({ key, expected: expectedChar, count: 1 });
      }
    }

    // Update streak
    let newStreak = isCorrect ? correctStreak + 1 : 0;
    let newMaxStreak = Math.max(maxStreak, newStreak);

    // Update characters
    const newChars = characters.map((char, idx) => {
      if (idx === currentIndex) {
        return { ...char, state: isCorrect ? 'correct' : 'incorrect' } as Character;
      }
      if (idx === currentIndex + 1) {
        return { ...char, state: 'current' } as Character;
      }
      return char;
    });

    // Check for accuracy challenge failure
    if (currentMode === 'accuracy-challenge') {
      const totalKeystrokes = newKeystrokes.length;
      const correctKeystrokes = newKeystrokes.filter(k => k.correct).length;
      const accuracy = totalKeystrokes > 0 ? (correctKeystrokes / totalKeystrokes) * 100 : 100;

      if (accuracy < 95 && totalKeystrokes >= 10) {
        set({
          keystrokes: newKeystrokes,
          errors: newErrors,
          correctStreak: newStreak,
          maxStreak: newMaxStreak,
          characters: newChars,
          currentIndex: currentIndex + 1,
        });
        get().failGame();
        return;
      }
    }

    const newIndex = currentIndex + 1;
    const isComplete = newIndex >= characters.length;

    set({
      keystrokes: newKeystrokes,
      errors: newErrors,
      correctStreak: newStreak,
      maxStreak: newMaxStreak,
      characters: newChars,
      currentIndex: newIndex,
      isComplete,
    });

    // Auto-complete if finished
    if (isComplete && currentMode !== 'time-attack') {
      get().completeGame();
    }
  },

  pauseGame: () => set({ gameState: 'paused' }),

  resumeGame: () => set({ gameState: 'playing' }),

  resetGame: () => set({
    currentLevel: null,
    currentMode: 'practice',
    targetText: '',
    characters: [],
    currentIndex: 0,
    startTime: null,
    keystrokes: [],
    errors: [],
    correctStreak: 0,
    maxStreak: 0,
    gameState: 'menu',
    isComplete: false,
    timeRemaining: null,
    timerDuration: null,
    wordRainWords: [],
    wordRainLives: 3,
    wordRainScore: 0,
    lastResults: null,
  }),

  completeGame: () => {
    const state = get();
    const { currentLevel, currentMode, keystrokes, maxStreak, errors, startTime } = state;

    if (!currentLevel || !startTime) return;

    const timeElapsed = Date.now() - startTime;
    const wpm = state.getWpm();
    const cpm = state.getCpm();
    const accuracy = state.getAccuracy();
    const correctCount = keystrokes.filter(k => k.correct).length;
    const errorCount = keystrokes.filter(k => !k.correct).length;

    const results: GameResults = {
      levelId: currentLevel.id,
      mode: currentMode,
      wpm,
      cpm,
      accuracy,
      correctCount,
      errorCount,
      maxStreak,
      timeElapsed,
      completed: true,
      keyErrors: errors,
    };

    set({
      gameState: 'results',
      lastResults: results,
      isComplete: true,
    });
  },

  failGame: () => {
    const state = get();
    const { currentLevel, currentMode, keystrokes, maxStreak, errors, startTime: failStartTime } = state;

    if (!currentLevel || !failStartTime) return;

    const failTimeElapsed = Date.now() - failStartTime;
    const failWpm = state.getWpm();
    const failCpm = state.getCpm();
    const failAccuracy = state.getAccuracy();
    const failCorrectCount = keystrokes.filter(k => k.correct).length;
    const failErrorCount = keystrokes.filter(k => !k.correct).length;

    const failResults: GameResults = {
      levelId: currentLevel.id,
      mode: currentMode,
      wpm: failWpm,
      cpm: failCpm,
      accuracy: failAccuracy,
      correctCount: failCorrectCount,
      errorCount: failErrorCount,
      maxStreak,
      timeElapsed: failTimeElapsed,
      completed: false,
      keyErrors: errors,
    };

    set({
      gameState: 'failed',
      lastResults: failResults,
    });
  },

  updateTimer: (remaining) => {
    set({ timeRemaining: remaining });
    if (remaining <= 0) {
      get().completeGame();
    }
  },

  setTimerDuration: (duration) => set({ timerDuration: duration, timeRemaining: duration }),

  // Word Rain actions
  addWordRainWord: (word) => set((state) => ({
    wordRainWords: [...state.wordRainWords, word]
  })),

  updateWordRainWord: (id, updates) => set((state) => ({
    wordRainWords: state.wordRainWords.map(w => w.id === id ? { ...w, ...updates } : w),
  })),

  removeWordRainWord: (id) => set((state) => ({
    wordRainWords: state.wordRainWords.filter(w => w.id !== id),
  })),

  loseWordRainLife: () => {
    const { wordRainLives } = get();
    const newLives = wordRainLives - 1;
    set({ wordRainLives: newLives });
    if (newLives <= 0) {
      get().failGame();
    }
  },

  addWordRainScore: (points) => set((state) => ({
    wordRainScore: state.wordRainScore + points
  })),

  // Computed getters
  getWpm: () => {
    const { keystrokes, startTime } = get();
    if (!startTime || keystrokes.length === 0) return 0;

    const correctChars = keystrokes.filter(k => k.correct).length;
    const words = correctChars / 5; // Standard: 5 chars = 1 word
    const minutes = (Date.now() - startTime) / 60000;

    if (minutes === 0) return 0;
    return Math.round(words / minutes);
  },

  getCpm: () => {
    const { keystrokes, startTime } = get();
    if (!startTime || keystrokes.length === 0) return 0;

    const correctChars = keystrokes.filter(k => k.correct).length;
    const minutes = (Date.now() - startTime) / 60000;

    if (minutes === 0) return 0;
    return Math.round(correctChars / minutes);
  },

  getAccuracy: () => {
    const { keystrokes } = get();
    if (keystrokes.length === 0) return 100;

    const correct = keystrokes.filter(k => k.correct).length;
    return Math.round((correct / keystrokes.length) * 100);
  },
}));

// Progress store (persisted to localStorage)
export const useTypingProgressStore = create<TypingProgressState>()(
  persist(
    (set, get) => ({
      progress: defaultProgress,

      updateLevelProgress: (levelId, results) => {
        set((state) => {
          const existingProgress = state.progress.levels[levelId];

          const newLevelProgress: LevelProgress = {
            levelId,
            completed: results.completed || existingProgress?.completed || false,
            bestWpm: Math.max(results.wpm, existingProgress?.bestWpm || 0),
            bestAccuracy: Math.max(results.accuracy, existingProgress?.bestAccuracy || 0),
            bestStreak: Math.max(results.maxStreak, existingProgress?.bestStreak || 0),
            totalAttempts: (existingProgress?.totalAttempts || 0) + 1,
            totalTimeSpent: (existingProgress?.totalTimeSpent || 0) + results.timeElapsed,
            lastPlayedAt: Date.now(),
          };

          return {
            progress: {
              ...state.progress,
              levels: {
                ...state.progress.levels,
                [levelId]: newLevelProgress,
              },
            },
          };
        });
      },

      isLevelUnlocked: (levelId) => {
        const { progress } = get();
        const levelProgress: Record<number, { completed: boolean; bestAccuracy: number; bestWpm: number }> = {};

        Object.entries(progress.levels).forEach(([id, lp]) => {
          levelProgress[Number(id)] = {
            completed: lp.completed,
            bestAccuracy: lp.bestAccuracy,
            bestWpm: lp.bestWpm,
          };
        });

        return isLevelUnlocked(levelId, levelProgress);
      },

      getLevelProgress: (levelId) => {
        const { progress } = get();
        return progress.levels[levelId] || null;
      },

      resetProgress: () => set({ progress: defaultProgress }),
    }),
    {
      name: 'typing-master-progress',
    }
  )
);
