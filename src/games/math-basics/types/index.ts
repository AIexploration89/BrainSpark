// Math Basics Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'mode-select'    // Choose operation type
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface OperationConfig {
  id: Operation;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  description: string;
  funFact: string;
}

export interface Level {
  id: number;
  name: string;
  operation: Operation;
  difficulty: Difficulty;
  description: string;
  // Number ranges for generating problems
  minNumber1: number;
  maxNumber1: number;
  minNumber2: number;
  maxNumber2: number;
  // Game settings
  problemCount: number;     // How many problems per round
  timeLimit: number;        // Seconds per problem (0 = no limit)
  allowNegatives: boolean;  // Can answers be negative?
  // Unlock requirements
  unlockRequirement?: {
    levelId: number;
    minScore: number;
  };
}

export interface Problem {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  displayString: string;    // e.g., "5 + 3 = ?"
  choices?: number[];       // For multiple choice mode
}

export interface ProblemResult {
  problem: Problem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;        // ms to answer
  pointsEarned: number;
}

export interface GameResult {
  levelId: number;
  operation: Operation;
  difficulty: Difficulty;
  totalProblems: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  accuracy: number;         // Percentage
  totalTime: number;        // Total ms
  averageTime: number;      // Average ms per problem
  score: number;
  highestStreak: number;
  perfectRound: boolean;    // All correct, no hints
  problemResults: ProblemResult[];
  bonusPoints: {
    streak: number;
    speed: number;
    perfect: number;
    noMistakes: number;
  };
}

export interface LevelProgress {
  levelId: number;
  highScore: number;
  bestAccuracy: number;
  bestStreak: number;
  timesPlayed: number;
  timesCompleted: number;   // >= 70% accuracy
  timesPerfect: number;     // 100% accuracy
  unlocked: boolean;
  stars: number;            // 0-3 stars based on performance
}

export interface OperationProgress {
  operation: Operation;
  totalProblems: number;
  correctAnswers: number;
  averageAccuracy: number;
  totalTime: number;
  levelsUnlocked: number;
  levelsCompleted: number;
}

export interface GameStats {
  totalProblemsAttempted: number;
  totalCorrect: number;
  totalPlayTime: number;      // ms
  longestStreak: number;
  perfectRounds: number;
  favoriteOperation: Operation | null;
  operationStats: Record<Operation, OperationProgress>;
}

export interface ComboState {
  current: number;          // Current streak
  multiplier: number;       // Score multiplier (1x, 2x, 3x, etc.)
  maxReached: number;       // Best streak this round
  isOnFire: boolean;        // Special visual state at 10+ streak
}

// Animation states for numbers
export type NumberAnimationState =
  | 'idle'
  | 'entering'
  | 'calculating'
  | 'correct'
  | 'wrong'
  | 'celebrating';

// Input modes
export type InputMode = 'numpad' | 'choices' | 'slider';

// Constants
export const OPERATIONS: OperationConfig[] = [
  {
    id: 'addition',
    name: 'Addition',
    symbol: '+',
    icon: '➕',
    color: 'green',
    description: 'Add numbers together',
    funFact: 'The plus sign (+) was first used in 1489!',
  },
  {
    id: 'subtraction',
    name: 'Subtraction',
    symbol: '−',
    icon: '➖',
    color: 'cyan',
    description: 'Find the difference',
    funFact: 'The minus sign was invented by a German mathematician.',
  },
  {
    id: 'multiplication',
    name: 'Multiplication',
    symbol: '×',
    icon: '✖️',
    color: 'orange',
    description: 'Multiply numbers',
    funFact: 'Multiplication is just fast addition!',
  },
  {
    id: 'division',
    name: 'Division',
    symbol: '÷',
    icon: '➗',
    color: 'pink',
    description: 'Split into equal parts',
    funFact: 'Division helps us share things equally.',
  },
  {
    id: 'mixed',
    name: 'Mixed',
    symbol: '?',
    icon: '🎲',
    color: 'purple',
    description: 'All operations mixed!',
    funFact: 'Challenge yourself with all operations!',
  },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; multiplier: number }> = {
  beginner: { label: 'Beginner', color: 'neon-green', multiplier: 1.0 },
  easy: { label: 'Easy', color: 'neon-cyan', multiplier: 1.2 },
  medium: { label: 'Medium', color: 'neon-orange', multiplier: 1.5 },
  hard: { label: 'Hard', color: 'neon-pink', multiplier: 2.0 },
  expert: { label: 'Expert', color: 'neon-red', multiplier: 3.0 },
};

export const SCORING = {
  BASE_POINTS: 100,                    // Base points per correct answer
  TIME_BONUS_MAX: 50,                  // Max bonus for fast answers
  TIME_BONUS_THRESHOLD: 3000,          // Answer in under 3s for max bonus
  STREAK_MULTIPLIER_STEPS: [5, 10, 15, 20], // Streak counts for multiplier increase
  PERFECT_ROUND_BONUS: 500,            // Bonus for 100% accuracy
  NO_MISTAKES_BONUS: 200,              // Bonus for no wrong answers
  STAR_THRESHOLDS: {
    one: 60,    // 60% accuracy
    two: 80,    // 80% accuracy
    three: 95,  // 95% accuracy
  },
};

export const COMBO_MESSAGES = [
  { streak: 3, message: 'Nice!', emoji: '👍' },
  { streak: 5, message: 'Great!', emoji: '🔥' },
  { streak: 7, message: 'Awesome!', emoji: '⚡' },
  { streak: 10, message: 'ON FIRE!', emoji: '🔥🔥' },
  { streak: 15, message: 'UNSTOPPABLE!', emoji: '💥' },
  { streak: 20, message: 'LEGENDARY!', emoji: '👑' },
  { streak: 25, message: 'MATH WIZARD!', emoji: '🧙‍♂️' },
];
