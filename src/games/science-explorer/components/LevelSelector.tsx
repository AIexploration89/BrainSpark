import { motion } from 'framer-motion';
import type { ScienceCategory, Level } from '../types';
import { SCIENCE_CATEGORIES, DIFFICULTY_CONFIG } from '../types';
import { getLevelsByCategory } from '../data/levels';
import { useScienceProgressStore } from '../stores/scienceStore';
import { LabBackground } from './LabBackground';

interface LevelSelectorProps {
  category: ScienceCategory;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ category, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked } = useScienceProgressStore();

  const categoryConfig = SCIENCE_CATEGORIES.find(c => c.id === category)!;
  const levels = getLevelsByCategory(category);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative">
      <LabBackground intensity="low" category={category} />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">{categoryConfig.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            {categoryConfig.name}
          </h1>
        </div>
        <p className="text-text-secondary text-sm">Choose a level to begin your experiment</p>
      </motion.div>

      {/* Levels grid */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(level.id);
            const progress = getLevelProgress(level.id);
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];
            const stars = progress?.stars || 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  relative p-5 rounded-xl border-2 text-left overflow-hidden
                  transition-all duration-300
                  ${isUnlocked
                    ? `bg-bg-secondary/80 backdrop-blur-sm border-${diffConfig.color}/30 hover:border-${diffConfig.color}/60 cursor-pointer`
                    : 'bg-bg-primary/50 border-white/5 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 z-10">
                    <div className="text-center">
                      <span className="text-3xl">🔒</span>
                      <p className="text-text-muted text-xs mt-1">
                        Score {level.unlockRequirement?.minScore} on Level {level.unlockRequirement?.levelId}
                      </p>
                    </div>
                  </div>
                )}

                {/* Level number badge */}
                <div
                  className={`
                    absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center
                    font-display font-bold text-sm
                    ${isUnlocked ? `bg-${diffConfig.color}/20 text-${diffConfig.color}` : 'bg-white/5 text-text-muted'}
                  `}
                >
                  {level.id}
                </div>

                {/* Difficulty icon */}
                <div className="text-2xl mb-2">{diffConfig.icon}</div>

                {/* Title and description */}
                <h3 className="font-display font-bold text-white mb-1 pr-10">
                  {level.name}
                </h3>
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                  {level.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                  <span className="flex items-center gap-1">
                    ❓ {level.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {level.timeLimit}s
                  </span>
                </div>

                {/* Difficulty badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`
                      px-2 py-1 rounded-full text-xs font-display uppercase
                      bg-${diffConfig.color}/20 text-${diffConfig.color}
                    `}
                  >
                    {diffConfig.label}
                  </span>

                  {/* Stars */}
                  {isUnlocked && (
                    <div className="flex gap-1">
                      {[1, 2, 3].map((starNum) => (
                        <span
                          key={starNum}
                          className={`text-lg ${starNum <= stars ? '' : 'opacity-30 grayscale'}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* High score */}
                {isUnlocked && progress && progress.highScore > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Best Score</span>
                      <span className="font-display font-bold text-neon-green">
                        {progress.highScore.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-text-muted">Best Accuracy</span>
                      <span className="font-display font-bold text-neon-cyan">
                        {Math.round(progress.bestAccuracy)}%
                      </span>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-6 mx-auto px-6 py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Categories
      </motion.button>
    </div>
  );
}
