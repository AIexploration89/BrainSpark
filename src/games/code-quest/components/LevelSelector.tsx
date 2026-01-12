import { motion } from 'framer-motion';
import type { Level } from '../types';
import { CHAPTERS, getLevelsByChapter } from '../data/levels';
import { useCodeQuestProgressStore } from '../stores/codeQuestStore';
import { useState } from 'react';

interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export function LevelSelector({ onSelectLevel, onBack }: LevelSelectorProps) {
  const [selectedChapter, setSelectedChapter] = useState(1);
  const { getLevelProgress, isLevelUnlocked, getTotalStars } = useCodeQuestProgressStore();

  const totalStars = getTotalStars();
  const chapterLevels = getLevelsByChapter(selectedChapter);
  const currentChapter = CHAPTERS.find(c => c.id === selectedChapter);

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-green/50 transition-colors"
        >
          <span>←</span>
          <span className="font-display text-sm">Back</span>
        </motion.button>

        {/* Total stars */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-secondary border border-neon-yellow/30">
          <span className="text-lg">⭐</span>
          <span className="font-display font-bold text-neon-yellow">{totalStars}</span>
        </div>
      </div>

      {/* Chapter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CHAPTERS.map((chapter) => {
          const isSelected = selectedChapter === chapter.id;
          const chapterProgress = getLevelsByChapter(chapter.id)
            .filter(l => getLevelProgress(l.id)?.completed)
            .length;

          return (
            <motion.button
              key={chapter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !chapter.comingSoon && setSelectedChapter(chapter.id)}
              disabled={chapter.comingSoon}
              className={`
                relative flex items-center gap-2 px-4 py-3 rounded-xl
                font-display text-sm font-semibold
                transition-all whitespace-nowrap
                ${isSelected
                  ? 'bg-gradient-to-r text-white'
                  : chapter.comingSoon
                    ? 'bg-bg-secondary/50 text-text-muted cursor-not-allowed'
                    : 'bg-bg-secondary border border-white/10 text-text-secondary hover:border-white/30'
                }
              `}
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${chapter.color}40, ${chapter.color}20)`
                  : undefined,
                borderColor: isSelected ? `${chapter.color}50` : undefined,
                boxShadow: isSelected ? `0 0 20px ${chapter.color}30` : undefined,
              }}
            >
              <span className="text-xl">{chapter.icon}</span>
              <span>{chapter.name}</span>
              {!chapter.comingSoon && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: isSelected ? `${chapter.color}30` : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {chapterProgress}/{chapter.levels}
                </span>
              )}
              {chapter.comingSoon && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                  Soon
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Chapter info */}
      {currentChapter && (
        <motion.div
          key={selectedChapter}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-bg-secondary/50 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentChapter.color}30, ${currentChapter.color}10)`,
              }}
            >
              {currentChapter.icon}
            </div>
            <div>
              <h2 className="font-display font-bold text-white">
                Chapter {currentChapter.id}: {currentChapter.name}
              </h2>
              <p className="text-sm text-text-secondary">{currentChapter.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Levels grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {chapterLevels.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const unlocked = isLevelUnlocked(level.id);
            const stars = progress?.stars || 0;

            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={unlocked ? { scale: 1.05, y: -4 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`
                  relative flex flex-col items-center p-4 rounded-2xl
                  border transition-all
                  ${unlocked
                    ? 'bg-bg-secondary hover:bg-bg-tertiary border-white/10 hover:border-neon-green/50 cursor-pointer'
                    : 'bg-bg-secondary/50 border-white/5 cursor-not-allowed'
                  }
                `}
                style={{
                  boxShadow: unlocked && stars === 3
                    ? '0 0 20px rgba(255,255,0,0.2)'
                    : 'none',
                }}
              >
                {/* Level number */}
                <div
                  className={`
                    w-14 h-14 rounded-xl flex items-center justify-center
                    font-display text-2xl font-bold mb-2
                    ${unlocked
                      ? progress?.completed
                        ? 'bg-neon-green/20 text-neon-green'
                        : 'bg-bg-tertiary text-white'
                      : 'bg-bg-primary text-text-muted'
                    }
                  `}
                >
                  {unlocked ? level.id : '🔒'}
                </div>

                {/* Level name */}
                <span
                  className={`
                    text-sm font-semibold text-center line-clamp-2
                    ${unlocked ? 'text-white' : 'text-text-muted'}
                  `}
                >
                  {level.name}
                </span>

                {/* Stars */}
                {unlocked && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map((s) => (
                      <motion.span
                        key={s}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 * s }}
                        className={`text-lg ${s <= stars ? 'opacity-100' : 'opacity-30'}`}
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Difficulty badge */}
                {unlocked && (
                  <span
                    className={`
                      absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-mono
                      ${level.difficulty === 'beginner' ? 'bg-neon-green/20 text-neon-green' :
                        level.difficulty === 'easy' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          level.difficulty === 'medium' ? 'bg-neon-yellow/20 text-neon-yellow' :
                            level.difficulty === 'hard' ? 'bg-neon-orange/20 text-neon-orange' :
                              'bg-neon-red/20 text-neon-red'
                      }
                    `}
                  >
                    {level.difficulty}
                  </span>
                )}

                {/* Completed checkmark */}
                {progress?.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center"
                  >
                    <span className="text-sm">✓</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LevelSelector;
