import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, ComboState } from '../types';
import { COMBO_MESSAGES } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  combo: ComboState;
  currentScore: number;
  timeRemaining: number | null;
  maxTime: number;
  hintUsed: boolean;
  onAnswer: (answerId: string) => void;
  onSkip: () => void;
  onUseHint: () => void;
  disabled: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  combo,
  currentScore,
  timeRemaining,
  maxTime,
  hintUsed,
  onAnswer,
  onSkip,
  onUseHint,
  disabled,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Get combo message
  const comboMessage = COMBO_MESSAGES.filter(c => combo.current >= c.streak).pop();

  // Calculate timer color
  const timerPercent = timeRemaining !== null ? (timeRemaining / maxTime) * 100 : 100;
  const timerColor = timerPercent > 50 ? 'neon-green' : timerPercent > 25 ? 'neon-orange' : 'neon-red';

  const handleSelect = (answerId: string) => {
    if (disabled || selectedAnswer) return;
    setSelectedAnswer(answerId);
    setTimeout(() => {
      onAnswer(answerId);
      setSelectedAnswer(null);
      setShowHint(false);
    }, 400);
  };

  const handleHint = () => {
    if (!hintUsed) {
      onUseHint();
      setShowHint(true);
    }
  };

  // Get question type specific styling
  const getQuestionTypeStyle = () => {
    switch (question.type) {
      case 'identify':
        return { color: 'neon-green', icon: '🔍' };
      case 'habitat':
        return { color: 'neon-cyan', icon: '🏠' };
      case 'fact-check':
        return { color: 'neon-purple', icon: '✓' };
      case 'classification':
        return { color: 'neon-orange', icon: '📋' };
      default:
        return { color: 'neon-green', icon: '?' };
    }
  };

  const typeStyle = getQuestionTypeStyle();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Question counter */}
          <div className="px-4 py-2 bg-bg-secondary/80 rounded-xl border border-white/10">
            <span className="font-display font-bold text-white">
              {questionNumber}/{totalQuestions}
            </span>
          </div>

          {/* Question type badge */}
          <div className={`px-3 py-1 bg-${typeStyle.color}/20 border border-${typeStyle.color}/30 rounded-lg`}>
            <span className="text-sm">
              {typeStyle.icon} <span className={`font-display text-${typeStyle.color} capitalize`}>
                {question.type.replace('-', ' ')}
              </span>
            </span>
          </div>

          {/* Combo meter */}
          <AnimatePresence mode="wait">
            {combo.current > 0 && (
              <motion.div
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: -20 }}
                className={`px-4 py-2 rounded-xl border font-display font-bold ${
                  combo.isOnFire
                    ? 'bg-neon-orange/20 border-neon-orange text-neon-orange animate-pulse'
                    : 'bg-neon-green/20 border-neon-green/50 text-neon-green'
                }`}
              >
                {combo.isOnFire ? '🔥' : '🐾'} {combo.current}x
                {comboMessage && (
                  <span className="ml-2 text-sm">
                    {comboMessage.emoji} {comboMessage.message}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Score */}
        <div className="text-right">
          <p className="text-text-muted text-xs uppercase">Score</p>
          <p className="font-display font-bold text-xl text-neon-green">
            {currentScore.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Timer bar */}
      {timeRemaining !== null && (
        <div className="mb-6">
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${
                timerColor === 'neon-green' ? 'bg-neon-green' :
                timerColor === 'neon-orange' ? 'bg-neon-orange' : 'bg-neon-red'
              }`}
              style={{
                boxShadow: `0 0 10px ${
                  timerColor === 'neon-green' ? 'rgba(0,255,136,0.5)' :
                  timerColor === 'neon-orange' ? 'rgba(255,107,53,0.5)' : 'rgba(255,51,102,0.5)'
                }`,
              }}
            />
          </div>
          <p className="text-center text-text-muted text-sm mt-1 font-display">
            {timeRemaining}s
          </p>
        </div>
      )}

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6"
        style={{
          boxShadow: '0 0 40px rgba(0,255,136,0.05)',
        }}
      >
        {/* Question image/emoji */}
        <motion.div
          key={question.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.span
            className="text-8xl sm:text-9xl inline-block"
            animate={{
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0,255,136,0.3))',
            }}
          >
            {question.imageHint}
          </motion.span>
        </motion.div>

        {/* Question text */}
        <motion.h2
          key={`q-${question.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl sm:text-2xl font-display font-bold text-white text-center mb-2"
        >
          {question.prompt}
        </motion.h2>

        {/* Hint */}
        <AnimatePresence>
          {showHint && question.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg text-center"
            >
              <span className="text-neon-yellow text-sm">💡 Hint: {question.hint}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          const letters = ['A', 'B', 'C', 'D', 'E'];

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option.id)}
              disabled={disabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                text-left font-display font-semibold
                ${isSelected
                  ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                  : 'bg-bg-secondary/60 border-white/10 text-white hover:border-neon-green/50 hover:bg-bg-secondary'
                }
                ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${isSelected
                      ? 'bg-neon-green text-bg-primary'
                      : 'bg-white/10 text-text-secondary'
                    }
                  `}
                >
                  {letters[index]}
                </span>
                <span className="flex-1">{option.text}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Hint button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHint}
          disabled={hintUsed || disabled}
          className={`
            px-4 py-2 rounded-xl font-display text-sm transition-all
            ${hintUsed
              ? 'bg-bg-tertiary text-text-muted cursor-not-allowed'
              : 'bg-neon-yellow/20 border border-neon-yellow/30 text-neon-yellow hover:bg-neon-yellow/30'
            }
          `}
        >
          💡 {hintUsed ? 'Hint Used' : 'Use Hint (-25 pts)'}
        </motion.button>

        {/* Skip button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSkip}
          disabled={disabled}
          className="px-4 py-2 rounded-xl font-display text-sm bg-bg-tertiary border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all"
        >
          Skip →
        </motion.button>
      </div>
    </div>
  );
}
