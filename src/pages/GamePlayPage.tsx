import { motion } from 'framer-motion';
import React, { lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const MemoryMatrix = lazy(() => import('../games/memory-matrix').then(m => ({ default: m.MemoryMatrix })));
const CodeQuest = lazy(() => import('../games/code-quest').then(m => ({ default: m.CodeQuest })));
const PhysicsLab = lazy(() => import('../games/physics-lab').then(m => ({ default: m.PhysicsLab })));
const MathBasics = lazy(() => import('../games/math-basics').then(m => ({ default: m.MathBasics })));
const TypingMaster = lazy(() => import('../games/typing-master').then(m => ({ default: m.TypingMaster })));
const WordBuilder = lazy(() => import('../games/word-builder').then(m => ({ default: m.WordBuilder })));
const SpaceExploration = lazy(() => import('../games/space-exploration').then(m => ({ default: m.SpaceExploration })));
const GeographyExplorer = lazy(() => import('../games/geography-explorer').then(m => ({ default: m.GeographyExplorer })));
const ScienceExplorer = lazy(() => import('../games/science-explorer').then(m => ({ default: m.ScienceExplorer })));
const HistoryHeroes = lazy(() => import('../games/history-heroes').then(m => ({ default: m.HistoryHeroes })));
const AnimalKingdom = lazy(() => import('../games/animal-kingdom').then(m => ({ default: m.AnimalKingdom })));
const PuzzleWorld = lazy(() => import('../games/puzzle-world').then(m => ({ default: m.PuzzleWorld })));

// Component reference lookup - avoids instantiating all 12 lazy components as JSX on every render
const GameComponentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'memory-matrix': MemoryMatrix,
  'code-quest': CodeQuest,
  'physics-lab': PhysicsLab,
  'math-basics': MathBasics,
  'typing-master': TypingMaster,
  'word-builder': WordBuilder,
  'space-exploration': SpaceExploration,
  'geography-explorer': GeographyExplorer,
  'science-explorer': ScienceExplorer,
  'history-heroes': HistoryHeroes,
  'animal-kingdom': AnimalKingdom,
  'puzzle-world': PuzzleWorld,
};

// Error boundary for lazy-loaded game components (BUG-022)
interface GameErrorBoundaryProps {
  gameId: string;
  onReset: () => void;
  children: React.ReactNode;
}

interface GameErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GameErrorBoundary extends React.Component<GameErrorBoundaryProps, GameErrorBoundaryState> {
  constructor(props: GameErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): GameErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-2xl font-display font-bold text-white mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-text-secondary mb-6">
              The game ran into an unexpected error. You can try again or go back to the games list.
            </p>
            {this.state.error && (
              <p className="text-xs text-text-muted mb-6 font-mono bg-bg-secondary p-3 rounded-lg break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan rounded-xl font-display font-semibold hover:bg-neon-cyan/30 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.props.onReset}
                className="px-6 py-3 bg-bg-secondary border border-white/10 text-text-secondary rounded-xl font-display font-semibold hover:text-white transition-colors"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function GameLoadingFallback() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center" role="status" aria-label="Loading game">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="spinner mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-secondary font-display"
        >
          Loading game...
        </motion.p>
      </div>
    </div>
  );
}

// Game info mapping
const gameInfo: Record<string, { name: string; icon: string; color: string; description: string }> = {
  'typing-master': {
    name: 'Typing Master',
    icon: '⌨️',
    color: 'cyan',
    description: 'Master the keyboard from home row to full sentences',
  },
  'mouse-expert': {
    name: 'Mouse Expert',
    icon: '🖱️',
    color: 'pink',
    description: 'Perfect your mouse control and precision',
  },
  'physics-lab': {
    name: 'Physics Lab',
    icon: '🔬',
    color: 'purple',
    description: 'Explore gravity, momentum, and energy',
  },
  'math-basics': {
    name: 'Math Basics',
    icon: '➕',
    color: 'green',
    description: 'Build strong math foundations',
  },
  'word-builder': {
    name: 'Word Builder',
    icon: '📝',
    color: 'orange',
    description: 'Build vocabulary and spelling skills',
  },
  'code-quest': {
    name: 'Code Quest',
    icon: '💻',
    color: 'cyan',
    description: 'Learn programming logic with visual blocks',
  },
  'memory-matrix': {
    name: 'Memory Matrix',
    icon: '🧠',
    color: 'pink',
    description: 'Challenge your memory and pattern recognition',
  },
  'rhythm-reflex': {
    name: 'Rhythm & Reflex',
    icon: '🎵',
    color: 'yellow',
    description: 'Train timing and coordination',
  },
  'space-exploration': {
    name: 'Space Explorer',
    icon: '🚀',
    color: 'purple',
    description: 'Journey through our solar system and learn about space',
  },
  'geography-explorer': {
    name: 'Geography Explorer',
    icon: '🌍',
    color: 'cyan',
    description: 'Discover countries, capitals, flags, and landmarks',
  },
  'science-explorer': {
    name: 'Science Explorer',
    icon: '🔬',
    color: 'green',
    description: 'Discover the wonders of Biology, Chemistry, Physics, and Earth Science',
  },
  'history-heroes': {
    name: 'History Heroes',
    icon: '🏛️',
    color: 'yellow',
    description: 'Travel through time and discover the heroes who shaped our world',
  },
  'animal-kingdom': {
    name: 'Animal Kingdom',
    icon: '🦁',
    color: 'green',
    description: 'Discover amazing animals, their habitats, and fascinating facts',
  },
  'puzzle-world': {
    name: 'Puzzle World',
    icon: '🧩',
    color: 'cyan',
    description: 'Challenge your brain with sliding puzzles, pattern matching, sequences, and jigsaws',
  },
};

const bgGlowClasses: Record<string, string> = {
  cyan: 'bg-neon-cyan/10',
  pink: 'bg-neon-pink/10',
  purple: 'bg-neon-purple/10',
  green: 'bg-neon-green/10',
  orange: 'bg-neon-orange/10',
  yellow: 'bg-neon-yellow/10',
};

const colorClasses: Record<string, string> = {
  cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30 text-neon-cyan',
  pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 text-neon-pink',
  purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 text-neon-purple',
  green: 'from-neon-green/20 to-neon-green/5 border-neon-green/30 text-neon-green',
  orange: 'from-neon-orange/20 to-neon-orange/5 border-neon-orange/30 text-neon-orange',
  yellow: 'from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/30 text-neon-yellow',
};

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const game = gameId && Object.prototype.hasOwnProperty.call(gameInfo, gameId) ? gameInfo[gameId] : null;

  if (!game) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-white mb-4">Game not found</h1>
          <Button onClick={() => navigate('/games')}>Back to Games</Button>
        </div>
      </div>
    );
  }

  // Route to actual game components - use component references, not JSX instances
  const GameComponent = gameId ? GameComponentMap[gameId] : undefined;

  if (GameComponent) {
    return (
      <GameErrorBoundary gameId={gameId!} onReset={() => navigate('/games')}>
        <Suspense fallback={<GameLoadingFallback />}>
          <GameComponent />
        </Suspense>
      </GameErrorBoundary>
    );
  }

  const colorClass = colorClasses[game.color];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${bgGlowClasses[game.color] || 'bg-neon-cyan/10'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${bgGlowClasses[game.color] || 'bg-neon-cyan/10'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-2xl w-full"
      >
        {/* Game card */}
        <div className={`bg-gradient-to-br ${colorClass} border rounded-3xl p-8 md:p-12 text-center`}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl md:text-9xl mb-6"
          >
            {game.icon}
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            {game.name}
          </h1>
          <p className="text-text-secondary mb-8">
            {game.description}
          </p>

          {/* Coming soon badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block mb-8"
          >
            <span className="px-6 py-3 bg-bg-primary/50 backdrop-blur-sm border border-white/20 rounded-full text-lg font-display">
              🚧 Game Coming Soon 🚧
            </span>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-bg-primary/30 backdrop-blur-sm rounded-2xl p-6 mb-8"
          >
            <p className="text-text-secondary mb-4">
              This game is currently under development. Check back soon to play!
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-text-muted">Progress</p>
                <p className="font-display font-bold text-white">0%</p>
              </div>
              <div>
                <p className="text-text-muted">Best Score</p>
                <p className="font-display font-bold text-white">--</p>
              </div>
              <div>
                <p className="text-text-muted">Time Played</p>
                <p className="font-display font-bold text-white">0h 0m</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="ghost" onClick={() => navigate(-1)}>
              ← Go Back
            </Button>
            <Button variant="primary" onClick={() => navigate('/games')}>
              Browse Other Games
            </Button>
          </motion.div>
        </div>

        {/* Fun facts while you wait */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-text-muted text-sm">
            💡 Fun fact: Learning through play improves memory retention by up to 90%!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
