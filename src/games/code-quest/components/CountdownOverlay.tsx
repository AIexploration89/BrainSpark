import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCount(c => c - 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm">
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-neon-green/30 font-mono text-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: -50,
            }}
            animate={{
              y: ['0vh', '110vh'],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          >
            {['0', '1', '{', '}', '<', '>', '/'].map((char, j) => (
              <div key={j}>{char}</div>
            ))}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glow rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
                transform: 'scale(3)',
              }}
              animate={{
                scale: [3, 4, 3],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Number */}
            <span
              className="font-display text-9xl font-bold text-neon-green"
              style={{
                textShadow: `
                  0 0 20px rgba(0,255,136,0.8),
                  0 0 40px rgba(0,255,136,0.5),
                  0 0 60px rgba(0,255,136,0.3)
                `,
              }}
            >
              {count}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glow burst */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,136,0.5) 0%, transparent 60%)',
                transform: 'scale(4)',
              }}
              animate={{
                scale: [4, 8],
                opacity: [0.5, 0],
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Code bracket animation */}
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="font-mono text-6xl text-neon-green"
              >
                {'<'}
              </motion.span>
              <motion.span
                className="font-display text-6xl font-bold text-white"
                style={{
                  textShadow: '0 0 30px rgba(255,255,255,0.5)',
                }}
              >
                CODE
              </motion.span>
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="font-mono text-6xl text-neon-green"
              >
                {'/>'}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 text-center"
      >
        <p className="text-text-secondary font-mono text-sm">
          Build your program, then press <span className="text-neon-green">RUN</span>
        </p>
      </motion.div>
    </div>
  );
}

export default CountdownOverlay;
