import { motion, AnimatePresence } from 'framer-motion';
import type { Tile, Robot, Direction } from '../types';
import { TILE_CONFIGS } from '../types';

interface CodeGridProps {
  tiles: Tile[];
  gridSize: { rows: number; cols: number };
  robot: Robot;
  isExecuting?: boolean;
}

// Robot direction to rotation mapping
const DIRECTION_ROTATION: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

export function CodeGrid({ tiles, gridSize, robot, isExecuting }: CodeGridProps) {
  const tileSize = Math.min(60, Math.floor(400 / Math.max(gridSize.rows, gridSize.cols)));

  return (
    <div className="relative">
      {/* Circuit board background pattern */}
      <div
        className="absolute inset-0 -m-4 rounded-2xl opacity-30"
        style={{
          background: `
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(0,255,136,0.05) 0%, transparent 50%)
          `,
          backgroundSize: '20px 20px, 20px 20px, 100% 100%',
        }}
      />

      {/* Grid container */}
      <div
        className="relative grid gap-1 p-4 bg-bg-secondary/80 rounded-2xl border border-neon-green/30"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridSize.rows}, ${tileSize}px)`,
          boxShadow: '0 0 40px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)',
          }}
        />

        {/* Tiles */}
        {tiles.map((tile) => (
          <GridTile key={tile.id} tile={tile} size={tileSize} />
        ))}

        {/* Robot */}
        <RobotSprite
          robot={robot}
          tileSize={tileSize}
          isExecuting={isExecuting}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon-green/50 rounded-tl" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-green/50 rounded-tr" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-green/50 rounded-bl" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon-green/50 rounded-br" />
    </div>
  );
}

interface GridTileProps {
  tile: Tile;
  size: number;
}

function GridTile({ tile, size }: GridTileProps) {
  const config = TILE_CONFIGS[tile.type];

  // Get tile styling based on type
  const getTileStyle = () => {
    switch (tile.type) {
      case 'wall':
        return {
          background: 'linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
          border: '2px solid #3d3d5c',
        };
      case 'start':
        return {
          background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
          border: '2px solid rgba(0,255,136,0.5)',
          boxShadow: '0 0 15px rgba(0,255,136,0.3)',
        };
      case 'goal':
        return {
          background: 'radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)',
          border: '2px solid rgba(255,0,255,0.5)',
          boxShadow: '0 0 15px rgba(255,0,255,0.3)',
        };
      case 'coin':
        return {
          background: 'radial-gradient(circle, rgba(255,255,0,0.2) 0%, transparent 70%)',
          border: '1px solid rgba(255,255,0,0.3)',
        };
      case 'gem':
        return {
          background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, transparent 70%)',
          border: '1px solid rgba(0,245,255,0.3)',
        };
      case 'spike':
        return {
          background: 'radial-gradient(circle, rgba(255,51,102,0.3) 0%, transparent 70%)',
          border: '1px solid rgba(255,51,102,0.5)',
        };
      case 'pit':
        return {
          background: 'radial-gradient(circle, #000 0%, #0a0a0f 100%)',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)',
          border: '2px solid #1a1a2e',
        };
      case 'button':
        return {
          background: tile.isActive
            ? 'radial-gradient(circle, rgba(255,136,0,0.5) 0%, rgba(255,136,0,0.2) 70%)'
            : 'radial-gradient(circle, rgba(255,136,0,0.2) 0%, transparent 70%)',
          border: '2px solid rgba(255,136,0,0.5)',
        };
      case 'door':
        return {
          background: tile.isActive
            ? 'transparent'
            : 'linear-gradient(135deg, #4a3b8a 0%, #2d2d44 100%)',
          border: tile.isActive ? '1px dashed rgba(139,92,246,0.3)' : '2px solid #8b5cf6',
          boxShadow: tile.isActive ? 'none' : '0 0 10px rgba(139,92,246,0.3)',
        };
      case 'ice':
        return {
          background: 'linear-gradient(135deg, rgba(160,231,255,0.3) 0%, rgba(160,231,255,0.1) 100%)',
          border: '1px solid rgba(160,231,255,0.5)',
        };
      default:
        return {
          background: '#16161f',
          border: '1px solid rgba(255,255,255,0.05)',
        };
    }
  };

  return (
    <motion.div
      className="relative flex items-center justify-center rounded-lg overflow-hidden"
      style={{
        width: size,
        height: size,
        ...getTileStyle(),
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: (tile.position.row * 0.05 + tile.position.col * 0.05) }}
    >
      {/* Tile content */}
      {config.emoji && (
        <motion.span
          className="text-2xl"
          animate={tile.type === 'goal' ? {
            scale: [1, 1.1, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
          } : tile.type === 'coin' ? {
            rotateY: [0, 360],
          } : {}}
          transition={{
            duration: tile.type === 'goal' ? 1.5 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            fontSize: size * 0.5,
            filter: tile.type === 'goal' ? 'drop-shadow(0 0 8px rgba(255,0,255,0.8))' :
              tile.type === 'coin' ? 'drop-shadow(0 0 5px rgba(255,255,0,0.8))' :
                tile.type === 'gem' ? 'drop-shadow(0 0 5px rgba(0,245,255,0.8))' : 'none',
          }}
        >
          {config.emoji}
        </motion.span>
      )}

      {/* Grid coordinates overlay (subtle) */}
      {tile.type === 'floor' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="font-mono text-xs text-white/50">
            {tile.position.row},{tile.position.col}
          </span>
        </div>
      )}
    </motion.div>
  );
}

interface RobotSpriteProps {
  robot: Robot;
  tileSize: number;
  isExecuting?: boolean;
}

function RobotSprite({ robot, tileSize, isExecuting }: RobotSpriteProps) {
  const rotation = DIRECTION_ROTATION[robot.direction];

  // Calculate pixel position
  const x = robot.position.col * (tileSize + 4) + 16; // 4px gap + 16px padding
  const y = robot.position.row * (tileSize + 4) + 16;

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      style={{
        width: tileSize,
        height: tileSize,
      }}
      animate={{
        x,
        y,
        rotate: rotation,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
    >
      {/* Robot glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Robot body */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main body */}
        <motion.div
          className="relative"
          animate={isExecuting ? {
            y: [0, -3, 0],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isExecuting ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {/* Robot SVG */}
          <svg
            viewBox="0 0 64 64"
            width={tileSize * 0.8}
            height={tileSize * 0.8}
            className="drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]"
          >
            {/* Body */}
            <rect
              x="16"
              y="24"
              width="32"
              height="28"
              rx="4"
              fill="#1a1a2e"
              stroke="#00ff88"
              strokeWidth="2"
            />

            {/* Head */}
            <rect
              x="20"
              y="8"
              width="24"
              height="20"
              rx="4"
              fill="#1a1a2e"
              stroke="#00ff88"
              strokeWidth="2"
            />

            {/* Eyes */}
            <motion.circle
              cx="28"
              cy="18"
              r="4"
              fill="#00ff88"
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.circle
              cx="36"
              cy="18"
              r="4"
              fill="#00ff88"
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />

            {/* Antenna */}
            <line
              x1="32"
              y1="8"
              x2="32"
              y2="2"
              stroke="#00ff88"
              strokeWidth="2"
            />
            <circle
              cx="32"
              cy="2"
              r="2"
              fill="#ff00ff"
            />

            {/* Direction indicator (arrow) */}
            <motion.path
              d="M 32 56 L 28 64 L 32 60 L 36 64 Z"
              fill="#00ff88"
              animate={{
                y: [0, 3, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Chest panel */}
            <rect
              x="24"
              y="32"
              width="16"
              height="12"
              rx="2"
              fill="#0a0a0f"
              stroke="#00f5ff"
              strokeWidth="1"
            />

            {/* Panel lights */}
            <motion.circle
              cx="28"
              cy="36"
              r="2"
              fill="#ff00ff"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
            <motion.circle
              cx="36"
              cy="36"
              r="2"
              fill="#00f5ff"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Jump arc effect */}
      <AnimatePresence>
        {robot.isJumping && (
          <motion.div
            className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-neon-green"
            initial={{ opacity: 0, scale: 0, x: '-50%' }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CodeGrid;
