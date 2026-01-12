import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  ExperimentType,
  Experiment,
  Challenge,
  ChallengeResult,
  ExperimentProgress,
  GravitySettings,
  PendulumSettings,
  RampSettings,
  BounceSettings,
  ForceSettings,
} from '../types';
import { getExperiment } from '../data/experiments';

interface PhysicsLabStore {
  // Game state
  gameState: GameState;
  currentExperiment: Experiment | null;
  currentChallenge: Challenge | null;
  isSandboxMode: boolean;

  // Experiment settings
  gravitySettings: GravitySettings;
  pendulumSettings: PendulumSettings;
  rampSettings: RampSettings;
  bounceSettings: BounceSettings;
  forceSettings: ForceSettings;

  // Simulation state
  isSimulationRunning: boolean;
  simulationSpeed: number;

  // Current session stats
  sessionScore: number;
  sessionTime: number;
  attempts: number;

  // Actions
  setGameState: (state: GameState) => void;
  selectExperiment: (experiment: Experiment) => void;
  selectChallenge: (challenge: Challenge) => void;
  startSandboxMode: (experimentId: ExperimentType) => void;

  // Settings actions
  updateGravitySettings: (settings: Partial<GravitySettings>) => void;
  updatePendulumSettings: (settings: Partial<PendulumSettings>) => void;
  updateRampSettings: (settings: Partial<RampSettings>) => void;
  updateBounceSettings: (settings: Partial<BounceSettings>) => void;
  updateForceSettings: (settings: Partial<ForceSettings>) => void;

  // Simulation controls
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;

  // Game controls
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  completeChallenge: (result: Omit<ChallengeResult, 'challengeId' | 'experimentId'>) => void;
}

interface PhysicsProgressStore {
  experimentProgress: Record<ExperimentType, ExperimentProgress>;
  challengeResults: Record<number, ChallengeResult>;
  totalStars: number;
  totalScore: number;

  updateChallengeResult: (result: ChallengeResult) => void;
  isExperimentUnlocked: (experimentId: ExperimentType) => boolean;
  isChallengeUnlocked: (challengeId: number) => boolean;
  getChallengeStars: (challengeId: number) => number;
  getExperimentStars: (experimentId: ExperimentType) => number;
}

const DEFAULT_GRAVITY_SETTINGS: GravitySettings = {
  planet: 'earth',
  gravityValue: 9.81,
  showTrail: true,
  showVectors: false,
};

const DEFAULT_PENDULUM_SETTINGS: PendulumSettings = {
  length: 200,
  mass: 1,
  angle: 45,
  damping: 0.01,
  showEnergy: false,
};

const DEFAULT_RAMP_SETTINGS: RampSettings = {
  angle: 30,
  friction: 0.1,
  objectMass: 1,
  showForces: false,
};

const DEFAULT_BOUNCE_SETTINGS: BounceSettings = {
  elasticity: 0.8,
  gravity: 9.81,
  numberOfBalls: 1,
  showEnergy: false,
};

const DEFAULT_FORCE_SETTINGS: ForceSettings = {
  objectMass: 1,
  showVectors: true,
  frictionEnabled: false,
  friction: 0.2,
};

export const usePhysicsLabStore = create<PhysicsLabStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  currentExperiment: null,
  currentChallenge: null,
  isSandboxMode: false,

  // Default settings
  gravitySettings: DEFAULT_GRAVITY_SETTINGS,
  pendulumSettings: DEFAULT_PENDULUM_SETTINGS,
  rampSettings: DEFAULT_RAMP_SETTINGS,
  bounceSettings: DEFAULT_BOUNCE_SETTINGS,
  forceSettings: DEFAULT_FORCE_SETTINGS,

  // Simulation state
  isSimulationRunning: false,
  simulationSpeed: 1,

  // Session stats
  sessionScore: 0,
  sessionTime: 0,
  attempts: 0,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  selectExperiment: (experiment) => {
    set({
      currentExperiment: experiment,
      currentChallenge: null,
      isSandboxMode: false,
      gameState: 'experiment-select',
      isSimulationRunning: false,
      sessionScore: 0,
      sessionTime: 0,
      attempts: 0,
    });
  },

  selectChallenge: (challenge) => {
    const experiment = getExperiment(challenge.experimentId);
    set({
      currentExperiment: experiment || null,
      currentChallenge: challenge,
      isSandboxMode: false,
      gameState: 'playing',
      isSimulationRunning: false,
      attempts: get().attempts + 1,
    });
  },

  startSandboxMode: (experimentId) => {
    const experiment = getExperiment(experimentId);
    set({
      currentExperiment: experiment || null,
      currentChallenge: null,
      isSandboxMode: true,
      gameState: 'playing',
      isSimulationRunning: false,
    });
  },

  // Settings updates
  updateGravitySettings: (settings) => {
    set((state) => ({
      gravitySettings: { ...state.gravitySettings, ...settings },
    }));
  },

  updatePendulumSettings: (settings) => {
    set((state) => ({
      pendulumSettings: { ...state.pendulumSettings, ...settings },
    }));
  },

  updateRampSettings: (settings) => {
    set((state) => ({
      rampSettings: { ...state.rampSettings, ...settings },
    }));
  },

  updateBounceSettings: (settings) => {
    set((state) => ({
      bounceSettings: { ...state.bounceSettings, ...settings },
    }));
  },

  updateForceSettings: (settings) => {
    set((state) => ({
      forceSettings: { ...state.forceSettings, ...settings },
    }));
  },

  // Simulation controls
  startSimulation: () => set({ isSimulationRunning: true }),
  pauseSimulation: () => set({ isSimulationRunning: false }),
  resetSimulation: () => set({ isSimulationRunning: false }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  // Game controls
  pauseGame: () => {
    const { gameState } = get();
    if (gameState === 'playing') {
      set({
        gameState: 'paused',
        isSimulationRunning: false,
      });
    }
  },

  resumeGame: () => {
    const { gameState } = get();
    if (gameState === 'paused') {
      set({ gameState: 'playing' });
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      currentExperiment: null,
      currentChallenge: null,
      isSandboxMode: false,
      isSimulationRunning: false,
      sessionScore: 0,
      sessionTime: 0,
      attempts: 0,
      gravitySettings: DEFAULT_GRAVITY_SETTINGS,
      pendulumSettings: DEFAULT_PENDULUM_SETTINGS,
      rampSettings: DEFAULT_RAMP_SETTINGS,
      bounceSettings: DEFAULT_BOUNCE_SETTINGS,
      forceSettings: DEFAULT_FORCE_SETTINGS,
    });
  },

  completeChallenge: (result) => {
    const { currentChallenge, currentExperiment } = get();
    if (!currentChallenge || !currentExperiment) return;

    set({
      gameState: 'results',
      sessionScore: result.score,
      sessionTime: result.timeSpent,
    });
  },
}));

// Progress store with persistence
export const usePhysicsProgressStore = create<PhysicsProgressStore>()(
  persist(
    (set, get) => ({
      experimentProgress: {
        gravity: {
          experimentId: 'gravity',
          challengesCompleted: 0,
          totalStars: 0,
          timeSpent: 0,
          unlocked: true,
        },
        pendulum: {
          experimentId: 'pendulum',
          challengesCompleted: 0,
          totalStars: 0,
          timeSpent: 0,
          unlocked: true,
        },
        ramp: {
          experimentId: 'ramp',
          challengesCompleted: 0,
          totalStars: 0,
          timeSpent: 0,
          unlocked: false,
        },
        bounce: {
          experimentId: 'bounce',
          challengesCompleted: 0,
          totalStars: 0,
          timeSpent: 0,
          unlocked: true,
        },
        force: {
          experimentId: 'force',
          challengesCompleted: 0,
          totalStars: 0,
          timeSpent: 0,
          unlocked: false,
        },
      },
      challengeResults: {},
      totalStars: 0,
      totalScore: 0,

      updateChallengeResult: (result) => {
        const { challengeResults, experimentProgress } = get();
        const existing = challengeResults[result.challengeId];

        // Only update if better result
        if (!existing || result.stars > existing.stars) {
          const starDiff = result.stars - (existing?.stars || 0);
          const scoreDiff = result.score - (existing?.score || 0);

          // Update experiment progress
          const expProgress = experimentProgress[result.experimentId];
          const updatedExpProgress = {
            ...expProgress,
            totalStars: expProgress.totalStars + starDiff,
            challengesCompleted: existing
              ? expProgress.challengesCompleted
              : expProgress.challengesCompleted + 1,
            timeSpent: expProgress.timeSpent + result.timeSpent,
          };

          // Check if we should unlock harder experiments
          const newProgress = { ...experimentProgress };
          newProgress[result.experimentId] = updatedExpProgress;

          // Unlock ramp after 3 stars in gravity or pendulum
          if (
            (result.experimentId === 'gravity' || result.experimentId === 'pendulum') &&
            updatedExpProgress.totalStars >= 3
          ) {
            newProgress.ramp = { ...newProgress.ramp, unlocked: true };
          }

          // Unlock force after 3 stars in ramp
          if (result.experimentId === 'ramp' && updatedExpProgress.totalStars >= 3) {
            newProgress.force = { ...newProgress.force, unlocked: true };
          }

          set({
            challengeResults: {
              ...challengeResults,
              [result.challengeId]: result,
            },
            experimentProgress: newProgress,
            totalStars: get().totalStars + starDiff,
            totalScore: get().totalScore + scoreDiff,
          });
        }
      },

      isExperimentUnlocked: (experimentId) => {
        return get().experimentProgress[experimentId]?.unlocked ?? false;
      },

      isChallengeUnlocked: (challengeId) => {
        // First challenge of each experiment is always unlocked
        const firstChallengeIds = [1, 6, 10, 15, 19];
        if (firstChallengeIds.includes(challengeId)) return true;

        // Check if previous challenge was completed
        const { challengeResults } = get();
        // This is a simplified check - in real implementation would check unlock requirements
        return challengeId > 1 && challengeResults[challengeId - 1]?.completed;
      },

      getChallengeStars: (challengeId) => {
        return get().challengeResults[challengeId]?.stars || 0;
      },

      getExperimentStars: (experimentId) => {
        return get().experimentProgress[experimentId]?.totalStars || 0;
      },
    }),
    {
      name: 'physics-lab-progress',
    }
  )
);
