import type { Level, Operation, Problem, Difficulty } from '../types';

// All levels organized by operation
export const LEVELS: Level[] = [
  // === ADDITION LEVELS ===
  {
    id: 1,
    name: 'Baby Steps',
    operation: 'addition',
    difficulty: 'beginner',
    description: 'Add small numbers (1-5)',
    minNumber1: 1,
    maxNumber1: 5,
    minNumber2: 1,
    maxNumber2: 5,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
  },
  {
    id: 2,
    name: 'Getting Warmer',
    operation: 'addition',
    difficulty: 'beginner',
    description: 'Add numbers up to 10',
    minNumber1: 1,
    maxNumber1: 10,
    minNumber2: 1,
    maxNumber2: 10,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
    unlockRequirement: { levelId: 1, minScore: 500 },
  },
  {
    id: 3,
    name: 'Double Digits',
    operation: 'addition',
    difficulty: 'easy',
    description: 'Add numbers up to 20',
    minNumber1: 5,
    maxNumber1: 20,
    minNumber2: 1,
    maxNumber2: 20,
    problemCount: 12,
    timeLimit: 15,
    allowNegatives: false,
    unlockRequirement: { levelId: 2, minScore: 600 },
  },
  {
    id: 4,
    name: 'Sum Master',
    operation: 'addition',
    difficulty: 'medium',
    description: 'Add larger numbers',
    minNumber1: 10,
    maxNumber1: 50,
    minNumber2: 10,
    maxNumber2: 50,
    problemCount: 15,
    timeLimit: 12,
    allowNegatives: false,
    unlockRequirement: { levelId: 3, minScore: 800 },
  },
  {
    id: 5,
    name: 'Addition Pro',
    operation: 'addition',
    difficulty: 'hard',
    description: 'Big number addition',
    minNumber1: 25,
    maxNumber1: 100,
    minNumber2: 25,
    maxNumber2: 100,
    problemCount: 15,
    timeLimit: 10,
    allowNegatives: false,
    unlockRequirement: { levelId: 4, minScore: 1000 },
  },

  // === SUBTRACTION LEVELS ===
  {
    id: 6,
    name: 'Take Away',
    operation: 'subtraction',
    difficulty: 'beginner',
    description: 'Subtract small numbers (1-5)',
    minNumber1: 3,
    maxNumber1: 10,
    minNumber2: 1,
    maxNumber2: 5,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
  },
  {
    id: 7,
    name: 'Minus Mission',
    operation: 'subtraction',
    difficulty: 'beginner',
    description: 'Subtract numbers up to 10',
    minNumber1: 5,
    maxNumber1: 15,
    minNumber2: 1,
    maxNumber2: 10,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
    unlockRequirement: { levelId: 6, minScore: 500 },
  },
  {
    id: 8,
    name: 'Difference Maker',
    operation: 'subtraction',
    difficulty: 'easy',
    description: 'Find bigger differences',
    minNumber1: 10,
    maxNumber1: 30,
    minNumber2: 1,
    maxNumber2: 20,
    problemCount: 12,
    timeLimit: 15,
    allowNegatives: false,
    unlockRequirement: { levelId: 7, minScore: 600 },
  },
  {
    id: 9,
    name: 'Subtraction Star',
    operation: 'subtraction',
    difficulty: 'medium',
    description: 'Subtract larger numbers',
    minNumber1: 20,
    maxNumber1: 60,
    minNumber2: 10,
    maxNumber2: 40,
    problemCount: 15,
    timeLimit: 12,
    allowNegatives: false,
    unlockRequirement: { levelId: 8, minScore: 800 },
  },
  {
    id: 10,
    name: 'Minus Master',
    operation: 'subtraction',
    difficulty: 'hard',
    description: 'Big number subtraction',
    minNumber1: 50,
    maxNumber1: 150,
    minNumber2: 25,
    maxNumber2: 100,
    problemCount: 15,
    timeLimit: 10,
    allowNegatives: false,
    unlockRequirement: { levelId: 9, minScore: 1000 },
  },

  // === MULTIPLICATION LEVELS ===
  {
    id: 11,
    name: 'Times Tables',
    operation: 'multiplication',
    difficulty: 'beginner',
    description: 'Multiply by 1-3',
    minNumber1: 1,
    maxNumber1: 5,
    minNumber2: 1,
    maxNumber2: 3,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
  },
  {
    id: 12,
    name: 'Multiply Magic',
    operation: 'multiplication',
    difficulty: 'beginner',
    description: 'Multiply by 1-5',
    minNumber1: 1,
    maxNumber1: 10,
    minNumber2: 1,
    maxNumber2: 5,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
    unlockRequirement: { levelId: 11, minScore: 500 },
  },
  {
    id: 13,
    name: 'Table Trainer',
    operation: 'multiplication',
    difficulty: 'easy',
    description: 'Full times tables',
    minNumber1: 2,
    maxNumber1: 10,
    minNumber2: 2,
    maxNumber2: 10,
    problemCount: 12,
    timeLimit: 15,
    allowNegatives: false,
    unlockRequirement: { levelId: 12, minScore: 600 },
  },
  {
    id: 14,
    name: 'Product Power',
    operation: 'multiplication',
    difficulty: 'medium',
    description: 'Bigger multiplications',
    minNumber1: 5,
    maxNumber1: 12,
    minNumber2: 5,
    maxNumber2: 12,
    problemCount: 15,
    timeLimit: 12,
    allowNegatives: false,
    unlockRequirement: { levelId: 13, minScore: 800 },
  },
  {
    id: 15,
    name: 'Multiplication Master',
    operation: 'multiplication',
    difficulty: 'hard',
    description: 'Advanced multiplication',
    minNumber1: 6,
    maxNumber1: 15,
    minNumber2: 6,
    maxNumber2: 15,
    problemCount: 15,
    timeLimit: 10,
    allowNegatives: false,
    unlockRequirement: { levelId: 14, minScore: 1000 },
  },

  // === DIVISION LEVELS ===
  {
    id: 16,
    name: 'Fair Share',
    operation: 'division',
    difficulty: 'beginner',
    description: 'Divide by 1-2',
    minNumber1: 2,
    maxNumber1: 10,
    minNumber2: 1,
    maxNumber2: 2,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
  },
  {
    id: 17,
    name: 'Split It Up',
    operation: 'division',
    difficulty: 'beginner',
    description: 'Divide by 1-5',
    minNumber1: 5,
    maxNumber1: 25,
    minNumber2: 1,
    maxNumber2: 5,
    problemCount: 10,
    timeLimit: 0,
    allowNegatives: false,
    unlockRequirement: { levelId: 16, minScore: 500 },
  },
  {
    id: 18,
    name: 'Division Dojo',
    operation: 'division',
    difficulty: 'easy',
    description: 'Basic division practice',
    minNumber1: 10,
    maxNumber1: 50,
    minNumber2: 2,
    maxNumber2: 10,
    problemCount: 12,
    timeLimit: 15,
    allowNegatives: false,
    unlockRequirement: { levelId: 17, minScore: 600 },
  },
  {
    id: 19,
    name: 'Quotient Quest',
    operation: 'division',
    difficulty: 'medium',
    description: 'Bigger divisions',
    minNumber1: 20,
    maxNumber1: 100,
    minNumber2: 2,
    maxNumber2: 10,
    problemCount: 15,
    timeLimit: 12,
    allowNegatives: false,
    unlockRequirement: { levelId: 18, minScore: 800 },
  },
  {
    id: 20,
    name: 'Division Dynasty',
    operation: 'division',
    difficulty: 'hard',
    description: 'Advanced division',
    minNumber1: 36,
    maxNumber1: 144,
    minNumber2: 4,
    maxNumber2: 12,
    problemCount: 15,
    timeLimit: 10,
    allowNegatives: false,
    unlockRequirement: { levelId: 19, minScore: 1000 },
  },

  // === MIXED LEVELS ===
  {
    id: 21,
    name: 'Mix It Up',
    operation: 'mixed',
    difficulty: 'easy',
    description: 'Addition & subtraction mixed',
    minNumber1: 1,
    maxNumber1: 20,
    minNumber2: 1,
    maxNumber2: 15,
    problemCount: 12,
    timeLimit: 15,
    allowNegatives: false,
    unlockRequirement: { levelId: 3, minScore: 600 },
  },
  {
    id: 22,
    name: 'Operation Shuffle',
    operation: 'mixed',
    difficulty: 'medium',
    description: 'All four operations',
    minNumber1: 2,
    maxNumber1: 12,
    minNumber2: 2,
    maxNumber2: 10,
    problemCount: 15,
    timeLimit: 12,
    allowNegatives: false,
    unlockRequirement: { levelId: 21, minScore: 800 },
  },
  {
    id: 23,
    name: 'Math Mayhem',
    operation: 'mixed',
    difficulty: 'hard',
    description: 'Fast-paced mixed ops',
    minNumber1: 5,
    maxNumber1: 25,
    minNumber2: 2,
    maxNumber2: 15,
    problemCount: 20,
    timeLimit: 10,
    allowNegatives: false,
    unlockRequirement: { levelId: 22, minScore: 1000 },
  },
  {
    id: 24,
    name: 'Number Ninja',
    operation: 'mixed',
    difficulty: 'expert',
    description: 'Ultimate challenge!',
    minNumber1: 10,
    maxNumber1: 50,
    minNumber2: 5,
    maxNumber2: 25,
    problemCount: 25,
    timeLimit: 8,
    allowNegatives: false,
    unlockRequirement: { levelId: 23, minScore: 1500 },
  },
];

// Helper functions
export function getLevelById(id: number): Level | undefined {
  return LEVELS.find(level => level.id === id);
}

export function getLevelsByOperation(operation: Operation): Level[] {
  return LEVELS.filter(level => level.operation === operation);
}

export function getLevelsByDifficulty(difficulty: Difficulty): Level[] {
  return LEVELS.filter(level => level.difficulty === difficulty);
}

export function getNextLevel(currentId: number): Level | undefined {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex >= LEVELS.length - 1) return undefined;
  return LEVELS[currentIndex + 1];
}

export function getNextLevelInOperation(currentId: number): Level | undefined {
  const current = getLevelById(currentId);
  if (!current) return undefined;

  const operationLevels = getLevelsByOperation(current.operation);
  const currentIndex = operationLevels.findIndex(l => l.id === currentId);

  if (currentIndex === -1 || currentIndex >= operationLevels.length - 1) return undefined;
  return operationLevels[currentIndex + 1];
}

// Problem generation
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperationSymbol(operation: Operation): string {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '−';
    case 'multiplication': return '×';
    case 'division': return '÷';
    case 'mixed': return '?';
  }
}

function generateSingleProblem(
  level: Level,
  operationOverride?: Operation
): Problem {
  const operation = operationOverride || level.operation;
  let num1: number;
  let num2: number;
  let answer: number;

  switch (operation) {
    case 'addition':
      num1 = getRandomInt(level.minNumber1, level.maxNumber1);
      num2 = getRandomInt(level.minNumber2, level.maxNumber2);
      answer = num1 + num2;
      break;

    case 'subtraction':
      // Ensure num1 >= num2 for non-negative results
      num1 = getRandomInt(level.minNumber1, level.maxNumber1);
      num2 = getRandomInt(level.minNumber2, Math.min(level.maxNumber2, num1));
      if (!level.allowNegatives && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
      break;

    case 'multiplication':
      num1 = getRandomInt(level.minNumber1, level.maxNumber1);
      num2 = getRandomInt(level.minNumber2, level.maxNumber2);
      answer = num1 * num2;
      break;

    case 'division':
      // Generate problems that divide evenly
      num2 = getRandomInt(level.minNumber2, level.maxNumber2);
      answer = getRandomInt(Math.ceil(level.minNumber1 / num2), Math.floor(level.maxNumber1 / num2));
      num1 = num2 * answer;
      break;

    default:
      num1 = getRandomInt(level.minNumber1, level.maxNumber1);
      num2 = getRandomInt(level.minNumber2, level.maxNumber2);
      answer = num1 + num2;
  }

  const symbol = getOperationSymbol(operation);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    num1,
    num2,
    operation,
    correctAnswer: answer,
    displayString: `${num1} ${symbol} ${num2} = ?`,
  };
}

export function generateProblems(level: Level): Problem[] {
  const problems: Problem[] = [];
  const usedProblems = new Set<string>();

  // For mixed mode, we need to cycle through operations
  const mixedOperations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

  for (let i = 0; i < level.problemCount; i++) {
    let problem: Problem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      if (level.operation === 'mixed') {
        // Cycle through operations for variety
        const opIndex = i % mixedOperations.length;
        problem = generateSingleProblem(level, mixedOperations[opIndex]);
      } else {
        problem = generateSingleProblem(level);
      }
      attempts++;
    } while (
      usedProblems.has(`${problem.num1}-${problem.operation}-${problem.num2}`) &&
      attempts < maxAttempts
    );

    usedProblems.add(`${problem.num1}-${problem.operation}-${problem.num2}`);
    problems.push(problem);
  }

  return problems;
}

// Generate multiple choice options
export function generateChoices(correctAnswer: number, count: number = 4): number[] {
  const choices = new Set<number>([correctAnswer]);

  // Generate wrong answers that are close to the correct one
  const variations = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 10,
    correctAnswer - 10,
    correctAnswer * 2,
    Math.floor(correctAnswer / 2),
    correctAnswer + 5,
    correctAnswer - 5,
  ].filter(n => n >= 0 && n !== correctAnswer);

  // Shuffle variations and pick enough to fill choices
  const shuffled = variations.sort(() => Math.random() - 0.5);

  for (const num of shuffled) {
    if (choices.size >= count) break;
    choices.add(num);
  }

  // If still not enough, add random numbers
  while (choices.size < count) {
    const range = Math.max(10, correctAnswer);
    const random = Math.floor(Math.random() * range * 2);
    if (random !== correctAnswer && random >= 0) {
      choices.add(random);
    }
  }

  // Convert to array and shuffle
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

// Achievement messages based on performance
export const PERFORMANCE_MESSAGES = {
  perfect: [
    'PERFECT! You are a math genius!',
    'Incredible! 100% accuracy!',
    'Flawless victory!',
    'Math superstar!',
  ],
  excellent: [
    'Excellent work!',
    'Amazing performance!',
    'You are crushing it!',
    'Fantastic job!',
  ],
  good: [
    'Good job!',
    'Nice work!',
    'Keep practicing!',
    'You are improving!',
  ],
  needsPractice: [
    'Keep trying!',
    'Practice makes perfect!',
    'You will get better!',
    'Don\'t give up!',
  ],
};

export function getPerformanceMessage(accuracy: number): string {
  const messages = accuracy >= 100
    ? PERFORMANCE_MESSAGES.perfect
    : accuracy >= 80
    ? PERFORMANCE_MESSAGES.excellent
    : accuracy >= 60
    ? PERFORMANCE_MESSAGES.good
    : PERFORMANCE_MESSAGES.needsPractice;

  return messages[Math.floor(Math.random() * messages.length)];
}
