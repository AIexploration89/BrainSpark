import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { EXPLORER_RANKS, SCORING } from '../types';
import { useGeoProgressStore } from '../stores/geoStore';

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
  const { explorerStats } = useGeoProgressStore();

  // Calculate stars
  const stars = results.accuracy >= SCORING.STAR_THRESHOLDS.three ? 3
    : results.accuracy >= SCORING.STAR_THRESHOLDS.two ? 2
    : results.accuracy >= SCORING.STAR_THRESHOLDS.one ? 1 : 0;

  const isPerfect = results.accuracy === 100;
  const canProceed = results.accuracy >= 70;

  // Get rank info
  const rankInfo = EXPLORER_RANKS[explorerStats.explorerRank];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4 sm:p-6"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl"
        />

        {/* Celebration particles for perfect */}
        {isPerfect && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
                animate={{
                  y: '-20vh',
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute text-2xl"
              >
                {['⭐', '🌟', '✨', '🎉', '🏆'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={isPerfect ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.5, repeat: isPerfect ? Infinity : 0, repeatDelay: 2 }}
            className="text-7xl sm:text-8xl mb-4"
          >
            {isPerfect ? '🏆' : canProceed ? '🌍' : '🗺️'}
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
            {isPerfect ? 'Perfect Exploration!' : canProceed ? 'Great Journey!' : 'Keep Exploring!'}
          </h1>
          <p className="text-text-secondary">{level.name} Complete</p>
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center gap-3 mb-8"
        >
          {[1, 2, 3].map((starNum) => (
            <motion.div
              key={starNum}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + starNum * 0.2, type: 'spring' }}
            >
              <span
                className={`text-5xl sm:text-6xl ${starNum <= stars ? '' : 'opacity-30 grayscale'}`}
                style={starNum <= stars ? {
                  filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))',
                } : {}}
              >
                ⭐
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          {/* Score */}
          <div className="text-center mb-6">
            <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Total Score</p>
            <p
              className="font-display font-black text-5xl"
              style={{
                background: 'linear-gradient(135deg, #00F5FF, #FF00FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {results.score.toLocaleString()}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-text-muted text-xs uppercase">Accuracy</p>
              <p className="font-display font-bold text-xl text-neon-green">
                {Math.round(results.accuracy)}%
              </p>
            </div>
            <div className="text-center p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-text-muted text-xs uppercase">Correct</p>
              <p className="font-display font-bold text-xl text-neon-cyan">
                {results.correctAnswers}/{results.totalQuestions}
              </p>
            </div>
            <div className="text-center p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-text-muted text-xs uppercase">Best Streak</p>
              <p className="font-display font-bold text-xl text-neon-orange">
                {results.highestStreak}x
              </p>
            </div>
            <div className="text-center p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-text-muted text-xs uppercase">Avg Time</p>
              <p className="font-display font-bold text-xl text-neon-pink">
                {(results.averageTime / 1000).toFixed(1)}s
              </p>
            </div>
          </div>

          {/* Bonus points */}
          {Object.values(results.bonusPoints).some(v => v > 0) && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-text-muted text-xs uppercase mb-3">Bonus Points</p>
              <div className="flex flex-wrap gap-2">
                {results.bonusPoints.streak > 0 && (
                  <span className="px-3 py-1 bg-neon-orange/20 text-neon-orange rounded-full text-sm font-display">
                    🔥 Streak +{results.bonusPoints.streak}
                  </span>
                )}
                {results.bonusPoints.speed > 0 && (
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-display">
                    ⚡ Speed +{results.bonusPoints.speed}
                  </span>
                )}
                {results.bonusPoints.perfect > 0 && (
                  <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm font-display">
                    ✨ Perfect +{results.bonusPoints.perfect}
                  </span>
                )}
                {results.bonusPoints.noHints > 0 && (
                  <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm font-display">
                    🧠 No Hints +{results.bonusPoints.noHints}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Explorer Rank */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-4"
        >
          <div className="text-4xl">{rankInfo.icon}</div>
          <div className="flex-1">
            <p className="text-text-muted text-xs uppercase">Explorer Rank</p>
            <p className="font-display font-bold text-white">{rankInfo.label}</p>
            <p className="text-text-secondary text-sm">
              {explorerStats.countriesLearned.length} countries learned
            </p>
          </div>
          {results.newCountriesLearned.length > 0 && (
            <div className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm font-display">
              +{results.newCountriesLearned.length} new!
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 transition-all"
          >
            🔄 Retry
          </motion.button>

          {canProceed && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLevel}
              className="flex-1 py-3 px-6 rounded-xl font-display font-bold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all"
            >
              Next Level →
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToMenu}
            className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/5 transition-all"
          >
            ← Menu
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
