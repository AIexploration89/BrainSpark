import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Level,
  CommandBlock,
  CommandType,
  Robot,
  Direction,
  Position,
  Tile,
  GameResult,
  LevelProgress,
  ExecutionStep,
} from '../types';
import { SCORING } from '../data/levels';

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Direction vectors
const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

// Turn directions
function turnLeft(dir: Direction): Direction {
  const order: Direction[] = ['up', 'left', 'down', 'right'];
  const idx = order.indexOf(dir);
  return order[(idx + 1) % 4];
}

function turnRight(dir: Direction): Direction {
  const order: Direction[] = ['up', 'right', 'down', 'left'];
  const idx = order.indexOf(dir);
  return order[(idx + 1) % 4];
}

// Check if position is valid and walkable
function isValidMove(pos: Position, tiles: Tile[], gridSize: { rows: number; cols: number }): boolean {
  if (pos.row < 0 || pos.row >= gridSize.rows || pos.col < 0 || pos.col >= gridSize.cols) {
    return false;
  }
  const tile = tiles.find(t => t.position.row === pos.row && t.position.col === pos.col);
  if (!tile) return false;

  // Check tile type
  const nonWalkable = ['wall', 'spike', 'pit'];
  if (nonWalkable.includes(tile.type)) {
    // Doors are walkable if active (open)
    if (tile.type === 'door' && tile.isActive) return true;
    return false;
  }
  return true;
}

// Get tile at position
function getTileAt(pos: Position, tiles: Tile[]): Tile | undefined {
  return tiles.find(t => t.position.row === pos.row && t.position.col === pos.col);
}

interface CodeQuestStore {
  // Game state
  gameState: GameState;
  currentLevel: Level | null;

  // Robot state
  robot: Robot;

  // Grid state
  tiles: Tile[];

  // Code editor state
  availableCommands: CommandType[];
  programBlocks: CommandBlock[];

  // Execution state
  isExecuting: boolean;
  executionSpeed: number;  // ms per step
  currentExecutionIndex: number;
  executionHistory: ExecutionStep[];

  // Results
  lastResults: GameResult | null;
  startTime: number | null;

  // Actions
  setGameState: (state: GameState) => void;
  selectLevel: (level: Level) => void;
  initializeLevel: () => void;

  // Code editor actions
  addBlock: (commandType: CommandType, index?: number) => void;
  removeBlock: (instanceId: string) => void;
  moveBlock: (instanceId: string, newIndex: number) => void;
  updateBlockValue: (instanceId: string, value: number) => void;
  clearProgram: () => void;

  // Execution actions
  startExecution: () => void;
  stepExecution: () => ExecutionStep | null;
  pauseExecution: () => void;
  resumeExecution: () => void;
  stopExecution: () => void;
  setExecutionSpeed: (speed: number) => void;

  // Game actions
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  completeLevel: () => void;
  failLevel: (reason: string) => void;
}

interface CodeQuestProgressStore {
  levelProgress: Record<number, LevelProgress>;
  updateLevelProgress: (levelId: number, result: GameResult) => void;
  getLevelProgress: (levelId: number) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: number) => boolean;
  getTotalStars: () => number;
}

export const useCodeQuestStore = create<CodeQuestStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  currentLevel: null,
  robot: {
    position: { row: 0, col: 0 },
    direction: 'right',
    isJumping: false,
    isMoving: false,
    coins: 0,
    gems: 0,
    energy: 100,
  },
  tiles: [],
  availableCommands: [],
  programBlocks: [],
  isExecuting: false,
  executionSpeed: 500,
  currentExecutionIndex: 0,
  executionHistory: [],
  lastResults: null,
  startTime: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectLevel: (level) => {
    set({
      currentLevel: level,
      gameState: 'countdown',
    });
    setTimeout(() => get().initializeLevel(), 0);
  },

  initializeLevel: () => {
    const { currentLevel } = get();
    if (!currentLevel) return;

    // Deep clone tiles to avoid mutation
    const tiles = currentLevel.tiles.map(t => ({ ...t, isActive: t.type === 'door' ? false : t.isActive }));

    set({
      tiles,
      robot: {
        position: { ...currentLevel.startPosition },
        direction: currentLevel.startDirection,
        isJumping: false,
        isMoving: false,
        coins: 0,
        gems: 0,
        energy: 100,
      },
      availableCommands: currentLevel.availableCommands,
      programBlocks: [],
      isExecuting: false,
      currentExecutionIndex: 0,
      executionHistory: [],
      lastResults: null,
      startTime: null,
    });
  },

  // Code editor actions
  addBlock: (commandType, index) => {
    const { programBlocks, currentLevel } = get();
    if (!currentLevel) return;

    // Check block limit
    if (programBlocks.length >= currentLevel.maxBlocks) return;

    const newBlock: CommandBlock = {
      id: commandType,
      instanceId: generateId(),
      type: commandType,
      label: commandType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      icon: getCommandIcon(commandType),
      color: getCommandColor(commandType),
      description: '',
      isPlaced: true,
      nestLevel: 0,
      value: commandType === 'loop_start' ? 2 : undefined,
    };

    const newBlocks = [...programBlocks];
    if (index !== undefined) {
      newBlocks.splice(index, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    set({ programBlocks: newBlocks });
  },

  removeBlock: (instanceId) => {
    const { programBlocks } = get();
    set({ programBlocks: programBlocks.filter(b => b.instanceId !== instanceId) });
  },

  moveBlock: (instanceId, newIndex) => {
    const { programBlocks } = get();
    const currentIndex = programBlocks.findIndex(b => b.instanceId === instanceId);
    if (currentIndex === -1) return;

    const newBlocks = [...programBlocks];
    const [removed] = newBlocks.splice(currentIndex, 1);
    newBlocks.splice(newIndex, 0, removed);

    set({ programBlocks: newBlocks });
  },

  updateBlockValue: (instanceId, value) => {
    const { programBlocks } = get();
    set({
      programBlocks: programBlocks.map(b =>
        b.instanceId === instanceId ? { ...b, value } : b
      ),
    });
  },

  clearProgram: () => {
    set({ programBlocks: [] });
  },

  // Execution actions
  startExecution: () => {
    const { currentLevel, programBlocks } = get();
    if (!currentLevel || programBlocks.length === 0) return;

    // Reset to initial state
    get().initializeLevel();

    set({
      isExecuting: true,
      gameState: 'executing',
      currentExecutionIndex: 0,
      executionHistory: [],
      startTime: Date.now(),
    });
  },

  stepExecution: () => {
    const {
      programBlocks,
      robot,
      tiles,
      currentLevel,
      currentExecutionIndex,
      isExecuting,
    } = get();

    if (!currentLevel || !isExecuting) return null;

    // Expand loops into flat command list
    const expandedCommands = expandProgram(programBlocks);

    if (currentExecutionIndex >= expandedCommands.length) {
      // Check win condition
      const { goalType, coinsRequired = 0, gemsRequired = 0 } = currentLevel;
      const goalTile = tiles.find(t => t.type === 'goal');
      const atGoal = goalTile &&
        robot.position.row === goalTile.position.row &&
        robot.position.col === goalTile.position.col;

      const hasEnoughCoins = robot.coins >= coinsRequired;
      const hasEnoughGems = robot.gems >= gemsRequired;

      if (goalType === 'reach_goal' && atGoal) {
        get().completeLevel();
      } else if (goalType === 'collect_all' && hasEnoughCoins && hasEnoughGems) {
        get().completeLevel();
      } else if (goalType === 'collect_and_reach' && atGoal && hasEnoughCoins && hasEnoughGems) {
        get().completeLevel();
      } else {
        get().failLevel('Goal not reached');
      }
      return null;
    }

    const currentCommand = expandedCommands[currentExecutionIndex];
    const step = executeCommand(currentCommand, robot, tiles, currentLevel);

    if (!step.success) {
      set({
        currentExecutionIndex: currentExecutionIndex + 1,
        executionHistory: [...get().executionHistory, step],
      });
      get().failLevel(step.message || 'Execution failed');
      return step;
    }

    // Update state
    set({
      robot: step.robotState,
      tiles: step.tileChanges ? applyTileChanges(tiles, step.tileChanges) : tiles,
      currentExecutionIndex: currentExecutionIndex + 1,
      executionHistory: [...get().executionHistory, step],
    });

    return step;
  },

  pauseExecution: () => {
    set({ isExecuting: false, gameState: 'paused' });
  },

  resumeExecution: () => {
    set({ isExecuting: true, gameState: 'executing' });
  },

  stopExecution: () => {
    set({ isExecuting: false, gameState: 'building' });
    get().initializeLevel();
  },

  setExecutionSpeed: (speed) => {
    set({ executionSpeed: speed });
  },

  // Game actions
  pauseGame: () => {
    const { gameState } = get();
    if (gameState === 'building' || gameState === 'executing') {
      set({ gameState: 'paused', isExecuting: false });
    }
  },

  resumeGame: () => {
    const { gameState, currentExecutionIndex, programBlocks } = get();
    if (gameState === 'paused') {
      const expandedCommands = expandProgram(programBlocks);
      if (currentExecutionIndex < expandedCommands.length) {
        set({ gameState: 'executing', isExecuting: true });
      } else {
        set({ gameState: 'building' });
      }
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      currentLevel: null,
      programBlocks: [],
      isExecuting: false,
      currentExecutionIndex: 0,
      executionHistory: [],
      lastResults: null,
    });
  },

  completeLevel: () => {
    const { currentLevel, robot, programBlocks, startTime } = get();
    if (!currentLevel) return;

    const timeSpent = startTime ? Date.now() - startTime : 0;
    const blocksUsed = programBlocks.length;
    const optimalBlocks = currentLevel.maxBlocks;

    // Calculate stars
    let stars = 1;
    if (blocksUsed <= optimalBlocks * 1.5) stars = 2;
    if (blocksUsed <= optimalBlocks) stars = 3;

    // Calculate score
    const baseScore = SCORING.BASE_SCORE_PER_LEVEL * SCORING.DIFFICULTY_MULTIPLIER[currentLevel.difficulty];
    const coinBonus = robot.coins * SCORING.COIN_BONUS;
    const gemBonus = robot.gems * SCORING.GEM_BONUS;
    const efficiencyBonus = Math.max(0, (optimalBlocks - blocksUsed) * SCORING.BLOCK_EFFICIENCY_MULTIPLIER);
    const score = Math.floor(baseScore + coinBonus + gemBonus + efficiencyBonus);

    const result: GameResult = {
      levelId: currentLevel.id,
      completed: true,
      stars,
      blocksUsed,
      optimalBlocks,
      coinsCollected: robot.coins,
      gemsCollected: robot.gems,
      executionSteps: get().executionHistory.length,
      timeSpent,
      score,
      xpEarned: score / 10,
      sparksEarned: stars * 5 + robot.coins + robot.gems * 5,
      isPerfect: stars === 3 && robot.coins >= (currentLevel.coinsRequired || 0) && robot.gems >= (currentLevel.gemsRequired || 0),
    };

    set({
      gameState: 'results',
      isExecuting: false,
      lastResults: result,
    });
  },

  failLevel: (_reason) => {
    const { currentLevel, robot, programBlocks, startTime } = get();
    if (!currentLevel) return;

    const timeSpent = startTime ? Date.now() - startTime : 0;

    const result: GameResult = {
      levelId: currentLevel.id,
      completed: false,
      stars: 0,
      blocksUsed: programBlocks.length,
      optimalBlocks: currentLevel.maxBlocks,
      coinsCollected: robot.coins,
      gemsCollected: robot.gems,
      executionSteps: get().executionHistory.length,
      timeSpent,
      score: 0,
      xpEarned: 0,
      sparksEarned: 0,
      isPerfect: false,
    };

    set({
      gameState: 'failed',
      isExecuting: false,
      lastResults: result,
    });
  },
}));

// Helper functions
function getCommandIcon(type: CommandType): string {
  const icons: Record<CommandType, string> = {
    move_forward: '▲',
    move_backward: '▼',
    turn_left: '↺',
    turn_right: '↻',
    jump: '⤴',
    wait: '⏸',
    interact: '✋',
    loop_start: '🔄',
    loop_end: '↩',
    if_start: '❓',
    if_else: '↔',
    if_end: '✓',
  };
  return icons[type];
}

function getCommandColor(type: CommandType): string {
  const colors: Record<CommandType, string> = {
    move_forward: '#00ff88',
    move_backward: '#00ff88',
    turn_left: '#00f5ff',
    turn_right: '#00f5ff',
    jump: '#ff00ff',
    wait: '#ffff00',
    interact: '#ff8800',
    loop_start: '#8b5cf6',
    loop_end: '#8b5cf6',
    if_start: '#ff3366',
    if_else: '#ff3366',
    if_end: '#ff3366',
  };
  return colors[type];
}

// Expand loops into flat command list
function expandProgram(blocks: CommandBlock[]): CommandBlock[] {
  const expanded: CommandBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'loop_start') {
      const repeatCount = block.value || 2;
      const loopContent: CommandBlock[] = [];
      let depth = 1;
      i++;

      // Find matching loop_end
      while (i < blocks.length && depth > 0) {
        if (blocks[i].type === 'loop_start') depth++;
        if (blocks[i].type === 'loop_end') depth--;
        if (depth > 0) loopContent.push(blocks[i]);
        i++;
      }

      // Expand loop content
      for (let r = 0; r < repeatCount; r++) {
        expanded.push(...expandProgram(loopContent));
      }
    } else if (block.type !== 'loop_end') {
      expanded.push(block);
      i++;
    } else {
      i++;
    }
  }

  return expanded;
}

// Execute a single command
function executeCommand(
  command: CommandBlock,
  robot: Robot,
  tiles: Tile[],
  level: Level
): ExecutionStep {
  const newRobot = { ...robot };
  const tileChanges: { id: string; newState: Partial<Tile> }[] = [];
  let success = true;
  let message = '';

  switch (command.type) {
    case 'move_forward': {
      const dir = DIRECTION_VECTORS[robot.direction];
      const newPos = {
        row: robot.position.row + dir.row,
        col: robot.position.col + dir.col,
      };

      if (!isValidMove(newPos, tiles, level.gridSize)) {
        success = false;
        message = 'Cannot move forward - blocked!';
      } else {
        newRobot.position = newPos;
        newRobot.isMoving = true;

        // Check for collectibles
        const tile = getTileAt(newPos, tiles);
        if (tile?.type === 'coin') {
          newRobot.coins++;
          tileChanges.push({ id: tile.id, newState: { type: 'floor' } });
        } else if (tile?.type === 'gem') {
          newRobot.gems++;
          tileChanges.push({ id: tile.id, newState: { type: 'floor' } });
        } else if (tile?.type === 'spike') {
          success = false;
          message = 'Ouch! Hit a spike!';
        } else if (tile?.type === 'button') {
          // Activate linked door
          const door = tiles.find(t => t.type === 'door');
          if (door) {
            tileChanges.push({ id: door.id, newState: { isActive: true, type: 'floor' } });
          }
        }
      }
      break;
    }

    case 'move_backward': {
      const dir = DIRECTION_VECTORS[robot.direction];
      const newPos = {
        row: robot.position.row - dir.row,
        col: robot.position.col - dir.col,
      };

      if (!isValidMove(newPos, tiles, level.gridSize)) {
        success = false;
        message = 'Cannot move backward - blocked!';
      } else {
        newRobot.position = newPos;
        newRobot.isMoving = true;
      }
      break;
    }

    case 'turn_left':
      newRobot.direction = turnLeft(robot.direction);
      break;

    case 'turn_right':
      newRobot.direction = turnRight(robot.direction);
      break;

    case 'jump': {
      const dir = DIRECTION_VECTORS[robot.direction];
      const jumpPos = {
        row: robot.position.row + dir.row * 2,
        col: robot.position.col + dir.col * 2,
      };

      // Check landing spot
      if (!isValidMove(jumpPos, tiles, level.gridSize)) {
        success = false;
        message = 'Cannot jump there!';
      } else {
        newRobot.position = jumpPos;
        newRobot.isJumping = true;

        // Check for collectibles at landing
        const tile = getTileAt(jumpPos, tiles);
        if (tile?.type === 'coin') {
          newRobot.coins++;
          tileChanges.push({ id: tile.id, newState: { type: 'floor' } });
        } else if (tile?.type === 'gem') {
          newRobot.gems++;
          tileChanges.push({ id: tile.id, newState: { type: 'floor' } });
        }
      }
      break;
    }

    case 'wait':
      // Do nothing, just wait
      break;

    case 'interact': {
      // Check what's in front
      const dir = DIRECTION_VECTORS[robot.direction];
      const frontPos = {
        row: robot.position.row + dir.row,
        col: robot.position.col + dir.col,
      };
      const tile = getTileAt(frontPos, tiles);

      if (tile?.type === 'button') {
        const door = tiles.find(t => t.type === 'door');
        if (door) {
          tileChanges.push({ id: door.id, newState: { isActive: !door.isActive } });
        }
      }
      break;
    }

    default:
      // Skip control blocks in execution
      break;
  }

  return {
    commandId: command.instanceId,
    robotState: newRobot,
    tileChanges: tileChanges.length > 0 ? tileChanges : undefined,
    message,
    success,
    isLastStep: false,
  };
}

// Apply tile changes
function applyTileChanges(
  tiles: Tile[],
  changes: { id: string; newState: Partial<Tile> }[]
): Tile[] {
  return tiles.map(tile => {
    const change = changes.find(c => c.id === tile.id);
    return change ? { ...tile, ...change.newState } : tile;
  });
}

// Progress store
export const useCodeQuestProgressStore = create<CodeQuestProgressStore>()(
  persist(
    (set, get) => ({
      levelProgress: {
        1: {
          levelId: 1,
          completed: false,
          stars: 0,
          bestBlocks: 0,
          bestTime: 0,
          timesPlayed: 0,
          unlocked: true,
        },
      },

      updateLevelProgress: (levelId, result) => {
        const { levelProgress } = get();
        const current = levelProgress[levelId] || {
          levelId,
          completed: false,
          stars: 0,
          bestBlocks: Infinity,
          bestTime: Infinity,
          timesPlayed: 0,
          unlocked: true,
        };

        const updated: LevelProgress = {
          ...current,
          completed: current.completed || result.completed,
          stars: Math.max(current.stars, result.stars),
          bestBlocks: result.completed ? Math.min(current.bestBlocks || Infinity, result.blocksUsed) : current.bestBlocks,
          bestTime: result.completed ? Math.min(current.bestTime || Infinity, result.timeSpent) : current.bestTime,
          timesPlayed: current.timesPlayed + 1,
        };

        // Unlock next level if completed
        let nextLevelProgress = levelProgress[levelId + 1];
        if (result.completed && !nextLevelProgress) {
          nextLevelProgress = {
            levelId: levelId + 1,
            completed: false,
            stars: 0,
            bestBlocks: 0,
            bestTime: 0,
            timesPlayed: 0,
            unlocked: true,
          };
        }

        set({
          levelProgress: {
            ...levelProgress,
            [levelId]: updated,
            ...(nextLevelProgress ? { [levelId + 1]: nextLevelProgress } : {}),
          },
        });
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress[levelId];
      },

      isLevelUnlocked: (levelId) => {
        if (levelId === 1) return true;
        const progress = get().levelProgress[levelId];
        if (progress?.unlocked) return true;

        // Check if previous level completed
        const prevProgress = get().levelProgress[levelId - 1];
        return prevProgress?.completed || false;
      },

      getTotalStars: () => {
        const { levelProgress } = get();
        return Object.values(levelProgress).reduce((sum, p) => sum + p.stars, 0);
      },
    }),
    {
      name: 'code-quest-progress',
    }
  )
);
