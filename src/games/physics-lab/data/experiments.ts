import type { Experiment, Challenge, ExperimentType } from '../types';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'gravity',
    name: 'Gravity Drop',
    description: 'Drop objects and watch gravity pull them down! Compare how things fall on different planets.',
    icon: '🍎',
    color: 'cyan',
    difficulty: 'easy',
    concepts: ['Gravity', 'Free Fall', 'Acceleration'],
    funFact: 'On the Moon, you could jump 6 times higher than on Earth!',
  },
  {
    id: 'pendulum',
    name: 'Pendulum Swing',
    description: 'Swing a pendulum and discover the rhythm of motion! Change the length and see what happens.',
    icon: '🎯',
    color: 'pink',
    difficulty: 'easy',
    concepts: ['Oscillation', 'Period', 'Energy Transfer'],
    funFact: 'Galileo discovered pendulum motion by watching a swinging lamp in church!',
  },
  {
    id: 'ramp',
    name: 'Ramp Roller',
    description: 'Roll objects down ramps! Experiment with angles and friction to see how speed changes.',
    icon: '🛝',
    color: 'green',
    difficulty: 'medium',
    concepts: ['Inclined Planes', 'Friction', 'Potential Energy'],
    funFact: 'Ancient Egyptians used ramps to build the pyramids!',
  },
  {
    id: 'bounce',
    name: 'Bounce Lab',
    description: 'Drop bouncy balls and watch them spring back! Learn about elasticity and energy.',
    icon: '🏀',
    color: 'orange',
    difficulty: 'easy',
    concepts: ['Elasticity', 'Kinetic Energy', 'Collisions'],
    funFact: 'A super ball can bounce back to 92% of its drop height!',
  },
  {
    id: 'force',
    name: 'Force Arena',
    description: 'Push and pull objects with force! See how mass affects movement.',
    icon: '💪',
    color: 'purple',
    difficulty: 'medium',
    concepts: ["Newton's Laws", 'Force', 'Mass & Acceleration'],
    funFact: "Newton's famous equation F=ma explains why it's harder to push heavy things!",
  },
];

export const CHALLENGES: Challenge[] = [
  // Gravity Challenges
  {
    id: 1,
    experimentId: 'gravity',
    name: 'First Drop',
    description: 'Drop an apple and watch it fall!',
    objective: 'Drop any object to the ground',
    stars: 1,
  },
  {
    id: 2,
    experimentId: 'gravity',
    name: 'Moon Walker',
    description: 'Experience how gravity feels on the Moon',
    objective: 'Set gravity to Moon and drop an object',
    stars: 1,
    unlockRequirement: 1,
  },
  {
    id: 3,
    experimentId: 'gravity',
    name: 'Planet Hopper',
    description: 'Compare gravity on 3 different planets',
    objective: 'Drop objects on Earth, Moon, and Mars',
    stars: 2,
    unlockRequirement: 2,
  },
  {
    id: 4,
    experimentId: 'gravity',
    name: 'Speed Detective',
    description: 'Find out which planet makes objects fall fastest',
    objective: 'Discover that Jupiter has the strongest gravity',
    stars: 2,
    unlockRequirement: 3,
  },
  {
    id: 5,
    experimentId: 'gravity',
    name: 'Gravity Master',
    description: 'Use custom gravity to make an object land in exactly 2 seconds',
    objective: 'Set custom gravity to achieve a 2-second fall time',
    targetValue: 2000,
    tolerance: 200,
    stars: 3,
    unlockRequirement: 4,
  },

  // Pendulum Challenges
  {
    id: 6,
    experimentId: 'pendulum',
    name: 'First Swing',
    description: 'Pull the pendulum and let it swing!',
    objective: 'Complete one full swing',
    stars: 1,
  },
  {
    id: 7,
    experimentId: 'pendulum',
    name: 'Long & Short',
    description: 'Discover how length affects swing speed',
    objective: 'Compare swings with long and short pendulums',
    stars: 1,
    unlockRequirement: 6,
  },
  {
    id: 8,
    experimentId: 'pendulum',
    name: 'Energy Flow',
    description: 'Watch energy transform as the pendulum swings',
    objective: 'Enable energy view and observe the energy bars',
    stars: 2,
    unlockRequirement: 7,
  },
  {
    id: 9,
    experimentId: 'pendulum',
    name: 'Metronome Maker',
    description: 'Create a pendulum that swings once per second',
    objective: 'Adjust length to achieve a 1-second period',
    targetValue: 1000,
    tolerance: 100,
    stars: 3,
    unlockRequirement: 8,
  },

  // Ramp Challenges
  {
    id: 10,
    experimentId: 'ramp',
    name: 'Roll It!',
    description: 'Roll a ball down a ramp',
    objective: 'Release a ball and let it roll down',
    stars: 1,
  },
  {
    id: 11,
    experimentId: 'ramp',
    name: 'Steep vs Gentle',
    description: 'Compare speeds on different angles',
    objective: 'Test ramps at 15° and 45°',
    stars: 1,
    unlockRequirement: 10,
  },
  {
    id: 12,
    experimentId: 'ramp',
    name: 'Friction Factor',
    description: 'See how friction slows things down',
    objective: 'Compare smooth and rough surfaces',
    stars: 2,
    unlockRequirement: 11,
  },
  {
    id: 13,
    experimentId: 'ramp',
    name: 'Force Finder',
    description: 'Use force vectors to understand the physics',
    objective: 'Enable force display and identify gravity components',
    stars: 2,
    unlockRequirement: 12,
  },
  {
    id: 14,
    experimentId: 'ramp',
    name: 'Speed Target',
    description: 'Make the ball reach exactly 5 m/s at the bottom',
    objective: 'Adjust angle and friction to hit target speed',
    targetValue: 5,
    tolerance: 0.3,
    stars: 3,
    unlockRequirement: 13,
  },

  // Bounce Challenges
  {
    id: 15,
    experimentId: 'bounce',
    name: 'First Bounce',
    description: 'Drop a ball and watch it bounce!',
    objective: 'Drop a ball and let it bounce once',
    stars: 1,
  },
  {
    id: 16,
    experimentId: 'bounce',
    name: 'Super Bouncy',
    description: 'Make a ball bounce as high as possible',
    objective: 'Set maximum elasticity and observe',
    stars: 1,
    unlockRequirement: 15,
  },
  {
    id: 17,
    experimentId: 'bounce',
    name: 'Energy Tracker',
    description: 'Watch energy change with each bounce',
    objective: 'Enable energy view and count bounces until 50% energy lost',
    stars: 2,
    unlockRequirement: 16,
  },
  {
    id: 18,
    experimentId: 'bounce',
    name: 'Bounce Match',
    description: 'Make a ball bounce exactly 5 times',
    objective: 'Adjust elasticity for exactly 5 bounces',
    targetValue: 5,
    tolerance: 0,
    stars: 3,
    unlockRequirement: 17,
  },

  // Force Challenges
  {
    id: 19,
    experimentId: 'force',
    name: 'Push It!',
    description: 'Apply a force to move an object',
    objective: 'Push an object across the screen',
    stars: 1,
  },
  {
    id: 20,
    experimentId: 'force',
    name: 'Heavy vs Light',
    description: 'Compare how mass affects acceleration',
    objective: 'Push objects with different masses',
    stars: 1,
    unlockRequirement: 19,
  },
  {
    id: 21,
    experimentId: 'force',
    name: 'Friction Fight',
    description: 'See how friction opposes motion',
    objective: 'Enable friction and push an object until it stops',
    stars: 2,
    unlockRequirement: 20,
  },
  {
    id: 22,
    experimentId: 'force',
    name: 'Vector Vision',
    description: 'Use force vectors to plan movement',
    objective: 'Enable vectors and apply forces in different directions',
    stars: 2,
    unlockRequirement: 21,
  },
  {
    id: 23,
    experimentId: 'force',
    name: 'Precision Push',
    description: 'Move an object exactly 3 meters',
    objective: 'Use the right force to achieve target distance',
    targetValue: 3,
    tolerance: 0.2,
    stars: 3,
    unlockRequirement: 22,
  },
];

export function getExperiment(id: ExperimentType): Experiment | undefined {
  return EXPERIMENTS.find(e => e.id === id);
}

export function getChallengesForExperiment(experimentId: ExperimentType): Challenge[] {
  return CHALLENGES.filter(c => c.experimentId === experimentId);
}

export function getChallenge(id: number): Challenge | undefined {
  return CHALLENGES.find(c => c.id === id);
}

export function getNextChallenge(currentId: number, experimentId: ExperimentType): Challenge | undefined {
  const experimentChallenges = getChallengesForExperiment(experimentId);
  const currentIndex = experimentChallenges.findIndex(c => c.id === currentId);
  if (currentIndex >= 0 && currentIndex < experimentChallenges.length - 1) {
    return experimentChallenges[currentIndex + 1];
  }
  return undefined;
}

// Scoring configuration
export const SCORING = {
  BASE_POINTS: 100,
  STAR_MULTIPLIER: {
    1: 1,
    2: 1.5,
    3: 2,
  },
  TIME_BONUS_MAX: 50,
  FIRST_TRY_BONUS: 25,
} as const;
