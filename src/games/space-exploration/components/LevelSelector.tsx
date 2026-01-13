import { motion } from 'framer-motion';
import type { Level, GameMode } from '../types';
import { QUIZ_LEVELS } from '../data/quizzes';
import { MISSIONS } from '../data/missions';
import { useSpaceProgressStore } from '../stores/spaceStore';

interface LevelSelectorProps {
  mode: GameMode;
  onSelectLevel: (level: Level) => void;
  onSelectMission?: (missionId: string) => void;
  onBack: () => void;
}

export function LevelSelector({
  mode,
  onSelectLevel,
  onSelectMission,
  onBack,
}: LevelSelectorProps) {
  const { progress, isLevelUnlocked, getLevelProgress } = useSpaceProgressStore();

  const levels = mode === 'quiz' ? QUIZ_LEVELS : [];
  const missions = mode === 'mission' ? MISSIONS : [];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 w-full max-w-4xl"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="absolute left-6 top-6 text-text-muted hover:text-white transition-colors font-display"
        >
          ← Back
        </motion.button>

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          {mode === 'quiz' ? '❓' : mode === 'mission' ? '🎯' : '🔭'}
        </motion.div>

        <h1 className="text-4xl font-display font-bold text-white mb-2">
          {mode === 'quiz'
            ? 'Space Quiz'
            : mode === 'mission'
            ? 'Space Missions'
            : 'Explore Planets'}
        </h1>
        <p className="text-text-secondary">
          {mode === 'quiz'
            ? 'Test your space knowledge!'
            : mode === 'mission'
            ? 'Complete objectives to earn stars!'
            : 'Discover facts about our solar system'}
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="text-neon-cyan font-display font-bold">
            ⭐ {progress.totalStars}
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-text-secondary capitalize">
            Rank: {progress.currentRank}
          </span>
        </div>
      </motion.div>

      {/* Levels/Missions grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-4xl"
      >
        {mode === 'quiz' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levels.map((level, index) => {
              const isUnlocked = isLevelUnlocked(level.id);
              const levelProgress = getLevelProgress(level.id);

              return (
                <LevelCard
                  key={level.id}
                  level={level}
                  index={index}
                  isUnlocked={isUnlocked}
                  bestStars={levelProgress?.bestStars || 0}
                  highScore={levelProgress?.highScore || 0}
                  onClick={() => isUnlocked && onSelectLevel(level)}
                  totalStars={progress.totalStars}
                />
              );
            })}
          </div>
        )}

        {mode === 'mission' && onSelectMission && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map((mission, index) => {
              const isUnlocked = (mission.unlockRequirement ?? 0) <= progress.totalStars;
              const isCompleted = progress.missionsCompleted.includes(mission.id);

              return (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index}
                  isUnlocked={isUnlocked}
                  isCompleted={isCompleted}
                  onClick={() => isUnlocked && onSelectMission(mission.id)}
                  totalStars={progress.totalStars}
                />
              );
            })}
          </div>
        )}

        {mode === 'explore' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLevel({
              id: 'explore-free',
              name: 'Free Exploration',
              description: 'Explore the solar system at your own pace',
              mode: 'explore',
              difficulty: 'beginner',
              planets: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
              unlockRequirement: 0,
            })}
            className="w-full p-8 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border-2 border-neon-purple/40 hover:border-neon-purple transition-colors"
          >
            <div className="flex items-center gap-6">
              <span className="text-6xl">🌌</span>
              <div className="text-left">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Start Exploring
                </h3>
                <p className="text-text-secondary">
                  Visit planets, discover facts, and learn about our amazing solar system!
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-sm rounded-full">
                    {progress.planetsUnlocked.length} planets unlocked
                  </span>
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-sm rounded-full">
                    {progress.allFactsDiscovered.length} facts discovered
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

interface LevelCardProps {
  level: Level;
  index: number;
  isUnlocked: boolean;
  bestStars: number;
  highScore: number;
  onClick: () => void;
  totalStars: number;
}

function LevelCard({
  level,
  index,
  isUnlocked,
  bestStars,
  highScore,
  onClick,
  totalStars,
}: LevelCardProps) {
  const difficultyColors = {
    beginner: 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
    explorer: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30',
    astronaut: 'from-neon-orange/20 to-neon-orange/5 border-neon-orange/30',
    commander: 'from-neon-red/20 to-neon-red/5 border-neon-red/30',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!isUnlocked}
      className={`
        relative p-6 rounded-2xl border-2 text-left transition-all
        bg-gradient-to-br ${difficultyColors[level.difficulty]}
        ${isUnlocked ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-2xl backdrop-blur-sm z-10">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <p className="text-sm text-text-muted mt-2">
              Unlock at {level.unlockRequirement} ⭐
            </p>
            <p className="text-xs text-text-muted">
              ({level.unlockRequirement - totalStars} more needed)
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-display font-bold text-white">
          {level.name}
        </h3>
        <span className={`
          px-2 py-1 text-xs font-display uppercase rounded-full
          ${getDifficultyStyle(level.difficulty)}
        `}>
          {level.difficulty}
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {level.description}
      </p>

      <div className="flex items-center justify-between">
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= bestStars ? 'text-yellow-400' : 'text-white/20'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {level.questionsCount && (
            <span>{level.questionsCount} questions</span>
          )}
          {level.timeLimit && (
            <span>⏱ {Math.floor(level.timeLimit / 60)}min</span>
          )}
        </div>
      </div>

      {highScore > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-text-muted">
          Best: {highScore.toLocaleString()} pts
        </div>
      )}
    </motion.button>
  );
}

interface MissionCardProps {
  mission: typeof MISSIONS[0];
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
  totalStars: number;
}

function MissionCard({
  mission,
  index,
  isUnlocked,
  isCompleted,
  onClick,
  totalStars,
}: MissionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!isUnlocked}
      className={`
        relative p-6 rounded-2xl border-2 text-left transition-all
        ${isCompleted
          ? 'bg-gradient-to-br from-neon-green/20 to-neon-green/5 border-neon-green/40'
          : 'bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 border-neon-purple/40'
        }
        ${isUnlocked ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-2xl backdrop-blur-sm z-10">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <p className="text-sm text-text-muted mt-2">
              Unlock at {mission.unlockRequirement} ⭐
            </p>
          </div>
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.5)]">
          <span className="text-sm">✓</span>
        </div>
      )}

      <h3 className="text-lg font-display font-bold text-white mb-2 pr-10">
        {mission.name}
      </h3>
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {mission.description}
      </p>

      {/* Objectives preview */}
      <div className="space-y-1 mb-4">
        {mission.objectives.slice(0, 3).map((obj) => (
          <div key={obj.id} className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
              {obj.isCompleted ? '✓' : '○'}
            </span>
            <span className="line-clamp-1">{obj.description}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className={`
          px-2 py-1 text-xs font-display uppercase rounded-full
          ${getDifficultyStyle(mission.difficulty)}
        `}>
          {mission.difficulty}
        </span>
        <span className="text-neon-cyan font-display font-bold">
          +{mission.reward} ⭐
        </span>
      </div>
    </motion.button>
  );
}

function getDifficultyStyle(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-neon-green/20 text-neon-green';
    case 'explorer':
      return 'bg-neon-cyan/20 text-neon-cyan';
    case 'astronaut':
      return 'bg-neon-orange/20 text-neon-orange';
    case 'commander':
      return 'bg-neon-red/20 text-neon-red';
    default:
      return 'bg-white/20 text-white';
  }
}

export default LevelSelector;
