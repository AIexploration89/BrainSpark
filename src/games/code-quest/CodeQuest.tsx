import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCodeQuestStore, useCodeQuestProgressStore } from './stores/codeQuestStore';
import { getNextLevel } from './data/levels';
import type { Level, CommandType } from './types';

// Components
import { CodeGrid } from './components/CodeGrid';
import { CodeEditor } from './components/CodeEditor';
import { BlockPalette } from './components/CommandBlock';
import { LevelSelector } from './components/LevelSelector';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ResultsScreen } from './components/ResultsScreen';

export function CodeQuest() {
  const {
    gameState,
    currentLevel,
    robot,
    tiles,
    availableCommands,
    programBlocks,
    isExecuting,
    executionSpeed,
    currentExecutionIndex,
    lastResults,
    setGameState,
    selectLevel,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockValue,
    clearProgram,
    startExecution,
    stepExecution,
    stopExecution,
    setExecutionSpeed,
    pauseGame,
    resumeGame,
    resetGame,
  } = useCodeQuestStore();

  const { updateLevelProgress } = useCodeQuestProgressStore();
  const executionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'building' || gameState === 'executing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
      }

      // Space to run/pause execution
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        if (gameState === 'building' && programBlocks.length > 0) {
          startExecution();
        } else if (gameState === 'executing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, programBlocks.length, pauseGame, resumeGame, startExecution]);

  // Save results when game completes
  useEffect(() => {
    if ((gameState === 'results' || gameState === 'failed') && lastResults && currentLevel) {
      updateLevelProgress(currentLevel.id, lastResults);
    }
  }, [gameState, lastResults, currentLevel, updateLevelProgress]);

  // Execution loop
  useEffect(() => {
    if (isExecuting && gameState === 'executing') {
      executionTimerRef.current = setTimeout(() => {
        stepExecution();
        // Execution continues until stepExecution returns null or changes state
      }, executionSpeed);

      return () => {
        if (executionTimerRef.current) {
          clearTimeout(executionTimerRef.current);
        }
      };
    }
  }, [isExecuting, gameState, currentExecutionIndex, executionSpeed, stepExecution]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setGameState('building');
  }, [setGameState]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (currentLevel) {
      selectLevel(currentLevel);
    }
  }, [currentLevel, selectLevel]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (currentLevel) {
      const next = getNextLevel(currentLevel.id);
      if (next) {
        selectLevel(next);
      } else {
        setGameState('level-select');
      }
    }
  }, [currentLevel, selectLevel, setGameState]);

  // Handle quit
  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Handle add block
  const handleAddBlock = useCallback((type: CommandType) => {
    addBlock(type);
  }, [addBlock]);

  // Handle run
  const handleRun = useCallback(() => {
    if (programBlocks.length > 0) {
      startExecution();
    }
  }, [programBlocks.length, startExecution]);

  // Handle stop
  const handleStop = useCallback(() => {
    stopExecution();
  }, [stopExecution]);

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu
            onStart={() => setGameState('level-select')}
            onBack={() => window.history.back()}
          />
        );

      case 'level-select':
        return (
          <LevelSelector
            onSelectLevel={handleSelectLevel}
            onBack={() => setGameState('menu')}
          />
        );

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'building':
      case 'executing':
        return currentLevel ? (
          <GameplayScreen
            level={currentLevel}
            robot={robot}
            tiles={tiles}
            availableCommands={availableCommands}
            programBlocks={programBlocks}
            isExecuting={isExecuting}
            executionSpeed={executionSpeed}
            currentExecutionIndex={currentExecutionIndex}
            onAddBlock={handleAddBlock}
            onRemoveBlock={removeBlock}
            onMoveBlock={moveBlock}
            onValueChange={updateBlockValue}
            onClear={clearProgram}
            onRun={handleRun}
            onStop={handleStop}
            onSpeedChange={setExecutionSpeed}
            onPause={pauseGame}
          />
        ) : null;

      case 'paused':
        return (
          <>
            {currentLevel && (
              <GameplayScreen
                level={currentLevel}
                robot={robot}
                tiles={tiles}
                availableCommands={availableCommands}
                programBlocks={programBlocks}
                isExecuting={false}
                executionSpeed={executionSpeed}
                currentExecutionIndex={currentExecutionIndex}
                onAddBlock={handleAddBlock}
                onRemoveBlock={removeBlock}
                onMoveBlock={moveBlock}
                onValueChange={updateBlockValue}
                onClear={clearProgram}
                onRun={handleRun}
                onStop={handleStop}
                onSpeedChange={setExecutionSpeed}
                onPause={pauseGame}
              />
            )}
            <PauseOverlay
              onResume={resumeGame}
              onRestart={handleRetry}
              onQuit={handleQuit}
            />
          </>
        );

      case 'results':
      case 'failed':
        return lastResults && currentLevel ? (
          <ResultsScreen
            results={lastResults}
            level={currentLevel}
            onRetry={handleRetry}
            onNextLevel={handleNextLevel}
            onBackToMenu={handleQuit}
            isFailure={gameState === 'failed'}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Matrix background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(0,255,136,0.1) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(0,245,255,0.05) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen relative z-10"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Main Menu Component
interface MainMenuProps {
  onStart: () => void;
  onBack: () => void;
}

function MainMenu({ onStart, onBack }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated code background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-neon-green text-xs whitespace-pre"
            style={{
              left: `${10 + i * 12}%`,
              top: -100,
            }}
            animate={{
              y: ['0vh', '110vh'],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            {`function solve() {
  while (!atGoal) {
    if (blocked) {
      turn();
    } else {
      moveForward();
    }
  }
  return success;
}`}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        {/* Animated terminal icon */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(0,255,136,0.3)',
              '0 0 40px rgba(0,255,136,0.5)',
              '0 0 20px rgba(0,255,136,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block p-6 rounded-2xl bg-bg-secondary border border-neon-green/30 mb-6"
        >
          <div className="text-6xl">💻</div>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Code <span className="text-neon-green" style={{ textShadow: '0 0 30px rgba(0,255,136,0.5)' }}>Quest</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Learn to code by programming Sparky the robot!
        </p>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 font-mono text-sm text-neon-green/70"
        >
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            &gt; _
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 w-full max-w-xs relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-white shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all"
        >
          {'<Start Coding />'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
        >
          {'<- Back to Games'}
        </motion.button>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-2xl font-display font-bold text-neon-green">30</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-purple">5</div>
          <div className="text-xs text-text-muted uppercase">Concepts</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">∞</div>
          <div className="text-xs text-text-muted uppercase">Possibilities</div>
        </div>
      </motion.div>

      {/* Features preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-3 gap-4 max-w-md relative z-10"
      >
        {[
          { icon: '📝', label: 'Sequences' },
          { icon: '🔄', label: 'Loops' },
          { icon: '❓', label: 'Conditionals' },
        ].map((item) => (
          <div
            key={item.label}
            className="text-center p-3 bg-bg-secondary/50 rounded-xl border border-white/10"
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs text-text-muted">{item.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Gameplay Screen Component
interface GameplayScreenProps {
  level: Level;
  robot: import('./types').Robot;
  tiles: import('./types').Tile[];
  availableCommands: CommandType[];
  programBlocks: import('./types').CommandBlock[];
  isExecuting: boolean;
  executionSpeed: number;
  currentExecutionIndex: number;
  onAddBlock: (type: CommandType) => void;
  onRemoveBlock: (instanceId: string) => void;
  onMoveBlock: (instanceId: string, newIndex: number) => void;
  onValueChange: (instanceId: string, value: number) => void;
  onClear: () => void;
  onRun: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
  onPause: () => void;
}

function GameplayScreen({
  level,
  robot,
  tiles,
  availableCommands,
  programBlocks,
  isExecuting,
  executionSpeed,
  currentExecutionIndex,
  onAddBlock,
  onRemoveBlock,
  onMoveBlock,
  onValueChange,
  onClear,
  onRun,
  onStop,
  onSpeedChange,
  onPause,
}: GameplayScreenProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Code Editor */}
      <div className="w-full lg:w-80 xl:w-96 bg-bg-secondary/50 border-r border-white/10 flex flex-col">
        {/* Block palette */}
        <div className="p-4 border-b border-white/10">
          <BlockPalette
            availableCommands={availableCommands}
            onAddBlock={onAddBlock}
            disabled={isExecuting}
          />
        </div>

        {/* Code editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            blocks={programBlocks}
            maxBlocks={level.maxBlocks}
            currentExecutionIndex={currentExecutionIndex}
            isExecuting={isExecuting}
            onAddBlock={onAddBlock}
            onRemoveBlock={onRemoveBlock}
            onMoveBlock={onMoveBlock}
            onValueChange={onValueChange}
            onClear={onClear}
          />
        </div>

        {/* Control buttons */}
        <div className="p-4 border-t border-white/10 bg-bg-tertiary/30">
          <div className="flex gap-2">
            {!isExecuting ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRun}
                disabled={programBlocks.length === 0}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-display font-semibold uppercase tracking-wider
                  transition-all
                  ${programBlocks.length === 0
                    ? 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                    : 'bg-gradient-to-r from-neon-green to-emerald-500 text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                  }
                `}
              >
                ▶ Run
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStop}
                className="flex-1 py-3 px-4 rounded-xl font-display font-semibold uppercase tracking-wider bg-neon-red text-white"
              >
                ■ Stop
              </motion.button>
            )}

            {/* Speed control */}
            <div className="flex items-center gap-1 px-2 bg-bg-tertiary rounded-xl">
              {[
                { speed: 800, label: '1x' },
                { speed: 400, label: '2x' },
                { speed: 200, label: '4x' },
              ].map(({ speed, label }) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`
                    px-2 py-1 rounded text-xs font-mono transition-colors
                    ${executionSpeed === speed
                      ? 'bg-neon-cyan/20 text-neon-cyan'
                      : 'text-text-muted hover:text-white'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Game area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-green/50 transition-colors"
            >
              ⏸
            </motion.button>
            <div>
              <h2 className="font-display font-bold text-white">{level.name}</h2>
              <p className="text-xs text-text-muted">
                Chapter {level.chapter} • {level.chapterName}
              </p>
            </div>
          </div>

          {/* Level info */}
          <div className="flex items-center gap-4">
            {level.coinsRequired && (
              <div className="flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded-full">
                <span>🪙</span>
                <span className="font-mono text-sm text-neon-yellow">
                  {robot.coins}/{level.coinsRequired}
                </span>
              </div>
            )}
            {level.gemsRequired && (
              <div className="flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded-full">
                <span>💎</span>
                <span className="font-mono text-sm text-neon-cyan">
                  {robot.gems}/{level.gemsRequired}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Game grid centered */}
        <div className="flex-1 flex items-center justify-center">
          <CodeGrid
            tiles={tiles}
            gridSize={level.gridSize}
            robot={robot}
            isExecuting={isExecuting}
          />
        </div>

        {/* Level description / hints */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-bg-secondary/50 rounded-xl border border-white/10"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm text-text-secondary mb-2">{level.description}</p>
              {level.hints[0] && (
                <p className="text-xs text-text-muted">
                  <span className="text-neon-cyan">Hint:</span> {level.hints[0]}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-center text-xs text-text-muted">
          Press <kbd className="px-2 py-0.5 bg-bg-secondary rounded">Space</kbd> to run •
          <kbd className="px-2 py-0.5 bg-bg-secondary rounded ml-1">Esc</kbd> to pause
        </div>
      </div>
    </div>
  );
}

export default CodeQuest;
