import { motion } from 'framer-motion';
import type { AnimalCategory, Level } from '../types';
import { ANIMAL_CATEGORIES, DIFFICULTY_CONFIG } from '../types';
import { getLevelsByCategory } from '../data/levels';
import { useAnimalProgressStore } from '../stores/animalStore';
import { JungleBackground } from './JungleBackground';

interface LevelSelectorProps {
  category: AnimalCategory;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ category, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked } = useAnimalProgressStore();

  const levels = getLevelsByCategory(category);
  const categoryConfig = ANIMAL_CATEGORIES.find(c => c.id === category)!;

  return (
    <div className="min-h-screen flex flex-col p-6 relative">
      <JungleBackground intensity="low" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <motion.span
          className="text-5xl inline-block mb-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            filter: `drop-shadow(0 0 20px ${categoryConfig.glowColor})`,
          }}
        >
          {categoryConfig.icon}
        </motion.span>
        <h2 className="font-display text-3xl font-bold text-white mb-2">
          {categoryConfig.name}
        </h2>
        <p className="text-text-secondary">
          Select a level to begin your adventure
        </p>
      </motion.div>

      {/* Levels Grid */}
      <div className="flex-1 max-w-4xl w-full mx-auto relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {levels.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const isUnlocked = isLevelUnlocked(level.id);
            const stars = progress?.stars || 0;
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.05, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  relative p-4 rounded-2xl border transition-all text-left
                  ${isUnlocked
                    ? 'bg-bg-secondary/80 border-white/10 hover:border-white/30 cursor-pointer'
                    : 'bg-bg-tertiary/50 border-white/5 cursor-not-allowed opacity-60'
                  }
                `}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-2xl z-10">
                    <span className="text-4xl opacity-60">🔒</span>
                  </div>
                )}

                {/* Level number badge */}
                <div
                  className={`
                    absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                    font-display font-bold text-sm
                    ${isUnlocked
                      ? `bg-${diffConfig.color} text-bg-primary`
                      : 'bg-bg-tertiary text-text-muted'
                    }
                  `}
                  style={isUnlocked ? {
                    boxShadow: `0 0 15px ${categoryConfig.glowColor}`,
                  } : {}}
                >
                  {level.id}
                </div>

                {/* Content */}
                <div className="pt-2">
                  {/* Difficulty icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{diffConfig.icon}</span>
                    <span className={`text-xs font-display font-bold text-${diffConfig.color}`}>
                      {diffConfig.label}
                    </span>
                  </div>

                  {/* Level name */}
                  <h3 className="font-display font-bold text-white text-sm mb-1 truncate">
                    {level.name}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{level.questionCount} Q</span>
                    <span>{level.timeLimit}s</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${star <= stars ? 'opacity-100' : 'opacity-30 grayscale'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* High score */}
                  {progress?.highScore ? (
                    <p className="text-neon-green text-xs mt-2 font-display">
                      Best: {progress.highScore.toLocaleString()}
                    </p>
                  ) : null}
                </div>

                {/* Unlock requirement hint */}
                {!isUnlocked && level.unlockRequirement && (
                  <p className="absolute -bottom-6 left-0 right-0 text-center text-text-muted text-xs">
                    Score {level.unlockRequirement.minScore} on Level {level.unlockRequirement.levelId}
                  </p>
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
        className="mt-8 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10 self-center"
      >
        ← Back to Categories
      </motion.button>
    </div>
  );
}
