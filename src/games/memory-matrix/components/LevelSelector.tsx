import { motion } from 'framer-motion';
import { levels } from '../data/levels';
import { useMemoryProgressStore } from '../stores/memoryStore';
import type { Level, Difficulty } from '../types';

interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

const difficultyColors: Record<Difficulty, { bg: string; text: string; border: string; glow: string }> = {
  easy: {
    bg: 'from-neon-green/20 to-emerald-600/10',
    text: 'text-neon-green',
    border: 'border-neon-green/30',
    glow: 'hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]',
  },
  medium: {
    bg: 'from-neon-cyan/20 to-sky-600/10',
    text: 'text-neon-cyan',
    border: 'border-neon-cyan/30',
    glow: 'hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]',
  },
  hard: {
    bg: 'from-neon-orange/20 to-amber-600/10',
    text: 'text-neon-orange',
    border: 'border-neon-orange/30',
    glow: 'hover:shadow-[0_0_25px_rgba(255,136,0,0.3)]',
  },
  extreme: {
    bg: 'from-neon-pink/20 to-fuchsia-600/10',
    text: 'text-neon-pink',
    border: 'border-neon-pink/30',
    glow: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.3)]',
  },
};

const difficultyEmoji: Record<Difficulty, string> = {
  easy: '🌟',
  medium: '⚡',
  hard: '🔥',
  extreme: '💎',
};

export function LevelSelector({ onSelectLevel, onBack }: LevelSelectorProps) {
  const { isLevelUnlocked, getLevelProgress } = useMemoryProgressStore();

  // Group levels by difficulty
  const levelsByDifficulty = levels.reduce((acc, level) => {
    if (!acc[level.difficulty]) {
      acc[level.difficulty] = [];
    }
    acc[level.difficulty].push(level);
    return acc;
  }, {} as Record<Difficulty, Level[]>);

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'extreme'];

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
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
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-pink/50 transition-all"
        >
          ←
        </motion.button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Select Level
          </h1>
          <p className="text-text-secondary text-sm">
            Choose your challenge
          </p>
        </div>
      </motion.div>

      {/* Level sections by difficulty */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-8">
        {difficulties.map((difficulty, sectionIndex) => {
          const diffLevels = levelsByDifficulty[difficulty] || [];
          if (diffLevels.length === 0) return null;

          const colors = difficultyColors[difficulty];
          const emoji = difficultyEmoji[difficulty];

          return (
            <motion.section
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{emoji}</span>
                <h2 className={`text-xl font-display font-bold capitalize ${colors.text}`}>
                  {difficulty}
                </h2>
                <div className={`flex-1 h-px bg-gradient-to-r ${colors.bg}`} />
              </div>

              {/* Level cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {diffLevels.map((level, levelIndex) => {
                  const unlocked = isLevelUnlocked(level.id);
                  const progress = getLevelProgress(level.id);

                  return (
                    <LevelCard
                      key={level.id}
                      level={level}
                      unlocked={unlocked}
                      highScore={progress?.highScore || 0}
                      bestAccuracy={progress?.bestAccuracy || 0}
                      timesCompleted={progress?.timesCompleted || 0}
                      onSelect={onSelectLevel}
                      colors={colors}
                      delay={sectionIndex * 0.1 + levelIndex * 0.05}
                    />
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

interface LevelCardProps {
  level: Level;
  unlocked: boolean;
  highScore: number;
  bestAccuracy: number;
  timesCompleted: number;
  onSelect: (level: Level) => void;
  colors: typeof difficultyColors[Difficulty];
  delay: number;
}

function LevelCard({
  level,
  unlocked,
  highScore,
  bestAccuracy,
  timesCompleted,
  onSelect,
  colors,
  delay,
}: LevelCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={unlocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={() => unlocked && onSelect(level)}
      disabled={!unlocked}
      className={`
        relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-300
        bg-gradient-to-br ${colors.bg}
        border ${colors.border}
        ${unlocked ? colors.glow : 'opacity-50 cursor-not-allowed grayscale'}
        ${unlocked ? 'hover:border-opacity-60' : ''}
      `}
    >
      {/* Lock overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div className="text-center">
            <span className="text-3xl">🔒</span>
            <p className="text-xs text-text-muted mt-1">
              Need {level.unlockRequirement}% on previous
            </p>
          </div>
        </div>
      )}

      {/* Level number badge */}
      <div className={`
        absolute -top-2 -right-2 w-8 h-8 rounded-full
        flex items-center justify-center
        font-display font-bold text-sm
        bg-bg-primary border-2 ${colors.border} ${colors.text}
      `}>
        {level.id}
      </div>

      {/* Level info */}
      <h3 className="font-display font-bold text-white mb-1 pr-6">
        {level.name}
      </h3>
      <p className="text-text-secondary text-sm mb-3">
        {level.description}
      </p>

      {/* Level details */}
      <div className="flex gap-4 text-xs text-text-muted mb-3">
        <span className="flex items-center gap-1">
          <span className="text-lg">⊞</span>
          {level.gridSize}×{level.gridSize}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-lg">◆</span>
          {level.patternLength} cells
        </span>
      </div>

      {/* Progress stats */}
      {unlocked && timesCompleted > 0 && (
        <div className="flex gap-3 pt-3 border-t border-white/10">
          <div>
            <p className="text-xs text-text-muted">Best</p>
            <p className={`font-display font-bold ${colors.text}`}>
              {highScore.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Accuracy</p>
            <p className={`font-display font-bold ${colors.text}`}>
              {Math.round(bestAccuracy)}%
            </p>
          </div>
        </div>
      )}

      {/* First time badge */}
      {unlocked && timesCompleted === 0 && (
        <div className="pt-3 border-t border-white/10">
          <span className="text-xs text-neon-yellow font-display uppercase tracking-wider">
            ✨ New Challenge
          </span>
        </div>
      )}
    </motion.button>
  );
}
