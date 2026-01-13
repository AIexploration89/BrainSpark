import { motion } from 'framer-motion';

interface LabBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  category?: 'biology' | 'chemistry' | 'physics' | 'earth-science' | null;
}

export function LabBackground({ intensity = 'medium', category = null }: LabBackgroundProps) {
  // Get color based on category
  const getColors = () => {
    switch (category) {
      case 'biology':
        return { primary: 'rgba(0,255,136,', secondary: 'rgba(16,185,129,' };
      case 'chemistry':
        return { primary: 'rgba(139,92,246,', secondary: 'rgba(168,85,247,' };
      case 'physics':
        return { primary: 'rgba(0,245,255,', secondary: 'rgba(59,130,246,' };
      case 'earth-science':
        return { primary: 'rgba(255,107,53,', secondary: 'rgba(245,158,11,' };
      default:
        return { primary: 'rgba(0,245,255,', secondary: 'rgba(255,0,255,' };
    }
  };

  const colors = getColors();
  const particleCount = intensity === 'high' ? 25 : intensity === 'medium' ? 15 : 8;

  // Science-themed floating elements
  const scienceIcons = ['⚗️', '🧪', '🔬', '⚛️', '🧬', '🔭', '💡', '⚡', '🧲', '🌡️'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${colors.primary}0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${colors.secondary}0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated grid pattern - like graph paper */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary}0.3) 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary}0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Hexagonal molecular pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon
              points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" className="text-neon-cyan" />
      </svg>

      {/* Floating particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `${i % 2 === 0 ? colors.primary : colors.secondary}0.6)`,
            boxShadow: `0 0 ${10 + Math.random() * 10}px ${i % 2 === 0 ? colors.primary : colors.secondary}0.4)`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 20, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating science icons */}
      {intensity !== 'low' && scienceIcons.slice(0, intensity === 'high' ? 10 : 5).map((icon, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${10 + (i * 18) % 80}%`,
            top: `${15 + (i * 23) % 70}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Orbiting electrons (atom effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={`orbit-${ring}`}
            className="absolute rounded-full border border-dashed"
            style={{
              width: 150 * ring,
              height: 150 * ring,
              marginLeft: -75 * ring,
              marginTop: -75 * ring,
              borderColor: `${colors.primary}0.1)`,
              transform: `rotate(${ring * 30}deg)`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20 + ring * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Electron on orbit */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: -6,
                left: '50%',
                marginLeft: -6,
                background: `${colors.primary}0.8)`,
                boxShadow: `0 0 15px ${colors.primary}0.6)`,
              }}
            />
          </motion.div>
        ))}

        {/* Nucleus */}
        <motion.div
          className="absolute w-8 h-8 rounded-full"
          style={{
            marginLeft: -16,
            marginTop: -16,
            background: `radial-gradient(circle at 30% 30%, ${colors.secondary}0.8), ${colors.primary}0.6))`,
            boxShadow: `0 0 30px ${colors.primary}0.4)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* DNA Helix on the side */}
      <div className="absolute right-8 top-1/4 bottom-1/4 w-12 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`dna-${i}`}
            className="absolute w-full flex justify-between"
            style={{ top: `${i * 8}%` }}
            animate={{
              x: [Math.sin(i * 0.5) * 10, Math.sin(i * 0.5 + Math.PI) * 10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.1,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? colors.primary + '0.8)' : colors.secondary + '0.8)',
              }}
            />
            <div className="flex-1 h-0.5 bg-white/20 self-center mx-1" />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? colors.secondary + '0.8)' : colors.primary + '0.8)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Beaker bubbles effect (left side) */}
      <div className="absolute left-4 bottom-0 w-20 h-48 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              left: `${20 + Math.random() * 60}%`,
              bottom: 0,
              background: `${colors.primary}0.5)`,
              border: `1px solid ${colors.primary}0.8)`,
            }}
            animate={{
              y: [0, -150 - Math.random() * 50],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0.8, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Corner lab equipment decorations */}
      <div className="absolute bottom-4 left-4 text-4xl opacity-10">🧪</div>
      <div className="absolute bottom-4 right-4 text-4xl opacity-10">⚗️</div>
      <div className="absolute top-4 left-4 text-4xl opacity-10">🔬</div>
      <div className="absolute top-4 right-4 text-4xl opacity-10">🧬</div>
    </div>
  );
}
