import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
            className="absolute w-40 h-40 rounded-full"
            style={{
              border: `2px solid ${
                i === 0 ? 'rgba(0,245,255,0.6)' : i === 1 ? 'rgba(255,0,255,0.6)' : 'rgba(0,255,136,0.6)'
              }`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 2, opacity: 0, rotateY: 180 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative z-10"
        >
          {count > 0 ? (
            <div
              className="text-[150px] font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #FF00FF 50%, #00FF88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 40px rgba(0,245,255,0.6))',
              }}
            >
              {count}
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="text-5xl font-display font-bold text-neon-green"
              style={{
                textShadow: '0 0 30px rgba(0,255,136,0.8)',
              }}
            >
              GO!
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Glitch effect overlay */}
      <motion.div
        animate={{
          opacity: [0, 0.1, 0],
          x: [-5, 5, -5],
        }}
        transition={{ duration: 0.15, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.1) 50%, transparent 100%)',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
