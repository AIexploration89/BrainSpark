import { motion } from 'framer-motion';

interface KeyboardVisualizerProps {
  activeKey: string | null;
  lastKeyCorrect: boolean | null;
  highlightHomeRow?: boolean;
}

// QWERTY keyboard layout
const keyboardRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

const homeRowKeys = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';']);

// Key widths for special keys
const keyWidths: Record<string, string> = {
  '\\': 'w-14',
  'space': 'w-64',
};

export function KeyboardVisualizer({
  activeKey,
  lastKeyCorrect,
  highlightHomeRow = false,
}: KeyboardVisualizerProps) {
  const getKeyStyle = (key: string) => {
    const isActive = activeKey?.toLowerCase() === key.toLowerCase();
    const isHomeRow = homeRowKeys.has(key.toLowerCase());

    if (isActive) {
      if (lastKeyCorrect === true) {
        return 'bg-neon-green/30 border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,136,0.6)]';
      }
      if (lastKeyCorrect === false) {
        return 'bg-neon-red/30 border-neon-red text-neon-red shadow-[0_0_20px_rgba(255,51,102,0.6)] animate-shake';
      }
      return 'bg-neon-cyan/30 border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.6)]';
    }

    if (highlightHomeRow && isHomeRow) {
      return 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple';
    }

    return 'bg-bg-secondary border-white/10 text-text-secondary hover:border-white/20';
  };

  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-bg-card/50 rounded-2xl backdrop-blur-sm">
      {/* Main keyboard rows */}
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => (
            <motion.div
              key={key}
              initial={false}
              animate={activeKey?.toLowerCase() === key.toLowerCase() ? {
                scale: lastKeyCorrect !== null ? [1, 1.1, 1] : 1.05,
              } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              className={`
                ${keyWidths[key] || 'w-10'} h-10
                flex items-center justify-center
                rounded-lg border-2
                font-mono text-sm font-semibold uppercase
                transition-all duration-150
                ${getKeyStyle(key)}
              `}
            >
              {key}
            </motion.div>
          ))}
        </div>
      ))}

      {/* Space bar row */}
      <div className="flex gap-1 mt-1">
        <motion.div
          initial={false}
          animate={activeKey === ' ' ? {
            scale: lastKeyCorrect !== null ? [1, 1.02, 1] : 1.02,
          } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`
            w-64 h-10
            flex items-center justify-center
            rounded-lg border-2
            font-mono text-xs font-semibold uppercase
            transition-all duration-150
            ${getKeyStyle(' ')}
          `}
        >
          space
        </motion.div>
      </div>

      {/* Home row indicators */}
      {highlightHomeRow && (
        <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
          <div className="w-3 h-3 rounded bg-neon-purple/40 border border-neon-purple/60" />
          <span>Home Row Keys</span>
        </div>
      )}
    </div>
  );
}

// Add shake animation to global CSS or here as inline keyframes
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
`;

// Inject shake animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shakeKeyframes;
  document.head.appendChild(style);
}
