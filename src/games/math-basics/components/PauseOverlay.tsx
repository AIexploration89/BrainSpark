import { motion } from 'framer-motion';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  levelName?: string;
  currentScore?: number;
}

export function PauseOverlay({
  onResume,
  onRestart,
  onQuit,
  levelName,
  currentScore,
}: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
    >
      {/* Scan line effect */}
      <motion.div
        animate={{ y: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 0%, rgba(0,255,136,0.05) 50%, transparent 100%)',
          height: '10%',
        }}
      />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-bg-secondary/90 backdrop-blur-lg rounded-2xl border-2 border-neon-green/30 p-8 max-w-sm w-full mx-4"
        style={{
          boxShadow: '0 0 50px rgba(0,255,136,0.2)',
        }}
      >
        {/* Paused icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center gap-3 text-neon-green">
            <div className="w-4 h-12 bg-neon-green rounded-sm" />
            <div className="w-4 h-12 bg-neon-green rounded-sm" />
          </div>
        </motion.div>

        {/* Title */}
        <h2
          className="text-3xl font-display font-bold text-center text-neon-green mb-2"
          style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}
        >
          PAUSED
        </h2>

        {/* Level info */}
        {levelName && (
          <p className="text-center text-text-secondary mb-1">
            {levelName}
          </p>
        )}

        {/* Current score */}
        {currentScore !== undefined && (
          <p className="text-center text-text-muted text-sm mb-6">
            Current Score: <span className="text-neon-cyan font-display font-bold">{currentScore}</span>
          </p>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResume}
            className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-green to-neon-cyan text-bg-primary shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all"
          >
            ▶ Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider border-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
          >
            ↺ Restart Level
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuit}
            className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-neon-red hover:border-neon-red/50 border-2 border-white/10 transition-all"
          >
            ✕ Quit to Menu
          </motion.button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-text-muted text-xs mt-6">
          Press <kbd className="px-2 py-1 bg-bg-tertiary rounded text-neon-green">Esc</kbd> to resume
        </p>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-green/50 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-green/50 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-green/50 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-green/50 rounded-br-xl" />
      </motion.div>
    </motion.div>
  );
}
