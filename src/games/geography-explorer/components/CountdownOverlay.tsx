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

  const getEmoji = () => {
    switch (count) {
      case 3: return '🌍';
      case 2: return '🌎';
      case 1: return '🌏';
      default: return '🚀';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Scanning line effect */}
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
        />
      </div>

      {/* Rotating globe ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute w-80 h-80 rounded-full border-2 border-neon-cyan/30 border-dashed"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute w-96 h-96 rounded-full border border-neon-pink/20"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 2, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          className="text-center relative z-10"
        >
          {count > 0 ? (
            <>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.8 }}
                className="text-9xl mb-4"
              >
                {getEmoji()}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-display text-8xl font-black"
                style={{
                  color: '#00F5FF',
                  textShadow: '0 0 60px rgba(0,245,255,0.8), 0 0 120px rgba(0,245,255,0.4)',
                }}
              >
                {count}
              </motion.div>
              <p className="mt-4 text-text-secondary font-display uppercase tracking-[0.3em]">
                Prepare to explore
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 0.5 }}
                className="text-9xl mb-4"
              >
                🚀
              </motion.div>
              <motion.div
                className="font-display text-5xl font-black uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #00F5FF, #FF00FF, #00FF88)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(0,245,255,0.5)',
                }}
              >
                Let's Go!
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute ${corner.includes('top') ? 'top-8' : 'bottom-8'} ${corner.includes('left') ? 'left-8' : 'right-8'} w-16 h-16`}
        >
          <div className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-8 h-1 bg-neon-cyan/50`} />
          <div className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-1 h-8 bg-neon-cyan/50`} />
        </div>
      ))}
    </motion.div>
  );
}
