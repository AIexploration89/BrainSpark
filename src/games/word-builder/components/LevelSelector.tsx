import { motion } from 'framer-motion';
import type { Level, WordCategory } from '../types';
import { CATEGORIES, DIFFICULTY_CONFIG } from '../types';
import { getLevelsByCategory, CATEGORY_COLORS } from '../data/levels';
import { useWordBuilderProgressStore } from '../stores/wordBuilderStore';

// Category Selector
interface CategorySelectorProps {
  onSelectCategory: (category: WordCategory) => void;
  onBack: () => void;
}

export function CategorySelector({ onSelectCategory, onBack }: CategorySelectorProps) {
  const { getCategoryStars } = useWordBuilderProgressStore();

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-orange/50 transition-colors"
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Choose Category</h2>
          <p className="text-text-secondary text-sm">Pick a word category to practice</p>
        </div>
      </motion.div>

      {/* Categories grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {CATEGORIES.map((category, index) => {
            const stars = getCategoryStars(category.id);
            const maxStars = 15; // 5 levels × 3 stars
            const colors = CATEGORY_COLORS[category.id];

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  relative p-6 rounded-2xl text-left overflow-hidden
                  bg-gradient-to-br from-${colors.primary}/20 to-${colors.secondary}/10
                  border-2 border-${colors.primary}/30
                  hover:border-${colors.primary}/60
                  transition-all duration-300
                  group
                `}
                style={{
                  boxShadow: `0 4px 20px ${colors.glow.replace('0.5', '0.2')}`,
                }}
              >
                {/* Animated background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br from-${colors.primary}/30 to-transparent`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-5xl mb-3"
                >
                  {category.icon}
                </motion.div>

                {/* Category name */}
                <h3 className={`text-xl font-display font-bold text-white mb-1`}>
                  {category.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {category.description}
                </p>

                {/* Stars progress */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star * 3 <= stars ? 'text-yellow-400' : 'text-white/20'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-text-muted">
                    {stars}/{maxStars}
                  </span>
                </div>

                {/* Arrow indicator */}
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-white/60 text-xl"
                >
                  →
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fun fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-text-muted text-sm mt-8"
      >
        Reading for 20 minutes a day exposes you to 1.8 million words per year!
      </motion.div>
    </div>
  );
}

// Level Selector
interface LevelSelectorProps {
  category: WordCategory;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ category, onSelectLevel, onBack }: LevelSelectorProps) {
  const { getLevelProgress, isLevelUnlocked } = useWordBuilderProgressStore();
  const levels = getLevelsByCategory(category);
  const categoryConfig = CATEGORIES.find(c => c.id === category);
  const colors = CATEGORY_COLORS[category];

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white transition-colors"
        >
          ←
        </motion.button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{categoryConfig?.icon}</span>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">{categoryConfig?.name}</h2>
            <p className="text-text-secondary text-sm">Select a level to play</p>
          </div>
        </div>
      </motion.div>

      {/* Fun fact banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mb-6 p-4 rounded-xl bg-gradient-to-r from-${colors.primary}/20 to-transparent border border-${colors.primary}/30`}
      >
        <p className="text-sm text-text-secondary">
          <span className="text-yellow-400 mr-2">💡</span>
          {categoryConfig?.funFact}
        </p>
      </motion.div>

      {/* Levels grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
                whileHover={isUnlocked ? { scale: 1.03, y: -2 } : undefined}
                whileTap={isUnlocked ? { scale: 0.98 } : undefined}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  relative p-5 rounded-2xl text-left
                  ${isUnlocked
                    ? `bg-bg-secondary/80 border-2 border-${colors.primary}/30 hover:border-${colors.primary}/60`
                    : 'bg-bg-secondary/40 border-2 border-white/10'
                  }
                  transition-all duration-300
                  ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-2xl backdrop-blur-sm z-10">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      🔒
                    </motion.div>
                  </div>
                )}

                {/* Level number badge */}
                <div className={`
                  absolute top-3 right-3
                  w-8 h-8 rounded-full
                  flex items-center justify-center
                  font-display font-bold text-sm
                  ${isUnlocked
                    ? `bg-${colors.primary}/20 text-${colors.primary} border border-${colors.primary}/40`
                    : 'bg-white/10 text-white/30 border border-white/10'
                  }
                `}>
                  {level.id}
                </div>

                {/* Level info */}
                <h3 className={`text-lg font-display font-bold mb-1 pr-10 ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                  {level.name}
                </h3>
                <p className={`text-sm mb-3 ${isUnlocked ? 'text-text-secondary' : 'text-white/30'}`}>
                  {level.description}
                </p>

                {/* Difficulty badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-display font-semibold uppercase
                    bg-${diffConfig.color}/20 text-${diffConfig.color} border border-${diffConfig.color}/40
                  `}>
                    {diffConfig.label}
                  </span>
                  <span className="text-xs text-text-muted">
                    {level.wordLength.min}-{level.wordLength.max} letters
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${star <= stars ? 'text-yellow-400' : 'text-white/20'}`}
                        style={{
                          filter: star <= stars ? 'drop-shadow(0 0 4px gold)' : 'none',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {progress?.highScore ? (
                    <span className="text-xs text-text-muted">
                      Best: {progress.highScore.toLocaleString()}
                    </span>
                  ) : null}
                </div>

                {/* Info row */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10 text-xs text-text-muted">
                  <span>{level.wordCount} words</span>
                  {level.timeLimit > 0 && <span>{level.timeLimit}s/word</span>}
                  <span>{level.hintsAllowed} hints</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-bg-secondary/50 rounded-xl border border-white/10 max-w-md mx-auto text-center"
      >
        <p className="text-text-secondary text-sm">
          Complete levels with at least 60% accuracy to unlock the next one!
        </p>
      </motion.div>
    </div>
  );
}
