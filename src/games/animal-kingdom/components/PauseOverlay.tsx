import { motion } from 'framer-motion';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  levelName?: string;
  currentScore: number;
  questionsAnswered: number;
  totalQuestions: number;
}

export function PauseOverlay({
  onResume,
  onRestart,
  onQuit,
  levelName,
  currentScore,
  questionsAnswered,
  totalQuestions,
}: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-bg-secondary/90 border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(0,255,136,0.1), 0 0 120px rgba(0,255,136,0.05)',
        }}
      >
        {/* Paused Icon */}
        <div className="text-center mb-6">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block text-7xl mb-4"
          >
            😴
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white">Game Paused</h2>
          {levelName && (
            <p className="text-text-secondary mt-2">{levelName}</p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-bg-tertiary/50 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Score</p>
              <p className="font-display font-bold text-2xl text-neon-green">
                {currentScore.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Progress</p>
              <p className="font-display font-bold text-2xl text-neon-cyan">
                {questionsAnswered}/{totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-neon-cyan text-bg-primary shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] transition-all flex items-center justify-center gap-3"
          >
            <span>▶</span> Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover:border-neon-orange/50 transition-all flex items-center justify-center gap-3"
          >
            <span>🔄</span> Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-3"
          >
            <span>🚪</span> Exit to Menu
          </motion.button>
        </div>

        {/* Hint */}
        <p className="text-center text-text-muted text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-neon-cyan font-mono">Esc</kbd> to resume
        </p>
      </motion.div>
    </motion.div>
  );
}
