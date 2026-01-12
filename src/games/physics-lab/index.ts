export { PhysicsLab } from './PhysicsLab';
export { default } from './PhysicsLab';

// Export types
export type {
  GameState,
  ExperimentType,
  Experiment,
  Challenge,
  ChallengeResult,
  ExperimentProgress,
  PhysicsObject,
  Vector2D,
  GravitySettings,
  PendulumSettings,
  RampSettings,
  BounceSettings,
  ForceSettings,
} from './types';

// Export stores
export { usePhysicsLabStore, usePhysicsProgressStore } from './stores/physicsStore';

// Export data
export { EXPERIMENTS, CHALLENGES, getExperiment, getChallengesForExperiment } from './data/experiments';
