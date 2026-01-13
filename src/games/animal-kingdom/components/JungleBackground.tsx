import { motion } from 'framer-motion';

interface JungleBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export function JungleBackground({ intensity = 'medium' }: JungleBackgroundProps) {
  const particleCount = intensity === 'high' ? 30 : intensity === 'medium' ? 20 : 12;

  // Bioluminescent colors
  const glowColors = [
    'rgba(0, 255, 136, 0.6)',   // neon-green
    'rgba(0, 245, 255, 0.5)',   // neon-cyan
    'rgba(139, 92, 246, 0.5)',  // neon-purple
    'rgba(255, 229, 92, 0.4)',  // neon-yellow
  ];

  // Floating wildlife emojis
  const wildlifeEmojis = ['🦋', '🐦', '🌿', '🍃', '🌺', '🦜', '🐾', '✨'];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep jungle gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(0, 80, 50, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 100, 80, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%),
            linear-gradient(to bottom, #0a0a0f 0%, #0d1510 50%, #0a0a0f 100%)
          `,
        }}
      />

      {/* Animated jungle vines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,30 Q20,40 40,30 T80,35 T100,30"
          fill="none"
          stroke="url(#vineGradient1)"
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,70 Q30,60 50,70 T100,65"
          fill="none"
          stroke="url(#vineGradient2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: 'easeInOut', delay: 0.5 }}
        />
        <defs>
          <linearGradient id="vineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.5)" />
            <stop offset="50%" stopColor="rgba(0,245,255,0.5)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.5)" />
          </linearGradient>
          <linearGradient id="vineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.5)" />
            <stop offset="100%" stopColor="rgba(0,255,136,0.5)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bioluminescent particles (fireflies) */}
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={`firefly-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: glowColors[i % glowColors.length],
            boxShadow: `0 0 ${10 + Math.random() * 20}px ${glowColors[i % glowColors.length]}`,
          }}
          animate={{
            x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
            y: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
            opacity: [0.3, 0.8, 0.5, 0.3],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating wildlife elements */}
      {intensity !== 'low' && [...Array(intensity === 'high' ? 12 : 8)].map((_, i) => (
        <motion.span
          key={`wildlife-${i}`}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {wildlifeEmojis[i % wildlifeEmojis.length]}
        </motion.span>
      ))}

      {/* Corner leaf decorations */}
      <motion.div
        className="absolute top-0 left-0 text-6xl opacity-15"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.3))' }}
      >
        🌿
      </motion.div>
      <motion.div
        className="absolute top-0 right-0 text-6xl opacity-15 transform scale-x-[-1]"
        animate={{ rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.3))' }}
      >
        🌿
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 text-5xl opacity-10"
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.3))' }}
      >
        🌺
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0 text-5xl opacity-10 transform scale-x-[-1]"
        animate={{ rotate: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        style={{ filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.3))' }}
      >
        🌺
      </motion.div>

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: '-10%',
          top: '30%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          right: '-5%',
          bottom: '20%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
