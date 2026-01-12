import { motion } from 'framer-motion';
import type { Cell } from '../types';

interface GameGridProps {
  cells: Cell[];
  gridSize: number;
  onCellClick: (cellId: number) => void;
  disabled?: boolean;
  showPattern?: boolean;  // Show the pattern at end for review
}

export function GameGrid({ cells, gridSize, onCellClick, disabled, showPattern }: GameGridProps) {
  // Calculate cell size based on grid size
  const getCellSize = () => {
    switch (gridSize) {
      case 3: return 'w-20 h-20 sm:w-24 sm:h-24';
      case 4: return 'w-16 h-16 sm:w-20 sm:h-20';
      case 5: return 'w-14 h-14 sm:w-16 sm:h-16';
      case 6: return 'w-12 h-12 sm:w-14 sm:h-14';
      default: return 'w-16 h-16 sm:w-20 sm:h-20';
    }
  };

  const getGap = () => {
    switch (gridSize) {
      case 3: return 'gap-3 sm:gap-4';
      case 4: return 'gap-2 sm:gap-3';
      case 5: return 'gap-2';
      case 6: return 'gap-1.5 sm:gap-2';
      default: return 'gap-2 sm:gap-3';
    }
  };

  const cellSize = getCellSize();
  const gap = getGap();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`grid ${gap}`}
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {cells.map((cell, index) => (
        <GridCell
          key={cell.id}
          cell={cell}
          cellSize={cellSize}
          onClick={() => onCellClick(cell.id)}
          disabled={disabled}
          showPattern={showPattern}
          index={index}
        />
      ))}
    </motion.div>
  );
}

interface GridCellProps {
  cell: Cell;
  cellSize: string;
  onClick: () => void;
  disabled?: boolean;
  showPattern?: boolean;
  index: number;
}

function GridCell({ cell, cellSize, onClick, disabled, showPattern, index }: GridCellProps) {
  const { isActive, isSelected, isCorrect, isInPattern } = cell;

  // Determine cell state for styling
  const getCellStyles = () => {
    // Pattern showing phase - cells light up pink
    if (isActive) {
      return 'bg-gradient-to-br from-neon-pink via-neon-pink to-fuchsia-600 shadow-[0_0_40px_rgba(255,0,255,0.8),inset_0_0_20px_rgba(255,255,255,0.3)] scale-105 border-white/50';
    }

    // Review phase - show correct pattern
    if (showPattern && isInPattern && !isSelected) {
      return 'bg-gradient-to-br from-neon-purple/60 to-fuchsia-600/60 border-neon-purple/50 ring-2 ring-neon-purple/30';
    }

    // Selected and correct
    if (isSelected && isCorrect) {
      return 'bg-gradient-to-br from-neon-green via-emerald-500 to-teal-500 shadow-[0_0_30px_rgba(0,255,136,0.6),inset_0_0_15px_rgba(255,255,255,0.2)] border-neon-green/70';
    }

    // Selected and wrong
    if (isSelected && isCorrect === false) {
      return 'bg-gradient-to-br from-neon-red via-rose-500 to-red-600 shadow-[0_0_30px_rgba(255,51,102,0.6),inset_0_0_15px_rgba(255,255,255,0.2)] border-neon-red/70 animate-shake';
    }

    // Default inactive cell
    return 'bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary border-white/10 hover:border-neon-pink/40 hover:bg-bg-tertiary/80';
  };

  const handleClick = () => {
    if (disabled || isSelected) return;
    onClick();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
        delay: index * 0.02,
      }}
      whileHover={!disabled && !isSelected ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isSelected ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled || isSelected}
      className={`
        ${cellSize}
        ${getCellStyles()}
        rounded-xl sm:rounded-2xl
        border-2
        transition-all duration-200
        cursor-pointer
        disabled:cursor-default
        relative
        overflow-hidden
      `}
    >
      {/* Inner glow effect for active cells */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl"
        />
      )}

      {/* Pulsing ring for active cells */}
      {isActive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl border-4 border-white/50"
        />
      )}

      {/* Success checkmark */}
      {isSelected && isCorrect && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="text-2xl sm:text-3xl"
        >
          ✓
        </motion.span>
      )}

      {/* Error X */}
      {isSelected && isCorrect === false && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="text-2xl sm:text-3xl"
        >
          ✗
        </motion.span>
      )}

      {/* Pattern indicator during review */}
      {showPattern && isInPattern && !isSelected && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl sm:text-2xl text-white/70"
        >
          ○
        </motion.span>
      )}
    </motion.button>
  );
}

// Shake animation for wrong answers
const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
`;

// Inject shake animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shakeKeyframes + `
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
  `;
  if (!document.querySelector('[data-memory-matrix-styles]')) {
    style.setAttribute('data-memory-matrix-styles', '');
    document.head.appendChild(style);
  }
}
