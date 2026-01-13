import { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWordBuilderGameStore, useWordBuilderProgressStore } from './stores/wordBuilderStore';
import { getNextLevelInCategory, CATEGORY_COLORS } from './data/levels';
import type { Level, LetterAnimationState } from './types';
import { CATEGORIES, COMBO_MESSAGES } from './types';

// Components
import { LetterTile, LetterSlot } from './components/LetterTile';
import { CategorySelector, LevelSelector } from './components/LevelSelector';
import { ResultsScreen } from './components/ResultsScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';

export function WordBuilder() {
  const {
    gameState,
    selectedCategory,
    currentLevel,
    challenges,
    currentChallengeIndex,
    placedLetters,
    availableLetters,
    wordResults,
    hintsUsedThisRound,
    combo,
    timeRemaining,
    lastResults,
    setGameState,
    selectCategory,
    selectLevel,
    startRound,
    placeLetter,
    removeLetter,
    submitWord,
    useHint,
    skipWord,
    pauseGame,
    resumeGame,
    resetGame,
    tickTimer,
    shuffleAvailable,
  } = useWordBuilderGameStore();

  const { updateLevelProgress } = useWordBuilderProgressStore();

  // Animation states
  const [letterAnimation, setLetterAnimation] = useState<LetterAnimationState>('idle');
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (gameState === 'results' && lastResults && currentLevel) {
      updateLevelProgress(currentLevel.id, lastResults);
    }
  }, [gameState, lastResults, currentLevel, updateLevelProgress]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && currentLevel?.timeLimit) {
      timerRef.current = setInterval(() => {
        tickTimer();
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [gameState, currentLevel, tickTimer]);

  // Check for word completion when all letters placed
  useEffect(() => {
    if (gameState === 'playing' && placedLetters.length > 0 && !placedLetters.includes(null)) {
      // Auto-submit after a brief delay
      const timeout = setTimeout(() => {
        handleSubmit();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [placedLetters, gameState]);

  // Handle letter placement
  const handlePlaceLetter = useCallback((letterId: string) => {
    // Find first empty slot
    const emptySlotIndex = placedLetters.findIndex(l => l === null);
    if (emptySlotIndex !== -1) {
      placeLetter(letterId, emptySlotIndex);
    }
  }, [placedLetters, placeLetter]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (placedLetters.some(l => l === null)) return;

    const currentChallenge = challenges[currentChallengeIndex];
    const userWord = placedLetters.map(l => l!.letter).join('');
    const isCorrect = userWord === currentChallenge.word.word;

    if (isCorrect) {
      setLetterAnimation('correct');
      setShowCorrect(true);
      setTimeout(() => {
        setLetterAnimation('idle');
        setShowCorrect(false);
      }, 500);
    } else {
      setLetterAnimation('wrong');
      setShowWrong(true);
      setTimeout(() => {
        setLetterAnimation('idle');
        setShowWrong(false);
      }, 400);
    }

    submitWord();
  }, [placedLetters, challenges, currentChallengeIndex, submitWord]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    startRound();
  }, [startRound]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (currentLevel) {
      selectLevel(currentLevel);
    }
  }, [currentLevel, selectLevel]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (currentLevel) {
      const nextLevel = getNextLevelInCategory(currentLevel.id);
      if (nextLevel) {
        selectLevel(nextLevel);
      } else {
        setGameState('level-select');
      }
    }
  }, [currentLevel, selectLevel, setGameState]);

  // Handle quit
  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Current challenge
  const currentChallenge = challenges[currentChallengeIndex];

  // Calculate current score
  const currentScore = wordResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Get colors for current category
  const colors = selectedCategory ? CATEGORY_COLORS[selectedCategory] : CATEGORY_COLORS.mixed;
  const categoryConfig = selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory) : null;

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu onStart={() => setGameState('category-select')} onBack={() => window.history.back()} />;

      case 'category-select':
        return (
          <CategorySelector
            onSelectCategory={selectCategory}
            onBack={() => setGameState('menu')}
          />
        );

      case 'level-select':
        return selectedCategory ? (
          <LevelSelector
            category={selectedCategory}
            onSelectLevel={handleSelectLevel}
            onBack={() => setGameState('category-select')}
          />
        ) : null;

      case 'countdown':
        return (
          <CountdownOverlay
            onComplete={handleCountdownComplete}
            categoryColor={colors.primary}
          />
        );

      case 'playing':
        return currentLevel && currentChallenge ? (
          <GameplayScreen
            level={currentLevel}
            challenge={currentChallenge}
            placedLetters={placedLetters}
            availableLetters={availableLetters}
            combo={combo}
            currentChallengeIndex={currentChallengeIndex}
            totalChallenges={challenges.length}
            currentScore={currentScore}
            timeRemaining={timeRemaining}
            hintsUsed={hintsUsedThisRound}
            letterAnimation={letterAnimation}
            showCorrect={showCorrect}
            showWrong={showWrong}
            colors={colors}
            categoryConfig={categoryConfig}
            onPlaceLetter={handlePlaceLetter}
            onRemoveLetter={removeLetter}
            onUseHint={useHint}
            onSkip={skipWord}
            onShuffle={shuffleAvailable}
            onPause={pauseGame}
          />
        ) : null;

      case 'paused':
        return (
          <>
            {currentLevel && currentChallenge && (
              <GameplayScreen
                level={currentLevel}
                challenge={currentChallenge}
                placedLetters={placedLetters}
                availableLetters={availableLetters}
                combo={combo}
                currentChallengeIndex={currentChallengeIndex}
                totalChallenges={challenges.length}
                currentScore={currentScore}
                timeRemaining={timeRemaining}
                hintsUsed={hintsUsedThisRound}
                letterAnimation={letterAnimation}
                showCorrect={showCorrect}
                showWrong={showWrong}
                colors={colors}
                categoryConfig={categoryConfig}
                onPlaceLetter={handlePlaceLetter}
                onRemoveLetter={removeLetter}
                onUseHint={useHint}
                onSkip={skipWord}
                onShuffle={shuffleAvailable}
                onPause={pauseGame}
              />
            )}
            <PauseOverlay
              onResume={resumeGame}
              onRestart={handleRetry}
              onQuit={handleQuit}
              levelName={currentLevel?.name}
              currentScore={currentScore}
              wordsCompleted={currentChallengeIndex}
              totalWords={challenges.length}
            />
          </>
        );

      case 'results':
        return lastResults && currentLevel ? (
          <ResultsScreen
            results={lastResults}
            level={currentLevel}
            onRetry={handleRetry}
            onNextLevel={handleNextLevel}
            onBackToMenu={handleQuit}
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
  const { getTotalStars } = useWordBuilderProgressStore();
  const totalStars = getTotalStars();

  // Floating letters for background
  const floatingLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating letters */}
        {floatingLetters.slice(0, 15).map((char, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: `${5 + i * 6}vw` }}
            animate={{
              y: '-10vh',
              x: `${5 + i * 6 + Math.sin(i) * 3}vw`,
            }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.8,
            }}
            className="absolute text-3xl font-display font-bold text-neon-orange/15"
          >
            {char}
          </motion.div>
        ))}

        {/* Glow orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-orange/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        {/* Animated icon */}
        <motion.div
          animate={{
            rotateY: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl sm:text-8xl mb-6"
        >
          📝
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Word <span className="text-neon-orange" style={{ textShadow: '0 0 30px rgba(255,107,53,0.5)' }}>Builder</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Build words from scrambled letters and expand your vocabulary!
        </p>
      </motion.div>

      {/* Buttons */}
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
          className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-orange to-neon-yellow text-bg-primary shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:shadow-[0_0_40px_rgba(255,107,53,0.6)] transition-all"
        >
          Start Game
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
        >
          Back to Games
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
          <div className="text-2xl font-display font-bold text-neon-orange">{totalStars}</div>
          <div className="text-xs text-text-muted uppercase">Stars</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">35</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-pink">7</div>
          <div className="text-xs text-text-muted uppercase">Categories</div>
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
          <li>1. Choose a word category</li>
          <li>2. Select a difficulty level</li>
          <li>3. Tap letters to build words</li>
          <li>4. Build streaks for bonus points!</li>
        </ol>
      </motion.div>
    </div>
  );
}

// Gameplay Screen Component
interface GameplayScreenProps {
  level: Level;
  challenge: import('./types').WordChallenge;
  placedLetters: (import('./types').LetterTile | null)[];
  availableLetters: import('./types').LetterTile[];
  combo: import('./types').ComboState;
  currentChallengeIndex: number;
  totalChallenges: number;
  currentScore: number;
  timeRemaining: number | null;
  hintsUsed: number;
  letterAnimation: LetterAnimationState;
  showCorrect: boolean;
  showWrong: boolean;
  colors: { primary: string; secondary: string; glow: string };
  categoryConfig: import('./types').CategoryConfig | null | undefined;
  onPlaceLetter: (letterId: string) => void;
  onRemoveLetter: (slotIndex: number) => void;
  onUseHint: () => void;
  onSkip: () => void;
  onShuffle: () => void;
  onPause: () => void;
}

function GameplayScreen({
  level,
  challenge,
  placedLetters,
  availableLetters,
  combo,
  currentChallengeIndex,
  totalChallenges,
  currentScore,
  timeRemaining,
  hintsUsed,
  letterAnimation,
  showCorrect,
  showWrong,
  colors,
  categoryConfig,
  onPlaceLetter,
  onRemoveLetter,
  onUseHint,
  onSkip,
  onShuffle,
  onPause,
}: GameplayScreenProps) {
  // Get combo message
  const comboMessage = COMBO_MESSAGES.slice().reverse().find(c => combo.current >= c.streak);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-orange/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{categoryConfig?.icon}</span>
              <h2 className="font-display font-bold text-white text-sm sm:text-base">{level.name}</h2>
            </div>
            <p className="text-xs text-text-muted">
              Word {currentChallengeIndex + 1} of {totalChallenges}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase">Score</p>
          <p className={`font-display font-bold text-${colors.primary} text-xl`}>
            {currentScore.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentChallengeIndex / totalChallenges) * 100}%` }}
            className={`h-full bg-gradient-to-r from-${colors.primary} to-${colors.secondary} rounded-full`}
          />
        </div>
      </div>

      {/* Timer bar */}
      {timeRemaining !== null && level.timeLimit > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted">Time</span>
            <span className={`text-sm font-display font-bold ${timeRemaining <= 5 ? 'text-neon-red' : 'text-white'}`}>
              {timeRemaining}s
            </span>
          </div>
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(timeRemaining / level.timeLimit) * 100}%` }}
              className={`h-full rounded-full ${
                timeRemaining <= 5
                  ? 'bg-neon-red'
                  : timeRemaining <= 10
                  ? 'bg-neon-orange'
                  : 'bg-neon-green'
              }`}
            />
          </div>
        </div>
      )}

      {/* Main gameplay area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Combo display */}
        <AnimatePresence>
          {combo.current >= 2 && comboMessage && (
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                animate={combo.isOnFire ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-2xl">{comboMessage.emoji}</span>
                <span className={`text-xl font-display font-bold text-${colors.primary}`}>
                  {comboMessage.message}
                </span>
                <span className="text-2xl">{comboMessage.emoji}</span>
              </motion.div>
              <p className="text-sm text-text-secondary">
                {combo.current} streak! {combo.multiplier}x multiplier
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{challenge.word.imageHint}</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs">
            {challenge.hintUsed ? challenge.word.hint : 'Tap the lightbulb for a hint'}
          </p>
        </motion.div>

        {/* Word slots */}
        <div className="relative">
          {/* Success/Error overlay */}
          <AnimatePresence>
            {showCorrect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <div className="text-6xl">✓</div>
              </motion.div>
            )}
            {showWrong && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <motion.div
                  animate={{ x: [-10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl text-neon-red"
                >
                  ✗
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {placedLetters.map((letter, index) => (
              <LetterSlot
                key={index}
                index={index}
                letter={letter}
                onClick={() => letter && onRemoveLetter(index)}
                isCorrect={showCorrect}
                isWrong={showWrong}
                color={colors.primary}
                size="lg"
              />
            ))}
          </div>
        </div>

        {/* Available letters */}
        <div className="mt-4">
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-md">
            {availableLetters.map((tile, index) => (
              <LetterTile
                key={tile.id}
                tile={tile}
                onClick={() => onPlaceLetter(tile.id)}
                color={colors.primary}
                size="md"
                index={index}
                animationState={letterAnimation}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          {/* Hint button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUseHint}
            disabled={hintsUsed >= level.hintsAllowed || challenge.hintUsed}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              font-display font-semibold text-sm uppercase
              ${hintsUsed >= level.hintsAllowed || challenge.hintUsed
                ? 'bg-bg-tertiary/50 text-text-muted cursor-not-allowed'
                : 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40 hover:bg-neon-yellow/30'
              }
              transition-all
            `}
          >
            <span>💡</span>
            <span>Hint ({level.hintsAllowed - hintsUsed})</span>
          </motion.button>

          {/* Shuffle button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShuffle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm uppercase bg-bg-tertiary/50 text-text-secondary hover:text-white border border-white/10 hover:border-white/30 transition-all"
          >
            <span>🔀</span>
            <span>Shuffle</span>
          </motion.button>

          {/* Skip button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm uppercase bg-bg-tertiary/50 text-text-secondary hover:text-white border border-white/10 hover:border-white/30 transition-all"
          >
            <span>⏭️</span>
            <span>Skip</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-text-muted text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-orange">Esc</kbd> to pause
      </div>
    </div>
  );
}

export default WordBuilder;
