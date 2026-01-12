import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Character } from '../types';

interface TextDisplayProps {
  characters: Character[];
  currentIndex: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const fontSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

// Particle burst effect for correct characters
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
}

export function TextDisplay({
  characters,
  currentIndex,
  fontSize = 'lg',
}: TextDisplayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastCorrectIndex, setLastCorrectIndex] = useState(-1);
  const [glitchText, setGlitchText] = useState(false);

  // Trigger particles on correct character
  useEffect(() => {
    if (currentIndex > 0) {
      const lastChar = characters[currentIndex - 1];
      if (lastChar?.state === 'correct' && currentIndex - 1 !== lastCorrectIndex) {
        setLastCorrectIndex(currentIndex - 1);

        // Create particles
        const newParticles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
          id: Date.now() + i,
          x: 0,
          y: 0,
          angle: (Math.PI * 2 * i) / 6 + Math.random() * 0.5,
          speed: 2 + Math.random() * 2,
          color: ['#00F5FF', '#00FF88', '#8B5CF6'][Math.floor(Math.random() * 3)],
        }));
        setParticles(prev => [...prev, ...newParticles]);

        // Clear particles after animation
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 500);
      }

      // Glitch on error
      if (lastChar?.state === 'incorrect') {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 200);
      }
    }
  }, [currentIndex, characters, lastCorrectIndex]);

  const getCharStyle = (char: Character, index: number) => {
    const isNearCursor = Math.abs(index - currentIndex) <= 3;

    switch (char.state) {
      case 'correct':
        return {
          className: 'text-neon-green',
          glow: '0 0 10px rgba(0,255,136,0.5)',
        };
      case 'incorrect':
        return {
          className: 'text-neon-red bg-neon-red/20 rounded px-0.5',
          glow: '0 0 10px rgba(255,51,102,0.5)',
        };
      case 'current':
        return {
          className: 'text-neon-cyan',
          glow: '0 0 20px rgba(0,245,255,0.6)',
        };
      case 'corrected':
        return {
          className: 'text-neon-orange',
          glow: '0 0 8px rgba(255,107,53,0.4)',
        };
      default:
        return {
          className: isNearCursor ? 'text-text-secondary' : 'text-text-muted/60',
          glow: 'none',
        };
    }
  };

  const correctCount = characters.filter(c => c.state === 'correct').length;
  const incorrectCount = characters.filter(c => c.state === 'incorrect').length;
  const progress = (currentIndex / characters.length) * 100;

  return (
    <div className="relative w-full max-w-4xl">
      {/* Terminal window */}
      <div className="relative bg-bg-secondary/80 backdrop-blur-md rounded-2xl border border-neon-cyan/20 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary/50 border-b border-neon-cyan/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-neon-red/60" />
              <div className="w-3 h-3 rounded-full bg-neon-yellow/60" />
              <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            </div>
            <span className="text-xs text-text-muted font-mono ml-3">typing_terminal.exe</span>
          </div>

          {/* Mini stats */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-neon-green">
              ✓ {correctCount}
            </span>
            {incorrectCount > 0 && (
              <span className="text-neon-red">
                ✗ {incorrectCount}
              </span>
            )}
          </div>
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
          }}
        />

        {/* CRT flicker effect */}
        <motion.div
          animate={{
            opacity: [0.97, 1, 0.98, 1, 0.97],
          }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-bg-primary/5"
        />

        {/* Text content */}
        <div className={`relative p-6 ${glitchText ? 'animate-glitch' : ''}`}>
          <div className={`font-mono ${fontSizes[fontSize]} leading-relaxed tracking-wide flex flex-wrap`}>
            {characters.map((char, index) => {
              const style = getCharStyle(char, index);

              return (
                <span key={index} className="relative inline-block">
                  {/* Cursor */}
                  {char.state === 'current' && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-neon-cyan rounded-full"
                      style={{
                        boxShadow: '0 0 10px rgba(0,245,255,0.8), 0 0 20px rgba(0,245,255,0.4)',
                      }}
                    />
                  )}

                  {/* Character */}
                  <motion.span
                    initial={false}
                    animate={
                      char.state === 'correct'
                        ? { scale: [1, 1.15, 1], y: [0, -2, 0] }
                        : char.state === 'incorrect'
                        ? { x: [0, -3, 3, -3, 0] }
                        : {}
                    }
                    transition={{ duration: 0.2 }}
                    style={{ textShadow: style.glow }}
                    className={`inline-block transition-all duration-100 ${style.className}`}
                  >
                    {char.char === ' ' ? '\u00A0' : char.char}
                  </motion.span>

                  {/* Correct burst particles */}
                  <AnimatePresence>
                    {char.state === 'correct' && index === lastCorrectIndex && (
                      <>
                        {particles.slice(-6).map((particle) => (
                          <motion.div
                            key={particle.id}
                            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                            animate={{
                              scale: 0,
                              x: Math.cos(particle.angle) * particle.speed * 20,
                              y: Math.sin(particle.angle) * particle.speed * 20,
                              opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                            style={{ backgroundColor: particle.color }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </span>
              );
            })}
          </div>

          {/* Completion prompt */}
          {currentIndex >= characters.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block ml-1 text-neon-green font-mono"
            >
              █
            </motion.div>
          )}
        </div>

        {/* Progress bar with glow */}
        <div className="px-6 pb-4">
          <div className="relative h-2 bg-bg-tertiary rounded-full overflow-hidden">
            {/* Background grid pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
              }}
            />

            {/* Progress fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative h-full rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #00F5FF, #8B5CF6, #FF00FF)',
                boxShadow: '0 0 10px rgba(0,245,255,0.5)',
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Glow overlay */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full rounded-full blur-sm"
              style={{
                background: 'linear-gradient(90deg, rgba(0,245,255,0.5), rgba(139,92,246,0.5), rgba(255,0,255,0.5))',
              }}
            />
          </div>

          {/* Progress stats */}
          <div className="mt-3 flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="text-text-muted">
                <span className="text-neon-cyan">{currentIndex}</span>
                <span className="opacity-50"> / {characters.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-neon-cyan"
              />
              <span className="text-neon-cyan font-bold">{Math.round(progress)}%</span>
              <span className="text-text-muted">COMPLETE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-neon-cyan/40" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neon-cyan/40" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neon-purple/40" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-neon-purple/40" />
    </div>
  );
}

// Single letter display for Level 1 (Letter Hunt) - dramatically enhanced
interface SingleLetterDisplayProps {
  letter: string;
  isCorrect: boolean | null;
}

export function SingleLetterDisplay({ letter, isCorrect }: SingleLetterDisplayProps) {
  const [particles, setParticles] = useState<{ id: number; angle: number; speed: number }[]>([]);

  useEffect(() => {
    if (isCorrect === true) {
      // Burst of particles on correct
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (Math.PI * 2 * i) / 12,
        speed: 3 + Math.random() * 3,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }
  }, [isCorrect, letter]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer glow rings */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 rounded-3xl ${
            isCorrect === true
              ? 'bg-neon-green/30'
              : isCorrect === false
              ? 'bg-neon-red/30'
              : 'bg-neon-cyan/30'
          }`}
          style={{ width: 180, height: 180, left: -20, top: -20 }}
        />

        {/* Main letter container */}
        <motion.div
          key={letter}
          initial={{ scale: 0, rotateY: -180 }}
          animate={{
            scale: 1,
            rotateY: 0,
            ...(isCorrect === true && { scale: [1, 1.15, 1] }),
            ...(isCorrect === false && { x: [0, -15, 15, -15, 0] }),
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className={`
            relative w-36 h-36 flex items-center justify-center
            rounded-2xl border-4
            font-display text-7xl font-black uppercase
            ${isCorrect === true
              ? 'bg-neon-green/20 border-neon-green text-neon-green'
              : isCorrect === false
              ? 'bg-neon-red/20 border-neon-red text-neon-red'
              : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
            }
          `}
          style={{
            boxShadow: isCorrect === true
              ? '0 0 50px rgba(0,255,136,0.6), inset 0 0 30px rgba(0,255,136,0.1)'
              : isCorrect === false
              ? '0 0 50px rgba(255,51,102,0.6), inset 0 0 30px rgba(255,51,102,0.1)'
              : '0 0 50px rgba(0,245,255,0.5), inset 0 0 30px rgba(0,245,255,0.1)',
          }}
        >
          {/* Inner glow */}
          <div className={`absolute inset-2 rounded-xl opacity-30 ${
            isCorrect === true
              ? 'bg-gradient-to-br from-neon-green/50 to-transparent'
              : isCorrect === false
              ? 'bg-gradient-to-br from-neon-red/50 to-transparent'
              : 'bg-gradient-to-br from-neon-cyan/50 to-transparent'
          }`} />

          {/* Scanlines */}
          <div
            className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            }}
          />

          {/* Letter */}
          <span className="relative z-10">{letter}</span>

          {/* Corner decorations */}
          <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-current opacity-50" />
          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-current opacity-50" />
          <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-current opacity-50" />
          <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-current opacity-50" />
        </motion.div>

        {/* Particle burst */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: 0,
                x: Math.cos(particle.angle) * particle.speed * 40,
                y: Math.sin(particle.angle) * particle.speed * 40,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-neon-green"
              style={{
                boxShadow: '0 0 10px rgba(0,255,136,0.8)',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Hint text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-text-muted text-sm font-mono">
            Press <span className="text-neon-cyan font-bold uppercase">{letter}</span> on your keyboard
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Inject glitch animation styles
const glitchKeyframes = `
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
.animate-glitch {
  animation: glitch 0.2s ease-in-out;
}
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('text-display-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'text-display-styles';
    style.textContent = glitchKeyframes;
    document.head.appendChild(style);
  }
}
