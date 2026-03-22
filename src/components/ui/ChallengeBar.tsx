import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useDifficultyStore, TIER_CONFIGS, type ChallengeTier } from '../../stores/difficultyStore';

// Static Tailwind class maps for JIT compatibility
const tierBgClasses: Record<string, string> = {
  'neon-green': 'bg-neon-green/20 border-neon-green/40',
  'neon-cyan': 'bg-neon-cyan/20 border-neon-cyan/40',
  'neon-yellow': 'bg-neon-yellow/20 border-neon-yellow/40',
};

const tierTextClasses: Record<string, string> = {
  'neon-green': 'text-neon-green',
  'neon-cyan': 'text-neon-cyan',
  'neon-yellow': 'text-neon-yellow',
};

const tierActiveBgClasses: Record<string, string> = {
  'neon-green': 'bg-neon-green text-bg-primary',
  'neon-cyan': 'bg-neon-cyan text-bg-primary',
  'neon-yellow': 'bg-neon-yellow text-bg-primary',
};

const tierGlowClasses: Record<string, string> = {
  'neon-green': 'shadow-[0_0_20px_rgba(0,255,136,0.4)]',
  'neon-cyan': 'shadow-[0_0_20px_rgba(0,245,255,0.4)]',
  'neon-yellow': 'shadow-[0_0_20px_rgba(255,255,0,0.4)]',
};

interface ChallengeBarProps {
  gameId?: string;
  compact?: boolean;
  className?: string;
}

/**
 * ChallengeBar - Lets kids freely select their difficulty tier
 *
 * Shows three tiers: Explorer (easy), Adventurer (normal), Champion (hard)
 * Also includes a Practice Mode toggle.
 * Auto-suggests a tier based on recent performance when available.
 */
export function ChallengeBar({ gameId, compact = false, className = '' }: ChallengeBarProps) {
  const {
    settings,
    setChallengeTier,
    setPracticeMode,
    getSuggestedTier,
    getRecentAccuracy,
  } = useDifficultyStore();

  const [showDetails, setShowDetails] = useState(false);
  const suggestedTier = gameId ? getSuggestedTier(gameId) : null;
  const recentAccuracy = gameId ? getRecentAccuracy(gameId) : null;
  const currentConfig = TIER_CONFIGS[settings.challengeTier];

  const tiers: ChallengeTier[] = ['explorer', 'adventurer', 'champion'];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {tiers.map((tier) => {
          const config = TIER_CONFIGS[tier];
          const isActive = settings.challengeTier === tier;
          return (
            <motion.button
              key={tier}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChallengeTier(tier)}
              className={`
                px-3 py-1.5 rounded-lg font-display text-xs uppercase tracking-wider
                border transition-all duration-200
                ${isActive
                  ? `${tierActiveBgClasses[config.color]} ${tierGlowClasses[config.color]} font-bold`
                  : `${tierBgClasses[config.color]} ${tierTextClasses[config.color]} hover:opacity-80`
                }
              `}
              aria-pressed={isActive}
              aria-label={`Set difficulty to ${config.name}`}
            >
              <span className="mr-1">{config.icon}</span>
              {config.name}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Challenge tier selector */}
      <div className="bg-bg-secondary/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-white text-sm flex items-center gap-2">
            <span>{currentConfig.icon}</span>
            Challenge Level
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-text-muted text-xs hover:text-white transition-colors"
          >
            {showDetails ? 'Hide details' : 'What\'s this?'}
          </button>
        </div>

        {/* Tier buttons */}
        <div className="flex gap-2 mb-3" role="radiogroup" aria-label="Challenge tier">
          {tiers.map((tier) => {
            const config = TIER_CONFIGS[tier];
            const isActive = settings.challengeTier === tier;
            const isSuggested = suggestedTier === tier && tier !== settings.challengeTier;

            return (
              <motion.button
                key={tier}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setChallengeTier(tier)}
                role="radio"
                aria-checked={isActive}
                className={`
                  relative flex-1 py-3 px-3 rounded-xl font-display text-sm uppercase tracking-wider
                  border-2 transition-all duration-200 text-center
                  ${isActive
                    ? `${tierActiveBgClasses[config.color]} ${tierGlowClasses[config.color]} font-bold`
                    : `bg-bg-tertiary/50 ${tierTextClasses[config.color]} border-white/10 hover:border-white/30`
                  }
                `}
              >
                <div className="text-lg mb-0.5">{config.icon}</div>
                <div className="text-xs">{config.name}</div>
                {config.xpMultiplier > 1 && (
                  <div className="text-[10px] mt-0.5 opacity-80">
                    {config.xpMultiplier}x XP
                  </div>
                )}
                {/* Suggested badge */}
                {isSuggested && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-neon-purple text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  >
                    TRY ME
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Practice mode toggle */}
        <div className="flex items-center justify-between py-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer" htmlFor="practice-mode">
            <span className="text-sm text-text-secondary">Practice Mode</span>
            <span className="text-xs text-text-muted">(no timer, extra hints)</span>
          </label>
          <button
            id="practice-mode"
            role="switch"
            aria-checked={settings.practiceMode}
            onClick={() => setPracticeMode(!settings.practiceMode)}
            className={`
              relative w-11 h-6 rounded-full transition-colors duration-200
              ${settings.practiceMode ? 'bg-neon-green' : 'bg-bg-tertiary'}
            `}
          >
            <motion.div
              animate={{ x: settings.practiceMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {/* Recent performance indicator */}
        {recentAccuracy !== null && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Recent accuracy</span>
              <span className={`font-display font-bold ${
                recentAccuracy >= 85 ? 'text-neon-green' :
                recentAccuracy >= 60 ? 'text-neon-cyan' :
                'text-neon-orange'
              }`}>
                {Math.round(recentAccuracy)}%
              </span>
            </div>
            <div className="h-1 bg-bg-tertiary rounded-full mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recentAccuracy}%` }}
                className={`h-full rounded-full ${
                  recentAccuracy >= 85 ? 'bg-neon-green' :
                  recentAccuracy >= 60 ? 'bg-neon-cyan' :
                  'bg-neon-orange'
                }`}
              />
            </div>
          </div>
        )}

        {/* Details panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-2 border-t border-white/5 space-y-2">
                <p className="text-xs text-text-secondary">
                  Choose your challenge level! Higher tiers give more XP but are trickier.
                </p>
                <div className="space-y-1.5">
                  {tiers.map((tier) => {
                    const config = TIER_CONFIGS[tier];
                    return (
                      <div key={tier} className="flex items-start gap-2 text-xs">
                        <span>{config.icon}</span>
                        <div>
                          <span className={`font-bold ${tierTextClasses[config.color]}`}>
                            {config.name}:
                          </span>{' '}
                          <span className="text-text-muted">{config.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  Practice Mode removes time limits and gives extra hints - perfect for learning new topics!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * ChallengeBadge - Small inline badge showing current tier
 * Use in game headers/nav to show active difficulty
 */
export function ChallengeBadge() {
  const { settings } = useDifficultyStore();
  const config = TIER_CONFIGS[settings.challengeTier];

  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display font-bold
      ${tierBgClasses[config.color]} ${tierTextClasses[config.color]} border
    `}>
      <span>{config.icon}</span>
      <span>{config.name}</span>
      {settings.practiceMode && (
        <span className="ml-1 text-neon-green text-[9px]">(Practice)</span>
      )}
    </div>
  );
}
