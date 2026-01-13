import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizSession, QuizQuestion } from '../types';

interface SpaceQuizProps {
  session: QuizSession;
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  onPause: () => void;
  timeLimit?: number;
}

export function SpaceQuiz({
  session,
  onAnswer,
  onNext,
  onPause,
  timeLimit,
}: SpaceQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);

  const currentQuestion = session.questions[session.currentIndex];
  const hasAnswered = session.answers[session.currentIndex] !== null;
  const isCorrect = hasAnswered && session.answers[session.currentIndex] === currentQuestion.correctAnswer;

  // Timer
  useEffect(() => {
    if (!timeLimit || hasAnswered) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit wrong answer on timeout
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, hasAnswered, session.currentIndex]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (timeLimit) {
      setTimeRemaining(timeLimit);
    }
  }, [session.currentIndex, timeLimit]);

  const handleAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    onAnswer(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    onNext();
  };

  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
          >
            ⏸
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white">Space Quiz</h2>
            <p className="text-xs text-text-muted">
              Question {session.currentIndex + 1} of {session.questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="text-right">
            <p className="text-xs text-text-muted">Correct</p>
            <p className="font-display font-bold text-neon-green">
              {session.correctCount}/{session.currentIndex + (hasAnswered ? 1 : 0)}
            </p>
          </div>

          {/* Timer */}
          {timeLimit && !hasAnswered && (
            <motion.div
              className={`px-4 py-2 rounded-full font-display font-bold ${
                timeRemaining <= 10
                  ? 'bg-neon-red/20 text-neon-red'
                  : 'bg-neon-cyan/20 text-neon-cyan'
              }`}
              animate={timeRemaining <= 10 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⏱ {timeRemaining}s
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-bg-tertiary rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={session.currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            {/* Question card */}
            <div className="bg-bg-secondary rounded-2xl p-6 sm:p-8 mb-6 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">🚀</span>
                <div>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-display uppercase rounded-full mb-3 ${
                      getDifficultyColor(currentQuestion.difficulty)
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showResult = hasAnswered;

                let buttonClass = 'bg-bg-secondary border-white/10 hover:border-neon-cyan/50';
                if (showResult) {
                  if (isCorrectAnswer) {
                    buttonClass = 'bg-neon-green/20 border-neon-green';
                  } else if (isSelected && !isCorrectAnswer) {
                    buttonClass = 'bg-neon-red/20 border-neon-red';
                  }
                } else if (isSelected) {
                  buttonClass = 'bg-neon-cyan/20 border-neon-cyan';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                    whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={hasAnswered}
                    className={`
                      p-4 sm:p-5 rounded-xl border-2 text-left transition-all
                      ${buttonClass}
                      ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                          showResult && isCorrectAnswer
                            ? 'bg-neon-green text-bg-primary'
                            : showResult && isSelected && !isCorrectAnswer
                            ? 'bg-neon-red text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {showResult && isCorrectAnswer
                          ? '✓'
                          : showResult && isSelected && !isCorrectAnswer
                          ? '✗'
                          : String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-white font-medium">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`mt-6 p-6 rounded-xl border ${
                    isCorrect
                      ? 'bg-neon-green/10 border-neon-green/30'
                      : 'bg-neon-orange/10 border-neon-orange/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {isCorrect ? '🎉' : '💡'}
                    </span>
                    <div>
                      <h4 className={`font-display font-bold mb-2 ${
                        isCorrect ? 'text-neon-green' : 'text-neon-orange'
                      }`}>
                        {isCorrect ? 'Correct! +100 points' : 'Not quite!'}
                      </h4>
                      <p className="text-text-secondary">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl font-display font-bold text-white shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                  >
                    {session.currentIndex < session.questions.length - 1
                      ? 'Next Question →'
                      : 'See Results 🏆'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-2 mt-6">
        {session.questions.map((_, index) => {
          const answer = session.answers[index];
          const question = session.questions[index];
          const isAnswered = answer !== null;
          const wasCorrect = isAnswered && answer === question.correctAnswer;

          return (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === session.currentIndex
                  ? 'bg-neon-cyan scale-125'
                  : isAnswered
                  ? wasCorrect
                    ? 'bg-neon-green'
                    : 'bg-neon-red'
                  : 'bg-white/20'
              }`}
            />
          );
        })}
      </div>

      {/* Keyboard hint */}
      <div className="text-center text-text-muted text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-bg-secondary rounded text-neon-cyan">Esc</kbd> to pause
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-neon-green/20 text-neon-green';
    case 'explorer':
      return 'bg-neon-cyan/20 text-neon-cyan';
    case 'astronaut':
      return 'bg-neon-orange/20 text-neon-orange';
    case 'commander':
      return 'bg-neon-red/20 text-neon-red';
    default:
      return 'bg-white/20 text-white';
  }
}

export default SpaceQuiz;
