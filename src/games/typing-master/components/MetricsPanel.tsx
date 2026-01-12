import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MetricsPanelProps {
  wpm: number;
  accuracy: number;
  streak: number;
  timeRemaining?: number | null;
  showTimer?: boolean;
}

export function MetricsPanel({
  wpm,
  accuracy,
  streak,
  timeRemaining,
  showTimer = false,
}: MetricsPanelProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-pink/5 to-neon-cyan/5 rounded-2xl blur-xl" />

      {/* Main container */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-6 flex-wrap p-4 bg-bg-secondary/30 rounded-2xl border border-white/5 backdrop-blur-sm">
        {/* Animated corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6">
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-neon-cyan to-transparent"
          />
        </div>
        <div className="absolute top-0 right-0 w-6 h-6">
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-neon-pink to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-neon-pink to-transparent"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-6 h-6">
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-green to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-neon-green to-transparent"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6">
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-neon-orange to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-neon-orange to-transparent"
          />
        </div>

        {/* WPM */}
        <HolographicMetricCard
          label="WPM"
          value={wpm}
          color="cyan"
          icon="⚡"
          showSpeedLines={wpm > 50}
        />

        {/* Accuracy */}
        <HolographicMetricCard
          label="Accuracy"
          value={accuracy}
          suffix="%"
          color={accuracy >= 95 ? 'green' : accuracy >= 80 ? 'orange' : 'red'}
          icon="🎯"
          showRings={accuracy >= 90}
        />

        {/* Streak */}
        <HolographicMetricCard
          label="Streak"
          value={streak}
          color="orange"
          icon="🔥"
          pulse={streak >= 10}
          showFlames={streak >= 5}
        />

        {/* Timer (if enabled) */}
        {showTimer && timeRemaining !== null && timeRemaining !== undefined && (
          <HolographicMetricCard
            label="Time"
            displayValue={formatTime(timeRemaining)}
            color={timeRemaining <= 10 ? 'red' : timeRemaining <= 30 ? 'orange' : 'purple'}
            icon="⏱️"
            pulse={timeRemaining <= 10}
            urgent={timeRemaining <= 10}
          />
        )}
      </div>
    </div>
  );
}

interface HolographicMetricCardProps {
  label: string;
  value?: number;
  displayValue?: string;
  suffix?: string;
  color: 'cyan' | 'green' | 'orange' | 'red' | 'purple' | 'pink';
  icon: string;
  pulse?: boolean;
  showSpeedLines?: boolean;
  showRings?: boolean;
  showFlames?: boolean;
  urgent?: boolean;
}

const colorStyles = {
  cyan: {
    bg: 'bg-neon-cyan/5',
    border: 'border-neon-cyan/40',
    text: 'text-neon-cyan',
    glow: '0 0 30px rgba(0,245,255,0.4)',
    rgb: '0,245,255',
  },
  green: {
    bg: 'bg-neon-green/5',
    border: 'border-neon-green/40',
    text: 'text-neon-green',
    glow: '0 0 30px rgba(0,255,136,0.4)',
    rgb: '0,255,136',
  },
  orange: {
    bg: 'bg-neon-orange/5',
    border: 'border-neon-orange/40',
    text: 'text-neon-orange',
    glow: '0 0 30px rgba(255,136,0,0.4)',
    rgb: '255,136,0',
  },
  red: {
    bg: 'bg-neon-red/5',
    border: 'border-neon-red/40',
    text: 'text-neon-red',
    glow: '0 0 30px rgba(255,51,102,0.4)',
    rgb: '255,51,102',
  },
  purple: {
    bg: 'bg-neon-purple/5',
    border: 'border-neon-purple/40',
    text: 'text-neon-purple',
    glow: '0 0 30px rgba(139,92,246,0.4)',
    rgb: '139,92,246',
  },
  pink: {
    bg: 'bg-neon-pink/5',
    border: 'border-neon-pink/40',
    text: 'text-neon-pink',
    glow: '0 0 30px rgba(255,0,255,0.4)',
    rgb: '255,0,255',
  },
};

function HolographicMetricCard({
  label,
  value,
  displayValue,
  suffix = '',
  color,
  icon,
  pulse,
  showSpeedLines,
  showRings,
  showFlames,
  urgent,
}: HolographicMetricCardProps) {
  const styles = colorStyles[color];
  const [prevValue, setPrevValue] = useState(value ?? 0);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    if (value !== undefined && value > prevValue) {
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 300);
    }
    if (value !== undefined) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative"
    >
      {/* Outer glow */}
      <motion.div
        animate={{
          boxShadow: pulse
            ? [styles.glow, `0 0 50px rgba(${styles.rgb},0.6)`, styles.glow]
            : styles.glow,
        }}
        transition={{ duration: 0.5, repeat: pulse ? Infinity : 0 }}
        className={`
          relative flex flex-col items-center p-4 rounded-xl
          border ${styles.bg} ${styles.border}
          min-w-[100px] overflow-hidden
          ${urgent ? 'animate-urgent-pulse' : ''}
        `}
      >
        {/* Holographic scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(${styles.rgb},0.3) 2px,
              rgba(${styles.rgb},0.3) 4px
            )`,
          }}
        />

        {/* Animated border gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, rgba(${styles.rgb},0.5) 10%, transparent 20%)`,
            maskImage: 'linear-gradient(white, white)',
            WebkitMaskImage: 'linear-gradient(white, white)',
          }}
        />

        {/* Speed lines effect */}
        <AnimatePresence>
          {showSpeedLines && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`speed-${i}`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 100, opacity: [0, 0.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeOut',
                  }}
                  className="absolute left-0 h-[1px] w-8"
                  style={{
                    top: `${30 + i * 15}%`,
                    background: `linear-gradient(90deg, transparent, rgba(${styles.rgb},0.8), transparent)`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Target rings effect */}
        <AnimatePresence>
          {showRings && (
            <>
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-4 rounded-full border-2 pointer-events-none"
                  style={{ borderColor: `rgba(${styles.rgb},0.5)` }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Flames effect */}
        <AnimatePresence>
          {showFlames && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`flame-${i}`}
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="absolute text-xs"
                  style={{
                    left: `${-8 + i * 8}px`,
                    filter: 'blur(1px)',
                  }}
                >
                  🔥
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icon with glow */}
        <motion.span
          animate={isIncreasing ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="text-2xl mb-1 relative z-10"
          style={{
            filter: `drop-shadow(0 0 8px rgba(${styles.rgb},0.8))`,
          }}
        >
          {icon}
        </motion.span>

        {/* Value with digital counter effect */}
        <div className="relative z-10">
          <motion.span
            key={displayValue ?? value}
            initial={{ opacity: 0, y: -10, scale: 1.2 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`text-3xl font-display font-bold ${styles.text} relative`}
            style={{
              textShadow: `0 0 20px rgba(${styles.rgb},0.8), 0 0 40px rgba(${styles.rgb},0.4)`,
            }}
          >
            {displayValue ?? value}{suffix}
          </motion.span>

          {/* Value change indicator */}
          <AnimatePresence>
            {isIncreasing && (
              <motion.span
                initial={{ opacity: 1, y: 0, x: 10 }}
                animate={{ opacity: 0, y: -20 }}
                exit={{ opacity: 0 }}
                className={`absolute -right-4 top-0 text-sm font-bold ${styles.text}`}
              >
                +
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Label */}
        <span className="text-xs text-text-muted uppercase tracking-wider mt-1 relative z-10 font-mono">
          {label}
        </span>

        {/* Data dots decoration */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: `rgba(${styles.rgb},0.6)` }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Compact inline metrics for tight spaces
interface InlineMetricsProps {
  wpm: number;
  accuracy: number;
  streak: number;
}

export function InlineMetrics({ wpm, accuracy, streak }: InlineMetricsProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-1 text-neon-cyan px-2 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20"
      >
        <span style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.8))' }}>⚡</span>
        <span className="font-mono font-bold">{wpm}</span>
        <span className="text-text-muted text-xs">WPM</span>
      </motion.span>

      <motion.span
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-1 text-neon-green px-2 py-1 rounded-lg bg-neon-green/10 border border-neon-green/20"
      >
        <span style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.8))' }}>🎯</span>
        <span className="font-mono font-bold">{accuracy}%</span>
      </motion.span>

      <AnimatePresence>
        {streak > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 text-neon-orange px-2 py-1 rounded-lg bg-neon-orange/10 border border-neon-orange/20"
          >
            <motion.span
              animate={streak >= 5 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3, repeat: streak >= 5 ? Infinity : 0 }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,136,0,0.8))' }}
            >
              🔥
            </motion.span>
            <span className="font-mono font-bold">{streak}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inject urgent pulse animation
const urgentPulseKeyframes = `
@keyframes urgent-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 30px rgba(255,51,102,0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 50px rgba(255,51,102,0.8);
  }
}
.animate-urgent-pulse {
  animation: urgent-pulse 0.5s ease-in-out infinite;
}
`;

if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('metrics-urgent-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'metrics-urgent-styles';
    style.textContent = urgentPulseKeyframes;
    document.head.appendChild(style);
  }
}
