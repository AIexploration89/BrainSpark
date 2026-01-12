import { motion } from 'framer-motion';
import type { CommandType, CommandBlock as CommandBlockType } from '../types';
import { COMMAND_DEFINITIONS } from '../types';

interface CommandBlockProps {
  block: CommandBlockType;
  onRemove?: () => void;
  onValueChange?: (value: number) => void;
  isActive?: boolean;
  isDragging?: boolean;
  compact?: boolean;
}

export function CommandBlock({
  block,
  onRemove,
  onValueChange,
  isActive,
  isDragging,
  compact,
}: CommandBlockProps) {
  const definition = COMMAND_DEFINITIONS[block.type];

  // Get block category for styling
  const getBlockCategory = (type: CommandType) => {
    if (type.startsWith('move') || type === 'jump') return 'movement';
    if (type.startsWith('turn')) return 'rotation';
    if (type.startsWith('loop')) return 'loop';
    if (type.startsWith('if')) return 'conditional';
    return 'action';
  };

  const category = getBlockCategory(block.type);

  // Block shape based on type
  const getBlockShape = () => {
    switch (category) {
      case 'loop':
        return 'rounded-xl border-l-4';
      case 'conditional':
        return 'rounded-xl border-l-4';
      default:
        return 'rounded-lg';
    }
  };

  // Nesting indent
  const indent = block.nestLevel * 16;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isDragging ? 1.05 : 1,
        boxShadow: isActive
          ? `0 0 20px ${definition.color}80, 0 0 40px ${definition.color}40`
          : isDragging
            ? `0 0 30px ${definition.color}60`
            : `0 0 10px ${definition.color}30`,
      }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative flex items-center gap-2
        ${compact ? 'px-2 py-1' : 'px-3 py-2'}
        ${getBlockShape()}
        bg-bg-secondary/90 backdrop-blur
        border border-white/10
        cursor-grab active:cursor-grabbing
        select-none
        transition-colors
      `}
      style={{
        marginLeft: indent,
        borderLeftColor: category === 'loop' || category === 'conditional' ? definition.color : undefined,
        borderLeftWidth: category === 'loop' || category === 'conditional' ? 4 : undefined,
      }}
    >
      {/* Block icon */}
      <div
        className={`
          flex items-center justify-center
          ${compact ? 'w-6 h-6 text-sm' : 'w-8 h-8 text-lg'}
          rounded-md font-bold
        `}
        style={{
          background: `linear-gradient(135deg, ${definition.color}30, ${definition.color}10)`,
          color: definition.color,
          textShadow: `0 0 10px ${definition.color}`,
        }}
      >
        {definition.icon}
      </div>

      {/* Block label */}
      <span
        className={`
          font-mono font-semibold uppercase tracking-wider
          ${compact ? 'text-xs' : 'text-sm'}
        `}
        style={{ color: definition.color }}
      >
        {definition.label}
      </span>

      {/* Value input for loops */}
      {block.type === 'loop_start' && (
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onValueChange && (block.value || 2) > 1) {
                onValueChange((block.value || 2) - 1);
              }
            }}
            className="w-5 h-5 rounded bg-bg-tertiary hover:bg-neon-purple/20 text-neon-purple text-xs font-bold transition-colors"
          >
            -
          </button>
          <span
            className="w-6 text-center font-mono font-bold text-neon-purple"
            style={{ textShadow: '0 0 5px rgba(139,92,246,0.5)' }}
          >
            {block.value || 2}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onValueChange && (block.value || 2) < 10) {
                onValueChange((block.value || 2) + 1);
              }
            }}
            className="w-5 h-5 rounded bg-bg-tertiary hover:bg-neon-purple/20 text-neon-purple text-xs font-bold transition-colors"
          >
            +
          </button>
        </div>
      )}

      {/* Remove button */}
      {onRemove && !compact && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-auto w-6 h-6 rounded-full bg-bg-tertiary hover:bg-neon-red/20 text-text-muted hover:text-neon-red text-xs font-bold transition-colors flex items-center justify-center"
        >
          ×
        </button>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `2px solid ${definition.color}`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
        />
      )}

      {/* Execution pulse */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${definition.color}40 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}

interface BlockPaletteProps {
  availableCommands: CommandType[];
  onAddBlock: (type: CommandType) => void;
  disabled?: boolean;
}

export function BlockPalette({ availableCommands, onAddBlock, disabled }: BlockPaletteProps) {
  // Group commands by category
  const categories = {
    movement: ['move_forward', 'move_backward', 'jump'] as CommandType[],
    rotation: ['turn_left', 'turn_right'] as CommandType[],
    action: ['wait', 'interact'] as CommandType[],
    loop: ['loop_start', 'loop_end'] as CommandType[],
    conditional: ['if_start', 'if_else', 'if_end'] as CommandType[],
  };

  const groupedCommands = Object.entries(categories)
    .map(([category, types]) => ({
      category,
      commands: types.filter(t => availableCommands.includes(t)),
    }))
    .filter(g => g.commands.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
          Commands
        </h3>
      </div>

      {groupedCommands.map(({ category, commands }) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs text-text-muted uppercase tracking-wider font-mono">
            {category}
          </h4>
          <div className="flex flex-wrap gap-2">
            {commands.map((type) => {
              const def = COMMAND_DEFINITIONS[type];
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: disabled ? 1 : 1.05 }}
                  whileTap={{ scale: disabled ? 1 : 0.95 }}
                  onClick={() => !disabled && onAddBlock(type)}
                  disabled={disabled}
                  className={`
                    flex items-center gap-1.5 px-2 py-1.5 rounded-lg
                    bg-bg-tertiary/80 border border-white/10
                    font-mono text-xs font-semibold uppercase
                    transition-all
                    ${disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-white/30 cursor-pointer'
                    }
                  `}
                  style={{
                    color: def.color,
                    boxShadow: disabled ? 'none' : `0 0 10px ${def.color}20`,
                  }}
                >
                  <span
                    className="w-5 h-5 flex items-center justify-center rounded text-sm"
                    style={{
                      background: `${def.color}20`,
                    }}
                  >
                    {def.icon}
                  </span>
                  <span className="hidden sm:inline">{def.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Drag hint */}
      <div className="mt-4 p-3 bg-bg-tertiary/50 rounded-lg border border-white/5">
        <p className="text-xs text-text-muted">
          <span className="text-neon-cyan">Tip:</span> Click commands to add them to your program.
          Drag to reorder blocks.
        </p>
      </div>
    </div>
  );
}

export default CommandBlock;
