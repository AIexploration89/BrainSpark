// Space Exploration Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'mode-select'    // Choose game mode
  | 'level-select'   // Choose level/planet
  | 'countdown'      // Pre-game countdown
  | 'exploring'      // Solar system exploration
  | 'planet-view'    // Viewing planet details
  | 'quiz'           // Taking a quiz
  | 'mission'        // On a mission
  | 'paused'         // Game paused
  | 'results';       // Show results

export type GameMode = 'explore' | 'quiz' | 'mission';

export type PlanetId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type MoonId =
  | 'luna'           // Earth's Moon
  | 'phobos'         // Mars
  | 'deimos'         // Mars
  | 'io'             // Jupiter
  | 'europa'         // Jupiter
  | 'ganymede'       // Jupiter
  | 'callisto'       // Jupiter
  | 'titan'          // Saturn
  | 'enceladus'      // Saturn
  | 'triton';        // Neptune

export type Difficulty = 'beginner' | 'explorer' | 'astronaut' | 'commander';

export interface Planet {
  id: PlanetId;
  name: string;
  type: 'star' | 'rocky' | 'gas-giant' | 'ice-giant' | 'dwarf';
  color: string;
  glowColor: string;
  size: number;           // Relative size for display (1-100)
  orbitRadius: number;    // Distance from sun (AU scaled for display)
  orbitSpeed: number;     // Animation speed
  rotationSpeed: number;  // Self-rotation speed
  facts: PlanetFact[];
  stats: PlanetStats;
  unlockRequirement?: number;  // Stars needed to unlock
  moons?: MoonId[];
}

export interface PlanetFact {
  id: string;
  title: string;
  content: string;
  category: 'size' | 'atmosphere' | 'surface' | 'orbit' | 'moons' | 'history' | 'fun';
  isDiscovered: boolean;
}

export interface PlanetStats {
  diameter: string;
  distanceFromSun: string;
  dayLength: string;
  yearLength: string;
  moons: number;
  temperature: string;
  gravity: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  targetPlanet: PlanetId;
  objectives: MissionObjective[];
  reward: number;          // Stars earned
  timeLimit?: number;      // Seconds (optional)
  difficulty: Difficulty;
  isCompleted: boolean;
  unlockRequirement?: number;
}

export interface MissionObjective {
  id: string;
  description: string;
  type: 'discover-fact' | 'answer-quiz' | 'visit-planet' | 'collect-sample';
  target: string;          // Fact ID, quiz ID, planet ID, etc.
  isCompleted: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;   // Index of correct option
  explanation: string;
  difficulty: Difficulty;
  category: 'planets' | 'stars' | 'space-travel' | 'astronomy' | 'moons';
  relatedPlanet?: PlanetId;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  correctCount: number;
  startTime: number;
  completionTime?: number;
}

export interface GameResult {
  score: number;
  starsEarned: number;     // 1-3 stars
  factsDiscovered: number;
  questionsCorrect: number;
  questionsTotal: number;
  accuracy: number;
  timeBonus: number;
  completionTime: number;
  isPerfect: boolean;
  mode: GameMode;
}

export interface LevelProgress {
  levelId: string;
  planetsVisited: PlanetId[];
  factsDiscovered: string[];
  quizzesPassed: string[];
  missionsCompleted: string[];
  highScore: number;
  bestStars: number;
  timesPlayed: number;
  unlocked: boolean;
}

export interface SpaceProgress {
  totalStars: number;
  planetsUnlocked: PlanetId[];
  allFactsDiscovered: string[];
  quizzesPassed: string[];
  missionsCompleted: string[];
  currentRank: SpaceRank;
  achievements: Achievement[];
}

export type SpaceRank =
  | 'cadet'
  | 'explorer'
  | 'navigator'
  | 'pilot'
  | 'captain'
  | 'commander'
  | 'admiral';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  mode: GameMode;
  difficulty: Difficulty;
  planets: PlanetId[];     // Planets available in this level
  questionsCount?: number; // For quiz mode
  timeLimit?: number;      // Seconds
  unlockRequirement: number; // Stars needed
}

// Animation helpers
export interface OrbitalPosition {
  x: number;
  y: number;
  angle: number;
}

// Scoring constants
export const SCORING = {
  FACT_DISCOVERED: 50,
  QUIZ_CORRECT: 100,
  QUIZ_WRONG: 0,
  MISSION_COMPLETE: 200,
  PERFECT_BONUS: 500,
  TIME_BONUS_MULTIPLIER: 2,
  STREAK_MULTIPLIER: 1.5,
  DIFFICULTY_MULTIPLIER: {
    beginner: 1,
    explorer: 1.5,
    astronaut: 2,
    commander: 3,
  },
} as const;

// Star thresholds
export const STAR_THRESHOLDS = {
  ONE_STAR: 50,    // 50% accuracy
  TWO_STARS: 75,   // 75% accuracy
  THREE_STARS: 90, // 90% accuracy
} as const;

// Rank thresholds (total stars)
export const RANK_THRESHOLDS: Record<SpaceRank, number> = {
  cadet: 0,
  explorer: 10,
  navigator: 25,
  pilot: 50,
  captain: 100,
  commander: 200,
  admiral: 500,
};
