import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
  count?: number;
  categoryColor?: string;
}

export function CountdownOverlay({
  onComplete,
  count = 3,
  categoryColor = 'neon-orange',
}: CountdownOverlayProps) {
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

  const messages = ['BUILD!', 'SET', 'READY', 'FOCUS'];
  const colors = ['text-neon-green', 'text-neon-yellow', 'text-neon-orange', 'text-neon-cyan'];

  // Floating letters for background
  const floatingLetters = 'WORDBUILDER'.split('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-sm"
    >
      {/* Background floating letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingLetters.map((letter, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}vw`,
              y: '110vh',
              rotate: Math.random() * 360,
            }}
            animate={{
              y: '-10vh',
              rotate: Math.random() * 360 + 180,
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
            className={`absolute text-4xl font-display font-bold text-${categoryColor}/20`}
          >
            {letter}
          </motion.div>
        ))}

        {/* Glowing orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-${categoryColor}/30 to-neon-cyan/20 blur-3xl`}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCount}
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotateY: 90 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="text-center relative z-10"
        >
          {currentCount > 0 ? (
            <>
              {/* Number with letter blocks effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <span
                  className={`text-8xl sm:text-9xl font-display font-bold ${colors[currentCount]}`}
                  style={{
                    textShadow: `0 0 60px currentColor, 0 0 120px currentColor`,
                  }}
                >
                  {currentCount}
                </span>

                {/* Orbiting letters */}
                {['A', 'B', 'C'].map((letter, i) => (
                  <motion.span
                    key={letter}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.5,
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transformOrigin: `0 ${80 + i * 20}px`,
                    }}
                    className={`text-2xl font-display font-bold text-white/30`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-display text-text-secondary mt-8"
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
                className="relative"
              >
                <span
                  className="text-7xl sm:text-8xl font-display font-bold text-neon-green"
                  style={{
                    textShadow: '0 0 60px rgba(0,255,136,0.8), 0 0 120px rgba(0,255,136,0.4)',
                  }}
                >
                  BUILD!
                </span>
              </motion.div>

              {/* Burst effect with letters */}
              {floatingLetters.slice(0, 8).map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 text-2xl font-display font-bold text-neon-green"
                >
                  {letter}
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-text-muted text-sm">
          Tap or click letters to build words!
        </p>
      </motion.div>
    </motion.div>
  );
}
