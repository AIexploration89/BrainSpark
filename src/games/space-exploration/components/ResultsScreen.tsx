import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { useSpaceProgressStore } from '../stores/spaceStore';

interface ResultsScreenProps {
  results: GameResult;
  level?: Level;
  onRetry: () => void;
  onNextLevel?: () => void;
  onBackToMenu: () => void;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
}: ResultsScreenProps) {
  const { progress } = useSpaceProgressStore();

  const stars = results.starsEarned;
  const isGreatResult = stars >= 2;
  const isPerfect = results.isPerfect;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      {/* Celebration particles */}
      {isGreatResult && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
              }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            >
              {['⭐', '🌟', '✨', '🚀', '🛸', '🌙'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-bg-secondary rounded-3xl p-8 max-w-lg w-full border border-white/10 relative overflow-hidden"
        style={{
          boxShadow: isPerfect
            ? '0 0 60px rgba(0, 255, 136, 0.2)'
            : '0 0 60px rgba(0, 245, 255, 0.1)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${
              isPerfect ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 245, 255, 0.3)'
            }, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-6xl mb-4"
            >
              {isPerfect ? '🏆' : isGreatResult ? '🎉' : '🚀'}
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {isPerfect
                ? 'PERFECT!'
                : isGreatResult
                ? 'Great Job!'
                : 'Mission Complete'}
            </h2>
            {level && (
              <p className="text-text-secondary">
                {level.name}
              </p>
            )}
          </motion.div>

          {/* Stars */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex justify-center gap-4 mb-8"
          >
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, y: 20, rotate: -30 }}
                animate={{
                  opacity: star <= stars ? 1 : 0.3,
                  y: 0,
                  rotate: 0,
                }}
                transition={{ delay: 0.3 + star * 0.2 }}
                className="relative"
              >
                <span
                  className={`text-5xl ${
                    star <= stars ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : ''
                  }`}
                >
                  {star <= stars ? '⭐' : '☆'}
                </span>
                {star <= stars && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 0] }}
                    transition={{ delay: 0.5 + star * 0.2, duration: 0.5 }}
                    className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <StatCard
              label="Score"
              value={results.score.toLocaleString()}
              icon="🎯"
              highlight
            />
            <StatCard
              label="Accuracy"
              value={`${Math.round(results.accuracy)}%`}
              icon="✓"
            />
            {results.mode === 'quiz' && (
              <>
                <StatCard
                  label="Correct"
                  value={`${results.questionsCorrect}/${results.questionsTotal}`}
                  icon="💡"
                />
                <StatCard
                  label="Time Bonus"
                  value={`+${results.timeBonus}`}
                  icon="⏱"
                />
              </>
            )}
            {results.mode === 'explore' && (
              <>
                <StatCard
                  label="Facts Found"
                  value={results.factsDiscovered.toString()}
                  icon="🔍"
                />
                <StatCard
                  label="Stars Earned"
                  value={`+${results.starsEarned}`}
                  icon="⭐"
                />
              </>
            )}
          </motion.div>

          {/* Rank info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-6 p-4 bg-white/5 rounded-xl"
          >
            <p className="text-sm text-text-muted mb-1">Your Rank</p>
            <p className="font-display font-bold text-neon-cyan capitalize">
              {progress.currentRank}
            </p>
            <p className="text-xs text-text-muted mt-1">
              Total Stars: {progress.totalStars}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-3"
          >
            {onNextLevel && stars >= 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNextLevel}
                className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_30px_rgba(0,245,255,0.3)]"
              >
                Next Mission →
              </motion.button>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex-1 py-3 px-6 rounded-xl font-display font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                🔄 Retry
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToMenu}
                className="flex-1 py-3 px-6 rounded-xl font-display font-semibold text-text-muted hover:text-white transition-colors"
              >
                🏠 Menu
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}

function StatCard({ label, value, icon, highlight }: StatCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-neon-cyan/10 border-neon-cyan/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-xs text-text-muted uppercase">{label}</span>
      </div>
      <p
        className={`text-2xl font-display font-bold ${
          highlight ? 'text-neon-cyan' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default ResultsScreen;
