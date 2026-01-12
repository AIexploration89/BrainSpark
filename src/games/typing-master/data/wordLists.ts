// Word lists organized by level and difficulty

// Level 1: Single letters (A-Z)
export const level1Letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Level 2: Home row sequences
export const level2Sequences = [
  'asdf', 'jkl;', 'fdsa', ';lkj',
  'asd', 'jkl', 'fds', 'lkj',
  'af', 'ak', 'sl', 'dj',
  'sad', 'lad', 'dad', 'fad',
  'ask', 'lass', 'fall', 'salsa',
  'flask', 'adds', 'lass', 'sass',
];

// Level 3: Top row words (simple words using home + top row)
export const level3Words = [
  'type', 'quit', 'write', 'query',
  'power', 'tower', 'reply', 'equip',
  'sport', 'quiet', 'quote', 'your',
  'rope', 'wipe', 'ripe', 'tape',
  'side', 'ride', 'wide', 'tide',
  'port', 'sort', 'tort', 'fort',
  'test', 'rest', 'pest', 'jest',
  'poet', 'quest', 'tried', 'fried',
];

// Level 4: Full alphabet words (3-4 letters)
export const level4Words = [
  'cat', 'dog', 'run', 'jump',
  'blue', 'red', 'green', 'pink',
  'box', 'mix', 'fix', 'six',
  'can', 'man', 'pan', 'fan',
  'big', 'pig', 'dig', 'wig',
  'bat', 'hat', 'mat', 'rat',
  'cup', 'pup', 'cut', 'hut',
  'sun', 'fun', 'bun', 'run',
  'zip', 'zap', 'zen', 'zoo',
  'van', 'ban', 'tan', 'clan',
  'jump', 'bump', 'pump', 'dump',
  'next', 'text', 'flex', 'hex',
];

// Level 5: Words with numbers
export const level5Content = [
  'room 101', '3 cats', '5 dogs', '7 birds',
  'floor 42', 'age 10', 'page 25', 'step 8',
  '2 plus 2', '5 times 3', '10 minus 4', '6 and 9',
  'item 1', 'item 2', 'item 3', 'item 4',
  'top 10', 'best 5', 'last 3', 'first 2',
  'level 99', 'score 100', 'rank 50', 'grade 7',
];

// Level 6: Punctuated phrases
export const level6Phrases = [
  'Hello, world!',
  'How are you?',
  'I like cats.',
  'Nice to meet you!',
  'What is your name?',
  "It's a great day.",
  'Run, jump, play!',
  'Red, blue, green.',
  "Don't stop now!",
  'Yes! You did it!',
  'Wait, come back.',
  'Go, team, go!',
];

// Level 7: Full sentences
export const level7Sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Bright vixens jump; dozy fowl quack.',
  'Sphinx of black quartz, judge my vow.',
  'Two driven jocks help fax my big quiz.',
  'The jay, pig, fox, zebra and my wolves quack!',
  'Sympathizing would fix Quaker objectives.',
  'A quick movement of the enemy will jeopardize six gunboats.',
  'All questions asked by five watched experts amaze the judge.',
  'Jack quietly moved up front and seized the big ball of wax.',
];

// Level 8: Paragraphs
export const level8Paragraphs = [
  'The sun rose slowly over the mountains, painting the sky in shades of orange and pink. Birds began to sing their morning songs, greeting the new day with joy. The air was fresh and cool, perfect for a morning adventure.',

  'Deep in the forest, a small rabbit hopped along a winding path. It stopped to nibble on some clover, its whiskers twitching with delight. A gentle breeze rustled the leaves above, creating a soothing melody.',

  'The ocean waves crashed against the rocky shore, sending spray into the air. Seagulls circled overhead, calling out to one another. A lighthouse stood tall on the cliff, guiding ships safely through the night.',

  'In the heart of the city, people hurried along the busy streets. Cars honked their horns while buses rumbled past. Street vendors sold hot pretzels and cold drinks to hungry passersby.',

  'The old wizard sat in his tower, surrounded by dusty books and glowing potions. He stroked his long white beard as he studied an ancient map. Tonight would be the night of the great spell.',
];

// Story mode content
export const storyChapters = [
  {
    id: 1,
    title: 'The Beginning',
    content: [
      'Once upon a time, in a land far away, there lived a young hero.',
      'This hero dreamed of adventure and wanted to explore the world.',
      'One day, a mysterious letter arrived at their door.',
    ],
  },
  {
    id: 2,
    title: 'The Journey Begins',
    content: [
      'The letter spoke of a hidden treasure in the Crystal Mountains.',
      'Our hero packed a bag with food, water, and a warm blanket.',
      'With excitement in their heart, they set off on the great adventure.',
    ],
  },
  {
    id: 3,
    title: 'The Dark Forest',
    content: [
      'The path led through a dark and mysterious forest.',
      'Strange sounds echoed between the ancient trees.',
      'But our hero was brave and kept walking forward.',
    ],
  },
  {
    id: 4,
    title: 'New Friends',
    content: [
      'In the forest, the hero met a friendly fox named Ember.',
      'Ember knew all the secret paths through the woods.',
      'Together, they continued the journey to the mountains.',
    ],
  },
  {
    id: 5,
    title: 'The Mountain',
    content: [
      'At last, they reached the base of the Crystal Mountains.',
      'The peaks sparkled in the sunlight like diamonds.',
      'The treasure was close, but the climb would not be easy.',
    ],
  },
];

// Word Rain words by difficulty
export const wordRainEasy = [
  'cat', 'dog', 'sun', 'run', 'fun',
  'big', 'red', 'blue', 'go', 'no',
  'yes', 'can', 'man', 'hat', 'bat',
];

export const wordRainMedium = [
  'jump', 'play', 'read', 'fast', 'slow',
  'happy', 'funny', 'quick', 'brown', 'green',
  'tiger', 'zebra', 'piano', 'magic', 'power',
];

export const wordRainHard = [
  'adventure', 'butterfly', 'champion', 'dinosaur',
  'elephant', 'fantastic', 'gorgeous', 'happiness',
  'important', 'jellyfish', 'knowledge', 'lightning',
];

// Function to get content for a level
export function getContentForLevel(levelId: number, count: number = 10): string[] {
  switch (levelId) {
    case 1:
      return shuffleArray([...level1Letters]).slice(0, count);
    case 2:
      return shuffleArray([...level2Sequences]).slice(0, count);
    case 3:
      return shuffleArray([...level3Words]).slice(0, count);
    case 4:
      return shuffleArray([...level4Words]).slice(0, count);
    case 5:
      return shuffleArray([...level5Content]).slice(0, count);
    case 6:
      return shuffleArray([...level6Phrases]).slice(0, count);
    case 7:
      return shuffleArray([...level7Sentences]).slice(0, count);
    case 8:
      return shuffleArray([...level8Paragraphs]).slice(0, count);
    default:
      return shuffleArray([...level4Words]).slice(0, count);
  }
}

export function getWordRainWords(difficulty: 'easy' | 'medium' | 'hard'): string[] {
  switch (difficulty) {
    case 'easy':
      return [...wordRainEasy];
    case 'medium':
      return [...wordRainMedium];
    case 'hard':
      return [...wordRainHard];
    default:
      return [...wordRainEasy];
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
