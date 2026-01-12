import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
  duration?: number;
}

export function CountdownOverlay({ onComplete, duration = 3 }: CountdownOverlayProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const getMessage = () => {
    switch (count) {
      case 3: return 'Get Ready!';
      case 2: return 'Set...';
      case 1: return 'GO!';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-lg"
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 1,
              delay: ring * 0.2,
              repeat: Infinity,
            }}
            className="absolute rounded-full border-2 border-neon-green/30"
            style={{
              width: 200,
              height: 200,
            }}
          />
        ))}
      </div>

      {/* Countdown display */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="mb-6"
          >
            {count > 0 ? (
              <div
                className="text-[150px] sm:text-[200px] font-display font-bold text-neon-green"
                style={{
                  textShadow: '0 0 50px rgba(0,255,136,0.8), 0 0 100px rgba(0,255,136,0.4)',
                }}
              >
                {count}
              </div>
            ) : (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-7xl font-display font-bold text-neon-cyan"
                style={{
                  textShadow: '0 0 50px rgba(0,245,255,0.8)',
                }}
              >
                GO!
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Message */}
        <motion.p
          key={getMessage()}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl text-text-secondary font-display"
        >
          {getMessage()}
        </motion.p>
      </div>

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <motion.div
          key={corner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`
            absolute w-20 h-20 border-2 border-neon-green/30
            ${corner.includes('top') ? 'top-8' : 'bottom-8'}
            ${corner.includes('left') ? 'left-8' : 'right-8'}
            ${corner.includes('top') && corner.includes('left') ? 'border-r-0 border-b-0 rounded-tl-2xl' : ''}
            ${corner.includes('top') && corner.includes('right') ? 'border-l-0 border-b-0 rounded-tr-2xl' : ''}
            ${corner.includes('bottom') && corner.includes('left') ? 'border-r-0 border-t-0 rounded-bl-2xl' : ''}
            ${corner.includes('bottom') && corner.includes('right') ? 'border-l-0 border-t-0 rounded-br-2xl' : ''}
          `}
        />
      ))}
    </motion.div>
  );
}

// Timer bar component for gameplay
interface TimerBarProps {
  timeRemaining: number;
  maxTime: number;
}

export function TimerBar({ timeRemaining, maxTime }: TimerBarProps) {
  const percentage = (timeRemaining / maxTime) * 100;
  const isLow = percentage < 30;
  const isCritical = percentage < 15;

  return (
    <div className="relative">
      {/* Background track */}
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        {/* Fill */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{
            width: `${percentage}%`,
            backgroundColor: isCritical
              ? 'var(--color-neon-red)'
              : isLow
              ? 'var(--color-neon-orange)'
              : 'var(--color-neon-green)',
          }}
          className="h-full rounded-full"
          style={{
            boxShadow: isCritical
              ? '0 0 15px var(--color-neon-red)'
              : isLow
              ? '0 0 10px var(--color-neon-orange)'
              : '0 0 10px var(--color-neon-green)',
          }}
        />
      </div>

      {/* Time display */}
      <motion.div
        animate={{
          scale: isCritical ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3, repeat: isCritical ? Infinity : 0 }}
        className={`
          absolute -top-6 right-0 font-display font-bold text-sm
          ${isCritical ? 'text-neon-red' : isLow ? 'text-neon-orange' : 'text-neon-green'}
        `}
      >
        {timeRemaining}s
      </motion.div>

      {/* Pulse effect when critical */}
      {isCritical && (
        <motion.div
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute inset-0 bg-neon-red/20 rounded-full"
        />
      )}
    </div>
  );
}
