import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePhysicsEngine, createBall } from '../hooks/usePhysicsEngine';
import type { PhysicsObject, TrailPoint } from '../types';

interface GravityExperimentProps {
  onBack: () => void;
}

const PLANETS = [
  { id: 'earth', name: 'Earth', icon: '🌍', gravity: 9.81, color: '#00f5ff' },
  { id: 'moon', name: 'Moon', icon: '🌙', gravity: 1.62, color: '#a0a0b0' },
  { id: 'mars', name: 'Mars', icon: '🔴', gravity: 3.71, color: '#ff6b6b' },
  { id: 'jupiter', name: 'Jupiter', icon: '🟤', gravity: 24.79, color: '#ff8800' },
];

const OBJECTS = [
  { id: 'apple', name: 'Apple', icon: '🍎', radius: 18, mass: 0.2, color: '#ff3366' },
  { id: 'ball', name: 'Ball', icon: '⚽', radius: 22, mass: 0.5, color: '#00ff88' },
  { id: 'rock', name: 'Rock', icon: '🪨', radius: 24, mass: 2, color: '#8b8b8b' },
  { id: 'feather', name: 'Feather', icon: '🪶', radius: 16, mass: 0.01, color: '#ffffff' },
];

export function GravityExperiment({ onBack }: GravityExperimentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
  const [selectedObject, setSelectedObject] = useState(OBJECTS[0]);
  const [showTrail, setShowTrail] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [customGravity, setCustomGravity] = useState(9.81);
  const [isCustom, setIsCustom] = useState(false);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [dropStartTime, setDropStartTime] = useState<number | null>(null);
  const [, setBounceCount] = useState(0);
  const [, setDroppedObjects] = useState<string[]>([]);

  const gravity = isCustom ? customGravity : selectedPlanet.gravity;

  const { objects, trails, addObject, clearObjects, update } = usePhysicsEngine({
    gravity,
    bounds: { width: 600, height: 500 },
    groundY: 450,
    onCollision: (_obj, type) => {
      if (type === 'ground') {
        setBounceCount(c => c + 1);
        if (dropStartTime && !dropTime) {
          setDropTime(Date.now() - dropStartTime);
        }
      }
    },
  });

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 50);
      lastTimeRef.current = timestamp;

      update(deltaTime);

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderScene(ctx, objects.current, trails.current, showTrail, showVectors, gravity);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, update, showTrail, showVectors, gravity]);

  // Initial render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderScene(ctx, objects.current, trails.current, showTrail, showVectors, gravity);
      }
    }
  }, []);

  const handleDrop = useCallback(() => {
    const id = `obj-${Date.now()}`;
    const ball = createBall(
      id,
      300, // Center X
      80,  // Start high
      selectedObject.radius,
      selectedObject.color,
      selectedObject.mass,
      0.6  // Elasticity
    );
    addObject(ball);
    setDroppedObjects(prev => [...prev, selectedObject.id]);
    setDropStartTime(Date.now());
    setDropTime(null);
    setBounceCount(0);
    setIsRunning(true);
  }, [addObject, selectedObject]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    clearObjects();
    setDropTime(null);
    setDropStartTime(null);
    setBounceCount(0);
    lastTimeRef.current = 0;

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderScene(ctx, [], new Map(), showTrail, showVectors, gravity);
      }
    }
  }, [clearObjects, showTrail, showVectors, gravity]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Don't drop below ground
    if (y > 400) return;

    const id = `obj-${Date.now()}`;
    const ball = createBall(
      id,
      x,
      y,
      selectedObject.radius,
      selectedObject.color,
      selectedObject.mass,
      0.6
    );
    addObject(ball);
    setDroppedObjects(prev => [...prev, selectedObject.id]);
    setDropStartTime(Date.now());
    setDropTime(null);
    setIsRunning(true);
  }, [addObject, selectedObject]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-cyan/50 transition-colors"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              🍎 Gravity Drop
            </h1>
            <p className="text-sm text-text-secondary">
              Drop objects and explore gravity on different planets!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex gap-6 text-center">
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Gravity</div>
            <div className="text-lg font-display font-bold text-neon-cyan">
              {gravity.toFixed(2)} m/s²
            </div>
          </div>
          {dropTime && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-bg-secondary rounded-xl border border-neon-green/30"
            >
              <div className="text-xs text-text-muted uppercase">Fall Time</div>
              <div className="text-lg font-display font-bold text-neon-green">
                {(dropTime / 1000).toFixed(2)}s
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <div className="relative">
            {/* Space background with stars */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #2a2a3e 100%)',
              }}
            >
              {/* Stars */}
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 60}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Planet indicator */}
            <motion.div
              key={selectedPlanet.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-4 left-4 z-10 px-4 py-2 bg-bg-primary/80 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <span className="text-2xl mr-2">{selectedPlanet.icon}</span>
              <span className="font-display font-bold text-white">{selectedPlanet.name}</span>
            </motion.div>

            {/* Click hint */}
            {objects.current.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
              >
                <p className="text-text-muted">Click anywhere to drop an object!</p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl mt-4"
                >
                  {selectedObject.icon}
                </motion.div>
              </motion.div>
            )}

            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              onClick={handleCanvasClick}
              className="relative z-10 rounded-2xl cursor-crosshair w-full"
              style={{ maxWidth: '600px' }}
            />

            {/* Ground */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 rounded-b-2xl z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(0deg, #2a2a2a 0%, #1a1a1a 100%)',
                borderTop: '3px solid #4a4a4a',
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDrop}
              className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
            >
              Drop {selectedObject.icon}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-white/20 text-white hover:border-neon-pink/50 transition-all"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Planet Selection */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Select Planet
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PLANETS.map((planet) => (
                <motion.button
                  key={planet.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlanet(planet);
                    setIsCustom(false);
                  }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedPlanet.id === planet.id && !isCustom
                      ? 'bg-neon-cyan/20 border-2 border-neon-cyan'
                      : 'bg-bg-tertiary border-2 border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{planet.icon}</span>
                  <p className="text-sm font-display font-bold text-white mt-1">{planet.name}</p>
                  <p className="text-xs text-text-muted">{planet.gravity} m/s²</p>
                </motion.button>
              ))}
            </div>

            {/* Custom gravity slider */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={isCustom}
                  onChange={(e) => setIsCustom(e.target.checked)}
                  className="w-4 h-4 accent-neon-purple"
                />
                <span className="text-sm text-white font-display">Custom Gravity</span>
              </label>
              {isCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <input
                    type="range"
                    min="0.1"
                    max="30"
                    step="0.1"
                    value={customGravity}
                    onChange={(e) => setCustomGravity(parseFloat(e.target.value))}
                    className="w-full accent-neon-purple"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>0.1</span>
                    <span className="text-neon-purple font-bold">{customGravity.toFixed(1)} m/s²</span>
                    <span>30</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Object Selection */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Select Object
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {OBJECTS.map((obj) => (
                <motion.button
                  key={obj.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedObject(obj)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedObject.id === obj.id
                      ? 'bg-neon-pink/20 border-2 border-neon-pink'
                      : 'bg-bg-tertiary border-2 border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl">{obj.icon}</span>
                  <p className="text-xs font-display text-white mt-1">{obj.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Display Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Show Trail</span>
                <input
                  type="checkbox"
                  checked={showTrail}
                  onChange={(e) => setShowTrail(e.target.checked)}
                  className="w-5 h-5 accent-neon-cyan"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Show Velocity</span>
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="w-5 h-5 accent-neon-green"
                />
              </label>
            </div>
          </div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/10 rounded-2xl p-4 border border-neon-purple/30"
          >
            <h3 className="text-sm font-display font-bold text-neon-purple mb-2 flex items-center gap-2">
              💡 Fun Fact
            </h3>
            <p className="text-sm text-text-secondary">
              On the Moon, you could jump 6 times higher than on Earth because the gravity is only 1/6th as strong!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Canvas rendering function
function renderScene(
  ctx: CanvasRenderingContext2D,
  objects: PhysicsObject[],
  trails: Map<string, TrailPoint[]>,
  showTrail: boolean,
  showVectors: boolean,
  _gravity: number
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw ground
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 450, width, 50);

  // Draw ground line
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 450);
  ctx.lineTo(width, 450);
  ctx.stroke();

  // Draw grid lines (faint)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 450);
    ctx.stroke();
  }
  for (let y = 0; y < 450; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw trails
  if (showTrail) {
    trails.forEach((trail, objId) => {
      if (trail.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }

      const obj = objects.find(o => o.id === objId);
      ctx.strokeStyle = obj?.color || '#00f5ff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  // Draw objects
  objects.forEach((obj) => {
    ctx.save();

    // Draw glow
    const gradient = ctx.createRadialGradient(
      obj.position.x, obj.position.y, 0,
      obj.position.x, obj.position.y, (obj.radius || 20) * 2
    );
    gradient.addColorStop(0, obj.color + '40');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(obj.position.x, obj.position.y, (obj.radius || 20) * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw object
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(obj.position.x, obj.position.y, obj.radius || 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(
      obj.position.x - (obj.radius || 20) * 0.3,
      obj.position.y - (obj.radius || 20) * 0.3,
      (obj.radius || 20) * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw velocity vector
    if (showVectors && (Math.abs(obj.velocity.x) > 1 || Math.abs(obj.velocity.y) > 1)) {
      const scale = 0.1;
      const endX = obj.position.x + obj.velocity.x * scale;
      const endY = obj.position.y + obj.velocity.y * scale;

      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(obj.position.x, obj.position.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(obj.velocity.y, obj.velocity.x);
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - 10 * Math.cos(angle - Math.PI / 6),
        endY - 10 * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - 10 * Math.cos(angle + Math.PI / 6),
        endY - 10 * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Velocity text
      const speed = Math.sqrt(obj.velocity.x ** 2 + obj.velocity.y ** 2);
      ctx.fillStyle = '#00ff88';
      ctx.font = '12px monospace';
      ctx.fillText(`${(speed / 50).toFixed(1)} m/s`, endX + 10, endY);
    }

    ctx.restore();
  });

  // Draw height markers
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  for (let y = 50; y < 450; y += 100) {
    const height = (450 - y) / 50; // Convert to meters
    ctx.fillText(`${height.toFixed(0)}m`, 5, y + 3);
  }
}
