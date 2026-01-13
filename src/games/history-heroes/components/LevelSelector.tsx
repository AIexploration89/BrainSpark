import { motion } from 'framer-motion';
import { HISTORICAL_ERAS, DIFFICULTY_CONFIG, type HistoricalEra, type Level } from '../types';
import { getLevelsByEra } from '../data/levels';
import { useHistoryProgressStore } from '../stores/historyStore';
import { TimelineBackground } from './TimelineBackground';

interface LevelSelectorProps {
  era: HistoricalEra;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ era, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked } = useHistoryProgressStore();
  const levels = getLevelsByEra(era);
  const eraConfig = HISTORICAL_ERAS.find(e => e.id === era)!;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative">
      <TimelineBackground intensity="medium" era={era} />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-white/10 text-text-secondary hover:text-white transition-all"
        >
          ←
        </motion.button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{eraConfig.icon}</span>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {eraConfig.name}
            </h1>
            <p className="text-text-secondary text-sm">{eraConfig.years}</p>
          </div>
        </div>
      </motion.div>

      {/* Levels grid */}
      <div className="flex-1 max-w-4xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {levels.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const unlocked = isLevelUnlocked(level.id);
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];
            const stars = progress?.stars || 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={unlocked ? { scale: 1.03, y: -2 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`
                  relative p-5 rounded-xl border-2 transition-all duration-300 text-left
                  ${unlocked
                    ? `bg-bg-secondary/80 border-white/10 hover:border-${eraConfig.color}/50 cursor-pointer`
                    : 'bg-bg-secondary/40 border-white/5 cursor-not-allowed'
                  }
                  backdrop-blur-xl overflow-hidden
                `}
              >
                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 z-10">
                    <div className="text-center">
                      <span className="text-4xl">🔒</span>
                      <p className="text-text-muted text-xs mt-2">
                        Score {level.unlockRequirement?.minScore} on previous level
                      </p>
                    </div>
                  </div>
                )}

                {/* Level number badge */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{
                    background: unlocked ? `${eraConfig.accentColor}20` : 'rgba(255,255,255,0.05)',
                    color: unlocked ? eraConfig.accentColor : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {index + 1}
                </div>

                {/* Difficulty icon */}
                <span className="text-3xl mb-3 block">{diffConfig.icon}</span>

                {/* Level info */}
                <h3 className={`font-display font-bold mb-1 ${unlocked ? 'text-white' : 'text-white/40'}`}>
                  {level.name}
                </h3>
                <p className={`text-sm mb-3 ${unlocked ? 'text-text-secondary' : 'text-text-muted/40'}`}>
                  {level.description}
                </p>

                {/* Difficulty badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-display uppercase ${
                      unlocked ? `bg-${diffConfig.color}/20 text-${diffConfig.color}` : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {diffConfig.label}
                  </span>
                  <span className={`text-xs ${unlocked ? 'text-text-muted' : 'text-white/20'}`}>
                    {level.questionCount} questions • {level.timeLimit}s each
                  </span>
                </div>

                {/* Stars display */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(starNum => (
                    <span
                      key={starNum}
                      className={`text-lg ${starNum <= stars ? 'text-neon-yellow' : 'text-white/20'}`}
                    >
                      ★
                    </span>
                  ))}
                  {progress && progress.highScore > 0 && (
                    <span className="ml-2 text-text-muted text-xs">
                      Best: {progress.highScore.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Play count */}
                {progress && progress.timesPlayed > 0 && (
                  <div className="mt-2 text-text-muted text-xs">
                    Played {progress.timesPlayed}x •
                    {progress.bestAccuracy > 0 && ` Best: ${Math.round(progress.bestAccuracy)}%`}
                  </div>
                )}

                {/* Glow effect on hover */}
                {unlocked && (
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${eraConfig.accentColor}10 0%, transparent 70%)`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6 relative z-10"
      >
        <p className="text-text-muted text-sm">
          💡 Score 60%+ for ⭐ • 80%+ for ⭐⭐ • 95%+ for ⭐⭐⭐
        </p>
      </motion.div>
    </div>
  );
}
