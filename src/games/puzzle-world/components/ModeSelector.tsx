import { motion } from 'framer-motion';
import { MODES, type PuzzleMode } from '../types';
import { usePuzzleProgressStore } from '../stores/puzzleStore';

interface ModeSelectorProps {
  onSelectMode: (mode: PuzzleMode) => void;
  onBack: () => void;
}

const MODE_COLORS: Record<PuzzleMode, { primary: string; glow: string; gradient: string }> = {
  sliding: {
    primary: 'rgba(0,245,255,1)',
    glow: 'rgba(0,245,255,0.5)',
    gradient: 'from-neon-cyan/20 to-neon-cyan/5',
  },
  'pattern-match': {
    primary: 'rgba(255,0,255,1)',
    glow: 'rgba(255,0,255,0.5)',
    gradient: 'from-neon-pink/20 to-neon-pink/5',
  },
  sequence: {
    primary: 'rgba(139,92,246,1)',
    glow: 'rgba(139,92,246,0.5)',
    gradient: 'from-neon-purple/20 to-neon-purple/5',
  },
  jigsaw: {
    primary: 'rgba(0,255,136,1)',
    glow: 'rgba(0,255,136,0.5)',
    gradient: 'from-neon-green/20 to-neon-green/5',
  },
};

export function ModeSelector({ onSelectMode, onBack }: ModeSelectorProps) {
  const { getModeProgress, totalScore, puzzleRank } = usePuzzleProgressStore();

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
          style={{
            background: `
              conic-gradient(from 0deg,
                rgba(0,245,255,0.05) 0deg,
                rgba(255,0,255,0.05) 90deg,
                rgba(139,92,246,0.05) 180deg,
                rgba(0,255,136,0.05) 270deg,
                rgba(0,245,255,0.05) 360deg
              )
            `,
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
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
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Choose a Mode</h1>
            <p className="text-sm text-text-muted">Select your puzzle challenge</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-text-muted">Total Score</p>
            <p className="text-lg font-display font-bold text-neon-cyan">
              {totalScore.toLocaleString()}
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,229,92,0.2) 0%, rgba(255,107,53,0.2) 100%)',
              border: '1px solid rgba(255,229,92,0.4)',
            }}
          >
            <p className="text-xs text-text-muted">Rank</p>
            <p className="text-sm font-display font-bold text-neon-yellow">{puzzleRank}</p>
          </div>
        </div>
      </div>

      {/* Mode Cards */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
          {MODES.map((mode, index) => {
            const colors = MODE_COLORS[mode.id];
            const progress = getModeProgress(mode.id);

            return (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 0 40px ${colors.glow}`,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectMode(mode.id)}
                className={`
                  relative p-6 rounded-2xl text-left overflow-hidden
                  bg-gradient-to-br ${colors.gradient}
                  border transition-all
                `}
                style={{
                  borderColor: `${colors.primary}30`,
                }}
              >
                {/* Holographic shimmer */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '200% 200%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
                      style={{
                        background: `${colors.primary}15`,
                        boxShadow: `0 0 30px ${colors.glow}`,
                        border: `2px solid ${colors.primary}50`,
                      }}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">{mode.name}</h3>
                      <p className="text-sm text-text-secondary">{mode.levelCount} Levels</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mb-4">{mode.description}</p>

                  {/* Progress */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-muted">Progress:</span>
                      <span
                        className="text-sm font-display font-bold"
                        style={{ color: colors.primary }}
                      >
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-neon-yellow">⭐</span>
                      <span className="text-sm font-display font-bold text-neon-yellow">
                        {progress.stars}/{progress.total * 3}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-bg-primary/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{
                        background: colors.primary,
                        boxShadow: `0 0 10px ${colors.glow}`,
                      }}
                    />
                  </div>
                </div>

                {/* Corner decoration */}
                <div
                  className="absolute top-3 right-3 w-6 h-6 opacity-50"
                  style={{
                    borderTop: `2px solid ${colors.primary}`,
                    borderRight: `2px solid ${colors.primary}`,
                    borderTopRightRadius: '4px',
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 w-6 h-6 opacity-50"
                  style={{
                    borderBottom: `2px solid ${colors.primary}`,
                    borderLeft: `2px solid ${colors.primary}`,
                    borderBottomLeftRadius: '4px',
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 relative z-10"
      >
        <p className="text-text-muted text-sm">
          Complete puzzles to earn stars and unlock new challenges!
        </p>
      </motion.div>
    </div>
  );
}
