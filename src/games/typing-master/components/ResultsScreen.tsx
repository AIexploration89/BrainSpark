import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { GameResults, TypingLevel } from '../types';
import { calculateXP, getPerformanceRating } from '../utils/scoring';

interface ResultsScreenProps {
  results: GameResults;
  level: TypingLevel;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
  isFailure?: boolean;
}

const ratingInfo = {
  bronze: { color: 'text-orange-400', bgColor: 'orange', icon: '🥉', label: 'Bronze', rgb: '255,136,0' },
  silver: { color: 'text-gray-300', bgColor: 'gray', icon: '🥈', label: 'Silver', rgb: '192,192,192' },
  gold: { color: 'text-yellow-400', bgColor: 'yellow', icon: '🥇', label: 'Gold', rgb: '255,215,0' },
  platinum: { color: 'text-neon-cyan', bgColor: 'cyan', icon: '💎', label: 'Platinum', rgb: '0,245,255' },
};

// Particle system for celebrations
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  type: 'confetti' | 'spark' | 'star';
}

function CelebrationParticles({ active, color }: { active: boolean; color: string }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#00F5FF', '#FF00FF', '#00FF88', '#FFE55C', '#FF6B35', color];
    const types: Particle['type'][] = ['confetti', 'spark', 'star'];

    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 40,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
    }));

    setParticles(newParticles);

    // Clear particles after animation
    const timeout = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timeout);
  }, [active, color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            scale: 0,
            rotate: particle.rotation,
          }}
          animate={{
            x: `${particle.x + particle.vx * 20}%`,
            y: `${particle.y + particle.vy * -3 + 100}%`,
            scale: [0, 1, 1, 0],
            rotate: particle.rotation + 720,
          }}
          transition={{
            duration: 2.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
          }}
        >
          {particle.type === 'confetti' && (
            <div
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.type === 'spark' && (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          )}
          {particle.type === 'star' && (
            <span
              style={{
                fontSize: particle.size * 2,
                color: particle.color,
                filter: `drop-shadow(0 0 4px ${particle.color})`,
              }}
            >
              ★
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (value - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue}</>;
}

// Dramatic stat reveal card
function DramaticStatCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: 'cyan' | 'green' | 'orange' | 'purple';
  delay: number;
}) {
  const colorMap = {
    cyan: { rgb: '0,245,255', text: 'text-neon-cyan', border: 'border-neon-cyan' },
    green: { rgb: '0,255,136', text: 'text-neon-green', border: 'border-neon-green' },
    orange: { rgb: '255,136,0', text: 'text-neon-orange', border: 'border-neon-orange' },
    purple: { rgb: '139,92,246', text: 'text-neon-purple', border: 'border-neon-purple' },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className="relative group"
    >
      {/* Glow background */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 20px rgba(${colors.rgb},0.2)`,
            `0 0 40px rgba(${colors.rgb},0.4)`,
            `0 0 20px rgba(${colors.rgb},0.2)`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-xl bg-${color}/5 opacity-50`}
      />

      <div
        className={`relative p-5 rounded-xl border ${colors.border}/40 bg-bg-secondary/80 backdrop-blur-sm overflow-hidden`}
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${colors.rgb},0.3) 2px, rgba(${colors.rgb},0.3) 4px)`,
          }}
        />

        {/* Animated border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, rgba(${colors.rgb},0.4) 10%, transparent 20%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
            className="text-3xl mb-2"
            style={{ filter: `drop-shadow(0 0 8px rgba(${colors.rgb},0.8))` }}
          >
            {icon}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={`text-3xl font-display font-bold ${colors.text}`}
            style={{ textShadow: `0 0 20px rgba(${colors.rgb},0.6)` }}
          >
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </motion.div>

          <div className="text-xs text-text-muted uppercase tracking-wider mt-1 font-mono">
            {label}
          </div>
        </div>

        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${colors.border}/60`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${colors.border}/60`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${colors.border}/60`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${colors.border}/60`} />
      </div>
    </motion.div>
  );
}

// XP Counter with dramatic reveal
function XPReveal({ xp, sparks, delay }: { xp: number; sparks: number; delay: number }) {
  const [showSparks, setShowSparks] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSparks(true), (delay + 0.5) * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 overflow-hidden"
    >
      {/* Animated background pattern */}
      <motion.div
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(139,92,246,0.5) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,0,255,0.5) 0%, transparent 50%)`,
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-text-secondary text-sm mb-1"
          >
            EXPERIENCE EARNED
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
            className="text-5xl font-display font-bold text-neon-purple"
            style={{ textShadow: '0 0 30px rgba(139,92,246,0.8)' }}
          >
            +<AnimatedCounter value={xp} duration={2} />
          </motion.div>
        </div>

        <AnimatePresence>
          {showSparks && (
            <motion.div
              initial={{ x: 50, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-right"
            >
              <div className="text-text-secondary text-sm mb-1">SPARKS</div>
              <div
                className="text-4xl font-display font-bold text-neon-yellow flex items-center gap-2"
                style={{ textShadow: '0 0 20px rgba(255,229,92,0.8)' }}
              >
                +<AnimatedCounter value={sparks} duration={1.5} />
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  ⚡
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-1 h-1 rounded-full bg-neon-purple"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '20%',
          }}
        />
      ))}
    </motion.div>
  );
}

export function ResultsScreen({
  results,
  level,
  onRetry,
  onNextLevel,
  onBackToMenu,
  isFailure = false,
}: ResultsScreenProps) {
  const xpResult = calculateXP(results, level);
  const rating = getPerformanceRating(results, level.id);
  const ratingStyle = ratingInfo[rating];
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!isFailure) {
      const timeout = setTimeout(() => setShowCelebration(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [isFailure]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
        />
      </div>

      {/* Celebration particles */}
      <CelebrationParticles active={showCelebration && !isFailure} color={ratingStyle.rgb} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header with dramatic reveal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center mb-8"
        >
          {isFailure ? (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-7xl mb-4"
              >
                💔
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-display font-bold text-neon-red mb-2"
                style={{ textShadow: '0 0 30px rgba(255,51,102,0.6)' }}
              >
                Challenge Failed
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-secondary"
              >
                Don't give up! Every keystroke makes you stronger!
              </motion.p>
            </>
          ) : (
            <>
              {/* Rating badge with glow */}
              <motion.div
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative inline-block mb-4"
              >
                {/* Glow rings */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(${ratingStyle.rgb},0.4) 0%, transparent 70%)`,
                    transform: 'scale(2)',
                  }}
                />
                <span
                  className="text-8xl relative z-10"
                  style={{ filter: `drop-shadow(0 0 20px rgba(${ratingStyle.rgb},0.8))` }}
                >
                  {ratingStyle.icon}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-4xl font-display font-bold ${ratingStyle.color} mb-2`}
                style={{ textShadow: `0 0 30px rgba(${ratingStyle.rgb},0.6)` }}
              >
                {ratingStyle.label} Performance!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-secondary"
              >
                Great job completing <span className="text-neon-cyan font-semibold">{level.name}</span>!
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Stats Grid with staggered reveal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <DramaticStatCard label="WPM" value={results.wpm} icon="⚡" color="cyan" delay={0.6} />
          <DramaticStatCard
            label="Accuracy"
            value={`${results.accuracy}%`}
            icon="🎯"
            color="green"
            delay={0.7}
          />
          <DramaticStatCard
            label="Max Streak"
            value={results.maxStreak}
            icon="🔥"
            color="orange"
            delay={0.8}
          />
          <DramaticStatCard
            label="Time"
            value={formatTime(results.timeElapsed)}
            icon="⏱️"
            color="purple"
            delay={0.9}
          />
        </div>

        {/* XP Rewards (if not failure) */}
        {!isFailure && (
          <div className="mb-6">
            <XPReveal xp={xpResult.totalXP} sparks={xpResult.sparks} delay={1.0} />
          </div>
        )}

        {/* Problem Keys Analysis */}
        {results.keyErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-5 mb-6 border border-neon-red/20"
          >
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-neon-red">⚠️</span> Keys to Practice
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.keyErrors
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-neon-red/10 border border-neon-red/40 rounded-lg cursor-default"
                  >
                    <span className="font-mono font-bold text-neon-red uppercase text-lg">
                      {error.expected === ' ' ? '␣' : error.expected}
                    </span>
                    <span className="text-xs text-neon-red/70 font-mono">×{error.count}</span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,245,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-tertiary border-2 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">Try Again</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/20 to-neon-cyan/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          {!isFailure && (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,245,255,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextLevel}
              className="flex-1 py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all relative overflow-hidden"
            >
              <span className="relative z-10">Next Level →</span>
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToMenu}
            className="py-4 px-6 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white border border-transparent hover:border-white/20 transition-all"
          >
            Menu
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
