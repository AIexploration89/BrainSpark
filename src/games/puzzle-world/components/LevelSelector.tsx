import { motion } from 'framer-motion';
import { MODES, DIFFICULTY_CONFIG, type PuzzleMode, type Level } from '../types';
import { getLevelsForMode } from '../data/levels';
import { usePuzzleProgressStore } from '../stores/puzzleStore';

interface LevelSelectorProps {
  mode: PuzzleMode;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const MODE_COLORS: Record<PuzzleMode, { primary: string; glow: string }> = {
  sliding: { primary: '#00F5FF', glow: 'rgba(0,245,255,0.5)' },
  'pattern-match': { primary: '#FF00FF', glow: 'rgba(255,0,255,0.5)' },
  sequence: { primary: '#8B5CF6', glow: 'rgba(139,92,246,0.5)' },
  jigsaw: { primary: '#00FF88', glow: 'rgba(0,255,136,0.5)' },
};

export function LevelSelector({ mode, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked, getModeProgress } = usePuzzleProgressStore();

  const levels = getLevelsForMode(mode);
  const modeInfo = MODES.find((m) => m.id === mode);
  const colors = MODE_COLORS[mode];
  const progress = getModeProgress(mode);

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all"
          >
            <span className="text-xl">←</span>
          </motion.button>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `${colors.primary}15`,
                boxShadow: `0 0 20px ${colors.glow}`,
                border: `2px solid ${colors.primary}50`,
              }}
            >
              {modeInfo?.icon}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{modeInfo?.name}</h1>
              <p className="text-sm text-text-muted">Select a level to play</p>
            </div>
          </div>
        </div>

        {/* Progress summary */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-text-muted">Completed</p>
            <p className="text-lg font-display font-bold" style={{ color: colors.primary }}>
              {progress.completed}/{progress.total}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Stars</p>
            <p className="text-lg font-display font-bold text-neon-yellow">
              {progress.stars}/{progress.total * 3} ⭐
            </p>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="flex-1 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {levels.map((level, index) => {
            const levelProgress = getLevelProgress(mode, level.id);
            const isUnlocked = isLevelUnlocked(mode, level.id);
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={
                  isUnlocked
                    ? {
                        scale: 1.05,
                        boxShadow: `0 0 30px ${colors.glow}`,
                      }
                    : undefined
                }
                whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  relative p-4 rounded-2xl text-center overflow-hidden transition-all
                  ${
                    isUnlocked
                      ? 'bg-bg-secondary/80 backdrop-blur-sm cursor-pointer'
                      : 'bg-bg-secondary/30 cursor-not-allowed opacity-60'
                  }
                `}
                style={{
                  border: isUnlocked ? `2px solid ${colors.primary}40` : '2px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm z-20">
                    <span className="text-3xl">🔒</span>
                  </div>
                )}

                {/* Level number */}
                <motion.div
                  animate={
                    isUnlocked && !levelProgress?.completed
                      ? {
                          boxShadow: [
                            `0 0 15px ${colors.glow}`,
                            `0 0 25px ${colors.glow}`,
                            `0 0 15px ${colors.glow}`,
                          ],
                        }
                      : undefined
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: levelProgress?.completed
                      ? `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.primary}20 100%)`
                      : 'rgba(255,255,255,0.05)',
                    border: levelProgress?.completed
                      ? `2px solid ${colors.primary}`
                      : '2px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <span
                    className="text-2xl font-display font-bold"
                    style={{
                      color: levelProgress?.completed ? colors.primary : 'white',
                      textShadow: levelProgress?.completed ? `0 0 10px ${colors.glow}` : 'none',
                    }}
                  >
                    {level.id}
                  </span>
                </motion.div>

                {/* Level name */}
                <h3 className="text-sm font-display font-bold text-white mb-1 truncate">
                  {level.name}
                </h3>

                {/* Difficulty badge */}
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-display uppercase rounded-full mb-2`}
                  style={{
                    background: `var(--${diffConfig.color.replace('neon-', '')}, ${colors.primary})15`,
                    color: `var(--${diffConfig.color.replace('neon-', '')}, ${colors.primary})`,
                    border: `1px solid currentColor`,
                  }}
                >
                  {diffConfig.label}
                </span>

                {/* Stars */}
                <div className="flex justify-center gap-0.5">
                  {[1, 2, 3].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        levelProgress && star <= levelProgress.bestStars
                          ? 'text-neon-yellow'
                          : 'text-text-muted opacity-30'
                      }`}
                      style={{
                        filter:
                          levelProgress && star <= levelProgress.bestStars
                            ? 'drop-shadow(0 0 5px rgba(255,229,92,0.8))'
                            : 'none',
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Best score */}
                {levelProgress?.bestScore && levelProgress.bestScore > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    Best: {levelProgress.bestScore.toLocaleString()}
                  </p>
                )}

                {/* Completion checkmark */}
                {levelProgress?.completed && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: colors.primary,
                      boxShadow: `0 0 10px ${colors.glow}`,
                    }}
                  >
                    <span className="text-xs text-black font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 relative z-10"
      >
        <p className="text-text-muted text-sm">
          Complete levels to unlock the next challenge. Get 3 stars for a perfect score!
        </p>
      </motion.div>
    </div>
  );
}
