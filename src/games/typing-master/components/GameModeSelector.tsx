import { motion } from 'framer-motion';
import type { GameMode, TypingLevel, TimerConfig } from '../types';
import { TIME_ATTACK_OPTIONS } from '../types';
import { useState } from 'react';

interface GameModeSelectorProps {
  level: TypingLevel;
  onSelectMode: (mode: GameMode, timerDuration?: number) => void;
  onBack: () => void;
}

interface ModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  color: 'cyan' | 'green' | 'orange' | 'pink' | 'purple';
  unlockLevel?: number;
}

const gameModes: ModeInfo[] = [
  {
    id: 'practice',
    name: 'Practice',
    description: 'No timer, focus on accuracy. Perfect for learning!',
    icon: '📚',
    color: 'cyan',
  },
  {
    id: 'time-attack',
    name: 'Time Attack',
    description: 'Type as much as you can before time runs out!',
    icon: '⏱️',
    color: 'orange',
    unlockLevel: 2,
  },
  {
    id: 'accuracy-challenge',
    name: 'Accuracy Challenge',
    description: 'Keep 95%+ accuracy or fail. Stay sharp!',
    icon: '🎯',
    color: 'green',
    unlockLevel: 3,
  },
  {
    id: 'word-rain',
    name: 'Word Rain',
    description: 'Words fall from the sky. Type them before they hit!',
    icon: '🌧️',
    color: 'pink',
    unlockLevel: 4,
  },
  {
    id: 'story',
    name: 'Story Mode',
    description: 'Type through an adventure story. What happens next?',
    icon: '📖',
    color: 'purple',
    unlockLevel: 5,
  },
];

const colorStyles = {
  cyan: {
    bg: 'bg-neon-cyan/10 hover:bg-neon-cyan/20',
    border: 'border-neon-cyan/30 hover:border-neon-cyan',
    text: 'text-neon-cyan',
    glow: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]',
  },
  green: {
    bg: 'bg-neon-green/10 hover:bg-neon-green/20',
    border: 'border-neon-green/30 hover:border-neon-green',
    text: 'text-neon-green',
    glow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]',
  },
  orange: {
    bg: 'bg-neon-orange/10 hover:bg-neon-orange/20',
    border: 'border-neon-orange/30 hover:border-neon-orange',
    text: 'text-neon-orange',
    glow: 'hover:shadow-[0_0_30px_rgba(255,136,0,0.3)]',
  },
  pink: {
    bg: 'bg-neon-pink/10 hover:bg-neon-pink/20',
    border: 'border-neon-pink/30 hover:border-neon-pink',
    text: 'text-neon-pink',
    glow: 'hover:shadow-[0_0_30px_rgba(255,0,255,0.3)]',
  },
  purple: {
    bg: 'bg-neon-purple/10 hover:bg-neon-purple/20',
    border: 'border-neon-purple/30 hover:border-neon-purple',
    text: 'text-neon-purple',
    glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  },
};

export function GameModeSelector({ level, onSelectMode, onBack }: GameModeSelectorProps) {
  const [selectedTimeAttack, setSelectedTimeAttack] = useState<TimerConfig | null>(null);

  const handleModeSelect = (mode: ModeInfo) => {
    if (mode.id === 'time-attack' && !selectedTimeAttack) {
      // Show time attack options
      return;
    }

    if (mode.id === 'time-attack' && selectedTimeAttack) {
      onSelectMode(mode.id, selectedTimeAttack.duration);
    } else {
      onSelectMode(mode.id);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            {level.name} - Choose Mode
          </h2>
          <p className="text-text-secondary text-sm">How do you want to play?</p>
        </div>
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameModes.map((mode, index) => {
          const isUnlocked = !mode.unlockLevel || level.id >= mode.unlockLevel;
          const styles = colorStyles[mode.color];

          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
              onClick={() => isUnlocked && handleModeSelect(mode)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300
                ${isUnlocked
                  ? `cursor-pointer ${styles.bg} ${styles.border} ${styles.glow}`
                  : 'bg-bg-card/30 cursor-not-allowed border-white/5 opacity-50'
                }
              `}
            >
              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/60 rounded-xl backdrop-blur-sm">
                  <span className="text-3xl mb-2">🔒</span>
                  <span className="text-xs text-text-muted">Unlocks at Level {mode.unlockLevel}</span>
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-3">{mode.icon}</div>

              {/* Name */}
              <h3 className={`font-display font-bold mb-2 ${styles.text}`}>{mode.name}</h3>

              {/* Description */}
              <p className="text-sm text-text-secondary">{mode.description}</p>

              {/* Time Attack options */}
              {mode.id === 'time-attack' && isUnlocked && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {TIME_ATTACK_OPTIONS.map((option) => (
                    <motion.button
                      key={option.duration}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTimeAttack(option);
                        onSelectMode('time-attack', option.duration);
                      }}
                      className={`
                        px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                        ${selectedTimeAttack?.duration === option.duration
                          ? 'bg-neon-orange border-neon-orange text-bg-primary'
                          : 'border-neon-orange/30 text-neon-orange hover:bg-neon-orange/20'
                        }
                      `}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
