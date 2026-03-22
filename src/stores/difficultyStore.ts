import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Adaptive Difficulty System
 *
 * Based on educational research:
 * - Zone of Proximal Development: ~80% accuracy = optimal challenge
 * - Kids should be able to freely explore harder content (no strict gating)
 * - Practice mode removes pressure, encouraging experimentation
 * - Challenge tiers provide voluntary difficulty increases with XP bonuses
 * - Recent performance (sliding window of last 5 attempts) informs suggestions
 */

export type ChallengeTier = 'explorer' | 'adventurer' | 'champion';
export type DifficultyPreference = 'practice' | 'normal' | 'challenge';

export interface PerformanceRecord {
  gameId: string;
  levelId: number;
  accuracy: number;
  score: number;
  timestamp: number;
}

export interface DifficultySettings {
  // Current challenge tier (affects time limits, question count, etc.)
  challengeTier: ChallengeTier;
  // Practice mode (no scoring pressure, unlimited hints)
  practiceMode: boolean;
  // Whether to auto-suggest difficulty changes
  autoSuggest: boolean;
}

export interface TierConfig {
  id: ChallengeTier;
  name: string;
  icon: string;
  color: string;
  description: string;
  xpMultiplier: number;
  // Modifiers applied to game parameters
  timeLimitMultiplier: number;     // 1.5x = more time, 0.7x = less time
  questionCountMultiplier: number; // 0.8x = fewer questions, 1.3x = more
  hintMultiplier: number;          // 2x = more hints, 0.5x = fewer
  choiceCountModifier: number;     // 0 = same, -1 = fewer choices, +1 = more
}

export const TIER_CONFIGS: Record<ChallengeTier, TierConfig> = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    icon: '\uD83C\uDF1F',
    color: 'neon-green',
    description: 'Take your time and learn at your own pace',
    xpMultiplier: 1.0,
    timeLimitMultiplier: 1.5,      // 50% more time
    questionCountMultiplier: 0.8,   // 20% fewer questions
    hintMultiplier: 2.0,           // Double hints
    choiceCountModifier: 1,        // Extra answer choices (easier to guess)
  },
  adventurer: {
    id: 'adventurer',
    name: 'Adventurer',
    icon: '\u2B50',
    color: 'neon-cyan',
    description: 'The standard challenge - balanced and fun',
    xpMultiplier: 1.0,
    timeLimitMultiplier: 1.0,
    questionCountMultiplier: 1.0,
    hintMultiplier: 1.0,
    choiceCountModifier: 0,
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    icon: '\uD83D\uDC51',
    color: 'neon-yellow',
    description: 'For brave learners who want an extra challenge!',
    xpMultiplier: 1.5,            // 50% more XP!
    timeLimitMultiplier: 0.7,      // 30% less time
    questionCountMultiplier: 1.3,   // 30% more questions
    hintMultiplier: 0.5,           // Half hints
    choiceCountModifier: -1,       // Fewer answer choices (harder)
  },
};

interface DifficultyStore {
  settings: DifficultySettings;
  recentPerformance: PerformanceRecord[];

  // Actions
  setChallengeTier: (tier: ChallengeTier) => void;
  setPracticeMode: (enabled: boolean) => void;
  setAutoSuggest: (enabled: boolean) => void;
  recordPerformance: (record: Omit<PerformanceRecord, 'timestamp'>) => void;

  // Computed
  getSuggestedTier: (gameId: string) => ChallengeTier;
  getRecentAccuracy: (gameId: string) => number | null;
  getTierConfig: () => TierConfig;
  applyTierToTimeLimit: (baseTimeLimit: number) => number;
  applyTierToQuestionCount: (baseCount: number) => number;
  applyTierToHints: (baseHints: number) => number;
  getXpMultiplier: () => number;
}

export const useDifficultyStore = create<DifficultyStore>()(
  persist(
    (set, get) => ({
      settings: {
        challengeTier: 'adventurer',
        practiceMode: false,
        autoSuggest: true,
      },
      recentPerformance: [],

      setChallengeTier: (tier) => set({
        settings: { ...get().settings, challengeTier: tier },
      }),

      setPracticeMode: (enabled) => set({
        settings: { ...get().settings, practiceMode: enabled },
      }),

      setAutoSuggest: (enabled) => set({
        settings: { ...get().settings, autoSuggest: enabled },
      }),

      recordPerformance: (record) => {
        const { recentPerformance } = get();
        const newRecord: PerformanceRecord = {
          ...record,
          timestamp: Date.now(),
        };

        // Keep last 20 records total, last 5 per game
        const updated = [...recentPerformance, newRecord]
          .slice(-20);

        set({ recentPerformance: updated });
      },

      getSuggestedTier: (gameId) => {
        const { recentPerformance } = get();

        // Get last 5 attempts for this game
        const gameRecords = recentPerformance
          .filter(r => r.gameId === gameId)
          .slice(-5);

        if (gameRecords.length < 3) return 'adventurer'; // Not enough data

        const avgAccuracy = gameRecords.reduce((sum, r) => sum + r.accuracy, 0) / gameRecords.length;

        // Based on Zone of Proximal Development research:
        // - Below 60%: Too hard, suggest easier
        // - 60-85%: In the zone, maintain current
        // - Above 85%: Too easy, suggest harder
        if (avgAccuracy < 60) return 'explorer';
        if (avgAccuracy > 85) return 'champion';
        return 'adventurer';
      },

      getRecentAccuracy: (gameId) => {
        const { recentPerformance } = get();
        const gameRecords = recentPerformance.filter(r => r.gameId === gameId);
        if (gameRecords.length === 0) return null;

        const recent = gameRecords.slice(-5);
        return recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length;
      },

      getTierConfig: () => {
        return TIER_CONFIGS[get().settings.challengeTier];
      },

      applyTierToTimeLimit: (baseTimeLimit) => {
        if (baseTimeLimit === 0) return 0; // No limit stays no limit
        const config = TIER_CONFIGS[get().settings.challengeTier];
        if (get().settings.practiceMode) return 0; // Practice mode = no time limit
        return Math.round(baseTimeLimit * config.timeLimitMultiplier);
      },

      applyTierToQuestionCount: (baseCount) => {
        const config = TIER_CONFIGS[get().settings.challengeTier];
        return Math.max(3, Math.round(baseCount * config.questionCountMultiplier));
      },

      applyTierToHints: (baseHints) => {
        const config = TIER_CONFIGS[get().settings.challengeTier];
        if (get().settings.practiceMode) return 99; // Practice = unlimited hints
        return Math.max(0, Math.round(baseHints * config.hintMultiplier));
      },

      getXpMultiplier: () => {
        if (get().settings.practiceMode) return 0.5; // Practice mode = half XP
        return TIER_CONFIGS[get().settings.challengeTier].xpMultiplier;
      },
    }),
    {
      name: 'brainspark-difficulty',
      version: 1,
    }
  )
);
