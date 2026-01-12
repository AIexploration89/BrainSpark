import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathGameStore, useMathProgressStore } from './stores/mathStore';
import { getNextLevelInOperation } from './data/levels';
import type { Level, NumberAnimationState } from './types';

// Components
import { EquationDisplay } from './components/EquationDisplay';
import { AnswerInput, ChoiceInput } from './components/AnswerInput';
import { ComboMeter } from './components/ComboMeter';
import { LevelSelector, OperationSelector } from './components/LevelSelector';
import { ResultsScreen } from './components/ResultsScreen';
import { CountdownOverlay, TimerBar } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';

export function MathBasics() {
  const {
    gameState,
    selectedOperation,
    currentLevel,
    inputMode,
    problems,
    currentProblemIndex,
    currentAnswer,
    problemResults,
    combo,
    timeRemaining,
    lastResults,
    setGameState,
    selectOperation,
    selectLevel,
    startRound,
    submitAnswer,
    updateAnswer,
    clearAnswer,
    backspaceAnswer,
    skipProblem,
    pauseGame,
    resumeGame,
    resetGame,
    tickTimer,
  } = useMathGameStore();

  const { updateLevelProgress } = useMathProgressStore();

  // Animation state for equation display
  const [animationState, setAnimationState] = useState<NumberAnimationState>('idle');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | null>(null);

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

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (!currentAnswer) return;

    const answer = parseInt(currentAnswer, 10);
    const currentProblem = problems[currentProblemIndex];
    const isCorrect = answer === currentProblem?.correctAnswer;

    // Trigger animation
    setAnimationState(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);
    setLastResult(isCorrect);

    // Submit after short delay to show animation
    setTimeout(() => {
      submitAnswer(answer);
      setAnimationState('idle');
      setShowResult(false);
    }, isCorrect ? 600 : 800);
  }, [currentAnswer, problems, currentProblemIndex, submitAnswer]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((answer: number) => {
    const currentProblem = problems[currentProblemIndex];
    const isCorrect = answer === currentProblem?.correctAnswer;

    setAnimationState(isCorrect ? 'correct' : 'wrong');
    setShowResult(true);
    setLastResult(isCorrect);

    setTimeout(() => {
      submitAnswer(answer);
      setAnimationState('idle');
      setShowResult(false);
    }, isCorrect ? 600 : 800);
  }, [problems, currentProblemIndex, submitAnswer]);

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
      const nextLevel = getNextLevelInOperation(currentLevel.id);
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

  // Current problem
  const currentProblem = problems[currentProblemIndex];

  // Calculate current score
  const currentScore = problemResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu onStart={() => setGameState('mode-select')} onBack={() => window.history.back()} />;

      case 'mode-select':
        return (
          <OperationSelector
            onSelectOperation={(op) => selectOperation(op)}
            onBack={() => setGameState('menu')}
          />
        );

      case 'level-select':
        return selectedOperation ? (
          <LevelSelector
            operation={selectedOperation}
            onSelectLevel={handleSelectLevel}
            onBack={() => setGameState('mode-select')}
          />
        ) : null;

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'playing':
        return currentLevel && currentProblem ? (
          <GameplayScreen
            level={currentLevel}
            problem={currentProblem}
            currentAnswer={currentAnswer}
            combo={combo}
            currentProblemIndex={currentProblemIndex}
            totalProblems={problems.length}
            currentScore={currentScore}
            timeRemaining={timeRemaining}
            inputMode={inputMode}
            animationState={animationState}
            showResult={showResult}
            lastResult={lastResult}
            onDigit={updateAnswer}
            onSubmit={handleSubmit}
            onClear={clearAnswer}
            onBackspace={backspaceAnswer}
            onSkip={skipProblem}
            onChoiceSelect={handleChoiceSelect}
            onPause={pauseGame}
          />
        ) : null;

      case 'paused':
        return (
          <>
            {currentLevel && currentProblem && (
              <GameplayScreen
                level={currentLevel}
                problem={currentProblem}
                currentAnswer={currentAnswer}
                combo={combo}
                currentProblemIndex={currentProblemIndex}
                totalProblems={problems.length}
                currentScore={currentScore}
                timeRemaining={timeRemaining}
                inputMode={inputMode}
                animationState={animationState}
                showResult={showResult}
                lastResult={lastResult}
                onDigit={updateAnswer}
                onSubmit={handleSubmit}
                onClear={clearAnswer}
                onBackspace={backspaceAnswer}
                onSkip={skipProblem}
                onChoiceSelect={handleChoiceSelect}
                onPause={pauseGame}
              />
            )}
            <PauseOverlay
              onResume={resumeGame}
              onRestart={handleRetry}
              onQuit={handleQuit}
              levelName={currentLevel?.name}
              currentScore={currentScore}
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
  const { getTotalStars } = useMathProgressStore();
  const totalStars = getTotalStars();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating numbers */}
        {['+', '-', '×', '÷', '=', '1', '2', '3', '4', '5'].map((char, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: `${10 + i * 9}vw` }}
            animate={{
              y: '-10vh',
              x: `${10 + i * 9 + Math.sin(i) * 5}vw`,
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1.5,
            }}
            className="absolute text-4xl font-display font-bold text-neon-green/20"
          >
            {char}
          </motion.div>
        ))}

        {/* Glow orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
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
        {/* Animated calculator icon */}
        <motion.div
          animate={{
            rotateY: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl sm:text-8xl mb-6"
        >
          ➕
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Math <span className="text-neon-green" style={{ textShadow: '0 0 30px rgba(0,255,136,0.5)' }}>Basics</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Master addition, subtraction, multiplication, and division!
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
          className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-neon-cyan text-bg-primary shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all"
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-2xl font-display font-bold text-neon-green">{totalStars}</div>
          <div className="text-xs text-text-muted uppercase">Stars</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">24</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-orange">5</div>
          <div className="text-xs text-text-muted uppercase">Operations</div>
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
          <li>1. Choose a math operation to practice</li>
          <li>2. Select a level difficulty</li>
          <li>3. Solve problems fast for bonus points!</li>
          <li>4. Build streaks for score multipliers!</li>
        </ol>
      </motion.div>
    </div>
  );
}

// Gameplay Screen Component
interface GameplayScreenProps {
  level: Level;
  problem: import('./types').Problem;
  currentAnswer: string;
  combo: import('./types').ComboState;
  currentProblemIndex: number;
  totalProblems: number;
  currentScore: number;
  timeRemaining: number | null;
  inputMode: import('./types').InputMode;
  animationState: NumberAnimationState;
  showResult: boolean;
  lastResult: boolean | null;
  onDigit: (digit: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onSkip: () => void;
  onChoiceSelect: (answer: number) => void;
  onPause: () => void;
}

function GameplayScreen({
  level,
  problem,
  currentAnswer,
  combo,
  currentProblemIndex,
  totalProblems,
  currentScore,
  timeRemaining,
  inputMode,
  animationState,
  showResult,
  lastResult,
  onDigit,
  onSubmit,
  onClear,
  onBackspace,
  onSkip,
  onChoiceSelect,
  onPause,
}: GameplayScreenProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-green/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-sm sm:text-base">{level.name}</h2>
            <p className="text-xs text-text-muted">
              Problem {currentProblemIndex + 1} of {totalProblems}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <p className="text-xs text-text-muted uppercase">Score</p>
          <p className="font-display font-bold text-neon-green text-xl">
            {currentScore.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentProblemIndex) / totalProblems) * 100}%` }}
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full"
          />
        </div>
      </div>

      {/* Timer (if applicable) */}
      {timeRemaining !== null && level.timeLimit > 0 && (
        <div className="mb-4">
          <TimerBar timeRemaining={timeRemaining} maxTime={level.timeLimit} />
        </div>
      )}

      {/* Main gameplay area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Combo meter */}
        <div className="w-full max-w-sm">
          {combo.current > 0 ? (
            <ComboMeter combo={combo} />
          ) : (
            <div className="h-16" /> // Placeholder for layout stability
          )}
        </div>

        {/* Equation display */}
        <EquationDisplay
          problem={problem}
          userAnswer={currentAnswer}
          animationState={animationState}
          showResult={showResult}
          isCorrect={lastResult ?? undefined}
        />

        {/* Input area */}
        <div className="mt-4">
          {inputMode === 'numpad' ? (
            <AnswerInput
              onDigit={onDigit}
              onSubmit={onSubmit}
              onClear={onClear}
              onBackspace={onBackspace}
              onSkip={onSkip}
              currentAnswer={currentAnswer}
              disabled={showResult}
            />
          ) : (
            <ChoiceInput
              choices={problem.choices || []}
              onSelect={onChoiceSelect}
              disabled={showResult}
              correctAnswer={problem.correctAnswer}
              showResult={showResult}
              selectedAnswer={showResult ? parseInt(currentAnswer) : null}
            />
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-text-muted text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-green">Esc</kbd> to pause
      </div>
    </div>
  );
}

export default MathBasics;
