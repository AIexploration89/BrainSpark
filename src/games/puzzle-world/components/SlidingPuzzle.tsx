import { motion, AnimatePresence } from 'framer-motion';
import { usePuzzleGameStore } from '../stores/puzzleStore';
import type { Level } from '../types';

interface SlidingPuzzleProps {
  level: Level;
  onPause: () => void;
}

export function SlidingPuzzle({ level, onPause }: SlidingPuzzleProps) {
  const { slidingTiles, emptyPosition, moves, elapsedTime, hintsUsed, moveTile, useHint } =
    usePuzzleGameStore();

  const gridSize = level.gridSize || 3;
  const tileSize = Math.min(80, 320 / gridSize);

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
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
        }}
      />

      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <motion.div
          animate={{ y: [0, 50], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,245,255,0.05) 50%, transparent 100%)',
            height: '200%',
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,245,255,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/60 transition-all"
          >
            <span className="text-xl">⏸</span>
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-lg">{level.name}</h2>
            <p className="text-xs text-text-muted font-mono">
              GRID {gridSize}×{gridSize} • LEVEL {level.id}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
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
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Moves</p>
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
                {(level.hints || 0) - hintsUsed}/{level.hints || 0}
              </p>
            </motion.button>
          )}
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Glowing container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(255,0,255,0.1) 100%)',
            boxShadow: '0 0 60px rgba(0,245,255,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Grid background with holographic effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(0,245,255,0.2) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(255,0,255,0.2) 0%, transparent 50%)
              `,
            }}
          />

          <div
            className="grid gap-2 relative"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
            }}
          >
            <AnimatePresence>
              {slidingTiles.map((tile) => {
                if (tile.value === null) return null;

                const row = Math.floor(tile.position / gridSize);
                const col = tile.position % gridSize;

                return (
                  <motion.button
                    key={tile.id}
                    layout
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      x: col * (tileSize + 8),
                      y: row * (tileSize + 8),
                    }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      layout: { duration: 0.2 },
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(0,245,255,0.6)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => moveTile(tile.position)}
                    className="absolute flex items-center justify-center rounded-lg cursor-pointer overflow-hidden"
                    style={{
                      width: tileSize,
                      height: tileSize,
                      background: tile.isCorrect
                        ? 'linear-gradient(135deg, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(0,245,255,0.3) 0%, rgba(255,0,255,0.3) 100%)',
                      border: tile.isCorrect
                        ? '2px solid rgba(0,255,136,0.6)'
                        : '2px solid rgba(0,245,255,0.4)',
                      boxShadow: tile.isCorrect
                        ? '0 0 20px rgba(0,255,136,0.4), inset 0 0 20px rgba(0,255,136,0.1)'
                        : '0 0 20px rgba(0,245,255,0.3), inset 0 0 20px rgba(255,0,255,0.1)',
                    }}
                  >
                    {/* Holographic shimmer */}
                    <motion.div
                      animate={{
                        backgroundPosition: ['0% 0%', '200% 200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 opacity-30"
                      style={{
                        background:
                          'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                      }}
                    />

                    {/* Tile number */}
                    <span
                      className="font-display font-bold text-white relative z-10"
                      style={{
                        fontSize: tileSize * 0.4,
                        textShadow: tile.isCorrect
                          ? '0 0 10px rgba(0,255,136,0.8)'
                          : '0 0 10px rgba(0,245,255,0.8)',
                      }}
                    >
                      {tile.value}
                    </span>

                    {/* Corner accents */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/30" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/30" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/30" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30" />
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {/* Empty slot glow */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute rounded-lg"
              style={{
                width: tileSize,
                height: tileSize,
                left: (emptyPosition % gridSize) * (tileSize + 8),
                top: Math.floor(emptyPosition / gridSize) * (tileSize + 8),
                background: 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, transparent 70%)',
                border: '2px dashed rgba(255,0,255,0.3)',
              }}
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-text-secondary text-sm text-center"
        >
          Click tiles adjacent to the empty space to move them
        </motion.p>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-text-muted text-sm mt-4 relative z-10">
        Press{' '}
        <kbd className="px-2 py-1 bg-bg-secondary rounded border border-white/10 text-neon-cyan font-mono">
          Esc
        </kbd>{' '}
        to pause
      </div>
    </div>
  );
}
