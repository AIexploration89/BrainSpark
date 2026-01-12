// Typing Master - Public Exports

export { TypingMaster, default } from './TypingMaster';

// Components
export { KeyboardVisualizer } from './components/KeyboardVisualizer';
export { TextDisplay, SingleLetterDisplay } from './components/TextDisplay';
export { MetricsPanel, InlineMetrics } from './components/MetricsPanel';
export { LevelSelector } from './components/LevelSelector';
export { GameModeSelector } from './components/GameModeSelector';
export { CountdownOverlay } from './components/CountdownOverlay';
export { ResultsScreen } from './components/ResultsScreen';
export { PauseOverlay } from './components/PauseOverlay';
export { WordRain } from './components/WordRain';

// Hooks
export { useTypingEngine } from './hooks/useTypingEngine';
export { useTimer } from './hooks/useTimer';

// Stores
export { useTypingGameStore, useTypingProgressStore } from './stores/typingStore';

// Data
export { typingLevels, getLevelById, isLevelUnlocked } from './data/levels';
export { getContentForLevel, getWordRainWords, storyChapters } from './data/wordLists';

// Utils
export { calculateXP, calculateSparks, getPerformanceRating } from './utils/scoring';

// Types
export type {
  GameMode,
  TypingLevel,
  CharacterState,
  ContentType,
  Keystroke,
  KeyError,
  GameResults,
  LevelProgress,
  TypingProgress,
  Character,
  WordRainWord,
  StoryChapter,
  TimerConfig,
  XPResult,
} from './types';
