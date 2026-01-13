import type { QuizQuestion, Level, Difficulty } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // BEGINNER - Planets
  {
    id: 'q-b1',
    question: 'Which planet is called the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctAnswer: 1,
    explanation: 'Mars is called the Red Planet because its soil contains iron oxide, which is rust!',
    difficulty: 'beginner',
    category: 'planets',
    relatedPlanet: 'mars',
  },
  {
    id: 'q-b2',
    question: 'What is the closest star to Earth?',
    options: ['Alpha Centauri', 'The Sun', 'Polaris', 'Sirius'],
    correctAnswer: 1,
    explanation: 'The Sun is our closest star! It gives us light and warmth every day.',
    difficulty: 'beginner',
    category: 'stars',
  },
  {
    id: 'q-b3',
    question: 'Which planet has beautiful rings around it?',
    options: ['Mars', 'Earth', 'Saturn', 'Neptune'],
    correctAnswer: 2,
    explanation: 'Saturn is famous for its beautiful rings made of ice and rock!',
    difficulty: 'beginner',
    category: 'planets',
    relatedPlanet: 'saturn',
  },
  {
    id: 'q-b4',
    question: 'What is the name of Earth\'s moon?',
    options: ['Luna', 'Phobos', 'Titan', 'Europa'],
    correctAnswer: 0,
    explanation: 'Earth\'s moon is called Luna (or just "The Moon"). It\'s the only moon we have!',
    difficulty: 'beginner',
    category: 'moons',
    relatedPlanet: 'earth',
  },
  {
    id: 'q-b5',
    question: 'Which planet is the biggest in our solar system?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
    correctAnswer: 2,
    explanation: 'Jupiter is the largest planet! Over 1,300 Earths could fit inside it.',
    difficulty: 'beginner',
    category: 'planets',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'q-b6',
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 1,
    explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
    difficulty: 'beginner',
    category: 'astronomy',
  },
  {
    id: 'q-b7',
    question: 'What planet do we live on?',
    options: ['Mars', 'Venus', 'Earth', 'Mercury'],
    correctAnswer: 2,
    explanation: 'We live on Earth - the only planet we know of that has life!',
    difficulty: 'beginner',
    category: 'planets',
    relatedPlanet: 'earth',
  },
  {
    id: 'q-b8',
    question: 'What color is the Sun?',
    options: ['Red', 'Blue', 'Yellow/White', 'Green'],
    correctAnswer: 2,
    explanation: 'The Sun appears yellow from Earth, but in space it looks white!',
    difficulty: 'beginner',
    category: 'stars',
  },

  // EXPLORER - Intermediate
  {
    id: 'q-e1',
    question: 'Which planet is the hottest in our solar system?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctAnswer: 1,
    explanation: 'Venus is the hottest (465°C) because its thick atmosphere traps heat, even though Mercury is closer to the Sun!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'venus',
  },
  {
    id: 'q-e2',
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A volcano', 'A giant storm', 'A crater', 'An ocean'],
    correctAnswer: 1,
    explanation: 'The Great Red Spot is a giant storm that has been raging for over 400 years!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'q-e3',
    question: 'Why is Mars red?',
    options: ['It\'s hot', 'Iron oxide (rust) in the soil', 'Red plants', 'Red clouds'],
    correctAnswer: 1,
    explanation: 'Mars is red because its soil contains iron oxide, which is the same thing as rust!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'mars',
  },
  {
    id: 'q-e4',
    question: 'Which planet spins on its side?',
    options: ['Venus', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 2,
    explanation: 'Uranus is tilted on its side, probably from a huge collision long ago. It rolls around the Sun like a bowling ball!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'uranus',
  },
  {
    id: 'q-e5',
    question: 'What are Saturn\'s rings made of?',
    options: ['Gas', 'Fire', 'Ice and rock', 'Dust only'],
    correctAnswer: 2,
    explanation: 'Saturn\'s rings are made of billions of pieces of ice and rock, ranging from tiny grains to house-sized chunks!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'saturn',
  },
  {
    id: 'q-e6',
    question: 'Which moon of Saturn has lakes of liquid methane?',
    options: ['Enceladus', 'Titan', 'Mimas', 'Rhea'],
    correctAnswer: 1,
    explanation: 'Titan is the only moon with a thick atmosphere and has lakes and rivers of liquid methane!',
    difficulty: 'explorer',
    category: 'moons',
    relatedPlanet: 'saturn',
  },
  {
    id: 'q-e7',
    question: 'What is a "year" on Mars called?',
    options: ['A Mars year', 'A Martian year', 'A red year', 'Both A and B'],
    correctAnswer: 3,
    explanation: 'A year on Mars can be called a Mars year or a Martian year - it takes 687 Earth days!',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'mars',
  },
  {
    id: 'q-e8',
    question: 'Which planet was discovered using mathematics before it was seen?',
    options: ['Uranus', 'Neptune', 'Pluto', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Neptune was predicted by math! Scientists noticed Uranus wasn\'t moving as expected and calculated where another planet must be.',
    difficulty: 'explorer',
    category: 'planets',
    relatedPlanet: 'neptune',
  },

  // ASTRONAUT - Advanced
  {
    id: 'q-a1',
    question: 'What is the largest volcano in the solar system?',
    options: ['Mount Everest (Earth)', 'Olympus Mons (Mars)', 'Maxwell Montes (Venus)', 'Io\'s volcanoes (Jupiter)'],
    correctAnswer: 1,
    explanation: 'Olympus Mons on Mars is the largest known volcano - it\'s about 3 times taller than Mount Everest!',
    difficulty: 'astronaut',
    category: 'planets',
    relatedPlanet: 'mars',
  },
  {
    id: 'q-a2',
    question: 'Which moon might have an ocean under its icy surface?',
    options: ['Luna', 'Phobos', 'Europa', 'Deimos'],
    correctAnswer: 2,
    explanation: 'Europa (Jupiter\'s moon) has a global ocean beneath its icy crust - it might even have conditions for life!',
    difficulty: 'astronaut',
    category: 'moons',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'q-a3',
    question: 'What causes Earth\'s seasons?',
    options: ['Distance from the Sun', 'Earth\'s tilted axis', 'The Moon\'s gravity', 'Solar flares'],
    correctAnswer: 1,
    explanation: 'Earth\'s 23.5° tilt causes seasons - when the Northern Hemisphere tilts toward the Sun, it\'s summer there!',
    difficulty: 'astronaut',
    category: 'astronomy',
    relatedPlanet: 'earth',
  },
  {
    id: 'q-a4',
    question: 'How long does light from the Sun take to reach Earth?',
    options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
    correctAnswer: 1,
    explanation: 'Light travels at 300,000 km/s, but the Sun is so far away that sunlight takes about 8 minutes to reach us!',
    difficulty: 'astronaut',
    category: 'astronomy',
  },
  {
    id: 'q-a5',
    question: 'What is the "Kuiper Belt"?',
    options: ['A ring around Saturn', 'An asteroid belt between Mars and Jupiter', 'A region beyond Neptune with icy objects', 'A cloud around the Sun'],
    correctAnswer: 2,
    explanation: 'The Kuiper Belt is a region beyond Neptune filled with icy objects, including dwarf planets like Pluto!',
    difficulty: 'astronaut',
    category: 'astronomy',
  },
  {
    id: 'q-a6',
    question: 'Which planet has the strongest winds in the solar system?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 3,
    explanation: 'Neptune has the strongest winds - up to 2,100 km/h! That\'s faster than the speed of sound!',
    difficulty: 'astronaut',
    category: 'planets',
    relatedPlanet: 'neptune',
  },
  {
    id: 'q-a7',
    question: 'What is a "dwarf planet"?',
    options: ['A very small planet', 'A planet that hasn\'t cleared its orbit', 'A baby planet', 'A planet without moons'],
    correctAnswer: 1,
    explanation: 'A dwarf planet orbits the Sun and is round, but hasn\'t "cleared" its orbital neighborhood of other debris.',
    difficulty: 'astronaut',
    category: 'astronomy',
  },
  {
    id: 'q-a8',
    question: 'Why doesn\'t Mercury have an atmosphere?',
    options: ['It\'s too cold', 'It\'s too small and close to the Sun', 'It spins too fast', 'It\'s too far from the Sun'],
    correctAnswer: 1,
    explanation: 'Mercury is small with weak gravity, and the Sun\'s heat and solar wind blow away any gases that could form an atmosphere.',
    difficulty: 'astronaut',
    category: 'planets',
    relatedPlanet: 'mercury',
  },

  // COMMANDER - Expert
  {
    id: 'q-c1',
    question: 'What is the name of NASA\'s Mars helicopter?',
    options: ['Spirit', 'Ingenuity', 'Curiosity', 'Perseverance'],
    correctAnswer: 1,
    explanation: 'Ingenuity is a small helicopter that flew on Mars - the first powered flight on another planet!',
    difficulty: 'commander',
    category: 'space-travel',
    relatedPlanet: 'mars',
  },
  {
    id: 'q-c2',
    question: 'What is the "Goldilocks Zone"?',
    options: ['A region near black holes', 'The habitable zone where liquid water can exist', 'The center of the Milky Way', 'A region with gold asteroids'],
    correctAnswer: 1,
    explanation: 'The Goldilocks Zone is the distance from a star where it\'s not too hot and not too cold for liquid water - just right for life!',
    difficulty: 'commander',
    category: 'astronomy',
  },
  {
    id: 'q-c3',
    question: 'What spacecraft first flew past Pluto in 2015?',
    options: ['Voyager 1', 'Cassini', 'New Horizons', 'Juno'],
    correctAnswer: 2,
    explanation: 'New Horizons flew past Pluto in July 2015, giving us our first close-up pictures of the dwarf planet!',
    difficulty: 'commander',
    category: 'space-travel',
    relatedPlanet: 'pluto',
  },
  {
    id: 'q-c4',
    question: 'What is Jupiter mostly made of?',
    options: ['Rock and metal', 'Ice and water', 'Hydrogen and helium', 'Carbon dioxide'],
    correctAnswer: 2,
    explanation: 'Jupiter is mostly hydrogen and helium - the same elements that make up our Sun! It\'s like a failed star.',
    difficulty: 'commander',
    category: 'planets',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'q-c5',
    question: 'What is "retrograde" motion of a planet?',
    options: ['When a planet appears to move backward', 'When a planet speeds up', 'When a planet explodes', 'When a planet gets closer to the Sun'],
    correctAnswer: 0,
    explanation: 'Retrograde motion is when a planet appears to move backward in the sky - it\'s an optical illusion caused by Earth\'s orbit!',
    difficulty: 'commander',
    category: 'astronomy',
  },
  {
    id: 'q-c6',
    question: 'Which moon in our solar system has active volcanoes?',
    options: ['Luna (Earth)', 'Titan (Saturn)', 'Io (Jupiter)', 'Triton (Neptune)'],
    correctAnswer: 2,
    explanation: 'Io is the most volcanically active body in the solar system! Jupiter\'s gravity causes intense tidal heating.',
    difficulty: 'commander',
    category: 'moons',
    relatedPlanet: 'jupiter',
  },
  {
    id: 'q-c7',
    question: 'What is the farthest human-made object from Earth?',
    options: ['Hubble Space Telescope', 'International Space Station', 'Voyager 1', 'James Webb Space Telescope'],
    correctAnswer: 2,
    explanation: 'Voyager 1, launched in 1977, is now over 24 billion km away - it\'s entered interstellar space!',
    difficulty: 'commander',
    category: 'space-travel',
  },
  {
    id: 'q-c8',
    question: 'Why does Venus spin backwards compared to most planets?',
    options: ['It was hit by a large object', 'The Sun\'s gravity flipped it', 'It formed that way', 'We don\'t know for sure'],
    correctAnswer: 3,
    explanation: 'Scientists aren\'t 100% sure why Venus spins backwards! It might be from a massive impact or gravitational effects during formation.',
    difficulty: 'commander',
    category: 'planets',
    relatedPlanet: 'venus',
  },
];

// Quiz levels configuration
export const QUIZ_LEVELS: Level[] = [
  {
    id: 'quiz-1',
    name: 'Space Rookie',
    description: 'Learn the basics about our solar system!',
    mode: 'quiz',
    difficulty: 'beginner',
    planets: ['sun', 'earth', 'mars'],
    questionsCount: 5,
    timeLimit: 120,
    unlockRequirement: 0,
  },
  {
    id: 'quiz-2',
    name: 'Inner Planets',
    description: 'Test your knowledge of Mercury, Venus, Earth, and Mars!',
    mode: 'quiz',
    difficulty: 'beginner',
    planets: ['mercury', 'venus', 'earth', 'mars'],
    questionsCount: 6,
    timeLimit: 150,
    unlockRequirement: 3,
  },
  {
    id: 'quiz-3',
    name: 'Gas Giants Explorer',
    description: 'Journey to Jupiter and Saturn!',
    mode: 'quiz',
    difficulty: 'explorer',
    planets: ['jupiter', 'saturn'],
    questionsCount: 6,
    timeLimit: 150,
    unlockRequirement: 8,
  },
  {
    id: 'quiz-4',
    name: 'Ice Giants Challenge',
    description: 'Explore the distant worlds of Uranus and Neptune!',
    mode: 'quiz',
    difficulty: 'explorer',
    planets: ['uranus', 'neptune'],
    questionsCount: 6,
    timeLimit: 150,
    unlockRequirement: 15,
  },
  {
    id: 'quiz-5',
    name: 'Moon Master',
    description: 'Test your knowledge about the moons of our solar system!',
    mode: 'quiz',
    difficulty: 'astronaut',
    planets: ['earth', 'mars', 'jupiter', 'saturn', 'neptune'],
    questionsCount: 8,
    timeLimit: 180,
    unlockRequirement: 22,
  },
  {
    id: 'quiz-6',
    name: 'Space Commander Test',
    description: 'The ultimate space quiz for true commanders!',
    mode: 'quiz',
    difficulty: 'commander',
    planets: ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
    questionsCount: 10,
    timeLimit: 240,
    unlockRequirement: 35,
  },
];

// Helper functions
export function getQuestionsByDifficulty(difficulty: Difficulty): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByPlanet(planetId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.relatedPlanet === planetId);
}

export function getQuestionsByCategory(category: QuizQuestion['category']): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getRandomQuestions(count: number, difficulty?: Difficulty): QuizQuestion[] {
  let pool = difficulty ? getQuestionsByDifficulty(difficulty) : [...QUIZ_QUESTIONS];

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

export function getLevelById(levelId: string): Level | undefined {
  return QUIZ_LEVELS.find(l => l.id === levelId);
}

export function getUnlockedLevels(totalStars: number): Level[] {
  return QUIZ_LEVELS.filter(l => l.unlockRequirement <= totalStars);
}
