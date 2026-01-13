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
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md mx-4"
      >
        {/* Pause card */}
        <div className="bg-bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          {/* Pause icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))',
            }}
          >
            ⏸️
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Game Paused
          </h2>

          {levelName && (
            <p className="text-text-secondary mb-6">{levelName}</p>
          )}

          {/* Current stats */}
          <div className="bg-bg-primary/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-text-muted text-xs uppercase mb-1">Score</p>
                <p className="font-display font-bold text-neon-purple text-xl">
                  {currentScore.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase mb-1">Progress</p>
                <p className="font-display font-bold text-neon-cyan text-xl">
                  {questionsAnswered}/{totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase mb-1">Accuracy</p>
                <p className="font-display font-bold text-neon-green text-xl">
                  {questionsAnswered > 0
                    ? `${Math.round((currentScore / (questionsAnswered * 150)) * 100)}%`
                    : '--'}
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
              className="w-full py-3 rounded-xl font-display font-bold uppercase tracking-wider bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              ▶️ Resume
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-white/10 text-white hover:border-neon-orange/50 transition-colors"
            >
              🔄 Restart Level
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onQuit}
              className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider bg-transparent text-text-secondary hover:text-white transition-colors"
            >
              🚪 Quit to Menu
            </motion.button>
          </div>

          {/* Keyboard hint */}
          <p className="mt-6 text-text-muted text-xs">
            Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-neon-cyan font-mono">Esc</kbd> to resume
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
