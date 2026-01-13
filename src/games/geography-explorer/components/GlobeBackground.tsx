import { motion } from 'framer-motion';

interface GlobeBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export function GlobeBackground({ intensity = 'medium' }: GlobeBackgroundProps) {
  const opacityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.08 * opacityMultiplier,
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Latitude lines (horizontal curves) */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 * opacityMultiplier }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {[20, 35, 50, 65, 80].map((y) => (
          <motion.path
            key={y}
            d={`M 0 ${y} Q 25 ${y - 8} 50 ${y} Q 75 ${y + 8} 100 ${y}`}
            fill="none"
            stroke="rgba(0,245,255,0.5)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: y * 0.01 }}
          />
        ))}
        {/* Longitude lines (vertical curves) */}
        {[20, 35, 50, 65, 80].map((x) => (
          <motion.path
            key={`v-${x}`}
            d={`M ${x} 0 Q ${x - 5} 25 ${x} 50 Q ${x + 5} 75 ${x} 100`}
            fill="none"
            stroke="rgba(255,0,255,0.3)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: x * 0.01 }}
          />
        ))}
      </svg>

      {/* Scanning line effect */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
        style={{ opacity: 0.5 * opacityMultiplier }}
      />

      {/* Central globe representation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] border rounded-full"
          style={{
            borderColor: `rgba(0,245,255,${0.15 * opacityMultiplier})`,
          }}
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] border rounded-full"
          style={{
            borderColor: `rgba(255,0,255,${0.1 * opacityMultiplier})`,
            transform: 'translate(-50%, -50%) rotateX(60deg)',
          }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] border border-dashed rounded-full"
          style={{
            borderColor: `rgba(0,255,136,${0.1 * opacityMultiplier})`,
          }}
        />
      </div>

      {/* Floating location markers */}
      {[
        { x: '15%', y: '30%', emoji: '📍', delay: 0 },
        { x: '75%', y: '25%', emoji: '📍', delay: 0.5 },
        { x: '25%', y: '70%', emoji: '📍', delay: 1 },
        { x: '80%', y: '65%', emoji: '📍', delay: 1.5 },
        { x: '50%', y: '45%', emoji: '🌍', delay: 2 },
      ].map((marker, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3 * opacityMultiplier, 0.3 * opacityMultiplier, 0],
            scale: [0, 1, 1, 0],
            y: [0, -10, -10, -20],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: marker.delay,
            times: [0, 0.2, 0.8, 1],
          }}
          className="absolute text-2xl"
          style={{ left: marker.x, top: marker.y }}
        >
          {marker.emoji}
        </motion.div>
      ))}

      {/* Gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(0,245,255,${0.15 * opacityMultiplier}) 0%, transparent 70%)`,
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(255,0,255,${0.15 * opacityMultiplier}) 0%, transparent 70%)`,
        }}
      />

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute ${corner.includes('top') ? 'top-6' : 'bottom-6'} ${corner.includes('left') ? 'left-6' : 'right-6'} w-12 h-12`}
          style={{ opacity: 0.3 * opacityMultiplier }}
        >
          <div
            className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-6 h-0.5 bg-neon-cyan`}
          />
          <div
            className={`absolute ${corner.includes('top') ? 'top-0' : 'bottom-0'} ${corner.includes('left') ? 'left-0' : 'right-0'} w-0.5 h-6 bg-neon-cyan`}
          />
        </div>
      ))}

      {/* Data stream effect */}
      <div className="absolute right-8 top-1/4 h-1/2 w-px overflow-hidden" style={{ opacity: 0.2 * opacityMultiplier }}>
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
        />
      </div>
      <div className="absolute left-8 top-1/3 h-1/2 w-px overflow-hidden" style={{ opacity: 0.2 * opacityMultiplier }}>
        <motion.div
          animate={{ y: ['200%', '-100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-neon-pink to-transparent"
        />
      </div>
    </div>
  );
}
