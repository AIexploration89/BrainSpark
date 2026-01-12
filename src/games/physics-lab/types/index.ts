// Physics Lab Types

export type GameState =
  | 'menu'
  | 'experiment-select'
  | 'playing'
  | 'paused'
  | 'results';

export type ExperimentType =
  | 'gravity'
  | 'pendulum'
  | 'ramp'
  | 'bounce'
  | 'force';

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsObject {
  id: string;
  type: 'ball' | 'block' | 'weight';
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
  radius?: number;
  width?: number;
  height?: number;
  color: string;
  elasticity: number;
  friction: number;
  isStatic: boolean;
  rotation?: number;
  angularVelocity?: number;
}

export interface Experiment {
  id: ExperimentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[];
  funFact: string;
}

export interface Challenge {
  id: number;
  experimentId: ExperimentType;
  name: string;
  description: string;
  objective: string;
  targetValue?: number;
  tolerance?: number;
  timeLimit?: number;
  stars: 1 | 2 | 3;
  unlockRequirement?: number;
}

export interface ChallengeResult {
  challengeId: number;
  experimentId: ExperimentType;
  completed: boolean;
  stars: number;
  score: number;
  timeSpent: number;
  attempts: number;
}

export interface ExperimentProgress {
  experimentId: ExperimentType;
  challengesCompleted: number;
  totalStars: number;
  timeSpent: number;
  unlocked: boolean;
}

// Gravity Experiment Types
export interface GravitySettings {
  planet: 'earth' | 'moon' | 'mars' | 'jupiter' | 'custom';
  gravityValue: number;
  showTrail: boolean;
  showVectors: boolean;
}

export const GRAVITY_VALUES: Record<string, number> = {
  earth: 9.81,
  moon: 1.62,
  mars: 3.71,
  jupiter: 24.79,
  custom: 9.81,
};

// Pendulum Experiment Types
export interface PendulumSettings {
  length: number;
  mass: number;
  angle: number;
  damping: number;
  showEnergy: boolean;
}

export interface PendulumState {
  angle: number;
  angularVelocity: number;
  potentialEnergy: number;
  kineticEnergy: number;
}

// Ramp Experiment Types
export interface RampSettings {
  angle: number;
  friction: number;
  objectMass: number;
  showForces: boolean;
}

// Bounce Experiment Types
export interface BounceSettings {
  elasticity: number;
  gravity: number;
  numberOfBalls: number;
  showEnergy: boolean;
}

// Force Experiment Types
export interface ForceSettings {
  objectMass: number;
  showVectors: boolean;
  frictionEnabled: boolean;
  friction: number;
}

export interface AppliedForce {
  direction: Vector2D;
  magnitude: number;
}

// Trail point for motion visualization
export interface TrailPoint {
  x: number;
  y: number;
  time: number;
  opacity: number;
}

// Physics constants
export const PHYSICS_CONSTANTS = {
  PIXELS_PER_METER: 50,
  TIME_SCALE: 1,
  MAX_VELOCITY: 500,
  GROUND_Y: 450,
  AIR_RESISTANCE: 0.001,
} as const;
