import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhysicsProgressStore } from './stores/physicsStore';
import { EXPERIMENTS } from './data/experiments';
import type { ExperimentType } from './types';

// Import experiment components
import { GravityExperiment } from './components/GravityExperiment';
import { PendulumExperiment } from './components/PendulumExperiment';
import { RampExperiment } from './components/RampExperiment';
import { BounceExperiment } from './components/BounceExperiment';
import { ForceExperiment } from './components/ForceExperiment';

type ViewState = 'menu' | 'experiment';

const colorMap: Record<string, string> = {
  cyan: 'from-neon-cyan/30 to-neon-cyan/10 border-neon-cyan/40 hover:border-neon-cyan',
  pink: 'from-neon-pink/30 to-neon-pink/10 border-neon-pink/40 hover:border-neon-pink',
  green: 'from-neon-green/30 to-neon-green/10 border-neon-green/40 hover:border-neon-green',
  orange: 'from-neon-orange/30 to-neon-orange/10 border-neon-orange/40 hover:border-neon-orange',
  purple: 'from-neon-purple/30 to-neon-purple/10 border-neon-purple/40 hover:border-neon-purple',
};

const glowMap: Record<string, string> = {
  cyan: 'shadow-[0_0_30px_rgba(0,245,255,0.3)]',
  pink: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]',
  green: 'shadow-[0_0_30px_rgba(0,255,136,0.3)]',
  orange: 'shadow-[0_0_30px_rgba(255,136,0,0.3)]',
  purple: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
};

export function PhysicsLab() {
  const [viewState, setViewState] = useState<ViewState>('menu');
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentType | null>(null);
  const { experimentProgress, totalStars } = usePhysicsProgressStore();

  const handleSelectExperiment = useCallback((experimentId: ExperimentType) => {
    const progress = experimentProgress[experimentId];
    if (!progress?.unlocked) return;

    setCurrentExperiment(experimentId);
    setViewState('experiment');
  }, [experimentProgress]);

  const handleBackToMenu = useCallback(() => {
    setViewState('menu');
    setCurrentExperiment(null);
  }, []);

  // Render current experiment
  if (viewState === 'experiment' && currentExperiment) {
    switch (currentExperiment) {
      case 'gravity':
        return <GravityExperiment onBack={handleBackToMenu} />;
      case 'pendulum':
        return <PendulumExperiment onBack={handleBackToMenu} />;
      case 'ramp':
        return <RampExperiment onBack={handleBackToMenu} />;
      case 'bounce':
        return <BounceExperiment onBack={handleBackToMenu} />;
      case 'force':
        return <ForceExperiment onBack={handleBackToMenu} />;
      default:
        return null;
    }
  }

  // Render main menu
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(139,92,246,0.05), transparent, rgba(0,245,255,0.05), transparent)',
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#00f5ff', '#ff00ff', '#00ff88', '#ff8800', '#8b5cf6'][i % 5],
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          {/* Animated icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl sm:text-8xl mb-4"
          >
            🔬
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-3">
            Physics <span className="text-neon-purple" style={{ textShadow: '0 0 30px rgba(139,92,246,0.5)' }}>Lab</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md">
            Explore the amazing world of physics through fun experiments!
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-neon-purple">{totalStars}</div>
              <div className="text-xs text-text-muted uppercase">Stars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-neon-cyan">
                {Object.values(experimentProgress).filter(p => p.unlocked).length}
              </div>
              <div className="text-xs text-text-muted uppercase">Unlocked</div>
            </div>
          </div>
        </motion.div>

        {/* Experiments Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl"
        >
          {EXPERIMENTS.map((experiment, i) => {
            const progress = experimentProgress[experiment.id];
            const isUnlocked = progress?.unlocked ?? false;
            const stars = progress?.totalStars ?? 0;

            return (
              <motion.button
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                onClick={() => handleSelectExperiment(experiment.id)}
                disabled={!isUnlocked}
                className={`
                  relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                  bg-gradient-to-br ${colorMap[experiment.color]}
                  ${isUnlocked ? glowMap[experiment.color] : 'opacity-50 grayscale'}
                  ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 rounded-2xl backdrop-blur-sm">
                    <div className="text-center">
                      <span className="text-4xl">🔒</span>
                      <p className="text-sm text-text-muted mt-2">Complete other experiments</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{experiment.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-bold text-white mb-1">
                      {experiment.name}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {experiment.description}
                    </p>

                    {/* Concepts */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {experiment.concepts.slice(0, 2).map((concept) => (
                        <span
                          key={concept}
                          className="px-2 py-0.5 text-xs bg-white/10 rounded-full text-text-secondary"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${star <= stars ? 'text-yellow-400' : 'text-white/20'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={`
                        px-2 py-0.5 text-xs font-display uppercase rounded-full
                        ${experiment.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' :
                          experiment.difficulty === 'medium' ? 'bg-neon-orange/20 text-neon-orange' :
                          'bg-neon-red/20 text-neon-red'}
                      `}>
                        {experiment.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.history.back()}
          className="mt-8 py-3 px-8 rounded-xl font-display font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
        >
          ← Back to Games
        </motion.button>

        {/* Fun tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-bg-secondary/50 rounded-xl border border-white/10 max-w-md text-center"
        >
          <p className="text-text-muted text-sm">
            💡 <span className="text-neon-purple">Tip:</span> Each experiment has sandbox mode where you can play freely, plus challenges to test your understanding!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default PhysicsLab;
