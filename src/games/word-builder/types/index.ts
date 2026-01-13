// Word Builder Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'category-select' // Choose word category
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type WordCategory =
  | 'animals'
  | 'colors'
  | 'food'
  | 'nature'
  | 'actions'
  | 'objects'
  | 'mixed';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CategoryConfig {
  id: WordCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
  funFact: string;
}

export interface Level {
  id: number;
  name: string;
  category: WordCategory;
  difficulty: Difficulty;
  description: string;
  wordLength: { min: number; max: number };
  wordCount: number;          // Words per round
  timeLimit: number;          // Seconds per word (0 = no limit)
  hintsAllowed: number;       // Max hints per round
  unlockRequirement?: {
    levelId: number;
    minScore: number;
  };
}

export interface Word {
  word: string;
  category: WordCategory;
  hint: string;               // Text description hint
  imageHint?: string;         // Emoji or icon hint
  difficulty: number;         // 1-5 complexity
}

export interface LetterTile {
  id: string;
  letter: string;
  position: number;           // Current position in scramble
  isPlaced: boolean;
  placedIndex: number | null; // Index in solution slots
}

export interface WordChallenge {
  id: string;
  word: Word;
  scrambledLetters: LetterTile[];
  hintUsed: boolean;
  startTime: number;
}

export interface WordResult {
  challenge: WordChallenge;
  userWord: string;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
  hintsUsed: number;
  attemptsCount: number;
}

export interface GameResult {
  levelId: number;
  category: WordCategory;
  difficulty: Difficulty;
  totalWords: number;
  correctWords: number;
  wrongWords: number;
  skippedWords: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  score: number;
  hintsUsed: number;
  perfectWords: number;      // Words solved without hints
  highestStreak: number;
  wordResults: WordResult[];
  bonusPoints: {
    streak: number;
    speed: number;
    perfect: number;
    noHints: number;
  };
}

export interface LevelProgress {
  levelId: number;
  highScore: number;
  bestAccuracy: number;
  bestStreak: number;
  timesPlayed: number;
  timesCompleted: number;
  timesPerfect: number;
  unlocked: boolean;
  stars: number;
}

export interface ComboState {
  current: number;
  multiplier: number;
  maxReached: number;
  isOnFire: boolean;
}

// Animation states
export type LetterAnimationState =
  | 'idle'
  | 'scrambling'
  | 'placing'
  | 'correct'
  | 'wrong'
  | 'celebrating';

// Constants
export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'animals',
    name: 'Animals',
    icon: '🦁',
    color: 'orange',
    description: 'Furry, feathered & fantastic',
    funFact: 'There are over 8 million animal species on Earth!',
  },
  {
    id: 'colors',
    name: 'Colors',
    icon: '🌈',
    color: 'pink',
    description: 'Paint the rainbow',
    funFact: 'The human eye can see about 10 million colors!',
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍕',
    color: 'red',
    description: 'Yummy vocabulary',
    funFact: 'Honey never spoils - 3000 year old honey is still edible!',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌲',
    color: 'green',
    description: 'Explore the outdoors',
    funFact: 'The Amazon rainforest produces 20% of our oxygen!',
  },
  {
    id: 'actions',
    name: 'Actions',
    icon: '🏃',
    color: 'cyan',
    description: 'Words that move',
    funFact: 'Verbs are the engine of every sentence!',
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: '📦',
    color: 'purple',
    description: 'Things around us',
    funFact: 'The average home contains over 300,000 items!',
  },
  {
    id: 'mixed',
    name: 'Mixed',
    icon: '🎲',
    color: 'yellow',
    description: 'All categories combined',
    funFact: 'Challenge yourself with everything!',
  },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  color: string;
  multiplier: number;
  wordLengthRange: [number, number];
}> = {
  easy: { label: 'Easy', color: 'neon-green', multiplier: 1.0, wordLengthRange: [3, 4] },
  medium: { label: 'Medium', color: 'neon-cyan', multiplier: 1.5, wordLengthRange: [4, 5] },
  hard: { label: 'Hard', color: 'neon-orange', multiplier: 2.0, wordLengthRange: [5, 7] },
  expert: { label: 'Expert', color: 'neon-pink', multiplier: 3.0, wordLengthRange: [6, 8] },
};

export const SCORING = {
  BASE_POINTS: 100,
  TIME_BONUS_MAX: 50,
  TIME_BONUS_THRESHOLD: 10000,     // 10 seconds for full bonus
  HINT_PENALTY: 25,                // Points lost per hint
  STREAK_MULTIPLIER_STEPS: [3, 5, 8, 12],
  PERFECT_ROUND_BONUS: 500,
  NO_HINTS_BONUS: 200,
  STAR_THRESHOLDS: {
    one: 60,
    two: 80,
    three: 95,
  },
};

export const COMBO_MESSAGES = [
  { streak: 2, message: 'Nice!', emoji: '👍' },
  { streak: 4, message: 'Great!', emoji: '🔥' },
  { streak: 6, message: 'Awesome!', emoji: '⚡' },
  { streak: 8, message: 'ON FIRE!', emoji: '🔥🔥' },
  { streak: 10, message: 'UNSTOPPABLE!', emoji: '💥' },
  { streak: 12, message: 'LEGENDARY!', emoji: '👑' },
  { streak: 15, message: 'WORD WIZARD!', emoji: '🧙' },
];
