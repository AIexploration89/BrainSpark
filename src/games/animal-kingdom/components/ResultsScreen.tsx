import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { SCORING } from '../types';

interface ResultsScreenProps {
  results: GameResult;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  hasNextLevel: boolean;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
  hasNextLevel,
}: ResultsScreenProps) {
  // Calculate stars
  const stars = results.accuracy >= SCORING.STAR_THRESHOLDS.three ? 3
    : results.accuracy >= SCORING.STAR_THRESHOLDS.two ? 2
    : results.accuracy >= SCORING.STAR_THRESHOLDS.one ? 1
    : 0;

  const isPerfect = results.perfectRound;

  // Determine result message and emoji
  const getResultMessage = () => {
    if (isPerfect) return { message: 'PERFECT!', emoji: '🏆', color: 'neon-yellow' };
    if (results.accuracy >= 90) return { message: 'Excellent!', emoji: '🌟', color: 'neon-green' };
    if (results.accuracy >= 70) return { message: 'Great Job!', emoji: '🎉', color: 'neon-cyan' };
    if (results.accuracy >= 50) return { message: 'Good Try!', emoji: '👍', color: 'neon-orange' };
    return { message: 'Keep Practicing!', emoji: '💪', color: 'neon-pink' };
  };

  const resultInfo = getResultMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 bg-bg-primary"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-bg-secondary/90 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
        style={{
          boxShadow: `0 0 60px rgba(0,255,136,0.1), 0 0 120px rgba(0,255,136,0.05)`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl sm:text-8xl mb-4"
          >
            {resultInfo.emoji}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`font-display text-3xl sm:text-4xl font-black text-${resultInfo.color}`}
            style={{
              textShadow: isPerfect
                ? '0 0 20px rgba(255,229,92,0.5), 0 0 40px rgba(255,229,92,0.3)'
                : undefined,
            }}
          >
            {resultInfo.message}
          </motion.h2>

          <p className="text-text-secondary mt-2">{level.name}</p>
        </div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mb-6"
        >
          {[1, 2, 3].map((star) => (
            <motion.span
              key={star}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: star <= stars ? 1 : 0.5,
                rotate: 0,
              }}
              transition={{
                delay: 0.4 + star * 0.15,
                type: 'spring',
              }}
              className={`text-5xl ${star <= stars ? '' : 'opacity-30 grayscale'}`}
              style={{
                filter: star <= stars
                  ? 'drop-shadow(0 0 10px rgba(255,229,92,0.5))'
                  : undefined,
              }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-text-muted text-sm uppercase tracking-wider">Total Score</p>
          <p
            className="font-display text-5xl font-black text-neon-green"
            style={{
              textShadow: '0 0 20px rgba(0,255,136,0.5)',
            }}
          >
            {results.score.toLocaleString()}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-bg-tertiary/50 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-display font-bold text-neon-green">{results.correctAnswers}</p>
            <p className="text-text-muted text-xs">Correct</p>
          </div>
          <div className="bg-bg-tertiary/50 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="font-display font-bold text-neon-cyan">{results.accuracy.toFixed(0)}%</p>
            <p className="text-text-muted text-xs">Accuracy</p>
          </div>
          <div className="bg-bg-tertiary/50 rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">🔥</p>
            <p className="font-display font-bold text-neon-orange">{results.highestStreak}</p>
            <p className="text-text-muted text-xs">Best Streak</p>
          </div>
        </motion.div>

        {/* Bonus Points */}
        {(results.bonusPoints.streak > 0 || results.bonusPoints.speed > 0 ||
          results.bonusPoints.perfect > 0 || results.bonusPoints.noHints > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-bg-tertiary/30 rounded-xl p-4 mb-6"
          >
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2 text-center">
              Bonus Points
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {results.bonusPoints.streak > 0 && (
                <span className="px-3 py-1 bg-neon-orange/20 border border-neon-orange/30 rounded-full text-neon-orange text-sm">
                  🔥 Streak +{results.bonusPoints.streak}
                </span>
              )}
              {results.bonusPoints.speed > 0 && (
                <span className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm">
                  ⚡ Speed +{results.bonusPoints.speed}
                </span>
              )}
              {results.bonusPoints.perfect > 0 && (
                <span className="px-3 py-1 bg-neon-yellow/20 border border-neon-yellow/30 rounded-full text-neon-yellow text-sm">
                  🏆 Perfect +{results.bonusPoints.perfect}
                </span>
              )}
              {results.bonusPoints.noHints > 0 && (
                <span className="px-3 py-1 bg-neon-green/20 border border-neon-green/30 rounded-full text-neon-green text-sm">
                  🧠 No Hints +{results.bonusPoints.noHints}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Animals Learned */}
        {results.newAnimalsLearned.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-6"
          >
            <p className="text-neon-green text-sm">
              🐾 {results.newAnimalsLearned.length} new animal{results.newAnimalsLearned.length > 1 ? 's' : ''} learned!
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          {hasNextLevel && stars >= 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLevel}
              className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-neon-cyan text-bg-primary shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] transition-all"
            >
              Next Level →
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all"
          >
            🔄 Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToMenu}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-all"
          >
            ← Back to Menu
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
