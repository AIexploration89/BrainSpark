import { motion } from 'framer-motion';
import type { Continent } from '../types';
import { CONTINENTS } from '../types';
import { useGeoProgressStore } from '../stores/geoStore';

interface ContinentSelectorProps {
  onSelectContinent: (continent: Continent) => void;
  onBack: () => void;
}

const continentColors: Record<string, { border: string; glow: string; text: string }> = {
  purple: {
    border: 'border-neon-purple/40 hover:border-neon-purple',
    glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
    text: 'text-neon-purple',
  },
  cyan: {
    border: 'border-neon-cyan/40 hover:border-neon-cyan',
    glow: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]',
    text: 'text-neon-cyan',
  },
  pink: {
    border: 'border-neon-pink/40 hover:border-neon-pink',
    glow: 'hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]',
    text: 'text-neon-pink',
  },
  orange: {
    border: 'border-neon-orange/40 hover:border-neon-orange',
    glow: 'hover:shadow-[0_0_30px_rgba(255,107,53,0.4)]',
    text: 'text-neon-orange',
  },
  green: {
    border: 'border-neon-green/40 hover:border-neon-green',
    glow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]',
    text: 'text-neon-green',
  },
  yellow: {
    border: 'border-neon-yellow/40 hover:border-neon-yellow',
    glow: 'hover:shadow-[0_0_30px_rgba(255,229,92,0.4)]',
    text: 'text-neon-yellow',
  },
};

export function ContinentSelector({ onSelectContinent, onBack }: ContinentSelectorProps) {
  const { explorerStats } = useGeoProgressStore();

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6">
      {/* Animated globe background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbital rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-[600px] h-[600px] border border-neon-cyan/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-neon-pink/10 rounded-full"
            style={{ transform: 'translate(-50%, -50%) rotateX(60deg)' }}
          />
        </div>

        {/* Central globe */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-10"
        >
          🌐
        </motion.div>

        {/* Floating continent icons */}
        {CONTINENTS.slice(1).map((continent, i) => (
          <motion.div
            key={continent.id}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute text-4xl"
            style={{
              top: `${20 + Math.sin(i * 1.2) * 30}%`,
              left: `${10 + i * 15}%`,
            }}
          >
            {continent.icon}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
          Select <span className="text-neon-pink" style={{ textShadow: '0 0 30px rgba(255,0,255,0.5)' }}>Region</span>
        </h1>
        <p className="text-text-secondary">
          Choose a continent to explore or challenge yourself with the whole world
        </p>
      </motion.div>

      {/* Continent grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full relative z-10">
        {CONTINENTS.map((continent, index) => {
          const colors = continentColors[continent.color];
          const isExplored = explorerStats.continentsExplored.includes(continent.id);

          return (
            <motion.button
              key={continent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectContinent(continent.id)}
              className={`
                relative bg-bg-secondary/80 backdrop-blur-sm
                ${colors.border} ${colors.glow}
                border rounded-xl p-5 text-center transition-all duration-300
                group overflow-hidden
                ${continent.id === 'world' ? 'col-span-2 sm:col-span-1' : ''}
              `}
            >
              {/* Explored badge */}
              {isExplored && continent.id !== 'world' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="text-4xl sm:text-5xl mb-3"
              >
                {continent.icon}
              </motion.div>

              {/* Name */}
              <h3 className={`font-display font-bold text-white mb-1 group-hover:${colors.text} transition-colors`}>
                {continent.name}
              </h3>

              {/* Country count */}
              <p className="text-text-muted text-xs">
                {continent.countryCount} countries
              </p>

              {/* World tour highlight */}
              {continent.id === 'world' && (
                <div className="mt-2 px-2 py-0.5 bg-neon-purple/20 text-neon-purple rounded-full text-xs font-display inline-block">
                  Ultimate Challenge
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explorer progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-white/10 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">🧭</div>
          <div>
            <p className="text-text-muted text-sm">Continents Explored</p>
            <p className="font-display font-bold text-white">
              {explorerStats.continentsExplored.length} / 6
            </p>
          </div>
          <div className="flex gap-1 ml-4">
            {CONTINENTS.slice(1).map((c) => (
              <div
                key={c.id}
                className={`w-3 h-3 rounded-full ${
                  explorerStats.continentsExplored.includes(c.id)
                    ? 'bg-neon-green'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="mt-6 px-6 py-3 font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors relative z-10"
      >
        ← Back to Modes
      </motion.button>
    </div>
  );
}
