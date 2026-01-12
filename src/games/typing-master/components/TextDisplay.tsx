import { motion } from 'framer-motion';
import type { Character } from '../types';

interface TextDisplayProps {
  characters: Character[];
  currentIndex: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const fontSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function TextDisplay({
  characters,
  currentIndex,
  fontSize = 'lg',
}: TextDisplayProps) {
  const getCharStyle = (char: Character) => {
    switch (char.state) {
      case 'correct':
        return 'text-neon-green';
      case 'incorrect':
        return 'text-neon-red bg-neon-red/20 rounded';
      case 'current':
        return 'text-neon-cyan';
      case 'corrected':
        return 'text-neon-orange';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="relative p-6 bg-bg-card/80 rounded-2xl backdrop-blur-sm border border-white/5">
      <div className={`font-mono ${fontSizes[fontSize]} leading-relaxed tracking-wide flex flex-wrap`}>
        {characters.map((char, index) => (
          <span key={index} className="relative">
            {/* Cursor */}
            {char.state === 'current' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]"
              />
            )}

            {/* Character */}
            <motion.span
              initial={false}
              animate={
                char.state === 'correct'
                  ? { scale: [1, 1.1, 1] }
                  : char.state === 'incorrect'
                  ? { x: [0, -2, 2, -2, 0] }
                  : {}
              }
              transition={{ duration: 0.2 }}
              className={`inline-block transition-colors duration-150 ${getCharStyle(char)}`}
            >
              {char.char === ' ' ? '\u00A0' : char.char}
            </motion.span>
          </span>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 h-1 bg-bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / characters.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
        />
      </div>

      {/* Character count */}
      <div className="mt-2 flex justify-between text-xs text-text-muted">
        <span>{currentIndex} / {characters.length} characters</span>
        <span>{Math.round((currentIndex / characters.length) * 100)}% complete</span>
      </div>
    </div>
  );
}

// Single letter display for Level 1 (Letter Hunt)
interface SingleLetterDisplayProps {
  letter: string;
  isCorrect: boolean | null;
}

export function SingleLetterDisplay({ letter, isCorrect }: SingleLetterDisplayProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        key={letter}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          ...(isCorrect === true && { scale: [1, 1.2, 1] }),
          ...(isCorrect === false && { x: [0, -10, 10, -10, 0] }),
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className={`
          w-32 h-32 flex items-center justify-center
          rounded-2xl border-4
          font-display text-6xl font-bold uppercase
          ${isCorrect === true
            ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_40px_rgba(0,255,136,0.5)]'
            : isCorrect === false
            ? 'bg-neon-red/20 border-neon-red text-neon-red shadow-[0_0_40px_rgba(255,51,102,0.5)]'
            : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_40px_rgba(0,245,255,0.5)]'
          }
        `}
      >
        {letter}
      </motion.div>
    </div>
  );
}
