import { motion } from 'framer-motion';
import type { GameMode } from '../types';
import { GAME_MODES } from '../types';
import { useGeoProgressStore } from '../stores/geoStore';

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const colorClasses: Record<string, string> = {
  cyan: 'from-neon-cyan/30 to-neon-cyan/5 border-neon-cyan/40 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]',
  pink: 'from-neon-pink/30 to-neon-pink/5 border-neon-pink/40 hover:border-neon-pink hover:shadow-[0_0_30px_rgba(255,0,255,0.3)]',
  orange: 'from-neon-orange/30 to-neon-orange/5 border-neon-orange/40 hover:border-neon-orange hover:shadow-[0_0_30px_rgba(255,107,53,0.3)]',
  green: 'from-neon-green/30 to-neon-green/5 border-neon-green/40 hover:border-neon-green hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]',
};

export function ModeSelector({ onSelectMode, onBack }: ModeSelectorProps) {
  const { getModeStars } = useGeoProgressStore();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating globe */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 text-8xl opacity-20"
        >
          🌍
        </motion.div>
        <motion.div
          animate={{
            y: [10, -10, 10],
            rotate: [0, -5, 5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 text-8xl opacity-20"
        >
          🌎
        </motion.div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
          Choose Your <span className="text-neon-cyan" style={{ textShadow: '0 0 30px rgba(0,245,255,0.5)' }}>Adventure</span>
        </h1>
        <p className="text-text-secondary max-w-md">
          Select a game mode to start exploring the world
        </p>
      </motion.div>

      {/* Mode cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl w-full relative z-10">
        {GAME_MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(mode.id)}
            className={`
              relative bg-gradient-to-br ${colorClasses[mode.color]}
              border rounded-2xl p-6 text-left transition-all duration-300
              group overflow-hidden
            `}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br from-neon-${mode.color}/10 to-transparent`} />
            </div>

            {/* Icon */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-5xl mb-4"
            >
              {mode.icon}
            </motion.div>

            {/* Content */}
            <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-neon-cyan transition-colors">
              {mode.name}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {mode.description}
            </p>

            {/* Stars earned */}
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="font-display font-bold text-neon-yellow">
                {getModeStars(mode.id)} / 18
              </span>
            </div>

            {/* Arrow indicator */}
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-text-muted group-hover:text-white transition-colors"
            >
              →
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-8 px-6 py-3 font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Menu
      </motion.button>
    </div>
  );
}
