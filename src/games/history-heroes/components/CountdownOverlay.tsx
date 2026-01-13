import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const countdownConfig = {
    3: { emoji: '🏛️', text: 'Ready...', color: '#FFE55C' },
    2: { emoji: '⚔️', text: 'Set...', color: '#8B5CF6' },
    1: { emoji: '📜', text: 'Go!', color: '#00F5FF' },
  }[count] || { emoji: '🚀', text: 'GO!', color: '#00FF88' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-sm"
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2"
            style={{ borderColor: countdownConfig.color }}
          />
        ))}
      </div>

      {/* Countdown display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className="text-center relative z-10"
        >
          {/* Emoji */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-9xl mb-6"
            style={{
              filter: `drop-shadow(0 0 40px ${countdownConfig.color}60)`,
            }}
          >
            {countdownConfig.emoji}
          </motion.div>

          {/* Number */}
          {count > 0 && (
            <motion.div
              className="text-9xl font-display font-black mb-4"
              style={{
                color: countdownConfig.color,
                textShadow: `0 0 60px ${countdownConfig.color}80, 0 0 100px ${countdownConfig.color}40`,
              }}
            >
              {count}
            </motion.div>
          )}

          {/* Text */}
          <motion.p
            className="text-2xl font-display font-bold text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {countdownConfig.text}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 text-text-muted text-sm"
      >
        🕰️ Journey through time begins now!
      </motion.p>
    </motion.div>
  );
}
