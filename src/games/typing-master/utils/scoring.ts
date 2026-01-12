import type { GameResults, XPResult, TypingLevel } from '../types';

// WPM thresholds by level (age-appropriate)
const wpmThresholds: Record<number, number> = {
  1: 5,   // Letter Hunt
  2: 10,  // Home Row
  3: 15,  // Top Row
  4: 20,  // Bottom Row
  5: 25,  // Numbers
  6: 30,  // Punctuation
  7: 35,  // Sentences
  8: 40,  // Paragraphs
};

export function calculateXP(results: GameResults, level: TypingLevel): XPResult {
  const bonuses: { label: string; amount: number }[] = [];
  let xp = level.rewards.xpBase;

  // Accuracy multiplier
  if (results.accuracy >= 100) {
    const bonus = Math.round(level.rewards.xpBase * 1.0);
    bonuses.push({ label: 'Perfect Accuracy!', amount: bonus });
    xp += bonus;
  } else if (results.accuracy >= 95) {
    const bonus = Math.round(level.rewards.xpBase * 0.5);
    bonuses.push({ label: 'Excellent Accuracy', amount: bonus });
    xp += bonus;
  } else if (results.accuracy >= 90) {
    const bonus = Math.round(level.rewards.xpBase * 0.2);
    bonuses.push({ label: 'Great Accuracy', amount: bonus });
    xp += bonus;
  }

  // WPM bonus
  const wpmThreshold = wpmThresholds[level.id] || 20;
  if (results.wpm >= wpmThreshold * 1.5) {
    bonuses.push({ label: 'Speed Demon!', amount: 20 });
    xp += 20;
  } else if (results.wpm >= wpmThreshold) {
    bonuses.push({ label: 'Good Speed', amount: 10 });
    xp += 10;
  }

  // Streak bonus
  if (results.maxStreak >= 50) {
    bonuses.push({ label: 'Mega Streak!', amount: 15 });
    xp += 15;
  } else if (results.maxStreak >= 25) {
    bonuses.push({ label: 'Great Streak', amount: 10 });
    xp += 10;
  } else if (results.maxStreak >= 10) {
    bonuses.push({ label: 'Nice Streak', amount: 5 });
    xp += 5;
  }

  // Mode-specific bonuses
  if (results.mode === 'accuracy-challenge' && results.accuracy >= 95 && results.completed) {
    const bonus = Math.round(xp * 0.3);
    bonuses.push({ label: 'Accuracy Challenge Complete', amount: bonus });
    xp += bonus;
  }

  if (results.mode === 'time-attack') {
    const bonus = Math.round(xp * 0.2);
    bonuses.push({ label: 'Time Attack Bonus', amount: bonus });
    xp += bonus;
  }

  // Completion bonus
  if (results.completed) {
    bonuses.push({ label: 'Level Complete', amount: 5 });
    xp += 5;
  }

  return {
    baseXP: level.rewards.xpBase,
    bonusXP: xp - level.rewards.xpBase,
    totalXP: Math.round(xp),
    sparks: calculateSparks(results, level),
    bonuses,
  };
}

export function calculateSparks(results: GameResults, level: TypingLevel): number {
  let sparks = level.rewards.sparksBase;

  // Perfect accuracy bonus
  if (results.accuracy === 100) {
    sparks += 10;
  } else if (results.accuracy >= 95) {
    sparks += 5;
  }

  // Completion bonus
  if (results.completed) {
    sparks += 5;
  }

  return sparks;
}

export function getPerformanceRating(results: GameResults, levelId: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  const wpmThreshold = wpmThresholds[levelId] || 20;

  // Platinum: Perfect accuracy + high speed + long streak
  if (results.accuracy >= 98 && results.wpm >= wpmThreshold * 1.5 && results.maxStreak >= 30) {
    return 'platinum';
  }

  // Gold: Great accuracy + good speed
  if (results.accuracy >= 95 && results.wpm >= wpmThreshold) {
    return 'gold';
  }

  // Silver: Good accuracy
  if (results.accuracy >= 85) {
    return 'silver';
  }

  // Bronze: Completed
  return 'bronze';
}
