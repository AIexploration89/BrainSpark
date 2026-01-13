import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Planet, PlanetId } from '../types';
import { PLANETS } from '../data/planets';
import { useSpaceProgressStore } from '../stores/spaceStore';

interface SolarSystemProps {
  onSelectPlanet: (planetId: PlanetId) => void;
  visitedPlanets: PlanetId[];
  highlightedPlanet?: PlanetId;
}

export function SolarSystem({
  onSelectPlanet,
  visitedPlanets,
  highlightedPlanet,
}: SolarSystemProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetId | null>(null);
  const [time, setTime] = useState(0);
  const { isPlanetUnlocked, progress } = useSpaceProgressStore();

  // Animate orbital motion
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.01);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const calculateOrbitalPosition = (planet: Planet, t: number) => {
    const angle = t * planet.orbitSpeed;
    const x = Math.cos(angle) * planet.orbitRadius;
    const y = Math.sin(angle) * planet.orbitRadius * 0.4; // Flatten for perspective
    return { x, y, angle };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Solar system container */}
      <div
        className="relative"
        style={{
          width: '1200px',
          height: '700px',
          transform: 'perspective(1000px) rotateX(20deg)',
        }}
      >
        {/* Orbital paths */}
        {PLANETS.filter(p => p.orbitRadius > 0).map((planet) => {
          const isUnlocked = isPlanetUnlocked(planet.id);
          return (
            <div
              key={`orbit-${planet.id}`}
              className="absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2 * 0.4,
                transform: 'translate(-50%, -50%)',
                borderColor: isUnlocked
                  ? `${planet.glowColor.replace(')', ', 0.3)')}`
                  : 'rgba(255, 255, 255, 0.05)',
                borderStyle: 'dashed',
              }}
            />
          );
        })}

        {/* Sun (center) */}
        <motion.button
          className="absolute left-1/2 top-1/2 z-20"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectPlanet('sun')}
          onMouseEnter={() => setHoveredPlanet('sun')}
          onMouseLeave={() => setHoveredPlanet(null)}
        >
          <motion.div
            className="rounded-full cursor-pointer"
            style={{
              width: 80,
              height: 80,
              background: `radial-gradient(circle at 30% 30%, #FFD93D, #FF8C00, #FF4500)`,
              boxShadow: `
                0 0 60px 20px rgba(255, 217, 61, 0.4),
                0 0 100px 40px rgba(255, 140, 0, 0.3),
                inset 0 0 30px rgba(255, 69, 0, 0.5)
              `,
            }}
            animate={{
              boxShadow: [
                `0 0 60px 20px rgba(255, 217, 61, 0.4), 0 0 100px 40px rgba(255, 140, 0, 0.3), inset 0 0 30px rgba(255, 69, 0, 0.5)`,
                `0 0 80px 30px rgba(255, 217, 61, 0.5), 0 0 120px 50px rgba(255, 140, 0, 0.4), inset 0 0 40px rgba(255, 69, 0, 0.6)`,
                `0 0 60px 20px rgba(255, 217, 61, 0.4), 0 0 100px 40px rgba(255, 140, 0, 0.3), inset 0 0 30px rgba(255, 69, 0, 0.5)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Solar flares */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 200, 100, 0.3)',
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.button>

        {/* Planets */}
        {PLANETS.filter(p => p.id !== 'sun').map((planet) => {
          const pos = calculateOrbitalPosition(planet, time);
          const isUnlocked = isPlanetUnlocked(planet.id);
          const isVisited = visitedPlanets.includes(planet.id);
          const isHighlighted = highlightedPlanet === planet.id;
          const isHovered = hoveredPlanet === planet.id;

          return (
            <motion.button
              key={planet.id}
              className="absolute z-10"
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: pos.y > 0 ? 15 : 5,
              }}
              whileHover={isUnlocked ? { scale: 1.3 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onSelectPlanet(planet.id)}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
              disabled={!isUnlocked}
            >
              <div className="relative">
                {/* Planet body */}
                <motion.div
                  className="rounded-full"
                  style={{
                    width: planet.size,
                    height: planet.size,
                    background: getPlanetGradient(planet),
                    boxShadow: isUnlocked
                      ? `0 0 ${planet.size / 2}px ${planet.glowColor}, inset -${planet.size / 4}px -${planet.size / 4}px ${planet.size / 2}px rgba(0,0,0,0.4)`
                      : 'none',
                    filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.3)',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  }}
                  animate={
                    isHighlighted || isHovered
                      ? {
                          boxShadow: [
                            `0 0 ${planet.size / 2}px ${planet.glowColor}`,
                            `0 0 ${planet.size}px ${planet.glowColor}`,
                            `0 0 ${planet.size / 2}px ${planet.glowColor}`,
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {/* Saturn's rings */}
                  {planet.id === 'saturn' && isUnlocked && (
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: planet.size * 2,
                        height: planet.size * 0.5,
                        background: `
                          linear-gradient(90deg,
                            transparent 0%,
                            rgba(244, 208, 63, 0.1) 20%,
                            rgba(244, 208, 63, 0.3) 35%,
                            rgba(210, 180, 140, 0.2) 50%,
                            rgba(244, 208, 63, 0.3) 65%,
                            rgba(244, 208, 63, 0.1) 80%,
                            transparent 100%
                          )
                        `,
                        borderRadius: '50%',
                        transform: 'rotateX(75deg)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </motion.div>

                {/* Lock icon for locked planets */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg opacity-50">🔒</span>
                  </div>
                )}

                {/* Visited indicator */}
                {isVisited && isUnlocked && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)',
                    }}
                  >
                    <span className="text-[8px]">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* Planet name tooltip */}
        <AnimatePresence>
          {hoveredPlanet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <PlanetTooltip planetId={hoveredPlanet} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-text-muted text-sm">
          Click on a planet to explore • Unlocked: {progress.planetsUnlocked.length}/{PLANETS.length}
        </p>
      </motion.div>
    </div>
  );
}

function PlanetTooltip({ planetId }: { planetId: PlanetId }) {
  const planet = PLANETS.find(p => p.id === planetId);
  const { isPlanetUnlocked, progress } = useSpaceProgressStore();

  if (!planet) return null;

  const isUnlocked = isPlanetUnlocked(planetId);

  return (
    <div
      className="px-6 py-4 bg-bg-secondary/95 backdrop-blur-sm rounded-xl border border-white/10"
      style={{
        boxShadow: isUnlocked ? `0 0 20px ${planet.glowColor}` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full"
          style={{
            background: getPlanetGradient(planet),
            boxShadow: `0 0 10px ${planet.glowColor}`,
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
          }}
        />
        <div>
          <h3 className="font-display font-bold text-white">{planet.name}</h3>
          <p className="text-xs text-text-muted">
            {isUnlocked ? planet.type.replace('-', ' ') : `Unlock at ${planet.unlockRequirement} ⭐`}
          </p>
        </div>
      </div>
      {isUnlocked && (
        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-text-secondary">
          {planet.stats.distanceFromSun} from Sun
        </div>
      )}
    </div>
  );
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

export default SolarSystem;
