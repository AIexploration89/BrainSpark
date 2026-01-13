import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  PuzzleMode,
  Level,
  LevelResults,
  LevelProgress,
  SlidingTile,
  PatternCard,
  SequenceItem,
  JigsawPiece,
  PatternShape,
  PatternColor,
} from '../types';

// ==================== Game Store (Ephemeral State) ====================

interface PuzzleGameState {
  // Core state
  gameState: GameState;
  currentMode: PuzzleMode | null;
  currentLevel: Level | null;
  lastResults: LevelResults | null;

  // Time tracking
  startTime: number;
  elapsedTime: number;
  timerInterval: ReturnType<typeof setInterval> | null;

  // Move tracking
  moves: number;
  hintsUsed: number;

  // Sliding puzzle state
  slidingTiles: SlidingTile[];
  emptyPosition: number;

  // Pattern match state
  patternCards: PatternCard[];
  flippedCards: number[];
  matchedPairs: number;

  // Sequence state
  sequenceItems: SequenceItem[];
  currentAnswer: number;
  correctAnswers: number;

  // Jigsaw state
  jigsawPieces: JigsawPiece[];
  selectedPiece: number | null;
  placedPieces: number;

  // Actions
  setGameState: (state: GameState) => void;
  selectMode: (mode: PuzzleMode) => void;
  selectLevel: (level: Level) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  useHint: () => void;

  // Sliding puzzle actions
  initSlidingPuzzle: (gridSize: number) => void;
  moveTile: (position: number) => boolean;
  checkSlidingComplete: () => boolean;

  // Pattern match actions
  initPatternMatch: (pairs: number, shapes: PatternShape[], colors: PatternColor[]) => void;
  flipCard: (cardId: number) => void;
  checkPatternMatch: () => boolean;

  // Sequence actions
  initSequence: (length: number, hiddenCount: number, type: string) => void;
  submitSequenceAnswer: (answer: string | number) => boolean;

  // Jigsaw actions
  initJigsaw: (pieceCount: number, theme: string) => void;
  selectJigsawPiece: (pieceId: number) => void;
  placeJigsawPiece: (targetPosition: { x: number; y: number }) => boolean;

  // Complete game
  completeLevel: (completed: boolean) => void;
}

export const usePuzzleGameStore = create<PuzzleGameState>()((set, get) => ({
  // Initial state
  gameState: 'menu',
  currentMode: null,
  currentLevel: null,
  lastResults: null,
  startTime: 0,
  elapsedTime: 0,
  timerInterval: null,
  moves: 0,
  hintsUsed: 0,

  // Sliding puzzle initial state
  slidingTiles: [],
  emptyPosition: 0,

  // Pattern match initial state
  patternCards: [],
  flippedCards: [],
  matchedPairs: 0,

  // Sequence initial state
  sequenceItems: [],
  currentAnswer: 0,
  correctAnswers: 0,

  // Jigsaw initial state
  jigsawPieces: [],
  selectedPiece: null,
  placedPieces: 0,

  // Core actions
  setGameState: (state) => set({ gameState: state }),

  selectMode: (mode) => set({ currentMode: mode, gameState: 'level-select' }),

  selectLevel: (level) => {
    const state = get();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }

    set({
      currentLevel: level,
      gameState: 'countdown',
      moves: 0,
      hintsUsed: 0,
      elapsedTime: 0,
      startTime: 0,
      timerInterval: null,
      lastResults: null,
    });

    // Initialize puzzle based on mode
    const { currentMode } = get();
    if (currentMode === 'sliding' && level.gridSize) {
      get().initSlidingPuzzle(level.gridSize);
    } else if (currentMode === 'pattern-match' && level.pairs) {
      get().initPatternMatch(level.pairs, level.shapes || [], level.colors || []);
    } else if (currentMode === 'sequence' && level.sequenceLength) {
      get().initSequence(level.sequenceLength, level.hiddenCount || 1, level.sequenceType || 'numbers');
    } else if (currentMode === 'jigsaw' && level.pieceCount) {
      get().initJigsaw(level.pieceCount, level.imageTheme || 'geometric');
    }
  },

  resetGame: () => {
    const state = get();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }
    set({
      gameState: 'menu',
      currentMode: null,
      currentLevel: null,
      lastResults: null,
      startTime: 0,
      elapsedTime: 0,
      timerInterval: null,
      moves: 0,
      hintsUsed: 0,
      slidingTiles: [],
      patternCards: [],
      flippedCards: [],
      matchedPairs: 0,
      sequenceItems: [],
      currentAnswer: 0,
      correctAnswers: 0,
      jigsawPieces: [],
      selectedPiece: null,
      placedPieces: 0,
    });
  },

  pauseGame: () => {
    get().stopTimer();
    set({ gameState: 'paused' });
  },

  resumeGame: () => {
    set({ gameState: 'playing' });
    get().startTimer();
  },

  startTimer: () => {
    const state = get();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }

    const startTime = Date.now() - state.elapsedTime * 1000;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      set({ elapsedTime: elapsed });

      // Check time limit
      const { currentLevel } = get();
      if (currentLevel?.timeLimit && elapsed >= currentLevel.timeLimit) {
        get().completeLevel(false);
      }
    }, 100);

    set({ startTime, timerInterval: interval });
  },

  stopTimer: () => {
    const state = get();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      set({ timerInterval: null });
    }
  },

  useHint: () => {
    const { currentLevel, hintsUsed } = get();
    if (currentLevel && hintsUsed < (currentLevel.hints || 0)) {
      set({ hintsUsed: hintsUsed + 1 });
      // Hint logic is handled by individual puzzle components
    }
  },

  // ==================== SLIDING PUZZLE ====================
  initSlidingPuzzle: (gridSize) => {
    const totalTiles = gridSize * gridSize;
    const tiles: SlidingTile[] = [];

    // Create solved state
    for (let i = 0; i < totalTiles; i++) {
      tiles.push({
        id: i,
        value: i === totalTiles - 1 ? null : i + 1,
        position: i,
        isCorrect: true,
      });
    }

    // Shuffle tiles (ensure solvable)
    const shuffled = shuffleSlidingPuzzle(tiles, gridSize);

    // Find empty position
    const emptyPos = shuffled.findIndex((t) => t.value === null);

    set({
      slidingTiles: shuffled,
      emptyPosition: emptyPos,
    });
  },

  moveTile: (position) => {
    const { slidingTiles, emptyPosition, currentLevel } = get();
    if (!currentLevel?.gridSize) return false;

    const gridSize = currentLevel.gridSize;
    const row = Math.floor(position / gridSize);
    const col = position % gridSize;
    const emptyRow = Math.floor(emptyPosition / gridSize);
    const emptyCol = emptyPosition % gridSize;

    // Check if adjacent to empty
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (!isAdjacent) return false;

    // Swap tiles
    const newTiles = [...slidingTiles];
    const clickedTile = newTiles.find((t) => t.position === position);
    const emptyTile = newTiles.find((t) => t.position === emptyPosition);

    if (clickedTile && emptyTile) {
      clickedTile.position = emptyPosition;
      emptyTile.position = position;

      // Update isCorrect
      newTiles.forEach((tile) => {
        if (tile.value === null) {
          tile.isCorrect = tile.position === gridSize * gridSize - 1;
        } else {
          tile.isCorrect = tile.position === tile.value - 1;
        }
      });

      set({
        slidingTiles: newTiles,
        emptyPosition: position,
        moves: get().moves + 1,
      });

      // Check completion
      if (get().checkSlidingComplete()) {
        get().completeLevel(true);
      }

      return true;
    }

    return false;
  },

  checkSlidingComplete: () => {
    const { slidingTiles } = get();
    return slidingTiles.every((tile) => tile.isCorrect);
  },

  // ==================== PATTERN MATCH ====================
  initPatternMatch: (pairs, shapes, colors) => {
    const cards: PatternCard[] = [];
    const usedCombos: Set<string> = new Set();

    // Generate unique shape/color combinations for pairs
    for (let i = 0; i < pairs; i++) {
      let shape: PatternShape;
      let color: PatternColor;
      let combo: string;

      do {
        shape = shapes[Math.floor(Math.random() * shapes.length)];
        color = colors[Math.floor(Math.random() * colors.length)];
        combo = `${shape}-${color}`;
      } while (usedCombos.has(combo) && usedCombos.size < shapes.length * colors.length);

      usedCombos.add(combo);

      // Add pair of cards
      cards.push({
        id: i * 2,
        shape,
        color,
        isFlipped: false,
        isMatched: false,
      });
      cards.push({
        id: i * 2 + 1,
        shape,
        color,
        isFlipped: false,
        isMatched: false,
      });
    }

    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    set({
      patternCards: cards,
      flippedCards: [],
      matchedPairs: 0,
    });
  },

  flipCard: (cardId) => {
    const { patternCards, flippedCards, matchedPairs, currentLevel } = get();
    const card = patternCards.find((c) => c.id === cardId);

    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newCards = patternCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));

    const newFlipped = [...flippedCards, cardId];

    set({
      patternCards: newCards,
      flippedCards: newFlipped,
      moves: get().moves + 1,
    });

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const card1 = newCards.find((c) => c.id === first);
      const card2 = newCards.find((c) => c.id === second);

      if (card1 && card2 && card1.shape === card2.shape && card1.color === card2.color) {
        // Match found
        setTimeout(() => {
          set({
            patternCards: get().patternCards.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c
            ),
            flippedCards: [],
            matchedPairs: matchedPairs + 1,
          });

          // Check completion
          if (matchedPairs + 1 === (currentLevel?.pairs || 0)) {
            get().completeLevel(true);
          }
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          set({
            patternCards: get().patternCards.map((c) =>
              c.id === first || c.id === second ? { ...c, isFlipped: false } : c
            ),
            flippedCards: [],
          });
        }, 1000);
      }
    }
  },

  checkPatternMatch: () => {
    const { patternCards } = get();
    return patternCards.every((card) => card.isMatched);
  },

  // ==================== SEQUENCE PUZZLE ====================
  initSequence: (length, hiddenCount, type) => {
    const items: SequenceItem[] = [];
    const sequenceType = type as 'numbers' | 'shapes' | 'colors' | 'mixed';

    // Generate sequence based on type
    if (sequenceType === 'numbers' || sequenceType === 'mixed') {
      // Arithmetic sequence
      const start = Math.floor(Math.random() * 5) + 1;
      const step = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < length; i++) {
        items.push({
          id: i,
          value: start + i * step,
          type: 'number',
          isHidden: false,
          isAnswer: false,
        });
      }
    } else if (sequenceType === 'shapes') {
      const shapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
      const patternLength = Math.floor(Math.random() * 2) + 2; // 2-3 shape pattern
      const pattern = shapes.slice(0, patternLength);

      for (let i = 0; i < length; i++) {
        items.push({
          id: i,
          value: pattern[i % patternLength],
          type: 'shape',
          isHidden: false,
          isAnswer: false,
        });
      }
    } else if (sequenceType === 'colors') {
      const colors = ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange'];
      const patternLength = Math.floor(Math.random() * 2) + 2;
      const pattern = colors.slice(0, patternLength);

      for (let i = 0; i < length; i++) {
        items.push({
          id: i,
          value: pattern[i % patternLength],
          type: 'color',
          isHidden: false,
          isAnswer: false,
        });
      }
    }

    // Hide random items (not first or last)
    const hiddenIndices: number[] = [];
    while (hiddenIndices.length < hiddenCount) {
      const idx = Math.floor(Math.random() * (length - 2)) + 1;
      if (!hiddenIndices.includes(idx)) {
        hiddenIndices.push(idx);
      }
    }

    hiddenIndices.forEach((idx) => {
      items[idx].isHidden = true;
      items[idx].isAnswer = true;
    });

    set({
      sequenceItems: items,
      currentAnswer: 0,
      correctAnswers: 0,
    });
  },

  submitSequenceAnswer: (answer) => {
    const { sequenceItems, correctAnswers } = get();
    const hiddenItems = sequenceItems.filter((item) => item.isAnswer);
    const currentItem = hiddenItems[get().currentAnswer];

    if (!currentItem) return false;

    const isCorrect = String(currentItem.value) === String(answer);

    if (isCorrect) {
      const newItems = sequenceItems.map((item) =>
        item.id === currentItem.id ? { ...item, isHidden: false } : item
      );

      const newCorrect = correctAnswers + 1;
      const nextAnswer = get().currentAnswer + 1;

      set({
        sequenceItems: newItems,
        correctAnswers: newCorrect,
        currentAnswer: nextAnswer,
        moves: get().moves + 1,
      });

      // Check completion
      if (newCorrect === hiddenItems.length) {
        get().completeLevel(true);
      }
    } else {
      set({ moves: get().moves + 1 });
    }

    return isCorrect;
  },

  // ==================== JIGSAW PUZZLE ====================
  initJigsaw: (pieceCount, _theme) => {
    const pieces: JigsawPiece[] = [];
    const cols = Math.ceil(Math.sqrt(pieceCount));

    for (let i = 0; i < pieceCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      pieces.push({
        id: i,
        shape: `piece-${i}`,
        correctPosition: { x: col * 100, y: row * 100 },
        currentPosition: null,
        rotation: 0,
        isPlaced: false,
      });
    }

    // Shuffle start positions (in tray area)
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach((piece, idx) => {
      piece.currentPosition = {
        x: 50 + (idx % 4) * 80,
        y: 400 + Math.floor(idx / 4) * 80,
      };
    });

    set({
      jigsawPieces: shuffledPieces,
      selectedPiece: null,
      placedPieces: 0,
    });
  },

  selectJigsawPiece: (pieceId) => {
    const { jigsawPieces, selectedPiece } = get();
    const piece = jigsawPieces.find((p) => p.id === pieceId);

    if (!piece || piece.isPlaced) return;

    set({ selectedPiece: selectedPiece === pieceId ? null : pieceId });
  },

  placeJigsawPiece: (targetPosition) => {
    const { jigsawPieces, selectedPiece, currentLevel } = get();

    if (selectedPiece === null) return false;

    const piece = jigsawPieces.find((p) => p.id === selectedPiece);
    if (!piece) return false;

    // Check if close enough to correct position (within 30px)
    const dx = Math.abs(targetPosition.x - piece.correctPosition.x);
    const dy = Math.abs(targetPosition.y - piece.correctPosition.y);

    if (dx < 30 && dy < 30) {
      // Snap to correct position
      const newPieces = jigsawPieces.map((p) =>
        p.id === selectedPiece
          ? { ...p, currentPosition: piece.correctPosition, isPlaced: true }
          : p
      );

      const newPlaced = get().placedPieces + 1;

      set({
        jigsawPieces: newPieces,
        selectedPiece: null,
        placedPieces: newPlaced,
        moves: get().moves + 1,
      });

      // Check completion
      if (newPlaced === (currentLevel?.pieceCount || 0)) {
        get().completeLevel(true);
      }

      return true;
    } else {
      // Just move piece
      const newPieces = jigsawPieces.map((p) =>
        p.id === selectedPiece ? { ...p, currentPosition: targetPosition } : p
      );

      set({
        jigsawPieces: newPieces,
        moves: get().moves + 1,
      });

      return false;
    }
  },

  // ==================== COMPLETE LEVEL ====================
  completeLevel: (completed) => {
    get().stopTimer();

    const { currentMode, currentLevel, elapsedTime, moves, hintsUsed } = get();
    if (!currentMode || !currentLevel) return;

    // Calculate score
    const baseScore = completed ? 1000 : 0;
    const timeBonus = currentLevel.timeLimit
      ? Math.max(0, Math.floor(((currentLevel.timeLimit - elapsedTime) / currentLevel.timeLimit) * 500))
      : 200;
    const moveBonus = Math.max(0, 300 - moves * 5);
    const hintPenalty = hintsUsed * 100;

    const score = Math.max(0, baseScore + timeBonus + moveBonus - hintPenalty);

    // Calculate stars
    let stars = 0;
    const optimalScore = 1500;
    const scoreRatio = score / optimalScore;

    if (scoreRatio >= 0.9) stars = 3;
    else if (scoreRatio >= 0.6) stars = 2;
    else if (completed) stars = 1;

    // Calculate accuracy
    const accuracy = completed ? Math.min(100, Math.round((1 - hintsUsed / (currentLevel.hints || 1)) * 100)) : 0;

    const results: LevelResults = {
      levelId: currentLevel.id,
      mode: currentMode,
      completed,
      score,
      stars,
      time: elapsedTime,
      moves,
      hintsUsed,
      accuracy,
    };

    set({
      gameState: completed ? 'results' : 'failed',
      lastResults: results,
    });
  },
}));

// ==================== Progress Store (Persistent) ====================

interface PuzzleProgressState {
  levelProgress: LevelProgress[];
  totalScore: number;
  puzzleRank: string;

  updateLevelProgress: (results: LevelResults) => void;
  getLevelProgress: (mode: PuzzleMode, levelId: number) => LevelProgress | undefined;
  getModeProgress: (mode: PuzzleMode) => { completed: number; total: number; stars: number };
  isLevelUnlocked: (mode: PuzzleMode, levelId: number) => boolean;
  resetProgress: () => void;
}

const PUZZLE_RANKS = [
  { minScore: 0, name: 'Puzzle Rookie' },
  { minScore: 5000, name: 'Piece Finder' },
  { minScore: 15000, name: 'Pattern Spotter' },
  { minScore: 30000, name: 'Puzzle Solver' },
  { minScore: 50000, name: 'Brain Bender' },
  { minScore: 75000, name: 'Logic Master' },
  { minScore: 100000, name: 'Puzzle Champion' },
  { minScore: 150000, name: 'Legendary Puzzler' },
];

export const usePuzzleProgressStore = create<PuzzleProgressState>()(
  persist(
    (set, get) => ({
      levelProgress: [],
      totalScore: 0,
      puzzleRank: 'Puzzle Rookie',

      updateLevelProgress: (results) => {
        const { levelProgress, totalScore } = get();

        const existing = levelProgress.find(
          (p) => p.levelId === results.levelId && p.mode === results.mode
        );

        let newProgress: LevelProgress[];
        let scoreDiff = results.score;

        if (existing) {
          // Update only if better
          const newBestScore = Math.max(existing.bestScore, results.score);
          const newBestStars = Math.max(existing.bestStars, results.stars);
          const newBestTime =
            existing.bestTime === 0
              ? results.time
              : Math.min(existing.bestTime, results.time);

          scoreDiff = newBestScore - existing.bestScore;

          newProgress = levelProgress.map((p) =>
            p.levelId === results.levelId && p.mode === results.mode
              ? {
                  ...p,
                  completed: p.completed || results.completed,
                  bestScore: newBestScore,
                  bestStars: newBestStars,
                  bestTime: newBestTime,
                  attempts: p.attempts + 1,
                }
              : p
          );
        } else {
          newProgress = [
            ...levelProgress,
            {
              levelId: results.levelId,
              mode: results.mode,
              completed: results.completed,
              bestScore: results.score,
              bestStars: results.stars,
              bestTime: results.time,
              attempts: 1,
            },
          ];
        }

        const newTotalScore = totalScore + scoreDiff;
        const newRank =
          [...PUZZLE_RANKS].reverse().find((r) => newTotalScore >= r.minScore)?.name ||
          'Puzzle Rookie';

        set({
          levelProgress: newProgress,
          totalScore: newTotalScore,
          puzzleRank: newRank,
        });
      },

      getLevelProgress: (mode, levelId) => {
        return get().levelProgress.find((p) => p.mode === mode && p.levelId === levelId);
      },

      getModeProgress: (mode) => {
        const modeProgress = get().levelProgress.filter((p) => p.mode === mode);
        return {
          completed: modeProgress.filter((p) => p.completed).length,
          total: 8, // Each mode has 8 levels
          stars: modeProgress.reduce((sum, p) => sum + p.bestStars, 0),
        };
      },

      isLevelUnlocked: (mode, levelId) => {
        if (levelId === 1) return true;
        const prevProgress = get().getLevelProgress(mode, levelId - 1);
        return prevProgress?.completed === true;
      },

      resetProgress: () => {
        set({
          levelProgress: [],
          totalScore: 0,
          puzzleRank: 'Puzzle Rookie',
        });
      },
    }),
    {
      name: 'puzzle-world-progress',
    }
  )
);

// ==================== HELPER FUNCTIONS ====================

// Fisher-Yates shuffle for sliding puzzle (ensuring solvability)
function shuffleSlidingPuzzle(tiles: SlidingTile[], gridSize: number): SlidingTile[] {
  const shuffled = [...tiles];
  const totalTiles = gridSize * gridSize;

  // Perform random valid moves to shuffle
  let emptyPos = totalTiles - 1;
  const moves = totalTiles * 50; // Number of random moves

  for (let i = 0; i < moves; i++) {
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;

    const possibleMoves: number[] = [];

    if (emptyRow > 0) possibleMoves.push(emptyPos - gridSize); // Up
    if (emptyRow < gridSize - 1) possibleMoves.push(emptyPos + gridSize); // Down
    if (emptyCol > 0) possibleMoves.push(emptyPos - 1); // Left
    if (emptyCol < gridSize - 1) possibleMoves.push(emptyPos + 1); // Right

    const movePos = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // Swap
    const moveTile = shuffled.find((t) => t.position === movePos);
    const emptyTile = shuffled.find((t) => t.position === emptyPos);

    if (moveTile && emptyTile) {
      moveTile.position = emptyPos;
      emptyTile.position = movePos;
      emptyPos = movePos;
    }
  }

  // Update isCorrect for all tiles
  shuffled.forEach((tile) => {
    if (tile.value === null) {
      tile.isCorrect = tile.position === totalTiles - 1;
    } else {
      tile.isCorrect = tile.position === tile.value - 1;
    }
  });

  return shuffled;
}
