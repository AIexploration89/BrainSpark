import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  AnimalCategory,
  Level,
  Question,
  QuestionResult,
  GameResult,
  LevelProgress,
  ComboState,
  ZoologistStats,
  ZoologistRank,
} from '../types';
import { SCORING, DIFFICULTY_CONFIG } from '../types';
import { generateQuestions, getLevelById } from '../data/levels';

interface AnimalGameStore {
  // Game state
  gameState: GameState;
  selectedCategory: AnimalCategory | null;
  currentLevel: Level | null;

  // Questions
  questions: Question[];
  currentQuestionIndex: number;
  questionResults: QuestionResult[];

  // Timing
  roundStartTime: number | null;
  questionStartTime: number | null;
  timeRemaining: number | null;

  // Combo system
  combo: ComboState;

  // Results
  lastResults: GameResult | null;

  // Hints
  hintUsedThisQuestion: boolean;
  totalHintsUsed: number;

  // Actions
  setGameState: (state: GameState) => void;
  selectCategory: (category: AnimalCategory) => void;
  selectLevel: (level: Level) => void;
  startRound: () => void;
  submitAnswer: (answerId: string | null) => void;
  useHint: () => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishRound: () => void;
  resetGame: () => void;
  tickTimer: () => void;
}

interface AnimalProgressStore {
  levelProgress: Record<number, LevelProgress>;
  zoologistStats: ZoologistStats;
  updateLevelProgress: (levelId: number, result: GameResult) => void;
  getLevelProgress: (levelId: number) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: number) => boolean;
  getTotalStars: () => number;
  getCategoryStars: (category: AnimalCategory) => number;
  getZoologistRank: () => ZoologistRank;
}

// Calculate score for a single question
function calculateQuestionScore(
  isCorrect: boolean,
  timeSpent: number,
  combo: ComboState,
  difficulty: Level['difficulty'],
  usedHint: boolean
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

  // Hint penalty
  if (usedHint) {
    score = Math.max(0, score - SCORING.HINT_PENALTY);
  }

  return score;
}

// Calculate final game result
function calculateGameResult(
  level: Level,
  questionResults: QuestionResult[],
  roundTime: number,
  highestStreak: number,
  hintsUsed: number
): GameResult {
  const correctAnswers = questionResults.filter(r => r.isCorrect).length;
  const wrongAnswers = questionResults.filter(r => !r.isCorrect && r.selectedAnswer !== null).length;
  const skippedAnswers = questionResults.filter(r => r.selectedAnswer === null).length;
  const accuracy = questionResults.length > 0
    ? (correctAnswers / questionResults.length) * 100
    : 0;

  const totalTime = roundTime;
  const averageTime = questionResults.length > 0
    ? questionResults.reduce((sum, r) => sum + r.timeSpent, 0) / questionResults.length
    : 0;

  // Calculate base score
  let score = questionResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Bonus calculations
  const bonusPoints = {
    streak: Math.floor(highestStreak * 15),
    speed: averageTime < 5000 ? 150 : averageTime < 8000 ? 75 : 0,
    perfect: accuracy === 100 ? SCORING.PERFECT_ROUND_BONUS : 0,
    noHints: hintsUsed === 0 ? SCORING.NO_HINTS_BONUS : 0,
  };

  score += bonusPoints.streak + bonusPoints.speed + bonusPoints.perfect + bonusPoints.noHints;

  // Track new animals learned
  const newAnimalsLearned = questionResults
    .filter(r => r.isCorrect)
    .map(r => r.question.correctAnswerId)
    .filter((id, index, self) => self.indexOf(id) === index);

  return {
    levelId: level.id,
    category: level.category,
    difficulty: level.difficulty,
    totalQuestions: questionResults.length,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    accuracy,
    totalTime,
    averageTime,
    score,
    highestStreak,
    perfectRound: accuracy === 100 && wrongAnswers === 0,
    hintsUsed,
    questionResults,
    bonusPoints,
    newAnimalsLearned,
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

// Calculate zoologist rank based on animals learned
function calculateZoologistRank(animalsCount: number): ZoologistRank {
  if (animalsCount >= 121) return 'wildlife-master';
  if (animalsCount >= 81) return 'conservationist';
  if (animalsCount >= 51) return 'biologist';
  if (animalsCount >= 26) return 'naturalist';
  if (animalsCount >= 11) return 'tracker';
  return 'observer';
}

export const useAnimalGameStore = create<AnimalGameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  selectedCategory: null,
  currentLevel: null,
  questions: [],
  currentQuestionIndex: 0,
  questionResults: [],
  roundStartTime: null,
  questionStartTime: null,
  timeRemaining: null,
  combo: {
    current: 0,
    multiplier: 1.0,
    maxReached: 0,
    isOnFire: false,
  },
  lastResults: null,
  hintUsedThisQuestion: false,
  totalHintsUsed: 0,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectCategory: (category) => set({
    selectedCategory: category,
    gameState: 'level-select',
  }),

  selectLevel: (level) => {
    const questions = generateQuestions(level);

    set({
      currentLevel: level,
      questions,
      currentQuestionIndex: 0,
      questionResults: [],
      combo: {
        current: 0,
        multiplier: 1.0,
        maxReached: 0,
        isOnFire: false,
      },
      hintUsedThisQuestion: false,
      totalHintsUsed: 0,
      gameState: 'countdown',
    });
  },

  startRound: () => {
    const { currentLevel } = get();
    set({
      gameState: 'playing',
      roundStartTime: Date.now(),
      questionStartTime: Date.now(),
      timeRemaining: currentLevel?.timeLimit || null,
    });
  },

  submitAnswer: (answerId) => {
    const {
      questions,
      currentQuestionIndex,
      questionStartTime,
      combo,
      currentLevel,
      questionResults,
      hintUsedThisQuestion,
    } = get();

    if (!currentLevel || currentQuestionIndex >= questions.length) return;

    const question = questions[currentQuestionIndex];
    const timeSpent = questionStartTime ? Date.now() - questionStartTime : 0;
    const selectedOption = question.options.find(o => o.id === answerId);
    const isCorrect = selectedOption?.isCorrect ?? false;

    // Update combo
    let newCombo: ComboState;
    if (isCorrect) {
      const newStreak = combo.current + 1;
      const newMultiplier = calculateMultiplier(newStreak);
      newCombo = {
        current: newStreak,
        multiplier: newMultiplier,
        maxReached: Math.max(combo.maxReached, newStreak),
        isOnFire: newStreak >= 8,
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
    const pointsEarned = calculateQuestionScore(
      isCorrect,
      timeSpent,
      isCorrect ? newCombo : combo,
      currentLevel.difficulty,
      hintUsedThisQuestion
    );

    // Record result
    const result: QuestionResult = {
      question,
      selectedAnswer: answerId,
      isCorrect,
      timeSpent,
      pointsEarned,
      usedHint: hintUsedThisQuestion,
    };

    const newResults = [...questionResults, result];

    set({
      questionResults: newResults,
      combo: newCombo,
      hintUsedThisQuestion: false,
    });

    // Check if round is complete
    if (currentQuestionIndex >= questions.length - 1) {
      setTimeout(() => get().finishRound(), 800);
    } else {
      // Move to next question
      setTimeout(() => get().nextQuestion(), 500);
    }
  },

  useHint: () => {
    const { hintUsedThisQuestion, totalHintsUsed } = get();
    if (!hintUsedThisQuestion) {
      set({
        hintUsedThisQuestion: true,
        totalHintsUsed: totalHintsUsed + 1,
      });
    }
  },

  skipQuestion: () => {
    const { questions, currentQuestionIndex, questionStartTime, questionResults, combo, hintUsedThisQuestion } = get();

    if (currentQuestionIndex >= questions.length) return;

    const question = questions[currentQuestionIndex];
    const timeSpent = questionStartTime ? Date.now() - questionStartTime : 0;

    // Record skipped result
    const result: QuestionResult = {
      question,
      selectedAnswer: null,
      isCorrect: false,
      timeSpent,
      pointsEarned: 0,
      usedHint: hintUsedThisQuestion,
    };

    // Reset combo on skip
    const newCombo: ComboState = {
      ...combo,
      current: 0,
      multiplier: 1.0,
      isOnFire: false,
    };

    set({
      questionResults: [...questionResults, result],
      combo: newCombo,
      hintUsedThisQuestion: false,
    });

    // Check if round is complete
    if (currentQuestionIndex >= questions.length - 1) {
      setTimeout(() => get().finishRound(), 500);
    } else {
      get().nextQuestion();
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, currentLevel } = get();
    set({
      currentQuestionIndex: currentQuestionIndex + 1,
      questionStartTime: Date.now(),
      timeRemaining: currentLevel?.timeLimit || null,
      hintUsedThisQuestion: false,
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
      set({
        gameState: 'playing',
        questionStartTime: Date.now(),
      });
    }
  },

  finishRound: () => {
    const { currentLevel, questionResults, roundStartTime, combo, totalHintsUsed } = get();
    if (!currentLevel || !roundStartTime) return;

    const totalTime = Date.now() - roundStartTime;
    const results = calculateGameResult(
      currentLevel,
      questionResults,
      totalTime,
      combo.maxReached,
      totalHintsUsed
    );

    set({
      gameState: 'results',
      lastResults: results,
    });
  },

  resetGame: () => set({
    gameState: 'menu',
    selectedCategory: null,
    currentLevel: null,
    questions: [],
    currentQuestionIndex: 0,
    questionResults: [],
    roundStartTime: null,
    questionStartTime: null,
    timeRemaining: null,
    combo: {
      current: 0,
      multiplier: 1.0,
      maxReached: 0,
      isOnFire: false,
    },
    lastResults: null,
    hintUsedThisQuestion: false,
    totalHintsUsed: 0,
  }),

  tickTimer: () => {
    const { timeRemaining, gameState } = get();
    if (gameState !== 'playing' || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      // Time's up - auto skip
      get().skipQuestion();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
}));

export const useAnimalProgressStore = create<AnimalProgressStore>()(
  persist(
    (set, get) => ({
      levelProgress: {
        // Unlock first level of each category by default
        1: { levelId: 1, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        7: { levelId: 7, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        13: { levelId: 13, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        19: { levelId: 19, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
      },

      zoologistStats: {
        animalsLearned: [],
        habitatsExplored: [],
        categoriesMastered: [],
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        totalPlayTime: 0,
        longestStreak: 0,
        perfectRounds: 0,
        favoriteCategory: null,
        zoologistRank: 'observer',
      },

      updateLevelProgress: (levelId, result) => {
        const { levelProgress, zoologistStats } = get();
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

        // Update zoologist stats
        const newAnimals = result.newAnimalsLearned.filter(
          a => !zoologistStats.animalsLearned.includes(a)
        );

        const updatedStats: ZoologistStats = {
          ...zoologistStats,
          animalsLearned: [...zoologistStats.animalsLearned, ...newAnimals],
          totalQuestionsAnswered: zoologistStats.totalQuestionsAnswered + result.totalQuestions,
          totalCorrect: zoologistStats.totalCorrect + result.correctAnswers,
          totalPlayTime: zoologistStats.totalPlayTime + result.totalTime,
          longestStreak: Math.max(zoologistStats.longestStreak, result.highestStreak),
          perfectRounds: result.perfectRound ? zoologistStats.perfectRounds + 1 : zoologistStats.perfectRounds,
          zoologistRank: calculateZoologistRank(zoologistStats.animalsLearned.length + newAnimals.length),
        };

        // Check if next level should be unlocked
        const updates: Record<number, LevelProgress> = { [levelId]: updated };

        const allLevelIds = Array.from({ length: 24 }, (_, i) => i + 1);
        for (const nextLevelId of allLevelIds) {
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
          zoologistStats: updatedStats,
        });
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress[levelId];
      },

      isLevelUnlocked: (levelId) => {
        const { levelProgress } = get();

        // First levels of each category are always unlocked
        if ([1, 7, 13, 19].includes(levelId)) return true;

        const progress = levelProgress[levelId];
        if (progress?.unlocked) return true;

        // Check unlock requirement
        const level = getLevelById(levelId);
        if (!level?.unlockRequirement) return false;

        const prevProgress = levelProgress[level.unlockRequirement.levelId];
        return (prevProgress?.highScore || 0) >= level.unlockRequirement.minScore;
      },

      getTotalStars: () => {
        const { levelProgress } = get();
        return Object.values(levelProgress).reduce((sum, p) => sum + p.stars, 0);
      },

      getCategoryStars: (category) => {
        const { levelProgress } = get();
        const categoryRanges: Record<AnimalCategory, [number, number]> = {
          'mammals': [1, 6],
          'birds': [7, 12],
          'ocean-life': [13, 18],
          'reptiles-amphibians': [19, 24],
        };

        const [start, end] = categoryRanges[category];
        let stars = 0;

        for (let id = start; id <= end; id++) {
          stars += levelProgress[id]?.stars || 0;
        }

        return stars;
      },

      getZoologistRank: () => {
        return get().zoologistStats.zoologistRank;
      },
    }),
    {
      name: 'animal-kingdom-progress',
    }
  )
);
