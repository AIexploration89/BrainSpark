import { motion } from 'framer-motion';
import type { GameResults, TypingLevel } from '../types';
import { calculateXP, getPerformanceRating } from '../utils/scoring';

interface ResultsScreenProps {
  results: GameResults;
  level: TypingLevel;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  isFailure?: boolean;
}

const ratingInfo = {
  bronze: { color: 'text-orange-400', icon: '🥉', label: 'Bronze' },
  silver: { color: 'text-gray-300', icon: '🥈', label: 'Silver' },
  gold: { color: 'text-yellow-400', icon: '🥇', label: 'Gold' },
  platinum: { color: 'text-neon-cyan', icon: '💎', label: 'Platinum' },
};

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
  isFailure = false,
}: ResultsScreenProps) {
  const xpResult = calculateXP(results, level);
  const rating = getPerformanceRating(results, level.id);
  const ratingStyle = ratingInfo[rating];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center mb-8"
      >
        {isFailure ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              😔
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-neon-red mb-2">
              Challenge Failed
            </h2>
            <p className="text-text-secondary">Don't give up! Try again!</p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {ratingStyle.icon}
            </motion.div>
            <h2 className={`text-3xl font-display font-bold ${ratingStyle.color} mb-2`}>
              {ratingStyle.label} Performance!
            </h2>
            <p className="text-text-secondary">Great job completing {level.name}!</p>
          </>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <StatCard label="WPM" value={results.wpm} icon="⚡" color="cyan" />
        <StatCard label="Accuracy" value={`${results.accuracy}%`} icon="🎯" color="green" />
        <StatCard label="Max Streak" value={results.maxStreak} icon="🔥" color="orange" />
        <StatCard
          label="Time"
          value={formatTime(results.timeElapsed)}
          icon="⏱️"
          color="purple"
        />
      </motion.div>

      {/* XP Breakdown */}
      {!isFailure && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card rounded-xl p-6 mb-8 border border-white/5"
        >
          <h3 className="text-lg font-display font-bold text-white mb-4">Rewards</h3>

          {/* XP */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-secondary">Base XP</span>
            <span className="text-neon-purple font-mono font-bold">+{xpResult.baseXP}</span>
          </div>

          {/* Bonuses */}
          {xpResult.bonuses.map((bonus, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-text-secondary text-sm">{bonus.label}</span>
              <span className="text-neon-green font-mono text-sm">+{bonus.amount}</span>
            </motion.div>
          ))}

          <div className="border-t border-white/10 mt-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Total XP</span>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.8 }}
                className="text-neon-purple font-display text-2xl font-bold"
              >
                +{xpResult.totalXP}
              </motion.span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white font-semibold">Sparks</span>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 0.9 }}
                className="text-neon-yellow font-display text-2xl font-bold"
              >
                +{xpResult.sparks} ⚡
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Analysis (if any errors) */}
      {results.keyErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card rounded-xl p-6 mb-8 border border-white/5"
        >
          <h3 className="text-lg font-display font-bold text-white mb-4">Problem Keys</h3>
          <div className="flex flex-wrap gap-2">
            {results.keyErrors
              .sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((error, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-neon-red/10 border border-neon-red/30 rounded-lg"
                >
                  <span className="font-mono font-bold text-neon-red uppercase">
                    {error.expected === ' ' ? 'Space' : error.expected}
                  </span>
                  <span className="text-xs text-text-muted">× {error.count}</span>
                </div>
              ))}
          </div>
          <p className="text-xs text-text-muted mt-3">
            Practice these keys to improve your accuracy!
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="flex-1 py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all"
        >
          Try Again
        </motion.button>

        {!isFailure && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNextLevel}
            className="flex-1 py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all"
          >
            Next Level
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBackToMenu}
          className="py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
        >
          Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: 'cyan' | 'green' | 'orange' | 'purple';
}

const statColors = {
  cyan: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
  green: 'text-neon-green border-neon-green/30 bg-neon-green/10',
  orange: 'text-neon-orange border-neon-orange/30 bg-neon-orange/10',
  purple: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10',
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`p-4 rounded-xl border ${statColors[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-display font-bold ${statColors[color].split(' ')[0]}`}>
        {value}
      </div>
      <div className="text-xs text-text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
