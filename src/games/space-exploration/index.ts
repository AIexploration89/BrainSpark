// Space Exploration Game Module
export { SpaceExploration } from './SpaceExploration';
export { default as SpaceExplorationDefault } from './SpaceExploration';

// Components
export { StarField } from './components/StarField';
export { SolarSystem } from './components/SolarSystem';
export { PlanetCard } from './components/PlanetCard';
export { SpaceQuiz } from './components/SpaceQuiz';
export { LevelSelector } from './components/LevelSelector';
export { CountdownOverlay } from './components/CountdownOverlay';
export { PauseOverlay } from './components/PauseOverlay';
export { ResultsScreen } from './components/ResultsScreen';

// Stores
export { useSpaceGameStore, useSpaceProgressStore } from './stores/spaceStore';

// Data
export { PLANETS, getPlanetById, getUnlockedPlanets } from './data/planets';
export { QUIZ_QUESTIONS, QUIZ_LEVELS, getRandomQuestions } from './data/quizzes';
export { MISSIONS, getMissionById, getUnlockedMissions } from './data/missions';

// Types
export type {
  GameState,
  GameMode,
  PlanetId,
  Planet,
  PlanetFact,
  PlanetStats,
  Mission,
  MissionObjective,
  QuizQuestion,
  QuizSession,
  GameResult,
  LevelProgress,
  SpaceProgress,
  SpaceRank,
  Level,
  Difficulty,
} from './types';
