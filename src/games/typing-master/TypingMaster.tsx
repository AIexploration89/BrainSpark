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

// Matrix-style code characters for the rain effect
const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|/<>~';

// Code Rain Column Component
function CodeRainColumn({ delay, duration, left }: { delay: number; duration: number; left: string }) {
  const chars = Array.from({ length: 20 }, () =>
    codeChars[Math.floor(Math.random() * codeChars.length)]
  );

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: '100vh' }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{ left }}
      className="absolute top-0 flex flex-col font-mono text-xs text-neon-cyan/30"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className={i === 0 ? 'text-neon-cyan text-sm font-bold' : ''}
          style={{ opacity: 1 - (i * 0.05) }}
        >
          {char}
        </span>
      ))}
    </motion.div>
  );
}

function MainMenu({ onStart, onBack }: MainMenuProps) {
  const { progress } = useTypingProgressStore();
  const completedLevels = Object.values(progress.levels).filter(l => l.completed).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Matrix Code Rain Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {Array.from({ length: 25 }).map((_, i) => (
          <CodeRainColumn
            key={i}
            delay={Math.random() * 5}
            duration={8 + Math.random() * 8}
            left={`${i * 4}%`}
          />
        ))}
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.03) 2px, rgba(0,245,255,0.03) 4px)',
        }}
      />

      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px]"
      />

      {/* Main Content */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 relative z-10"
      >
        {/* Animated Terminal Keyboard Icon */}
        <motion.div
          className="relative inline-block mb-6"
        >
          {/* Glow ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-28 h-28 mx-auto rounded-2xl bg-neon-cyan/30 blur-xl"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          />

          {/* Keyboard container */}
          <motion.div
            animate={{
              rotateY: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-28 h-28 mx-auto flex items-center justify-center"
          >
            {/* Stylized keyboard */}
            <div className="relative">
              <motion.div
                className="w-24 h-16 rounded-lg bg-bg-secondary border-2 border-neon-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.4)] flex flex-col items-center justify-center gap-1 p-2"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,245,255,0.3)',
                    '0 0 40px rgba(0,245,255,0.5)',
                    '0 0 20px rgba(0,245,255,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Mini keyboard rows */}
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex gap-0.5">
                    {Array.from({ length: row === 2 ? 7 : 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          backgroundColor: Math.random() > 0.7
                            ? ['rgba(0,245,255,0.2)', 'rgba(0,245,255,0.6)', 'rgba(0,245,255,0.2)']
                            : 'rgba(255,255,255,0.1)',
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                          repeatDelay: Math.random() * 3,
                        }}
                        className="w-2 h-2 rounded-[2px] bg-white/10"
                      />
                    ))}
                  </div>
                ))}
                {/* Space bar */}
                <motion.div
                  animate={{
                    backgroundColor: ['rgba(0,245,255,0.1)', 'rgba(0,245,255,0.4)', 'rgba(0,245,255,0.1)'],
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="w-12 h-2 rounded-[2px] bg-neon-cyan/20"
                />
              </motion.div>

              {/* Typing indicator */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,245,255,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Title with glitch effect */}
        <div className="relative">
          <motion.h1
            className="text-5xl sm:text-6xl font-display font-bold text-white mb-2 tracking-tight"
            style={{ textShadow: '0 0 40px rgba(0,245,255,0.3)' }}
          >
            TYPING{' '}
            <motion.span
              className="text-neon-cyan inline-block"
              animate={{
                textShadow: [
                  '0 0 20px rgba(0,245,255,0.5), 0 0 40px rgba(0,245,255,0.3)',
                  '0 0 30px rgba(0,245,255,0.8), 0 0 60px rgba(0,245,255,0.5)',
                  '0 0 20px rgba(0,245,255,0.5), 0 0 40px rgba(0,245,255,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              MASTER
            </motion.span>
          </motion.h1>

          {/* Subtitle with terminal cursor */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-lg flex items-center justify-center gap-1 font-mono"
          >
            <span className="text-neon-cyan/60">&gt;</span>
            <span>Initialize typing protocol</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-neon-cyan ml-1"
            />
          </motion.p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-sm relative z-10"
      >
        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="group relative w-full py-5 px-8 rounded-xl font-display font-bold text-lg uppercase tracking-widest overflow-hidden"
        >
          {/* Button glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_100%] animate-gradient-x" />

          {/* Button border animation */}
          <div className="absolute inset-[2px] bg-bg-primary rounded-[10px]" />

          {/* Inner glow on hover */}
          <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center gap-3 text-white">
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▶
            </motion.span>
            START TYPING
          </span>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-purple" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple" />
        </motion.button>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="group w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-neon-cyan transition-all flex items-center justify-center gap-2"
        >
          <motion.span
            className="group-hover:-translate-x-1 transition-transform"
          >
            ←
          </motion.span>
          Back to Games
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex gap-4 sm:gap-6 relative z-10"
      >
        {[
          { value: '8', label: 'LEVELS', color: 'cyan', icon: '◆' },
          { value: '5', label: 'MODES', color: 'pink', icon: '◇' },
          { value: `${completedLevels}`, label: 'COMPLETE', color: 'green', icon: '✓' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className={`
              relative px-6 py-4 rounded-lg border backdrop-blur-sm
              ${stat.color === 'cyan' ? 'border-neon-cyan/30 bg-neon-cyan/5' : ''}
              ${stat.color === 'pink' ? 'border-neon-pink/30 bg-neon-pink/5' : ''}
              ${stat.color === 'green' ? 'border-neon-green/30 bg-neon-green/5' : ''}
            `}
          >
            {/* Animated corner */}
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className={`absolute top-0 right-0 w-2 h-2
                ${stat.color === 'cyan' ? 'bg-neon-cyan' : ''}
                ${stat.color === 'pink' ? 'bg-neon-pink' : ''}
                ${stat.color === 'green' ? 'bg-neon-green' : ''}
              `}
            />

            <div className={`text-3xl font-display font-bold mb-1
              ${stat.color === 'cyan' ? 'text-neon-cyan' : ''}
              ${stat.color === 'pink' ? 'text-neon-pink' : ''}
              ${stat.color === 'green' ? 'text-neon-green' : ''}
            `}>
              <span className="text-lg opacity-50 mr-1">{stat.icon}</span>
              {stat.value}
            </div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest font-mono">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* How to Play Terminal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 w-full max-w-md relative z-10"
      >
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-neon-cyan/20 overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary/50 border-b border-neon-cyan/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
            </div>
            <span className="text-xs text-text-muted font-mono ml-2">protocol.init</span>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-sm space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-start gap-2"
            >
              <span className="text-neon-cyan">01</span>
              <span className="text-text-secondary">Choose your level</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-start gap-2"
            >
              <span className="text-neon-cyan">02</span>
              <span className="text-text-secondary">Select a game mode</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-start gap-2"
            >
              <span className="text-neon-cyan">03</span>
              <span className="text-text-secondary">Type fast & accurate!</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="flex items-start gap-2"
            >
              <span className="text-neon-green">✓</span>
              <span className="text-neon-green">Build streaks for bonus XP</span>
            </motion.div>
          </div>
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
