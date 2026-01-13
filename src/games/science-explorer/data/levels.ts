import type { Level, ScienceCategory, Question, QuestionOption, Difficulty } from '../types';
import { QUESTIONS, type QuestionData } from './questions';

// 24 Levels across different categories and difficulties
export const LEVELS: Level[] = [
  // BIOLOGY - Levels 1-6
  {
    id: 1,
    name: 'Biology Basics',
    category: 'biology',
    difficulty: 'beginner',
    description: 'Start your journey into the world of living things!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 2,
    name: 'Amazing Animals',
    category: 'biology',
    difficulty: 'beginner',
    description: 'Discover incredible facts about animals',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Body Explorer',
    category: 'biology',
    difficulty: 'explorer',
    description: 'Learn how your amazing body works',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Cell Scientists',
    category: 'biology',
    difficulty: 'explorer',
    description: 'Explore the tiny world of cells',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 3, minScore: 700 },
  },
  {
    id: 5,
    name: 'Life Scientist',
    category: 'biology',
    difficulty: 'scientist',
    description: 'Advanced biology challenges await',
    questionCount: 15,
    timeLimit: 20,
    unlockRequirement: { levelId: 4, minScore: 800 },
  },
  {
    id: 6,
    name: 'Biology Genius',
    category: 'biology',
    difficulty: 'genius',
    description: 'The ultimate biology challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 5, minScore: 1200 },
  },

  // CHEMISTRY - Levels 7-12
  {
    id: 7,
    name: 'Chemistry Intro',
    category: 'chemistry',
    difficulty: 'beginner',
    description: 'Begin your chemical adventure!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 8,
    name: 'Matter Matters',
    category: 'chemistry',
    difficulty: 'beginner',
    description: 'Explore solids, liquids, and gases',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 7, minScore: 500 },
  },
  {
    id: 9,
    name: 'Atom Explorer',
    category: 'chemistry',
    difficulty: 'explorer',
    description: 'Dive into the world of atoms',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 8, minScore: 600 },
  },
  {
    id: 10,
    name: 'Element Master',
    category: 'chemistry',
    difficulty: 'explorer',
    description: 'Learn about elements and the periodic table',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 9, minScore: 650 },
  },
  {
    id: 11,
    name: 'Lab Scientist',
    category: 'chemistry',
    difficulty: 'scientist',
    description: 'Advanced chemical knowledge test',
    questionCount: 15,
    timeLimit: 20,
    unlockRequirement: { levelId: 10, minScore: 750 },
  },
  {
    id: 12,
    name: 'Chemistry Genius',
    category: 'chemistry',
    difficulty: 'genius',
    description: 'The ultimate chemistry challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 11, minScore: 1000 },
  },

  // PHYSICS - Levels 13-18
  {
    id: 13,
    name: 'Physics Fundamentals',
    category: 'physics',
    difficulty: 'beginner',
    description: 'Discover the forces that shape our world!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 14,
    name: 'Force & Motion',
    category: 'physics',
    difficulty: 'beginner',
    description: 'Learn about pushes, pulls, and movement',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 13, minScore: 500 },
  },
  {
    id: 15,
    name: 'Energy Explorer',
    category: 'physics',
    difficulty: 'explorer',
    description: 'Explore different forms of energy',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 14, minScore: 600 },
  },
  {
    id: 16,
    name: 'Light & Sound',
    category: 'physics',
    difficulty: 'explorer',
    description: 'Discover waves, light, and sound',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 15, minScore: 650 },
  },
  {
    id: 17,
    name: 'Physics Master',
    category: 'physics',
    difficulty: 'scientist',
    description: 'Advanced physics challenges',
    questionCount: 15,
    timeLimit: 18,
    unlockRequirement: { levelId: 16, minScore: 750 },
  },
  {
    id: 18,
    name: 'Physics Genius',
    category: 'physics',
    difficulty: 'genius',
    description: 'The ultimate physics challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 17, minScore: 900 },
  },

  // EARTH SCIENCE - Levels 19-24
  {
    id: 19,
    name: 'Earth Explorer',
    category: 'earth-science',
    difficulty: 'beginner',
    description: 'Begin exploring our amazing planet!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 20,
    name: 'Weather Watcher',
    category: 'earth-science',
    difficulty: 'beginner',
    description: 'Learn about weather and climate',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 19, minScore: 500 },
  },
  {
    id: 21,
    name: 'Ocean Explorer',
    category: 'earth-science',
    difficulty: 'explorer',
    description: 'Dive into the world\'s oceans',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 20, minScore: 600 },
  },
  {
    id: 22,
    name: 'Space Voyager',
    category: 'earth-science',
    difficulty: 'explorer',
    description: 'Journey through our solar system',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 21, minScore: 700 },
  },
  {
    id: 23,
    name: 'Earth Scientist',
    category: 'earth-science',
    difficulty: 'scientist',
    description: 'Advanced Earth science knowledge',
    questionCount: 15,
    timeLimit: 18,
    unlockRequirement: { levelId: 22, minScore: 800 },
  },
  {
    id: 24,
    name: 'Earth Master',
    category: 'earth-science',
    difficulty: 'genius',
    description: 'The ultimate Earth science challenge!',
    questionCount: 20,
    timeLimit: 15,
    unlockRequirement: { levelId: 23, minScore: 1200 },
  },
];

// Helper functions
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getLevelsByCategory(category: ScienceCategory): Level[] {
  return LEVELS.filter(l => l.category === category);
}

export function getNextLevel(currentId: number): Level | undefined {
  const currentIndex = LEVELS.findIndex(l => l.id === currentId);
  if (currentIndex === -1 || currentIndex >= LEVELS.length - 1) return undefined;
  return LEVELS[currentIndex + 1];
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate questions for a level
export function generateQuestions(level: Level): Question[] {
  const questions: Question[] = [];
  const categoryQuestions = QUESTIONS[level.category];

  // Get questions matching difficulty or easier
  const difficultyOrder: Difficulty[] = ['beginner', 'explorer', 'scientist', 'genius'];
  const maxDifficultyIndex = difficultyOrder.indexOf(level.difficulty);

  const availableQuestions = categoryQuestions.filter(q => {
    const qDiffIndex = difficultyOrder.indexOf(q.difficulty);
    return qDiffIndex <= maxDifficultyIndex;
  });

  const shuffledQuestions = shuffleArray(availableQuestions);

  // Determine option count based on difficulty
  const optionCount = {
    beginner: 3,
    explorer: 4,
    scientist: 4,
    genius: 5,
  }[level.difficulty];

  for (let i = 0; i < level.questionCount && i < shuffledQuestions.length; i++) {
    const qData = shuffledQuestions[i];
    const question = createQuestionFromData(qData, optionCount, i);
    questions.push(question);
  }

  // If we need more questions, repeat with different variations
  while (questions.length < level.questionCount && shuffledQuestions.length > 0) {
    const idx = questions.length % shuffledQuestions.length;
    const qData = shuffledQuestions[idx];
    const question = createQuestionFromData(qData, optionCount, questions.length);
    questions.push(question);
  }

  return shuffleArray(questions);
}

function createQuestionFromData(
  qData: QuestionData,
  optionCount: number,
  index: number
): Question {
  // Build options
  let options: QuestionOption[];

  if (qData.type === 'true-false') {
    options = [
      { id: 'true', text: 'True', isCorrect: qData.correctAnswer === 'True' },
      { id: 'false', text: 'False', isCorrect: qData.correctAnswer === 'False' },
    ];
  } else {
    const wrongOptions = shuffleArray(qData.wrongAnswers).slice(0, optionCount - 1);
    options = shuffleArray([
      { id: 'correct', text: qData.correctAnswer, isCorrect: true },
      ...wrongOptions.map((text, i) => ({
        id: `wrong-${i}`,
        text,
        isCorrect: false,
      })),
    ]);
  }

  return {
    id: `${qData.topic}-${Date.now()}-${index}`,
    type: qData.type,
    category: getQuestionCategory(qData.topic),
    topic: qData.topic,
    prompt: qData.prompt,
    correctAnswer: qData.correctAnswer,
    correctAnswerId: options.find(o => o.isCorrect)?.id || 'correct',
    options,
    hint: getHintForQuestion(qData),
    explanation: qData.explanation,
    imageHint: qData.imageHint,
    difficulty: qData.difficulty,
  };
}

function getQuestionCategory(topic: string): ScienceCategory {
  const biologyTopics = ['cells', 'animals', 'plants', 'human-body', 'ecosystems', 'genetics'];
  const chemistryTopics = ['atoms', 'elements', 'molecules', 'reactions', 'states-of-matter', 'acids-bases'];
  const physicsTopics = ['forces', 'energy', 'electricity', 'magnetism', 'light', 'sound'];
  const earthTopics = ['rocks', 'weather', 'oceans', 'volcanoes', 'solar-system', 'climate'];

  if (biologyTopics.includes(topic)) return 'biology';
  if (chemistryTopics.includes(topic)) return 'chemistry';
  if (physicsTopics.includes(topic)) return 'physics';
  if (earthTopics.includes(topic)) return 'earth-science';
  return 'biology';
}

function getHintForQuestion(qData: QuestionData): string {
  // Generate a helpful hint based on the topic
  const hints: Record<string, string> = {
    cells: 'Think about the tiny building blocks of life!',
    animals: 'Consider different types of creatures and their features.',
    plants: 'Remember how plants grow and make their food.',
    'human-body': 'Think about how your own body works!',
    ecosystems: 'Consider how living things interact with each other.',
    genetics: 'Think about DNA and inherited traits.',
    atoms: 'Consider the smallest particles that make up matter.',
    elements: 'Think about the periodic table!',
    molecules: 'Remember how atoms combine together.',
    reactions: 'Think about what happens when substances mix.',
    'states-of-matter': 'Consider solid, liquid, and gas forms.',
    'acids-bases': 'Think about the pH scale!',
    forces: 'Consider pushes, pulls, and movement.',
    energy: 'Think about different ways energy can exist.',
    electricity: 'Consider how electric current flows.',
    magnetism: 'Think about north and south poles!',
    light: 'Consider how light travels and behaves.',
    sound: 'Think about vibrations and waves.',
    rocks: 'Consider how different rocks form.',
    weather: 'Think about clouds, rain, and temperature.',
    oceans: 'Consider the vast bodies of water on Earth.',
    volcanoes: 'Think about what happens inside Earth.',
    'solar-system': 'Consider our sun and the planets around it.',
    climate: 'Think about long-term weather patterns.',
  };

  return hints[qData.topic] || 'Think carefully about what you\'ve learned!';
}
