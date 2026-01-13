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
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0,245,255,0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,0,255,0.1) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0,255,136,0.1) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(255,229,92,0.1) 75%)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 max-w-md w-full mx-4"
      >
        {/* Pause icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.2) 0%, rgba(255,0,255,0.2) 100%)',
              boxShadow: '0 0 40px rgba(0,245,255,0.3), inset 0 0 40px rgba(0,0,0,0.3)',
              border: '2px solid rgba(0,245,255,0.4)',
            }}
          >
            <div className="flex gap-3">
              <div className="w-4 h-12 bg-neon-cyan rounded-sm" style={{ boxShadow: '0 0 15px rgba(0,245,255,0.6)' }} />
              <div className="w-4 h-12 bg-neon-cyan rounded-sm" style={{ boxShadow: '0 0 15px rgba(0,245,255,0.6)' }} />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white">PAUSED</h2>
        </motion.div>

        {/* Buttons */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,136,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
          >
            ▶ Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,245,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider bg-bg-secondary border-2 border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan transition-all"
          >
            ↺ Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-4 px-8 rounded-xl font-display font-semibold text-lg uppercase tracking-wider text-text-secondary hover:text-white transition-all"
          >
            ← Exit to Menu
          </motion.button>
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-text-muted text-sm">
            Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-neon-cyan">Esc</kbd> to resume
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
