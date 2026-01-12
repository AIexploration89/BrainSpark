import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemoryGameStore, useMemoryProgressStore } from './stores/memoryStore';
import { getNextLevel } from './data/levels';
import type { Level } from './types';

// Components
import { GameGrid } from './components/GameGrid';
import { LevelSelector } from './components/LevelSelector';
import { CountdownOverlay } from './components/CountdownOverlay';
import { ResultsScreen } from './components/ResultsScreen';
import { PauseOverlay } from './components/PauseOverlay';

export function MemoryMatrix() {
  const {
    gameState,
    currentLevel,
    cells,
    pattern,
    playerSelections,
    currentPatternIndex,
    lastResults,
    setGameState,
    selectLevel,
    generatePattern,
    showNextPatternCell,
    selectCell,
    pauseGame,
    resumeGame,
    resetGame,
  } = useMemoryGameStore();

  const { updateLevelProgress } = useMemoryProgressStore();
  const patternTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing' || gameState === 'showing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame, resumeGame]);

  // Save results when game completes
  useEffect(() => {
    if ((gameState === 'results' || gameState === 'failed') && lastResults && currentLevel) {
      updateLevelProgress(currentLevel.id, lastResults);
    }
  }, [gameState, lastResults, currentLevel, updateLevelProgress]);

  // Handle pattern display timing
  useEffect(() => {
    if (gameState === 'showing' && currentLevel) {
      // Clear any existing timer
      if (patternTimerRef.current) {
        clearTimeout(patternTimerRef.current);
      }

      // If pattern hasn't started yet, generate it
      if (pattern.length === 0) {
        generatePattern();
        return;
      }

      // Schedule next cell display
      patternTimerRef.current = setTimeout(() => {
        showNextPatternCell();
      }, currentLevel.displayTime);

      return () => {
        if (patternTimerRef.current) {
          clearTimeout(patternTimerRef.current);
        }
      };
    }
  }, [gameState, currentLevel, pattern.length, currentPatternIndex, generatePattern, showNextPatternCell]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setGameState('showing');
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
      const nextLevel = getNextLevel(currentLevel.id);
      if (nextLevel) {
        selectLevel(nextLevel);
      } else {
        setGameState('level-select');
      }
    }
  }, [currentLevel, selectLevel, setGameState]);

  // Handle quit to menu
  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Handle cell click
  const handleCellClick = useCallback((cellId: number) => {
    if (gameState === 'playing') {
      selectCell(cellId);
    }
  }, [gameState, selectCell]);

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

      case 'showing':
      case 'playing':
        return currentLevel ? (
          <GameplayScreen
            level={currentLevel}
            cells={cells}
            pattern={pattern}
            playerSelections={playerSelections}
            isShowingPattern={gameState === 'showing'}
            onCellClick={handleCellClick}
            onPause={pauseGame}
          />
        ) : null;

      case 'paused':
        return (
          <>
            {currentLevel && (
              <GameplayScreen
                level={currentLevel}
                cells={cells}
                pattern={pattern}
                playerSelections={playerSelections}
                isShowingPattern={false}
                onCellClick={handleCellClick}
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
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
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
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        {/* Animated brain icon */}
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-7xl sm:text-8xl mb-6"
        >
          🧠
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Memory <span className="text-neon-pink" style={{ textShadow: '0 0 30px rgba(255,0,255,0.5)' }}>Matrix</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Test your memory! Watch the pattern, then recreate it.
        </p>
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
          className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-pink to-fuchsia-500 text-white shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-all"
        >
          Start Game
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
        >
          ← Back to Games
        </motion.button>
      </motion.div>

      {/* Quick info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-2xl font-display font-bold text-neon-pink">15</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">4</div>
          <div className="text-xs text-text-muted uppercase">Difficulties</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-green">6×6</div>
          <div className="text-xs text-text-muted uppercase">Max Grid</div>
        </div>
      </motion.div>

      {/* How to play hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 bg-bg-secondary/50 rounded-xl border border-white/10 max-w-md relative z-10"
      >
        <h3 className="font-display font-bold text-white text-sm mb-2">How to Play</h3>
        <ol className="text-text-secondary text-sm space-y-1">
          <li>1. Watch the cells light up in a pattern</li>
          <li>2. Click the cells in the same pattern</li>
          <li>3. Be fast and accurate for bonus points!</li>
        </ol>
      </motion.div>
    </div>
  );
}

// Gameplay Screen Component
interface GameplayScreenProps {
  level: Level;
  cells: import('./types').Cell[];
  pattern: number[];
  playerSelections: number[];
  isShowingPattern: boolean;
  onCellClick: (cellId: number) => void;
  onPause: () => void;
}

function GameplayScreen({
  level,
  cells,
  pattern,
  playerSelections,
  isShowingPattern,
  onCellClick,
  onPause,
}: GameplayScreenProps) {
  const correctCount = playerSelections.filter(id => pattern.includes(id)).length;
  const wrongCount = playerSelections.filter(id => !pattern.includes(id)).length;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-pink/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white">{level.name}</h2>
            <p className="text-xs text-text-muted">
              Level {level.id} • {level.gridSize}×{level.gridSize}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-4">
          {isShowingPattern ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 bg-neon-pink/20 border border-neon-pink/30 rounded-full"
            >
              <span className="text-neon-pink font-display font-bold text-sm">
                👀 WATCH!
              </span>
            </motion.div>
          ) : (
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-xs text-text-muted">Found</p>
                <p className="font-display font-bold text-neon-green">
                  {correctCount}/{pattern.length}
                </p>
              </div>
              {wrongCount > 0 && (
                <div className="text-center">
                  <p className="text-xs text-text-muted">Wrong</p>
                  <p className="font-display font-bold text-neon-red">
                    {wrongCount}/3
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game grid container */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Phase indicator */}
        <motion.div
          key={isShowingPattern ? 'showing' : 'playing'}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          {isShowingPattern ? (
            <>
              <p className="text-text-secondary text-sm mb-1">Memorize the pattern</p>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: pattern.length }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-2 h-2 rounded-full ${
                      i <= cells.findIndex(c => c.isActive)
                        ? 'bg-neon-pink'
                        : 'bg-bg-tertiary'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-neon-cyan font-display font-bold">
              TAP THE CELLS!
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <GameGrid
          cells={cells}
          gridSize={level.gridSize}
          onCellClick={onCellClick}
          disabled={isShowingPattern}
        />

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-muted text-sm text-center"
        >
          {isShowingPattern
            ? `${level.patternLength} cells to remember`
            : `Click ${pattern.length - correctCount} more cells`
          }
        </motion.p>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-text-muted text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-pink">Esc</kbd> to pause
      </div>
    </div>
  );
}

export default MemoryMatrix;
