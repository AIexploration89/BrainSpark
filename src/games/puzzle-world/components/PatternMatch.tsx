import { motion } from 'framer-motion';
import { usePuzzleGameStore } from '../stores/puzzleStore';
import type { Level, PatternShape, PatternColor } from '../types';

interface PatternMatchProps {
  level: Level;
  onPause: () => void;
}

// Shape SVG paths
const SHAPE_PATHS: Record<PatternShape, string> = {
  circle: 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10',
  square: 'M15,15 L85,15 L85,85 L15,85 Z',
  triangle: 'M50,10 L90,85 L10,85 Z',
  diamond: 'M50,5 L95,50 L50,95 L5,50 Z',
  star: 'M50,5 L61,40 L98,40 L68,62 L79,97 L50,75 L21,97 L32,62 L2,40 L39,40 Z',
  hexagon: 'M50,5 L90,27 L90,73 L50,95 L10,73 L10,27 Z',
};

// Color mappings
const COLOR_MAP: Record<PatternColor, { fill: string; glow: string; border: string }> = {
  cyan: {
    fill: 'rgba(0,245,255,0.8)',
    glow: 'rgba(0,245,255,0.6)',
    border: 'rgba(0,245,255,1)',
  },
  pink: {
    fill: 'rgba(255,0,255,0.8)',
    glow: 'rgba(255,0,255,0.6)',
    border: 'rgba(255,0,255,1)',
  },
  green: {
    fill: 'rgba(0,255,136,0.8)',
    glow: 'rgba(0,255,136,0.6)',
    border: 'rgba(0,255,136,1)',
  },
  purple: {
    fill: 'rgba(139,92,246,0.8)',
    glow: 'rgba(139,92,246,0.6)',
    border: 'rgba(139,92,246,1)',
  },
  yellow: {
    fill: 'rgba(255,229,92,0.8)',
    glow: 'rgba(255,229,92,0.6)',
    border: 'rgba(255,229,92,1)',
  },
  orange: {
    fill: 'rgba(255,107,53,0.8)',
    glow: 'rgba(255,107,53,0.6)',
    border: 'rgba(255,107,53,1)',
  },
};

export function PatternMatch({ level, onPause }: PatternMatchProps) {
  const {
    patternCards,
    matchedPairs,
    moves,
    elapsedTime,
    hintsUsed,
    flipCard,
    useHint,
  } = usePuzzleGameStore();

  const pairs = level.pairs || 4;
  const totalCards = pairs * 2;

  // Calculate grid columns based on total cards
  const cols = totalCards <= 8 ? 4 : totalCards <= 12 ? 4 : totalCards <= 20 ? 5 : 6;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate time remaining for levels with time limit
  const timeRemaining = level.timeLimit ? Math.max(0, level.timeLimit - elapsedTime) : null;
  const isLowTime = timeRemaining !== null && timeRemaining < 30;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative overflow-hidden">
      {/* CRT Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.1) 2px, rgba(255,0,255,0.1) 4px)',
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,255,0.15) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,0,255,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-neon-pink/30 text-neon-pink hover:border-neon-pink/60 transition-all"
          >
            <span className="text-xl">⏸</span>
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-lg">{level.name}</h2>
            <p className="text-xs text-text-muted font-mono">
              {pairs} PAIRS • LEVEL {level.id}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Pairs found */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Matched</p>
            <p className="font-mono font-bold text-lg text-neon-green">
              {matchedPairs}/{pairs}
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

          {/* Moves */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Flips</p>
            <p className="font-mono font-bold text-lg text-neon-pink">{moves}</p>
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

      {/* Card Grid */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 80px))`,
          }}
        >
          {patternCards.map((card, index) => {
            const colors = COLOR_MAP[card.color];

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
                className="relative perspective-1000"
                style={{ aspectRatio: '1' }}
              >
                <motion.button
                  animate={{
                    rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                  onClick={() => flipCard(card.id)}
                  disabled={card.isFlipped || card.isMatched}
                  className="w-full h-full relative preserve-3d cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.95) 100%)',
                      border: '2px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,0,255,0.05)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Question mark pattern */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl text-neon-pink/40 font-display font-bold"
                    >
                      ?
                    </motion.div>

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-neon-pink/30 rounded-tl-sm" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-neon-pink/30 rounded-tr-sm" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-neon-pink/30 rounded-bl-sm" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-neon-pink/30 rounded-br-sm" />
                  </div>

                  {/* Card Front */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{
                      background: card.isMatched
                        ? `linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0.05) 100%)`
                        : 'linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.95) 100%)',
                      border: card.isMatched
                        ? '2px solid rgba(0,255,136,0.6)'
                        : `2px solid ${colors.border}`,
                      boxShadow: card.isMatched
                        ? '0 0 30px rgba(0,255,136,0.4)'
                        : `0 0 25px ${colors.glow}`,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {/* Shape */}
                    <svg viewBox="0 0 100 100" className="w-12 h-12">
                      <defs>
                        <filter id={`glow-${card.id}`}>
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <path
                        d={SHAPE_PATHS[card.shape]}
                        fill={card.isMatched ? 'rgba(0,255,136,0.8)' : colors.fill}
                        stroke={card.isMatched ? 'rgba(0,255,136,1)' : colors.border}
                        strokeWidth="3"
                        filter={`url(#glow-${card.id})`}
                      />
                    </svg>

                    {/* Matched checkmark */}
                    {card.isMatched && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-1 right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center"
                        style={{ boxShadow: '0 0 10px rgba(0,255,136,0.6)' }}
                      >
                        <span className="text-xs text-black font-bold">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-md"
        >
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>Progress</span>
            <span>{Math.round((matchedPairs / pairs) * 100)}%</span>
          </div>
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(matchedPairs / pairs) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FF00FF, #00F5FF)',
                boxShadow: '0 0 10px rgba(255,0,255,0.5)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-text-secondary text-sm mt-4 relative z-10">
        Find matching pairs of shapes!
      </div>
    </div>
  );
}
