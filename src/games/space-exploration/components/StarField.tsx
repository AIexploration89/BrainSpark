import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
  color: string;
}

interface StarFieldProps {
  starCount?: number;
  showShootingStars?: boolean;
  className?: string;
}

const STAR_COLORS = [
  '#ffffff',
  '#00F5FF',
  '#FFE55C',
  '#FF00FF',
  '#00FF88',
];

export function StarField({
  starCount = 150,
  showShootingStars = true,
  className = '',
}: StarFieldProps) {
  // Generate stars once
  const stars = useMemo(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleDelay: Math.random() * 5,
        twinkleDuration: Math.random() * 2 + 1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }
    return generatedStars;
  }, [starCount]);

  // Generate distant galaxies/nebulae
  const nebulae = useMemo(() => {
    return [
      { x: 20, y: 30, color: 'rgba(139, 92, 246, 0.1)', size: 300 },
      { x: 70, y: 60, color: 'rgba(0, 245, 255, 0.08)', size: 250 },
      { x: 85, y: 20, color: 'rgba(255, 0, 255, 0.06)', size: 200 },
    ];
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(10, 10, 20, 1) 0%, #0a0a0f 100%)
          `,
        }}
      />

      {/* Nebulae */}
      {nebulae.map((nebula, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: nebula.size,
            height: nebula.size,
            background: nebula.color,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">
        {stars.map((star) => (
          <motion.circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill={star.color}
            initial={{ opacity: star.opacity }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.twinkleDuration,
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Shooting stars */}
      {showShootingStars && (
        <>
          <ShootingStar delay={0} startX={10} startY={20} />
          <ShootingStar delay={7} startX={50} startY={10} />
          <ShootingStar delay={15} startX={80} startY={30} />
        </>
      )}

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}

interface ShootingStarProps {
  delay: number;
  startX: number;
  startY: number;
}

function ShootingStar({ delay, startX, startY }: ShootingStarProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 200],
        y: [0, 100],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 10 + Math.random() * 10,
        ease: 'easeOut',
      }}
    >
      {/* Shooting star head */}
      <div
        className="w-2 h-2 rounded-full bg-white"
        style={{
          boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(0, 245, 255, 0.5)',
        }}
      />
      {/* Shooting star tail */}
      <div
        className="absolute top-1/2 right-full w-20 h-0.5 -translate-y-1/2"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8))',
        }}
      />
    </motion.div>
  );
}

export default StarField;
