// Word Builder - Level Definitions
import type { Level, WordCategory, LetterTile, WordChallenge } from '../types';
import { getWordsByCategory, getWordsByDifficulty, getRandomWords } from './words';

// Level definitions - 5 levels per category, 35 total
export const LEVELS: Level[] = [
  // Animals - Levels 1-5
  {
    id: 1,
    name: 'Animal Friends',
    category: 'animals',
    difficulty: 'easy',
    description: 'Simple 3-4 letter animal names',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 2,
    name: 'Zoo Crew',
    category: 'animals',
    difficulty: 'medium',
    description: 'Medium animal words',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Wild Safari',
    category: 'animals',
    difficulty: 'hard',
    description: 'Longer animal names',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Animal Kingdom',
    category: 'animals',
    difficulty: 'hard',
    description: 'Challenging animal words',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 3, minScore: 700 },
  },
  {
    id: 5,
    name: 'Beast Master',
    category: 'animals',
    difficulty: 'expert',
    description: 'Expert animal vocabulary',
    wordLength: { min: 6, max: 8 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 4, minScore: 800 },
  },

  // Colors - Levels 6-10
  {
    id: 6,
    name: 'Rainbow Start',
    category: 'colors',
    difficulty: 'easy',
    description: 'Basic color words',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 7,
    name: 'Paint Palette',
    category: 'colors',
    difficulty: 'medium',
    description: 'More color names',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 6, minScore: 500 },
  },
  {
    id: 8,
    name: 'Color Wheel',
    category: 'colors',
    difficulty: 'hard',
    description: 'Advanced colors',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 7, minScore: 600 },
  },
  {
    id: 9,
    name: 'Artist Studio',
    category: 'colors',
    difficulty: 'hard',
    description: 'Artistic color vocabulary',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 8, minScore: 700 },
  },
  {
    id: 10,
    name: 'Chromatic Expert',
    category: 'colors',
    difficulty: 'expert',
    description: 'Master all color words',
    wordLength: { min: 6, max: 9 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 9, minScore: 800 },
  },

  // Food - Levels 11-15
  {
    id: 11,
    name: 'Snack Time',
    category: 'food',
    difficulty: 'easy',
    description: 'Simple food words',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 12,
    name: 'Kitchen Helper',
    category: 'food',
    difficulty: 'medium',
    description: 'More food vocabulary',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 11, minScore: 500 },
  },
  {
    id: 13,
    name: 'Recipe Book',
    category: 'food',
    difficulty: 'hard',
    description: 'Cooking words',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 12, minScore: 600 },
  },
  {
    id: 14,
    name: 'Gourmet Chef',
    category: 'food',
    difficulty: 'hard',
    description: 'Advanced food terms',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 13, minScore: 700 },
  },
  {
    id: 15,
    name: 'Master Chef',
    category: 'food',
    difficulty: 'expert',
    description: 'Expert food vocabulary',
    wordLength: { min: 6, max: 10 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 14, minScore: 800 },
  },

  // Nature - Levels 16-20
  {
    id: 16,
    name: 'Nature Walk',
    category: 'nature',
    difficulty: 'easy',
    description: 'Basic nature words',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 17,
    name: 'Forest Trail',
    category: 'nature',
    difficulty: 'medium',
    description: 'Nature vocabulary',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 16, minScore: 500 },
  },
  {
    id: 18,
    name: 'Mountain Peak',
    category: 'nature',
    difficulty: 'hard',
    description: 'Advanced nature terms',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 17, minScore: 600 },
  },
  {
    id: 19,
    name: 'Earth Explorer',
    category: 'nature',
    difficulty: 'hard',
    description: 'Challenging nature words',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 18, minScore: 700 },
  },
  {
    id: 20,
    name: 'Nature Master',
    category: 'nature',
    difficulty: 'expert',
    description: 'Expert nature vocabulary',
    wordLength: { min: 6, max: 9 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 19, minScore: 800 },
  },

  // Actions - Levels 21-25
  {
    id: 21,
    name: 'Action Start',
    category: 'actions',
    difficulty: 'easy',
    description: 'Simple action words',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 22,
    name: 'Get Moving',
    category: 'actions',
    difficulty: 'medium',
    description: 'More verbs to learn',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 21, minScore: 500 },
  },
  {
    id: 23,
    name: 'Action Hero',
    category: 'actions',
    difficulty: 'hard',
    description: 'Advanced action words',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 22, minScore: 600 },
  },
  {
    id: 24,
    name: 'Verb Power',
    category: 'actions',
    difficulty: 'hard',
    description: 'Challenging verbs',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 23, minScore: 700 },
  },
  {
    id: 25,
    name: 'Action Master',
    category: 'actions',
    difficulty: 'expert',
    description: 'Expert action vocabulary',
    wordLength: { min: 6, max: 9 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 24, minScore: 800 },
  },

  // Objects - Levels 26-30
  {
    id: 26,
    name: 'Thing Finder',
    category: 'objects',
    difficulty: 'easy',
    description: 'Simple object words',
    wordLength: { min: 3, max: 4 },
    wordCount: 8,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 27,
    name: 'Home Things',
    category: 'objects',
    difficulty: 'medium',
    description: 'Everyday objects',
    wordLength: { min: 4, max: 5 },
    wordCount: 10,
    timeLimit: 30,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 26, minScore: 500 },
  },
  {
    id: 28,
    name: 'Object Quest',
    category: 'objects',
    difficulty: 'hard',
    description: 'More objects to find',
    wordLength: { min: 5, max: 6 },
    wordCount: 10,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 27, minScore: 600 },
  },
  {
    id: 29,
    name: 'Treasure Hunt',
    category: 'objects',
    difficulty: 'hard',
    description: 'Challenging objects',
    wordLength: { min: 5, max: 7 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 28, minScore: 700 },
  },
  {
    id: 30,
    name: 'Object Master',
    category: 'objects',
    difficulty: 'expert',
    description: 'Expert object vocabulary',
    wordLength: { min: 6, max: 10 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 29, minScore: 800 },
  },

  // Mixed - Levels 31-35
  {
    id: 31,
    name: 'Mix It Up',
    category: 'mixed',
    difficulty: 'easy',
    description: 'Words from all categories',
    wordLength: { min: 3, max: 4 },
    wordCount: 10,
    timeLimit: 0,
    hintsAllowed: 3,
  },
  {
    id: 32,
    name: 'Word Scramble',
    category: 'mixed',
    difficulty: 'medium',
    description: 'Mixed vocabulary',
    wordLength: { min: 4, max: 5 },
    wordCount: 12,
    timeLimit: 25,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 31, minScore: 600 },
  },
  {
    id: 33,
    name: 'Brain Buster',
    category: 'mixed',
    difficulty: 'hard',
    description: 'Challenging mix',
    wordLength: { min: 5, max: 6 },
    wordCount: 12,
    timeLimit: 20,
    hintsAllowed: 2,
    unlockRequirement: { levelId: 32, minScore: 700 },
  },
  {
    id: 34,
    name: 'Word Wizard',
    category: 'mixed',
    difficulty: 'hard',
    description: 'Advanced word mix',
    wordLength: { min: 5, max: 7 },
    wordCount: 15,
    timeLimit: 18,
    hintsAllowed: 1,
    unlockRequirement: { levelId: 33, minScore: 800 },
  },
  {
    id: 35,
    name: 'Word Champion',
    category: 'mixed',
    difficulty: 'expert',
    description: 'Ultimate word challenge',
    wordLength: { min: 6, max: 10 },
    wordCount: 15,
    timeLimit: 15,
    hintsAllowed: 0,
    unlockRequirement: { levelId: 34, minScore: 1000 },
  },
];

// Get level by ID
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

// Get levels by category
export function getLevelsByCategory(category: WordCategory): Level[] {
  return LEVELS.filter(l => l.category === category);
}

// Get first level ID for each category
export function getFirstLevelOfCategory(category: WordCategory): number {
  const categoryLevels = getLevelsByCategory(category);
  return categoryLevels.length > 0 ? categoryLevels[0].id : 1;
}

// Get next level in category
export function getNextLevelInCategory(currentLevelId: number): Level | null {
  const currentLevel = getLevelById(currentLevelId);
  if (!currentLevel) return null;

  const categoryLevels = getLevelsByCategory(currentLevel.category);
  const currentIndex = categoryLevels.findIndex(l => l.id === currentLevelId);

  if (currentIndex >= 0 && currentIndex < categoryLevels.length - 1) {
    return categoryLevels[currentIndex + 1];
  }

  return null;
}

// Scramble letters in a word
export function scrambleWord(word: string): LetterTile[] {
  const letters = word.split('');

  // Create letter tiles
  const tiles: LetterTile[] = letters.map((letter, index) => ({
    id: `${letter}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    letter,
    position: index,
    isPlaced: false,
    placedIndex: null,
  }));

  // Shuffle positions
  let shuffled = [...tiles];
  let attempts = 0;
  const maxAttempts = 10;

  // Keep shuffling until we get a different order (for words > 2 letters)
  do {
    shuffled = [...tiles].sort(() => Math.random() - 0.5);
    attempts++;
  } while (
    word.length > 2 &&
    attempts < maxAttempts &&
    shuffled.map(t => t.letter).join('') === word
  );

  // Update positions
  shuffled.forEach((tile, index) => {
    tile.position = index;
  });

  return shuffled;
}

// Generate word challenges for a level
export function generateWordChallenges(level: Level): WordChallenge[] {
  // Get appropriate words for the category and difficulty
  const categoryWords = getWordsByCategory(level.category);
  const filteredWords = getWordsByDifficulty(
    categoryWords,
    level.wordLength.min,
    level.wordLength.max
  );

  // Get random selection
  const selectedWords = getRandomWords(filteredWords, level.wordCount);

  // Create challenges
  return selectedWords.map((word, index) => ({
    id: `challenge-${index}-${Date.now()}`,
    word,
    scrambledLetters: scrambleWord(word.word),
    hintUsed: false,
    startTime: 0,
  }));
}

// Get performance message based on accuracy
export function getPerformanceMessage(accuracy: number): string {
  if (accuracy >= 100) return 'PERFECT!';
  if (accuracy >= 95) return 'Outstanding!';
  if (accuracy >= 90) return 'Excellent!';
  if (accuracy >= 80) return 'Great Job!';
  if (accuracy >= 70) return 'Well Done!';
  if (accuracy >= 60) return 'Good Effort!';
  if (accuracy >= 50) return 'Keep Trying!';
  return 'Practice Makes Perfect!';
}

// Category colors for styling
export const CATEGORY_COLORS: Record<WordCategory, {
  primary: string;
  secondary: string;
  glow: string;
}> = {
  animals: {
    primary: 'neon-orange',
    secondary: 'neon-yellow',
    glow: 'rgba(255,107,53,0.5)',
  },
  colors: {
    primary: 'neon-pink',
    secondary: 'neon-purple',
    glow: 'rgba(255,0,255,0.5)',
  },
  food: {
    primary: 'neon-red',
    secondary: 'neon-orange',
    glow: 'rgba(255,51,102,0.5)',
  },
  nature: {
    primary: 'neon-green',
    secondary: 'neon-cyan',
    glow: 'rgba(0,255,136,0.5)',
  },
  actions: {
    primary: 'neon-cyan',
    secondary: 'neon-green',
    glow: 'rgba(0,245,255,0.5)',
  },
  objects: {
    primary: 'neon-purple',
    secondary: 'neon-pink',
    glow: 'rgba(139,92,246,0.5)',
  },
  mixed: {
    primary: 'neon-yellow',
    secondary: 'neon-cyan',
    glow: 'rgba(255,229,92,0.5)',
  },
};
