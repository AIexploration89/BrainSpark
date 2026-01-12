import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RampExperimentProps {
  onBack: () => void;
}

const GRAVITY = 9.81;
const PIXELS_PER_METER = 50;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onRamp: boolean;
}

export function RampExperiment({ onBack }: RampExperimentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [angle, setAngle] = useState(30); // degrees
  const [friction, setFriction] = useState(0.1);
  const [mass, setMass] = useState(1); // kg
  const [showForces, setShowForces] = useState(false);

  const [ball, setBall] = useState<Ball>({
    x: 80,
    y: 100,
    vx: 0,
    vy: 0,
    onRamp: true,
  });

  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const startPositionRef = useRef({ x: 80, y: 100 });
  const trailRef = useRef<{ x: number; y: number; opacity: number }[]>([]);

  // Calculate ramp geometry
  const rampStartX = 50;
  const rampStartY = 120;
  const rampLength = 350;
  const angleRad = (angle * Math.PI) / 180;
  const rampEndX = rampStartX + rampLength * Math.cos(angleRad);
  const rampEndY = rampStartY + rampLength * Math.sin(angleRad);
  const groundY = rampEndY + 20;

  // Physics simulation
  const updateBall = useCallback((dt: number) => {
    setBall((prev) => {
      const newBall = { ...prev };

      if (newBall.onRamp) {
        // On ramp physics
        // Acceleration along ramp = g * (sin(θ) - μ * cos(θ))
        const sinA = Math.sin(angleRad);
        const cosA = Math.cos(angleRad);
        const frictionForce = friction * cosA;
        const netAcceleration = GRAVITY * (sinA - frictionForce);

        // If friction is too high, ball won't move
        if (netAcceleration <= 0 && newBall.vx === 0 && newBall.vy === 0) {
          return prev;
        }

        // Update velocity along ramp
        const acceleration = netAcceleration * PIXELS_PER_METER;
        const speed = Math.sqrt(newBall.vx ** 2 + newBall.vy ** 2);
        const newSpeed = Math.max(0, speed + acceleration * dt);

        newBall.vx = newSpeed * cosA;
        newBall.vy = newSpeed * sinA;

        // Update position
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;

        // Check if off ramp
        if (newBall.x >= rampEndX - 20) {
          newBall.onRamp = false;
          // Keep horizontal velocity, add small upward component
          newBall.vy = -Math.abs(newBall.vy) * 0.3;
        }
      } else {
        // In air / on ground physics
        // Apply gravity
        newBall.vy += GRAVITY * PIXELS_PER_METER * dt;

        // Apply friction on ground
        if (newBall.y >= groundY - 20) {
          newBall.y = groundY - 20;
          newBall.vy = 0;
          // Ground friction
          if (Math.abs(newBall.vx) > 1) {
            newBall.vx *= (1 - friction * 2);
          } else {
            newBall.vx = 0;
          }
        }

        // Update position
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;

        // Boundary check
        if (newBall.x > 580) {
          newBall.x = 580;
          newBall.vx = 0;
        }
      }

      return newBall;
    });
  }, [angle, friction, rampEndX, groundY, angleRad]);

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 50) / 1000;
      lastTimeRef.current = timestamp;

      updateBall(deltaTime);

      // Update speed and distance
      const currentSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2) / PIXELS_PER_METER;
      setSpeed(currentSpeed);
      const dist = Math.sqrt(
        (ball.x - startPositionRef.current.x) ** 2 +
        (ball.y - startPositionRef.current.y) ** 2
      ) / PIXELS_PER_METER;
      setDistance(dist);

      // Check if ball stopped
      if (!ball.onRamp && Math.abs(ball.vx) < 0.5 && ball.y >= groundY - 25) {
        setIsRunning(false);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, updateBall, ball, groundY]);

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
      bgGradient.addColorStop(0, '#0f1a0f');
      bgGradient.addColorStop(1, '#1a2e1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0,255,136,0.1)';
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
      if (isRunning) {
        trailRef.current.push({ x: ball.x, y: ball.y, opacity: 1 });
        trailRef.current = trailRef.current
          .map((p) => ({ ...p, opacity: p.opacity - 0.03 }))
          .filter((p) => p.opacity > 0);
      }

      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw ramp
      ctx.save();

      // Ramp shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.moveTo(rampStartX + 5, rampStartY + 5);
      ctx.lineTo(rampEndX + 5, rampEndY + 5);
      ctx.lineTo(rampEndX + 5, groundY + 5);
      ctx.lineTo(rampStartX + 5, groundY + 5);
      ctx.closePath();
      ctx.fill();

      // Ramp body
      const rampGradient = ctx.createLinearGradient(rampStartX, rampStartY, rampEndX, rampEndY);
      rampGradient.addColorStop(0, '#4a6a4a');
      rampGradient.addColorStop(0.5, '#3a5a3a');
      rampGradient.addColorStop(1, '#2a4a2a');
      ctx.fillStyle = rampGradient;
      ctx.beginPath();
      ctx.moveTo(rampStartX, rampStartY);
      ctx.lineTo(rampEndX, rampEndY);
      ctx.lineTo(rampEndX, groundY);
      ctx.lineTo(rampStartX, groundY);
      ctx.closePath();
      ctx.fill();

      // Ramp surface
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rampStartX, rampStartY);
      ctx.lineTo(rampEndX, rampEndY);
      ctx.stroke();

      // Surface texture (friction indicator)
      if (friction > 0.2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          const t = i / 20;
          const x = rampStartX + t * (rampEndX - rampStartX);
          const y = rampStartY + t * (rampEndY - rampStartY);
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Draw ground
      ctx.fillStyle = '#2a3a2a';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.strokeStyle = '#4a6a4a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw angle indicator
      ctx.strokeStyle = 'rgba(0,245,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rampStartX, groundY, 50, -Math.PI / 2, -Math.PI / 2 + angleRad, false);
      ctx.stroke();
      ctx.fillStyle = '#00f5ff';
      ctx.font = '14px monospace';
      ctx.fillText(`${angle}°`, rampStartX + 55, groundY - 20);

      // Draw force vectors if enabled
      if (showForces && ball.onRamp) {
        const forceScale = 30;
        const ballCenterX = ball.x;
        const ballCenterY = ball.y;

        // Gravity (down)
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ballCenterX, ballCenterY);
        ctx.lineTo(ballCenterX, ballCenterY + forceScale * mass);
        ctx.stroke();
        drawArrowHead(ctx, ballCenterX, ballCenterY + forceScale * mass, Math.PI / 2, '#ff6b6b');
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '11px monospace';
        ctx.fillText('Weight', ballCenterX + 5, ballCenterY + forceScale * mass + 15);

        // Normal force (perpendicular to ramp)
        const normalAngle = -Math.PI / 2 + angleRad;
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(ballCenterX, ballCenterY);
        ctx.lineTo(
          ballCenterX - forceScale * mass * Math.cos(angleRad),
          ballCenterY - forceScale * mass * Math.sin(angleRad)
        );
        ctx.stroke();
        drawArrowHead(
          ctx,
          ballCenterX - forceScale * mass * Math.cos(angleRad),
          ballCenterY - forceScale * mass * Math.sin(angleRad),
          normalAngle + Math.PI,
          '#ffff00'
        );
        ctx.fillStyle = '#ffff00';
        ctx.fillText('Normal', ballCenterX - 50, ballCenterY - 20);

        // Friction force (up the ramp)
        if (friction > 0) {
          const frictionMag = friction * mass * GRAVITY * Math.cos(angleRad);
          ctx.strokeStyle = '#ff8800';
          ctx.beginPath();
          ctx.moveTo(ballCenterX, ballCenterY);
          ctx.lineTo(
            ballCenterX - forceScale * frictionMag * Math.cos(angleRad),
            ballCenterY - forceScale * frictionMag * Math.sin(angleRad)
          );
          ctx.stroke();
          ctx.fillStyle = '#ff8800';
          ctx.fillText('Friction', ballCenterX - 60, ballCenterY + 30);
        }
      }

      // Draw ball glow
      const glowGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, 50);
      glowGradient.addColorStop(0, 'rgba(0,255,136,0.4)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw ball
      const ballRadius = 18;
      const ballGradient = ctx.createRadialGradient(
        ball.x - ballRadius * 0.3,
        ball.y - ballRadius * 0.3,
        0,
        ball.x,
        ball.y,
        ballRadius
      );
      ballGradient.addColorStop(0, '#66ff99');
      ballGradient.addColorStop(1, '#00cc44');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fill();

      // Ball highlight
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(ball.x - 5, ball.y - 5, 6, 0, Math.PI * 2);
      ctx.fill();

      // Speed indicator
      if (isRunning) {
        const speedMs = Math.sqrt(ball.vx ** 2 + ball.vy ** 2) / PIXELS_PER_METER;
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`${speedMs.toFixed(1)} m/s`, ball.x + 25, ball.y - 10);
      }

      requestAnimationFrame(render);
    };

    const renderLoop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderLoop);
  }, [ball, angle, friction, mass, showForces, isRunning, angleRad, rampStartX, rampStartY, rampEndX, rampEndY, groundY]);

  // Helper function to draw arrow heads
  function drawArrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8 * Math.cos(angle - Math.PI / 6), y - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - 8 * Math.cos(angle + Math.PI / 6), y - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  const handleStart = useCallback(() => {
    // Position ball at top of ramp
    const startX = rampStartX + 30;
    const startY = rampStartY + 30 * Math.tan(angleRad) - 5;
    setBall({
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      onRamp: true,
    });
    startPositionRef.current = { x: startX, y: startY };
    trailRef.current = [];
    setSpeed(0);
    setDistance(0);
    setIsRunning(true);
  }, [angle, rampStartX, rampStartY, angleRad]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const startX = rampStartX + 30;
    const startY = rampStartY + 30 * Math.tan(angleRad) - 5;
    setBall({
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      onRamp: true,
    });
    trailRef.current = [];
    setSpeed(0);
    setDistance(0);
  }, [rampStartX, rampStartY, angleRad]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-green/50 transition-colors"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              🛝 Ramp Roller
            </h1>
            <p className="text-sm text-text-secondary">
              Roll objects down ramps and explore friction!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex gap-4 text-center">
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Speed</div>
            <div className="text-lg font-display font-bold text-neon-green">
              {speed.toFixed(1)} m/s
            </div>
          </div>
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Distance</div>
            <div className="text-lg font-display font-bold text-neon-cyan">
              {distance.toFixed(1)} m
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas Area */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            className="rounded-2xl w-full"
            style={{ maxWidth: '600px' }}
          />

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={isRunning}
              className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-green to-emerald-500 text-bg-primary shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all disabled:opacity-50"
            >
              {isRunning ? 'Rolling...' : 'Release Ball'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-white/20 text-white hover:border-neon-green/50 transition-all"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Angle Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Ramp Angle
            </h3>
            <input
              type="range"
              min="10"
              max="60"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-green"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Gentle</span>
              <span className="text-neon-green font-display font-bold">{angle}°</span>
              <span className="text-text-muted">Steep</span>
            </div>
          </div>

          {/* Friction Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Surface Friction
            </h3>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={friction}
              onChange={(e) => setFriction(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-orange"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Ice</span>
              <span className="text-neon-orange font-display font-bold">
                {friction === 0 ? 'None' : friction.toFixed(2)}
              </span>
              <span className="text-text-muted">Rough</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[
                { name: 'Ice', value: 0.02 },
                { name: 'Wood', value: 0.15 },
                { name: 'Rubber', value: 0.4 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setFriction(preset.value)}
                  disabled={isRunning}
                  className="flex-1 py-1 px-2 text-xs bg-bg-tertiary rounded-lg hover:bg-neon-orange/20 transition-colors disabled:opacity-50"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mass Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Ball Mass
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

          {/* Display Options */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Display Options
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Show Forces</span>
              <input
                type="checkbox"
                checked={showForces}
                onChange={(e) => setShowForces(e.target.checked)}
                className="w-5 h-5 accent-neon-cyan"
              />
            </label>
          </div>

          {/* Physics Info */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Physics Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Gravity component:</span>
                <span className="text-neon-cyan font-mono">
                  {(GRAVITY * Math.sin((angle * Math.PI) / 180)).toFixed(2)} m/s²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Friction force:</span>
                <span className="text-neon-orange font-mono">
                  {(friction * mass * GRAVITY * Math.cos((angle * Math.PI) / 180)).toFixed(2)} N
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Net acceleration:</span>
                <span className="text-neon-green font-mono">
                  {(GRAVITY * (Math.sin((angle * Math.PI) / 180) - friction * Math.cos((angle * Math.PI) / 180))).toFixed(2)} m/s²
                </span>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-neon-green/20 to-emerald-500/10 rounded-2xl p-4 border border-neon-green/30"
          >
            <h3 className="text-sm font-display font-bold text-neon-green mb-2 flex items-center gap-2">
              💡 Fun Fact
            </h3>
            <p className="text-sm text-text-secondary">
              Ancient Egyptians used ramps to build the pyramids! They discovered that a longer, gentler ramp makes it easier to move heavy stones.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
