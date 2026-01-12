import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingGameStore, useTypingProgressStore } from './stores/typingStore';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useTimer } from './hooks/useTimer';
import { getContentForLevel, storyChapters } from './data/wordLists';
import { getLevelById } from './data/levels';
import type { GameMode, TypingLevel } from './types';

// Components
import { LevelSelector } from './components/LevelSelector';
import { GameModeSelector } from './components/GameModeSelector';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { TextDisplay, SingleLetterDisplay } from './components/TextDisplay';
import { MetricsPanel } from './components/MetricsPanel';
import { CountdownOverlay } from './components/CountdownOverlay';
import { ResultsScreen } from './components/ResultsScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { WordRain } from './components/WordRain';

export function TypingMaster() {
  const {
    gameState,
    currentLevel,
    currentMode,
    characters,
    currentIndex,
    keystrokes,
    lastResults,
    timeRemaining,
    setGameState,
    selectLevel,
    selectMode,
    setTargetText,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    completeGame,
    setTimerDuration,
  } = useTypingGameStore();

  const { updateLevelProgress } = useTypingProgressStore();
  const { wpm, accuracy, correctStreak, currentChar } = useTypingEngine();
  useTimer(); // Initialize timer hook

  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null);
  const [storyChapterIndex] = useState(0);
  const [storyLineIndex] = useState(0);

  // Track key correctness for visual feedback
  useEffect(() => {
    if (keystrokes.length > 0) {
      const lastKeystroke = keystrokes[keystrokes.length - 1];
      setLastKeyCorrect(lastKeystroke.correct);

      // Reset after animation
      const timeout = setTimeout(() => setLastKeyCorrect(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [keystrokes]);

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
    if ((gameState === 'results' || gameState === 'failed') && lastResults && currentLevel) {
      updateLevelProgress(currentLevel.id, lastResults);
    }
  }, [gameState, lastResults, currentLevel, updateLevelProgress]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: TypingLevel) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle mode selection
  const handleSelectMode = useCallback((mode: GameMode, timerDuration?: number) => {
    selectMode(mode);

    if (mode === 'time-attack' && timerDuration) {
      setTimerDuration(timerDuration);
    }

    // Set up content based on mode and level
    if (currentLevel) {
      if (mode === 'story') {
        const chapter = storyChapters[storyChapterIndex];
        if (chapter) {
          setTargetText(chapter.content[storyLineIndex]);
        }
      } else {
        const content = getContentForLevel(currentLevel.id, mode === 'time-attack' ? 50 : 10);
        // Level 1 (Letter Hunt) uses single letters without spaces
        const separator = currentLevel.id === 1 ? '' : ' ';
        setTargetText(content.join(separator));
      }
    }

    setGameState('countdown');
  }, [selectMode, currentLevel, setTimerDuration, setTargetText, setGameState, storyChapterIndex, storyLineIndex]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    startGame();
  }, [startGame]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (currentLevel) {
      const content = getContentForLevel(currentLevel.id, currentMode === 'time-attack' ? 50 : 10);
      const separator = currentLevel.id === 1 ? '' : ' ';
      setTargetText(content.join(separator));
      setGameState('countdown');
    }
  }, [currentLevel, currentMode, setTargetText, setGameState]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (currentLevel) {
      const nextLevel = getLevelById(currentLevel.id + 1);
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

  // Handle Word Rain game over
  const handleWordRainGameOver = useCallback(() => {
    completeGame();
  }, [completeGame]);

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

      case 'mode-select':
        return currentLevel ? (
          <GameModeSelector
            level={currentLevel}
            onSelectMode={handleSelectMode}
            onBack={() => setGameState('level-select')}
          />
        ) : null;

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'playing':
        return currentMode === 'word-rain' ? (
          <WordRainGame
            level={currentLevel}
            onPause={pauseGame}
            onGameOver={handleWordRainGameOver}
          />
        ) : (
          <TypingGame
            level={currentLevel}
            mode={currentMode}
            characters={characters}
            currentIndex={currentIndex}
            currentChar={currentChar}
            lastKeyCorrect={lastKeyCorrect}
            wpm={wpm}
            accuracy={accuracy}
            streak={correctStreak}
            timeRemaining={timeRemaining}
            onPause={pauseGame}
          />
        );

      case 'paused':
        return (
          <>
            <TypingGame
              level={currentLevel}
              mode={currentMode}
              characters={characters}
              currentIndex={currentIndex}
              currentChar={currentChar}
              lastKeyCorrect={lastKeyCorrect}
              wpm={wpm}
              accuracy={accuracy}
              streak={correctStreak}
              timeRemaining={timeRemaining}
              onPause={pauseGame}
            />
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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="text-6xl mb-4">⌨️</div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Typing <span className="text-neon-cyan">Master</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Learn to type like a pro! From single letters to full paragraphs.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all"
        >
          Start Typing
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

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center"
      >
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">8</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-pink">5</div>
          <div className="text-xs text-text-muted uppercase">Modes</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-green">∞</div>
          <div className="text-xs text-text-muted uppercase">Fun</div>
        </div>
      </motion.div>
    </div>
  );
}

// Typing Game Component
interface TypingGameProps {
  level: TypingLevel | null;
  mode: GameMode;
  characters: { char: string; state: string; index: number }[];
  currentIndex: number;
  currentChar: string | null;
  lastKeyCorrect: boolean | null;
  wpm: number;
  accuracy: number;
  streak: number;
  timeRemaining: number | null;
  onPause: () => void;
}

function TypingGame({
  level,
  mode,
  characters,
  currentIndex,
  currentChar,
  lastKeyCorrect,
  wpm,
  accuracy,
  streak,
  timeRemaining,
  onPause,
}: TypingGameProps) {
  const isLetterHunt = level?.id === 1;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white">{level?.name}</h2>
            <p className="text-xs text-text-muted capitalize">{mode} mode</p>
          </div>
        </div>

        <MetricsPanel
          wpm={wpm}
          accuracy={accuracy}
          streak={streak}
          timeRemaining={timeRemaining}
          showTimer={mode === 'time-attack'}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {isLetterHunt ? (
          <SingleLetterDisplay
            letter={currentChar || ''}
            isCorrect={lastKeyCorrect}
          />
        ) : (
          <TextDisplay
            characters={characters as any}
            currentIndex={currentIndex}
            fontSize={level && level.id >= 7 ? 'md' : 'lg'}
          />
        )}

        <KeyboardVisualizer
          activeKey={currentChar}
          lastKeyCorrect={lastKeyCorrect}
          highlightHomeRow={level?.id === 2}
        />
      </div>

      {/* Hint */}
      <div className="text-center text-text-muted text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-cyan">Esc</kbd> to pause
      </div>
    </div>
  );
}

// Word Rain Game Component
interface WordRainGameProps {
  level: TypingLevel | null;
  onPause: () => void;
  onGameOver: () => void;
}

function WordRainGame({ level, onPause, onGameOver }: WordRainGameProps) {
  const difficulty = level ? (level.difficulty as 'easy' | 'medium' | 'hard') : 'easy';

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white">Word Rain</h2>
            <p className="text-xs text-text-muted capitalize">{difficulty} difficulty</p>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center">
        <WordRain difficulty={difficulty} onGameOver={onGameOver} />
      </div>
    </div>
  );
}

export default TypingMaster;
