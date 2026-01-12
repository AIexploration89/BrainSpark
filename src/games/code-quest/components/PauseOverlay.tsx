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
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md"
    >
      {/* Glitch effect background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-neon-green/5"
          animate={{
            x: [-2, 2, -2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="relative text-center max-w-sm mx-auto p-8">
        {/* Paused icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-bg-secondary border border-neon-yellow/30 flex items-center justify-center"
          style={{
            boxShadow: '0 0 30px rgba(255,255,0,0.2)',
          }}
        >
          {/* Pause bars */}
          <div className="flex gap-2">
            <div className="w-3 h-10 rounded bg-neon-yellow" />
            <div className="w-3 h-10 rounded bg-neon-yellow" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl font-bold text-white mb-2"
        >
          PAUSED
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary mb-8"
        >
          Take a break, your code is waiting!
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 px-6 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-white shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all"
          >
            ▶ Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/60 hover:bg-neon-cyan/10 transition-all"
          >
            ↺ Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
          >
            ← Back to Menu
          </motion.button>
        </motion.div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xs text-text-muted"
        >
          Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-yellow">Esc</kbd> to resume
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PauseOverlay;
