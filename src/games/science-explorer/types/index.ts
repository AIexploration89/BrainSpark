// Science Explorer Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'category-select' // Choose science category
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type ScienceCategory = 'biology' | 'chemistry' | 'physics' | 'earth-science';

export type Difficulty = 'beginner' | 'explorer' | 'scientist' | 'genius';

export type QuestionType = 'multiple-choice' | 'true-false' | 'image-based';

export interface ScienceTopic {
  id: string;
  name: string;
  category: ScienceCategory;
  description: string;
  icon: string;
  funFact: string;
}

export interface CategoryConfig {
  id: ScienceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  topics: string[];
}

export interface Level {
  id: number;
  name: string;
  category: ScienceCategory;
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
  category: ScienceCategory;
  topic: string;
  prompt: string;
  correctAnswer: string;
  correctAnswerId: string;
  options: QuestionOption[];
  hint?: string;
  explanation: string; // Shown after answering
  imageHint?: string; // emoji for visual
  difficulty: Difficulty;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
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
  category: ScienceCategory;
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

export interface ScientistStats {
  topicsLearned: string[]; // topic IDs
  experimentsCompleted: number;
  categoriesExplored: ScienceCategory[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalPlayTime: number;
  longestStreak: number;
  perfectRounds: number;
  favoriteCategory: ScienceCategory | null;
  scientistRank: ScientistRank;
}

export type ScientistRank =
  | 'curious'       // 0-10 topics
  | 'learner'       // 11-25 topics
  | 'researcher'    // 26-50 topics
  | 'scientist'     // 51-80 topics
  | 'professor'     // 81-120 topics
  | 'genius';       // 121+ topics

export interface ComboState {
  current: number;
  multiplier: number;
  maxReached: number;
  isOnFire: boolean;
}

// Constants
export const SCIENCE_CATEGORIES: CategoryConfig[] = [
  {
    id: 'biology',
    name: 'Biology',
    description: 'Explore living things, from tiny cells to giant whales!',
    icon: '🧬',
    color: 'neon-green',
    gradient: 'from-neon-green/20 to-emerald-500/10',
    topics: ['cells', 'animals', 'plants', 'human-body', 'ecosystems', 'genetics'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Discover atoms, molecules, and amazing reactions!',
    icon: '⚗️',
    color: 'neon-purple',
    gradient: 'from-neon-purple/20 to-violet-500/10',
    topics: ['atoms', 'elements', 'molecules', 'reactions', 'states-of-matter', 'acids-bases'],
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Learn about forces, energy, and how the universe works!',
    icon: '⚡',
    color: 'neon-cyan',
    gradient: 'from-neon-cyan/20 to-blue-500/10',
    topics: ['forces', 'energy', 'electricity', 'magnetism', 'light', 'sound'],
  },
  {
    id: 'earth-science',
    name: 'Earth Science',
    description: 'Explore our planet, weather, and the cosmos!',
    icon: '🌍',
    color: 'neon-orange',
    gradient: 'from-neon-orange/20 to-amber-500/10',
    topics: ['rocks', 'weather', 'oceans', 'volcanoes', 'solar-system', 'climate'],
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
  beginner: {
    label: 'Beginner',
    color: 'neon-green',
    multiplier: 1.0,
    timePerQuestion: 30,
    optionCount: 3,
    icon: '🌱',
  },
  explorer: {
    label: 'Explorer',
    color: 'neon-cyan',
    multiplier: 1.5,
    timePerQuestion: 25,
    optionCount: 4,
    icon: '🔬',
  },
  scientist: {
    label: 'Scientist',
    color: 'neon-orange',
    multiplier: 2.0,
    timePerQuestion: 20,
    optionCount: 4,
    icon: '🧪',
  },
  genius: {
    label: 'Genius',
    color: 'neon-pink',
    multiplier: 3.0,
    timePerQuestion: 15,
    optionCount: 5,
    icon: '🧠',
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

export const SCIENTIST_RANKS: Record<ScientistRank, {
  label: string;
  icon: string;
  minTopics: number;
  color: string;
}> = {
  curious: { label: 'Curious Mind', icon: '🔍', minTopics: 0, color: 'gray' },
  learner: { label: 'Science Learner', icon: '📚', minTopics: 11, color: 'green' },
  researcher: { label: 'Researcher', icon: '🔬', minTopics: 26, color: 'cyan' },
  scientist: { label: 'Scientist', icon: '🧪', minTopics: 51, color: 'blue' },
  professor: { label: 'Professor', icon: '🎓', minTopics: 81, color: 'purple' },
  genius: { label: 'Science Genius', icon: '🧠', minTopics: 121, color: 'gold' },
};

export const COMBO_MESSAGES = [
  { streak: 3, message: 'Good!', emoji: '🧪' },
  { streak: 5, message: 'Great!', emoji: '⚗️' },
  { streak: 7, message: 'Excellent!', emoji: '🔬' },
  { streak: 10, message: 'BRILLIANT!', emoji: '💡' },
  { streak: 15, message: 'GENIUS!', emoji: '🧠' },
  { streak: 20, message: 'LEGENDARY!', emoji: '⭐' },
  { streak: 25, message: 'EINSTEIN!', emoji: '🌟' },
];
