import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { CommandBlock as CommandBlockType, CommandType } from '../types';
import { CommandBlock } from './CommandBlock';

interface CodeEditorProps {
  blocks: CommandBlockType[];
  maxBlocks: number;
  currentExecutionIndex?: number;
  isExecuting?: boolean;
  onAddBlock: (type: CommandType, index?: number) => void;
  onRemoveBlock: (instanceId: string) => void;
  onMoveBlock: (instanceId: string, newIndex: number) => void;
  onValueChange: (instanceId: string, value: number) => void;
  onClear: () => void;
}

export function CodeEditor({
  blocks,
  maxBlocks,
  currentExecutionIndex,
  isExecuting,
  onRemoveBlock,
  onValueChange,
  onClear,
}: CodeEditorProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Handle reorder
  const handleReorder = useCallback((_newOrder: CommandBlockType[]) => {
    // The Reorder component handles the visual reordering
    // We need to update our state to match
  }, []);

  // Calculate block line numbers
  const getLineNumber = (index: number) => {
    return String(index + 1).padStart(2, '0');
  };

  // Determine which block is active during execution
  const getActiveBlockId = () => {
    if (!isExecuting || currentExecutionIndex === undefined) return null;
    // In a real implementation, we'd track expanded loop positions
    // For now, approximate based on index
    if (currentExecutionIndex < blocks.length) {
      return blocks[currentExecutionIndex]?.instanceId;
    }
    return null;
  };

  const activeBlockId = getActiveBlockId();

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-tertiary/50 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Terminal dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-neon-red/80" />
            <div className="w-3 h-3 rounded-full bg-neon-yellow/80" />
            <div className="w-3 h-3 rounded-full bg-neon-green/80" />
          </div>
          <span className="font-mono text-xs text-text-muted">program.spark</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono">
            {blocks.length}/{maxBlocks} blocks
          </span>
          {blocks.length > 0 && !isExecuting && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="px-2 py-1 rounded text-xs font-mono text-neon-red hover:bg-neon-red/10 transition-colors"
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* Code area */}
      <div
        className="flex-1 overflow-auto p-4 bg-bg-secondary/30"
        style={{
          background: `
            linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px),
            #0a0a0f
          `,
          backgroundSize: '20px 20px',
        }}
      >
        {/* Empty state */}
        {blocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 mb-4 rounded-2xl bg-bg-tertiary flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-text-secondary mb-2">Your program is empty</p>
            <p className="text-xs text-text-muted max-w-xs">
              Click on commands from the palette to build your program and help Sparky reach the goal!
            </p>

            {/* Animated hint arrow */}
            <motion.div
              animate={{
                x: [-10, 0, -10],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mt-4 text-neon-green text-2xl"
            >
              ←
            </motion.div>
          </motion.div>
        )}

        {/* Block list */}
        {blocks.length > 0 && (
          <Reorder.Group
            axis="y"
            values={blocks}
            onReorder={handleReorder}
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {blocks.map((block, index) => (
                <Reorder.Item
                  key={block.instanceId}
                  value={block}
                  onDragStart={() => setDraggedId(block.instanceId)}
                  onDragEnd={() => setDraggedId(null)}
                  className="relative"
                  dragListener={!isExecuting}
                >
                  <div className="flex items-start gap-2">
                    {/* Line number */}
                    <div
                      className={`
                        w-8 h-8 flex items-center justify-center rounded
                        font-mono text-xs
                        ${activeBlockId === block.instanceId
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-bg-tertiary/50 text-text-muted'
                        }
                      `}
                    >
                      {getLineNumber(index)}
                    </div>

                    {/* Command block */}
                    <div className="flex-1">
                      <CommandBlock
                        block={block}
                        onRemove={isExecuting ? undefined : () => onRemoveBlock(block.instanceId)}
                        onValueChange={(value) => onValueChange(block.instanceId, value)}
                        isActive={activeBlockId === block.instanceId}
                        isDragging={draggedId === block.instanceId}
                      />
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        {/* Add more blocks hint */}
        {blocks.length > 0 && blocks.length < maxBlocks && !isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-3 border-2 border-dashed border-white/10 rounded-lg text-center"
          >
            <p className="text-xs text-text-muted">
              Click commands to add more • {maxBlocks - blocks.length} slots remaining
            </p>
          </motion.div>
        )}

        {/* Block limit reached */}
        {blocks.length >= maxBlocks && !isExecuting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-neon-orange/10 border border-neon-orange/30 rounded-lg"
          >
            <p className="text-xs text-neon-orange text-center font-mono">
              ⚠ Block limit reached ({maxBlocks} max)
            </p>
          </motion.div>
        )}
      </div>

      {/* Editor footer - execution status */}
      <div className="px-4 py-2 bg-bg-tertiary/30 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isExecuting ? 'bg-neon-green animate-pulse' : 'bg-text-muted'
              }`}
            />
            <span className="font-mono text-xs text-text-muted">
              {isExecuting ? 'RUNNING' : 'READY'}
            </span>
          </div>

          {isExecuting && currentExecutionIndex !== undefined && (
            <span className="font-mono text-xs text-neon-green">
              Step {currentExecutionIndex + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
