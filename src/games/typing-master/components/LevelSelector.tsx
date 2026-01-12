import { motion } from 'framer-motion';
import type { TypingLevel, LevelProgress } from '../types';
import { typingLevels } from '../data/levels';
import { useTypingProgressStore } from '../stores/typingStore';

interface LevelSelectorProps {
  onSelectLevel: (level: TypingLevel) => void;
  onBack: () => void;
}

export function LevelSelector({ onSelectLevel, onBack }: LevelSelectorProps) {
  const { isLevelUnlocked, getLevelProgress } = useTypingProgressStore();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Select Level</h2>
          <p className="text-text-secondary text-sm">Choose your challenge</p>
        </div>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {typingLevels.map((level, index) => {
          const isUnlocked = isLevelUnlocked(level.id);
          const progress = getLevelProgress(level.id);

          return (
            <LevelCard
              key={level.id}
              level={level}
              isUnlocked={isUnlocked}
              progress={progress}
              index={index}
              onSelect={() => isUnlocked && onSelectLevel(level)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface LevelCardProps {
  level: TypingLevel;
  isUnlocked: boolean;
  progress: LevelProgress | null;
  index: number;
  onSelect: () => void;
}

const difficultyColors = {
  easy: 'text-neon-green border-neon-green/30',
  medium: 'text-neon-orange border-neon-orange/30',
  hard: 'text-neon-red border-neon-red/30',
};

const levelIcons = ['🔤', '🏠', '⬆️', '⬇️', '🔢', '✏️', '📝', '📖'];

function LevelCard({ level, isUnlocked, progress, index, onSelect }: LevelCardProps) {
  const completionPercent = progress?.completed ? 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
      onClick={onSelect}
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-300
        ${isUnlocked
          ? 'bg-bg-card cursor-pointer border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]'
          : 'bg-bg-card/50 cursor-not-allowed border-white/5 opacity-60'
        }
      `}
    >
      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 rounded-xl backdrop-blur-sm">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      {/* Level number badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center rounded-full bg-bg-primary border-2 border-neon-cyan text-neon-cyan font-display font-bold text-sm">
        {level.id}
      </div>

      {/* Completed badge */}
      {progress?.completed && (
        <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-neon-green text-bg-primary text-lg">
          ✓
        </div>
      )}

      {/* Icon */}
      <div className="text-4xl mb-3">{levelIcons[index]}</div>

      {/* Name */}
      <h3 className="font-display font-bold text-white mb-1">{level.name}</h3>

      {/* Description */}
      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{level.description}</p>

      {/* Meta info */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[level.difficulty]}`}>
          {level.difficulty}
        </span>
        <span className="text-xs text-text-muted">Ages {level.ageRange}</span>
      </div>

      {/* Progress bar */}
      {isUnlocked && (
        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
          />
        </div>
      )}

      {/* Best stats */}
      {progress && (
        <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
          <span>Best: {progress.bestWpm} WPM</span>
          <span>•</span>
          <span>{progress.bestAccuracy}%</span>
        </div>
      )}

      {/* Requirements hint for locked levels */}
      {!isUnlocked && level.requirements && (
        <div className="mt-3 text-xs text-text-muted">
          Complete Level {level.requirements.level} with {level.requirements.accuracy}% accuracy
        </div>
      )}
    </motion.div>
  );
}
