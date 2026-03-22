import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Operation,
  Level,
  Problem,
  ProblemResult,
  GameResult,
  LevelProgress,
  ComboState,
  InputMode,
} from '../types';
import { SCORING, DIFFICULTY_CONFIG } from '../types';
import { generateProblems, generateChoices, getLevelById } from '../data/levels';
import { useDifficultyStore } from '../../../stores/difficultyStore';

interface MathGameStore {
  // Game state
  gameState: GameState;
  selectedOperation: Operation | null;
  currentLevel: Level | null;
  inputMode: InputMode;

  // Problems
  problems: Problem[];
  currentProblemIndex: number;
  currentAnswer: string;
  problemResults: ProblemResult[];

  // Timing
  roundStartTime: number | null;
  problemStartTime: number | null;
  timeRemaining: number | null;
  timerDeadline: number | null;

  // Combo system
  combo: ComboState;

  // Results
  lastResults: GameResult | null;

  // Actions
  setGameState: (state: GameState) => void;
  selectOperation: (operation: Operation) => void;
  selectLevel: (level: Level) => void;
  setInputMode: (mode: InputMode) => void;
  startRound: () => void;
  submitAnswer: (answer: number) => void;
  updateAnswer: (digit: string) => void;
  clearAnswer: () => void;
  backspaceAnswer: () => void;
  skipProblem: () => void;
  nextProblem: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishRound: () => void;
  resetGame: () => void;
  tickTimer: () => void;
}

interface MathProgressStore {
  levelProgress: Record<number, LevelProgress>;
  updateLevelProgress: (levelId: number, result: GameResult) => void;
  getLevelProgress: (levelId: number) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: number) => boolean;
  getTotalStars: () => number;
  getOperationStars: (operation: Operation) => number;
}

// Calculate score for a single problem
function calculateProblemScore(
  isCorrect: boolean,
  timeSpent: number,
  combo: ComboState,
  difficulty: Level['difficulty']
): number {
  if (!isCorrect) return 0;

  let score = SCORING.BASE_POINTS;

  // Time bonus (faster = more points)
  if (timeSpent < SCORING.TIME_BONUS_THRESHOLD) {
    const timeRatio = 1 - (timeSpent / SCORING.TIME_BONUS_THRESHOLD);
    score += Math.floor(SCORING.TIME_BONUS_MAX * timeRatio);
  }

  // Apply combo multiplier
  score = Math.floor(score * combo.multiplier);

  // Apply difficulty multiplier
  score = Math.floor(score * DIFFICULTY_CONFIG[difficulty].multiplier);

  return score;
}

// Calculate final game result
function calculateGameResult(
  level: Level,
  problemResults: ProblemResult[],
  roundTime: number,
  highestStreak: number
): GameResult {
  const correctAnswers = problemResults.filter(r => r.isCorrect).length;
  const wrongAnswers = problemResults.filter(r => !r.isCorrect && r.userAnswer !== null).length;
  const skippedAnswers = problemResults.filter(r => r.userAnswer === null).length;
  const accuracy = problemResults.length > 0
    ? (correctAnswers / problemResults.length) * 100
    : 0;

  const totalTime = roundTime;
  const averageTime = problemResults.length > 0
    ? problemResults.reduce((sum, r) => sum + r.timeSpent, 0) / problemResults.length
    : 0;

  // Calculate base score
  let score = problemResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Bonus calculations
  const bonusPoints = {
    streak: Math.floor(highestStreak * 10),
    speed: averageTime < 3000 ? 100 : averageTime < 5000 ? 50 : 0,
    perfect: accuracy === 100 ? SCORING.PERFECT_ROUND_BONUS : 0,
    noMistakes: wrongAnswers === 0 && skippedAnswers === 0 ? SCORING.NO_MISTAKES_BONUS : 0,
  };

  score += bonusPoints.streak + bonusPoints.speed + bonusPoints.perfect + bonusPoints.noMistakes;

  return {
    levelId: level.id,
    operation: level.operation,
    difficulty: level.difficulty,
    totalProblems: problemResults.length,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    accuracy,
    totalTime,
    averageTime,
    score,
    highestStreak,
    perfectRound: accuracy === 100 && wrongAnswers === 0,
    problemResults,
    bonusPoints,
  };
}

// Calculate stars based on accuracy
function calculateStars(accuracy: number): number {
  if (accuracy >= SCORING.STAR_THRESHOLDS.three) return 3;
  if (accuracy >= SCORING.STAR_THRESHOLDS.two) return 2;
  if (accuracy >= SCORING.STAR_THRESHOLDS.one) return 1;
  return 0;
}

// Calculate combo multiplier based on streak
function calculateMultiplier(streak: number): number {
  const steps = SCORING.STREAK_MULTIPLIER_STEPS;
  if (streak >= steps[3]) return 3.0;
  if (streak >= steps[2]) return 2.5;
  if (streak >= steps[1]) return 2.0;
  if (streak >= steps[0]) return 1.5;
  return 1.0;
}

export const useMathGameStore = create<MathGameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  selectedOperation: null,
  currentLevel: null,
  inputMode: 'numpad',
  problems: [],
  currentProblemIndex: 0,
  currentAnswer: '',
  problemResults: [],
  roundStartTime: null,
  problemStartTime: null,
  timeRemaining: null,
  timerDeadline: null,
  combo: {
    current: 0,
    multiplier: 1.0,
    maxReached: 0,
    isOnFire: false,
  },
  lastResults: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectOperation: (operation) => set({
    selectedOperation: operation,
    gameState: 'level-select',
  }),

  selectLevel: (level) => {
    // Apply adaptive difficulty modifiers
    const difficultyStore = useDifficultyStore.getState();
    const adjustedLevel = {
      ...level,
      timeLimit: difficultyStore.applyTierToTimeLimit(level.timeLimit),
      problemCount: difficultyStore.applyTierToQuestionCount(level.problemCount),
    };

    const problems = generateProblems(adjustedLevel);
    // Add choices to each problem for multiple choice mode
    problems.forEach(p => {
      p.choices = generateChoices(p.correctAnswer);
    });

    set({
      currentLevel: adjustedLevel,
      problems,
      currentProblemIndex: 0,
      currentAnswer: '',
      problemResults: [],
      combo: {
        current: 0,
        multiplier: 1.0,
        maxReached: 0,
        isOnFire: false,
      },
      gameState: 'countdown',
    });
  },

  setInputMode: (mode) => set({ inputMode: mode }),

  startRound: () => {
    const { currentLevel } = get();
    const timeLimit = currentLevel?.timeLimit || null;
    set({
      gameState: 'playing',
      roundStartTime: Date.now(),
      problemStartTime: Date.now(),
      timeRemaining: timeLimit,
      timerDeadline: timeLimit ? Date.now() + timeLimit * 1000 : null,
    });
  },

  submitAnswer: (answer) => {
    const {
      problems,
      currentProblemIndex,
      problemStartTime,
      combo,
      currentLevel,
      problemResults,
    } = get();

    if (!currentLevel || currentProblemIndex >= problems.length) return;

    const problem = problems[currentProblemIndex];
    const timeSpent = problemStartTime ? Date.now() - problemStartTime : 0;
    const isCorrect = answer === problem.correctAnswer;

    // Update combo
    let newCombo: ComboState;
    if (isCorrect) {
      const newStreak = combo.current + 1;
      const newMultiplier = calculateMultiplier(newStreak);
      newCombo = {
        current: newStreak,
        multiplier: newMultiplier,
        maxReached: Math.max(combo.maxReached, newStreak),
        isOnFire: newStreak >= 10,
      };
    } else {
      newCombo = {
        ...combo,
        current: 0,
        multiplier: 1.0,
        isOnFire: false,
      };
    }

    // Calculate points
    const pointsEarned = calculateProblemScore(
      isCorrect,
      timeSpent,
      isCorrect ? newCombo : combo, // Use new combo for correct, old for wrong
      currentLevel.difficulty
    );

    // Record result
    const result: ProblemResult = {
      problem,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      pointsEarned,
    };

    const newResults = [...problemResults, result];

    set({
      problemResults: newResults,
      combo: newCombo,
      currentAnswer: '',
    });

    // Check if round is complete
    if (currentProblemIndex >= problems.length - 1) {
      setTimeout(() => get().finishRound(), 500);
    } else {
      // Move to next problem
      setTimeout(() => get().nextProblem(), 300);
    }
  },

  updateAnswer: (digit) => {
    const { currentAnswer } = get();
    // Limit answer length
    if (currentAnswer.length < 6) {
      set({ currentAnswer: currentAnswer + digit });
    }
  },

  clearAnswer: () => set({ currentAnswer: '' }),

  backspaceAnswer: () => {
    const { currentAnswer } = get();
    set({ currentAnswer: currentAnswer.slice(0, -1) });
  },

  skipProblem: () => {
    const { problems, currentProblemIndex, problemStartTime, problemResults, combo } = get();

    if (currentProblemIndex >= problems.length) return;

    const problem = problems[currentProblemIndex];
    const timeSpent = problemStartTime ? Date.now() - problemStartTime : 0;

    // Record skipped result
    const result: ProblemResult = {
      problem,
      userAnswer: null,
      isCorrect: false,
      timeSpent,
      pointsEarned: 0,
    };

    // Reset combo on skip
    const newCombo: ComboState = {
      ...combo,
      current: 0,
      multiplier: 1.0,
      isOnFire: false,
    };

    set({
      problemResults: [...problemResults, result],
      combo: newCombo,
      currentAnswer: '',
    });

    // Check if round is complete
    if (currentProblemIndex >= problems.length - 1) {
      setTimeout(() => get().finishRound(), 500);
    } else {
      get().nextProblem();
    }
  },

  nextProblem: () => {
    const { currentProblemIndex, currentLevel } = get();
    const timeLimit = currentLevel?.timeLimit || null;
    set({
      currentProblemIndex: currentProblemIndex + 1,
      problemStartTime: Date.now(),
      currentAnswer: '',
      timeRemaining: timeLimit,
      timerDeadline: timeLimit ? Date.now() + timeLimit * 1000 : null,
    });
  },

  pauseGame: () => {
    const { gameState, timerDeadline } = get();
    if (gameState === 'playing') {
      // Snapshot remaining time from deadline so we can restore on resume
      const timeRemaining = timerDeadline ? Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000)) : null;
      set({ gameState: 'paused', timeRemaining, timerDeadline: null });
    }
  },

  resumeGame: () => {
    const { gameState, timeRemaining } = get();
    if (gameState === 'paused') {
      set({
        gameState: 'playing',
        problemStartTime: Date.now(),
        timerDeadline: timeRemaining !== null ? Date.now() + timeRemaining * 1000 : null,
      });
    }
  },

  finishRound: () => {
    const { currentLevel, problemResults, roundStartTime, combo } = get();
    if (!currentLevel || !roundStartTime) return;

    const totalTime = Date.now() - roundStartTime;
    const results = calculateGameResult(
      currentLevel,
      problemResults,
      totalTime,
      combo.maxReached
    );

    // Record performance for adaptive difficulty suggestions
    useDifficultyStore.getState().recordPerformance({
      gameId: 'math-basics',
      levelId: currentLevel.id,
      accuracy: results.accuracy,
      score: results.score,
    });

    set({
      gameState: 'results',
      lastResults: results,
    });
  },

  resetGame: () => set({
    gameState: 'menu',
    selectedOperation: null,
    currentLevel: null,
    problems: [],
    currentProblemIndex: 0,
    currentAnswer: '',
    problemResults: [],
    roundStartTime: null,
    problemStartTime: null,
    timeRemaining: null,
    timerDeadline: null,
    combo: {
      current: 0,
      multiplier: 1.0,
      maxReached: 0,
      isOnFire: false,
    },
    lastResults: null,
  }),

  tickTimer: () => {
    const { timerDeadline, gameState } = get();
    if (gameState !== 'playing' || timerDeadline === null) return;

    const timeRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));

    if (timeRemaining <= 0) {
      // Time's up - auto submit or skip
      set({ timeRemaining: 0 });
      get().skipProblem();
    } else {
      set({ timeRemaining });
    }
  },
}));

export const useMathProgressStore = create<MathProgressStore>()(
  persist(
    (set, get) => ({
      levelProgress: {
        // Unlock first level of each operation by default
        1: { levelId: 1, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        6: { levelId: 6, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        11: { levelId: 11, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        16: { levelId: 16, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
      },

      updateLevelProgress: (levelId, result) => {
        const { levelProgress } = get();
        const current = levelProgress[levelId] || {
          levelId,
          highScore: 0,
          bestAccuracy: 0,
          bestStreak: 0,
          timesPlayed: 0,
          timesCompleted: 0,
          timesPerfect: 0,
          unlocked: true,
          stars: 0,
        };

        const newStars = calculateStars(result.accuracy);

        const updated: LevelProgress = {
          ...current,
          highScore: Math.max(current.highScore, result.score),
          bestAccuracy: Math.max(current.bestAccuracy, result.accuracy),
          bestStreak: Math.max(current.bestStreak, result.highestStreak),
          timesPlayed: current.timesPlayed + 1,
          timesCompleted: result.accuracy >= 70 ? current.timesCompleted + 1 : current.timesCompleted,
          timesPerfect: result.perfectRound ? current.timesPerfect + 1 : current.timesPerfect,
          stars: Math.max(current.stars, newStars),
        };

        // Check if next level should be unlocked
        const updates: Record<number, LevelProgress> = { [levelId]: updated };

        // Find next level by checking unlock requirements
        const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        for (const nextLevelId of allLevels) {
          const nextLevel = getLevelById(nextLevelId);
          if (nextLevel?.unlockRequirement?.levelId === levelId) {
            if (result.score >= nextLevel.unlockRequirement.minScore) {
              if (!levelProgress[nextLevelId]?.unlocked) {
                updates[nextLevelId] = {
                  levelId: nextLevelId,
                  highScore: 0,
                  bestAccuracy: 0,
                  bestStreak: 0,
                  timesPlayed: 0,
                  timesCompleted: 0,
                  timesPerfect: 0,
                  unlocked: true,
                  stars: 0,
                };
              }
            }
          }
        }

        set({
          levelProgress: {
            ...levelProgress,
            ...updates,
          },
        });
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress[levelId];
      },

      isLevelUnlocked: (levelId) => {
        const { levelProgress } = get();

        // First levels of each operation are always unlocked
        if ([1, 6, 11, 16].includes(levelId)) return true;

        // Already explicitly unlocked
        const progress = levelProgress[levelId];
        if (progress?.unlocked) return true;

        // Flexible unlock: allow access up to 2 levels ahead of highest completed
        // This lets kids who are "on a roll" try harder levels without grinding
        const level = getLevelById(levelId);
        if (!level) return false;

        // Check if any level in the same operation within 2 steps has been played
        const operationLevels = Object.values(levelProgress)
          .filter(p => {
            const l = getLevelById(p.levelId);
            return l && l.operation === level.operation && p.timesPlayed > 0;
          });

        if (operationLevels.length > 0) {
          const highestPlayed = Math.max(...operationLevels.map(p => p.levelId));
          if (levelId <= highestPlayed + 2) return true;
        }

        // Fall back to standard unlock requirement
        if (!level.unlockRequirement) return false;

        const prevProgress = levelProgress[level.unlockRequirement.levelId];
        return (prevProgress?.highScore || 0) >= level.unlockRequirement.minScore;
      },

      getTotalStars: () => {
        const { levelProgress } = get();
        return Object.values(levelProgress).reduce((sum, p) => sum + p.stars, 0);
      },

      getOperationStars: (operation) => {
        const { levelProgress } = get();
        // Get level IDs for this operation
        const operationLevelRanges: Record<Operation, [number, number]> = {
          addition: [1, 5],
          subtraction: [6, 10],
          multiplication: [11, 15],
          division: [16, 20],
          mixed: [21, 24],
        };

        const [start, end] = operationLevelRanges[operation];
        let stars = 0;

        for (let id = start; id <= end; id++) {
          stars += levelProgress[id]?.stars || 0;
        }

        return stars;
      },
    }),
    {
      name: 'math-basics-progress',
      version: 1,
    }
  )
);
