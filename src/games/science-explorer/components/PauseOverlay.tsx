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
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pause-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-neon-purple" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pause-grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative max-w-md w-full mx-4 bg-bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Pause icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6"
        >
          <span className="text-7xl inline-block">⏸️</span>
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-white text-center mb-2">
          Experiment Paused
        </h2>
        {levelName && (
          <p className="text-center text-text-secondary mb-6">{levelName}</p>
        )}

        {/* Current progress */}
        <div className="bg-bg-primary/50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-text-muted text-xs uppercase mb-1">Score</p>
              <p className="font-display font-bold text-xl text-neon-green">
                {currentScore.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase mb-1">Progress</p>
              <p className="font-display font-bold text-xl text-neon-cyan">
                {questionsAnswered}/{totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase mb-1">Accuracy</p>
              <p className="font-display font-bold text-xl text-neon-purple">
                {questionsAnswered > 0 ? `${Math.round((currentScore / (questionsAnswered * 100)) * 100)}%` : '--'}
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
            className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_50px_rgba(0,245,255,0.6)] transition-all"
          >
            ▶️ Resume Experiment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 transition-all"
          >
            🔄 Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/5 transition-all"
          >
            🚪 Quit to Menu
          </motion.button>
        </div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-text-muted text-sm"
        >
          💡 Press <kbd className="px-2 py-1 bg-bg-primary rounded text-neon-purple font-mono">Esc</kbd> to resume
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
