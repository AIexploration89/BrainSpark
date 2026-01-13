import { motion } from 'framer-motion';
import type { ScienceCategory } from '../types';
import { SCIENCE_CATEGORIES } from '../types';
import { useScienceProgressStore } from '../stores/scienceStore';
import { LabBackground } from './LabBackground';

interface CategorySelectorProps {
  onSelectCategory: (category: ScienceCategory) => void;
  onBack: () => void;
}

export function CategorySelector({ onSelectCategory, onBack }: CategorySelectorProps) {
  const { getCategoryStars } = useScienceProgressStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <LabBackground intensity="medium" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Choose Your <span className="text-neon-cyan" style={{ textShadow: '0 0 20px rgba(0,245,255,0.5)' }}>Lab</span>
        </h1>
        <p className="text-text-secondary">Select a science category to explore</p>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full relative z-10">
        {SCIENCE_CATEGORIES.map((category, index) => {
          const stars = getCategoryStars(category.id);
          const maxStars = 18; // 6 levels × 3 stars

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.id)}
              className={`
                relative p-6 rounded-2xl border-2 text-left overflow-hidden
                bg-gradient-to-br ${category.gradient}
                border-${category.color}/30 hover:border-${category.color}/60
                transition-colors group
              `}
              style={{
                boxShadow: `0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle at 80% 80%, var(--${category.color}) 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                  }}
                >
                  {category.icon}
                </motion.div>

                {/* Title and description */}
                <h3 className="font-display font-bold text-xl text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-bg-primary/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stars / maxStars) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-${category.color} rounded-full`}
                      style={{
                        boxShadow: `0 0 10px var(--${category.color})`,
                      }}
                    />
                  </div>
                  <span className="text-neon-yellow text-sm font-display font-bold">
                    ⭐ {stars}/{maxStars}
                  </span>
                </div>

                {/* Topics preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {category.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-text-secondary capitalize"
                    >
                      {topic.replace('-', ' ')}
                    </span>
                  ))}
                  {category.topics.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-text-muted">
                      +{category.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow indicator */}
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-white/30 group-hover:text-white/60 transition-colors"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-8 px-6 py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Menu
      </motion.button>
    </div>
  );
}
