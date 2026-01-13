import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
  startFrom?: number;
}

const SPACE_MESSAGES = [
  'Initializing launch sequence...',
  'All systems go!',
  'Prepare for liftoff!',
  'BLAST OFF! 🚀',
];

export function CountdownOverlay({ onComplete, startFrom = 3 }: CountdownOverlayProps) {
  const [count, setCount] = useState(startFrom);

  useEffect(() => {
    if (count === 0) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars rushing past */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 1000],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.02,
              repeat: Infinity,
            }}
          />
        ))}

        {/* Radial glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Countdown number */}
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="mb-8"
          >
            {count > 0 ? (
              <span
                className="text-[150px] font-display font-black text-neon-cyan"
                style={{
                  textShadow: `
                    0 0 20px rgba(0, 245, 255, 0.8),
                    0 0 40px rgba(0, 245, 255, 0.6),
                    0 0 60px rgba(0, 245, 255, 0.4)
                  `,
                }}
              >
                {count}
              </span>
            ) : (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-8xl"
              >
                🚀
              </motion.span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Message */}
        <motion.p
          key={count}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-display text-text-secondary"
        >
          {SPACE_MESSAGES[startFrom - count] || SPACE_MESSAGES[SPACE_MESSAGES.length - 1]}
        </motion.p>

        {/* Progress rings */}
        <div className="mt-8 flex justify-center gap-4">
          {Array.from({ length: startFrom }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < startFrom - count ? 'bg-neon-cyan' : 'bg-white/20'
              }`}
              animate={i < startFrom - count ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: i < startFrom - count
                  ? '0 0 10px rgba(0, 245, 255, 0.6)'
                  : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default CountdownOverlay;
