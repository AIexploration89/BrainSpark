import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  WordCategory,
  Level,
  WordChallenge,
  WordResult,
  GameResult,
  LevelProgress,
  ComboState,
  LetterTile,
} from '../types';
import { SCORING, DIFFICULTY_CONFIG } from '../types';
import { generateWordChallenges, getLevelById } from '../data/levels';

interface WordBuilderGameStore {
  // Game state
  gameState: GameState;
  selectedCategory: WordCategory | null;
  currentLevel: Level | null;

  // Challenges
  challenges: WordChallenge[];
  currentChallengeIndex: number;
  placedLetters: (LetterTile | null)[];
  availableLetters: LetterTile[];

  // Round state
  wordResults: WordResult[];
  hintsUsedThisRound: number;
  attemptsOnCurrentWord: number;

  // Timing
  roundStartTime: number | null;
  wordStartTime: number | null;
  timeRemaining: number | null;

  // Combo
  combo: ComboState;

  // Results
  lastResults: GameResult | null;

  // Actions
  setGameState: (state: GameState) => void;
  selectCategory: (category: WordCategory) => void;
  selectLevel: (level: Level) => void;
  startRound: () => void;
  placeLetter: (letterId: string, slotIndex: number) => void;
  removeLetter: (slotIndex: number) => void;
  submitWord: () => void;
  useHint: () => void;
  skipWord: () => void;
  nextWord: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishRound: () => void;
  resetGame: () => void;
  tickTimer: () => void;
  shuffleAvailable: () => void;
}

interface WordBuilderProgressStore {
  levelProgress: Record<number, LevelProgress>;
  updateLevelProgress: (levelId: number, result: GameResult) => void;
  getLevelProgress: (levelId: number) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: number) => boolean;
  getTotalStars: () => number;
  getCategoryStars: (category: WordCategory) => number;
}

// Calculate score for a word
function calculateWordScore(
  isCorrect: boolean,
  timeSpent: number,
  hintsUsed: number,
  combo: ComboState,
  difficulty: Level['difficulty']
): number {
  if (!isCorrect) return 0;

  let score = SCORING.BASE_POINTS;

  // Time bonus
  if (timeSpent < SCORING.TIME_BONUS_THRESHOLD) {
    const timeRatio = 1 - (timeSpent / SCORING.TIME_BONUS_THRESHOLD);
    score += Math.floor(SCORING.TIME_BONUS_MAX * timeRatio);
  }

  // Hint penalty
  score -= hintsUsed * SCORING.HINT_PENALTY;
  score = Math.max(score, 10); // Minimum 10 points

  // Apply combo multiplier
  score = Math.floor(score * combo.multiplier);

  // Apply difficulty multiplier
  score = Math.floor(score * DIFFICULTY_CONFIG[difficulty].multiplier);

  return score;
}

// Calculate game result
function calculateGameResult(
  level: Level,
  wordResults: WordResult[],
  roundTime: number,
  hintsUsed: number,
  highestStreak: number
): GameResult {
  const correctWords = wordResults.filter(r => r.isCorrect).length;
  const wrongWords = wordResults.filter(r => !r.isCorrect && r.userWord !== '').length;
  const skippedWords = wordResults.filter(r => r.userWord === '' && !r.isCorrect).length;
  const perfectWords = wordResults.filter(r => r.isCorrect && r.hintsUsed === 0).length;

  const accuracy = wordResults.length > 0
    ? (correctWords / wordResults.length) * 100
    : 0;

  const totalTime = roundTime;
  const averageTime = wordResults.length > 0
    ? wordResults.reduce((sum, r) => sum + r.timeSpent, 0) / wordResults.length
    : 0;

  let score = wordResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Bonus points
  const bonusPoints = {
    streak: Math.floor(highestStreak * 15),
    speed: averageTime < 5000 ? 100 : averageTime < 8000 ? 50 : 0,
    perfect: accuracy === 100 ? SCORING.PERFECT_ROUND_BONUS : 0,
    noHints: hintsUsed === 0 ? SCORING.NO_HINTS_BONUS : 0,
  };

  score += bonusPoints.streak + bonusPoints.speed + bonusPoints.perfect + bonusPoints.noHints;

  return {
    levelId: level.id,
    category: level.category,
    difficulty: level.difficulty,
    totalWords: wordResults.length,
    correctWords,
    wrongWords,
    skippedWords,
    accuracy,
    totalTime,
    averageTime,
    score,
    hintsUsed,
    perfectWords,
    highestStreak,
    wordResults,
    bonusPoints,
  };
}

// Calculate stars
function calculateStars(accuracy: number): number {
  if (accuracy >= SCORING.STAR_THRESHOLDS.three) return 3;
  if (accuracy >= SCORING.STAR_THRESHOLDS.two) return 2;
  if (accuracy >= SCORING.STAR_THRESHOLDS.one) return 1;
  return 0;
}

// Calculate combo multiplier
function calculateMultiplier(streak: number): number {
  const steps = SCORING.STREAK_MULTIPLIER_STEPS;
  if (streak >= steps[3]) return 3.0;
  if (streak >= steps[2]) return 2.5;
  if (streak >= steps[1]) return 2.0;
  if (streak >= steps[0]) return 1.5;
  return 1.0;
}

export const useWordBuilderGameStore = create<WordBuilderGameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  selectedCategory: null,
  currentLevel: null,
  challenges: [],
  currentChallengeIndex: 0,
  placedLetters: [],
  availableLetters: [],
  wordResults: [],
  hintsUsedThisRound: 0,
  attemptsOnCurrentWord: 0,
  roundStartTime: null,
  wordStartTime: null,
  timeRemaining: null,
  combo: {
    current: 0,
    multiplier: 1.0,
    maxReached: 0,
    isOnFire: false,
  },
  lastResults: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectCategory: (category) => set({
    selectedCategory: category,
    gameState: 'level-select',
  }),

  selectLevel: (level) => {
    const challenges = generateWordChallenges(level);
    const firstChallenge = challenges[0];
    const wordLength = firstChallenge.word.word.length;

    set({
      currentLevel: level,
      challenges,
      currentChallengeIndex: 0,
      placedLetters: new Array(wordLength).fill(null),
      availableLetters: [...firstChallenge.scrambledLetters],
      wordResults: [],
      hintsUsedThisRound: 0,
      attemptsOnCurrentWord: 0,
      combo: {
        current: 0,
        multiplier: 1.0,
        maxReached: 0,
        isOnFire: false,
      },
      gameState: 'countdown',
    });
  },

  startRound: () => {
    const { currentLevel } = get();
    set({
      gameState: 'playing',
      roundStartTime: Date.now(),
      wordStartTime: Date.now(),
      timeRemaining: currentLevel?.timeLimit || null,
    });
  },

  placeLetter: (letterId, slotIndex) => {
    const { availableLetters, placedLetters } = get();

    // Find the letter in available letters
    const letterIndex = availableLetters.findIndex(l => l.id === letterId);
    if (letterIndex === -1) return;

    // Check if slot is empty
    if (placedLetters[slotIndex] !== null) return;

    const letter = availableLetters[letterIndex];

    // Update letter
    const updatedLetter = {
      ...letter,
      isPlaced: true,
      placedIndex: slotIndex,
    };

    // Remove from available and add to placed
    const newAvailable = availableLetters.filter(l => l.id !== letterId);
    const newPlaced = [...placedLetters];
    newPlaced[slotIndex] = updatedLetter;

    set({
      availableLetters: newAvailable,
      placedLetters: newPlaced,
    });
  },

  removeLetter: (slotIndex) => {
    const { placedLetters, availableLetters } = get();

    const letter = placedLetters[slotIndex];
    if (!letter) return;

    // Reset letter state
    const resetLetter = {
      ...letter,
      isPlaced: false,
      placedIndex: null,
    };

    // Remove from placed and add back to available
    const newPlaced = [...placedLetters];
    newPlaced[slotIndex] = null;

    set({
      placedLetters: newPlaced,
      availableLetters: [...availableLetters, resetLetter],
    });
  },

  submitWord: () => {
    const {
      challenges,
      currentChallengeIndex,
      placedLetters,
      wordStartTime,
      combo,
      currentLevel,
      wordResults,
      attemptsOnCurrentWord,
    } = get();

    if (!currentLevel) return;

    const currentChallenge = challenges[currentChallengeIndex];
    if (!currentChallenge) return;

    // Check if all slots are filled
    if (placedLetters.some(l => l === null)) return;

    const userWord = placedLetters.map(l => l!.letter).join('');
    const correctWord = currentChallenge.word.word;
    const isCorrect = userWord === correctWord;
    const timeSpent = wordStartTime ? Date.now() - wordStartTime : 0;

    if (isCorrect) {
      // Calculate score and update combo
      const newStreak = combo.current + 1;
      const newMultiplier = calculateMultiplier(newStreak);
      const newCombo: ComboState = {
        current: newStreak,
        multiplier: newMultiplier,
        maxReached: Math.max(combo.maxReached, newStreak),
        isOnFire: newStreak >= 6,
      };

      const pointsEarned = calculateWordScore(
        true,
        timeSpent,
        currentChallenge.hintUsed ? 1 : 0,
        newCombo,
        currentLevel.difficulty
      );

      const result: WordResult = {
        challenge: currentChallenge,
        userWord,
        isCorrect: true,
        timeSpent,
        pointsEarned,
        hintsUsed: currentChallenge.hintUsed ? 1 : 0,
        attemptsCount: attemptsOnCurrentWord + 1,
      };

      set({
        wordResults: [...wordResults, result],
        combo: newCombo,
        attemptsOnCurrentWord: 0,
      });

      // Check if round complete
      if (currentChallengeIndex >= challenges.length - 1) {
        setTimeout(() => get().finishRound(), 600);
      } else {
        setTimeout(() => get().nextWord(), 600);
      }
    } else {
      // Wrong answer - increment attempts and reset combo
      set({
        combo: {
          ...combo,
          current: 0,
          multiplier: 1.0,
          isOnFire: false,
        },
        attemptsOnCurrentWord: attemptsOnCurrentWord + 1,
      });

      // Clear placed letters back to available
      const allLetters = placedLetters.filter((l): l is LetterTile => l !== null);
      const resetLetters = allLetters.map(l => ({
        ...l,
        isPlaced: false,
        placedIndex: null,
      }));

      set({
        placedLetters: new Array(correctWord.length).fill(null),
        availableLetters: resetLetters.sort(() => Math.random() - 0.5),
      });
    }
  },

  useHint: () => {
    const {
      challenges,
      currentChallengeIndex,
      placedLetters,
      availableLetters,
      hintsUsedThisRound,
      currentLevel,
    } = get();

    if (!currentLevel) return;

    const currentChallenge = challenges[currentChallengeIndex];
    if (!currentChallenge) return;

    // Check if hints are allowed
    if (hintsUsedThisRound >= currentLevel.hintsAllowed) return;

    // Find first empty slot and place correct letter
    const correctWord = currentChallenge.word.word;
    const firstEmptyIndex = placedLetters.findIndex(l => l === null);

    if (firstEmptyIndex === -1) return;

    // Find the correct letter for this position
    const correctLetter = correctWord[firstEmptyIndex];
    const letterToPlace = availableLetters.find(l => l.letter === correctLetter);

    if (!letterToPlace) return;

    // Place the letter
    const updatedLetter = {
      ...letterToPlace,
      isPlaced: true,
      placedIndex: firstEmptyIndex,
    };

    const newAvailable = availableLetters.filter(l => l.id !== letterToPlace.id);
    const newPlaced = [...placedLetters];
    newPlaced[firstEmptyIndex] = updatedLetter;

    // Mark challenge as hint used
    const newChallenges = [...challenges];
    newChallenges[currentChallengeIndex] = {
      ...currentChallenge,
      hintUsed: true,
    };

    set({
      challenges: newChallenges,
      placedLetters: newPlaced,
      availableLetters: newAvailable,
      hintsUsedThisRound: hintsUsedThisRound + 1,
    });
  },

  skipWord: () => {
    const {
      challenges,
      currentChallengeIndex,
      wordStartTime,
      wordResults,
      combo,
      attemptsOnCurrentWord,
    } = get();

    const currentChallenge = challenges[currentChallengeIndex];
    if (!currentChallenge) return;

    const timeSpent = wordStartTime ? Date.now() - wordStartTime : 0;

    const result: WordResult = {
      challenge: currentChallenge,
      userWord: '',
      isCorrect: false,
      timeSpent,
      pointsEarned: 0,
      hintsUsed: currentChallenge.hintUsed ? 1 : 0,
      attemptsCount: attemptsOnCurrentWord,
    };

    // Reset combo
    const newCombo: ComboState = {
      ...combo,
      current: 0,
      multiplier: 1.0,
      isOnFire: false,
    };

    set({
      wordResults: [...wordResults, result],
      combo: newCombo,
      attemptsOnCurrentWord: 0,
    });

    // Check if round complete
    if (currentChallengeIndex >= challenges.length - 1) {
      setTimeout(() => get().finishRound(), 400);
    } else {
      get().nextWord();
    }
  },

  nextWord: () => {
    const { challenges, currentChallengeIndex, currentLevel } = get();

    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex >= challenges.length) return;

    const nextChallenge = challenges[nextIndex];
    const wordLength = nextChallenge.word.word.length;

    set({
      currentChallengeIndex: nextIndex,
      placedLetters: new Array(wordLength).fill(null),
      availableLetters: [...nextChallenge.scrambledLetters],
      wordStartTime: Date.now(),
      timeRemaining: currentLevel?.timeLimit || null,
      attemptsOnCurrentWord: 0,
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
        wordStartTime: Date.now(),
      });
    }
  },

  finishRound: () => {
    const { currentLevel, wordResults, roundStartTime, combo, hintsUsedThisRound } = get();
    if (!currentLevel || !roundStartTime) return;

    const totalTime = Date.now() - roundStartTime;
    const results = calculateGameResult(
      currentLevel,
      wordResults,
      totalTime,
      hintsUsedThisRound,
      combo.maxReached
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
    challenges: [],
    currentChallengeIndex: 0,
    placedLetters: [],
    availableLetters: [],
    wordResults: [],
    hintsUsedThisRound: 0,
    attemptsOnCurrentWord: 0,
    roundStartTime: null,
    wordStartTime: null,
    timeRemaining: null,
    combo: {
      current: 0,
      multiplier: 1.0,
      maxReached: 0,
      isOnFire: false,
    },
    lastResults: null,
  }),

  tickTimer: () => {
    const { timeRemaining, gameState } = get();
    if (gameState !== 'playing' || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      get().skipWord();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  shuffleAvailable: () => {
    const { availableLetters } = get();
    const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
    set({ availableLetters: shuffled });
  },
}));

// Progress store with persistence
export const useWordBuilderProgressStore = create<WordBuilderProgressStore>()(
  persist(
    (set, get) => ({
      levelProgress: {
        // First level of each category unlocked by default
        1: { levelId: 1, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        6: { levelId: 6, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        11: { levelId: 11, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        16: { levelId: 16, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        21: { levelId: 21, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        26: { levelId: 26, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
        31: { levelId: 31, highScore: 0, bestAccuracy: 0, bestStreak: 0, timesPlayed: 0, timesCompleted: 0, timesPerfect: 0, unlocked: true, stars: 0 },
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
        const isPerfect = result.accuracy === 100 && result.hintsUsed === 0;

        const updated: LevelProgress = {
          ...current,
          highScore: Math.max(current.highScore, result.score),
          bestAccuracy: Math.max(current.bestAccuracy, result.accuracy),
          bestStreak: Math.max(current.bestStreak, result.highestStreak),
          timesPlayed: current.timesPlayed + 1,
          timesCompleted: result.accuracy >= 70 ? current.timesCompleted + 1 : current.timesCompleted,
          timesPerfect: isPerfect ? current.timesPerfect + 1 : current.timesPerfect,
          stars: Math.max(current.stars, newStars),
        };

        const updates: Record<number, LevelProgress> = { [levelId]: updated };

        // Check for unlocking next level
        const level = getLevelById(levelId);
        if (level) {
          const nextLevelId = levelId + 1;
          const nextLevel = getLevelById(nextLevelId);
          if (nextLevel?.unlockRequirement?.levelId === levelId) {
            if (result.score >= nextLevel.unlockRequirement.minScore && !levelProgress[nextLevelId]?.unlocked) {
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

        // First levels of each category are always unlocked
        if ([1, 6, 11, 16, 21, 26, 31].includes(levelId)) return true;

        const progress = levelProgress[levelId];
        if (progress?.unlocked) return true;

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
        const categoryRanges: Record<WordCategory, [number, number]> = {
          animals: [1, 5],
          colors: [6, 10],
          food: [11, 15],
          nature: [16, 20],
          actions: [21, 25],
          objects: [26, 30],
          mixed: [31, 35],
        };

        const [start, end] = categoryRanges[category];
        let stars = 0;

        for (let id = start; id <= end; id++) {
          stars += levelProgress[id]?.stars || 0;
        }

        return stars;
      },
    }),
    {
      name: 'word-builder-progress',
    }
  )
);
