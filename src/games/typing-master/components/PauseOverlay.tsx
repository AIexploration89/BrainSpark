import { motion } from 'framer-motion';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onRestart, onQuit }: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-bg-card rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,245,255,0.2)] max-w-md w-full mx-4"
      >
        {/* Pause icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-3 h-10 bg-neon-cyan rounded" />
              <div className="w-3 h-10 bg-neon-cyan rounded" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-display font-bold text-white text-center mb-2">
          Game Paused
        </h2>
        <p className="text-text-secondary text-center mb-8">
          Take a break! Your progress is saved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all"
          >
            Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10 hover:border-neon-orange transition-all"
          >
            Restart
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
          >
            Quit to Menu
          </motion.button>
        </div>

        {/* Keyboard hint */}
        <p className="text-xs text-text-muted text-center mt-6">
          Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-cyan">Esc</kbd> to resume
        </p>
      </motion.div>
    </motion.div>
  );
}
