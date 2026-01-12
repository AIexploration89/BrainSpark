import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glowing?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-neon-cyan to-neon-purple
    text-white font-semibold
    shadow-[0_0_20px_rgba(0,245,255,0.4)]
    hover:shadow-[0_0_30px_rgba(0,245,255,0.6)]
    hover:from-neon-cyan hover:to-neon-pink
  `,
  secondary: `
    bg-bg-tertiary border border-neon-cyan/30
    text-neon-cyan font-medium
    hover:bg-neon-cyan/10 hover:border-neon-cyan/60
    hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]
  `,
  ghost: `
    bg-transparent
    text-text-secondary font-medium
    hover:text-neon-cyan hover:bg-white/5
  `,
  danger: `
    bg-gradient-to-r from-neon-red to-neon-orange
    text-white font-semibold
    shadow-[0_0_20px_rgba(255,51,102,0.4)]
    hover:shadow-[0_0_30px_rgba(255,51,102,0.6)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-xl gap-2.5',
  xl: 'px-10 py-5 text-xl rounded-2xl gap-3',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  glowing = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        relative inline-flex items-center justify-center
        font-display uppercase tracking-wider
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${glowing ? 'animate-pulse' : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {/* Shimmer effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
      </span>

      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}

// Icon button variant
interface IconButtonProps {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  onClick,
  disabled,
}: IconButtonProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${iconSizes[size]}
        rounded-full flex items-center justify-center
        transition-all duration-200
        ${variantStyles[variant]}
        ${className}
      `}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </motion.button>
  );
}
