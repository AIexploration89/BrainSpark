import { motion } from 'framer-motion';
import type { Game } from '../../types';

interface GameCardProps {
  game: Game;
  progress?: number;
  onClick?: () => void;
  delay?: number;
}

const colorStyles = {
  cyan: {
    bg: 'from-neon-cyan/20 to-neon-cyan/5',
    border: 'border-neon-cyan/30 hover:border-neon-cyan',
    glow: 'hover:shadow-[0_0_50px_rgba(0,245,255,0.4)]',
    icon: 'text-neon-cyan',
    accent: 'bg-neon-cyan',
  },
  pink: {
    bg: 'from-neon-pink/20 to-neon-pink/5',
    border: 'border-neon-pink/30 hover:border-neon-pink',
    glow: 'hover:shadow-[0_0_50px_rgba(255,0,255,0.4)]',
    icon: 'text-neon-pink',
    accent: 'bg-neon-pink',
  },
  green: {
    bg: 'from-neon-green/20 to-neon-green/5',
    border: 'border-neon-green/30 hover:border-neon-green',
    glow: 'hover:shadow-[0_0_50px_rgba(0,255,136,0.4)]',
    icon: 'text-neon-green',
    accent: 'bg-neon-green',
  },
  orange: {
    bg: 'from-neon-orange/20 to-neon-orange/5',
    border: 'border-neon-orange/30 hover:border-neon-orange',
    glow: 'hover:shadow-[0_0_50px_rgba(255,136,0,0.4)]',
    icon: 'text-neon-orange',
    accent: 'bg-neon-orange',
  },
  purple: {
    bg: 'from-neon-purple/20 to-neon-purple/5',
    border: 'border-neon-purple/30 hover:border-neon-purple',
    glow: 'hover:shadow-[0_0_50px_rgba(139,92,246,0.4)]',
    icon: 'text-neon-purple',
    accent: 'bg-neon-purple',
  },
  yellow: {
    bg: 'from-neon-yellow/20 to-neon-yellow/5',
    border: 'border-neon-yellow/30 hover:border-neon-yellow',
    glow: 'hover:shadow-[0_0_50px_rgba(255,255,0,0.4)]',
    icon: 'text-neon-yellow',
    accent: 'bg-neon-yellow',
  },
};

export function GameCard({ game, progress = 0, onClick, delay = 0 }: GameCardProps) {
  const styles = colorStyles[game.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br ${styles.bg}
        border ${styles.border}
        ${styles.glow}
        rounded-3xl p-6
        transition-all duration-300 ease-out
        overflow-hidden
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100
        bg-gradient-to-r ${styles.bg}
        blur-xl transition-opacity duration-500
      `} />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {game.isNew && (
          <span className="px-2 py-1 text-xs font-display font-bold uppercase bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-full">
            New
          </span>
        )}
        {game.isHot && (
          <span className="px-2 py-1 text-xs font-display font-bold uppercase bg-neon-orange/20 text-neon-orange border border-neon-orange/40 rounded-full animate-pulse">
            Hot
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`
          w-16 h-16 mb-4 rounded-2xl
          flex items-center justify-center
          bg-bg-primary/50 backdrop-blur-sm
          border border-white/10
          ${styles.icon}
          text-4xl
          group-hover:scale-110 transition-transform duration-300
        `}>
          {game.icon}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-glow-cyan transition-all">
          {game.name}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {game.ageRange}
          </span>
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-medium uppercase
            ${game.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' :
              game.difficulty === 'medium' ? 'bg-neon-orange/20 text-neon-orange' :
              'bg-neon-pink/20 text-neon-pink'}
          `}>
            {game.difficulty}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-2 bg-bg-primary/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: delay * 0.1 + 0.3, ease: 'easeOut' }}
              className={`h-full ${styles.accent} rounded-full relative`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          <span className="absolute right-0 -top-5 text-xs text-text-muted font-mono">
            {progress}%
          </span>
        </div>
      </div>

      {/* Play button on hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            ${styles.accent}
            shadow-[0_0_30px_rgba(0,245,255,0.5)]
          `}
        >
          <svg className="w-8 h-8 text-bg-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
