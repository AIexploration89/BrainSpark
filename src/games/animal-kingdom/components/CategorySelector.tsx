import { motion } from 'framer-motion';
import type { AnimalCategory } from '../types';
import { ANIMAL_CATEGORIES } from '../types';
import { useAnimalProgressStore } from '../stores/animalStore';
import { JungleBackground } from './JungleBackground';

interface CategorySelectorProps {
  onSelectCategory: (category: AnimalCategory) => void;
  onBack: () => void;
}

export function CategorySelector({ onSelectCategory, onBack }: CategorySelectorProps) {
  const { getCategoryStars } = useAnimalProgressStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <JungleBackground intensity="medium" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <motion.span
          className="text-6xl inline-block mb-4"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌍
        </motion.span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Choose Your <span className="text-neon-green" style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>Kingdom</span>
        </h2>
        <p className="text-text-secondary max-w-md">
          Explore different animal categories and become a wildlife expert!
        </p>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full relative z-10"
      >
        {ANIMAL_CATEGORIES.map((category, index) => {
          const stars = getCategoryStars(category.id);
          const maxStars = 18; // 6 levels * 3 stars

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.id)}
              className="relative group bg-bg-secondary/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left transition-all hover:border-white/20"
              style={{
                boxShadow: `0 0 0 rgba(${category.color === 'neon-orange' ? '255,107,53' : category.color === 'neon-cyan' ? '0,245,255' : category.color === 'neon-purple' ? '139,92,246' : '0,255,136'},0)`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${category.glowColor} 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-3">
                  <motion.span
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    style={{
                      filter: `drop-shadow(0 0 20px ${category.glowColor})`,
                    }}
                  >
                    {category.icon}
                  </motion.span>

                  {/* Star progress */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-neon-yellow">
                      <span className="text-sm">⭐</span>
                      <span className="font-display font-bold">{stars}/{maxStars}</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <h3 className={`font-display font-bold text-xl text-white mb-1`}>
                  {category.name}
                </h3>
                <p className="text-text-secondary text-sm mb-3">
                  {category.description}
                </p>

                {/* Animal count */}
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-xs">
                    {category.animalCount}+ animals to discover
                  </span>
                  <motion.span
                    className={`text-${category.color} text-sm font-display font-bold`}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Explore →
                  </motion.span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-tertiary rounded-b-2xl overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stars / maxStars) * 100}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className={`h-full bg-${category.color}`}
                  style={{
                    boxShadow: `0 0 10px ${category.glowColor}`,
                  }}
                />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-8 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Menu
      </motion.button>
    </div>
  );
}
