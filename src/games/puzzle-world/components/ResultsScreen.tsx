import { motion } from 'framer-motion';
import type { Level, LevelResults } from '../types';

interface ResultsScreenProps {
  results: LevelResults;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  isFailure?: boolean;
  hasNextLevel?: boolean;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
  isFailure = false,
  hasNextLevel = true,
}: ResultsScreenProps) {
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isFailure ? (
          // Failure background
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,51,102,0.2) 0%, transparent 70%)',
            }}
          />
        ) : (
          // Success background with particles
          <>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)',
              }}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -5, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)',
              }}
            />

            {/* Confetti particles */}
            {results.stars >= 2 &&
              [...Array(20)].map((_, i) => (
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
                    rotate: [0, 360, 720],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    background: ['#00F5FF', '#FF00FF', '#00FF88', '#FFE55C'][i % 4],
                    boxShadow: `0 0 10px ${['#00F5FF', '#FF00FF', '#00FF88', '#FFE55C'][i % 4]}`,
                  }}
                />
              ))}
          </>
        )}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 max-w-lg w-full"
      >
        {/* Result card */}
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: isFailure
              ? 'linear-gradient(135deg, rgba(255,51,102,0.1) 0%, rgba(30,30,45,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(30,30,45,0.95) 100%)',
            boxShadow: isFailure
              ? '0 0 60px rgba(255,51,102,0.2), inset 0 0 60px rgba(0,0,0,0.3)'
              : '0 0 60px rgba(0,255,136,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
            border: isFailure
              ? '1px solid rgba(255,51,102,0.3)'
              : '1px solid rgba(0,255,136,0.3)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isFailure ? (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h2
                  className="text-3xl font-display font-bold text-neon-red mb-2"
                  style={{ textShadow: '0 0 20px rgba(255,51,102,0.6)' }}
                >
                  TIME'S UP!
                </h2>
                <p className="text-text-secondary">Don't give up! Try again!</p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {results.stars === 3 ? '🏆' : results.stars === 2 ? '🎉' : '✨'}
                </motion.div>
                <h2
                  className="text-3xl font-display font-bold text-neon-green mb-2"
                  style={{ textShadow: '0 0 20px rgba(0,255,136,0.6)' }}
                >
                  {results.stars === 3 ? 'PERFECT!' : results.stars === 2 ? 'GREAT JOB!' : 'COMPLETED!'}
                </h2>
                <p className="text-text-secondary">{level.name} - Level {level.id}</p>
              </>
            )}
          </motion.div>

          {/* Stars */}
          {!isFailure && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="flex justify-center gap-4 my-8"
            >
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: star <= results.stars ? 1 : 0.5,
                    rotate: 0,
                  }}
                  transition={{ delay: 0.5 + star * 0.2, type: 'spring' }}
                  className={`text-5xl ${star <= results.stars ? '' : 'opacity-30 grayscale'}`}
                  style={{
                    filter: star <= results.stars ? 'drop-shadow(0 0 15px rgba(255,229,92,0.8))' : 'none',
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-xs text-text-muted uppercase mb-1">Score</p>
              <p className="text-2xl font-display font-bold text-neon-cyan">
                {results.score.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-xs text-text-muted uppercase mb-1">Time</p>
              <p className="text-2xl font-display font-bold text-neon-pink">
                {formatTime(results.time)}
              </p>
            </div>
            <div className="p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-xs text-text-muted uppercase mb-1">Moves</p>
              <p className="text-2xl font-display font-bold text-neon-purple">{results.moves}</p>
            </div>
            <div className="p-3 bg-bg-primary/50 rounded-xl">
              <p className="text-xs text-text-muted uppercase mb-1">Hints</p>
              <p className="text-2xl font-display font-bold text-neon-yellow">{results.hintsUsed}</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            {!isFailure && hasNextLevel && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,136,0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onNextLevel}
                className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
              >
                Next Level →
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,245,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-bg-secondary border-2 border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan transition-all"
            >
              {isFailure ? 'Try Again' : 'Retry Level'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBackToMenu}
              className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
            >
              ← Back to Menu
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
