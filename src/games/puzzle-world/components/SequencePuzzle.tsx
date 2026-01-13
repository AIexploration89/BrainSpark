import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzleGameStore } from '../stores/puzzleStore';
import type { Level } from '../types';

interface SequencePuzzleProps {
  level: Level;
  onPause: () => void;
}

// Shape icons for sequence
const SHAPE_ICONS: Record<string, string> = {
  circle: '●',
  square: '■',
  triangle: '▲',
  diamond: '◆',
  star: '★',
};

// Color classes
const COLOR_CLASSES: Record<string, string> = {
  cyan: 'text-neon-cyan',
  pink: 'text-neon-pink',
  green: 'text-neon-green',
  purple: 'text-neon-purple',
  yellow: 'text-neon-yellow',
  orange: 'text-neon-orange',
};

export function SequencePuzzle({ level, onPause }: SequencePuzzleProps) {
  const {
    sequenceItems,
    correctAnswers,
    moves,
    elapsedTime,
    hintsUsed,
    submitSequenceAnswer,
    useHint,
  } = usePuzzleGameStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const hiddenItems = sequenceItems.filter((item) => item.isAnswer);
  const currentHiddenItem = hiddenItems.find((item) => item.isHidden);

  // Generate answer options based on sequence type
  const generateOptions = () => {
    if (!currentHiddenItem) return [];

    const correctAnswer = currentHiddenItem.value;
    const options: (string | number)[] = [correctAnswer];

    if (currentHiddenItem.type === 'number') {
      // Generate number options around the correct answer
      const num = correctAnswer as number;
      const spread = [num - 2, num - 1, num + 1, num + 2].filter((n) => n > 0 && n !== num);
      while (options.length < 4 && spread.length > 0) {
        const idx = Math.floor(Math.random() * spread.length);
        options.push(spread.splice(idx, 1)[0]);
      }
    } else if (currentHiddenItem.type === 'shape') {
      // Shape options
      const allShapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
      const otherShapes = allShapes.filter((s) => s !== correctAnswer);
      while (options.length < 4 && otherShapes.length > 0) {
        const idx = Math.floor(Math.random() * otherShapes.length);
        options.push(otherShapes.splice(idx, 1)[0]);
      }
    } else if (currentHiddenItem.type === 'color') {
      // Color options
      const allColors = ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'];
      const otherColors = allColors.filter((c) => c !== correctAnswer);
      while (options.length < 4 && otherColors.length > 0) {
        const idx = Math.floor(Math.random() * otherColors.length);
        options.push(otherColors.splice(idx, 1)[0]);
      }
    }

    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const options = generateOptions();

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate time remaining for levels with time limit
  const timeRemaining = level.timeLimit ? Math.max(0, level.timeLimit - elapsedTime) : null;
  const isLowTime = timeRemaining !== null && timeRemaining < 30;

  // Handle answer submission
  const handleSubmit = (answer: string | number) => {
    setSelectedAnswer(answer);
    const isCorrect = submitSequenceAnswer(answer);
    setShowFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setShowFeedback(null);
      setSelectedAnswer(null);
    }, 800);
  };

  // Render sequence item
  const renderItem = (item: typeof sequenceItems[0], index: number) => {
    const isCurrentHidden = item.isHidden && item === currentHiddenItem;

    if (item.isHidden) {
      return (
        <motion.div
          key={item.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: isCurrentHidden ? [1, 1.05, 1] : 1,
            opacity: 1,
          }}
          transition={{
            delay: index * 0.1,
            scale: { duration: 1.5, repeat: isCurrentHidden ? Infinity : 0 },
          }}
          className={`
            w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center
            ${isCurrentHidden
              ? 'bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 border-2 border-neon-purple animate-pulse'
              : 'bg-bg-tertiary/50 border-2 border-dashed border-white/20'
            }
          `}
          style={{
            boxShadow: isCurrentHidden ? '0 0 30px rgba(139,92,246,0.4)' : 'none',
          }}
        >
          <span className="text-2xl sm:text-3xl text-neon-purple font-display font-bold">?</span>
        </motion.div>
      );
    }

    // Revealed item
    return (
      <motion.div
        key={item.id}
        initial={{ scale: 0, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center bg-bg-secondary/80 border-2 border-white/20"
        style={{
          boxShadow: '0 0 20px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {item.type === 'number' && (
          <span
            className="text-2xl sm:text-3xl font-display font-bold text-neon-cyan"
            style={{ textShadow: '0 0 15px rgba(0,245,255,0.8)' }}
          >
            {item.value}
          </span>
        )}
        {item.type === 'shape' && (
          <span
            className="text-3xl sm:text-4xl text-neon-pink"
            style={{ textShadow: '0 0 15px rgba(255,0,255,0.8)' }}
          >
            {SHAPE_ICONS[item.value as string] || item.value}
          </span>
        )}
        {item.type === 'color' && (
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${COLOR_CLASSES[item.value as string]}`}
            style={{
              background:
                item.value === 'cyan'
                  ? 'radial-gradient(circle, rgba(0,245,255,1) 0%, rgba(0,245,255,0.6) 100%)'
                  : item.value === 'pink'
                  ? 'radial-gradient(circle, rgba(255,0,255,1) 0%, rgba(255,0,255,0.6) 100%)'
                  : item.value === 'green'
                  ? 'radial-gradient(circle, rgba(0,255,136,1) 0%, rgba(0,255,136,0.6) 100%)'
                  : item.value === 'purple'
                  ? 'radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(139,92,246,0.6) 100%)'
                  : item.value === 'yellow'
                  ? 'radial-gradient(circle, rgba(255,229,92,1) 0%, rgba(255,229,92,0.6) 100%)'
                  : 'radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(255,107,53,0.6) 100%)',
              boxShadow: `0 0 20px currentColor`,
            }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative overflow-hidden">
      {/* CRT Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.1) 2px, rgba(139,92,246,0.1) 4px)',
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background: `
              conic-gradient(from 0deg,
                rgba(139,92,246,0.1) 0deg,
                rgba(0,245,255,0.1) 90deg,
                rgba(255,0,255,0.1) 180deg,
                rgba(0,255,136,0.1) 270deg,
                rgba(139,92,246,0.1) 360deg
              )
            `,
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139,92,246,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-neon-purple/30 text-neon-purple hover:border-neon-purple/60 transition-all"
          >
            <span className="text-xl">⏸</span>
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-lg">{level.name}</h2>
            <p className="text-xs text-text-muted font-mono">
              {level.sequenceType?.toUpperCase()} • LEVEL {level.id}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Found</p>
            <p className="font-mono font-bold text-lg text-neon-green">
              {correctAnswers}/{hiddenItems.length}
            </p>
          </div>

          {/* Timer */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Time</p>
            <p
              className={`font-mono font-bold text-lg ${
                isLowTime ? 'text-neon-red animate-pulse' : 'text-neon-cyan'
              }`}
            >
              {timeRemaining !== null ? formatTime(timeRemaining) : formatTime(elapsedTime)}
            </p>
          </div>

          {/* Attempts */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Tries</p>
            <p className="font-mono font-bold text-lg text-neon-purple">{moves}</p>
          </div>

          {/* Hints */}
          {(level.hints || 0) > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={useHint}
              disabled={hintsUsed >= (level.hints || 0)}
              className={`px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border transition-all ${
                hintsUsed >= (level.hints || 0)
                  ? 'border-white/10 opacity-50 cursor-not-allowed'
                  : 'border-neon-yellow/30 hover:border-neon-yellow/60'
              }`}
            >
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Hints</p>
              <p className="font-mono font-bold text-lg text-neon-yellow">
                {(level.hints || 0) - hintsUsed}
              </p>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-text-secondary text-lg mb-8 text-center"
        >
          What comes next in the sequence?
        </motion.p>

        {/* Sequence Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(0,245,255,0.1) 100%)',
            boxShadow: '0 0 60px rgba(139,92,246,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          {sequenceItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 sm:gap-4">
              {renderItem(item, index)}
              {index < sequenceItems.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-text-muted text-2xl"
                >
                  →
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Answer Options */}
        {currentHiddenItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <p className="text-text-muted text-sm text-center mb-4">Choose the correct answer:</p>
            <div className="flex gap-4 flex-wrap justify-center">
              {options.map((option, index) => (
                <motion.button
                  key={`${option}-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubmit(option)}
                  disabled={showFeedback !== null}
                  className={`
                    w-20 h-20 rounded-xl flex items-center justify-center transition-all
                    ${
                      selectedAnswer === option && showFeedback === 'correct'
                        ? 'bg-neon-green/30 border-2 border-neon-green shadow-[0_0_30px_rgba(0,255,136,0.5)]'
                        : selectedAnswer === option && showFeedback === 'wrong'
                        ? 'bg-neon-red/30 border-2 border-neon-red shadow-[0_0_30px_rgba(255,51,102,0.5)] animate-shake'
                        : 'bg-bg-secondary/80 border-2 border-white/20 hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    }
                  `}
                >
                  {currentHiddenItem.type === 'number' && (
                    <span className="text-2xl font-display font-bold text-white">{option}</span>
                  )}
                  {currentHiddenItem.type === 'shape' && (
                    <span className="text-3xl text-neon-pink">
                      {SHAPE_ICONS[option as string] || option}
                    </span>
                  )}
                  {currentHiddenItem.type === 'color' && (
                    <div
                      className="w-12 h-12 rounded-full"
                      style={{
                        background:
                          option === 'cyan'
                            ? 'radial-gradient(circle, rgba(0,245,255,1) 0%, rgba(0,245,255,0.6) 100%)'
                            : option === 'pink'
                            ? 'radial-gradient(circle, rgba(255,0,255,1) 0%, rgba(255,0,255,0.6) 100%)'
                            : option === 'green'
                            ? 'radial-gradient(circle, rgba(0,255,136,1) 0%, rgba(0,255,136,0.6) 100%)'
                            : option === 'purple'
                            ? 'radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(139,92,246,0.6) 100%)'
                            : option === 'yellow'
                            ? 'radial-gradient(circle, rgba(255,229,92,1) 0%, rgba(255,229,92,0.6) 100%)'
                            : 'radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(255,107,53,0.6) 100%)',
                        boxShadow: '0 0 15px currentColor',
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback Animation */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <div
                className={`
                  text-6xl font-display font-bold
                  ${showFeedback === 'correct' ? 'text-neon-green' : 'text-neon-red'}
                `}
                style={{
                  textShadow: showFeedback === 'correct'
                    ? '0 0 30px rgba(0,255,136,0.8)'
                    : '0 0 30px rgba(255,51,102,0.8)',
                }}
              >
                {showFeedback === 'correct' ? '✓' : '✗'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-text-muted text-sm mt-4 relative z-10">
        Press{' '}
        <kbd className="px-2 py-1 bg-bg-secondary rounded border border-white/10 text-neon-purple font-mono">
          Esc
        </kbd>{' '}
        to pause
      </div>

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
