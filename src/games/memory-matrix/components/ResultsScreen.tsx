import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';

interface ResultsScreenProps {
  results: GameResult;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  isFailure?: boolean;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
  isFailure,
}: ResultsScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter
  useEffect(() => {
    if (isFailure) return;

    const duration = 1500;
    const steps = 60;
    const increment = results.score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), results.score);
      setAnimatedScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedScore(results.score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [results.score, isFailure]);

  // Trigger confetti for success
  useEffect(() => {
    if (!isFailure && results.accuracy >= 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFailure, results.accuracy]);

  const getMessage = () => {
    if (isFailure) {
      return { emoji: '😅', text: 'Keep Trying!', subtext: 'Practice makes perfect!' };
    }
    if (results.isPerfect) {
      return { emoji: '🏆', text: 'PERFECT!', subtext: 'You have an incredible memory!' };
    }
    if (results.accuracy >= 90) {
      return { emoji: '🌟', text: 'Amazing!', subtext: 'Your memory is superb!' };
    }
    if (results.accuracy >= 70) {
      return { emoji: '⭐', text: 'Great Job!', subtext: 'You\'re getting better!' };
    }
    return { emoji: '💪', text: 'Nice Try!', subtext: 'Keep practicing!' };
  };

  const message = getMessage();
  const canProgress = !isFailure && results.accuracy >= 70;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isFailure ? 'bg-neon-red/20' : 'bg-neon-pink/20'
          }`}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            isFailure ? 'bg-neon-orange/20' : 'bg-neon-cyan/20'
          }`}
        />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Emoji and message */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
          className="text-8xl sm:text-9xl mb-4"
        >
          {message.emoji}
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-4xl sm:text-5xl font-display font-bold mb-2 ${
            isFailure ? 'text-neon-orange' : 'text-neon-pink'
          }`}
          style={{
            textShadow: isFailure
              ? '0 0 30px rgba(255,136,0,0.5)'
              : '0 0 30px rgba(255,0,255,0.5)',
          }}
        >
          {message.text}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-lg mb-8"
        >
          {message.subtext}
        </motion.p>

        {/* Score card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`
            p-6 rounded-3xl mb-8
            bg-gradient-to-br from-bg-secondary to-bg-tertiary
            border ${isFailure ? 'border-neon-orange/30' : 'border-neon-pink/30'}
          `}
        >
          {/* Score */}
          <div className="mb-6">
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Score</p>
            <motion.p
              className={`text-5xl sm:text-6xl font-display font-bold ${
                isFailure ? 'text-neon-orange' : 'text-neon-pink'
              }`}
            >
              {isFailure ? results.score : animatedScore.toLocaleString()}
            </motion.p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <StatItem
              label="Accuracy"
              value={`${Math.round(results.accuracy)}%`}
              color={results.accuracy >= 70 ? 'text-neon-green' : 'text-neon-red'}
              delay={0.7}
            />
            <StatItem
              label="Correct"
              value={`${results.correctCells}/${results.totalCells}`}
              color="text-neon-cyan"
              delay={0.8}
            />
            <StatItem
              label="Time"
              value={formatTime(results.completionTime)}
              color="text-neon-purple"
              delay={0.9}
            />
          </div>

          {/* Bonus breakdown for success */}
          {!isFailure && (results.timeBonus > 0 || results.streakBonus > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 pt-4 border-t border-white/10 text-sm"
            >
              <div className="flex justify-between text-text-muted">
                <span>Base Score</span>
                <span>{(results.score - results.timeBonus - results.streakBonus - (results.isPerfect ? 500 : 0)).toLocaleString()}</span>
              </div>
              {results.timeBonus > 0 && (
                <div className="flex justify-between text-neon-cyan">
                  <span>⚡ Speed Bonus</span>
                  <span>+{results.timeBonus.toLocaleString()}</span>
                </div>
              )}
              {results.streakBonus > 0 && (
                <div className="flex justify-between text-neon-orange">
                  <span>🔥 Streak Bonus</span>
                  <span>+{results.streakBonus.toLocaleString()}</span>
                </div>
              )}
              {results.isPerfect && (
                <div className="flex justify-between text-neon-yellow">
                  <span>✨ Perfect Bonus</span>
                  <span>+500</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Level info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-text-muted text-sm mb-6"
        >
          Level {level.id}: {level.name} • {level.gridSize}×{level.gridSize} grid • {level.patternLength} cells
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className={`
              py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider
              ${isFailure
                ? 'bg-gradient-to-r from-neon-orange to-amber-500 text-white shadow-[0_0_20px_rgba(255,136,0,0.4)]'
                : 'bg-bg-tertiary text-text-secondary hover:text-white border border-white/10 hover:border-neon-pink/50'
              }
              transition-all
            `}
          >
            {isFailure ? '🔄 Try Again' : '↻ Retry'}
          </motion.button>

          {canProgress && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLevel}
              className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-pink to-fuchsia-500 text-white shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all"
            >
              Next Level →
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToMenu}
            className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
          >
            ← Menu
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Stat item component
interface StatItemProps {
  label: string;
  value: string;
  color: string;
  delay: number;
}

function StatItem({ label, value, color, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-display font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}

// Format time helper
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${seconds}.${tenths}s`;
}

// Confetti component
function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#ff00ff', '#00f5ff', '#00ff88', '#ff8800', '#8b5cf6', '#ffff00'][
        Math.floor(Math.random() * 6)
      ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: -20,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
