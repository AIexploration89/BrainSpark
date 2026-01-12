import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'yellow';
  hoverable?: boolean;
  onClick?: () => void;
}

const glowColors = {
  cyan: 'hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] hover:border-neon-cyan/50',
  pink: 'hover:shadow-[0_0_40px_rgba(255,0,255,0.3)] hover:border-neon-pink/50',
  green: 'hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:border-neon-green/50',
  orange: 'hover:shadow-[0_0_40px_rgba(255,136,0,0.3)] hover:border-neon-orange/50',
  purple: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:border-neon-purple/50',
  yellow: 'hover:shadow-[0_0_40px_rgba(255,255,0,0.3)] hover:border-neon-yellow/50',
};

export function Card({
  children,
  className = '',
  glowColor = 'cyan',
  hoverable = true,
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-bg-card/80 backdrop-blur-sm
        border border-white/5
        rounded-2xl
        transition-all duration-300 ease-out
        ${hoverable ? `cursor-pointer ${glowColors[glowColor]}` : ''}
        ${className}
      `}
    >
      {/* Gradient border overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-[1px] rounded-2xl bg-bg-card" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Glass card variant
export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl
        ${className}
      `}
    >
      {/* Frosted glass shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
