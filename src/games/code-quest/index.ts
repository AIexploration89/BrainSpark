// Code Quest - Visual Block Programming Game
export { CodeQuest, default } from './CodeQuest';

// Components
export { CodeGrid } from './components/CodeGrid';
export { CodeEditor } from './components/CodeEditor';
export { CommandBlock, BlockPalette } from './components/CommandBlock';
export { LevelSelector } from './components/LevelSelector';
export { ResultsScreen } from './components/ResultsScreen';
export { PauseOverlay } from './components/PauseOverlay';
export { CountdownOverlay } from './components/CountdownOverlay';

// Stores
export { useCodeQuestStore, useCodeQuestProgressStore } from './stores/codeQuestStore';

// Data
export { ALL_LEVELS, CHAPTERS, getLevelById, getNextLevel, getLevelsByChapter, SCORING } from './data/levels';

// Types
export type {
  CommandType,
  TileType,
  Direction,
  CommandBlock as CommandBlockType,
  Tile,
  Robot,
  Level,
  GameState,
  GameResult,
  LevelProgress,
  Chapter,
} from './types';

export { COMMAND_DEFINITIONS, TILE_CONFIGS } from './types';
