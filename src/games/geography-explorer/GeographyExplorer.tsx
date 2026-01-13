import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeoGameStore, useGeoProgressStore } from './stores/geoStore';
import { getNextLevel } from './data/levels';
import type { Level, GameMode, Continent } from './types';
import { EXPLORER_RANKS } from './types';

// Components
import { GlobeBackground } from './components/GlobeBackground';
import { ModeSelector } from './components/ModeSelector';
import { ContinentSelector } from './components/ContinentSelector';
import { LevelSelector } from './components/LevelSelector';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ResultsScreen } from './components/ResultsScreen';
import { QuestionCard } from './components/QuestionCard';

export function GeographyExplorer() {
  const {
    gameState,
    selectedMode,
    selectedContinent,
    currentLevel,
    questions,
    currentQuestionIndex,
    questionResults,
    combo,
    timeRemaining,
    lastResults,
    hintUsedThisQuestion,
    setGameState,
    selectMode,
    selectContinent,
    selectLevel,
    startRound,
    submitAnswer,
    useHint,
    skipQuestion,
    pauseGame,
    resumeGame,
    resetGame,
    tickTimer,
  } = useGeoGameStore();

  const { updateLevelProgress, explorerStats } = useGeoProgressStore();

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

  // Handlers
  const handleSelectMode = useCallback((mode: GameMode) => {
    selectMode(mode);
  }, [selectMode]);

  const handleSelectContinent = useCallback((continent: Continent) => {
    selectContinent(continent);
  }, [selectContinent]);

  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  const handleCountdownComplete = useCallback(() => {
    startRound();
  }, [startRound]);

  const handleAnswer = useCallback((answerId: string) => {
    submitAnswer(answerId);
  }, [submitAnswer]);

  const handleRetry = useCallback(() => {
    if (currentLevel) {
      selectLevel(currentLevel);
    }
  }, [currentLevel, selectLevel]);

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

  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate current score
  const currentScore = questionResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu
            onStart={() => setGameState('mode-select')}
            onBack={() => window.history.back()}
            explorerStats={explorerStats}
          />
        );

      case 'mode-select':
        return (
          <ModeSelector
            onSelectMode={handleSelectMode}
            onBack={() => setGameState('menu')}
          />
        );

      case 'region-select':
        return selectedMode ? (
          <ContinentSelector
            onSelectContinent={handleSelectContinent}
            onBack={() => setGameState('mode-select')}
          />
        ) : null;

      case 'level-select':
        return selectedMode && selectedContinent ? (
          <LevelSelector
            mode={selectedMode}
            continent={selectedContinent}
            onSelectLevel={handleSelectLevel}
            onBack={() => setGameState('region-select')}
          />
        ) : null;

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'playing':
        return currentLevel && currentQuestion ? (
          <GameplayScreen
            level={currentLevel}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            combo={combo}
            currentScore={currentScore}
            timeRemaining={timeRemaining}
            hintUsed={hintUsedThisQuestion}
            onAnswer={handleAnswer}
            onSkip={skipQuestion}
            onUseHint={useHint}
            onPause={pauseGame}
          />
        ) : null;

      case 'paused':
        return (
          <>
            {currentLevel && currentQuestion && (
              <GameplayScreen
                level={currentLevel}
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                combo={combo}
                currentScore={currentScore}
                timeRemaining={timeRemaining}
                hintUsed={hintUsedThisQuestion}
                onAnswer={handleAnswer}
                onSkip={skipQuestion}
                onUseHint={useHint}
                onPause={pauseGame}
              />
            )}
            <PauseOverlay
              onResume={resumeGame}
              onRestart={handleRetry}
              onQuit={handleQuit}
              levelName={currentLevel?.name}
              currentScore={currentScore}
              questionsAnswered={currentQuestionIndex}
              totalQuestions={questions.length}
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
  explorerStats: {
    countriesLearned: string[];
    landmarksDiscovered: string[];
    continentsExplored: import('./types').Continent[];
    totalQuestionsAnswered: number;
    totalCorrect: number;
    totalPlayTime: number;
    longestStreak: number;
    perfectRounds: number;
    favoriteMode: import('./types').GameMode | null;
    favoriteContinent: import('./types').Continent | null;
    explorerRank: import('./types').ExplorerRank;
  };
}

function MainMenu({ onStart, onBack, explorerStats }: MainMenuProps) {
  const { getTotalStars } = useGeoProgressStore();
  const totalStars = getTotalStars();
  const rankInfo = EXPLORER_RANKS[explorerStats.explorerRank];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <GlobeBackground intensity="medium" />

      {/* Content */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 relative z-10"
      >
        {/* Animated globe icon */}
        <motion.div
          animate={{
            rotateY: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-8xl sm:text-9xl mb-6 inline-block"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(0,245,255,0.4))',
          }}
        >
          🌍
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
          Geography <span className="text-neon-cyan" style={{ textShadow: '0 0 30px rgba(0,245,255,0.5)' }}>Explorer</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md">
          Discover countries, capitals, flags, and landmarks from around the world!
        </p>
      </motion.div>

      {/* Explorer rank badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 px-6 py-3 bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 border border-white/10 rounded-2xl flex items-center gap-4 relative z-10"
      >
        <span className="text-4xl">{rankInfo.icon}</span>
        <div className="text-left">
          <p className="text-text-muted text-xs uppercase tracking-wider">Explorer Rank</p>
          <p className="font-display font-bold text-white">{rankInfo.label}</p>
        </div>
        <div className="border-l border-white/10 pl-4 ml-2">
          <p className="text-text-muted text-xs uppercase tracking-wider">Countries</p>
          <p className="font-display font-bold text-neon-green">{explorerStats.countriesLearned.length}</p>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-xs relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 px-8 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_50px_rgba(0,245,255,0.6)] transition-all"
        >
          Start Exploring
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
        className="mt-10 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-2xl font-display font-bold text-neon-yellow">{totalStars}</div>
          <div className="text-xs text-text-muted uppercase">Stars</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-cyan">24</div>
          <div className="text-xs text-text-muted uppercase">Levels</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-neon-pink">4</div>
          <div className="text-xs text-text-muted uppercase">Game Modes</div>
        </div>
      </motion.div>

      {/* How to play */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-white/10 max-w-md relative z-10"
      >
        <h3 className="font-display font-bold text-white text-sm mb-2">Game Modes</h3>
        <ul className="text-text-secondary text-sm space-y-1">
          <li>🏁 <strong>Flag Quiz</strong> - Identify countries by their flags</li>
          <li>🏛️ <strong>Capital Match</strong> - Match capitals to countries</li>
          <li>🗼 <strong>Landmark Hunter</strong> - Discover famous landmarks</li>
          <li>🌍 <strong>Continent Challenge</strong> - Mixed geography questions</li>
        </ul>
      </motion.div>
    </div>
  );
}

// Gameplay Screen Component
interface GameplayScreenProps {
  level: Level;
  question: import('./types').Question;
  questionNumber: number;
  totalQuestions: number;
  combo: import('./types').ComboState;
  currentScore: number;
  timeRemaining: number | null;
  hintUsed: boolean;
  onAnswer: (answerId: string) => void;
  onSkip: () => void;
  onUseHint: () => void;
  onPause: () => void;
}

function GameplayScreen({
  level,
  question,
  questionNumber,
  totalQuestions,
  combo,
  currentScore,
  timeRemaining,
  hintUsed,
  onAnswer,
  onSkip,
  onUseHint,
  onPause,
}: GameplayScreenProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative">
      <GlobeBackground intensity="low" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary/80 backdrop-blur-sm border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-sm sm:text-base">{level.name}</h2>
            <p className="text-xs text-text-muted capitalize">{level.mode.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Main gameplay area */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <QuestionCard
          question={question}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          combo={combo}
          currentScore={currentScore}
          timeRemaining={timeRemaining}
          maxTime={level.timeLimit}
          hintUsed={hintUsed}
          onAnswer={onAnswer}
          onSkip={onSkip}
          onUseHint={onUseHint}
          disabled={false}
        />
      </div>

      {/* Bottom hint */}
      <div className="text-center text-text-muted text-sm mt-4 relative z-10">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-cyan font-mono">Esc</kbd> to pause
      </div>
    </div>
  );
}

export default GeographyExplorer;
