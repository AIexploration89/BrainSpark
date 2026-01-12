// Typing Master Type Definitions

export type GameMode = 'practice' | 'time-attack' | 'accuracy-challenge' | 'word-rain' | 'story';

export type CharacterState = 'pending' | 'current' | 'correct' | 'incorrect' | 'corrected';

export type ContentType = 'single-letter' | 'sequences' | 'words' | 'sentences' | 'paragraphs';

export interface TypingLevel {
  id: number;
  name: string;
  description: string;
  ageRange: string;
  allowedKeys: string[];
  contentType: ContentType;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: LevelRequirement | null;
  rewards: {
    xpBase: number;
    sparksBase: number;
  };
}

export interface LevelRequirement {
  level: number;
  accuracy?: number;
  wpm?: number;
}

export interface Keystroke {
  key: string;
  expected: string;
  timestamp: number;
  correct: boolean;
}

export interface KeyError {
  key: string;
  expected: string;
  count: number;
}

export interface GameResults {
  levelId: number;
  mode: GameMode;
  wpm: number;
  cpm: number;
  accuracy: number;
  correctCount: number;
  errorCount: number;
  maxStreak: number;
  timeElapsed: number;
  completed: boolean;
  keyErrors: KeyError[];
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  bestStreak: number;
  totalAttempts: number;
  totalTimeSpent: number;
  lastPlayedAt: number | null;
}

export interface TypingProgress {
  levels: Record<number, LevelProgress>;
  currentLevel: number;
  totalXpEarned: number;
  totalSparksEarned: number;
}

export interface Character {
  char: string;
  state: CharacterState;
  index: number;
}

export interface WordRainWord {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  typed: string;
}

export interface StoryChapter {
  id: number;
  title: string;
  content: string[];
  completed: boolean;
}

export interface TimerConfig {
  duration: number; // in seconds
  label: string;
}

export const TIME_ATTACK_OPTIONS: TimerConfig[] = [
  { duration: 60, label: '1 min' },
  { duration: 120, label: '2 min' },
  { duration: 180, label: '3 min' },
];

export interface XPResult {
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  sparks: number;
  bonuses: { label: string; amount: number }[];
}
