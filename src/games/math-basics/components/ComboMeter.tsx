import { motion, AnimatePresence } from 'framer-motion';
import type { ComboState } from '../types';
import { COMBO_MESSAGES } from '../types';

interface ComboMeterProps {
  combo: ComboState;
  showMessage?: boolean;
}

export function ComboMeter({ combo, showMessage = true }: ComboMeterProps) {
  // Find applicable combo message
  const comboMessage = COMBO_MESSAGES
    .filter(m => combo.current >= m.streak)
    .pop();

  // Calculate fill percentage for visual meter (caps at 25)
  const fillPercent = Math.min((combo.current / 25) * 100, 100);

  // Determine color based on streak
  const getComboColor = () => {
    if (combo.current >= 20) return 'neon-yellow';
    if (combo.current >= 15) return 'neon-pink';
    if (combo.current >= 10) return 'neon-orange';
    if (combo.current >= 5) return 'neon-cyan';
    return 'neon-green';
  };

  const comboColor = getComboColor();

  return (
    <div className="relative">
      {/* Main combo display */}
      <motion.div
        animate={{
          scale: combo.isOnFire ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: combo.isOnFire ? Infinity : 0,
        }}
        className={`
          relative flex items-center gap-3 px-4 py-2 rounded-xl border-2
          bg-bg-secondary/80 backdrop-blur-sm
          ${combo.isOnFire ? `border-${comboColor}` : 'border-white/20'}
        `}
        style={{
          boxShadow: combo.isOnFire
            ? `0 0 20px var(--color-${comboColor})`
            : 'none',
        }}
      >
        {/* Streak counter */}
        <div className="text-center min-w-[60px]">
          <motion.div
            key={combo.current}
            initial={{ scale: 1.5, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            className={`text-2xl font-display font-bold text-${comboColor}`}
            style={{
              textShadow: combo.current > 0
                ? `0 0 10px var(--color-${comboColor})`
                : 'none',
            }}
          >
            {combo.current}
          </motion.div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider">
            Streak
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Multiplier */}
        <div className="text-center min-w-[50px]">
          <motion.div
            key={combo.multiplier}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className={`text-lg font-display font-bold ${
              combo.multiplier > 1 ? `text-${comboColor}` : 'text-text-secondary'
            }`}
          >
            {combo.multiplier.toFixed(1)}x
          </motion.div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider">
            Bonus
          </div>
        </div>

        {/* Fire indicator */}
        <AnimatePresence>
          {combo.isOnFire && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute -right-3 -top-3"
            >
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-2xl"
              >
                🔥
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
          className={`h-full rounded-full bg-gradient-to-r from-neon-green via-neon-cyan to-${comboColor}`}
          style={{
            boxShadow: `0 0 10px var(--color-${comboColor})`,
          }}
        />
      </div>

      {/* Milestone markers */}
      <div className="relative h-3 mt-0.5">
        {[5, 10, 15, 20].map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${(milestone / 25) * 100}%` }}
          >
            <div
              className={`w-0.5 h-1.5 rounded-full ${
                combo.current >= milestone
                  ? `bg-${comboColor}`
                  : 'bg-white/20'
              }`}
            />
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] text-text-muted">
              {milestone}
            </span>
          </div>
        ))}
      </div>

      {/* Combo message popup */}
      <AnimatePresence>
        {showMessage && comboMessage && combo.current > 0 && (
          <motion.div
            key={comboMessage.streak}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            className={`
              absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
              px-4 py-1.5 rounded-full font-display font-bold
              bg-${comboColor}/20 text-${comboColor} border border-${comboColor}/50
            `}
            style={{
              boxShadow: `0 0 20px var(--color-${comboColor})`,
            }}
          >
            <span className="mr-1">{comboMessage.emoji}</span>
            {comboMessage.message}
            <span className="ml-1">{comboMessage.emoji}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini combo display for compact layouts
export function ComboMini({ combo }: { combo: ComboState }) {
  if (combo.current === 0) return null;

  const getColor = () => {
    if (combo.current >= 10) return 'neon-orange';
    if (combo.current >= 5) return 'neon-cyan';
    return 'neon-green';
  };

  return (
    <motion.div
      key={combo.current}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-full
        bg-${getColor()}/20 border border-${getColor()}/40
      `}
    >
      {combo.isOnFire && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          🔥
        </motion.span>
      )}
      <span className={`font-display font-bold text-${getColor()}`}>
        {combo.current}
      </span>
      <span className="text-text-muted text-xs">streak</span>
      <span className={`font-display text-sm text-${getColor()}`}>
        {combo.multiplier.toFixed(1)}x
      </span>
    </motion.div>
  );
}

// Score popup animation
interface ScorePopupProps {
  score: number;
  x?: number;
  y?: number;
  isBonus?: boolean;
}

export function ScorePopup({ score, x = 0, y = 0, isBonus = false }: ScorePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{
        opacity: [1, 1, 0],
        y: -60,
        scale: [0.5, 1.2, 1],
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <span
        className={`
          font-display font-bold text-xl
          ${isBonus ? 'text-neon-yellow' : 'text-neon-green'}
        `}
        style={{
          textShadow: `0 0 10px ${isBonus ? 'var(--color-neon-yellow)' : 'var(--color-neon-green)'}`,
        }}
      >
        +{score}
      </span>
    </motion.div>
  );
}
