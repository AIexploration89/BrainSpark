import type { Game } from '../types';

// Single source of truth for all game definitions
// Organized by implementation status

export const implementedGames: Game[] = [
  {
    id: 'typing-master',
    name: 'Typing Master',
    description: 'Master the keyboard from home row to full paragraphs. Track your WPM and accuracy!',
    icon: '\u2328\uFE0F',
    color: 'cyan',
    category: 'skills',
    ageRange: '5-12',
    difficulty: 'easy',
    isNew: true,
  },
  {
    id: 'math-basics',
    name: 'Math Basics',
    description: 'From counting to division with combos, streaks, and 24 levels of challenge.',
    icon: '\u2795',
    color: 'green',
    category: 'academic',
    ageRange: '3-12',
    difficulty: 'easy',
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Build vocabulary and spelling skills with engaging word puzzles and letter tiles.',
    icon: '\uD83D\uDCDD',
    color: 'orange',
    category: 'academic',
    ageRange: '4-12',
    difficulty: 'easy',
    isNew: true,
  },
  {
    id: 'code-quest',
    name: 'Code Quest',
    description: 'Learn programming logic through 30 levels of visual block coding adventures.',
    icon: '\uD83D\uDCBB',
    color: 'cyan',
    category: 'academic',
    ageRange: '7-12',
    difficulty: 'hard',
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Challenge your memory with 15 levels of pattern recognition on growing grids.',
    icon: '\uD83E\uDDE0',
    color: 'pink',
    category: 'cognitive',
    ageRange: '3-12',
    difficulty: 'medium',
  },
  {
    id: 'physics-lab',
    name: 'Physics Lab',
    description: 'Explore gravity, bouncing, pendulums, ramps, and forces in 5 interactive experiments.',
    icon: '\uD83D\uDD2C',
    color: 'purple',
    category: 'academic',
    ageRange: '6-12',
    difficulty: 'medium',
    isHot: true,
  },
  {
    id: 'space-exploration',
    name: 'Space Explorer',
    description: 'Journey through our solar system, discover planet facts, and test your space knowledge!',
    icon: '\uD83D\uDE80',
    color: 'purple',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'geography-explorer',
    name: 'Geography Explorer',
    description: 'Discover countries, capitals, flags, and landmarks across 4 game modes and 24 levels!',
    icon: '\uD83C\uDF0D',
    color: 'cyan',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'science-explorer',
    name: 'Science Explorer',
    description: 'Discover Biology, Chemistry, Physics, and Earth Science through fun quizzes!',
    icon: '\uD83E\uDDEA',
    color: 'green',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
  {
    id: 'history-heroes',
    name: 'History Heroes',
    description: 'Travel through Ancient, Medieval, Modern, and Contemporary history eras!',
    icon: '\uD83C\uDFDB\uFE0F',
    color: 'yellow',
    category: 'academic',
    ageRange: '6-12',
    difficulty: 'medium',
    isNew: true,
  },
  {
    id: 'animal-kingdom',
    name: 'Animal Kingdom',
    description: 'Discover mammals, birds, ocean life, and reptiles with fascinating wildlife facts!',
    icon: '\uD83E\uDD81',
    color: 'green',
    category: 'academic',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
  {
    id: 'puzzle-world',
    name: 'Puzzle World',
    description: 'Challenge your brain with sliding puzzles, pattern matching, sequences, and jigsaws!',
    icon: '\uD83E\uDDE9',
    color: 'cyan',
    category: 'cognitive',
    ageRange: '5-12',
    difficulty: 'medium',
    isNew: true,
    isHot: true,
  },
];

// Games that have entries in the UI but are not yet implemented
export const comingSoonGames: Game[] = [
  {
    id: 'mouse-expert',
    name: 'Mouse Expert',
    description: 'Perfect your mouse control with precision clicking and smooth tracking.',
    icon: '\uD83D\uDDB1\uFE0F',
    color: 'pink',
    category: 'skills',
    ageRange: '3-10',
    difficulty: 'easy',
  },
  {
    id: 'rhythm-reflex',
    name: 'Rhythm & Reflex',
    description: 'Train timing and coordination with beat-matching challenges.',
    icon: '\uD83C\uDFB5',
    color: 'yellow',
    category: 'cognitive',
    ageRange: '5-12',
    difficulty: 'medium',
    isHot: true,
  },
];

// All games (implemented + coming soon) for display in full listings
export const allGames: Game[] = [...implementedGames, ...comingSoonGames];

// Set of implemented game IDs for quick lookup
export const implementedGameIds = new Set(implementedGames.map(g => g.id));

// Future planned games for the "Coming Soon" section
export const futurePlannedGames = [
  { name: 'Art Studio', icon: '\uD83C\uDFA8', desc: 'Express your creativity with digital art tools' },
  { name: 'Music Maker', icon: '\uD83C\uDFB5', desc: 'Create melodies and learn musical concepts' },
  { name: 'Language Lab', icon: '\uD83D\uDDE3\uFE0F', desc: 'Learn new languages with interactive lessons' },
  { name: 'Story Builder', icon: '\uD83D\uDCD6', desc: 'Create and share interactive stories' },
];
