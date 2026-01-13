// Animal Kingdom Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'category-select' // Choose animal category
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type AnimalCategory = 'mammals' | 'birds' | 'ocean-life' | 'reptiles-amphibians';

export type Habitat =
  | 'forest'
  | 'savanna'
  | 'ocean'
  | 'desert'
  | 'arctic'
  | 'rainforest'
  | 'wetlands'
  | 'mountains'
  | 'grasslands';

export type QuestionType =
  | 'identify'           // Identify animal from description/image
  | 'habitat'            // Match animal to habitat
  | 'classification'     // Classify animal characteristics
  | 'fact-check';        // True/false about animal facts

export type Difficulty = 'cub' | 'tracker' | 'ranger' | 'expert';

export interface Animal {
  id: string;
  name: string;
  category: AnimalCategory;
  habitat: Habitat;
  emoji: string;
  scientificName: string;
  diet: 'herbivore' | 'carnivore' | 'omnivore';
  lifespan: string;
  size: string;
  speed?: string;
  funFacts: string[];
  description: string;
  isMammal?: boolean;
  canFly?: boolean;
  isNocturnal?: boolean;
  isEndangered?: boolean;
}

export interface CategoryConfig {
  id: AnimalCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  animalCount: number;
}

export interface HabitatConfig {
  id: Habitat;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Level {
  id: number;
  name: string;
  category: AnimalCategory;
  difficulty: Difficulty;
  description: string;
  questionCount: number;
  timeLimit: number; // seconds per question (0 = no limit)
  questionTypes: QuestionType[];
  unlockRequirement?: {
    levelId: number;
    minScore: number;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  correctAnswerId: string;
  options: QuestionOption[];
  hint?: string;
  imageHint?: string; // emoji
  explanation: string; // Educational explanation shown after answer
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
  category: AnimalCategory;
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
  newAnimalsLearned: string[];
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

export interface ZoologistStats {
  animalsLearned: string[]; // animal IDs
  habitatsExplored: Habitat[];
  categoriesMastered: AnimalCategory[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalPlayTime: number;
  longestStreak: number;
  perfectRounds: number;
  favoriteCategory: AnimalCategory | null;
  zoologistRank: ZoologistRank;
}

export type ZoologistRank =
  | 'observer'        // 0-10 animals
  | 'tracker'         // 11-25 animals
  | 'naturalist'      // 26-50 animals
  | 'biologist'       // 51-80 animals
  | 'conservationist' // 81-120 animals
  | 'wildlife-master'; // 121+ animals

export interface ComboState {
  current: number;
  multiplier: number;
  maxReached: number;
  isOnFire: boolean;
}

// Constants
export const ANIMAL_CATEGORIES: CategoryConfig[] = [
  {
    id: 'mammals',
    name: 'Mammals',
    description: 'Warm-blooded creatures that nurse their young',
    icon: '🦁',
    color: 'neon-orange',
    glowColor: 'rgba(255,107,53,0.4)',
    animalCount: 35,
  },
  {
    id: 'birds',
    name: 'Birds',
    description: 'Feathered friends that rule the skies',
    icon: '🦅',
    color: 'neon-cyan',
    glowColor: 'rgba(0,245,255,0.4)',
    animalCount: 30,
  },
  {
    id: 'ocean-life',
    name: 'Ocean Life',
    description: 'Mysterious creatures of the deep sea',
    icon: '🐋',
    color: 'neon-purple',
    glowColor: 'rgba(139,92,246,0.4)',
    animalCount: 32,
  },
  {
    id: 'reptiles-amphibians',
    name: 'Reptiles & Amphibians',
    description: 'Cold-blooded crawlers and hoppers',
    icon: '🦎',
    color: 'neon-green',
    glowColor: 'rgba(0,255,136,0.4)',
    animalCount: 28,
  },
];

export const HABITATS: HabitatConfig[] = [
  { id: 'forest', name: 'Forest', icon: '🌲', color: 'green', description: 'Wooded areas with diverse wildlife' },
  { id: 'savanna', name: 'Savanna', icon: '🌾', color: 'yellow', description: 'African grasslands and plains' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', color: 'blue', description: 'Vast seas and coral reefs' },
  { id: 'desert', name: 'Desert', icon: '🏜️', color: 'orange', description: 'Hot and dry sandy regions' },
  { id: 'arctic', name: 'Arctic', icon: '❄️', color: 'cyan', description: 'Frozen polar regions' },
  { id: 'rainforest', name: 'Rainforest', icon: '🌴', color: 'emerald', description: 'Tropical jungles with high rainfall' },
  { id: 'wetlands', name: 'Wetlands', icon: '🐸', color: 'teal', description: 'Swamps, marshes, and bogs' },
  { id: 'mountains', name: 'Mountains', icon: '🏔️', color: 'gray', description: 'High altitude rocky terrain' },
  { id: 'grasslands', name: 'Grasslands', icon: '🌿', color: 'lime', description: 'Open prairies and meadows' },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  color: string;
  icon: string;
  multiplier: number;
  timePerQuestion: number;
  optionCount: number;
}> = {
  cub: {
    label: 'Cub',
    color: 'neon-green',
    icon: '🐱',
    multiplier: 1.0,
    timePerQuestion: 30,
    optionCount: 3,
  },
  tracker: {
    label: 'Tracker',
    color: 'neon-cyan',
    icon: '🔍',
    multiplier: 1.5,
    timePerQuestion: 20,
    optionCount: 4,
  },
  ranger: {
    label: 'Ranger',
    color: 'neon-orange',
    icon: '🎯',
    multiplier: 2.0,
    timePerQuestion: 15,
    optionCount: 4,
  },
  expert: {
    label: 'Expert',
    color: 'neon-pink',
    icon: '🏆',
    multiplier: 3.0,
    timePerQuestion: 10,
    optionCount: 5,
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

export const ZOOLOGIST_RANKS: Record<ZoologistRank, {
  label: string;
  icon: string;
  minAnimals: number;
  color: string;
}> = {
  observer: { label: 'Wildlife Observer', icon: '👀', minAnimals: 0, color: 'gray' },
  tracker: { label: 'Animal Tracker', icon: '🔎', minAnimals: 11, color: 'green' },
  naturalist: { label: 'Naturalist', icon: '🌿', minAnimals: 26, color: 'cyan' },
  biologist: { label: 'Wildlife Biologist', icon: '🔬', minAnimals: 51, color: 'blue' },
  conservationist: { label: 'Conservationist', icon: '🌍', minAnimals: 81, color: 'purple' },
  'wildlife-master': { label: 'Wildlife Master', icon: '👑', minAnimals: 121, color: 'gold' },
};

export const COMBO_MESSAGES = [
  { streak: 3, message: 'Nice!', emoji: '🐾' },
  { streak: 5, message: 'Wild!', emoji: '🦁' },
  { streak: 7, message: 'Amazing!', emoji: '✨' },
  { streak: 10, message: 'BEAST MODE!', emoji: '🔥' },
  { streak: 15, message: 'UNSTOPPABLE!', emoji: '🌟' },
  { streak: 20, message: 'LEGENDARY!', emoji: '👑' },
  { streak: 25, message: 'WILDLIFE MASTER!', emoji: '🏆' },
];
