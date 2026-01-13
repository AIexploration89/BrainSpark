import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzleGameStore, usePuzzleProgressStore } from './stores/puzzleStore';
import { getNextLevel } from './data/levels';
import type { Level, PuzzleMode } from './types';

// Components
import { ModeSelector } from './components/ModeSelector';
import { LevelSelector } from './components/LevelSelector';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ResultsScreen } from './components/ResultsScreen';
import { SlidingPuzzle } from './components/SlidingPuzzle';
import { PatternMatch } from './components/PatternMatch';
import { SequencePuzzle } from './components/SequencePuzzle';
import { JigsawLite } from './components/JigsawLite';

export function PuzzleWorld() {
  const {
    gameState,
    currentMode,
    currentLevel,
    lastResults,
    setGameState,
    selectMode,
    selectLevel,
    pauseGame,
    resumeGame,
    resetGame,
    startTimer,
  } = usePuzzleGameStore();

  const { updateLevelProgress } = usePuzzleProgressStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
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
    if ((gameState === 'results' || gameState === 'failed') && lastResults) {
      updateLevelProgress(lastResults);
    }
  }, [gameState, lastResults, updateLevelProgress]);

  // Handle mode selection
  const handleSelectMode = useCallback(
    (mode: PuzzleMode) => {
      selectMode(mode);
    },
    [selectMode]
  );

  // Handle level selection
  const handleSelectLevel = useCallback(
    (level: Level) => {
      selectLevel(level);
    },
    [selectLevel]
  );

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    setGameState('playing');
    startTimer();
  }, [setGameState, startTimer]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (currentLevel) {
      selectLevel(currentLevel);
    }
  }, [currentLevel, selectLevel]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (currentMode && currentLevel) {
      const nextLevel = getNextLevel(currentMode, currentLevel.id);
      if (nextLevel) {
        selectLevel(nextLevel);
      } else {
        setGameState('level-select');
      }
    }
  }, [currentMode, currentLevel, selectLevel, setGameState]);

  // Handle quit to menu
  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Handle back from level select
  const handleBackFromLevelSelect = useCallback(() => {
    setGameState('mode-select');
  }, [setGameState]);

  // Handle back from mode select
  const handleBackFromModeSelect = useCallback(() => {
    setGameState('menu');
  }, [setGameState]);

  // Check if there's a next level
  const hasNextLevel = currentMode && currentLevel ? !!getNextLevel(currentMode, currentLevel.id) : false;

  // Render puzzle based on current mode
  const renderPuzzle = () => {
    if (!currentLevel) return null;

    switch (currentMode) {
      case 'sliding':
        return <SlidingPuzzle level={currentLevel} onPause={pauseGame} />;
      case 'pattern-match':
        return <PatternMatch level={currentLevel} onPause={pauseGame} />;
      case 'sequence':
        return <SequencePuzzle level={currentLevel} onPause={pauseGame} />;
      case 'jigsaw':
        return <JigsawLite level={currentLevel} onPause={pauseGame} />;
      default:
        return null;
    }
  };

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu onStart={() => setGameState('mode-select')} onBack={() => window.history.back()} />;

      case 'mode-select':
        return <ModeSelector onSelectMode={handleSelectMode} onBack={handleBackFromModeSelect} />;

      case 'level-select':
        return currentMode ? (
          <LevelSelector mode={currentMode} onSelectLevel={handleSelectLevel} onBack={handleBackFromLevelSelect} />
        ) : null;

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'playing':
        return renderPuzzle();

      case 'paused':
        return (
          <>
            {renderPuzzle()}
            <PauseOverlay onResume={resumeGame} onRestart={handleRetry} onQuit={handleQuit} />
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
            hasNextLevel={hasNextLevel}
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
  const { totalScore, puzzleRank } = usePuzzleProgressStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating puzzle pieces */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              opacity: 0.1,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              rotate: [null, Math.random() * 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute text-4xl"
            style={{
              filter: `hue-rotate(${i * 30}deg)`,
            }}
          >
            {['🧩', '🔢', '🎴', '🔮'][i % 4]}
          </motion.div>
        ))}

        {/* Glow orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: `
              radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(255,0,255,0.15) 0%, transparent 50%)
            `,
          }}
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: `
              radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, rgba(139,92,246,0.15) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* CRT Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-center mb-12 relative z-10"
      >
        {/* Animated icon */}
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="text-8xl sm:text-9xl mb-6"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(0,245,255,0.5))',
          }}
        >
          🧩
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-4">
          Puzzle{' '}
          <span
            className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.4))',
            }}
          >
            World
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Challenge your brain with sliding puzzles, pattern matching, sequences, and jigsaws!
        </p>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 w-full max-w-xs relative z-10"
      >
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 50px rgba(0,245,255,0.5), 0 0 100px rgba(255,0,255,0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-5 px-8 rounded-xl font-display font-bold text-xl uppercase tracking-wider text-black transition-all"
          style={{
            background: 'linear-gradient(135deg, #00F5FF 0%, #FF00FF 50%, #00FF88 100%)',
            boxShadow: '0 0 30px rgba(0,245,255,0.4), 0 0 60px rgba(255,0,255,0.2)',
          }}
        >
          Start Playing
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-3xl font-display font-bold text-neon-cyan">4</div>
          <div className="text-xs text-text-muted uppercase">Game Modes</div>
        </div>
        <div>
          <div className="text-3xl font-display font-bold text-neon-pink">32</div>
          <div className="text-xs text-text-muted uppercase">Total Levels</div>
        </div>
        <div>
          <div className="text-3xl font-display font-bold text-neon-green">96</div>
          <div className="text-xs text-text-muted uppercase">Stars to Earn</div>
        </div>
      </motion.div>

      {/* Player stats */}
      {totalScore > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-bg-secondary/50 rounded-xl border border-white/10 max-w-sm relative z-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Your Rank</p>
              <p className="font-display font-bold text-neon-yellow">{puzzleRank}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Total Score</p>
              <p className="font-display font-bold text-neon-cyan">{totalScore.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Game modes preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-4 relative z-10"
      >
        {['🔢', '🎴', '🔮', '🧩'].map((icon, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, y: -5 }}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-bg-secondary/50 border border-white/10"
            style={{
              boxShadow: `0 0 15px ${
                ['rgba(0,245,255,0.3)', 'rgba(255,0,255,0.3)', 'rgba(139,92,246,0.3)', 'rgba(0,255,136,0.3)'][i]
              }`,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default PuzzleWorld;
