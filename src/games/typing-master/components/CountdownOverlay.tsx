import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
  duration?: number;
}

export function CountdownOverlay({ onComplete, duration = 3 }: CountdownOverlayProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glow ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-neon-cyan/30"
              style={{ width: 200, height: 200, left: -50, top: -50 }}
            />

            {/* Count number */}
            <span className="relative z-10 text-[120px] font-display font-bold text-neon-cyan text-glow-cyan">
              {count}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-6xl font-display font-bold text-neon-green text-glow-cyan"
          >
            GO!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-1/4 text-text-secondary text-lg"
      >
        Get ready to type!
      </motion.p>
    </motion.div>
  );
}
