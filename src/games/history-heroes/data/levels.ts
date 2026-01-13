import type { Level, HistoricalEra, Question, QuestionOption, Difficulty } from '../types';
import { QUESTIONS, type QuestionData } from './questions';

// 24 Levels across different eras and difficulties
export const LEVELS: Level[] = [
  // ANCIENT CIVILIZATIONS - Levels 1-6
  {
    id: 1,
    name: 'Ancient Beginnings',
    era: 'ancient',
    difficulty: 'apprentice',
    description: 'Start your journey through ancient history!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 2,
    name: 'Pyramids & Pharaohs',
    era: 'ancient',
    difficulty: 'apprentice',
    description: 'Explore the wonders of ancient Egypt',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Greek Glory',
    era: 'ancient',
    difficulty: 'scholar',
    description: 'Discover the birthplace of democracy',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Roman Empire',
    era: 'ancient',
    difficulty: 'scholar',
    description: 'March through the streets of Rome',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 3, minScore: 700 },
  },
  {
    id: 5,
    name: 'Ancient Historian',
    era: 'ancient',
    difficulty: 'historian',
    description: 'Advanced ancient world challenges',
    questionCount: 15,
    timeLimit: 20,
    unlockRequirement: { levelId: 4, minScore: 800 },
  },
  {
    id: 6,
    name: 'Ancient Master',
    era: 'ancient',
    difficulty: 'master',
    description: 'The ultimate ancient civilizations challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 5, minScore: 1200 },
  },

  // MEDIEVAL TIMES - Levels 7-12
  {
    id: 7,
    name: 'Medieval Intro',
    era: 'medieval',
    difficulty: 'apprentice',
    description: 'Enter the age of knights and castles!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 8,
    name: 'Knights & Castles',
    era: 'medieval',
    difficulty: 'apprentice',
    description: 'Learn about chivalry and fortresses',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 7, minScore: 500 },
  },
  {
    id: 9,
    name: 'Viking Voyages',
    era: 'medieval',
    difficulty: 'scholar',
    description: 'Sail with the fierce Norse warriors',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 8, minScore: 600 },
  },
  {
    id: 10,
    name: 'Crusader Chronicles',
    era: 'medieval',
    difficulty: 'scholar',
    description: 'Journey to the Holy Land',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 9, minScore: 650 },
  },
  {
    id: 11,
    name: 'Medieval Historian',
    era: 'medieval',
    difficulty: 'historian',
    description: 'Advanced medieval knowledge test',
    questionCount: 15,
    timeLimit: 20,
    unlockRequirement: { levelId: 10, minScore: 750 },
  },
  {
    id: 12,
    name: 'Medieval Master',
    era: 'medieval',
    difficulty: 'master',
    description: 'The ultimate medieval challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 11, minScore: 1000 },
  },

  // RENAISSANCE & EXPLORATION - Levels 13-18
  {
    id: 13,
    name: 'Renaissance Dawn',
    era: 'renaissance',
    difficulty: 'apprentice',
    description: 'Witness the rebirth of art and science!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 14,
    name: 'Masters of Art',
    era: 'renaissance',
    difficulty: 'apprentice',
    description: 'Meet Leonardo, Michelangelo, and more',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 13, minScore: 500 },
  },
  {
    id: 15,
    name: 'Age of Exploration',
    era: 'renaissance',
    difficulty: 'scholar',
    description: 'Sail the seas with brave explorers',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 14, minScore: 600 },
  },
  {
    id: 16,
    name: 'Scientific Revolution',
    era: 'renaissance',
    difficulty: 'scholar',
    description: 'Discover how we learned to question everything',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 15, minScore: 650 },
  },
  {
    id: 17,
    name: 'Renaissance Historian',
    era: 'renaissance',
    difficulty: 'historian',
    description: 'Advanced Renaissance challenges',
    questionCount: 15,
    timeLimit: 18,
    unlockRequirement: { levelId: 16, minScore: 750 },
  },
  {
    id: 18,
    name: 'Renaissance Master',
    era: 'renaissance',
    difficulty: 'master',
    description: 'The ultimate Renaissance challenge!',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 17, minScore: 900 },
  },

  // MODERN HISTORY - Levels 19-24
  {
    id: 19,
    name: 'Modern Beginnings',
    era: 'modern',
    difficulty: 'apprentice',
    description: 'Explore the world that shaped today!',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 20,
    name: 'Age of Revolution',
    era: 'modern',
    difficulty: 'apprentice',
    description: 'Learn about the American & French Revolutions',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 19, minScore: 500 },
  },
  {
    id: 21,
    name: 'Industrial Age',
    era: 'modern',
    difficulty: 'scholar',
    description: 'Witness the power of steam and steel',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 20, minScore: 600 },
  },
  {
    id: 22,
    name: 'World at War',
    era: 'modern',
    difficulty: 'scholar',
    description: 'Learn about the conflicts that changed everything',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 21, minScore: 700 },
  },
  {
    id: 23,
    name: 'Modern Historian',
    era: 'modern',
    difficulty: 'historian',
    description: 'Advanced modern history knowledge',
    questionCount: 15,
    timeLimit: 18,
    unlockRequirement: { levelId: 22, minScore: 800 },
  },
  {
    id: 24,
    name: 'Modern Master',
    era: 'modern',
    difficulty: 'master',
    description: 'The ultimate modern history challenge!',
    questionCount: 20,
    timeLimit: 15,
    unlockRequirement: { levelId: 23, minScore: 1200 },
  },
];

// Helper functions
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getLevelsByEra(era: HistoricalEra): Level[] {
  return LEVELS.filter(l => l.era === era);
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
  const eraQuestions = QUESTIONS[level.era];

  // Get questions matching difficulty or easier
  const difficultyOrder: Difficulty[] = ['apprentice', 'scholar', 'historian', 'master'];
  const maxDifficultyIndex = difficultyOrder.indexOf(level.difficulty);

  const availableQuestions = eraQuestions.filter(q => {
    const qDiffIndex = difficultyOrder.indexOf(q.difficulty);
    return qDiffIndex <= maxDifficultyIndex;
  });

  const shuffledQuestions = shuffleArray(availableQuestions);

  // Determine option count based on difficulty
  const optionCount = {
    apprentice: 3,
    scholar: 4,
    historian: 4,
    master: 5,
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

  if (qData.type === 'timeline' || qData.wrongAnswers.length <= 1) {
    // For simple true/false or timeline questions
    if (qData.wrongAnswers.length === 1 && (qData.correctAnswer === 'True' || qData.correctAnswer === 'False')) {
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
    era: getQuestionEra(qData.topic),
    topic: qData.topic,
    prompt: qData.prompt,
    correctAnswer: qData.correctAnswer,
    correctAnswerId: options.find(o => o.isCorrect)?.id || 'correct',
    options,
    hint: getHintForQuestion(qData),
    explanation: qData.explanation,
    imageHint: qData.imageHint,
    difficulty: qData.difficulty,
    year: qData.year,
  };
}

function getQuestionEra(topic: string): HistoricalEra {
  const ancientTopics = ['egypt', 'greece', 'rome', 'mesopotamia', 'china', 'india'];
  const medievalTopics = ['knights', 'castles', 'vikings', 'crusades', 'feudalism', 'byzantium'];
  const renaissanceTopics = ['art', 'science', 'exploration', 'inventions', 'reformation', 'trade'];
  const modernTopics = ['revolution', 'industry', 'world-wars', 'civil-rights', 'space-age', 'technology'];

  if (ancientTopics.includes(topic)) return 'ancient';
  if (medievalTopics.includes(topic)) return 'medieval';
  if (renaissanceTopics.includes(topic)) return 'renaissance';
  if (modernTopics.includes(topic)) return 'modern';
  return 'ancient';
}

function getHintForQuestion(qData: QuestionData): string {
  // Generate a helpful hint based on the topic
  const hints: Record<string, string> = {
    // Ancient
    egypt: 'Think about the land of pyramids and the Nile!',
    greece: 'Consider the birthplace of democracy and philosophy.',
    rome: 'Remember the mighty empire with gladiators and aqueducts.',
    mesopotamia: 'Think about the land between two rivers.',
    china: 'Consider the empire with the Great Wall.',
    india: 'Think about ancient civilizations along the Ganges.',

    // Medieval
    knights: 'Think about warriors in shining armor!',
    castles: 'Consider mighty fortresses with towers and moats.',
    vikings: 'Remember the fierce warriors from the north.',
    crusades: 'Think about the wars for the Holy Land.',
    feudalism: 'Consider the system of lords and peasants.',
    byzantium: 'Remember the Eastern Roman Empire.',

    // Renaissance
    art: 'Think about the great painters and sculptors!',
    science: 'Consider the new ways of understanding the world.',
    exploration: 'Remember the brave sailors who found new lands.',
    inventions: 'Think about the tools that changed everything.',
    reformation: 'Consider the religious changes in Europe.',
    trade: 'Remember the merchants and spice routes.',

    // Modern
    revolution: 'Think about people fighting for freedom!',
    industry: 'Consider factories, steam, and steel.',
    'world-wars': 'Remember the conflicts that changed the world.',
    'civil-rights': 'Think about the fight for equality.',
    'space-age': 'Consider rockets, satellites, and the Moon.',
    technology: 'Remember the inventions that shape our lives today.',
  };

  return hints[qData.topic] || 'Think carefully about what you\'ve learned in history!';
}
