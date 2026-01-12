import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ForceExperimentProps {
  onBack: () => void;
}

const PIXELS_PER_METER = 50;

interface PhysicsBox {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  mass: number;
  width: number;
  height: number;
}

interface Force {
  x: number;
  y: number;
  magnitude: number;
}

export function ForceExperiment({ onBack }: ForceExperimentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [mass, setMass] = useState(2); // kg
  const [friction, setFriction] = useState(0.1);
  const [frictionEnabled, setFrictionEnabled] = useState(false);
  const [showVectors, setShowVectors] = useState(true);

  const [box, setBox] = useState<PhysicsBox>({
    x: 300,
    y: 350,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    mass: 2,
    width: 60,
    height: 60,
  });

  const [appliedForce, setAppliedForce] = useState<Force>({ x: 0, y: 0, magnitude: 0 });
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);

  const startPosRef = useRef({ x: 300, y: 350 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef<{ x: number; y: number; opacity: number }[]>([]);

  const groundY = 380;
  const GRAVITY = 9.81;

  // Update box mass when slider changes
  useEffect(() => {
    setBox((prev) => ({ ...prev, mass }));
  }, [mass]);

  // Physics simulation
  const updateBox = useCallback((dt: number) => {
    setBox((prev) => {
      const newBox = { ...prev };

      // Apply gravity
      newBox.ay = 0; // No gravity in this horizontal experiment

      // Apply friction if enabled and on ground
      if (frictionEnabled && newBox.y + newBox.height / 2 >= groundY) {
        const frictionForce = friction * newBox.mass * GRAVITY * PIXELS_PER_METER;
        if (Math.abs(newBox.vx) > 1) {
          const frictionDir = newBox.vx > 0 ? -1 : 1;
          newBox.ax += (frictionDir * frictionForce) / newBox.mass;
        } else if (appliedForce.magnitude === 0) {
          newBox.vx = 0;
        }
      }

      // Update velocity
      newBox.vx += newBox.ax * dt;
      newBox.vy += newBox.ay * dt;

      // Update position
      newBox.x += newBox.vx * dt;
      newBox.y += newBox.vy * dt;

      // Keep on ground
      if (newBox.y + newBox.height / 2 > groundY) {
        newBox.y = groundY - newBox.height / 2;
        newBox.vy = 0;
      }

      // Wall boundaries
      if (newBox.x - newBox.width / 2 < 0) {
        newBox.x = newBox.width / 2;
        newBox.vx = 0;
      }
      if (newBox.x + newBox.width / 2 > 600) {
        newBox.x = 600 - newBox.width / 2;
        newBox.vx = 0;
      }

      // Reset acceleration (forces need to be reapplied)
      newBox.ax = 0;
      newBox.ay = 0;

      return newBox;
    });
  }, [friction, frictionEnabled, appliedForce.magnitude, groundY]);

  // Animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 50) / 1000;
      lastTimeRef.current = timestamp;

      if (isRunning) {
        // Apply force if dragging
        if (isDraggingRef.current && appliedForce.magnitude > 0) {
          setBox((prev) => ({
            ...prev,
            ax: (appliedForce.x * appliedForce.magnitude * 50) / prev.mass,
            ay: (appliedForce.y * appliedForce.magnitude * 50) / prev.mass,
          }));
        }

        updateBox(deltaTime);

        // Update stats
        const currentSpeed = Math.abs(box.vx) / PIXELS_PER_METER;
        setSpeed(currentSpeed);
        const dist = Math.abs(box.x - startPosRef.current.x) / PIXELS_PER_METER;
        setDistance(dist);
        setAcceleration(Math.abs(box.ax) / PIXELS_PER_METER);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRunning, updateBox, box.vx, box.x, box.ax, appliedForce]);

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
      bgGradient.addColorStop(0, '#0a0a1f');
      bgGradient.addColorStop(1, '#1a1a3e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(139,92,246,0.1)';
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

      // Distance markers
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px monospace';
      for (let x = 50; x < width; x += 50) {
        const meters = x / PIXELS_PER_METER;
        ctx.fillText(`${meters.toFixed(0)}m`, x - 8, groundY + 20);
      }

      // Draw trail
      if (isRunning) {
        trailRef.current.push({ x: box.x, y: box.y, opacity: 1 });
        trailRef.current = trailRef.current
          .map((p) => ({ ...p, opacity: p.opacity - 0.02 }))
          .filter((p) => p.opacity > 0);
      }

      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw ground with friction indicator
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
      groundGradient.addColorStop(0, frictionEnabled ? '#3a3a4a' : '#2a2a3a');
      groundGradient.addColorStop(1, '#1a1a2a');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Ground line
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Friction texture
      if (frictionEnabled) {
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 15) {
          ctx.beginPath();
          ctx.moveTo(x, groundY + 2);
          ctx.lineTo(x + 8, groundY + 8);
          ctx.stroke();
        }
      }

      // Draw start position marker
      ctx.strokeStyle = 'rgba(139,92,246,0.5)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startPosRef.current.x, groundY - 100);
      ctx.lineTo(startPosRef.current.x, groundY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(139,92,246,0.5)';
      ctx.fillText('START', startPosRef.current.x - 18, groundY - 105);

      // Draw box shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(box.x - box.width / 2 + 5, box.y - box.height / 2 + 5, box.width, box.height);

      // Draw box glow
      const glowGradient = ctx.createRadialGradient(box.x, box.y, 0, box.x, box.y, box.width);
      glowGradient.addColorStop(0, 'rgba(139,92,246,0.4)');
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(box.x, box.y, box.width, 0, Math.PI * 2);
      ctx.fill();

      // Draw box
      const boxGradient = ctx.createLinearGradient(
        box.x - box.width / 2,
        box.y - box.height / 2,
        box.x + box.width / 2,
        box.y + box.height / 2
      );
      boxGradient.addColorStop(0, '#a78bfa');
      boxGradient.addColorStop(1, '#7c3aed');
      ctx.fillStyle = boxGradient;
      ctx.fillRect(box.x - box.width / 2, box.y - box.height / 2, box.width, box.height);

      // Box border
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x - box.width / 2, box.y - box.height / 2, box.width, box.height);

      // Mass label on box
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass}kg`, box.x, box.y + 5);
      ctx.textAlign = 'left';

      // Draw force vectors if enabled
      if (showVectors) {
        // Applied force (blue)
        if (appliedForce.magnitude > 0 && isDraggingRef.current) {
          const forceScale = 5;
          const endX = box.x + appliedForce.x * appliedForce.magnitude * forceScale;
          const endY = box.y + appliedForce.y * appliedForce.magnitude * forceScale;

          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(box.x, box.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arrow head
          const angle = Math.atan2(appliedForce.y, appliedForce.x);
          ctx.fillStyle = '#00f5ff';
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - 12 * Math.cos(angle - Math.PI / 6), endY - 12 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(endX - 12 * Math.cos(angle + Math.PI / 6), endY - 12 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();

          // Force label
          ctx.fillStyle = '#00f5ff';
          ctx.font = '12px monospace';
          ctx.fillText(`F = ${(appliedForce.magnitude * mass).toFixed(1)}N`, endX + 10, endY);
        }

        // Velocity vector (green)
        if (Math.abs(box.vx) > 5 || Math.abs(box.vy) > 5) {
          const velScale = 0.3;
          const vEndX = box.x + box.vx * velScale;
          const vEndY = box.y + box.vy * velScale;

          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(box.x, box.y - box.height / 2 - 10);
          ctx.lineTo(vEndX, box.y - box.height / 2 - 10);
          ctx.stroke();

          // Arrow head
          if (box.vx !== 0) {
            const vAngle = box.vx > 0 ? 0 : Math.PI;
            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.moveTo(vEndX, box.y - box.height / 2 - 10);
            ctx.lineTo(vEndX - 10 * Math.cos(vAngle - Math.PI / 6), box.y - box.height / 2 - 10 - 10 * Math.sin(vAngle - Math.PI / 6));
            ctx.lineTo(vEndX - 10 * Math.cos(vAngle + Math.PI / 6), box.y - box.height / 2 - 10 + 10 * Math.sin(vAngle - Math.PI / 6));
            ctx.closePath();
            ctx.fill();
          }

          ctx.fillStyle = '#00ff88';
          ctx.font = '11px monospace';
          ctx.fillText(`v = ${(Math.abs(box.vx) / PIXELS_PER_METER).toFixed(1)} m/s`, vEndX + 5, box.y - box.height / 2 - 15);
        }

        // Friction vector (orange) - opposing motion
        if (frictionEnabled && Math.abs(box.vx) > 5) {
          const frictionMag = friction * mass * GRAVITY;
          const frictionDir = box.vx > 0 ? -1 : 1;
          const fScale = 3;
          const fEndX = box.x + frictionDir * frictionMag * fScale;

          ctx.strokeStyle = '#ff8800';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(box.x, box.y + box.height / 2 + 10);
          ctx.lineTo(fEndX, box.y + box.height / 2 + 10);
          ctx.stroke();

          ctx.fillStyle = '#ff8800';
          ctx.font = '11px monospace';
          ctx.fillText(`f = ${frictionMag.toFixed(1)}N`, fEndX + (frictionDir > 0 ? 5 : -50), box.y + box.height / 2 + 25);
        }
      }

      // Instructions overlay
      if (!isRunning && !isDraggingRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(width / 2 - 150, 150, 300, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Click START, then drag on the box', width / 2, 180);
        ctx.fillText('to apply force!', width / 2, 200);
        ctx.textAlign = 'left';
      }

      requestAnimationFrame(render);
    };

    const renderLoop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderLoop);
  }, [box, appliedForce, showVectors, isRunning, mass, frictionEnabled, friction, groundY]);

  // Mouse handlers for force application
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on or near the box
    if (
      x >= box.x - box.width / 2 - 30 &&
      x <= box.x + box.width / 2 + 30 &&
      y >= box.y - box.height / 2 - 30 &&
      y <= box.y + box.height / 2 + 30
    ) {
      isDraggingRef.current = true;
      dragStartRef.current = { x, y };
    }
  }, [isRunning, box]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - dragStartRef.current.x;
    const dy = y - dragStartRef.current.y;
    const magnitude = Math.min(Math.sqrt(dx * dx + dy * dy), 100) / 20;
    const normalizedX = dx / (Math.sqrt(dx * dx + dy * dy) || 1);
    const normalizedY = dy / (Math.sqrt(dx * dx + dy * dy) || 1);

    setAppliedForce({
      x: normalizedX,
      y: normalizedY,
      magnitude,
    });
  }, [isRunning]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setAppliedForce({ x: 0, y: 0, magnitude: 0 });
  }, []);

  const handleStart = useCallback(() => {
    setBox({
      x: 100,
      y: groundY - 30,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      mass,
      width: 40 + mass * 5,
      height: 40 + mass * 5,
    });
    startPosRef.current = { x: 100, y: groundY - 30 };
    trailRef.current = [];
    setDistance(0);
    setSpeed(0);
    setAcceleration(0);
    setIsRunning(true);
  }, [mass, groundY]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    isDraggingRef.current = false;
    setAppliedForce({ x: 0, y: 0, magnitude: 0 });
    setBox({
      x: 300,
      y: groundY - 30,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      mass,
      width: 40 + mass * 5,
      height: 40 + mass * 5,
    });
    trailRef.current = [];
    setDistance(0);
    setSpeed(0);
    setAcceleration(0);
  }, [mass, groundY]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-white/10 text-text-secondary hover:text-white hover:border-neon-purple/50 transition-colors"
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              💪 Force Arena
            </h1>
            <p className="text-sm text-text-secondary">
              Push objects and discover Newton's Laws!
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
            <div className="text-lg font-display font-bold text-neon-purple">
              {distance.toFixed(1)} m
            </div>
          </div>
          <div className="px-4 py-2 bg-bg-secondary rounded-xl border border-white/10">
            <div className="text-xs text-text-muted uppercase">Accel</div>
            <div className="text-lg font-display font-bold text-neon-cyan">
              {acceleration.toFixed(1)} m/s²
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="rounded-2xl w-full cursor-pointer"
            style={{ maxWidth: '600px' }}
          />

          {/* Action buttons */}
          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={isRunning}
              className="flex-1 py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-purple to-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
            >
              {isRunning ? 'Drag to Push!' : 'Start'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="py-3 px-6 rounded-xl font-display font-semibold uppercase tracking-wider bg-bg-secondary border border-white/20 text-white hover:border-neon-purple/50 transition-all"
            >
              Reset
            </motion.button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Mass Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Object Mass
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-neon-purple"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-text-muted">Light</span>
              <span className="text-neon-purple font-display font-bold">{mass} kg</span>
              <span className="text-text-muted">Heavy</span>
            </div>
          </div>

          {/* Friction Control */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Friction
            </h3>
            <label className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">Enable Friction</span>
              <input
                type="checkbox"
                checked={frictionEnabled}
                onChange={(e) => setFrictionEnabled(e.target.checked)}
                disabled={isRunning}
                className="w-5 h-5 accent-neon-orange"
              />
            </label>
            {frictionEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={friction}
                  onChange={(e) => setFriction(parseFloat(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-neon-orange"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-text-muted">Smooth</span>
                  <span className="text-neon-orange font-display font-bold">
                    μ = {friction.toFixed(2)}
                  </span>
                  <span className="text-text-muted">Rough</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Display Options */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Display Options
            </h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Show Force Vectors</span>
              <input
                type="checkbox"
                checked={showVectors}
                onChange={(e) => setShowVectors(e.target.checked)}
                className="w-5 h-5 accent-neon-cyan"
              />
            </label>
          </div>

          {/* Newton's Law Info */}
          <div className="bg-bg-secondary rounded-2xl p-4 border border-white/10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3">
              Newton's 2nd Law
            </h3>
            <div className="text-center py-4 bg-bg-tertiary rounded-xl">
              <span className="text-3xl font-display font-bold text-neon-cyan">F = ma</span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Force (F):</span>
                <span className="text-neon-cyan font-mono">
                  {(appliedForce.magnitude * mass).toFixed(1)} N
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Mass (m):</span>
                <span className="text-neon-purple font-mono">{mass} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Acceleration (a):</span>
                <span className="text-neon-green font-mono">{acceleration.toFixed(2)} m/s²</span>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-neon-purple/20 to-violet-500/10 rounded-2xl p-4 border border-neon-purple/30"
          >
            <h3 className="text-sm font-display font-bold text-neon-purple mb-2 flex items-center gap-2">
              💡 Fun Fact
            </h3>
            <p className="text-sm text-text-secondary">
              Newton's famous equation F=ma explains why it's harder to push a heavy shopping cart than an empty one - more mass means you need more force!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
