import type { Mission } from '../types';

export const MISSIONS: Mission[] = [
  // Beginner Missions
  {
    id: 'mission-1',
    name: 'First Steps',
    description: 'Begin your space journey by exploring our home planet!',
    targetPlanet: 'earth',
    objectives: [
      {
        id: 'obj-1-1',
        description: 'Visit Earth',
        type: 'visit-planet',
        target: 'earth',
        isCompleted: false,
      },
      {
        id: 'obj-1-2',
        description: 'Discover 2 facts about Earth',
        type: 'discover-fact',
        target: '2',
        isCompleted: false,
      },
    ],
    reward: 3,
    difficulty: 'beginner',
    isCompleted: false,
    unlockRequirement: 0,
  },
  {
    id: 'mission-2',
    name: 'Solar Observer',
    description: 'Learn about our star - the mighty Sun!',
    targetPlanet: 'sun',
    objectives: [
      {
        id: 'obj-2-1',
        description: 'Visit the Sun',
        type: 'visit-planet',
        target: 'sun',
        isCompleted: false,
      },
      {
        id: 'obj-2-2',
        description: 'Discover all facts about the Sun',
        type: 'discover-fact',
        target: '4',
        isCompleted: false,
      },
      {
        id: 'obj-2-3',
        description: 'Answer 1 quiz question correctly',
        type: 'answer-quiz',
        target: '1',
        isCompleted: false,
      },
    ],
    reward: 4,
    difficulty: 'beginner',
    isCompleted: false,
    unlockRequirement: 3,
  },
  {
    id: 'mission-3',
    name: 'Red Planet Explorer',
    description: 'Journey to the mysterious Red Planet!',
    targetPlanet: 'mars',
    objectives: [
      {
        id: 'obj-3-1',
        description: 'Visit Mars',
        type: 'visit-planet',
        target: 'mars',
        isCompleted: false,
      },
      {
        id: 'obj-3-2',
        description: 'Discover 3 facts about Mars',
        type: 'discover-fact',
        target: '3',
        isCompleted: false,
      },
      {
        id: 'obj-3-3',
        description: 'Answer 2 quiz questions about Mars',
        type: 'answer-quiz',
        target: '2',
        isCompleted: false,
      },
    ],
    reward: 5,
    timeLimit: 300,
    difficulty: 'beginner',
    isCompleted: false,
    unlockRequirement: 5,
  },

  // Explorer Missions
  {
    id: 'mission-4',
    name: 'Inner System Survey',
    description: 'Explore all the rocky planets close to the Sun!',
    targetPlanet: 'mercury',
    objectives: [
      {
        id: 'obj-4-1',
        description: 'Visit Mercury',
        type: 'visit-planet',
        target: 'mercury',
        isCompleted: false,
      },
      {
        id: 'obj-4-2',
        description: 'Visit Venus',
        type: 'visit-planet',
        target: 'venus',
        isCompleted: false,
      },
      {
        id: 'obj-4-3',
        description: 'Discover 2 facts from each inner planet',
        type: 'discover-fact',
        target: '8',
        isCompleted: false,
      },
    ],
    reward: 6,
    difficulty: 'explorer',
    isCompleted: false,
    unlockRequirement: 10,
  },
  {
    id: 'mission-5',
    name: 'Giant Discovery',
    description: 'Venture into the realm of the gas giants!',
    targetPlanet: 'jupiter',
    objectives: [
      {
        id: 'obj-5-1',
        description: 'Visit Jupiter',
        type: 'visit-planet',
        target: 'jupiter',
        isCompleted: false,
      },
      {
        id: 'obj-5-2',
        description: 'Learn about the Great Red Spot',
        type: 'discover-fact',
        target: 'jupiter-2',
        isCompleted: false,
      },
      {
        id: 'obj-5-3',
        description: 'Answer 3 quiz questions about gas giants',
        type: 'answer-quiz',
        target: '3',
        isCompleted: false,
      },
    ],
    reward: 7,
    timeLimit: 360,
    difficulty: 'explorer',
    isCompleted: false,
    unlockRequirement: 15,
  },
  {
    id: 'mission-6',
    name: 'Ring Master',
    description: 'Study Saturn and its magnificent rings!',
    targetPlanet: 'saturn',
    objectives: [
      {
        id: 'obj-6-1',
        description: 'Visit Saturn',
        type: 'visit-planet',
        target: 'saturn',
        isCompleted: false,
      },
      {
        id: 'obj-6-2',
        description: 'Discover all Saturn facts',
        type: 'discover-fact',
        target: '4',
        isCompleted: false,
      },
      {
        id: 'obj-6-3',
        description: 'Learn about Titan',
        type: 'discover-fact',
        target: 'saturn-4',
        isCompleted: false,
      },
    ],
    reward: 7,
    difficulty: 'explorer',
    isCompleted: false,
    unlockRequirement: 18,
  },

  // Astronaut Missions
  {
    id: 'mission-7',
    name: 'Ice Giant Expedition',
    description: 'Journey to the cold outer reaches of our solar system!',
    targetPlanet: 'uranus',
    objectives: [
      {
        id: 'obj-7-1',
        description: 'Visit Uranus',
        type: 'visit-planet',
        target: 'uranus',
        isCompleted: false,
      },
      {
        id: 'obj-7-2',
        description: 'Visit Neptune',
        type: 'visit-planet',
        target: 'neptune',
        isCompleted: false,
      },
      {
        id: 'obj-7-3',
        description: 'Discover all facts about ice giants',
        type: 'discover-fact',
        target: '8',
        isCompleted: false,
      },
      {
        id: 'obj-7-4',
        description: 'Answer 4 quiz questions correctly',
        type: 'answer-quiz',
        target: '4',
        isCompleted: false,
      },
    ],
    reward: 10,
    timeLimit: 420,
    difficulty: 'astronaut',
    isCompleted: false,
    unlockRequirement: 25,
  },
  {
    id: 'mission-8',
    name: 'Moon Hunter',
    description: 'Explore the fascinating moons of our solar system!',
    targetPlanet: 'jupiter',
    objectives: [
      {
        id: 'obj-8-1',
        description: 'Learn about Jupiter\'s moons',
        type: 'discover-fact',
        target: 'jupiter-4',
        isCompleted: false,
      },
      {
        id: 'obj-8-2',
        description: 'Learn about Saturn\'s moons',
        type: 'discover-fact',
        target: 'saturn-4',
        isCompleted: false,
      },
      {
        id: 'obj-8-3',
        description: 'Answer 3 moon-related quiz questions',
        type: 'answer-quiz',
        target: '3',
        isCompleted: false,
      },
    ],
    reward: 8,
    difficulty: 'astronaut',
    isCompleted: false,
    unlockRequirement: 28,
  },

  // Commander Missions
  {
    id: 'mission-9',
    name: 'Dwarf Planet Pioneer',
    description: 'Travel to the edge of our solar system to study Pluto!',
    targetPlanet: 'pluto',
    objectives: [
      {
        id: 'obj-9-1',
        description: 'Visit Pluto',
        type: 'visit-planet',
        target: 'pluto',
        isCompleted: false,
      },
      {
        id: 'obj-9-2',
        description: 'Discover all Pluto facts',
        type: 'discover-fact',
        target: '4',
        isCompleted: false,
      },
      {
        id: 'obj-9-3',
        description: 'Answer 5 commander-level questions',
        type: 'answer-quiz',
        target: '5',
        isCompleted: false,
      },
    ],
    reward: 12,
    timeLimit: 480,
    difficulty: 'commander',
    isCompleted: false,
    unlockRequirement: 35,
  },
  {
    id: 'mission-10',
    name: 'Grand Tour',
    description: 'The ultimate mission: visit every planet in the solar system!',
    targetPlanet: 'neptune',
    objectives: [
      {
        id: 'obj-10-1',
        description: 'Visit all 8 planets',
        type: 'visit-planet',
        target: '8',
        isCompleted: false,
      },
      {
        id: 'obj-10-2',
        description: 'Discover 20 total facts',
        type: 'discover-fact',
        target: '20',
        isCompleted: false,
      },
      {
        id: 'obj-10-3',
        description: 'Answer 8 quiz questions correctly',
        type: 'answer-quiz',
        target: '8',
        isCompleted: false,
      },
    ],
    reward: 20,
    timeLimit: 600,
    difficulty: 'commander',
    isCompleted: false,
    unlockRequirement: 45,
  },
];

// Helper functions
export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id);
}

export function getUnlockedMissions(totalStars: number): Mission[] {
  return MISSIONS.filter(m => (m.unlockRequirement ?? 0) <= totalStars);
}

export function getMissionsByDifficulty(difficulty: Mission['difficulty']): Mission[] {
  return MISSIONS.filter(m => m.difficulty === difficulty);
}

export function getNextMissionToUnlock(totalStars: number): Mission | undefined {
  const locked = MISSIONS.filter(m => (m.unlockRequirement ?? 0) > totalStars);
  return locked.sort((a, b) => (a.unlockRequirement ?? 0) - (b.unlockRequirement ?? 0))[0];
}

export function getIncompleteMissions(completedIds: string[]): Mission[] {
  return MISSIONS.filter(m => !completedIds.includes(m.id));
}
