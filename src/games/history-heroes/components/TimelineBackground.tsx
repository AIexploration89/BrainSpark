import { motion } from 'framer-motion';
import type { HistoricalEra } from '../types';

interface TimelineBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  era?: HistoricalEra;
}

export function TimelineBackground({ intensity = 'medium', era }: TimelineBackgroundProps) {
  const opacityMap = {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
  };
  const opacity = opacityMap[intensity];

  // Era-specific colors
  const eraColors: Record<HistoricalEra, { primary: string; secondary: string; accent: string }> = {
    ancient: {
      primary: 'rgba(255, 229, 92, 0.15)',
      secondary: 'rgba(245, 158, 11, 0.1)',
      accent: '#FFE55C',
    },
    medieval: {
      primary: 'rgba(139, 92, 246, 0.15)',
      secondary: 'rgba(124, 58, 237, 0.1)',
      accent: '#8B5CF6',
    },
    renaissance: {
      primary: 'rgba(0, 245, 255, 0.15)',
      secondary: 'rgba(6, 182, 212, 0.1)',
      accent: '#00F5FF',
    },
    modern: {
      primary: 'rgba(0, 255, 136, 0.15)',
      secondary: 'rgba(16, 185, 129, 0.1)',
      accent: '#00FF88',
    },
  };

  const colors = era ? eraColors[era] : {
    primary: 'rgba(139, 92, 246, 0.15)',
    secondary: 'rgba(0, 245, 255, 0.1)',
    accent: '#8B5CF6',
  };

  // Era-specific icons
  const eraIcons: Record<HistoricalEra, string[]> = {
    ancient: ['🏛️', '⚱️', '🔺', '🦅', '⚔️', '📜'],
    medieval: ['🏰', '⚔️', '🛡️', '👑', '🐉', '⚜️'],
    renaissance: ['🎨', '🔭', '⛵', '📚', '🖼️', '⚗️'],
    modern: ['🚂', '💡', '✈️', '🚀', '📱', '🌍'],
  };

  const icons = era ? eraIcons[era] : ['🏛️', '⚔️', '🎨', '🚀'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {/* Gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{ background: colors.primary }}
      />
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full blur-3xl"
        style={{ background: colors.secondary }}
      />
      <motion.div
        animate={{
          x: [0, 25, -35, 0],
          y: [0, -25, 35, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: colors.primary }}
      />

      {/* Timeline line - vertical */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, ${colors.accent}40, transparent)`,
        }}
      />

      {/* Timeline dots */}
      {[0.15, 0.3, 0.5, 0.7, 0.85].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{
            top: `${pos * 100}%`,
            background: colors.accent,
            boxShadow: `0 0 20px ${colors.accent}`,
          }}
        />
      ))}

      {/* Floating era icons */}
      {icons.map((icon, i) => {
        const positions = [
          { x: '15%', y: '20%' },
          { x: '80%', y: '15%' },
          { x: '10%', y: '60%' },
          { x: '85%', y: '50%' },
          { x: '20%', y: '85%' },
          { x: '75%', y: '80%' },
        ];
        const pos = positions[i % positions.length];

        return (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 10, 0],
              x: [0, 8, -8, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            className="absolute text-4xl opacity-20"
            style={{
              left: pos.x,
              top: pos.y,
              filter: `drop-shadow(0 0 10px ${colors.accent})`,
            }}
          >
            {icon}
          </motion.div>
        );
      })}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${colors.accent}20 1px, transparent 1px),
            linear-gradient(90deg, ${colors.accent}20 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Diagonal stripes */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${colors.accent},
            ${colors.accent} 1px,
            transparent 1px,
            transparent 80px
          )`,
        }}
      />

      {/* Particle-like dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: colors.accent,
            boxShadow: `0 0 6px ${colors.accent}`,
          }}
        />
      ))}
    </div>
  );
}
