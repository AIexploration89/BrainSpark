import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceGameStore, useSpaceProgressStore } from './stores/spaceStore';
import { getRandomQuestions } from './data/quizzes';
import { getMissionById } from './data/missions';
import type { Level, GameMode, PlanetId } from './types';

// Components
import { StarField } from './components/StarField';
import { SolarSystem } from './components/SolarSystem';
import { PlanetCard } from './components/PlanetCard';
import { SpaceQuiz } from './components/SpaceQuiz';
import { LevelSelector } from './components/LevelSelector';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ResultsScreen } from './components/ResultsScreen';

export function SpaceExploration() {
  const {
    gameState,
    gameMode,
    currentLevel,
    selectedPlanet,
    visitedPlanets,
    discoveredFacts,
    quizSession,
    lastResults,
    setGameState,
    setGameMode,
    selectLevel,
    selectPlanet,
    closePlanetView,
    discoverFact,
    startQuiz,
    answerQuestion,
    nextQuestion,
    pauseGame,
    resumeGame,
    resetGame,
    completeGame,
  } = useSpaceGameStore();

  const {
    updateProgress,
    markFactDiscovered,
    progress,
  } = useSpaceProgressStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (['exploring', 'planet-view', 'quiz', 'mission'].includes(gameState)) {
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
      updateProgress(lastResults, currentLevel.id);

      // Mark discovered facts in persistent storage
      discoveredFacts.forEach(factId => {
        markFactDiscovered(factId);
      });
    }
  }, [gameState, lastResults, currentLevel, updateProgress, discoveredFacts, markFactDiscovered]);

  // Handle mode selection
  const handleSelectMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
  }, [setGameMode]);

  // Handle level selection
  const handleSelectLevel = useCallback((level: Level) => {
    selectLevel(level);
  }, [selectLevel]);

  // Handle countdown complete
  const handleCountdownComplete = useCallback(() => {
    if (gameMode === 'quiz' && currentLevel) {
      const questions = getRandomQuestions(
        currentLevel.questionsCount || 5,
        currentLevel.difficulty
      );
      startQuiz(questions);
    } else if (gameMode === 'explore') {
      setGameState('exploring');
    } else if (gameMode === 'mission') {
      setGameState('mission');
    }
  }, [gameMode, currentLevel, startQuiz, setGameState]);

  // Handle planet selection
  const handleSelectPlanet = useCallback((planetId: PlanetId) => {
    selectPlanet(planetId);
  }, [selectPlanet]);

  // Handle fact discovery
  const handleDiscoverFact = useCallback((factId: string) => {
    discoverFact(factId);
  }, [discoverFact]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (currentLevel) {
      selectLevel(currentLevel);
    }
  }, [currentLevel, selectLevel]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    // For now, just go back to level select
    setGameState('level-select');
  }, [setGameState]);

  // Handle quit
  const handleQuit = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Handle explore complete
  const handleFinishExploring = useCallback(() => {
    completeGame();
  }, [completeGame]);

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu
            onSelectMode={handleSelectMode}
            onBack={() => window.history.back()}
            progress={progress}
          />
        );

      case 'mode-select':
        return (
          <ModeSelector
            onSelectMode={handleSelectMode}
            onBack={() => setGameState('menu')}
          />
        );

      case 'level-select':
        return gameMode ? (
          <LevelSelector
            mode={gameMode}
            onSelectLevel={handleSelectLevel}
            onSelectMission={(id) => {
              const mission = getMissionById(id);
              if (mission) {
                // For missions, we use a special level
                handleSelectLevel({
                  id: mission.id,
                  name: mission.name,
                  description: mission.description,
                  mode: 'mission',
                  difficulty: mission.difficulty,
                  planets: [mission.targetPlanet],
                  unlockRequirement: mission.unlockRequirement ?? 0,
                });
              }
            }}
            onBack={() => setGameState('menu')}
          />
        ) : null;

      case 'countdown':
        return <CountdownOverlay onComplete={handleCountdownComplete} />;

      case 'exploring':
        return (
          <ExplorationScreen
            visitedPlanets={visitedPlanets}
            onSelectPlanet={handleSelectPlanet}
            onPause={pauseGame}
            onFinish={handleFinishExploring}
            discoveredFacts={discoveredFacts}
          />
        );

      case 'planet-view':
        return selectedPlanet ? (
          <PlanetCard
            planet={selectedPlanet}
            discoveredFacts={discoveredFacts}
            onDiscoverFact={handleDiscoverFact}
            onClose={closePlanetView}
          />
        ) : null;

      case 'quiz':
        return quizSession ? (
          <SpaceQuiz
            session={quizSession}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onPause={pauseGame}
            timeLimit={currentLevel?.timeLimit ? currentLevel.timeLimit / quizSession.questions.length : undefined}
          />
        ) : null;

      case 'paused':
        return (
          <PauseOverlay
            onResume={resumeGame}
            onRestart={handleRetry}
            onQuit={handleQuit}
          />
        );

      case 'results':
        return lastResults ? (
          <ResultsScreen
            results={lastResults}
            level={currentLevel ?? undefined}
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
    <div className="min-h-screen bg-bg-primary relative">
      {/* Star field background - always visible */}
      <StarField />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 min-h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Planet view overlay (renders on top) */}
      <AnimatePresence>
        {gameState === 'planet-view' && selectedPlanet && (
          <PlanetCard
            planet={selectedPlanet}
            discoveredFacts={discoveredFacts}
            onDiscoverFact={handleDiscoverFact}
            onClose={closePlanetView}
          />
        )}
      </AnimatePresence>

      {/* Pause overlay (renders on top of everything) */}
      <AnimatePresence>
        {gameState === 'paused' && (
          <PauseOverlay
            onResume={resumeGame}
            onRestart={handleRetry}
            onQuit={handleQuit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Menu Component
interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
  progress: {
    totalStars: number;
    currentRank: string;
    planetsUnlocked: string[];
    allFactsDiscovered: string[];
  };
}

function MainMenu({ onSelectMode, onBack, progress }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-neon-purple/10"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-neon-cyan/10"
        />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        {/* Animated rocket */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl mb-6"
        >
          🚀
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-4">
          Space{' '}
          <span
            className="text-neon-cyan"
            style={{ textShadow: '0 0 30px rgba(0, 245, 255, 0.5)' }}
          >
            Explorer
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Journey through our solar system and discover the wonders of space!
        </p>
      </motion.div>

      {/* Game modes */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl relative z-10"
      >
        <ModeButton
          icon="🔭"
          title="Explore"
          description="Visit planets & discover facts"
          color="purple"
          onClick={() => onSelectMode('explore')}
        />
        <ModeButton
          icon="❓"
          title="Quiz"
          description="Test your space knowledge"
          color="cyan"
          onClick={() => onSelectMode('quiz')}
        />
        <ModeButton
          icon="🎯"
          title="Missions"
          description="Complete space objectives"
          color="pink"
          onClick={() => onSelectMode('mission')}
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex gap-8 text-center relative z-10"
      >
        <div>
          <div className="text-3xl font-display font-bold text-neon-cyan">
            {progress.totalStars}
          </div>
          <div className="text-xs text-text-muted uppercase">Stars</div>
        </div>
        <div>
          <div className="text-3xl font-display font-bold text-neon-purple capitalize">
            {progress.currentRank}
          </div>
          <div className="text-xs text-text-muted uppercase">Rank</div>
        </div>
        <div>
          <div className="text-3xl font-display font-bold text-neon-green">
            {progress.planetsUnlocked.length}
          </div>
          <div className="text-xs text-text-muted uppercase">Planets</div>
        </div>
        <div>
          <div className="text-3xl font-display font-bold text-neon-orange">
            {progress.allFactsDiscovered.length}
          </div>
          <div className="text-xs text-text-muted uppercase">Facts</div>
        </div>
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-8 py-3 px-8 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Games
      </motion.button>
    </div>
  );
}

interface ModeButtonProps {
  icon: string;
  title: string;
  description: string;
  color: 'cyan' | 'pink' | 'purple';
  onClick: () => void;
}

function ModeButton({ icon, title, description, color, onClick }: ModeButtonProps) {
  const colorStyles = {
    cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30 hover:border-neon-cyan shadow-neon-cyan/20',
    pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 hover:border-neon-pink shadow-neon-pink/20',
    purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 hover:border-neon-purple shadow-neon-purple/20',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-6 rounded-2xl border-2 text-center transition-all
        bg-gradient-to-br ${colorStyles[color]}
        hover:shadow-[0_0_30px_var(--tw-shadow-color)]
      `}
    >
      <span className="text-5xl block mb-3">{icon}</span>
      <h3 className="text-lg font-display font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </motion.button>
  );
}

// Mode Selector (alternative flow)
interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

function ModeSelector({ onSelectMode, onBack }: ModeSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-display font-bold text-white mb-8">
        Choose Your Mission Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        <ModeButton
          icon="🔭"
          title="Explore"
          description="Visit planets & discover facts"
          color="purple"
          onClick={() => onSelectMode('explore')}
        />
        <ModeButton
          icon="❓"
          title="Quiz"
          description="Test your space knowledge"
          color="cyan"
          onClick={() => onSelectMode('quiz')}
        />
        <ModeButton
          icon="🎯"
          title="Missions"
          description="Complete space objectives"
          color="pink"
          onClick={() => onSelectMode('mission')}
        />
      </div>
      <button
        onClick={onBack}
        className="mt-8 text-text-muted hover:text-white transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

// Exploration Screen
interface ExplorationScreenProps {
  visitedPlanets: PlanetId[];
  onSelectPlanet: (planetId: PlanetId) => void;
  onPause: () => void;
  onFinish: () => void;
  discoveredFacts: string[];
}

function ExplorationScreen({
  visitedPlanets,
  onSelectPlanet,
  onPause,
  onFinish,
  discoveredFacts,
}: ExplorationScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
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
            <h2 className="font-display font-bold text-white">Solar System Explorer</h2>
            <p className="text-xs text-text-muted">Click on planets to explore</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-text-muted">Facts Found</p>
            <p className="font-display font-bold text-neon-green">
              {discoveredFacts.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Planets Visited</p>
            <p className="font-display font-bold text-neon-cyan">
              {visitedPlanets.length}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFinish}
            className="px-4 py-2 rounded-lg bg-neon-green/20 border border-neon-green/30 text-neon-green font-display font-semibold hover:bg-neon-green/30 transition-colors"
          >
            Finish ✓
          </motion.button>
        </div>
      </div>

      {/* Solar System */}
      <div className="flex-1">
        <SolarSystem
          onSelectPlanet={onSelectPlanet}
          visitedPlanets={visitedPlanets}
        />
      </div>

      {/* Keyboard hint */}
      <div className="text-center text-text-muted text-sm p-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-cyan">Esc</kbd> to pause
      </div>
    </div>
  );
}

export default SpaceExploration;
