import type { TypingLevel } from '../types';

export const typingLevels: TypingLevel[] = [
  {
    id: 1,
    name: 'Letter Hunt',
    description: 'Find single letters on the keyboard',
    ageRange: '3-5',
    allowedKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    contentType: 'single-letter',
    difficulty: 'easy',
    requirements: null,
    rewards: { xpBase: 10, sparksBase: 5 },
  },
  {
    id: 2,
    name: 'Home Row',
    description: 'Master the home row keys: ASDF JKL;',
    ageRange: '5-7',
    allowedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    contentType: 'sequences',
    difficulty: 'easy',
    requirements: { level: 1, accuracy: 80 },
    rewards: { xpBase: 15, sparksBase: 7 },
  },
  {
    id: 3,
    name: 'Top Row',
    description: 'Add the top row: QWERTYUIOP',
    ageRange: '6-8',
    allowedKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    contentType: 'words',
    difficulty: 'medium',
    requirements: { level: 2, accuracy: 85 },
    rewards: { xpBase: 20, sparksBase: 10 },
  },
  {
    id: 4,
    name: 'Bottom Row',
    description: 'Complete the alphabet with ZXCVBNM',
    ageRange: '7-9',
    allowedKeys: 'abcdefghijklmnopqrstuvwxyz;'.split(''),
    contentType: 'words',
    difficulty: 'medium',
    requirements: { level: 3, accuracy: 85 },
    rewards: { xpBase: 25, sparksBase: 12 },
  },
  {
    id: 5,
    name: 'Numbers',
    description: 'Add the number row: 1234567890',
    ageRange: '8-10',
    allowedKeys: [...'abcdefghijklmnopqrstuvwxyz;'.split(''), '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    contentType: 'words',
    difficulty: 'medium',
    requirements: { level: 4, accuracy: 85 },
    rewards: { xpBase: 30, sparksBase: 15 },
  },
  {
    id: 6,
    name: 'Punctuation',
    description: 'Master commas, periods, and more',
    ageRange: '9-11',
    allowedKeys: [...'abcdefghijklmnopqrstuvwxyz'.split(''), '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '!', '?', ';', ':', "'", '"'],
    contentType: 'sentences',
    difficulty: 'hard',
    requirements: { level: 5, accuracy: 85 },
    rewards: { xpBase: 35, sparksBase: 18 },
  },
  {
    id: 7,
    name: 'Sentences',
    description: 'Type complete sentences with grammar',
    ageRange: '10-12',
    allowedKeys: [...'abcdefghijklmnopqrstuvwxyz'.split(''), '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '!', '?', ';', ':', "'", '"', ' '],
    contentType: 'sentences',
    difficulty: 'hard',
    requirements: { level: 6, accuracy: 90 },
    rewards: { xpBase: 40, sparksBase: 20 },
  },
  {
    id: 8,
    name: 'Paragraphs',
    description: 'Type multi-sentence passages',
    ageRange: '11-12',
    allowedKeys: [...'abcdefghijklmnopqrstuvwxyz'.split(''), '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '!', '?', ';', ':', "'", '"', ' '],
    contentType: 'paragraphs',
    difficulty: 'hard',
    requirements: { level: 7, accuracy: 90 },
    rewards: { xpBase: 50, sparksBase: 25 },
  },
];

export function getLevelById(id: number): TypingLevel | undefined {
  return typingLevels.find((level) => level.id === id);
}

export function isLevelUnlocked(levelId: number, progress: Record<number, { completed: boolean; bestAccuracy: number; bestWpm: number }>): boolean {
  const level = getLevelById(levelId);
  if (!level) return false;
  if (!level.requirements) return true;

  const prevProgress = progress[level.requirements.level];
  if (!prevProgress?.completed) return false;

  if (level.requirements.accuracy && prevProgress.bestAccuracy < level.requirements.accuracy) {
    return false;
  }

  if (level.requirements.wpm && prevProgress.bestWpm < level.requirements.wpm) {
    return false;
  }

  return true;
}
