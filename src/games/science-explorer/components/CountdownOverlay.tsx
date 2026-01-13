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
      case 3: return '🧪';
      case 2: return '⚗️';
      case 1: return '🔬';
      default: return '💡';
    }
  };

  const getLabel = () => {
    switch (count) {
      case 3: return 'Mix...';
      case 2: return 'Heat...';
      case 1: return 'React!';
      default: return 'Experiment!';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md"
    >
      {/* Animated molecule background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hexagonal grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating molecules */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['⚛️', '🧬', '🔬', '⚗️', '💡'][i % 5]}
          </motion.div>
        ))}

        {/* Scanning line effect */}
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"
        />
      </div>

      {/* Orbiting rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute w-72 h-72 rounded-full border-2 border-neon-purple/30 border-dashed"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute w-96 h-96 rounded-full border border-neon-cyan/20"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[28rem] h-[28rem] rounded-full border border-neon-pink/10"
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
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.8 }}
                className="text-9xl mb-4"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.6))',
                }}
              >
                {getEmoji()}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-display text-8xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #00F5FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 60px rgba(139,92,246,0.6)',
                }}
              >
                {count}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-text-secondary font-display uppercase tracking-[0.3em] text-lg"
              >
                {getLabel()}
              </motion.p>
            </>
          ) : (
            <>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-9xl mb-4"
                style={{
                  filter: 'drop-shadow(0 0 50px rgba(0,255,136,0.6))',
                }}
              >
                💡
              </motion.div>
              <motion.div
                className="font-display text-5xl font-black uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #00FF88, #00F5FF, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Experiment!
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bubbling beakers on sides */}
      <div className="absolute bottom-8 left-8 text-6xl opacity-30">
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🧪
        </motion.span>
      </div>
      <div className="absolute bottom-8 right-8 text-6xl opacity-30">
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          ⚗️
        </motion.span>
      </div>

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute ${corner.includes('top') ? 'top-8' : 'bottom-8'} ${corner.includes('left') ? 'left-8' : 'right-8'} w-16 h-16`}
        >
          <div className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-8 h-1 bg-neon-purple/50`} />
          <div className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-1 h-8 bg-neon-purple/50`} />
        </div>
      ))}
    </motion.div>
  );
}
