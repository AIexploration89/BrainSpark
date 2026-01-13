import { motion } from 'framer-motion';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  levelName?: string;
  currentScore?: number;
  wordsCompleted?: number;
  totalWords?: number;
}

export function PauseOverlay({
  onResume,
  onRestart,
  onQuit,
  levelName = 'Level',
  currentScore = 0,
  wordsCompleted = 0,
  totalWords = 0,
}: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-md"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(255,107,53,0.3), transparent, rgba(0,245,255,0.3), transparent)`,
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Pause card */}
        <div className="bg-bg-secondary/90 backdrop-blur-lg rounded-3xl border border-white/10 p-8 text-center">
          {/* Pause icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-orange/20 border-2 border-neon-orange/40">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="flex gap-2"
              >
                <div className="w-3 h-8 rounded-sm bg-neon-orange" />
                <div className="w-3 h-8 rounded-sm bg-neon-orange" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Game Paused
          </h2>
          <p className="text-text-secondary mb-6">
            {levelName}
          </p>

          {/* Current stats */}
          <div className="flex justify-center gap-8 mb-8 p-4 bg-bg-tertiary/50 rounded-xl">
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-wider">Score</p>
              <p className="text-xl font-display font-bold text-neon-orange">
                {currentScore.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-wider">Progress</p>
              <p className="text-xl font-display font-bold text-neon-cyan">
                {wordsCompleted}/{totalWords}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResume}
              className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-neon-orange to-neon-yellow text-bg-primary shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:shadow-[0_0_40px_rgba(255,107,53,0.6)] transition-all"
            >
              Resume Game
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider border-2 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              Restart Level
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onQuit}
              className="w-full py-3 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
            >
              Quit to Menu
            </motion.button>
          </div>
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-muted text-sm mt-4"
        >
          Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-orange">Esc</kbd> to resume
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
