import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
}

const COUNTDOWN_EMOJIS = ['🐾', '🦁', '🐘', '🦅'];

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-xl"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          >
            {COUNTDOWN_EMOJIS[i % COUNTDOWN_EMOJIS.length]}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="relative"
        >
          {count > 0 ? (
            <div className="relative">
              {/* Glow ring */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-neon-green"
                style={{
                  filter: 'blur(30px)',
                }}
              />

              {/* Number */}
              <span
                className="font-display text-[12rem] font-black text-neon-green relative z-10"
                style={{
                  textShadow: `
                    0 0 20px rgba(0,255,136,0.8),
                    0 0 40px rgba(0,255,136,0.6),
                    0 0 60px rgba(0,255,136,0.4),
                    0 0 80px rgba(0,255,136,0.2)
                  `,
                }}
              >
                {count}
              </span>

              {/* Paw prints */}
              <motion.span
                className="absolute -top-8 -right-8 text-6xl"
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🐾
              </motion.span>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.span
                className="font-display text-6xl sm:text-8xl font-black text-neon-green block"
                style={{
                  textShadow: `
                    0 0 20px rgba(0,255,136,0.8),
                    0 0 40px rgba(0,255,136,0.6),
                    0 0 60px rgba(0,255,136,0.4)
                  `,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: 2,
                }}
              >
                GO!
              </motion.span>
              <motion.span
                className="text-6xl block mt-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🦁
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 text-center text-text-secondary"
      >
        <p className="font-display text-lg">Get ready to explore the Animal Kingdom!</p>
      </motion.div>
    </motion.div>
  );
}
