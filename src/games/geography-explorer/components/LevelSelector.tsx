import { motion } from 'framer-motion';
import type { Level, GameMode, Continent } from '../types';
import { DIFFICULTY_CONFIG, GAME_MODES, CONTINENTS } from '../types';
import { LEVELS } from '../data/levels';
import { useGeoProgressStore } from '../stores/geoStore';

interface LevelSelectorProps {
  mode: GameMode;
  continent: Continent;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ mode, continent, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked } = useGeoProgressStore();

  // Filter levels by mode
  const modeLevels = LEVELS.filter(l => l.mode === mode);
  const modeInfo = GAME_MODES.find(m => m.id === mode);
  const continentInfo = CONTINENTS.find(c => c.id === continent);

  const difficultyColors: Record<string, string> = {
    'neon-green': 'from-neon-green/30 to-neon-green/5 border-neon-green/40 hover:border-neon-green text-neon-green',
    'neon-cyan': 'from-neon-cyan/30 to-neon-cyan/5 border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan',
    'neon-orange': 'from-neon-orange/30 to-neon-orange/5 border-neon-orange/40 hover:border-neon-orange text-neon-orange',
    'neon-pink': 'from-neon-pink/30 to-neon-pink/5 border-neon-pink/40 hover:border-neon-pink text-neon-pink',
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col p-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(0,245,255,0.3) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(255,0,255,0.3) 0%, transparent 40%)
            `,
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 pt-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{modeInfo?.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {modeInfo?.name}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <span>{continentInfo?.icon}</span>
          <span>{continentInfo?.name}</span>
        </div>
      </motion.div>

      {/* Level grid */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
          {modeLevels.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const unlocked = isLevelUnlocked(level.id);
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];
            const colorClass = difficultyColors[diffConfig.color];

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={unlocked ? { scale: 1.02, y: -4 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`
                  relative bg-gradient-to-br ${colorClass}
                  border rounded-xl p-5 text-left transition-all duration-300
                  ${unlocked ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                  group
                `}
              >
                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-xl">
                    <span className="text-3xl">🔒</span>
                  </div>
                )}

                {/* Level number */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-display font-bold text-sm ${diffConfig.color === 'neon-green' ? 'text-neon-green' : diffConfig.color === 'neon-cyan' ? 'text-neon-cyan' : diffConfig.color === 'neon-orange' ? 'text-neon-orange' : 'text-neon-pink'}`}>
                    Level {level.id}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-text-muted font-display">
                    {diffConfig.label}
                  </span>
                </div>

                {/* Level name */}
                <h3 className="font-display font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  {level.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {level.description}
                </p>

                {/* Level stats */}
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{level.questionCount} questions</span>
                  <span>{level.timeLimit}s each</span>
                </div>

                {/* Stars */}
                {unlocked && (
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${star <= (progress?.stars || 0) ? '' : 'opacity-30 grayscale'}`}
                      >
                        ⭐
                      </span>
                    ))}
                    {progress && progress.highScore > 0 && (
                      <span className="ml-auto text-text-muted text-xs font-display">
                        Best: {progress.highScore.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Score multiplier badge */}
                {diffConfig.multiplier > 1 && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow rounded text-xs font-display font-bold">
                    {diffConfig.multiplier}x
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* How to play */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-white/10 max-w-2xl mx-auto relative z-10"
      >
        <h3 className="font-display font-bold text-white text-sm mb-2 flex items-center gap-2">
          <span>💡</span> How to Play
        </h3>
        <p className="text-text-secondary text-sm">
          {modeInfo?.howToPlay}
        </p>
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-6 px-6 py-3 font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors mx-auto relative z-10"
      >
        ← Back to Regions
      </motion.button>
    </div>
  );
}
