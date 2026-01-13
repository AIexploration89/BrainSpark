import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryGameStore, useHistoryProgressStore } from './stores/historyStore';
import { getNextLevel } from './data/levels';
import { HISTORIAN_RANKS } from './types';
import type { HistoricalEra, Level } from './types';
import { TimelineBackground } from './components/TimelineBackground';
import { EraSelector } from './components/EraSelector';
import { LevelSelector } from './components/LevelSelector';
import { QuestionCard } from './components/QuestionCard';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ResultsScreen } from './components/ResultsScreen';

export function HistoryHeroes() {
  const {
    gameState,
    selectedEra,
    currentLevel,
    questions,
    currentQuestionIndex,
    timeRemaining,
    combo,
    hintUsedThisQuestion,
    showExplanation,
    lastAnswerCorrect,
    lastResults,
    questionResults,
    setGameState,
    selectEra,
    selectLevel,
    startRound,
    submitAnswer,
    continueAfterAnswer,
    skipQuestion,
    useHint,
    tickTimer,
    pauseGame,
    resumeGame,
    resetGame,
  } = useHistoryGameStore();

  const { historianStats, updateLevelProgress } = useHistoryProgressStore();

  // Calculate current score
  const currentScore = questionResults.reduce((sum, r) => sum + r.pointsEarned, 0);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || showExplanation) return;
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeRemaining, showExplanation, tickTimer]);

  // Keyboard shortcuts
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

  // Save results when game ends
  useEffect(() => {
    if (gameState === 'results' && lastResults && currentLevel) {
      updateLevelProgress(currentLevel.id, lastResults);
    }
  }, [gameState, lastResults, currentLevel, updateLevelProgress]);

  // Handle era selection
  const handleSelectEra = useCallback((eraId: string) => {
    selectEra(eraId as HistoricalEra);
  }, [selectEra]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    startRound();
  }, [startRound]);

  // Handle answer
  const handleAnswer = useCallback((answerId: string) => {
    submitAnswer(answerId);
  }, [submitAnswer]);

  // Handle continue to next question
  const handleContinue = useCallback(() => {
    continueAfterAnswer();
  }, [continueAfterAnswer]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (!currentLevel) return;
    selectLevel(currentLevel);
  }, [currentLevel, selectLevel]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (!currentLevel) return;
    const nextLevelData = getNextLevel(currentLevel.id);
    if (nextLevelData) {
      selectLevel(nextLevelData);
    } else {
      setGameState('menu');
    }
  }, [currentLevel, selectLevel, setGameState]);

  // Handle back navigation
  const handleBackToMenu = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleBackToEras = useCallback(() => {
    setGameState('era-select');
  }, [setGameState]);

  const handleBackToLevels = useCallback(() => {
    setGameState('level-select');
  }, [setGameState]);

  // Get current rank info
  const rankInfo = HISTORIAN_RANKS[historianStats.historianRank];

  return (
    <div className="min-h-screen bg-bg-primary text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Menu */}
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 relative"
          >
            <TimelineBackground intensity="medium" />

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8 relative z-10"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl sm:text-9xl mb-4"
              >
                🏛️
              </motion.div>
              <h1
                className="text-5xl sm:text-6xl font-display font-black mb-3"
                style={{
                  background: 'linear-gradient(135deg, #FFE55C, #FF6B35, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                History Heroes
              </h1>
              <p className="text-text-secondary text-lg max-w-md mx-auto">
                Travel through time and discover the heroes who shaped our world!
              </p>
            </motion.div>

            {/* Historian rank display */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 text-center relative z-10 max-w-sm w-full"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-5xl">{rankInfo.icon}</span>
                <div className="text-left">
                  <p className="text-text-muted text-xs uppercase tracking-wider">Your Rank</p>
                  <p className="font-display font-bold text-xl text-white">{rankInfo.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-text-muted text-xs">Eras Explored</p>
                  <p className="font-display font-bold text-neon-yellow">
                    {historianStats.erasExplored.length}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Questions</p>
                  <p className="font-display font-bold text-neon-orange">
                    {historianStats.totalQuestionsAnswered}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Topics</p>
                  <p className="font-display font-bold text-neon-purple">
                    {historianStats.topicsLearned.length}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Start button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('era-select')}
              className="relative z-10 px-10 py-4 rounded-xl font-display font-bold text-xl uppercase tracking-wider bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-purple text-white shadow-[0_0_40px_rgba(255,229,92,0.5)] hover:shadow-[0_0_60px_rgba(255,229,92,0.7)] transition-all"
            >
              ⚔️ Begin Your Journey
            </motion.button>

            {/* Fun fact */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-text-muted text-sm max-w-md text-center relative z-10"
            >
              💡 Did you know? The Great Wall of China is over 13,000 miles long —
              that&apos;s longer than the distance from New York to Sydney!
            </motion.p>
          </motion.div>
        )}

        {/* Era Selection */}
        {gameState === 'era-select' && (
          <motion.div
            key="era-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EraSelector
              onSelectEra={handleSelectEra}
              onBack={handleBackToMenu}
            />
          </motion.div>
        )}

        {/* Level Selection */}
        {gameState === 'level-select' && selectedEra && (
          <motion.div
            key="level-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LevelSelector
              era={selectedEra}
              onSelectLevel={handleSelectLevel}
              onBack={handleBackToEras}
            />
          </motion.div>
        )}

        {/* Countdown */}
        {gameState === 'countdown' && (
          <CountdownOverlay onComplete={handleCountdownComplete} />
        )}

        {/* Playing */}
        {gameState === 'playing' && currentLevel && questions[currentQuestionIndex] && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col p-4 sm:p-6 relative"
          >
            <TimelineBackground intensity="low" era={selectedEra || undefined} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={pauseGame}
                  className="w-10 h-10 rounded-xl bg-bg-secondary/80 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                >
                  ⏸️
                </motion.button>
                <div>
                  <p className="font-display font-bold text-white">{currentLevel.name}</p>
                  <p className="text-text-muted text-xs capitalize">{currentLevel.era.replace('-', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <QuestionCard
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                combo={combo}
                currentScore={currentScore}
                timeRemaining={timeRemaining}
                maxTime={currentLevel.timeLimit}
                hintUsed={hintUsedThisQuestion}
                showExplanation={showExplanation}
                lastAnswerCorrect={lastAnswerCorrect}
                onAnswer={handleAnswer}
                onContinue={handleContinue}
                onSkip={skipQuestion}
                onUseHint={useHint}
                disabled={showExplanation}
              />
            </div>
          </motion.div>
        )}

        {/* Paused */}
        {gameState === 'paused' && currentLevel && (
          <PauseOverlay
            onResume={resumeGame}
            onRestart={handleRetry}
            onQuit={handleBackToLevels}
            levelName={currentLevel.name}
            currentScore={currentScore}
            questionsAnswered={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        )}

        {/* Results */}
        {gameState === 'results' && lastResults && currentLevel && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              results={lastResults}
              level={currentLevel}
              onRetry={handleRetry}
              onNextLevel={handleNextLevel}
              onBackToMenu={handleBackToLevels}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
