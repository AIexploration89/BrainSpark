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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
        >
          <div className="absolute inset-0 border border-neon-cyan/30 rounded-full" />
          <div className="absolute inset-8 border border-neon-pink/30 rounded-full" />
          <div className="absolute inset-16 border border-neon-green/30 rounded-full" />
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-md w-full mx-4"
      >
        {/* Card */}
        <div className="bg-bg-secondary/80 backdrop-blur-xl border border-neon-cyan/30 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,245,255,0.2)]">
          {/* Pause icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl text-center mb-6"
          >
            ⏸️
          </motion.div>

          <h2 className="text-3xl font-display font-bold text-white text-center mb-2">
            Game Paused
          </h2>
          {levelName && (
            <p className="text-text-secondary text-center mb-6">
              {levelName}
            </p>
          )}

          {/* Current stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 py-4 px-2 bg-bg-primary/50 rounded-xl">
            <div className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Score</p>
              <p className="font-display font-bold text-xl text-neon-cyan">{currentScore.toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Progress</p>
              <p className="font-display font-bold text-xl text-neon-green">{questionsAnswered}/{totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Accuracy</p>
              <p className="font-display font-bold text-xl text-neon-pink">
                {questionsAnswered > 0 ? Math.round((currentScore / (questionsAnswered * 100)) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResume}
              className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all"
            >
              ▶ Resume
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 transition-all"
            >
              🔄 Restart Level
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onQuit}
              className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/5 transition-all"
            >
              ← Exit to Menu
            </motion.button>
          </div>

          {/* Hint */}
          <p className="text-center text-text-muted text-sm mt-6">
            Press <kbd className="px-2 py-0.5 bg-bg-primary rounded text-neon-cyan font-mono">Esc</kbd> to resume
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
