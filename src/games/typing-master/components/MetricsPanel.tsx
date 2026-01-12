import { motion } from 'framer-motion';

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
    <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
      {/* WPM */}
      <MetricCard
        label="WPM"
        value={wpm}
        color="cyan"
        icon="⚡"
      />

      {/* Accuracy */}
      <MetricCard
        label="Accuracy"
        value={accuracy}
        suffix="%"
        color={accuracy >= 95 ? 'green' : accuracy >= 80 ? 'orange' : 'red'}
        icon="🎯"
      />

      {/* Streak */}
      <MetricCard
        label="Streak"
        value={streak}
        color="orange"
        icon="🔥"
        pulse={streak >= 10}
      />

      {/* Timer (if enabled) */}
      {showTimer && timeRemaining !== null && timeRemaining !== undefined && (
        <MetricCard
          label="Time"
          displayValue={formatTime(timeRemaining)}
          color={timeRemaining <= 10 ? 'red' : timeRemaining <= 30 ? 'orange' : 'purple'}
          icon="⏱️"
          pulse={timeRemaining <= 10}
        />
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value?: number;
  displayValue?: string;
  suffix?: string;
  color: 'cyan' | 'green' | 'orange' | 'red' | 'purple' | 'pink';
  icon: string;
  pulse?: boolean;
}

const colorStyles = {
  cyan: {
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/30',
    text: 'text-neon-cyan',
    glow: 'shadow-[0_0_20px_rgba(0,245,255,0.3)]',
  },
  green: {
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    text: 'text-neon-green',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  },
  orange: {
    bg: 'bg-neon-orange/10',
    border: 'border-neon-orange/30',
    text: 'text-neon-orange',
    glow: 'shadow-[0_0_20px_rgba(255,136,0,0.3)]',
  },
  red: {
    bg: 'bg-neon-red/10',
    border: 'border-neon-red/30',
    text: 'text-neon-red',
    glow: 'shadow-[0_0_20px_rgba(255,51,102,0.3)]',
  },
  purple: {
    bg: 'bg-neon-purple/10',
    border: 'border-neon-purple/30',
    text: 'text-neon-purple',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  },
  pink: {
    bg: 'bg-neon-pink/10',
    border: 'border-neon-pink/30',
    text: 'text-neon-pink',
    glow: 'shadow-[0_0_20px_rgba(255,0,255,0.3)]',
  },
};

function MetricCard({ label, value, displayValue, suffix = '', color, icon, pulse }: MetricCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex flex-col items-center p-4 rounded-xl
        border ${styles.bg} ${styles.border} ${styles.glow}
        min-w-[100px]
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      {/* Icon */}
      <span className="text-2xl mb-1">{icon}</span>

      {/* Value */}
      <motion.span
        key={displayValue ?? value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`text-3xl font-display font-bold ${styles.text}`}
      >
        {displayValue ?? value}{suffix}
      </motion.span>

      {/* Label */}
      <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
        {label}
      </span>
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
      <span className="flex items-center gap-1 text-neon-cyan">
        <span>⚡</span>
        <span className="font-mono font-bold">{wpm}</span>
        <span className="text-text-muted">WPM</span>
      </span>

      <span className="flex items-center gap-1 text-neon-green">
        <span>🎯</span>
        <span className="font-mono font-bold">{accuracy}%</span>
      </span>

      {streak > 0 && (
        <span className="flex items-center gap-1 text-neon-orange">
          <span>🔥</span>
          <span className="font-mono font-bold">{streak}</span>
        </span>
      )}
    </div>
  );
}
