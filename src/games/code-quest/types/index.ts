// Code Quest Game Types

export type GameState =
  | 'menu'           // Main game menu
  | 'level-select'   // Choose level
  | 'countdown'      // Pre-game countdown
  | 'building'       // Player is building their program
  | 'executing'      // Program is running
  | 'paused'         // Game paused
  | 'results'        // Level completed successfully
  | 'failed';        // Level failed

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export type CommandType =
  | 'move_forward'
  | 'move_backward'
  | 'turn_left'
  | 'turn_right'
  | 'jump'
  | 'wait'
  | 'interact'
  | 'loop_start'
  | 'loop_end'
  | 'if_start'
  | 'if_end'
  | 'if_else';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileType =
  | 'empty'       // Walkable empty space
  | 'floor'       // Regular floor
  | 'wall'        // Solid wall - cannot pass
  | 'start'       // Starting position
  | 'goal'        // Target destination
  | 'coin'        // Collectible
  | 'gem'         // Bonus collectible
  | 'spike'       // Hazard - fail on touch
  | 'pit'         // Can jump over
  | 'button'      // Activates something
  | 'door'        // Opens when button pressed
  | 'portal_a'    // Teleport entrance
  | 'portal_b'    // Teleport exit
  | 'ice'         // Slippery - slide until wall
  | 'cracked';    // Breaks after stepping

export type ConditionType =
  | 'facing_wall'
  | 'facing_coin'
  | 'facing_gem'
  | 'facing_goal'
  | 'facing_pit'
  | 'on_button';

export interface Command {
  id: string;
  type: CommandType;
  label: string;
  icon: string;
  color: string;
  description: string;
  // For loops and conditionals
  value?: number;        // Loop count
  condition?: ConditionType;
  // For nested blocks
  children?: Command[];
}

export interface CommandBlock extends Command {
  instanceId: string;    // Unique instance ID for drag-drop
  isPlaced: boolean;
  nestLevel: number;
}

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  type: TileType;
  position: Position;
  isActive?: boolean;     // For buttons, doors, etc.
  linkedTo?: string;      // For button->door connections
  variant?: number;       // Visual variant
}

export interface Robot {
  position: Position;
  direction: Direction;
  isJumping: boolean;
  isMoving: boolean;
  coins: number;
  gems: number;
  energy: number;
}

export interface Level {
  id: number;
  name: string;
  chapter: number;        // 1-5 for the 5 concept groups
  chapterName: string;
  description: string;
  difficulty: Difficulty;
  gridSize: { rows: number; cols: number };
  tiles: Tile[];
  startPosition: Position;
  startDirection: Direction;
  availableCommands: CommandType[];
  maxBlocks: number;      // Block limit for efficiency
  goalType: 'reach_goal' | 'collect_all' | 'collect_and_reach';
  coinsRequired?: number;
  gemsRequired?: number;
  hints: string[];
  tutorialSteps?: TutorialStep[];
  unlockRequirement?: number; // Stars needed from previous levels
}

export interface TutorialStep {
  message: string;
  highlightElement?: string;
  action?: 'drag' | 'click' | 'wait';
}

export interface ExecutionStep {
  commandId: string;
  robotState: Robot;
  tileChanges?: { id: string; newState: Partial<Tile> }[];
  message?: string;
  success: boolean;
  isLastStep: boolean;
}

export interface GameResult {
  levelId: number;
  completed: boolean;
  stars: number;          // 1-3 stars based on performance
  blocksUsed: number;
  optimalBlocks: number;
  coinsCollected: number;
  gemsCollected: number;
  executionSteps: number;
  timeSpent: number;      // ms
  score: number;
  xpEarned: number;
  sparksEarned: number;
  isPerfect: boolean;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  bestBlocks: number;
  bestTime: number;
  timesPlayed: number;
  unlocked: boolean;
}

export interface ChapterProgress {
  chapter: number;
  levelsCompleted: number;
  totalLevels: number;
  starsEarned: number;
  maxStars: number;
  unlocked: boolean;
}

export interface CodeQuestStats {
  totalLevelsCompleted: number;
  totalStars: number;
  totalCoins: number;
  totalGems: number;
  perfectLevels: number;
  conceptsMastered: string[];
}

export interface Chapter {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
  levels: number;
  comingSoon?: boolean;
}

// Command definitions
export const COMMAND_DEFINITIONS: Record<CommandType, Omit<Command, 'id'>> = {
  move_forward: {
    type: 'move_forward',
    label: 'Forward',
    icon: '▲',
    color: '#00ff88',
    description: 'Move one step forward',
  },
  move_backward: {
    type: 'move_backward',
    label: 'Backward',
    icon: '▼',
    color: '#00ff88',
    description: 'Move one step backward',
  },
  turn_left: {
    type: 'turn_left',
    label: 'Turn Left',
    icon: '↺',
    color: '#00f5ff',
    description: 'Turn 90° to the left',
  },
  turn_right: {
    type: 'turn_right',
    label: 'Turn Right',
    icon: '↻',
    color: '#00f5ff',
    description: 'Turn 90° to the right',
  },
  jump: {
    type: 'jump',
    label: 'Jump',
    icon: '⤴',
    color: '#ff00ff',
    description: 'Jump over one tile',
  },
  wait: {
    type: 'wait',
    label: 'Wait',
    icon: '⏸',
    color: '#ffff00',
    description: 'Wait for one turn',
  },
  interact: {
    type: 'interact',
    label: 'Interact',
    icon: '✋',
    color: '#ff8800',
    description: 'Push, pull, or activate',
  },
  loop_start: {
    type: 'loop_start',
    label: 'Repeat',
    icon: '🔄',
    color: '#8b5cf6',
    description: 'Repeat commands',
  },
  loop_end: {
    type: 'loop_end',
    label: 'End Repeat',
    icon: '↩',
    color: '#8b5cf6',
    description: 'End of repeat block',
  },
  if_start: {
    type: 'if_start',
    label: 'If',
    icon: '❓',
    color: '#ff3366',
    description: 'Conditional check',
  },
  if_else: {
    type: 'if_else',
    label: 'Else',
    icon: '↔',
    color: '#ff3366',
    description: 'Otherwise do this',
  },
  if_end: {
    type: 'if_end',
    label: 'End If',
    icon: '✓',
    color: '#ff3366',
    description: 'End of condition',
  },
};

// Tile visual configurations
export const TILE_CONFIGS: Record<TileType, { emoji: string; color: string; walkable: boolean }> = {
  empty: { emoji: '', color: 'transparent', walkable: true },
  floor: { emoji: '', color: '#1a1a2e', walkable: true },
  wall: { emoji: '🧱', color: '#2d2d44', walkable: false },
  start: { emoji: '🚀', color: '#00ff88', walkable: true },
  goal: { emoji: '🎯', color: '#ff00ff', walkable: true },
  coin: { emoji: '🪙', color: '#ffff00', walkable: true },
  gem: { emoji: '💎', color: '#00f5ff', walkable: true },
  spike: { emoji: '🔺', color: '#ff3366', walkable: false },
  pit: { emoji: '🕳️', color: '#0a0a0f', walkable: false },
  button: { emoji: '🔘', color: '#ff8800', walkable: true },
  door: { emoji: '🚪', color: '#8b5cf6', walkable: false },
  portal_a: { emoji: '🌀', color: '#00f5ff', walkable: true },
  portal_b: { emoji: '🌀', color: '#ff00ff', walkable: true },
  ice: { emoji: '🧊', color: '#a0e7ff', walkable: true },
  cracked: { emoji: '💔', color: '#ff6600', walkable: true },
};
