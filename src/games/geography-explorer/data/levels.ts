import type { Level, GameMode, Continent, Question, QuestionOption } from '../types';
import { COUNTRIES, getCountriesByContinent } from './countries';
import { LANDMARKS, getLandmarksByContinent } from './landmarks';

// 24 Levels across different modes, continents, and difficulties
export const LEVELS: Level[] = [
  // FLAG QUIZ - Levels 1-6
  {
    id: 1,
    name: 'Flag Basics',
    mode: 'flag-quiz',
    continent: 'world',
    difficulty: 'explorer',
    description: 'Learn to recognize flags from around the world',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 2,
    name: 'European Flags',
    mode: 'flag-quiz',
    continent: 'europe',
    difficulty: 'explorer',
    description: 'Identify flags from European countries',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Asian Flags',
    mode: 'flag-quiz',
    continent: 'asia',
    difficulty: 'navigator',
    description: 'Discover flags from Asia',
    questionCount: 10,
    timeLimit: 20,
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Americas Flags',
    mode: 'flag-quiz',
    continent: 'north-america',
    difficulty: 'navigator',
    description: 'Flags from North and South America',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 3, minScore: 700 },
  },
  {
    id: 5,
    name: 'Flag Master',
    mode: 'flag-quiz',
    continent: 'world',
    difficulty: 'cartographer',
    description: 'Advanced flag recognition challenge',
    questionCount: 15,
    timeLimit: 15,
    unlockRequirement: { levelId: 4, minScore: 800 },
  },
  {
    id: 6,
    name: 'Flag Legend',
    mode: 'flag-quiz',
    continent: 'world',
    difficulty: 'master',
    description: 'The ultimate flag challenge!',
    questionCount: 20,
    timeLimit: 10,
    unlockRequirement: { levelId: 5, minScore: 1200 },
  },

  // CAPITAL MATCH - Levels 7-12
  {
    id: 7,
    name: 'Capital Cities 101',
    mode: 'capital-match',
    continent: 'world',
    difficulty: 'explorer',
    description: 'Match famous capitals to their countries',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 8,
    name: 'European Capitals',
    mode: 'capital-match',
    continent: 'europe',
    difficulty: 'explorer',
    description: 'Learn the capitals of Europe',
    questionCount: 10,
    timeLimit: 25,
    unlockRequirement: { levelId: 7, minScore: 500 },
  },
  {
    id: 9,
    name: 'Asian Capitals',
    mode: 'capital-match',
    continent: 'asia',
    difficulty: 'navigator',
    description: 'Explore capitals across Asia',
    questionCount: 10,
    timeLimit: 20,
    unlockRequirement: { levelId: 8, minScore: 600 },
  },
  {
    id: 10,
    name: 'African Capitals',
    mode: 'capital-match',
    continent: 'africa',
    difficulty: 'navigator',
    description: 'Discover African capital cities',
    questionCount: 10,
    timeLimit: 20,
    unlockRequirement: { levelId: 9, minScore: 650 },
  },
  {
    id: 11,
    name: 'Capital Expert',
    mode: 'capital-match',
    continent: 'world',
    difficulty: 'cartographer',
    description: 'Advanced capital city challenge',
    questionCount: 15,
    timeLimit: 15,
    unlockRequirement: { levelId: 10, minScore: 750 },
  },
  {
    id: 12,
    name: 'Capital Master',
    mode: 'capital-match',
    continent: 'world',
    difficulty: 'master',
    description: 'The ultimate capital city test!',
    questionCount: 20,
    timeLimit: 10,
    unlockRequirement: { levelId: 11, minScore: 1000 },
  },

  // LANDMARK HUNTER - Levels 13-18
  {
    id: 13,
    name: 'Famous Landmarks',
    mode: 'landmark-hunter',
    continent: 'world',
    difficulty: 'explorer',
    description: 'Identify the world\'s most famous landmarks',
    questionCount: 8,
    timeLimit: 30,
  },
  {
    id: 14,
    name: 'European Wonders',
    mode: 'landmark-hunter',
    continent: 'europe',
    difficulty: 'explorer',
    description: 'Explore iconic European landmarks',
    questionCount: 8,
    timeLimit: 25,
    unlockRequirement: { levelId: 13, minScore: 500 },
  },
  {
    id: 15,
    name: 'Ancient Wonders',
    mode: 'landmark-hunter',
    continent: 'world',
    difficulty: 'navigator',
    description: 'Historical landmarks from across the globe',
    questionCount: 10,
    timeLimit: 20,
    unlockRequirement: { levelId: 14, minScore: 600 },
  },
  {
    id: 16,
    name: 'Natural Wonders',
    mode: 'landmark-hunter',
    continent: 'world',
    difficulty: 'navigator',
    description: 'Discover natural landmarks and formations',
    questionCount: 10,
    timeLimit: 20,
    unlockRequirement: { levelId: 15, minScore: 650 },
  },
  {
    id: 17,
    name: 'Landmark Expert',
    mode: 'landmark-hunter',
    continent: 'world',
    difficulty: 'cartographer',
    description: 'Advanced landmark identification',
    questionCount: 12,
    timeLimit: 15,
    unlockRequirement: { levelId: 16, minScore: 750 },
  },
  {
    id: 18,
    name: 'Wonder Seeker',
    mode: 'landmark-hunter',
    continent: 'world',
    difficulty: 'master',
    description: 'The ultimate landmark challenge!',
    questionCount: 15,
    timeLimit: 12,
    unlockRequirement: { levelId: 17, minScore: 900 },
  },

  // CONTINENT CHALLENGE - Levels 19-24 (Mixed questions)
  {
    id: 19,
    name: 'World Explorer',
    mode: 'continent-challenge',
    continent: 'world',
    difficulty: 'explorer',
    description: 'Mixed geography questions from everywhere',
    questionCount: 10,
    timeLimit: 25,
  },
  {
    id: 20,
    name: 'Europe Tour',
    mode: 'continent-challenge',
    continent: 'europe',
    difficulty: 'navigator',
    description: 'Complete European geography challenge',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 19, minScore: 600 },
  },
  {
    id: 21,
    name: 'Asia Adventure',
    mode: 'continent-challenge',
    continent: 'asia',
    difficulty: 'navigator',
    description: 'Journey through Asian geography',
    questionCount: 12,
    timeLimit: 20,
    unlockRequirement: { levelId: 20, minScore: 700 },
  },
  {
    id: 22,
    name: 'Americas Quest',
    mode: 'continent-challenge',
    continent: 'north-america',
    difficulty: 'cartographer',
    description: 'Explore the Americas',
    questionCount: 15,
    timeLimit: 18,
    unlockRequirement: { levelId: 21, minScore: 800 },
  },
  {
    id: 23,
    name: 'Global Challenge',
    mode: 'continent-challenge',
    continent: 'world',
    difficulty: 'cartographer',
    description: 'Test your worldwide geography knowledge',
    questionCount: 18,
    timeLimit: 15,
    unlockRequirement: { levelId: 22, minScore: 1000 },
  },
  {
    id: 24,
    name: 'Geography Master',
    mode: 'continent-challenge',
    continent: 'world',
    difficulty: 'master',
    description: 'The ultimate geography challenge!',
    questionCount: 25,
    timeLimit: 12,
    unlockRequirement: { levelId: 23, minScore: 1500 },
  },
];

// Helper functions
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getLevelsByMode(mode: GameMode): Level[] {
  return LEVELS.filter(l => l.mode === mode);
}

export function getLevelsByContinent(continent: Continent): Level[] {
  return LEVELS.filter(l => l.continent === continent || l.continent === 'world');
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
  const difficultyConfig = {
    explorer: { optionCount: 3 },
    navigator: { optionCount: 4 },
    cartographer: { optionCount: 4 },
    master: { optionCount: 5 },
  }[level.difficulty];

  // Get countries and landmarks for this level's continent
  const countries = getCountriesByContinent(level.continent);
  const landmarks = getLandmarksByContinent(level.continent);

  // Determine question types based on mode
  for (let i = 0; i < level.questionCount; i++) {
    let question: Question | null = null;

    if (level.mode === 'flag-quiz') {
      question = generateFlagQuestion(countries, difficultyConfig.optionCount, i);
    } else if (level.mode === 'capital-match') {
      question = generateCapitalQuestion(countries, difficultyConfig.optionCount, i);
    } else if (level.mode === 'landmark-hunter') {
      question = generateLandmarkQuestion(landmarks, countries, difficultyConfig.optionCount, i);
    } else if (level.mode === 'continent-challenge') {
      // Mixed questions
      const questionTypes: ('flag' | 'capital' | 'landmark')[] = ['flag', 'capital'];
      if (landmarks.length > 0) questionTypes.push('landmark');

      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      if (type === 'flag') {
        question = generateFlagQuestion(countries, difficultyConfig.optionCount, i);
      } else if (type === 'capital') {
        question = generateCapitalQuestion(countries, difficultyConfig.optionCount, i);
      } else {
        question = generateLandmarkQuestion(landmarks, countries, difficultyConfig.optionCount, i);
      }
    }

    if (question) {
      questions.push(question);
    }
  }

  return shuffleArray(questions);
}

function generateFlagQuestion(
  countries: typeof COUNTRIES,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(countries);
  const correctCountry = shuffled[index % shuffled.length];

  // Get wrong options
  const wrongCountries = shuffled
    .filter(c => c.id !== correctCountry.id)
    .slice(0, optionCount - 1);

  const options: QuestionOption[] = shuffleArray([
    { id: correctCountry.id, text: correctCountry.name, isCorrect: true },
    ...wrongCountries.map(c => ({ id: c.id, text: c.name, isCorrect: false })),
  ]);

  return {
    id: `flag-${correctCountry.id}-${Date.now()}-${index}`,
    type: 'flag-quiz',
    prompt: 'Which country does this flag belong to?',
    correctAnswer: correctCountry.name,
    correctAnswerId: correctCountry.id,
    options,
    imageHint: correctCountry.flagEmoji,
    hint: `This country is in ${correctCountry.continent.replace('-', ' ')}`,
  };
}

function generateCapitalQuestion(
  countries: typeof COUNTRIES,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(countries);
  const correctCountry = shuffled[index % shuffled.length];

  // Get wrong options
  const wrongCountries = shuffled
    .filter(c => c.id !== correctCountry.id)
    .slice(0, optionCount - 1);

  const options: QuestionOption[] = shuffleArray([
    { id: correctCountry.id, text: correctCountry.name, isCorrect: true },
    ...wrongCountries.map(c => ({ id: c.id, text: c.name, isCorrect: false })),
  ]);

  return {
    id: `capital-${correctCountry.id}-${Date.now()}-${index}`,
    type: 'capital-match',
    prompt: `${correctCountry.capital} is the capital of which country?`,
    correctAnswer: correctCountry.name,
    correctAnswerId: correctCountry.id,
    options,
    imageHint: '🏛️',
    hint: `The flag of this country is ${correctCountry.flagEmoji}`,
  };
}

function generateLandmarkQuestion(
  landmarks: typeof LANDMARKS,
  countries: typeof COUNTRIES,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(landmarks);
  const correctLandmark = shuffled[index % shuffled.length];

  // Get wrong options from countries
  const wrongCountries = shuffleArray(countries)
    .filter(c => c.name !== correctLandmark.country)
    .slice(0, optionCount - 1);

  const options: QuestionOption[] = shuffleArray([
    { id: correctLandmark.countryId, text: correctLandmark.country, isCorrect: true },
    ...wrongCountries.map(c => ({ id: c.id, text: c.name, isCorrect: false })),
  ]);

  return {
    id: `landmark-${correctLandmark.id}-${Date.now()}-${index}`,
    type: 'landmark-hunter',
    prompt: `Where is the ${correctLandmark.name} located?`,
    correctAnswer: correctLandmark.country,
    correctAnswerId: correctLandmark.countryId,
    options,
    imageHint: correctLandmark.emoji,
    hint: correctLandmark.description,
  };
}

// Generate choices with one correct answer
export function generateChoices(
  correctAnswer: string,
  allOptions: string[],
  count: number
): string[] {
  const wrong = allOptions
    .filter(opt => opt !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, count - 1);

  return [...wrong, correctAnswer].sort(() => Math.random() - 0.5);
}
