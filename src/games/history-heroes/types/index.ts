// History Heroes Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'era-select'     // Choose historical era
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type HistoricalEra = 'ancient' | 'medieval' | 'renaissance' | 'modern';

export type Difficulty = 'apprentice' | 'scholar' | 'historian' | 'master';

export type QuestionType =
  | 'multiple-choice'   // Standard multiple choice
  | 'timeline'          // Order events chronologically
  | 'figure-match'      // Match famous figures to achievements
  | 'artifact';         // Identify historical artifacts

export interface HistoricalFigure {
  id: string;
  name: string;
  era: HistoricalEra;
  title: string;
  achievement: string;
  years: string;
  icon: string;
  funFact: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  era: HistoricalEra;
  year: number;
  description: string;
  significance: string;
  icon: string;
}

export interface EraConfig {
  id: HistoricalEra;
  name: string;
  description: string;
  years: string;
  icon: string;
  color: string;
  gradient: string;
  accentColor: string;
  topics: string[];
}

export interface Level {
  id: number;
  name: string;
  era: HistoricalEra;
  difficulty: Difficulty;
  description: string;
  questionCount: number;
  timeLimit: number; // seconds per question (0 = no limit)
  unlockRequirement?: {
    levelId: number;
    minScore: number;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  era: HistoricalEra;
  topic: string;
  prompt: string;
  correctAnswer: string;
  correctAnswerId: string;
  options: QuestionOption[];
  hint?: string;
  explanation: string;
  imageHint?: string;
  difficulty: Difficulty;
  year?: number; // For timeline questions
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  year?: number; // For timeline ordering
}

export interface QuestionResult {
  question: Question;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number; // ms
  pointsEarned: number;
  usedHint: boolean;
}

export interface GameResult {
  levelId: number;
  era: HistoricalEra;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  score: number;
  highestStreak: number;
  perfectRound: boolean;
  hintsUsed: number;
  questionResults: QuestionResult[];
  bonusPoints: {
    streak: number;
    speed: number;
    perfect: number;
    noHints: number;
  };
  newTopicsLearned: string[];
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
  stars: number; // 0-3
}

export interface HistorianStats {
  topicsLearned: string[];
  erasExplored: HistoricalEra[];
  figuresDiscovered: string[];
  eventsLearned: string[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalPlayTime: number;
  longestStreak: number;
  perfectRounds: number;
  favoriteEra: HistoricalEra | null;
  historianRank: HistorianRank;
}

export type HistorianRank =
  | 'novice'       // 0-10 topics
  | 'student'      // 11-25 topics
  | 'scholar'      // 26-50 topics
  | 'historian'    // 51-80 topics
  | 'professor'    // 81-120 topics
  | 'legend';      // 121+ topics

export interface ComboState {
  current: number;
  multiplier: number;
  maxReached: number;
  isOnFire: boolean;
}

// Constants
export const HISTORICAL_ERAS: EraConfig[] = [
  {
    id: 'ancient',
    name: 'Ancient Civilizations',
    description: 'Explore mighty empires from Egypt to Rome!',
    years: '3000 BCE - 500 CE',
    icon: '🏛️',
    color: 'neon-yellow',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    accentColor: '#FFE55C',
    topics: ['egypt', 'greece', 'rome', 'mesopotamia', 'china', 'india'],
  },
  {
    id: 'medieval',
    name: 'Medieval Times',
    description: 'Discover knights, castles, and kingdoms!',
    years: '500 - 1500 CE',
    icon: '⚔️',
    color: 'neon-purple',
    gradient: 'from-purple-500/20 to-violet-500/10',
    accentColor: '#8B5CF6',
    topics: ['knights', 'castles', 'vikings', 'crusades', 'feudalism', 'byzantium'],
  },
  {
    id: 'renaissance',
    name: 'Renaissance & Exploration',
    description: 'Meet brilliant minds and brave explorers!',
    years: '1400 - 1700 CE',
    icon: '🎨',
    color: 'neon-cyan',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    accentColor: '#00F5FF',
    topics: ['art', 'science', 'exploration', 'inventions', 'reformation', 'trade'],
  },
  {
    id: 'modern',
    name: 'Modern History',
    description: 'Learn about revolutions that shaped our world!',
    years: '1700 CE - Present',
    icon: '🌍',
    color: 'neon-green',
    gradient: 'from-green-500/20 to-emerald-500/10',
    accentColor: '#00FF88',
    topics: ['revolution', 'industry', 'world-wars', 'civil-rights', 'space-age', 'technology'],
  },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  color: string;
  multiplier: number;
  timePerQuestion: number;
  optionCount: number;
  icon: string;
}> = {
  apprentice: {
    label: 'Apprentice',
    color: 'neon-green',
    multiplier: 1.0,
    timePerQuestion: 30,
    optionCount: 3,
    icon: '📜',
  },
  scholar: {
    label: 'Scholar',
    color: 'neon-cyan',
    multiplier: 1.5,
    timePerQuestion: 25,
    optionCount: 4,
    icon: '📚',
  },
  historian: {
    label: 'Historian',
    color: 'neon-orange',
    multiplier: 2.0,
    timePerQuestion: 20,
    optionCount: 4,
    icon: '🎓',
  },
  master: {
    label: 'Master',
    color: 'neon-pink',
    multiplier: 3.0,
    timePerQuestion: 15,
    optionCount: 5,
    icon: '👑',
  },
};

export const SCORING = {
  BASE_POINTS: 100,
  TIME_BONUS_MAX: 50,
  TIME_BONUS_THRESHOLD: 5000, // 5 seconds for max bonus
  STREAK_MULTIPLIER_STEPS: [3, 5, 8, 12],
  PERFECT_ROUND_BONUS: 500,
  NO_HINTS_BONUS: 200,
  HINT_PENALTY: 25,
  STAR_THRESHOLDS: {
    one: 60,
    two: 80,
    three: 95,
  },
};

export const HISTORIAN_RANKS: Record<HistorianRank, {
  label: string;
  icon: string;
  minTopics: number;
  color: string;
}> = {
  novice: { label: 'History Novice', icon: '📜', minTopics: 0, color: 'gray' },
  student: { label: 'History Student', icon: '📚', minTopics: 11, color: 'green' },
  scholar: { label: 'History Scholar', icon: '🎓', minTopics: 26, color: 'cyan' },
  historian: { label: 'Historian', icon: '🏛️', minTopics: 51, color: 'blue' },
  professor: { label: 'History Professor', icon: '👨‍🏫', minTopics: 81, color: 'purple' },
  legend: { label: 'Living Legend', icon: '👑', minTopics: 121, color: 'gold' },
};

export const COMBO_MESSAGES = [
  { streak: 3, message: 'Good!', emoji: '📜' },
  { streak: 5, message: 'Great!', emoji: '⚔️' },
  { streak: 7, message: 'Excellent!', emoji: '🏰' },
  { streak: 10, message: 'BRILLIANT!', emoji: '👑' },
  { streak: 15, message: 'LEGENDARY!', emoji: '🌟' },
  { streak: 20, message: 'IMMORTAL!', emoji: '⭐' },
  { streak: 25, message: 'TIME LORD!', emoji: '🕰️' },
];
