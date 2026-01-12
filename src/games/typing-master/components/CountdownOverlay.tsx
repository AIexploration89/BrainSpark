import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
  duration?: number;
}

// Matrix characters for the rain effect
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|/\\~';

// Generate random matrix character
const getRandomChar = () => matrixChars[Math.floor(Math.random() * matrixChars.length)];

// Matrix rain column component
function MatrixColumn({ index, totalColumns }: { index: number; totalColumns: number }) {
  const columnChars = useMemo(
    () => Array.from({ length: 25 }, () => getRandomChar()),
    []
  );
  const left = `${(index / totalColumns) * 100}%`;
  const delay = Math.random() * 3;
  const duration = 2 + Math.random() * 2;

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute top-0 text-xs font-mono text-neon-cyan/30 whitespace-nowrap"
      style={{ left, writingMode: 'vertical-rl' }}
    >
      {columnChars.join('')}
    </motion.div>
  );
}

// Digital number display with glitch effect
function DigitalNumber({ value }: { value: number }) {
  const [glitchText, setGlitchText] = useState(value.toString());

  useEffect(() => {
    // Glitch effect on number change
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchText(
          Math.random() > 0.5
            ? getRandomChar()
            : value.toString()
        );
      } else {
        setGlitchText(value.toString());
      }
    }, 50);

    return () => clearInterval(glitchInterval);
  }, [value]);

  return (
    <div className="relative">
      {/* Shadow layers for depth */}
      <span
        className="absolute inset-0 text-neon-pink/30 blur-sm"
        style={{ transform: 'translate(4px, 4px)' }}
      >
        {value}
      </span>
      <span
        className="absolute inset-0 text-neon-cyan/30 blur-sm"
        style={{ transform: 'translate(-4px, -4px)' }}
      >
        {value}
      </span>

      {/* Main number */}
      <span
        className="relative z-10 text-[140px] sm:text-[180px] font-display font-bold text-white"
        style={{
          textShadow: `
            0 0 20px rgba(0,245,255,0.8),
            0 0 40px rgba(0,245,255,0.6),
            0 0 80px rgba(0,245,255,0.4),
            0 0 120px rgba(0,245,255,0.2)
          `,
        }}
      >
        {glitchText}
      </span>
    </div>
  );
}

// Circuit line decoration
function CircuitLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      {/* Horizontal lines */}
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={`h-${i}`}
          x1="0%"
          y1={`${12.5 * i}%`}
          x2="100%"
          y2={`${12.5 * i}%`}
          stroke="url(#circuitGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: i * 0.1 }}
        />
      ))}
      {/* Vertical lines */}
      {[...Array(12)].map((_, i) => (
        <motion.line
          key={`v-${i}`}
          x1={`${8.33 * i}%`}
          y1="0%"
          x2={`${8.33 * i}%`}
          y2="100%"
          stroke="url(#circuitGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: i * 0.05 }}
        />
      ))}
      {/* Gradient definition */}
      <defs>
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,245,255,0)" />
          <stop offset="50%" stopColor="rgba(0,245,255,0.5)" />
          <stop offset="100%" stopColor="rgba(0,245,255,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Pulse ring effect
function PulseRings({ color }: { color: string }) {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
          className="absolute rounded-full border-2"
          style={{
            width: 150,
            height: 150,
            left: '50%',
            top: '50%',
            marginLeft: -75,
            marginTop: -75,
            borderColor: color,
          }}
        />
      ))}
    </>
  );
}

// Corner bracket decorations
function CornerBrackets() {
  const corners = [
    { position: 'top-8 left-8', rotate: 0 },
    { position: 'top-8 right-8', rotate: 90 },
    { position: 'bottom-8 right-8', rotate: 180 },
    { position: 'bottom-8 left-8', rotate: 270 },
  ];

  return (
    <>
      {corners.map((corner, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`absolute ${corner.position} w-12 h-12`}
          style={{ transform: `rotate(${corner.rotate}deg)` }}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
            className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-neon-cyan to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
            className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-neon-cyan to-transparent"
          />
        </motion.div>
      ))}
    </>
  );
}

// Status text with typing effect
function TypedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index) + (index < text.length ? '_' : ''));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="font-mono text-neon-cyan">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
}

export function CountdownOverlay({ onComplete, duration = 3 }: CountdownOverlayProps) {
  const [count, setCount] = useState(duration);
  const matrixColumns = 40;

  useEffect(() => {
    if (count === 0) {
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/95 backdrop-blur-md overflow-hidden"
    >
      {/* Matrix rain background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(matrixColumns)].map((_, i) => (
          <MatrixColumn key={i} index={i} totalColumns={matrixColumns} />
        ))}
      </div>

      {/* Circuit grid overlay */}
      <CircuitLines />

      {/* Corner brackets */}
      <CornerBrackets />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.5) 2px, rgba(0,245,255,0.5) 4px)',
        }}
      />

      {/* Main countdown area */}
      <div className="relative z-10">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="px-6 py-2 bg-bg-secondary/80 border border-neon-cyan/30 rounded-lg backdrop-blur-sm">
            <TypedText text="INITIALIZING TYPING PROTOCOL..." delay={200} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {count > 0 ? (
            <motion.div
              key={count}
              initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="relative flex items-center justify-center"
            >
              {/* Pulse rings */}
              <PulseRings color="rgba(0,245,255,0.4)" />

              {/* Hexagonal frame */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[250px] h-[250px]"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    fill="none"
                    stroke="rgba(0,245,255,0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="5,5"
                  />
                </svg>
              </motion.div>

              {/* Counter-rotating frame */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[200px] h-[200px]"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,0,255,0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="10,5"
                  />
                </svg>
              </motion.div>

              {/* The number */}
              <DigitalNumber value={count} />
            </motion.div>
          ) : (
            <motion.div
              key="go"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
              className="relative"
            >
              {/* Success pulse rings */}
              <PulseRings color="rgba(0,255,136,0.5)" />

              {/* GO text */}
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.6)',
                    '0 0 40px rgba(0,255,136,1), 0 0 80px rgba(0,255,136,0.8)',
                    '0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.6)',
                  ],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="text-[100px] sm:text-[140px] font-display font-bold text-neon-green"
              >
                GO!
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3"
        >
          {[...Array(duration)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor:
                  i >= count
                    ? 'rgba(0,245,255,0.8)'
                    : 'rgba(255,255,255,0.2)',
                scale: i === count - 1 ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-3 h-3 rounded-full"
              style={{
                boxShadow:
                  i >= count
                    ? '0 0 10px rgba(0,245,255,0.8)'
                    : 'none',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Hint text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-text-secondary text-lg mb-2">
          Position your fingers on the home row
        </p>
        <div className="flex justify-center gap-2 text-sm">
          {['A', 'S', 'D', 'F', '', 'J', 'K', 'L', ';'].map((key, i) => (
            key ? (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="w-8 h-8 flex items-center justify-center rounded bg-bg-secondary border border-neon-cyan/30 text-neon-cyan font-mono text-xs"
              >
                {key}
              </motion.span>
            ) : (
              <span key={i} className="w-4" />
            )
          ))}
        </div>
      </motion.div>

      {/* Data readout decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-8 left-8 text-xs font-mono text-neon-cyan/50"
      >
        <div>SYSTEM: READY</div>
        <div>LATENCY: 0ms</div>
        <div>MODE: ACTIVE</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-8 right-8 text-xs font-mono text-neon-pink/50 text-right"
      >
        <div>PROTOCOL: TYPING_V2</div>
        <div>ACCURACY: TRACKING</div>
        <div>WPM: MONITORING</div>
      </motion.div>
    </motion.div>
  );
}
