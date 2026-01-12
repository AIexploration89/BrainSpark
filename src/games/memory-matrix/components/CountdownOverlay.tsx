import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
  count?: number;
}

export function CountdownOverlay({ onComplete, count = 3 }: CountdownOverlayProps) {
  const [currentCount, setCurrentCount] = useState(count);

  useEffect(() => {
    if (currentCount > 0) {
      const timer = setTimeout(() => {
        setCurrentCount(currentCount - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(onComplete, 400);
      return () => clearTimeout(completeTimer);
    }
  }, [currentCount, onComplete]);

  const messages = ['GO!', 'SET', 'READY', 'FOCUS'];
  const colors = ['text-neon-green', 'text-neon-yellow', 'text-neon-orange', 'text-neon-cyan'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-sm"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCount}
          initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotateX: 90 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="text-center"
        >
          {currentCount > 0 ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4 }}
                className={`text-8xl sm:text-9xl font-display font-bold ${colors[currentCount]} drop-shadow-[0_0_40px_currentColor]`}
              >
                {currentCount}
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-display text-text-secondary mt-4"
              >
                {messages[currentCount]}
              </motion.p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-8xl sm:text-9xl font-display font-bold text-neon-green drop-shadow-[0_0_60px_rgba(0,255,136,0.8)]"
              >
                GO!
              </motion.div>
              {/* Burst effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-neon-green"
                />
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-text-muted text-sm">
          🧠 Watch the pattern carefully, then click the cells!
        </p>
      </motion.div>
    </motion.div>
  );
}
