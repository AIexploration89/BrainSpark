import type { ScienceTopic } from '../types';

export const SCIENCE_TOPICS: ScienceTopic[] = [
  // BIOLOGY TOPICS
  {
    id: 'cells',
    name: 'Cells',
    category: 'biology',
    description: 'The building blocks of all living things',
    icon: '🦠',
    funFact: 'Your body has about 37 trillion cells!',
  },
  {
    id: 'animals',
    name: 'Animals',
    category: 'biology',
    description: 'Amazing creatures from around the world',
    icon: '🦁',
    funFact: 'A blue whale\'s heart is so big that a small child could crawl through its arteries!',
  },
  {
    id: 'plants',
    name: 'Plants',
    category: 'biology',
    description: 'How plants grow and make food',
    icon: '🌿',
    funFact: 'The oldest tree on Earth is over 5,000 years old!',
  },
  {
    id: 'human-body',
    name: 'Human Body',
    category: 'biology',
    description: 'How our amazing body works',
    icon: '🫀',
    funFact: 'Your brain uses 20% of all the oxygen you breathe!',
  },
  {
    id: 'ecosystems',
    name: 'Ecosystems',
    category: 'biology',
    description: 'How living things interact with their environment',
    icon: '🌲',
    funFact: 'Rainforests produce 20% of the world\'s oxygen!',
  },
  {
    id: 'genetics',
    name: 'Genetics',
    category: 'biology',
    description: 'DNA and how traits are passed down',
    icon: '🧬',
    funFact: 'Humans share 50% of their DNA with bananas!',
  },

  // CHEMISTRY TOPICS
  {
    id: 'atoms',
    name: 'Atoms',
    category: 'chemistry',
    description: 'The tiny particles that make up everything',
    icon: '⚛️',
    funFact: 'Atoms are 99.9999% empty space!',
  },
  {
    id: 'elements',
    name: 'Elements',
    category: 'chemistry',
    description: 'The periodic table and basic elements',
    icon: '🧪',
    funFact: 'Gold is so rare that the world pours more steel in an hour than gold poured since the beginning of time!',
  },
  {
    id: 'molecules',
    name: 'Molecules',
    category: 'chemistry',
    description: 'How atoms combine to form molecules',
    icon: '🔗',
    funFact: 'A water molecule has lived for 3.8 billion years!',
  },
  {
    id: 'reactions',
    name: 'Chemical Reactions',
    category: 'chemistry',
    description: 'How substances change and combine',
    icon: '💥',
    funFact: 'Your body performs millions of chemical reactions every second!',
  },
  {
    id: 'states-of-matter',
    name: 'States of Matter',
    category: 'chemistry',
    description: 'Solids, liquids, gases, and more',
    icon: '🧊',
    funFact: 'Hot water can freeze faster than cold water - it\'s called the Mpemba effect!',
  },
  {
    id: 'acids-bases',
    name: 'Acids & Bases',
    category: 'chemistry',
    description: 'The pH scale and chemical properties',
    icon: '🍋',
    funFact: 'Your stomach acid is strong enough to dissolve metal!',
  },

  // PHYSICS TOPICS
  {
    id: 'forces',
    name: 'Forces',
    category: 'physics',
    description: 'Pushes, pulls, and motion',
    icon: '💪',
    funFact: 'Without friction, you couldn\'t walk or hold anything!',
  },
  {
    id: 'energy',
    name: 'Energy',
    category: 'physics',
    description: 'Different forms of energy and how they change',
    icon: '⚡',
    funFact: 'The sun produces enough energy in one second to power Earth for 500,000 years!',
  },
  {
    id: 'electricity',
    name: 'Electricity',
    category: 'physics',
    description: 'Electric currents and circuits',
    icon: '🔌',
    funFact: 'A bolt of lightning can reach 30,000°C - that\'s 5 times hotter than the sun\'s surface!',
  },
  {
    id: 'magnetism',
    name: 'Magnetism',
    category: 'physics',
    description: 'Magnets and magnetic fields',
    icon: '🧲',
    funFact: 'Earth is like a giant magnet with its own magnetic field!',
  },
  {
    id: 'light',
    name: 'Light',
    category: 'physics',
    description: 'How light travels and behaves',
    icon: '💡',
    funFact: 'Light from the sun takes 8 minutes and 20 seconds to reach Earth!',
  },
  {
    id: 'sound',
    name: 'Sound',
    category: 'physics',
    description: 'Sound waves and how we hear',
    icon: '🔊',
    funFact: 'Sound can\'t travel through space because there\'s no air!',
  },

  // EARTH SCIENCE TOPICS
  {
    id: 'rocks',
    name: 'Rocks & Minerals',
    category: 'earth-science',
    description: 'Types of rocks and how they form',
    icon: '🪨',
    funFact: 'Diamonds are made from carbon under extreme pressure!',
  },
  {
    id: 'weather',
    name: 'Weather',
    category: 'earth-science',
    description: 'Clouds, rain, and atmospheric conditions',
    icon: '🌦️',
    funFact: 'A hurricane can release energy equivalent to 10,000 nuclear bombs!',
  },
  {
    id: 'oceans',
    name: 'Oceans',
    category: 'earth-science',
    description: 'Marine life and ocean dynamics',
    icon: '🌊',
    funFact: 'We\'ve explored less than 5% of Earth\'s oceans!',
  },
  {
    id: 'volcanoes',
    name: 'Volcanoes',
    category: 'earth-science',
    description: 'How volcanoes form and erupt',
    icon: '🌋',
    funFact: 'There are over 1,500 active volcanoes on Earth!',
  },
  {
    id: 'solar-system',
    name: 'Solar System',
    category: 'earth-science',
    description: 'Our sun, planets, and space',
    icon: '🪐',
    funFact: 'One day on Venus is longer than one year on Venus!',
  },
  {
    id: 'climate',
    name: 'Climate',
    category: 'earth-science',
    description: 'Long-term weather patterns and change',
    icon: '🌡️',
    funFact: 'The Arctic is warming twice as fast as the rest of the planet!',
  },
];

export function getTopicsByCategory(category: string): ScienceTopic[] {
  if (category === 'all') return SCIENCE_TOPICS;
  return SCIENCE_TOPICS.filter(t => t.category === category);
}

export function getTopicById(id: string): ScienceTopic | undefined {
  return SCIENCE_TOPICS.find(t => t.id === id);
}
