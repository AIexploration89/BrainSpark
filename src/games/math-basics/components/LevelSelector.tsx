import { motion } from 'framer-motion';
import type { Level, Operation } from '../types';
import { DIFFICULTY_CONFIG } from '../types';
import { getLevelsByOperation } from '../data/levels';
import { useMathProgressStore } from '../stores/mathStore';

// Static Tailwind class maps to avoid dynamic template literals (JIT won't detect them)
const textColorMap: Record<string, string> = {
  'neon-green': 'text-neon-green',
  'neon-cyan': 'text-neon-cyan',
  'neon-orange': 'text-neon-orange',
  'neon-pink': 'text-neon-pink',
  'neon-purple': 'text-neon-purple',
  'neon-red': 'text-neon-red',
};

const borderColorMap: Record<string, string> = {
  'neon-green': 'border-neon-green/30',
  'neon-cyan': 'border-neon-cyan/30',
  'neon-orange': 'border-neon-orange/30',
  'neon-pink': 'border-neon-pink/30',
  'neon-purple': 'border-neon-purple/30',
  'neon-red': 'border-neon-red/30',
};

const borderHoverColorMap: Record<string, string> = {
  'neon-green': 'hover:border-neon-green/60',
  'neon-cyan': 'hover:border-neon-cyan/60',
  'neon-orange': 'hover:border-neon-orange/60',
  'neon-pink': 'hover:border-neon-pink/60',
  'neon-purple': 'hover:border-neon-purple/60',
  'neon-red': 'hover:border-neon-red/60',
};

const bgOpacity20Map: Record<string, string> = {
  'neon-green': 'bg-neon-green/20',
  'neon-cyan': 'bg-neon-cyan/20',
  'neon-orange': 'bg-neon-orange/20',
  'neon-pink': 'bg-neon-pink/20',
  'neon-purple': 'bg-neon-purple/20',
  'neon-red': 'bg-neon-red/20',
};

const borderOpacity50Map: Record<string, string> = {
  'neon-green': 'border-neon-green/50',
  'neon-cyan': 'border-neon-cyan/50',
  'neon-orange': 'border-neon-orange/50',
  'neon-pink': 'border-neon-pink/50',
  'neon-purple': 'border-neon-purple/50',
  'neon-red': 'border-neon-red/50',
};

const borderFullColorMap: Record<string, string> = {
  'neon-green': 'hover:border-neon-green',
  'neon-cyan': 'hover:border-neon-cyan',
  'neon-orange': 'hover:border-neon-orange',
  'neon-pink': 'hover:border-neon-pink',
  'neon-purple': 'hover:border-neon-purple',
  'neon-red': 'hover:border-neon-red',
};

const gradientFromMap: Record<string, string> = {
  'neon-green': 'from-neon-green/20',
  'neon-cyan': 'from-neon-cyan/20',
  'neon-orange': 'from-neon-orange/20',
  'neon-pink': 'from-neon-pink/20',
  'neon-purple': 'from-neon-purple/20',
  'neon-red': 'from-neon-red/20',
};

const gradientToMap: Record<string, string> = {
  'neon-green': 'to-neon-green/5',
  'neon-cyan': 'to-neon-cyan/5',
  'neon-orange': 'to-neon-orange/5',
  'neon-pink': 'to-neon-pink/5',
  'neon-purple': 'to-neon-purple/5',
  'neon-red': 'to-neon-red/5',
};

const progressFromMap: Record<string, string> = {
  'neon-green': 'from-neon-green/50',
  'neon-cyan': 'from-neon-cyan/50',
  'neon-orange': 'from-neon-orange/50',
  'neon-pink': 'from-neon-pink/50',
  'neon-purple': 'from-neon-purple/50',
  'neon-red': 'from-neon-red/50',
};

const progressToMap: Record<string, string> = {
  'neon-green': 'to-neon-green',
  'neon-cyan': 'to-neon-cyan',
  'neon-orange': 'to-neon-orange',
  'neon-pink': 'to-neon-pink',
  'neon-purple': 'to-neon-purple',
  'neon-red': 'to-neon-red',
};

interface LevelSelectorProps {
  operation: Operation;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const operationConfig: Record<Operation, { name: string; icon: string; color: string }> = {
  addition: { name: 'Addition', icon: '➕', color: 'neon-green' },
  subtraction: { name: 'Subtraction', icon: '➖', color: 'neon-cyan' },
  multiplication: { name: 'Multiplication', icon: '✖️', color: 'neon-orange' },
  division: { name: 'Division', icon: '➗', color: 'neon-pink' },
  mixed: { name: 'Mixed', icon: '🎲', color: 'neon-purple' },
};

export function LevelSelector({ operation, onSelectLevel, onBack }: LevelSelectorProps) {
  const levels = getLevelsByOperation(operation);
  const { getLevelProgress, isLevelUnlocked } = useMathProgressStore();
  const config = operationConfig[operation];

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-green/50 transition-colors"
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <span>{config.icon}</span>
            <span className={textColorMap[config.color] || 'text-white'}>{config.name}</span>
          </h2>
          <p className="text-text-muted text-sm">Choose your level</p>
        </div>
      </motion.div>

      {/* Levels grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {levels.map((level, i) => {
            const progress = getLevelProgress(level.id);
            const isUnlocked = isLevelUnlocked(level.id);
            const stars = progress?.stars || 0;
            const diffConfig = DIFFICULTY_CONFIG[level.difficulty];

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                onClick={() => isUnlocked && onSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${isUnlocked
                    ? `bg-bg-secondary/80 ${borderColorMap[config.color] || 'border-white/30'} ${borderHoverColorMap[config.color] || 'hover:border-white/60'} cursor-pointer`
                    : 'bg-bg-secondary/40 border-white/10 cursor-not-allowed opacity-60'
                  }
                `}
                style={{
                  boxShadow: isUnlocked && stars > 0
                    ? `0 0 20px var(--color-${config.color})`
                    : 'none',
                }}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-xl backdrop-blur-sm z-10">
                    <div className="text-center">
                      <span className="text-3xl">🔒</span>
                      <p className="text-xs text-text-muted mt-1">
                        Score {level.unlockRequirement?.minScore} in Level {level.unlockRequirement?.levelId}
                      </p>
                    </div>
                  </div>
                )}

                {/* Level number badge */}
                <div className={`
                  absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                  font-display font-bold text-sm
                  ${isUnlocked
                    ? `${bgOpacity20Map[config.color] || 'bg-white/20'} ${textColorMap[config.color] || 'text-white'} border ${borderOpacity50Map[config.color] || 'border-white/50'}`
                    : 'bg-bg-tertiary text-text-muted border border-white/10'
                  }
                `}>
                  {levels.indexOf(level) + 1}
                </div>

                {/* Stars */}
                <div className="flex justify-end gap-0.5 mb-2">
                  {[1, 2, 3].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${star <= stars ? 'text-yellow-400' : 'text-white/20'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Level info */}
                <h3 className="font-display font-bold text-white mb-1">
                  {level.name}
                </h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {level.description}
                </p>

                {/* Level details */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`
                    px-2 py-0.5 rounded-full font-display uppercase
                    ${bgOpacity20Map[diffConfig.color] || 'bg-white/20'} ${textColorMap[diffConfig.color] || 'text-white'}
                  `}>
                    {diffConfig.label}
                  </span>
                  <div className="flex items-center gap-2 text-text-muted">
                    <span>{level.problemCount} problems</span>
                    {level.timeLimit > 0 && (
                      <span className="text-neon-orange">⏱ {level.timeLimit}s</span>
                    )}
                  </div>
                </div>

                {/* High score */}
                {progress && progress.highScore > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-text-muted">Best Score</span>
                    <span className={`font-display font-bold ${textColorMap[config.color] || 'text-white'}`}>
                      {progress.highScore.toLocaleString()}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex justify-center gap-6 text-xs text-text-muted"
      >
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">★★★</span>
          <span>= 95%+ accuracy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">★★</span>
          <span>= 80%+ accuracy</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span>= 60%+ accuracy</span>
        </div>
      </motion.div>
    </div>
  );
}

// Operation selector component
interface OperationSelectorProps {
  onSelectOperation: (operation: Operation) => void;
  onBack: () => void;
}

export function OperationSelector({ onSelectOperation, onBack }: OperationSelectorProps) {
  const { getOperationStars } = useMathProgressStore();

  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(0,255,136,0.1), transparent)',
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Choose Your <span className="text-neon-green" style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>Challenge</span>
        </h2>
        <p className="text-text-secondary">
          Select a math operation to practice
        </p>
      </motion.div>

      {/* Operations grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl relative z-10"
      >
        {operations.map((op, i) => {
          const config = operationConfig[op];
          const stars = getOperationStars(op);
          const maxStars = op === 'mixed' ? 12 : 15; // 4 mixed levels × 3, others 5 levels × 3

          return (
            <motion.button
              key={op}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectOperation(op)}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                bg-gradient-to-br ${gradientFromMap[config.color] || 'from-white/20'} ${gradientToMap[config.color] || 'to-white/5'}
                ${borderColorMap[config.color] || 'border-white/30'} ${borderFullColorMap[config.color] || 'hover:border-white'}
              `}
              style={{
                boxShadow: `0 0 30px var(--color-${config.color})`,
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="text-4xl mb-3"
              >
                {config.icon}
              </motion.div>

              {/* Name */}
              <h3 className={`text-xl font-display font-bold ${textColorMap[config.color] || 'text-white'} mb-1`}>
                {config.name}
              </h3>

              {/* Progress */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stars / maxStars) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${progressFromMap[config.color] || 'from-white/50'} ${progressToMap[config.color] || 'to-white'} rounded-full`}
                  />
                </div>
                <span className="text-sm text-text-muted">
                  <span className="text-yellow-400">★</span> {stars}/{maxStars}
                </span>
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
