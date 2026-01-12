import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MemoryMatrix } from '../games/memory-matrix';
import { CodeQuest } from '../games/code-quest';
import { PhysicsLab } from '../games/physics-lab';
import { MathBasics } from '../games/math-basics';

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

  const game = gameId ? gameInfo[gameId] : null;

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

  // Route to actual game components
  if (gameId === 'memory-matrix') {
    return <MemoryMatrix />;
  }

  if (gameId === 'code-quest') {
    return <CodeQuest />;
  }

  if (gameId === 'physics-lab') {
    return <PhysicsLab />;
  }

  if (gameId === 'math-basics') {
    return <MathBasics />;
  }

  const colorClass = colorClasses[game.color];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-neon-${game.color}/10 rounded-full blur-3xl`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-${game.color}/10 rounded-full blur-3xl`} />
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
