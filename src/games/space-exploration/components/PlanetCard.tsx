import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Planet, PlanetFact } from '../types';

interface PlanetCardProps {
  planet: Planet;
  discoveredFacts: string[];
  onDiscoverFact: (factId: string) => void;
  onClose: () => void;
}

export function PlanetCard({
  planet,
  discoveredFacts,
  onDiscoverFact,
  onClose,
}: PlanetCardProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'stats'>('facts');
  const [selectedFact, setSelectedFact] = useState<PlanetFact | null>(null);

  const discoveredCount = planet.facts.filter(f => discoveredFacts.includes(f.id)).length;
  const totalFacts = planet.facts.length;

  const handleFactClick = (fact: PlanetFact) => {
    if (!discoveredFacts.includes(fact.id)) {
      onDiscoverFact(fact.id);
    }
    setSelectedFact(fact);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-bg-secondary rounded-3xl border overflow-hidden"
        style={{
          borderColor: planet.glowColor.replace(')', ', 0.3)'),
          boxShadow: `0 0 60px ${planet.glowColor.replace(')', ', 0.2)')}, inset 0 0 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header with planet visual */}
        <div className="relative h-48 overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${planet.glowColor.replace(')', ', 0.3)')} 0%, transparent 100%)`,
            }}
          />

          {/* Floating planet */}
          <motion.div
            className="absolute right-8 top-1/2 -translate-y-1/2"
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 120,
                height: 120,
                background: getPlanetGradient(planet),
                boxShadow: `0 0 40px ${planet.glowColor}, inset -20px -20px 40px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Saturn rings */}
              {planet.id === 'saturn' && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 200,
                    height: 50,
                    background: `linear-gradient(90deg, transparent, rgba(244, 208, 63, 0.3), rgba(244, 208, 63, 0.1), rgba(244, 208, 63, 0.3), transparent)`,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%) rotateX(75deg)',
                  }}
                />
              )}
            </div>
          </motion.div>

          {/* Planet info */}
          <div className="absolute left-8 top-8">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-display font-bold text-white mb-2"
              style={{ textShadow: `0 0 20px ${planet.glowColor}` }}
            >
              {planet.name}
            </motion.h2>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary capitalize"
            >
              {planet.type.replace('-', ' ')} {planet.type !== 'star' ? 'Planet' : ''}
            </motion.p>

            {/* Progress */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-center gap-2"
            >
              <div className="flex gap-1">
                {planet.facts.map((fact) => (
                  <div
                    key={fact.id}
                    className={`w-3 h-3 rounded-full ${
                      discoveredFacts.includes(fact.id)
                        ? 'bg-neon-green'
                        : 'bg-white/20'
                    }`}
                    style={{
                      boxShadow: discoveredFacts.includes(fact.id)
                        ? '0 0 8px rgba(0, 255, 136, 0.6)'
                        : 'none',
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-text-muted">
                {discoveredCount}/{totalFacts} facts discovered
              </span>
            </motion.div>
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-bg-primary/50 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          >
            ✕
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('facts')}
            className={`flex-1 py-4 px-6 font-display font-semibold transition-colors ${
              activeTab === 'facts'
                ? 'text-white border-b-2'
                : 'text-text-muted hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'facts' ? planet.color : 'transparent',
            }}
          >
            🔍 Facts to Discover
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-4 px-6 font-display font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'text-white border-b-2'
                : 'text-text-muted hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'stats' ? planet.color : 'transparent',
            }}
          >
            📊 Planet Stats
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'facts' ? (
              <motion.div
                key="facts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {planet.facts.map((fact, index) => {
                  const isDiscovered = discoveredFacts.includes(fact.id);
                  return (
                    <motion.button
                      key={fact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleFactClick(fact)}
                      className={`
                        p-4 rounded-xl text-left transition-all
                        ${isDiscovered
                          ? 'bg-neon-green/10 border border-neon-green/30 hover:border-neon-green/50'
                          : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {isDiscovered ? '✅' : getCategoryIcon(fact.category)}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-white mb-1">
                            {isDiscovered ? fact.title : '???'}
                          </h4>
                          <p className="text-sm text-text-secondary line-clamp-2">
                            {isDiscovered
                              ? fact.content
                              : 'Click to discover this fact!'}
                          </p>
                          <span
                            className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full capitalize"
                            style={{
                              backgroundColor: `${planet.glowColor.replace(')', ', 0.2)')}`,
                              color: planet.color,
                            }}
                          >
                            {fact.category}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {Object.entries(planet.stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="text-xs text-text-muted uppercase mb-1">
                      {formatStatKey(key)}
                    </p>
                    <p
                      className="font-display font-bold"
                      style={{ color: planet.color }}
                    >
                      {value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fact detail modal */}
        <AnimatePresence>
          {selectedFact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
              onClick={() => setSelectedFact(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-bg-primary rounded-2xl p-6 max-w-md w-full border"
                style={{
                  borderColor: planet.glowColor.replace(')', ', 0.3)'),
                  boxShadow: `0 0 40px ${planet.glowColor.replace(')', ', 0.2)')}`,
                }}
              >
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block text-5xl mb-3"
                  >
                    {discoveredFacts.includes(selectedFact.id) ? '🎉' : '🔓'}
                  </motion.div>
                  {!discoveredFacts.includes(selectedFact.id) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neon-green font-display font-bold mb-2"
                    >
                      +50 Points!
                    </motion.p>
                  )}
                  <h3 className="text-xl font-display font-bold text-white">
                    {selectedFact.title}
                  </h3>
                </div>
                <p className="text-text-secondary text-center mb-6">
                  {selectedFact.content}
                </p>
                <button
                  onClick={() => setSelectedFact(null)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-display font-semibold text-white transition-colors"
                >
                  Continue Exploring
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'size':
      return '📏';
    case 'atmosphere':
      return '🌬️';
    case 'surface':
      return '🏔️';
    case 'orbit':
      return '🔄';
    case 'moons':
      return '🌙';
    case 'history':
      return '📚';
    case 'fun':
      return '🎯';
    default:
      return '❓';
  }
}

function formatStatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getPlanetGradient(planet: Planet): string {
  switch (planet.id) {
    case 'sun':
      return 'radial-gradient(circle at 30% 30%, #FFD93D, #FF8C00, #FF4500)';
    case 'mercury':
      return 'radial-gradient(circle at 30% 30%, #C0C0C0, #808080, #505050)';
    case 'venus':
      return 'radial-gradient(circle at 30% 30%, #F5DEB3, #DEB887, #CD853F)';
    case 'earth':
      return 'radial-gradient(circle at 30% 30%, #4A90D9, #2E6DB4, #1E4D80)';
    case 'mars':
      return 'radial-gradient(circle at 30% 30%, #E57373, #CD5C5C, #8B4513)';
    case 'jupiter':
      return 'radial-gradient(circle at 30% 30%, #E8D4A8, #D4A574, #C19A5B)';
    case 'saturn':
      return 'radial-gradient(circle at 30% 30%, #F4D03F, #DAA520, #B8860B)';
    case 'uranus':
      return 'radial-gradient(circle at 30% 30%, #7FDBDA, #5CACEC, #4682B4)';
    case 'neptune':
      return 'radial-gradient(circle at 30% 30%, #6495ED, #4169E1, #191970)';
    case 'pluto':
      return 'radial-gradient(circle at 30% 30%, #DEB887, #BC9D7C, #8B7355)';
    default:
      return planet.color;
  }
}

export default PlanetCard;
