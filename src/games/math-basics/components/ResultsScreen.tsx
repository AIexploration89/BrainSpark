import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { SCORING } from '../types';
import { getPerformanceMessage, getNextLevelInOperation } from '../data/levels';
import { useMathProgressStore } from '../stores/mathStore';

interface ResultsScreenProps {
  results: GameResult;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
}: ResultsScreenProps) {
  const { isLevelUnlocked } = useMathProgressStore();

  // Calculate stars earned
  const starsEarned = results.accuracy >= SCORING.STAR_THRESHOLDS.three
    ? 3
    : results.accuracy >= SCORING.STAR_THRESHOLDS.two
    ? 2
    : results.accuracy >= SCORING.STAR_THRESHOLDS.one
    ? 1
    : 0;

  // Check if next level exists and is unlocked
  const nextLevel = getNextLevelInOperation(level.id);
  const canProceed = nextLevel && isLevelUnlocked(nextLevel.id);

  // Performance message
  const message = getPerformanceMessage(results.accuracy);

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Success particles */}
        {results.perfectRound && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: '50vw',
              y: '50vh',
              scale: 0,
            }}
            animate={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#00ff88', '#00f5ff', '#ffff00', '#ff00ff'][i % 4],
              boxShadow: `0 0 10px currentColor`,
            }}
          />
        ))}

        {/* Glow background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className={`absolute inset-0 ${
            results.perfectRound
              ? 'bg-gradient-to-br from-neon-green/20 via-transparent to-neon-cyan/20'
              : 'bg-gradient-to-br from-neon-green/10 via-transparent to-transparent'
          }`}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg"
      >
        {/* Main card */}
        <div className="bg-bg-secondary/90 backdrop-blur-lg rounded-3xl border-2 border-neon-green/30 p-6 sm:p-8 overflow-hidden">
          {/* Perfect round celebration */}
          {results.perfectRound && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-green/20 text-center"
            >
              <span className="text-neon-yellow font-display font-bold">
                ✨ PERFECT ROUND! ✨
              </span>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-center ${results.perfectRound ? 'mt-6' : ''}`}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {message}
            </h2>
            <p className="text-text-secondary">
              Level {level.name} Complete
            </p>
          </motion.div>

          {/* Stars display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex justify-center gap-2 my-6"
          >
            {[1, 2, 3].map((star, i) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: star <= starsEarned ? 1 : 0.6,
                  rotate: 0,
                }}
                transition={{
                  delay: 0.5 + i * 0.2,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <span
                  className={`text-5xl ${
                    star <= starsEarned ? 'text-yellow-400' : 'text-white/20'
                  }`}
                  style={{
                    filter: star <= starsEarned ? 'drop-shadow(0 0 10px gold)' : 'none',
                  }}
                >
                  ★
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-6"
          >
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">
              Total Score
            </p>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="text-5xl font-display font-bold text-neon-green"
              style={{ textShadow: '0 0 30px rgba(0,255,136,0.5)' }}
            >
              {results.score.toLocaleString()}
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <StatBox
              label="Accuracy"
              value={`${Math.round(results.accuracy)}%`}
              color={results.accuracy >= 80 ? 'neon-green' : results.accuracy >= 60 ? 'neon-orange' : 'neon-red'}
            />
            <StatBox
              label="Best Streak"
              value={results.highestStreak.toString()}
              color="neon-cyan"
            />
            <StatBox
              label="Correct"
              value={`${results.correctAnswers}/${results.totalProblems}`}
              color="neon-green"
            />
            <StatBox
              label="Time"
              value={formatTime(results.totalTime)}
              color="neon-purple"
            />
          </motion.div>

          {/* Bonus breakdown */}
          {(results.bonusPoints.perfect > 0 || results.bonusPoints.streak > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-bg-tertiary/50 rounded-xl p-4 mb-6"
            >
              <h4 className="text-sm font-display text-text-muted uppercase tracking-wider mb-2">
                Bonus Points
              </h4>
              <div className="space-y-1 text-sm">
                {results.bonusPoints.streak > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Streak Bonus</span>
                    <span className="text-neon-cyan">+{results.bonusPoints.streak}</span>
                  </div>
                )}
                {results.bonusPoints.speed > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Speed Bonus</span>
                    <span className="text-neon-orange">+{results.bonusPoints.speed}</span>
                  </div>
                )}
                {results.bonusPoints.perfect > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Perfect Round</span>
                    <span className="text-neon-yellow">+{results.bonusPoints.perfect}</span>
                  </div>
                )}
                {results.bonusPoints.noMistakes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">No Mistakes</span>
                    <span className="text-neon-green">+{results.bonusPoints.noMistakes}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col gap-3"
          >
            {canProceed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNextLevel}
                className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-neon-cyan text-bg-primary shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all"
              >
                Next Level →
              </motion.button>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex-1 py-3 rounded-xl font-display font-semibold uppercase tracking-wider border-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToMenu}
                className="flex-1 py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
              >
                Menu
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Fun tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-text-muted text-sm mt-4"
        >
          💡 Tip: Build streaks for higher score multipliers!
        </motion.p>
      </motion.div>
    </div>
  );
}

// Stat box component
function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`
      p-3 rounded-xl bg-bg-tertiary/50 border border-${color}/20
      text-center
    `}>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className={`text-xl font-display font-bold text-${color}`}>
        {value}
      </p>
    </div>
  );
}
