import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface KeyboardVisualizerProps {
  activeKey: string | null;
  lastKeyCorrect: boolean | null;
  highlightHomeRow?: boolean;
}

// QWERTY keyboard layout
const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const homeRowKeys = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';']);

// Finger position indicators for home row keys
const fingerIndicators: Record<string, string> = {
  'a': '🔵',
  's': '🔵',
  'd': '🔵',
  'f': '🟡',
  'j': '🟡',
  'k': '🔵',
  'l': '🔵',
  ';': '🔵',
};

// Key widths for special keys
const keyWidths: Record<string, string> = {
  '\\': 'w-12',
  'space': 'w-64',
};

// Track recent key presses for trail effect
interface KeyTrail {
  key: string;
  timestamp: number;
  correct: boolean;
}

export function KeyboardVisualizer({
  activeKey,
  lastKeyCorrect,
  highlightHomeRow = false,
}: KeyboardVisualizerProps) {
  const [keyTrails, setKeyTrails] = useState<KeyTrail[]>([]);
  const [ripples, setRipples] = useState<{ id: number; key: string; correct: boolean }[]>([]);
  const [rippleId, setRippleId] = useState(0);

  // Add trail effect when key is pressed
  useEffect(() => {
    if (activeKey && lastKeyCorrect !== null) {
      const newTrail: KeyTrail = {
        key: activeKey.toLowerCase(),
        timestamp: Date.now(),
        correct: lastKeyCorrect,
      };
      setKeyTrails(prev => [...prev.slice(-5), newTrail]);

      // Add ripple
      const id = rippleId;
      setRipples(prev => [...prev, { id, key: activeKey.toLowerCase(), correct: lastKeyCorrect }]);
      setRippleId(prev => prev + 1);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
  }, [activeKey, lastKeyCorrect]);

  // Clean old trails
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setKeyTrails(prev => prev.filter(t => now - t.timestamp < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getKeyStyle = (key: string) => {
    const isActive = activeKey?.toLowerCase() === key.toLowerCase();
    const isHomeRow = homeRowKeys.has(key.toLowerCase());
    const trail = keyTrails.find(t => t.key === key.toLowerCase());
    const trailAge = trail ? (Date.now() - trail.timestamp) / 1000 : 1;
    const trailOpacity = trail ? Math.max(0, 1 - trailAge) : 0;

    if (isActive) {
      if (lastKeyCorrect === true) {
        return {
          className: 'bg-neon-green/40 border-neon-green text-neon-green',
          glow: '0 0 30px rgba(0,255,136,0.8), 0 0 60px rgba(0,255,136,0.4)',
          scale: 1.1,
        };
      }
      if (lastKeyCorrect === false) {
        return {
          className: 'bg-neon-red/40 border-neon-red text-neon-red animate-shake',
          glow: '0 0 30px rgba(255,51,102,0.8), 0 0 60px rgba(255,51,102,0.4)',
          scale: 1.1,
        };
      }
      return {
        className: 'bg-neon-cyan/40 border-neon-cyan text-neon-cyan',
        glow: '0 0 30px rgba(0,245,255,0.8), 0 0 60px rgba(0,245,255,0.4)',
        scale: 1.05,
      };
    }

    // Trail effect for recently pressed keys
    if (trail && trailOpacity > 0.2) {
      return {
        className: trail.correct
          ? 'bg-neon-green/20 border-neon-green/50 text-neon-green'
          : 'bg-neon-red/20 border-neon-red/50 text-neon-red',
        glow: trail.correct
          ? `0 0 ${20 * trailOpacity}px rgba(0,255,136,${trailOpacity * 0.5})`
          : `0 0 ${20 * trailOpacity}px rgba(255,51,102,${trailOpacity * 0.5})`,
        scale: 1,
      };
    }

    if (highlightHomeRow && isHomeRow) {
      return {
        className: 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple',
        glow: '0 0 15px rgba(139,92,246,0.3)',
        scale: 1,
      };
    }

    return {
      className: 'bg-bg-tertiary/80 border-white/10 text-text-secondary hover:border-neon-cyan/30 hover:text-white',
      glow: 'none',
      scale: 1,
    };
  };

  return (
    <div className="relative">
      {/* Outer container with glow */}
      <div className="relative p-6 bg-bg-secondary/50 rounded-2xl backdrop-blur-sm border border-neon-cyan/10 overflow-hidden">
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/50" />

        {/* Main keyboard rows */}
        <div className="relative flex flex-col items-center gap-1.5">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((key) => {
                const style = getKeyStyle(key);
                const isActive = activeKey?.toLowerCase() === key.toLowerCase();
                const ripple = ripples.find(r => r.key === key.toLowerCase());

                return (
                  <motion.div
                    key={key}
                    initial={false}
                    animate={{
                      scale: style.scale,
                      boxShadow: style.glow,
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={`
                      relative
                      ${keyWidths[key] || 'w-11'} h-11
                      flex items-center justify-center
                      rounded-lg border-2
                      font-mono text-sm font-bold uppercase
                      transition-colors duration-100
                      ${style.className}
                    `}
                  >
                    {/* Key cap highlight */}
                    <div className="absolute inset-[2px] rounded-md bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* Ripple effect */}
                    <AnimatePresence>
                      {ripple && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`absolute inset-0 rounded-lg ${
                            ripple.correct ? 'bg-neon-green/30' : 'bg-neon-red/30'
                          }`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Key label */}
                    <span className="relative z-10">{key}</span>

                    {/* Home row finger indicator */}
                    {highlightHomeRow && fingerIndicators[key.toLowerCase()] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 text-[8px]"
                      >
                        {fingerIndicators[key.toLowerCase()]}
                      </motion.div>
                    )}

                    {/* Active key indicator */}
                    {isActive && lastKeyCorrect === null && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-lg border-2 border-neon-cyan pointer-events-none"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Space bar row */}
          <div className="flex gap-1.5 mt-1">
            <motion.div
              initial={false}
              animate={{
                scale: activeKey === ' ' ? (lastKeyCorrect ? 1.02 : 1.02) : 1,
                boxShadow: activeKey === ' ' ? getKeyStyle(' ').glow : 'none',
              }}
              transition={{ duration: 0.15 }}
              className={`
                relative
                w-72 h-11
                flex items-center justify-center
                rounded-lg border-2
                font-mono text-xs font-bold uppercase tracking-widest
                transition-colors duration-100
                ${getKeyStyle(' ').className}
              `}
            >
              {/* Key cap highlight */}
              <div className="absolute inset-[2px] rounded-md bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Ripple */}
              <AnimatePresence>
                {ripples.find(r => r.key === ' ') && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 rounded-lg ${
                      ripples.find(r => r.key === ' ')?.correct ? 'bg-neon-green/30' : 'bg-neon-red/30'
                    }`}
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10">SPACE</span>
            </motion.div>
          </div>
        </div>

        {/* Home row legend */}
        {highlightHomeRow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-center gap-4 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-neon-purple/30 border border-neon-purple/50" />
              <span className="text-text-muted">Home Row Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px]">🟡</span>
              <span className="text-text-muted">Index Fingers</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Next key hint */}
      {activeKey && lastKeyCorrect === null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <div className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/30 rounded-full">
            <span className="text-neon-cyan text-sm font-mono">
              Press: <span className="font-bold uppercase">{activeKey === ' ' ? 'SPACE' : activeKey}</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Inject shake animation styles
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0) scale(1.1); }
  20% { transform: translateX(-3px) scale(1.1); }
  40% { transform: translateX(3px) scale(1.1); }
  60% { transform: translateX(-3px) scale(1.1); }
  80% { transform: translateX(3px) scale(1.1); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('keyboard-shake-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'keyboard-shake-styles';
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
  }
}
