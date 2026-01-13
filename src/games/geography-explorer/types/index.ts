// Geography Explorer Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'mode-select'    // Choose game mode
  | 'region-select'  // Choose continent/region
  | 'level-select'   // Choose difficulty level
  | 'countdown'      // Pre-game countdown
  | 'playing'        // Active gameplay
  | 'paused'         // Game paused
  | 'results';       // Show results

export type GameMode = 'flag-quiz' | 'capital-match' | 'landmark-hunter' | 'continent-challenge';

export type Continent =
  | 'europe'
  | 'asia'
  | 'africa'
  | 'north-america'
  | 'south-america'
  | 'oceania'
  | 'world';

export type Difficulty = 'explorer' | 'navigator' | 'cartographer' | 'master';

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: Continent;
  flagEmoji: string;
  population?: string;
  funFact: string;
  coordinates: { lat: number; lng: number };
}

export interface Landmark {
  id: string;
  name: string;
  country: string;
  countryId: string;
  continent: Continent;
  description: string;
  emoji: string;
  yearBuilt?: string;
  funFact: string;
}

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  howToPlay: string;
}

export interface ContinentConfig {
  id: Continent;
  name: string;
  icon: string;
  color: string;
  countryCount: number;
  description: string;
}

export interface Level {
  id: number;
  name: string;
  mode: GameMode;
  continent: Continent;
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
  type: GameMode;
  prompt: string;
  correctAnswer: string;
  correctAnswerId: string;
  options: QuestionOption[];
  hint?: string;
  imageHint?: string; // emoji or flag
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
  mode: GameMode;
  continent: Continent;
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
  newCountriesLearned: string[];
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

export interface ExplorerStats {
  countriesLearned: string[]; // country IDs
  landmarksDiscovered: string[]; // landmark IDs
  continentsExplored: Continent[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalPlayTime: number;
  longestStreak: number;
  perfectRounds: number;
  favoriteMode: GameMode | null;
  favoriteContinent: Continent | null;
  explorerRank: ExplorerRank;
}

export type ExplorerRank =
  | 'novice'        // 0-10 countries
  | 'explorer'      // 11-30 countries
  | 'navigator'     // 31-60 countries
  | 'cartographer'  // 61-100 countries
  | 'globe-trotter' // 101-150 countries
  | 'world-master'; // 151+ countries

export interface ComboState {
  current: number;
  multiplier: number;
  maxReached: number;
  isOnFire: boolean;
}

// Constants
export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'flag-quiz',
    name: 'Flag Quiz',
    description: 'Identify countries by their flags',
    icon: '🏁',
    color: 'cyan',
    howToPlay: 'Look at the flag and select the correct country name',
  },
  {
    id: 'capital-match',
    name: 'Capital Match',
    description: 'Match capitals to their countries',
    icon: '🏛️',
    color: 'pink',
    howToPlay: 'Read the capital city and choose which country it belongs to',
  },
  {
    id: 'landmark-hunter',
    name: 'Landmark Hunter',
    description: 'Discover famous landmarks around the world',
    icon: '🗼',
    color: 'orange',
    howToPlay: 'Identify where famous landmarks are located',
  },
  {
    id: 'continent-challenge',
    name: 'Continent Challenge',
    description: 'Test your knowledge of all continents',
    icon: '🌍',
    color: 'green',
    howToPlay: 'Answer mixed questions about geography from around the world',
  },
];

export const CONTINENTS: ContinentConfig[] = [
  {
    id: 'world',
    name: 'World Tour',
    icon: '🌎',
    color: 'purple',
    countryCount: 195,
    description: 'All countries from every continent',
  },
  {
    id: 'europe',
    name: 'Europe',
    icon: '🏰',
    color: 'cyan',
    countryCount: 44,
    description: 'From the Arctic to the Mediterranean',
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🏯',
    color: 'pink',
    countryCount: 48,
    description: 'The largest and most populous continent',
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🦁',
    color: 'orange',
    countryCount: 54,
    description: 'The continent with the most countries',
  },
  {
    id: 'north-america',
    name: 'North America',
    icon: '🗽',
    color: 'green',
    countryCount: 23,
    description: 'From Canada to Panama',
  },
  {
    id: 'south-america',
    name: 'South America',
    icon: '🌴',
    color: 'yellow',
    countryCount: 12,
    description: 'The Amazon and beyond',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🏝️',
    color: 'purple',
    countryCount: 14,
    description: 'Islands of the Pacific',
  },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  color: string;
  multiplier: number;
  timePerQuestion: number;
  optionCount: number;
}> = {
  explorer: {
    label: 'Explorer',
    color: 'neon-green',
    multiplier: 1.0,
    timePerQuestion: 30,
    optionCount: 3,
  },
  navigator: {
    label: 'Navigator',
    color: 'neon-cyan',
    multiplier: 1.5,
    timePerQuestion: 20,
    optionCount: 4,
  },
  cartographer: {
    label: 'Cartographer',
    color: 'neon-orange',
    multiplier: 2.0,
    timePerQuestion: 15,
    optionCount: 4,
  },
  master: {
    label: 'Master',
    color: 'neon-pink',
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
  HINT_PENALTY: 25, // Points deducted for using hint
  STAR_THRESHOLDS: {
    one: 60,
    two: 80,
    three: 95,
  },
};

export const EXPLORER_RANKS: Record<ExplorerRank, {
  label: string;
  icon: string;
  minCountries: number;
  color: string;
}> = {
  novice: { label: 'Novice Explorer', icon: '🌱', minCountries: 0, color: 'gray' },
  explorer: { label: 'Explorer', icon: '🧭', minCountries: 11, color: 'green' },
  navigator: { label: 'Navigator', icon: '🗺️', minCountries: 31, color: 'cyan' },
  cartographer: { label: 'Cartographer', icon: '📍', minCountries: 61, color: 'blue' },
  'globe-trotter': { label: 'Globe Trotter', icon: '✈️', minCountries: 101, color: 'purple' },
  'world-master': { label: 'World Master', icon: '🌟', minCountries: 151, color: 'gold' },
};

export const COMBO_MESSAGES = [
  { streak: 3, message: 'Nice!', emoji: '👍' },
  { streak: 5, message: 'Great!', emoji: '🌍' },
  { streak: 7, message: 'Amazing!', emoji: '✨' },
  { streak: 10, message: 'GLOBETROTTER!', emoji: '🌎' },
  { streak: 15, message: 'UNSTOPPABLE!', emoji: '🔥' },
  { streak: 20, message: 'LEGENDARY!', emoji: '👑' },
  { streak: 25, message: 'WORLD MASTER!', emoji: '🌟' },
];
