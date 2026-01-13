import type { Level, AnimalCategory, Question, QuestionOption } from '../types';
import { ANIMALS, getAnimalsByCategory } from './animals';
import { HABITATS } from '../types';

// 24 Levels across different categories and difficulties
export const LEVELS: Level[] = [
  // MAMMALS - Levels 1-6
  {
    id: 1,
    name: 'Baby Steps',
    category: 'mammals',
    difficulty: 'cub',
    description: 'Meet some amazing mammals!',
    questionCount: 8,
    timeLimit: 30,
    questionTypes: ['identify'],
  },
  {
    id: 2,
    name: 'Mammal Homes',
    category: 'mammals',
    difficulty: 'cub',
    description: 'Learn where mammals live',
    questionCount: 10,
    timeLimit: 25,
    questionTypes: ['habitat', 'identify'],
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Wild Facts',
    category: 'mammals',
    difficulty: 'tracker',
    description: 'Discover amazing mammal facts',
    questionCount: 10,
    timeLimit: 20,
    questionTypes: ['fact-check', 'identify'],
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Classification',
    category: 'mammals',
    difficulty: 'tracker',
    description: 'Classify mammals by their traits',
    questionCount: 12,
    timeLimit: 20,
    questionTypes: ['classification', 'identify'],
    unlockRequirement: { levelId: 3, minScore: 700 },
  },
  {
    id: 5,
    name: 'Mammal Expert',
    category: 'mammals',
    difficulty: 'ranger',
    description: 'Advanced mammal challenges',
    questionCount: 15,
    timeLimit: 15,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 4, minScore: 800 },
  },
  {
    id: 6,
    name: 'Mammal Master',
    category: 'mammals',
    difficulty: 'expert',
    description: 'The ultimate mammal challenge!',
    questionCount: 20,
    timeLimit: 10,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 5, minScore: 1200 },
  },

  // BIRDS - Levels 7-12
  {
    id: 7,
    name: 'Feathered Friends',
    category: 'birds',
    difficulty: 'cub',
    description: 'Meet colorful birds',
    questionCount: 8,
    timeLimit: 30,
    questionTypes: ['identify'],
  },
  {
    id: 8,
    name: 'Bird Nests',
    category: 'birds',
    difficulty: 'cub',
    description: 'Learn where birds call home',
    questionCount: 10,
    timeLimit: 25,
    questionTypes: ['habitat', 'identify'],
    unlockRequirement: { levelId: 7, minScore: 500 },
  },
  {
    id: 9,
    name: 'Flight School',
    category: 'birds',
    difficulty: 'tracker',
    description: 'Amazing bird facts',
    questionCount: 10,
    timeLimit: 20,
    questionTypes: ['fact-check', 'identify'],
    unlockRequirement: { levelId: 8, minScore: 600 },
  },
  {
    id: 10,
    name: 'Beak & Feather',
    category: 'birds',
    difficulty: 'tracker',
    description: 'Classify birds by features',
    questionCount: 12,
    timeLimit: 20,
    questionTypes: ['classification', 'identify'],
    unlockRequirement: { levelId: 9, minScore: 650 },
  },
  {
    id: 11,
    name: 'Bird Watcher',
    category: 'birds',
    difficulty: 'ranger',
    description: 'Advanced bird challenges',
    questionCount: 15,
    timeLimit: 15,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 10, minScore: 750 },
  },
  {
    id: 12,
    name: 'Ornithologist',
    category: 'birds',
    difficulty: 'expert',
    description: 'The ultimate bird challenge!',
    questionCount: 20,
    timeLimit: 10,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 11, minScore: 1000 },
  },

  // OCEAN LIFE - Levels 13-18
  {
    id: 13,
    name: 'Ocean Explorers',
    category: 'ocean-life',
    difficulty: 'cub',
    description: 'Dive into ocean life!',
    questionCount: 8,
    timeLimit: 30,
    questionTypes: ['identify'],
  },
  {
    id: 14,
    name: 'Deep Blue',
    category: 'ocean-life',
    difficulty: 'cub',
    description: 'Ocean habitats and zones',
    questionCount: 8,
    timeLimit: 25,
    questionTypes: ['habitat', 'identify'],
    unlockRequirement: { levelId: 13, minScore: 500 },
  },
  {
    id: 15,
    name: 'Sea Secrets',
    category: 'ocean-life',
    difficulty: 'tracker',
    description: 'Fascinating ocean facts',
    questionCount: 10,
    timeLimit: 20,
    questionTypes: ['fact-check', 'identify'],
    unlockRequirement: { levelId: 14, minScore: 600 },
  },
  {
    id: 16,
    name: 'Scales & Fins',
    category: 'ocean-life',
    difficulty: 'tracker',
    description: 'Classify ocean creatures',
    questionCount: 10,
    timeLimit: 20,
    questionTypes: ['classification', 'identify'],
    unlockRequirement: { levelId: 15, minScore: 650 },
  },
  {
    id: 17,
    name: 'Marine Biologist',
    category: 'ocean-life',
    difficulty: 'ranger',
    description: 'Advanced ocean challenges',
    questionCount: 12,
    timeLimit: 15,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 16, minScore: 750 },
  },
  {
    id: 18,
    name: 'Ocean Master',
    category: 'ocean-life',
    difficulty: 'expert',
    description: 'The ultimate ocean challenge!',
    questionCount: 15,
    timeLimit: 12,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 17, minScore: 900 },
  },

  // REPTILES & AMPHIBIANS - Levels 19-24
  {
    id: 19,
    name: 'Cold-Blooded',
    category: 'reptiles-amphibians',
    difficulty: 'cub',
    description: 'Meet scaly friends!',
    questionCount: 10,
    timeLimit: 25,
    questionTypes: ['identify'],
  },
  {
    id: 20,
    name: 'Swamp & Sun',
    category: 'reptiles-amphibians',
    difficulty: 'tracker',
    description: 'Reptile and amphibian habitats',
    questionCount: 12,
    timeLimit: 20,
    questionTypes: ['habitat', 'identify'],
    unlockRequirement: { levelId: 19, minScore: 600 },
  },
  {
    id: 21,
    name: 'Scales & Slime',
    category: 'reptiles-amphibians',
    difficulty: 'tracker',
    description: 'Amazing facts about these creatures',
    questionCount: 12,
    timeLimit: 20,
    questionTypes: ['fact-check', 'identify'],
    unlockRequirement: { levelId: 20, minScore: 700 },
  },
  {
    id: 22,
    name: 'Venom & Virtue',
    category: 'reptiles-amphibians',
    difficulty: 'ranger',
    description: 'Classify these fascinating animals',
    questionCount: 15,
    timeLimit: 18,
    questionTypes: ['classification', 'identify'],
    unlockRequirement: { levelId: 21, minScore: 800 },
  },
  {
    id: 23,
    name: 'Herpetologist',
    category: 'reptiles-amphibians',
    difficulty: 'ranger',
    description: 'Advanced reptile challenges',
    questionCount: 18,
    timeLimit: 15,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 22, minScore: 1000 },
  },
  {
    id: 24,
    name: 'Reptile Ruler',
    category: 'reptiles-amphibians',
    difficulty: 'expert',
    description: 'The ultimate reptile challenge!',
    questionCount: 25,
    timeLimit: 12,
    questionTypes: ['identify', 'habitat', 'fact-check', 'classification'],
    unlockRequirement: { levelId: 23, minScore: 1500 },
  },
];

// Helper functions
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getLevelsByCategory(category: AnimalCategory): Level[] {
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
  const difficultyConfig = {
    cub: { optionCount: 3 },
    tracker: { optionCount: 4 },
    ranger: { optionCount: 4 },
    expert: { optionCount: 5 },
  }[level.difficulty];

  // Get animals for this category
  const categoryAnimals = getAnimalsByCategory(level.category);

  for (let i = 0; i < level.questionCount; i++) {
    // Pick a random question type from the level's allowed types
    const questionType = level.questionTypes[Math.floor(Math.random() * level.questionTypes.length)];

    let question: Question | null = null;

    switch (questionType) {
      case 'identify':
        question = generateIdentifyQuestion(categoryAnimals, difficultyConfig.optionCount, i);
        break;
      case 'habitat':
        question = generateHabitatQuestion(categoryAnimals, difficultyConfig.optionCount, i);
        break;
      case 'fact-check':
        question = generateFactCheckQuestion(categoryAnimals, i);
        break;
      case 'classification':
        question = generateClassificationQuestion(categoryAnimals, difficultyConfig.optionCount, i);
        break;
    }

    if (question) {
      questions.push(question);
    }
  }

  return shuffleArray(questions);
}

// Generate an identification question
function generateIdentifyQuestion(
  animals: typeof ANIMALS,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(animals);
  const correctAnimal = shuffled[index % shuffled.length];

  // Get wrong options
  const wrongAnimals = shuffled
    .filter(a => a.id !== correctAnimal.id)
    .slice(0, optionCount - 1);

  const options: QuestionOption[] = shuffleArray([
    { id: correctAnimal.id, text: correctAnimal.name, isCorrect: true },
    ...wrongAnimals.map(a => ({ id: a.id, text: a.name, isCorrect: false })),
  ]);

  return {
    id: `identify-${correctAnimal.id}-${Date.now()}-${index}`,
    type: 'identify',
    prompt: `Which animal is this?`,
    correctAnswer: correctAnimal.name,
    correctAnswerId: correctAnimal.id,
    options,
    imageHint: correctAnimal.emoji,
    hint: correctAnimal.description,
    explanation: `This is a ${correctAnimal.name}! ${correctAnimal.funFacts[0]}`,
  };
}

// Generate a habitat question
function generateHabitatQuestion(
  animals: typeof ANIMALS,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(animals);
  const correctAnimal = shuffled[index % shuffled.length];
  const correctHabitat = HABITATS.find(h => h.id === correctAnimal.habitat)!;

  // Get wrong habitats
  const wrongHabitats = shuffleArray(HABITATS.filter(h => h.id !== correctAnimal.habitat))
    .slice(0, optionCount - 1);

  const options: QuestionOption[] = shuffleArray([
    { id: correctHabitat.id, text: correctHabitat.name, isCorrect: true },
    ...wrongHabitats.map(h => ({ id: h.id, text: h.name, isCorrect: false })),
  ]);

  return {
    id: `habitat-${correctAnimal.id}-${Date.now()}-${index}`,
    type: 'habitat',
    prompt: `Where does the ${correctAnimal.name} live?`,
    correctAnswer: correctHabitat.name,
    correctAnswerId: correctAnimal.id,
    options,
    imageHint: correctAnimal.emoji,
    hint: `Think about the climate this animal needs to survive.`,
    explanation: `${correctAnimal.name}s live in the ${correctHabitat.name.toLowerCase()}! ${correctHabitat.description}`,
  };
}

// Generate a fact-check question
function generateFactCheckQuestion(
  animals: typeof ANIMALS,
  index: number
): Question {
  const shuffled = shuffleArray(animals);
  const animal = shuffled[index % shuffled.length];

  // Randomly decide if we show a true or false fact
  const showTrueFact = Math.random() > 0.4;

  let prompt: string;
  let isTrue: boolean;
  let explanation: string;

  if (showTrueFact) {
    // Use a real fact from the animal
    const fact = animal.funFacts[Math.floor(Math.random() * animal.funFacts.length)];
    prompt = fact;
    isTrue = true;
    explanation = `That's true! ${fact}`;
  } else {
    // Generate a false fact
    const falseFacts = generateFalseFacts(animal);
    prompt = falseFacts[Math.floor(Math.random() * falseFacts.length)];
    isTrue = false;
    explanation = `That's false! Here's a real fact: ${animal.funFacts[0]}`;
  }

  const options: QuestionOption[] = [
    { id: 'true', text: 'True', isCorrect: isTrue },
    { id: 'false', text: 'False', isCorrect: !isTrue },
  ];

  return {
    id: `fact-${animal.id}-${Date.now()}-${index}`,
    type: 'fact-check',
    prompt: `True or False: ${prompt}`,
    correctAnswer: isTrue ? 'True' : 'False',
    correctAnswerId: animal.id,
    options,
    imageHint: animal.emoji,
    hint: `Think about what you know about the ${animal.name}.`,
    explanation,
  };
}

// Generate false facts for fact-check questions
function generateFalseFacts(animal: typeof ANIMALS[0]): string[] {
  const falseFacts: string[] = [];

  // Create plausible but false facts
  if (animal.diet === 'carnivore') {
    falseFacts.push(`${animal.name}s are herbivores that only eat plants.`);
  } else if (animal.diet === 'herbivore') {
    falseFacts.push(`${animal.name}s are fierce predators that hunt other animals.`);
  }

  if (animal.habitat === 'arctic') {
    falseFacts.push(`${animal.name}s live in hot desert environments.`);
  } else if (animal.habitat === 'desert') {
    falseFacts.push(`${animal.name}s need to live near water at all times.`);
  }

  if (animal.canFly) {
    falseFacts.push(`${animal.name}s cannot fly despite having wings.`);
  }

  if (animal.isNocturnal) {
    falseFacts.push(`${animal.name}s are most active during the day.`);
  }

  // Add some general false facts
  falseFacts.push(`${animal.name}s can live for over 500 years.`);
  falseFacts.push(`${animal.name}s are the smallest animals in their habitat.`);
  falseFacts.push(`${animal.name}s have 10 legs.`);

  return falseFacts;
}

// Generate a classification question
function generateClassificationQuestion(
  animals: typeof ANIMALS,
  optionCount: number,
  index: number
): Question {
  const shuffled = shuffleArray(animals);
  const correctAnimal = shuffled[index % shuffled.length];

  // Different classification questions
  const questionTypes = [
    {
      prompt: `What type of eater is a ${correctAnimal.name}?`,
      correct: correctAnimal.diet.charAt(0).toUpperCase() + correctAnimal.diet.slice(1),
      options: ['Herbivore', 'Carnivore', 'Omnivore'],
      correctId: correctAnimal.diet,
      explanation: `${correctAnimal.name}s are ${correctAnimal.diet}s. ${
        correctAnimal.diet === 'herbivore' ? 'They only eat plants!' :
        correctAnimal.diet === 'carnivore' ? 'They eat other animals!' :
        'They eat both plants and animals!'
      }`,
    },
    {
      prompt: `Is the ${correctAnimal.name} endangered?`,
      correct: correctAnimal.isEndangered ? 'Yes, endangered' : 'No, not endangered',
      options: ['Yes, endangered', 'No, not endangered'],
      correctId: correctAnimal.isEndangered ? 'endangered' : 'not-endangered',
      explanation: correctAnimal.isEndangered ?
        `Sadly, ${correctAnimal.name}s are endangered. We need to protect them!` :
        `Good news! ${correctAnimal.name}s are not currently endangered.`,
    },
  ];

  // For birds, add flying question
  if (correctAnimal.category === 'birds') {
    questionTypes.push({
      prompt: `Can the ${correctAnimal.name} fly?`,
      correct: correctAnimal.canFly ? 'Yes' : 'No',
      options: ['Yes', 'No'],
      correctId: correctAnimal.canFly ? 'can-fly' : 'cannot-fly',
      explanation: correctAnimal.canFly ?
        `Yes! ${correctAnimal.name}s can fly.` :
        `No, ${correctAnimal.name}s cannot fly, even though they are birds!`,
    });
  }

  // For mammals, add nocturnal question
  if (correctAnimal.isNocturnal !== undefined) {
    questionTypes.push({
      prompt: `Is the ${correctAnimal.name} nocturnal (active at night)?`,
      correct: correctAnimal.isNocturnal ? 'Yes, nocturnal' : 'No, active during day',
      options: ['Yes, nocturnal', 'No, active during day'],
      correctId: correctAnimal.isNocturnal ? 'nocturnal' : 'diurnal',
      explanation: correctAnimal.isNocturnal ?
        `${correctAnimal.name}s are nocturnal, meaning they're most active at night!` :
        `${correctAnimal.name}s are active during the day.`,
    });
  }

  const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  const options: QuestionOption[] = selectedQuestion.options.map(opt => ({
    id: opt.toLowerCase().replace(/[^a-z]/g, '-'),
    text: opt,
    isCorrect: opt === selectedQuestion.correct,
  }));

  // Add more options if needed
  while (options.length < optionCount && options.length < selectedQuestion.options.length) {
    // Options array is already complete for this question type
    break;
  }

  return {
    id: `classification-${correctAnimal.id}-${Date.now()}-${index}`,
    type: 'classification',
    prompt: selectedQuestion.prompt,
    correctAnswer: selectedQuestion.correct,
    correctAnswerId: correctAnimal.id,
    options: shuffleArray(options),
    imageHint: correctAnimal.emoji,
    hint: `Think about the ${correctAnimal.name}'s lifestyle and characteristics.`,
    explanation: selectedQuestion.explanation,
  };
}
