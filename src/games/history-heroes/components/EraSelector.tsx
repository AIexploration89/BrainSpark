import { motion } from 'framer-motion';
import { HISTORICAL_ERAS, type HistoricalEra } from '../types';
import { useHistoryProgressStore } from '../stores/historyStore';
import { TimelineBackground } from './TimelineBackground';

interface EraSelectorProps {
  onSelectEra: (era: HistoricalEra) => void;
  onBack: () => void;
}

export function EraSelector({ onSelectEra, onBack }: EraSelectorProps) {
  const { getEraStars } = useHistoryProgressStore();

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 relative">
      <TimelineBackground intensity="medium" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-secondary/80 backdrop-blur-sm border border-white/10 text-text-secondary hover:text-white hover:border-neon-purple/50 transition-all"
        >
          ←
        </motion.button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Choose Your Era
          </h1>
          <p className="text-text-secondary text-sm">
            Travel through time and learn about history!
          </p>
        </div>
      </motion.div>

      {/* Timeline visualization */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full relative z-10">
        {/* Era cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HISTORICAL_ERAS.map((era, index) => {
            const stars = getEraStars(era.id);
            const maxStars = 18; // 6 levels × 3 stars

            return (
              <motion.button
                key={era.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectEra(era.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                  bg-gradient-to-br ${era.gradient} backdrop-blur-xl
                  border-white/10 hover:border-${era.color}/50
                  group overflow-hidden
                `}
              >
                {/* Era icon */}
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="text-5xl sm:text-6xl mb-4"
                  style={{
                    filter: `drop-shadow(0 0 20px ${era.accentColor}40)`,
                  }}
                >
                  {era.icon}
                </motion.div>

                {/* Era info */}
                <h3
                  className="text-xl sm:text-2xl font-display font-bold text-white mb-2"
                  style={{ textShadow: `0 0 20px ${era.accentColor}30` }}
                >
                  {era.name}
                </h3>
                <p className="text-text-secondary text-sm mb-3">{era.description}</p>

                {/* Year range badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display"
                  style={{
                    background: `${era.accentColor}20`,
                    color: era.accentColor,
                    border: `1px solid ${era.accentColor}30`,
                  }}
                >
                  🕰️ {era.years}
                </div>

                {/* Progress stars */}
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <span className="text-neon-yellow text-lg">⭐</span>
                  <span className="font-display font-bold text-white text-sm">
                    {stars}/{maxStars}
                  </span>
                </div>

                {/* Topics preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {era.topics.slice(0, 3).map(topic => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded text-xs bg-white/5 text-text-muted capitalize"
                    >
                      {topic.replace('-', ' ')}
                    </span>
                  ))}
                  {era.topics.length > 3 && (
                    <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-text-muted">
                      +{era.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${era.accentColor}10 0%, transparent 70%)`,
                  }}
                />

                {/* Arrow indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span
                    className="text-2xl"
                    style={{ color: era.accentColor }}
                  >
                    →
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8 relative z-10"
      >
        <p className="text-text-muted text-sm">
          📚 Each era has 6 levels • Earn up to 18 stars per era
        </p>
      </motion.div>
    </div>
  );
}
