import { motion, AnimatePresence } from 'framer-motion';
import type { Problem, NumberAnimationState } from '../types';

interface EquationDisplayProps {
  problem: Problem;
  userAnswer: string;
  animationState: NumberAnimationState;
  showResult?: boolean;
  isCorrect?: boolean;
}

// LED-style digit segments - each number is represented by 7 segments
const LED_SEGMENTS: Record<string, boolean[]> = {
  //       top, topL, topR, mid, botL, botR, bot
  '0': [true,  true,  true,  false, true,  true,  true],
  '1': [false, false, true,  false, false, true,  false],
  '2': [true,  false, true,  true,  true,  false, true],
  '3': [true,  false, true,  true,  false, true,  true],
  '4': [false, true,  true,  true,  false, true,  false],
  '5': [true,  true,  false, true,  false, true,  true],
  '6': [true,  true,  false, true,  true,  true,  true],
  '7': [true,  false, true,  false, false, true,  false],
  '8': [true,  true,  true,  true,  true,  true,  true],
  '9': [true,  true,  true,  true,  false, true,  true],
  '-': [false, false, false, true,  false, false, false],
  '+': [false, false, false, false, false, false, false], // Special handling
  '×': [false, false, false, false, false, false, false], // Special handling
  '÷': [false, false, false, false, false, false, false], // Special handling
  '=': [false, false, false, false, false, false, false], // Special handling
  '?': [true,  false, true,  true,  true,  false, false],
  ' ': [false, false, false, false, false, false, false],
};

// Single LED digit component
function LEDDigit({
  char,
  color = 'neon-green',
  size = 'md',
  glow = true,
}: {
  char: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
}) {
  const segments = LED_SEGMENTS[char] || LED_SEGMENTS[' '];

  const sizeClasses = {
    sm: { width: 20, height: 36, segment: 3 },
    md: { width: 32, height: 56, segment: 4 },
    lg: { width: 48, height: 84, segment: 6 },
    xl: { width: 64, height: 112, segment: 8 },
  };

  const { width, height, segment } = sizeClasses[size];
  const halfHeight = height / 2;

  // Special characters rendering
  if (char === '+') {
    return (
      <div
        className={`relative flex items-center justify-center ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
        style={{ width, height, color: `var(--color-${color})` }}
      >
        <div className="absolute w-[60%] h-[15%] rounded-full bg-current" />
        <div className="absolute w-[15%] h-[60%] rounded-full bg-current" />
      </div>
    );
  }

  if (char === '−' || char === '-') {
    return (
      <div
        className={`relative flex items-center justify-center ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
        style={{ width, height, color: `var(--color-${color})` }}
      >
        <div className="absolute w-[60%] h-[15%] rounded-full bg-current" />
      </div>
    );
  }

  if (char === '×') {
    return (
      <div
        className={`relative flex items-center justify-center ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
        style={{ width, height, color: `var(--color-${color})` }}
      >
        <div className="absolute w-[60%] h-[15%] rounded-full bg-current rotate-45" />
        <div className="absolute w-[60%] h-[15%] rounded-full bg-current -rotate-45" />
      </div>
    );
  }

  if (char === '÷') {
    return (
      <div
        className={`relative flex items-center justify-center ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
        style={{ width, height, color: `var(--color-${color})` }}
      >
        <div className="absolute top-[25%] w-[20%] h-[20%] rounded-full bg-current" />
        <div className="absolute w-[60%] h-[15%] rounded-full bg-current" />
        <div className="absolute bottom-[25%] w-[20%] h-[20%] rounded-full bg-current" />
      </div>
    );
  }

  if (char === '=') {
    return (
      <div
        className={`relative flex items-center justify-center ${glow ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}
        style={{ width, height, color: `var(--color-${color})` }}
      >
        <div className="absolute top-[35%] w-[60%] h-[12%] rounded-full bg-current" />
        <div className="absolute bottom-[35%] w-[60%] h-[12%] rounded-full bg-current" />
      </div>
    );
  }

  if (char === '?') {
    return (
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={`relative flex items-center justify-center font-display font-bold ${glow ? 'drop-shadow-[0_0_15px_currentColor]' : ''}`}
        style={{ width, height, fontSize: height * 0.7, color: `var(--color-${color})` }}
      >
        ?
      </motion.div>
    );
  }

  if (char === ' ') {
    return <div style={{ width: width * 0.5, height }} />;
  }

  // Standard 7-segment LED display
  const activeColor = `var(--color-${color})`;
  const inactiveColor = 'rgba(0,255,136,0.1)';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={glow ? 'drop-shadow-[0_0_8px_currentColor]' : ''}
      style={{ color: activeColor }}
    >
      {/* Top segment */}
      <rect
        x={segment}
        y={0}
        width={width - segment * 2}
        height={segment}
        rx={segment / 2}
        fill={segments[0] ? activeColor : inactiveColor}
      />
      {/* Top-left segment */}
      <rect
        x={0}
        y={segment}
        width={segment}
        height={halfHeight - segment * 1.5}
        rx={segment / 2}
        fill={segments[1] ? activeColor : inactiveColor}
      />
      {/* Top-right segment */}
      <rect
        x={width - segment}
        y={segment}
        width={segment}
        height={halfHeight - segment * 1.5}
        rx={segment / 2}
        fill={segments[2] ? activeColor : inactiveColor}
      />
      {/* Middle segment */}
      <rect
        x={segment}
        y={halfHeight - segment / 2}
        width={width - segment * 2}
        height={segment}
        rx={segment / 2}
        fill={segments[3] ? activeColor : inactiveColor}
      />
      {/* Bottom-left segment */}
      <rect
        x={0}
        y={halfHeight + segment / 2}
        width={segment}
        height={halfHeight - segment * 1.5}
        rx={segment / 2}
        fill={segments[4] ? activeColor : inactiveColor}
      />
      {/* Bottom-right segment */}
      <rect
        x={width - segment}
        y={halfHeight + segment / 2}
        width={segment}
        height={halfHeight - segment * 1.5}
        rx={segment / 2}
        fill={segments[5] ? activeColor : inactiveColor}
      />
      {/* Bottom segment */}
      <rect
        x={segment}
        y={height - segment}
        width={width - segment * 2}
        height={segment}
        rx={segment / 2}
        fill={segments[6] ? activeColor : inactiveColor}
      />
    </svg>
  );
}

// LED Number Display (multiple digits)
function LEDNumber({
  value,
  color = 'neon-green',
  size = 'lg',
  minDigits = 1,
}: {
  value: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  minDigits?: number;
}) {
  const str = String(value).padStart(minDigits, ' ');

  return (
    <div className="flex items-center gap-1">
      {str.split('').map((char, i) => (
        <LEDDigit key={i} char={char} color={color} size={size} />
      ))}
    </div>
  );
}

// Operation symbol component
function OperationSymbol({
  operation,
  size = 'lg',
}: {
  operation: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const symbolMap: Record<string, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  };

  const symbol = symbolMap[operation] || operation;
  const colorMap: Record<string, string> = {
    '+': 'neon-green',
    '−': 'neon-cyan',
    '×': 'neon-orange',
    '÷': 'neon-pink',
  };

  return (
    <LEDDigit
      char={symbol}
      color={colorMap[symbol] || 'neon-green'}
      size={size}
    />
  );
}

export function EquationDisplay({
  problem,
  userAnswer,
  animationState,
  showResult = false,
  isCorrect,
}: EquationDisplayProps) {
  const resultColor = isCorrect ? 'neon-green' : 'neon-red';
  const displayAnswer = showResult ? String(problem.correctAnswer) : (userAnswer || '?');
  const answerColor = showResult
    ? resultColor
    : userAnswer
    ? 'neon-cyan'
    : 'neon-green';

  return (
    <div className="relative">
      {/* Background glow effect */}
      <motion.div
        animate={{
          opacity: animationState === 'correct' ? [0.5, 1, 0.5] : 0.3,
          scale: animationState === 'correct' ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: animationState === 'correct' ? 2 : 0 }}
        className={`absolute inset-0 -m-8 rounded-3xl blur-2xl ${
          animationState === 'correct'
            ? 'bg-neon-green/30'
            : animationState === 'wrong'
            ? 'bg-neon-red/30'
            : 'bg-neon-green/10'
        }`}
      />

      {/* Main equation container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: animationState === 'correct' ? [1, 1.05, 1] : animationState === 'wrong' ? [1, 0.95, 1] : 1,
          opacity: 1,
          x: animationState === 'wrong' ? [-5, 5, -5, 5, 0] : 0,
        }}
        transition={{
          duration: animationState === 'wrong' ? 0.4 : 0.3,
        }}
        className="relative bg-bg-secondary/80 backdrop-blur-sm rounded-2xl border-2 border-neon-green/30 p-6 sm:p-8"
        style={{
          boxShadow: animationState === 'correct'
            ? '0 0 40px rgba(0,255,136,0.4), inset 0 0 20px rgba(0,255,136,0.1)'
            : animationState === 'wrong'
            ? '0 0 40px rgba(255,51,102,0.4), inset 0 0 20px rgba(255,51,102,0.1)'
            : '0 0 30px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.05)',
        }}
      >
        {/* Equation line */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          {/* First number */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <LEDNumber value={problem.num1} size="lg" color="neon-green" />
          </motion.div>

          {/* Operation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <OperationSymbol operation={problem.operation} size="lg" />
          </motion.div>

          {/* Second number */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <LEDNumber value={problem.num2} size="lg" color="neon-green" />
          </motion.div>

          {/* Equals sign */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <LEDDigit char="=" color="neon-green" size="lg" />
          </motion.div>

          {/* Answer area */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative min-w-[80px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={displayAnswer}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <LEDNumber
                  value={displayAnswer}
                  size="lg"
                  color={answerColor}
                  minDigits={1}
                />
              </motion.div>
            </AnimatePresence>

            {/* Cursor blink when typing */}
            {!showResult && userAnswer && (
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-neon-cyan rounded-full"
              />
            )}
          </motion.div>
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-display font-bold text-sm ${
                isCorrect
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                  : 'bg-neon-red/20 text-neon-red border border-neon-red/30'
              }`}
            >
              {isCorrect ? 'CORRECT!' : `Answer: ${problem.correctAnswer}`}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Celebration particles for correct answers */}
      <AnimatePresence>
        {animationState === 'correct' && (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2 pointer-events-none"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    ['bg-neon-green', 'bg-neon-cyan', 'bg-neon-yellow'][i % 3]
                  }`}
                  style={{
                    boxShadow: '0 0 10px currentColor',
                  }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { LEDDigit, LEDNumber, OperationSymbol };
