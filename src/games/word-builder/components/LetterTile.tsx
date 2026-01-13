import { motion } from 'framer-motion';
import type { LetterTile as LetterTileType, LetterAnimationState } from '../types';

interface LetterTileProps {
  tile: LetterTileType;
  onClick?: () => void;
  isSelected?: boolean;
  animationState?: LetterAnimationState;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  index?: number;
}

export function LetterTile({
  tile,
  onClick,
  isSelected = false,
  animationState = 'idle',
  size = 'md',
  color = 'neon-orange',
  disabled = false,
  index = 0,
}: LetterTileProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl sm:w-16 sm:h-16 sm:text-3xl',
    lg: 'w-16 h-16 text-3xl sm:w-20 sm:h-20 sm:text-4xl',
  };

  const colorMap: Record<string, { bg: string; border: string; shadow: string; text: string }> = {
    'neon-orange': {
      bg: 'from-orange-500/30 to-orange-600/20',
      border: 'border-orange-400/60',
      shadow: '0 0 20px rgba(255,107,53,0.4)',
      text: 'text-orange-300',
    },
    'neon-pink': {
      bg: 'from-pink-500/30 to-pink-600/20',
      border: 'border-pink-400/60',
      shadow: '0 0 20px rgba(255,0,255,0.4)',
      text: 'text-pink-300',
    },
    'neon-green': {
      bg: 'from-emerald-500/30 to-emerald-600/20',
      border: 'border-emerald-400/60',
      shadow: '0 0 20px rgba(0,255,136,0.4)',
      text: 'text-emerald-300',
    },
    'neon-cyan': {
      bg: 'from-cyan-500/30 to-cyan-600/20',
      border: 'border-cyan-400/60',
      shadow: '0 0 20px rgba(0,245,255,0.4)',
      text: 'text-cyan-300',
    },
    'neon-purple': {
      bg: 'from-purple-500/30 to-purple-600/20',
      border: 'border-purple-400/60',
      shadow: '0 0 20px rgba(139,92,246,0.4)',
      text: 'text-purple-300',
    },
    'neon-yellow': {
      bg: 'from-yellow-500/30 to-yellow-600/20',
      border: 'border-yellow-400/60',
      shadow: '0 0 20px rgba(255,229,92,0.4)',
      text: 'text-yellow-300',
    },
    'neon-red': {
      bg: 'from-red-500/30 to-red-600/20',
      border: 'border-red-400/60',
      shadow: '0 0 20px rgba(255,51,102,0.4)',
      text: 'text-red-300',
    },
  };

  const colors = colorMap[color] || colorMap['neon-orange'];

  // Animation variants
  const variants = {
    idle: {
      scale: 1,
      rotate: 0,
      y: 0,
    },
    scrambling: {
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        repeat: 2,
      },
    },
    placing: {
      scale: [1, 1.2, 1],
      y: [0, -10, 0],
      transition: {
        duration: 0.3,
      },
    },
    correct: {
      scale: [1, 1.3, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
      },
    },
    wrong: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.4,
      },
    },
    celebrating: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={animationState !== 'idle' ? animationState : { scale: 1, rotate: 0 }}
      variants={variants}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.05,
      }}
      whileHover={!disabled ? {
        scale: 1.1,
        y: -4,
        boxShadow: colors.shadow.replace('0.4', '0.7'),
      } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        relative
        flex items-center justify-center
        rounded-xl
        bg-gradient-to-br ${colors.bg}
        border-2 ${colors.border}
        font-display font-bold uppercase
        ${colors.text}
        cursor-pointer
        transition-colors duration-200
        overflow-hidden
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}
      `}
      style={{
        boxShadow: colors.shadow,
        textShadow: colors.shadow,
      }}
    >
      {/* Holographic shine effect */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{
          x: ['100%', '-100%'],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

      {/* Inner glow */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Letter */}
      <span className="relative z-10 select-none">
        {tile.letter}
      </span>
    </motion.button>
  );
}

// Empty slot for placing letters
interface LetterSlotProps {
  index: number;
  letter?: LetterTileType | null;
  onClick?: () => void;
  isCorrect?: boolean;
  isWrong?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LetterSlot({
  index,
  letter,
  onClick,
  isCorrect = false,
  isWrong = false,
  color = 'neon-orange',
  size = 'md',
}: LetterSlotProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const borderColor = isCorrect
    ? 'border-neon-green'
    : isWrong
    ? 'border-neon-red'
    : 'border-white/20';

  const bgColor = isCorrect
    ? 'bg-neon-green/10'
    : isWrong
    ? 'bg-neon-red/10'
    : 'bg-white/5';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.05,
      }}
      className={`
        ${sizeClasses[size]}
        relative
        flex items-center justify-center
        rounded-xl
        border-2 border-dashed ${borderColor}
        ${bgColor}
        transition-all duration-200
      `}
      onClick={onClick}
    >
      {/* Slot number indicator */}
      {!letter && (
        <span className="text-white/20 text-xs font-mono">
          {index + 1}
        </span>
      )}

      {/* Placed letter */}
      {letter && (
        <LetterTile
          tile={letter}
          onClick={onClick}
          color={color}
          size={size}
          animationState={isCorrect ? 'correct' : isWrong ? 'wrong' : 'idle'}
        />
      )}

      {/* Pulse effect when empty */}
      {!letter && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-xl border-2 border-white/10"
        />
      )}
    </motion.div>
  );
}
