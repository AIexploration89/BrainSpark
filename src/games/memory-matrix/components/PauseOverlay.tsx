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
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-white/10 rounded-3xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center"
      >
        {/* Pause icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-pink/20 to-fuchsia-600/20 border border-neon-pink/30 flex items-center justify-center"
        >
          <div className="flex gap-2">
            <div className="w-2 h-8 bg-neon-pink rounded-full" />
            <div className="w-2 h-8 bg-neon-pink rounded-full" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Paused
        </h2>
        <p className="text-text-secondary mb-8">
          Take a breather. The pattern will wait!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-pink to-fuchsia-500 text-white shadow-[0_0_25px_rgba(255,0,255,0.4)] hover:shadow-[0_0_35px_rgba(255,0,255,0.6)] transition-all"
          >
            ▶ Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary text-text-secondary hover:text-white border border-white/10 hover:border-neon-cyan/50 transition-all"
          >
            ↻ Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-muted hover:text-neon-red transition-colors"
          >
            ✕ Quit to Menu
          </motion.button>
        </div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-text-muted text-xs"
        >
          Press <kbd className="px-2 py-0.5 bg-bg-primary rounded text-neon-cyan text-xs">Esc</kbd> to resume
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
