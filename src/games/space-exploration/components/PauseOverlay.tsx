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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-bg-secondary rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10"
        style={{
          boxShadow: '0 0 60px rgba(0, 245, 255, 0.1)',
        }}
      >
        {/* Paused icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6"
        >
          <span className="text-7xl">🛸</span>
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-white text-center mb-2">
          Mission Paused
        </h2>
        <p className="text-text-secondary text-center mb-8">
          Your spacecraft is hovering in place...
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-shadow"
          >
            🚀 Continue Mission
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            🔄 Restart Mission
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 px-6 rounded-xl font-display font-semibold text-text-muted hover:text-white transition-colors"
          >
            🏠 Return to Base
          </motion.button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-text-muted text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-bg-primary rounded text-neon-cyan">Esc</kbd> to resume
        </p>

        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-neon-cyan/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-neon-purple/10 blur-2xl pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}

export default PauseOverlay;
