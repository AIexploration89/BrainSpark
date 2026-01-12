import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PendulumExperimentProps {
  onBack: () => void;
}

interface PendulumState {
  angle: number;
  angularVelocity: number;
  potentialEnergy: number;
  kineticEnergy: number;
}

const GRAVITY = 9.81;
const PIXELS_PER_METER = 100;

export function PendulumExperiment({ onBack }: PendulumExperimentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [length, setLength] = useState(200); // pixels
  const [mass, setMass] = useState(1); // kg
  const [damping, setDamping] = useState(0.005);
  const [initialAngle, setInitialAngle] = useState(45); // degrees
  const [showEnergy, setShowEnergy] = useState(false);
  const [showTrail, setShowTrail] = useState(true);

  const [pendulum, setPendulum] = useState<PendulumState>({
    angle: (initialAngle * Math.PI) / 180,
    angularVelocity: 0,
    potentialEnergy: 0,
    kineticEnergy: 0,
  });

  const [period, setPeriod] = useState<number | null>(null);
  const [swingCount, setSwingCount] = useState(0);
  const lastCrossRef = useRef<number | null>(null);
  const trailRef = useRef<{ x: number; y: number; opacity: number }[]>([]);

  const pivotX = 300;
  const pivotY = 80;

  // Calculate period theoretically
  const theoreticalPeriod = 2 * Math.PI * Math.sqrt((length / PIXELS_PER_METER) / GRAVITY);

  // Physics simulation
  const updatePendulum = useCallback((dt: number) => {
    setPendulum((prev) => {
      // Pendulum equation of motion: d²θ/dt² = -(g/L) * sin(θ) - damping * dθ/dt
      const lengthMeters = length / PIXELS_PER_METER;
      const angularAcceleration = -(GRAVITY / lengthMeters) * Math.sin(prev.angle) - damping * prev.angularVelocity;

      const newAngularVelocity = prev.angularVelocity + angularAcceleration * dt;
      const newAngle = prev.angle + newAngularVelocity * dt;

      // Calculate energies
      const height = lengthMeters * (1 - Math.cos(newAngle));
      const velocity = lengthMeters * Math.abs(newAngularVelocity);
      const potentialEnergy = mass * GRAVITY * height;
      const kineticEnergy = 0.5 * mass * velocity * velocity;

      // Track zero crossings for period measurement
      if (prev.angle > 0 && newAngle <= 0 && prev.angularVelocity < 0) {
        const now = Date.now();
        if (lastCrossRef.current) {
          const measuredPeriod = (now - lastCrossRef.current) / 1000;
          setPeriod(measuredPeriod);
        }
        lastCrossRef.current = now;
        setSwingCount((c) => c + 1);
      }

      return {
        angle: newAngle,
        angularVelocity: newAngularVelocity,
        potentialEnergy,
        kineticEnergy,
      };
    });
  }, [length, mass, damping]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      lastTimeRef.current = timestamp;

      // Update physics at fixed timestep for stability
      const fixedDt = 0.016;
      updatePendulum(fixedDt);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, updatePendulum]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate bob position
      const bobX = pivotX + length * Math.sin(pendulum.angle);
      const bobY = pivotY + length * Math.cos(pendulum.angle);

      // Update trail
      if (showTrail && isRunning) {
        trailRef.current.push({ x: bobX, y: bobY, opacity: 1 });
        trailRef.current = trailRef.current
          .map((p) => ({ ...p, opacity: p.opacity - 0.02 }))
          .filter((p) => p.opacity > 0);
      }

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#12121a');
      bgGradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw trail
      if (showTrail && trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw pivot mount
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(pivotX - 40, 0, 80, 30);
      ctx.fillStyle = '#3a3a3a';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a5a5a';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw string/rod
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Draw length markers
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px monospace';
      const lengthMeters = length / PIXELS_PER_METER;
      ctx.fillText(`${lengthMeters.toFixed(2)}m`, pivotX + 10, pivotY + length / 2);

      // Draw bob glow
      const glowGradient = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 60);
      glowGradient.addColorStop(0, 'rgba(255,0,255,0.4)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Draw bob
      const bobRadius = 15 + mass * 5;
      const bobGradient = ctx.createRadialGradient(
        bobX - bobRadius * 0.3,
        bobY - bobRadius * 0.3,
        0,
        bobX,
        bobY,
        bobRadius
      );
      bobGradient.addColorStop(0, '#ff66ff');
      bobGradient.addColorStop(1, '#cc00cc');
      ctx.fillStyle = bobGradient;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw highlight
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, bobRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw angle arc
      ctx.strokeStyle = 'rgba(0,245,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const arcRadius = 50;
      ctx.arc(pivotX, pivotY, arcRadius, Math.PI / 2, Math.PI / 2 - pendulum.angle, pendulum.angle > 0);
      ctx.stroke();

      // Draw angle text
      const angleDegrees = (pendulum.angle * 180) / Math.PI;
      ctx.fillStyle = '#00f5ff';
      ctx.font = '14px monospace';
      ctx.fillText(`${angleDegrees.toFixed(1)}°`, pivotX + 55, pivotY + 30);

      // Draw energy bars if enabled
      if (showEnergy) {
        const totalEnergy = pendulum.potentialEnergy + pendulum.kineticEnergy;
        const barWidth = 30;
        const barHeight = 150;
        const barX = width - 80;
        const barY = height - 200;

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX - 10, barY - 20, barWidth * 2 + 30, barHeight + 60);

        // PE bar
        const peHeight = totalEnergy > 0 ? (pendulum.potentialEnergy / totalEnergy) * barHeight : 0;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(barX, barY + barHeight - peHeight, barWidth, peHeight);
        ctx.fillStyle = '#ff8800';
        ctx.font = '10px monospace';
        ctx.fillText('PE', barX + 8, barY + barHeight + 15);

        // KE bar
        const keHeight = totalEnergy > 0 ? (pendulum.kineticEnergy / totalEnergy) * barHeight : 0;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(barX + barWidth + 10, barY, barWidth, barHeight);
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(barX + barWidth + 10, barY + barHeight - keHeight, barWidth, keHeight);
        ctx.fillStyle = '#00ff88';
        ctx.fillText('KE', barX + barWidth + 18, barY + barHeight + 15);

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('Energy', barX, barY - 5);
      }

      requestAnimationFrame(render);
    };

    const renderLoop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderLoop);
  }, [pendulum, length, mass, showEnergy, showTrail, isRunning]);

  const handleStart = useCallback(() => {
    setPendulum({
      angle: (initialAngle * Math.PI) / 180,
      angularVelocity: 0,
      potentialEnergy: 0,
      kineticEnergy: 0,
    });
    trailRef.current = [];
    lastCrossRef.current = null;
    setPeriod(null);
    setSwingCount(0);
    setIsRunning(true);
  }, [initialAngle]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setPendulum({
      angle: (initialAngle * Math.PI) / 180,
      angularVelocity: 0,
      potentialEnergy: 0,
      kineticEnergy: 0,
    });
    trailRef.current = [];
    lastCrossRef.current = null;
    setPeriod(null);
    setSwingCount(0);
  }, [initialAngle]);

  // Handle canvas drag to set angle
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate angle from pivot to mouse
    const dx = x - pivotX;
    const dy = y - pivotY;
    const newAngle = Math.atan2(dx, dy);

    setPendulum((prev) => ({
      ...prev,
      angle: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newAngle)),
      angularVelocity: 0,
    }));
    setInitialAngle((newAngle * 180) / Math.PI);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-pink/50 transition-colors"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              🎯 Pendulum Swing
            </h1>
            <p className="text-sm text-text-secondary">
              Swing the pendulum and discover the rhythm of motion!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex gap-4 text-center">
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Theory</div>
            <div className="text-lg font-display font-bold text-neon-cyan">
              {theoreticalPeriod.toFixed(2)}s
            </div>
          </div>
          {period && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-bg-secondary rounded-xl border border-neon-pink/30"
            >
              <div className="text-xs text-text-muted uppercase">Measured</div>
              <div className="text-lg font-display font-bold text-neon-pink">
                {period.toFixed(2)}s
              </div>
            </motion.div>
          )}
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Swings</div>
            <div className="text-lg font-display font-bold text-neon-green">
              {swingCount}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              onMouseDown={handleCanvasMouseDown}
              className="rounded-2xl cursor-pointer w-full"
              style={{ maxWidth: '600px' }}
            />

            {/* Drag hint */}
            {!isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-bg-primary/80 backdrop-blur-sm rounded-xl text-text-muted text-sm"
              >
                Click to position the pendulum
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            {!isRunning ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-pink to-fuchsia-500 text-white shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all"
              >
                Release Pendulum
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStop}
                className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-neon-orange text-bg-primary"
              >
                Stop
              </motion.button>
            )}
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
          {/* Length Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Pendulum Length
            </h3>
            <input
              type="range"
              min="100"
              max="350"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-pink"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Short</span>
              <span className="text-neon-pink font-display font-bold">
                {(length / PIXELS_PER_METER).toFixed(2)} m
              </span>
              <span className="text-text-muted">Long</span>
            </div>
          </div>

          {/* Mass Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Bob Mass
            </h3>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-purple"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Light</span>
              <span className="text-neon-purple font-display font-bold">{mass} kg</span>
              <span className="text-text-muted">Heavy</span>
            </div>
          </div>

          {/* Initial Angle */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Starting Angle
            </h3>
            <input
              type="range"
              min="5"
              max="85"
              value={Math.abs(initialAngle)}
              onChange={(e) => setInitialAngle(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-cyan"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">5°</span>
              <span className="text-neon-cyan font-display font-bold">{Math.abs(initialAngle).toFixed(0)}°</span>
              <span className="text-text-muted">85°</span>
            </div>
          </div>

          {/* Damping Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Air Resistance
            </h3>
            <input
              type="range"
              min="0"
              max="0.05"
              step="0.005"
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-orange"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">None</span>
              <span className="text-neon-orange font-display font-bold">{(damping * 100).toFixed(1)}%</span>
              <span className="text-text-muted">High</span>
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
                  className="w-5 h-5 accent-neon-pink"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Show Energy</span>
                <input
                  type="checkbox"
                  checked={showEnergy}
                  onChange={(e) => setShowEnergy(e.target.checked)}
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
            className="bg-gradient-to-br from-neon-pink/20 to-neon-purple/10 rounded-2xl p-4 border border-neon-pink/30"
          >
            <h3 className="text-sm font-display font-bold text-neon-pink mb-2 flex items-center gap-2">
              💡 Fun Fact
            </h3>
            <p className="text-sm text-text-secondary">
              Galileo discovered that a pendulum's swing time only depends on its length, not its weight! This discovery led to the invention of accurate clocks.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
