import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface AnswerInputProps {
  onDigit: (digit: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onSkip: () => void;
  currentAnswer: string;
  disabled?: boolean;
}

// Number pad button component
function NumpadButton({
  value,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
}: {
  value: string;
  onClick: () => void;
  variant?: 'default' | 'action' | 'submit' | 'danger';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    default: 'bg-bg-tertiary/80 border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/60',
    action: 'bg-bg-tertiary/80 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/60',
    submit: 'bg-neon-green/20 border-neon-green/50 text-neon-green hover:bg-neon-green/30 hover:border-neon-green',
    danger: 'bg-neon-red/10 border-neon-red/30 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/60',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 font-display font-bold text-2xl sm:text-3xl
        transition-all duration-200 overflow-hidden
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        boxShadow: variant === 'submit'
          ? '0 0 20px rgba(0,255,136,0.3)'
          : '0 0 10px rgba(0,255,136,0.1)',
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,255,136,0.2), transparent 70%)',
        }}
      />
      <span className="relative z-10">{value}</span>
    </motion.button>
  );
}

export function AnswerInput({
  onDigit,
  onSubmit,
  onClear,
  onBackspace,
  onSkip,
  currentAnswer,
  disabled = false,
}: AnswerInputProps) {
  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;

    // Numbers 0-9
    if (e.key >= '0' && e.key <= '9') {
      onDigit(e.key);
    }
    // Enter to submit
    else if (e.key === 'Enter') {
      if (currentAnswer) {
        onSubmit();
      }
    }
    // Backspace
    else if (e.key === 'Backspace') {
      onBackspace();
    }
    // Delete or Escape to clear
    else if (e.key === 'Delete' || e.key === 'Escape') {
      onClear();
    }
    // Tab to skip
    else if (e.key === 'Tab') {
      e.preventDefault();
      onSkip();
    }
  }, [disabled, currentAnswer, onDigit, onSubmit, onBackspace, onClear, onSkip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Number pad grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {/* Row 1: 7-8-9 */}
        {['7', '8', '9'].map((num, i) => (
          <motion.div
            key={num}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <NumpadButton
              value={num}
              onClick={() => onDigit(num)}
              disabled={disabled}
            />
          </motion.div>
        ))}

        {/* Row 2: 4-5-6 */}
        {['4', '5', '6'].map((num, i) => (
          <motion.div
            key={num}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (i + 3) * 0.05 }}
          >
            <NumpadButton
              value={num}
              onClick={() => onDigit(num)}
              disabled={disabled}
            />
          </motion.div>
        ))}

        {/* Row 3: 1-2-3 */}
        {['1', '2', '3'].map((num, i) => (
          <motion.div
            key={num}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (i + 6) * 0.05 }}
          >
            <NumpadButton
              value={num}
              onClick={() => onDigit(num)}
              disabled={disabled}
            />
          </motion.div>
        ))}

        {/* Row 4: Clear-0-Backspace */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.45 }}
        >
          <NumpadButton
            value="C"
            onClick={onClear}
            variant="danger"
            disabled={disabled || !currentAnswer}
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <NumpadButton
            value="0"
            onClick={() => onDigit('0')}
            disabled={disabled}
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.55 }}
        >
          <NumpadButton
            value="⌫"
            onClick={onBackspace}
            variant="action"
            disabled={disabled || !currentAnswer}
          />
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 mt-2"
      >
        {/* Skip button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSkip}
          disabled={disabled}
          className={`
            px-6 py-3 rounded-xl border-2 font-display font-semibold uppercase tracking-wider text-sm
            bg-bg-tertiary/50 border-white/20 text-text-secondary
            hover:border-neon-orange/50 hover:text-neon-orange
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Skip →
        </motion.button>

        {/* Submit button */}
        <motion.button
          whileHover={currentAnswer && !disabled ? { scale: 1.02 } : {}}
          whileTap={currentAnswer && !disabled ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={disabled || !currentAnswer}
          className={`
            relative px-8 py-3 rounded-xl border-2 font-display font-bold uppercase tracking-wider text-lg
            overflow-hidden transition-all duration-200
            ${currentAnswer
              ? 'bg-neon-green/20 border-neon-green text-neon-green cursor-pointer'
              : 'bg-bg-tertiary/50 border-white/20 text-text-muted cursor-not-allowed'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            boxShadow: currentAnswer && !disabled
              ? '0 0 30px rgba(0,255,136,0.4)'
              : 'none',
          }}
        >
          {/* Animated gradient background */}
          {currentAnswer && !disabled && (
            <motion.div
              animate={{
                x: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)',
              }}
            />
          )}
          <span className="relative z-10">Enter ↵</span>
        </motion.button>
      </motion.div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-text-muted text-xs text-center mt-2"
      >
        Use keyboard: <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-neon-cyan text-[10px]">0-9</kbd> to type,
        <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-neon-green text-[10px] ml-1">Enter</kbd> to submit,
        <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-neon-orange text-[10px] ml-1">Tab</kbd> to skip
      </motion.p>
    </div>
  );
}

// Multiple choice input component
interface ChoiceInputProps {
  choices: number[];
  onSelect: (answer: number) => void;
  disabled?: boolean;
  correctAnswer?: number;
  showResult?: boolean;
  selectedAnswer?: number | null;
}

export function ChoiceInput({
  choices,
  onSelect,
  disabled = false,
  correctAnswer,
  showResult = false,
  selectedAnswer,
}: ChoiceInputProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm"
    >
      {choices.map((choice, i) => {
        const isCorrect = choice === correctAnswer;
        const isSelected = choice === selectedAnswer;
        const showCorrectness = showResult && (isSelected || isCorrect);

        let bgColor = 'bg-bg-tertiary/80';
        let borderColor = 'border-neon-green/30';
        let textColor = 'text-neon-green';

        if (showCorrectness) {
          if (isCorrect) {
            bgColor = 'bg-neon-green/20';
            borderColor = 'border-neon-green';
            textColor = 'text-neon-green';
          } else if (isSelected && !isCorrect) {
            bgColor = 'bg-neon-red/20';
            borderColor = 'border-neon-red';
            textColor = 'text-neon-red';
          }
        }

        return (
          <motion.button
            key={choice}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className={`
              relative py-4 px-6 rounded-xl border-2 font-display font-bold text-2xl sm:text-3xl
              transition-all duration-200
              ${bgColor} ${borderColor} ${textColor}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-neon-green/60'}
            `}
            style={{
              boxShadow: showCorrectness && isCorrect
                ? '0 0 25px rgba(0,255,136,0.5)'
                : showCorrectness && isSelected && !isCorrect
                ? '0 0 25px rgba(255,51,102,0.5)'
                : '0 0 10px rgba(0,255,136,0.1)',
            }}
          >
            {choice}

            {/* Correct checkmark */}
            {showCorrectness && isCorrect && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center text-bg-primary text-sm"
              >
                ✓
              </motion.span>
            )}

            {/* Wrong X */}
            {showCorrectness && isSelected && !isCorrect && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neon-red rounded-full flex items-center justify-center text-white text-sm"
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
