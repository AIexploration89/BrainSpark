import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { SCORING, CATEGORIES } from '../types';
import { getNextLevelInCategory, getPerformanceMessage, CATEGORY_COLORS } from '../data/levels';
import { useWordBuilderProgressStore } from '../stores/wordBuilderStore';

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
  const { isLevelUnlocked } = useWordBuilderProgressStore();

  // Calculate stars
  const starsEarned = results.accuracy >= SCORING.STAR_THRESHOLDS.three
    ? 3
    : results.accuracy >= SCORING.STAR_THRESHOLDS.two
    ? 2
    : results.accuracy >= SCORING.STAR_THRESHOLDS.one
    ? 1
    : 0;

  // Check next level
  const nextLevel = getNextLevelInCategory(level.id);
  const canProceed = nextLevel && isLevelUnlocked(nextLevel.id);

  // Performance message
  const message = getPerformanceMessage(results.accuracy);
  const isPerfect = results.accuracy === 100;
  const colors = CATEGORY_COLORS[level.category];
  const categoryConfig = CATEGORIES.find(c => c.id === level.category);

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
        {/* Celebration particles */}
        {isPerfect && Array.from({ length: 30 }).map((_, i) => (
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
            className="absolute text-2xl"
          >
            {['✨', '🌟', '⭐', '💫'][i % 4]}
          </motion.div>
        ))}

        {/* Floating letters */}
        {'AMAZING'.split('').map((letter, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: `${10 + i * 12}vw` }}
            animate={{ y: '-10vh' }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.5,
            }}
            className={`absolute text-4xl font-display font-bold text-${colors.primary}/20`}
          >
            {letter}
          </motion.div>
        ))}

        {/* Glow background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className={`absolute inset-0 ${
            isPerfect
              ? `bg-gradient-to-br from-${colors.primary}/20 via-transparent to-neon-cyan/20`
              : `bg-gradient-to-br from-${colors.primary}/10 via-transparent to-transparent`
          }`}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg"
      >
        {/* Main card */}
        <div className={`bg-bg-secondary/90 backdrop-blur-lg rounded-3xl border-2 border-${colors.primary}/30 p-6 sm:p-8 overflow-hidden`}>
          {/* Perfect round celebration */}
          {isPerfect && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-${colors.primary}/20 via-neon-yellow/20 to-${colors.primary}/20 text-center`}
            >
              <span className="text-neon-yellow font-display font-bold">
                {categoryConfig?.icon} PERFECT ROUND! {categoryConfig?.icon}
              </span>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-center ${isPerfect ? 'mt-6' : ''}`}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {message}
            </h2>
            <p className="text-text-secondary">
              {level.name} Complete
            </p>
          </motion.div>

          {/* Stars display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex justify-center gap-3 my-6"
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
                    filter: star <= starsEarned ? 'drop-shadow(0 0 15px gold)' : 'none',
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
              className={`text-5xl font-display font-bold text-${colors.primary}`}
              style={{ textShadow: `0 0 30px ${colors.glow}` }}
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
              label="Words"
              value={`${results.correctWords}/${results.totalWords}`}
              color="neon-green"
            />
            <StatBox
              label="Time"
              value={formatTime(results.totalTime)}
              color="neon-purple"
            />
          </motion.div>

          {/* Extra stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-6 mb-6 text-center"
          >
            <div>
              <p className="text-xs text-text-muted uppercase">Perfect Words</p>
              <p className="text-lg font-display font-bold text-neon-yellow">
                {results.perfectWords}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase">Hints Used</p>
              <p className="text-lg font-display font-bold text-neon-pink">
                {results.hintsUsed}
              </p>
            </div>
          </motion.div>

          {/* Bonus breakdown */}
          {(results.bonusPoints.perfect > 0 || results.bonusPoints.streak > 0 || results.bonusPoints.noHints > 0) && (
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
                {results.bonusPoints.noHints > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">No Hints Used</span>
                    <span className="text-neon-green">+{results.bonusPoints.noHints}</span>
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
                className={`w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-${colors.primary} to-${colors.secondary} text-bg-primary shadow-[0_0_30px_${colors.glow}] hover:shadow-[0_0_40px_${colors.glow}] transition-all`}
              >
                Next Level →
              </motion.button>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className={`flex-1 py-3 rounded-xl font-display font-semibold uppercase tracking-wider border-2 border-${colors.primary}/50 text-${colors.primary} hover:bg-${colors.primary}/10 transition-all`}
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
          Build streaks by solving words without mistakes!
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
