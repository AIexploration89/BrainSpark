import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameMode,
  PlanetId,
  Planet,
  QuizQuestion,
  QuizSession,
  GameResult,
  LevelProgress,
  SpaceProgress,
  SpaceRank,
  Level,
  Mission,
} from '../types';
import { SCORING, STAR_THRESHOLDS, RANK_THRESHOLDS } from '../types';
import { getPlanetById, PLANETS } from '../data/planets';
import { getRandomQuestions, getLevelById } from '../data/quizzes';
import { getMissionById } from '../data/missions';

// ============================================================================
// GAME STORE - Current game session state
// ============================================================================

interface SpaceGameStore {
  // Game state
  gameState: GameState;
  gameMode: GameMode | null;
  currentLevel: Level | null;
  currentMission: Mission | null;

  // Exploration state
  selectedPlanet: Planet | null;
  visitedPlanets: PlanetId[];
  discoveredFacts: string[];

  // Quiz state
  quizSession: QuizSession | null;

  // Results
  lastResults: GameResult | null;

  // Actions
  setGameState: (state: GameState) => void;
  setGameMode: (mode: GameMode) => void;
  selectLevel: (level: Level) => void;
  selectMission: (mission: Mission) => void;

  // Exploration actions
  selectPlanet: (planetId: PlanetId) => void;
  closePlanetView: () => void;
  discoverFact: (factId: string) => void;

  // Quiz actions
  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;

  // Game flow
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  completeGame: () => void;
}

export const useSpaceGameStore = create<SpaceGameStore>((set, get) => ({
  // Initial state
  gameState: 'menu',
  gameMode: null,
  currentLevel: null,
  currentMission: null,
  selectedPlanet: null,
  visitedPlanets: [],
  discoveredFacts: [],
  quizSession: null,
  lastResults: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),

  setGameMode: (mode) => set({
    gameMode: mode,
    gameState: 'level-select',
  }),

  selectLevel: (level) => {
    set({
      currentLevel: level,
      gameState: 'countdown',
      visitedPlanets: [],
      discoveredFacts: [],
      quizSession: null,
    });
  },

  selectMission: (mission) => {
    // Reset mission objectives
    const resetMission = {
      ...mission,
      objectives: mission.objectives.map(obj => ({ ...obj, isCompleted: false })),
    };
    set({
      currentMission: resetMission,
      gameState: 'countdown',
      visitedPlanets: [],
      discoveredFacts: [],
    });
  },

  selectPlanet: (planetId) => {
    const planet = getPlanetById(planetId);
    if (!planet) return;

    const { visitedPlanets } = get();
    const newVisited = visitedPlanets.includes(planetId)
      ? visitedPlanets
      : [...visitedPlanets, planetId];

    set({
      selectedPlanet: planet,
      visitedPlanets: newVisited,
      gameState: 'planet-view',
    });
  },

  closePlanetView: () => {
    const { gameMode } = get();
    set({
      selectedPlanet: null,
      gameState: gameMode === 'mission' ? 'mission' : 'exploring',
    });
  },

  discoverFact: (factId) => {
    const { discoveredFacts, selectedPlanet } = get();
    if (discoveredFacts.includes(factId)) return;

    // Update the planet's fact as discovered
    if (selectedPlanet) {
      const updatedFacts = selectedPlanet.facts.map(f =>
        f.id === factId ? { ...f, isDiscovered: true } : f
      );
      set({
        discoveredFacts: [...discoveredFacts, factId],
        selectedPlanet: { ...selectedPlanet, facts: updatedFacts },
      });
    } else {
      set({ discoveredFacts: [...discoveredFacts, factId] });
    }
  },

  startQuiz: (questions) => {
    set({
      quizSession: {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        correctCount: 0,
        startTime: Date.now(),
      },
      gameState: 'quiz',
    });
  },

  answerQuestion: (answerIndex) => {
    const { quizSession } = get();
    if (!quizSession) return;

    const question = quizSession.questions[quizSession.currentIndex];
    const isCorrect = answerIndex === question.correctAnswer;

    const newAnswers = [...quizSession.answers];
    newAnswers[quizSession.currentIndex] = answerIndex;

    set({
      quizSession: {
        ...quizSession,
        answers: newAnswers,
        correctCount: isCorrect ? quizSession.correctCount + 1 : quizSession.correctCount,
      },
    });
  },

  nextQuestion: () => {
    const { quizSession } = get();
    if (!quizSession) return;

    const nextIndex = quizSession.currentIndex + 1;

    if (nextIndex >= quizSession.questions.length) {
      get().finishQuiz();
    } else {
      set({
        quizSession: {
          ...quizSession,
          currentIndex: nextIndex,
        },
      });
    }
  },

  finishQuiz: () => {
    const { quizSession, currentLevel, discoveredFacts } = get();
    if (!quizSession) return;

    const completionTime = Date.now() - quizSession.startTime;
    const accuracy = (quizSession.correctCount / quizSession.questions.length) * 100;

    // Calculate stars
    let starsEarned = 0;
    if (accuracy >= STAR_THRESHOLDS.THREE_STARS) starsEarned = 3;
    else if (accuracy >= STAR_THRESHOLDS.TWO_STARS) starsEarned = 2;
    else if (accuracy >= STAR_THRESHOLDS.ONE_STAR) starsEarned = 1;

    // Calculate score
    const baseScore = quizSession.correctCount * SCORING.QUIZ_CORRECT;
    const difficultyMultiplier = currentLevel
      ? SCORING.DIFFICULTY_MULTIPLIER[currentLevel.difficulty]
      : 1;
    const timeBonus = Math.max(0, Math.floor((300000 - completionTime) / 1000) * SCORING.TIME_BONUS_MULTIPLIER);
    const perfectBonus = accuracy === 100 ? SCORING.PERFECT_BONUS : 0;
    const score = Math.floor((baseScore + timeBonus + perfectBonus) * difficultyMultiplier);

    const results: GameResult = {
      score,
      starsEarned,
      factsDiscovered: discoveredFacts.length,
      questionsCorrect: quizSession.correctCount,
      questionsTotal: quizSession.questions.length,
      accuracy,
      timeBonus,
      completionTime,
      isPerfect: accuracy === 100,
      mode: 'quiz',
    };

    set({
      lastResults: results,
      gameState: 'results',
      quizSession: {
        ...quizSession,
        completionTime,
      },
    });
  },

  pauseGame: () => {
    const { gameState } = get();
    if (['exploring', 'planet-view', 'quiz', 'mission'].includes(gameState)) {
      set({ gameState: 'paused' });
    }
  },

  resumeGame: () => {
    const { gameMode, quizSession } = get();
    if (quizSession) {
      set({ gameState: 'quiz' });
    } else if (gameMode === 'mission') {
      set({ gameState: 'mission' });
    } else {
      set({ gameState: 'exploring' });
    }
  },

  resetGame: () => {
    set({
      gameState: 'menu',
      gameMode: null,
      currentLevel: null,
      currentMission: null,
      selectedPlanet: null,
      visitedPlanets: [],
      discoveredFacts: [],
      quizSession: null,
      lastResults: null,
    });
  },

  completeGame: () => {
    const { gameMode, visitedPlanets, discoveredFacts, currentLevel } = get();

    // For explore mode
    if (gameMode === 'explore') {
      const accuracy = (discoveredFacts.length / (visitedPlanets.length * 4)) * 100;
      let starsEarned = 0;
      if (accuracy >= STAR_THRESHOLDS.THREE_STARS) starsEarned = 3;
      else if (accuracy >= STAR_THRESHOLDS.TWO_STARS) starsEarned = 2;
      else if (accuracy >= STAR_THRESHOLDS.ONE_STAR) starsEarned = 1;

      const score = discoveredFacts.length * SCORING.FACT_DISCOVERED +
        visitedPlanets.length * 100;

      const results: GameResult = {
        score,
        starsEarned,
        factsDiscovered: discoveredFacts.length,
        questionsCorrect: 0,
        questionsTotal: 0,
        accuracy,
        timeBonus: 0,
        completionTime: 0,
        isPerfect: visitedPlanets.length === PLANETS.length,
        mode: 'explore',
      };

      set({
        lastResults: results,
        gameState: 'results',
      });
    }
  },
}));

// ============================================================================
// PROGRESS STORE - Persistent progress across sessions
// ============================================================================

interface SpaceProgressStore {
  // Progress data
  progress: SpaceProgress;
  levelProgress: Record<string, LevelProgress>;

  // Actions
  updateProgress: (results: GameResult, levelId?: string) => void;
  markFactDiscovered: (factId: string) => void;
  markPlanetVisited: (planetId: PlanetId) => void;
  markQuizPassed: (quizId: string) => void;
  markMissionCompleted: (missionId: string) => void;
  unlockPlanet: (planetId: PlanetId) => void;

  // Getters
  getTotalStars: () => number;
  getRank: () => SpaceRank;
  isPlanetUnlocked: (planetId: PlanetId) => boolean;
  isLevelUnlocked: (levelId: string) => boolean;
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
}

function calculateRank(totalStars: number): SpaceRank {
  const ranks: SpaceRank[] = ['admiral', 'commander', 'captain', 'pilot', 'navigator', 'explorer', 'cadet'];
  for (const rank of ranks) {
    if (totalStars >= RANK_THRESHOLDS[rank]) {
      return rank;
    }
  }
  return 'cadet';
}

export const useSpaceProgressStore = create<SpaceProgressStore>()(
  persist(
    (set, get) => ({
      progress: {
        totalStars: 0,
        planetsUnlocked: ['sun', 'mercury', 'earth'],
        allFactsDiscovered: [],
        quizzesPassed: [],
        missionsCompleted: [],
        currentRank: 'cadet',
        achievements: [],
      },
      levelProgress: {},

      updateProgress: (results, levelId) => {
        const { progress, levelProgress } = get();

        // Update total stars
        const newTotalStars = progress.totalStars + results.starsEarned;
        const newRank = calculateRank(newTotalStars);

        // Check for new planet unlocks
        const newPlanetsUnlocked = [...progress.planetsUnlocked];
        PLANETS.forEach(planet => {
          if (
            !newPlanetsUnlocked.includes(planet.id) &&
            (planet.unlockRequirement ?? 0) <= newTotalStars
          ) {
            newPlanetsUnlocked.push(planet.id);
          }
        });

        set({
          progress: {
            ...progress,
            totalStars: newTotalStars,
            currentRank: newRank,
            planetsUnlocked: newPlanetsUnlocked,
          },
        });

        // Update level progress if applicable
        if (levelId) {
          const currentLevelProgress = levelProgress[levelId] || {
            levelId,
            planetsVisited: [],
            factsDiscovered: [],
            quizzesPassed: [],
            missionsCompleted: [],
            highScore: 0,
            bestStars: 0,
            timesPlayed: 0,
            unlocked: true,
          };

          set({
            levelProgress: {
              ...levelProgress,
              [levelId]: {
                ...currentLevelProgress,
                highScore: Math.max(currentLevelProgress.highScore, results.score),
                bestStars: Math.max(currentLevelProgress.bestStars, results.starsEarned),
                timesPlayed: currentLevelProgress.timesPlayed + 1,
              },
            },
          });
        }
      },

      markFactDiscovered: (factId) => {
        const { progress } = get();
        if (!progress.allFactsDiscovered.includes(factId)) {
          set({
            progress: {
              ...progress,
              allFactsDiscovered: [...progress.allFactsDiscovered, factId],
            },
          });
        }
      },

      markPlanetVisited: (planetId) => {
        // This is tracked per-session in the game store
      },

      markQuizPassed: (quizId) => {
        const { progress } = get();
        if (!progress.quizzesPassed.includes(quizId)) {
          set({
            progress: {
              ...progress,
              quizzesPassed: [...progress.quizzesPassed, quizId],
            },
          });
        }
      },

      markMissionCompleted: (missionId) => {
        const { progress } = get();
        if (!progress.missionsCompleted.includes(missionId)) {
          set({
            progress: {
              ...progress,
              missionsCompleted: [...progress.missionsCompleted, missionId],
            },
          });
        }
      },

      unlockPlanet: (planetId) => {
        const { progress } = get();
        if (!progress.planetsUnlocked.includes(planetId)) {
          set({
            progress: {
              ...progress,
              planetsUnlocked: [...progress.planetsUnlocked, planetId],
            },
          });
        }
      },

      getTotalStars: () => get().progress.totalStars,

      getRank: () => get().progress.currentRank,

      isPlanetUnlocked: (planetId) => {
        const { progress } = get();
        return progress.planetsUnlocked.includes(planetId);
      },

      isLevelUnlocked: (levelId) => {
        const { progress } = get();
        const level = getLevelById(levelId);
        if (!level) return false;
        return level.unlockRequirement <= progress.totalStars;
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress[levelId];
      },
    }),
    {
      name: 'space-exploration-progress',
    }
  )
);
