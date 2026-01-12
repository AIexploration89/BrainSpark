import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BounceExperimentProps {
  onBack: () => void;
}

const GRAVITY = 9.81;
const PIXELS_PER_METER = 50;

interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  elasticity: number;
  initialEnergy: number;
}

const BALL_PRESETS = [
  { name: 'Super Ball', elasticity: 0.95, color: '#ff00ff', icon: '🔮' },
  { name: 'Basketball', elasticity: 0.75, color: '#ff6600', icon: '🏀' },
  { name: 'Tennis Ball', elasticity: 0.65, color: '#ccff00', icon: '🎾' },
  { name: 'Clay Ball', elasticity: 0.2, color: '#8b4513', icon: '🏐' },
];

export function BounceExperiment({ onBack }: BounceExperimentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [elasticity, setElasticity] = useState(0.8);
  const [dropHeight, setDropHeight] = useState(350);
  const [showEnergy, setShowEnergy] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const [balls, setBalls] = useState<Ball[]>([]);
  const [bounceCount, setBounceCount] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [currentEnergy, setCurrentEnergy] = useState(0);

  const groundY = 420;
  const trailsRef = useRef<Map<string, { x: number; y: number; opacity: number }[]>>(new Map());

  // Physics simulation
  const updateBalls = useCallback((dt: number) => {
    setBalls((prevBalls) => {
      return prevBalls.map((ball) => {
        const newBall = { ...ball };

        // Apply gravity
        newBall.vy += GRAVITY * PIXELS_PER_METER * dt;

        // Update position
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;

        // Wall collisions
        if (newBall.x - newBall.radius <= 0) {
          newBall.x = newBall.radius;
          newBall.vx = -newBall.vx * newBall.elasticity;
        }
        if (newBall.x + newBall.radius >= 600) {
          newBall.x = 600 - newBall.radius;
          newBall.vx = -newBall.vx * newBall.elasticity;
        }

        // Ground collision
        if (newBall.y + newBall.radius >= groundY) {
          newBall.y = groundY - newBall.radius;
          if (Math.abs(newBall.vy) > 20) {
            newBall.vy = -newBall.vy * newBall.elasticity;
            setBounceCount((c) => c + 1);
          } else {
            newBall.vy = 0;
            newBall.vx *= 0.95; // Ground friction
          }
        }

        // Track max height
        const height = groundY - newBall.radius - newBall.y;
        if (height > 0) {
          setMaxHeight((prev) => Math.max(prev, height / PIXELS_PER_METER));
        }

        return newBall;
      });
    });
  }, [groundY]);

  // Animation loop
  useEffect(() => {
    if (!isRunning || balls.length === 0) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 50) / 1000;
      lastTimeRef.current = timestamp;

      updateBalls(deltaTime);

      // Update energy
      if (balls.length > 0) {
        const ball = balls[0];
        const height = Math.max(0, groundY - ball.radius - ball.y) / PIXELS_PER_METER;
        const velocity = Math.sqrt(ball.vx ** 2 + ball.vy ** 2) / PIXELS_PER_METER;
        const pe = height * GRAVITY;
        const ke = 0.5 * velocity * velocity;
        const total = pe + ke;
        setCurrentEnergy(ball.initialEnergy > 0 ? (total / ball.initialEnergy) * 100 : 0);
      }

      // Check if all balls stopped
      const allStopped = balls.every(
        (b) => Math.abs(b.vy) < 5 && b.y + b.radius >= groundY - 5
      );
      if (allStopped) {
        setIsRunning(false);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, balls, updateBalls, groundY]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear and draw background
      ctx.clearRect(0, 0, width, height);
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#1a0a0a');
      bgGradient.addColorStop(1, '#2e1a1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255,136,0,0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, groundY);
        ctx.stroke();
      }
      for (let y = 0; y < groundY; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Height markers
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px monospace';
      for (let y = groundY - 50; y > 0; y -= 50) {
        const meters = (groundY - y) / PIXELS_PER_METER;
        ctx.fillText(`${meters.toFixed(1)}m`, 5, y + 3);

        // Dashed line
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Drop height indicator
      const dropY = groundY - dropHeight;
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(width / 2 - 50, dropY);
      ctx.lineTo(width / 2 + 50, dropY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff8800';
      ctx.fillText('Drop Height', width / 2 - 30, dropY - 10);

      // Draw trails
      balls.forEach((ball) => {
        const trail = trailsRef.current.get(ball.id) || [];
        if (isRunning) {
          trail.push({ x: ball.x, y: ball.y, opacity: 1 });
          const newTrail = trail
            .map((p) => ({ ...p, opacity: p.opacity - 0.05 }))
            .filter((p) => p.opacity > 0);
          trailsRef.current.set(ball.id, newTrail);
        }

        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = ball.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Draw ground
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
      groundGradient.addColorStop(0, '#3a2a2a');
      groundGradient.addColorStop(1, '#2a1a1a');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Ground line with bounce effect styling
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw balls
      balls.forEach((ball) => {
        // Ball glow
        const glowGradient = ctx.createRadialGradient(
          ball.x,
          ball.y,
          0,
          ball.x,
          ball.y,
          ball.radius * 2.5
        );
        glowGradient.addColorStop(0, ball.color + '60');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Ball body
        const ballGradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        ballGradient.addColorStop(0, ball.color);
        ballGradient.addColorStop(1, adjustColor(ball.color, -50));
        ctx.fillStyle = ballGradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Squash effect on bounce
        if (ball.y + ball.radius >= groundY - 5 && Math.abs(ball.vy) > 50) {
          // Impact ring
          ctx.strokeStyle = ball.color + '80';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ball.x, groundY, ball.radius * 1.5, Math.PI, 0);
          ctx.stroke();
        }
      });

      // Energy bar
      if (showEnergy && balls.length > 0) {
        const barWidth = 25;
        const barHeight = 300;
        const barX = width - 60;
        const barY = 50;

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX - 10, barY - 20, barWidth + 20, barHeight + 50);

        // Bar background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Energy fill
        const energyHeight = (currentEnergy / 100) * barHeight;
        const energyGradient = ctx.createLinearGradient(barX, barY + barHeight, barX, barY);
        energyGradient.addColorStop(0, '#ff0000');
        energyGradient.addColorStop(0.5, '#ffff00');
        energyGradient.addColorStop(1, '#00ff00');
        ctx.fillStyle = energyGradient;
        ctx.fillRect(barX, barY + barHeight - energyHeight, barWidth, energyHeight);

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('Energy', barX - 5, barY - 5);
        ctx.fillText(`${currentEnergy.toFixed(0)}%`, barX, barY + barHeight + 20);
      }

      requestAnimationFrame(render);
    };

    const renderLoop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderLoop);
  }, [balls, dropHeight, showEnergy, currentEnergy, isRunning, groundY]);

  // Helper to darken/lighten color
  function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  const handleDrop = useCallback(() => {
    const id = `ball-${Date.now()}`;
    const y = groundY - dropHeight;
    const initialHeight = dropHeight / PIXELS_PER_METER;
    const initialEnergy = initialHeight * GRAVITY; // PE = mgh (m=1)

    const ball: Ball = {
      id,
      x: 300,
      y,
      vx: 0,
      vy: 0,
      radius: 25,
      color: selectedPreset
        ? BALL_PRESETS.find((p) => p.name === selectedPreset)?.color || '#ff8800'
        : '#ff8800',
      elasticity,
      initialEnergy,
    };

    setBalls([ball]);
    trailsRef.current.set(id, []);
    setBounceCount(0);
    setMaxHeight(initialHeight);
    setCurrentEnergy(100);
    setIsRunning(true);
  }, [dropHeight, elasticity, selectedPreset, groundY]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setBalls([]);
    trailsRef.current.clear();
    setBounceCount(0);
    setMaxHeight(0);
    setCurrentEnergy(0);
  }, []);

  const handlePresetSelect = useCallback((preset: typeof BALL_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setElasticity(preset.elasticity);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-orange/50 transition-colors"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              🏀 Bounce Lab
            </h1>
            <p className="text-sm text-text-secondary">
              Drop balls and explore elasticity and energy!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex gap-4 text-center">
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Bounces</div>
            <div className="text-lg font-display font-bold text-neon-orange">
              {bounceCount}
            </div>
          </div>
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Max Height</div>
            <div className="text-lg font-display font-bold text-neon-cyan">
              {maxHeight.toFixed(1)}m
            </div>
          </div>
          {showEnergy && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-bg-secondary rounded-xl border border-neon-green/30"
            >
              <div className="text-xs text-text-muted uppercase">Energy</div>
              <div className="text-lg font-display font-bold text-neon-green">
                {currentEnergy.toFixed(0)}%
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={480}
            className="rounded-2xl w-full"
            style={{ maxWidth: '600px' }}
          />

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDrop}
              disabled={isRunning}
              className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-orange to-amber-500 text-bg-primary shadow-[0_0_20px_rgba(255,136,0,0.3)] hover:shadow-[0_0_30px_rgba(255,136,0,0.5)] transition-all disabled:opacity-50"
            >
              {isRunning ? 'Bouncing...' : 'Drop Ball'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-white/20 text-white hover:border-neon-orange/50 transition-all"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Ball Type Selection */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Ball Type
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {BALL_PRESETS.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedPreset === preset.name
                      ? 'bg-neon-orange/20 border-2 border-neon-orange'
                      : 'bg-bg-tertiary border-2 border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{preset.icon}</span>
                  <p className="text-xs font-display text-white mt-1">{preset.name}</p>
                  <p className="text-xs text-text-muted">{(preset.elasticity * 100).toFixed(0)}%</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Elasticity Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Bounciness (Elasticity)
            </h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={elasticity}
              onChange={(e) => {
                setElasticity(parseFloat(e.target.value));
                setSelectedPreset(null);
              }}
              disabled={isRunning}
              className="w-full accent-neon-orange"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Clay</span>
              <span className="text-neon-orange font-display font-bold">
                {(elasticity * 100).toFixed(0)}%
              </span>
              <span className="text-text-muted">Super</span>
            </div>
          </div>

          {/* Drop Height Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Drop Height
            </h3>
            <input
              type="range"
              min="50"
              max="380"
              value={dropHeight}
              onChange={(e) => setDropHeight(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-cyan"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Low</span>
              <span className="text-neon-cyan font-display font-bold">
                {(dropHeight / PIXELS_PER_METER).toFixed(1)} m
              </span>
              <span className="text-text-muted">High</span>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Display Options
            </h3>
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

          {/* Physics Info */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Bounce Math
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">After 1 bounce:</span>
                <span className="text-neon-cyan font-mono">
                  {((dropHeight / PIXELS_PER_METER) * elasticity).toFixed(2)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">After 2 bounces:</span>
                <span className="text-neon-cyan font-mono">
                  {((dropHeight / PIXELS_PER_METER) * elasticity ** 2).toFixed(2)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Energy retained:</span>
                <span className="text-neon-green font-mono">
                  {(elasticity ** 2 * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-neon-orange/20 to-amber-500/10 rounded-2xl p-4 border border-neon-orange/30"
          >
            <h3 className="text-sm font-display font-bold text-neon-orange mb-2 flex items-center gap-2">
              💡 Fun Fact
            </h3>
            <p className="text-sm text-text-secondary">
              A super ball can bounce back to 92% of its drop height! That's because very little energy is lost when it hits the ground.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
