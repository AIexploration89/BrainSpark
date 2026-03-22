/**
 * Shared helpers for integrating the adaptive difficulty system
 * into individual game stores.
 *
 * Usage in a game store:
 *   import { applyDifficultyToLevel, recordGamePerformance } from '../../../stores/difficultyHelpers';
 *
 *   // In selectLevel:
 *   const adjusted = applyDifficultyToLevel(level, ['timeLimit', 'questionCount']);
 *
 *   // In finishRound:
 *   recordGamePerformance('game-id', levelId, accuracy, score);
 */

import { useDifficultyStore } from './difficultyStore';

/**
 * Apply difficulty tier modifiers to a level config object.
 * Only modifies the specified fields.
 */
export function applyDifficultyToLevel<T extends Record<string, unknown>>(
  level: T,
  fields: {
    timeLimit?: string;       // field name for time limit (seconds)
    questionCount?: string;   // field name for question/problem count
    hints?: string;           // field name for hint count
  }
): T {
  const store = useDifficultyStore.getState();
  const adjusted = { ...level };

  if (fields.timeLimit && typeof adjusted[fields.timeLimit] === 'number') {
    (adjusted as Record<string, unknown>)[fields.timeLimit] = store.applyTierToTimeLimit(
      adjusted[fields.timeLimit] as number
    );
  }

  if (fields.questionCount && typeof adjusted[fields.questionCount] === 'number') {
    (adjusted as Record<string, unknown>)[fields.questionCount] = store.applyTierToQuestionCount(
      adjusted[fields.questionCount] as number
    );
  }

  if (fields.hints && typeof adjusted[fields.hints] === 'number') {
    (adjusted as Record<string, unknown>)[fields.hints] = store.applyTierToHints(
      adjusted[fields.hints] as number
    );
  }

  return adjusted;
}

/**
 * Record a game performance result for adaptive difficulty suggestions.
 */
export function recordGamePerformance(
  gameId: string,
  levelId: number,
  accuracy: number,
  score: number
): void {
  useDifficultyStore.getState().recordPerformance({
    gameId,
    levelId,
    accuracy,
    score,
  });
}

/**
 * Get the current XP multiplier based on difficulty tier.
 */
export function getXpMultiplier(): number {
  return useDifficultyStore.getState().getXpMultiplier();
}
