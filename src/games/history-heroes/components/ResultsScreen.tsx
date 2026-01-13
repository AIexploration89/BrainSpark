import { motion } from 'framer-motion';
import type { GameResult, Level } from '../types';
import { HISTORICAL_ERAS, HISTORIAN_RANKS } from '../types';
import { useHistoryProgressStore } from '../stores/historyStore';
import { TimelineBackground } from './TimelineBackground';

interface ResultsScreenProps {
  results: GameResult;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
}: ResultsScreenProps) {
  const { historianStats } = useHistoryProgressStore();
  const eraConfig = HISTORICAL_ERAS.find(e => e.id === level.era);
  const rankInfo = HISTORIAN_RANKS[historianStats.historianRank];

  // Calculate stars
  const stars = results.accuracy >= 95 ? 3 : results.accuracy >= 80 ? 2 : results.accuracy >= 60 ? 1 : 0;

  // Determine result message
  const getResultMessage = () => {
    if (results.perfectRound) return { emoji: '🏆', text: 'PERFECT!', color: '#FFD700' };
    if (results.accuracy >= 95) return { emoji: '🌟', text: 'LEGENDARY!', color: '#FFE55C' };
    if (results.accuracy >= 80) return { emoji: '⭐', text: 'EXCELLENT!', color: '#00F5FF' };
    if (results.accuracy >= 60) return { emoji: '👍', text: 'GOOD JOB!', color: '#00FF88' };
    return { emoji: '📚', text: 'KEEP LEARNING!', color: '#8B5CF6' };
  };

  const resultMessage = getResultMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <TimelineBackground intensity="medium" era={level.era} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Results card */}
        <div className="bg-bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Header */}
          <div
            className="p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${eraConfig?.accentColor}20, transparent)`,
            }}
          >
            {/* Result emoji with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="text-8xl mb-4"
              style={{
                filter: `drop-shadow(0 0 40px ${resultMessage.color}60)`,
              }}
            >
              {resultMessage.emoji}
            </motion.div>

            {/* Result text */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-display font-black mb-2"
              style={{
                color: resultMessage.color,
                textShadow: `0 0 30px ${resultMessage.color}60`,
              }}
            >
              {resultMessage.text}
            </motion.h2>

            <p className="text-text-secondary">{level.name}</p>

            {/* Stars */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2 mt-4"
            >
              {[1, 2, 3].map((starNum, i) => (
                <motion.span
                  key={starNum}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: starNum <= stars ? 1 : 0.7, rotate: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
                  className={`text-4xl ${starNum <= stars ? 'text-neon-yellow' : 'text-white/20'}`}
                  style={starNum <= stars ? {
                    filter: 'drop-shadow(0 0 10px rgba(255,229,92,0.6))',
                  } : {}}
                >
                  ★
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Stats grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-bg-primary/50 rounded-xl p-4 text-center"
              >
                <p className="text-text-muted text-xs uppercase mb-1">Total Score</p>
                <p
                  className="text-3xl font-display font-black"
                  style={{ color: eraConfig?.accentColor }}
                >
                  {results.score.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="bg-bg-primary/50 rounded-xl p-4 text-center"
              >
                <p className="text-text-muted text-xs uppercase mb-1">Accuracy</p>
                <p className="text-3xl font-display font-black text-neon-green">
                  {Math.round(results.accuracy)}%
                </p>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-bg-primary/50 rounded-xl p-4 text-center"
              >
                <p className="text-text-muted text-xs uppercase mb-1">Correct</p>
                <p className="text-2xl font-display font-bold text-white">
                  {results.correctAnswers}/{results.totalQuestions}
                </p>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="bg-bg-primary/50 rounded-xl p-4 text-center"
              >
                <p className="text-text-muted text-xs uppercase mb-1">Best Streak</p>
                <p className="text-2xl font-display font-bold text-neon-orange">
                  {results.highestStreak}🔥
                </p>
              </motion.div>
            </div>

            {/* Bonus breakdown */}
            {(results.bonusPoints.streak > 0 ||
              results.bonusPoints.speed > 0 ||
              results.bonusPoints.perfect > 0 ||
              results.bonusPoints.noHints > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-neon-yellow/5 border border-neon-yellow/20 rounded-xl p-4 mb-6"
              >
                <h3 className="font-display font-bold text-neon-yellow text-sm mb-3">
                  ✨ Bonus Points
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {results.bonusPoints.streak > 0 && (
                    <div className="flex justify-between text-text-secondary">
                      <span>🔥 Streak Bonus</span>
                      <span className="text-neon-yellow">+{results.bonusPoints.streak}</span>
                    </div>
                  )}
                  {results.bonusPoints.speed > 0 && (
                    <div className="flex justify-between text-text-secondary">
                      <span>⚡ Speed Bonus</span>
                      <span className="text-neon-yellow">+{results.bonusPoints.speed}</span>
                    </div>
                  )}
                  {results.bonusPoints.perfect > 0 && (
                    <div className="flex justify-between text-text-secondary">
                      <span>🏆 Perfect Round</span>
                      <span className="text-neon-yellow">+{results.bonusPoints.perfect}</span>
                    </div>
                  )}
                  {results.bonusPoints.noHints > 0 && (
                    <div className="flex justify-between text-text-secondary">
                      <span>🧠 No Hints</span>
                      <span className="text-neon-yellow">+{results.bonusPoints.noHints}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Historian rank progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-3 mb-6 p-3 bg-bg-primary/30 rounded-xl"
            >
              <span className="text-3xl">{rankInfo.icon}</span>
              <div className="flex-1">
                <p className="text-text-muted text-xs">Historian Rank</p>
                <p className="font-display font-bold text-white">{rankInfo.label}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-xs">Topics Learned</p>
                <p className="font-display font-bold text-neon-cyan">
                  {historianStats.topicsLearned.length}
                </p>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              {stars >= 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNextLevel}
                  className="w-full py-3 rounded-xl font-display font-bold uppercase tracking-wider text-white"
                  style={{
                    background: `linear-gradient(135deg, ${eraConfig?.accentColor}, ${eraConfig?.accentColor}cc)`,
                    boxShadow: `0 0 30px ${eraConfig?.accentColor}40`,
                  }}
                >
                  📜 Next Level →
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-white/10 text-white hover:border-neon-orange/50 transition-colors"
              >
                🔄 Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBackToMenu}
                className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
              >
                ← Back to Levels
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Fun fact */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-text-muted text-sm"
        >
          📚 You've learned about {results.newTopicsLearned.length} new topic{results.newTopicsLearned.length !== 1 ? 's' : ''}!
        </motion.p>
      </motion.div>
    </div>
  );
}
