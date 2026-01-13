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
  showExplanation: boolean;
  lastAnswerCorrect: boolean | null;
  onAnswer: (answerId: string) => void;
  onContinue: () => void;
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
  showExplanation,
  lastAnswerCorrect,
  onAnswer,
  onContinue,
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
    if (disabled || selectedAnswer || showExplanation) return;
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  const handleHint = () => {
    if (!hintUsed) {
      onUseHint();
      setShowHint(true);
    }
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    onContinue();
  };

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
                    : 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'
                }`}
              >
                {combo.isOnFire ? '🔥' : '⚡'} {combo.current}x
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
      {timeRemaining !== null && !showExplanation && (
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
      >
        {/* Question image/emoji */}
        <motion.div
          key={question.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6"
        >
          <span
            className="text-7xl sm:text-8xl inline-block"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))',
            }}
          >
            {question.imageHint}
          </span>
        </motion.div>

        {/* Topic badge */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm font-display capitalize">
            {question.topic.replace('-', ' ')}
          </span>
        </div>

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
          {showHint && question.hint && !showExplanation && (
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

      {/* Explanation overlay */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-6 rounded-2xl border-2 ${
              lastAnswerCorrect
                ? 'bg-neon-green/10 border-neon-green/50'
                : 'bg-neon-red/10 border-neon-red/50'
            }`}
          >
            {/* Result indicator */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-5xl"
              >
                {lastAnswerCorrect ? '✅' : '❌'}
              </motion.span>
              <span className={`font-display font-bold text-2xl ${
                lastAnswerCorrect ? 'text-neon-green' : 'text-neon-red'
              }`}>
                {lastAnswerCorrect ? 'Correct!' : 'Not Quite!'}
              </span>
            </div>

            {/* Correct answer (if wrong) */}
            {!lastAnswerCorrect && (
              <div className="text-center mb-4">
                <span className="text-text-secondary">The correct answer is: </span>
                <span className="font-display font-bold text-white">{question.correctAnswer}</span>
              </div>
            )}

            {/* Explanation */}
            <div className="bg-bg-primary/50 rounded-xl p-4 mb-4">
              <p className="text-text-secondary text-sm leading-relaxed">
                <span className="text-neon-cyan font-display font-bold">🔬 Did you know? </span>
                {question.explanation}
              </p>
            </div>

            {/* Continue button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full py-3 rounded-xl font-display font-bold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-[0_0_30px_rgba(0,245,255,0.4)]"
            >
              {questionNumber < totalQuestions ? 'Next Question →' : 'See Results →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer options */}
      {!showExplanation && (
        <>
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
                  whileHover={!disabled && !selectedAnswer ? { scale: 1.02 } : {}}
                  whileTap={!disabled && !selectedAnswer ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(option.id)}
                  disabled={disabled || !!selectedAnswer}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    text-left font-display font-semibold
                    ${isSelected
                      ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'bg-bg-secondary/60 border-white/10 text-white hover:border-neon-purple/50 hover:bg-bg-secondary'
                    }
                    ${(disabled || selectedAnswer) && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                        ${isSelected
                          ? 'bg-neon-purple text-white'
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
              disabled={hintUsed || disabled || !!selectedAnswer}
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
              disabled={disabled || !!selectedAnswer}
              className="px-4 py-2 rounded-xl font-display text-sm bg-bg-tertiary border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all"
            >
              Skip →
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
