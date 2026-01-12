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
  const { stars, score, blocksUsed, optimalBlocks, coinsCollected, gemsCollected, sparksEarned, xpEarned, isPerfect } = results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md overflow-auto py-8"
    >
      {/* Success particles */}
      {!isFailure && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#ff00ff' : '#00f5ff',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          {isFailure ? (
            <>
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-7xl mb-4"
              >
                😵
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-neon-red mb-2">
                Program Error!
              </h1>
              <p className="text-text-secondary">
                Debug your code and try again
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="text-7xl mb-4"
              >
                {isPerfect ? '🏆' : stars === 3 ? '🌟' : '🎉'}
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">
                {isPerfect ? 'PERFECT!' : stars === 3 ? 'EXCELLENT!' : 'LEVEL COMPLETE!'}
              </h1>
              <p className="text-text-secondary">{level.name}</p>
            </>
          )}
        </motion.div>

        {/* Stars (success only) */}
        {!isFailure && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mb-8"
          >
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={{
                  scale: s <= stars ? 1 : 0.7,
                  rotate: 0,
                  opacity: s <= stars ? 1 : 0.3,
                }}
                transition={{
                  delay: 0.4 + s * 0.2,
                  type: 'spring',
                  stiffness: 300,
                }}
                className="relative"
              >
                <span
                  className="text-5xl"
                  style={{
                    filter: s <= stars ? 'drop-shadow(0 0 10px rgba(255,255,0,0.8))' : 'none',
                  }}
                >
                  ⭐
                </span>
                {s <= stars && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: s * 0.2,
                    }}
                  >
                    <span className="text-5xl">⭐</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-bg-secondary/80 backdrop-blur rounded-2xl border border-white/10 p-6 mb-6"
        >
          {!isFailure && (
            <>
              {/* Score */}
              <div className="text-center mb-6">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Score</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="font-display text-4xl font-bold text-neon-green"
                  style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}
                >
                  {score.toLocaleString()}
                </motion.p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Blocks used */}
                <div className="text-center p-3 bg-bg-tertiary/50 rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Blocks Used</p>
                  <p className="font-display font-bold">
                    <span className={blocksUsed <= optimalBlocks ? 'text-neon-green' : 'text-neon-yellow'}>
                      {blocksUsed}
                    </span>
                    <span className="text-text-muted">/{optimalBlocks}</span>
                  </p>
                </div>

                {/* Efficiency */}
                <div className="text-center p-3 bg-bg-tertiary/50 rounded-xl">
                  <p className="text-xs text-text-muted mb-1">Efficiency</p>
                  <p className={`font-display font-bold ${
                    blocksUsed <= optimalBlocks ? 'text-neon-green' :
                      blocksUsed <= optimalBlocks * 1.5 ? 'text-neon-yellow' : 'text-neon-orange'
                  }`}>
                    {Math.min(100, Math.round((optimalBlocks / blocksUsed) * 100))}%
                  </p>
                </div>

                {/* Coins */}
                {(coinsCollected > 0 || level.coinsRequired) && (
                  <div className="text-center p-3 bg-bg-tertiary/50 rounded-xl">
                    <p className="text-xs text-text-muted mb-1">Coins</p>
                    <p className="font-display font-bold text-neon-yellow">
                      🪙 {coinsCollected}
                    </p>
                  </div>
                )}

                {/* Gems */}
                {(gemsCollected > 0 || level.gemsRequired) && (
                  <div className="text-center p-3 bg-bg-tertiary/50 rounded-xl">
                    <p className="text-xs text-text-muted mb-1">Gems</p>
                    <p className="font-display font-bold text-neon-cyan">
                      💎 {gemsCollected}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Rewards (success only) */}
          {!isFailure && (xpEarned > 0 || sparksEarned > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-4 border-t border-white/10"
            >
              <p className="text-xs text-text-muted uppercase tracking-wider text-center mb-3">
                Rewards Earned
              </p>
              <div className="flex justify-center gap-6">
                {xpEarned > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-neon-purple">+{Math.round(xpEarned)}</span>
                    <span className="text-text-muted">XP</span>
                  </div>
                )}
                {sparksEarned > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-neon-yellow">+{sparksEarned}</span>
                    <span className="text-text-muted">⚡ Sparks</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Failure info */}
          {isFailure && (
            <div className="text-center">
              <div className="p-4 bg-neon-red/10 border border-neon-red/30 rounded-xl mb-4">
                <p className="text-neon-red font-mono text-sm">
                  ❌ Sparky didn't reach the goal
                </p>
              </div>
              <p className="text-text-secondary text-sm">
                Check your commands and try a different approach!
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          {isFailure ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="w-full py-4 px-6 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-blue-500 text-white shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all"
              >
                🔄 Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToMenu}
                className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
              >
                ← Back to Levels
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNextLevel}
                className="w-full py-4 px-6 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-white shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all"
              >
                Next Level →
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRetry}
                  className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all"
                >
                  ↺ Retry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBackToMenu}
                  className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
                >
                  Levels
                </motion.button>
              </div>
            </>
          )}
        </motion.div>

        {/* Perfect bonus hint */}
        {!isFailure && !isPerfect && stars < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-text-muted">
              💡 Use {optimalBlocks} or fewer blocks to get 3 stars!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ResultsScreen;
