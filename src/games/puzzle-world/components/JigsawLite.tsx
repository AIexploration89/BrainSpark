import { useRef } from 'react';
import { motion } from 'framer-motion';
import { usePuzzleGameStore } from '../stores/puzzleStore';
import type { Level } from '../types';

interface JigsawLiteProps {
  level: Level;
  onPause: () => void;
}

// Theme color mappings
const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  geometric: { primary: '#00F5FF', secondary: '#FF00FF', accent: '#00FF88' },
  animals: { primary: '#FF6B35', secondary: '#FFE55C', accent: '#00FF88' },
  space: { primary: '#8B5CF6', secondary: '#00F5FF', accent: '#FF00FF' },
  nature: { primary: '#00FF88', secondary: '#FFE55C', accent: '#00F5FF' },
  robots: { primary: '#FF00FF', secondary: '#00F5FF', accent: '#FFE55C' },
  ocean: { primary: '#00F5FF', secondary: '#00FF88', accent: '#8B5CF6' },
  city: { primary: '#FFE55C', secondary: '#FF6B35', accent: '#FF00FF' },
  abstract: { primary: '#FF00FF', secondary: '#00F5FF', accent: '#FFE55C' },
};

// Theme color mappings are used for piece styling below

export function JigsawLite({ level, onPause }: JigsawLiteProps) {
  const {
    jigsawPieces,
    selectedPiece,
    placedPieces,
    moves,
    elapsedTime,
    hintsUsed,
    selectJigsawPiece,
    placeJigsawPiece,
    useHint,
  } = usePuzzleGameStore();

  const boardRef = useRef<HTMLDivElement>(null);

  const pieceCount = level.pieceCount || 4;
  const cols = Math.ceil(Math.sqrt(pieceCount));
  const rows = Math.ceil(pieceCount / cols);
  const theme = level.imageTheme || 'geometric';
  const colors = THEME_COLORS[theme] || THEME_COLORS.geometric;

  // Calculate piece size based on grid
  const pieceSize = Math.min(80, 320 / cols);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate time remaining for levels with time limit
  const timeRemaining = level.timeLimit ? Math.max(0, level.timeLimit - elapsedTime) : null;
  const isLowTime = timeRemaining !== null && timeRemaining < 30;

  // Handle click on board to place piece
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedPiece === null || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to grid
    const gridX = Math.round(x / pieceSize) * pieceSize;
    const gridY = Math.round(y / pieceSize) * pieceSize;

    placeJigsawPiece({ x: gridX, y: gridY });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative overflow-hidden">
      {/* CRT Scanlines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)',
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${colors.primary}15 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, ${colors.secondary}15 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, ${colors.accent}10 0%, transparent 60%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,255,136,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-neon-green/30 text-neon-green hover:border-neon-green/60 transition-all"
          >
            <span className="text-xl">⏸</span>
          </motion.button>
          <div>
            <h2 className="font-display font-bold text-white text-lg">{level.name}</h2>
            <p className="text-xs text-text-muted font-mono">
              {pieceCount} PIECES • {theme.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Pieces placed */}
          <div className="text-center px-4 py-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Placed</p>
            <p className="font-mono font-bold text-lg text-neon-green">
              {placedPieces}/{pieceCount}
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
                {(level.hints || 0) - hintsUsed}
              </p>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10">
        {/* Puzzle Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <p className="text-text-muted text-sm text-center mb-4">
            {selectedPiece !== null ? 'Click on the board to place the piece' : 'Select a piece from the tray'}
          </p>

          {/* Board container */}
          <div
            ref={boardRef}
            onClick={handleBoardClick}
            className="relative rounded-2xl cursor-crosshair"
            style={{
              width: cols * pieceSize + 32,
              height: rows * pieceSize + 32,
              background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,245,255,0.1) 100%)',
              boxShadow: '0 0 60px rgba(0,255,136,0.2), inset 0 0 60px rgba(0,0,0,0.3)',
              border: '2px solid rgba(0,255,136,0.3)',
              padding: 16,
            }}
          >
            {/* Grid lines */}
            <div
              className="absolute inset-4 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)
                `,
                backgroundSize: `${pieceSize}px ${pieceSize}px`,
              }}
            />

            {/* Target slots */}
            {Array.from({ length: pieceCount }).map((_, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const isOccupied = jigsawPieces.some(
                (p) => p.isPlaced && p.correctPosition.x === col * pieceSize && p.correctPosition.y === row * pieceSize
              );

              return (
                <motion.div
                  key={`slot-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOccupied ? 0.3 : 0.6 }}
                  className="absolute rounded-lg"
                  style={{
                    width: pieceSize - 4,
                    height: pieceSize - 4,
                    left: col * pieceSize + 2,
                    top: row * pieceSize + 2,
                    border: isOccupied ? 'none' : '2px dashed rgba(0,255,136,0.4)',
                    background: isOccupied ? 'transparent' : 'rgba(0,255,136,0.05)',
                  }}
                />
              );
            })}

            {/* Placed pieces on board */}
            {jigsawPieces
              .filter((piece) => piece.isPlaced)
              .map((piece) => (
                <motion.div
                  key={`placed-${piece.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute rounded-lg overflow-hidden"
                  style={{
                    width: pieceSize - 4,
                    height: pieceSize - 4,
                    left: piece.correctPosition.x + 2,
                    top: piece.correctPosition.y + 2,
                    background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)`,
                    border: `2px solid ${colors.primary}`,
                    boxShadow: `0 0 20px ${colors.primary}60`,
                  }}
                >
                  {/* Piece number */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="font-display font-bold text-white text-xl"
                      style={{ textShadow: `0 0 10px ${colors.primary}` }}
                    >
                      {piece.id + 1}
                    </span>
                  </div>

                  {/* Holographic shimmer */}
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 200%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                    }}
                  />

                  {/* Checkmark */}
                  <div
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: colors.primary }}
                  >
                    <span className="text-xs text-black font-bold">✓</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Piece Tray */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <p className="text-text-muted text-sm mb-4">Available Pieces</p>

          <div
            className="p-4 rounded-2xl grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(4, pieceCount - placedPieces)}, 1fr)`,
              background: 'linear-gradient(135deg, rgba(30,30,45,0.9) 0%, rgba(20,20,35,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
              minWidth: 200,
            }}
          >
            {jigsawPieces
              .filter((piece) => !piece.isPlaced)
              .map((piece, index) => (
                <motion.button
                  key={`tray-${piece.id}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring' }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: `0 0 30px ${colors.primary}80`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectJigsawPiece(piece.id)}
                  className={`
                    relative rounded-lg cursor-pointer transition-all
                    ${selectedPiece === piece.id
                      ? 'ring-2 ring-neon-yellow scale-105'
                      : ''
                    }
                  `}
                  style={{
                    width: 60,
                    height: 60,
                    background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.secondary}30 100%)`,
                    border: selectedPiece === piece.id
                      ? `2px solid ${colors.accent}`
                      : `2px solid ${colors.primary}50`,
                    boxShadow: selectedPiece === piece.id
                      ? `0 0 25px ${colors.accent}60`
                      : `0 0 15px ${colors.primary}30`,
                  }}
                >
                  {/* Piece number */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="font-display font-bold text-white text-lg"
                      style={{ textShadow: `0 0 10px ${colors.primary}` }}
                    >
                      {piece.id + 1}
                    </span>
                  </div>

                  {/* Selection indicator */}
                  {selectedPiece === piece.id && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-neon-yellow rounded-full"
                      style={{ boxShadow: '0 0 10px rgba(255,229,92,0.8)' }}
                    />
                  )}
                </motion.button>
              ))}

            {jigsawPieces.filter((p) => !p.isPlaced).length === 0 && (
              <p className="text-text-muted text-sm col-span-full text-center py-4">
                All pieces placed! 🎉
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 w-full max-w-md mx-auto relative z-10"
      >
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Progress</span>
          <span>{Math.round((placedPieces / pieceCount) * 100)}%</span>
        </div>
        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(placedPieces / pieceCount) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: `0 0 10px ${colors.primary}`,
            }}
          />
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="text-center text-text-muted text-sm mt-4 relative z-10">
        Press{' '}
        <kbd className="px-2 py-1 bg-bg-secondary rounded border border-white/10 text-neon-green font-mono">
          Esc
        </kbd>{' '}
        to pause
      </div>
    </div>
  );
}
