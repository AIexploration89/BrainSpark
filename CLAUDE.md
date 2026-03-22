# BrainSpark - Project Instructions

## Overview

BrainSpark is an educational gaming platform for kids featuring interactive learning games with a cyberpunk/neon aesthetic. Built with React 19, TypeScript, TailwindCSS v4, and Framer Motion.

## Auto-Invocation: /cc-improver

**STRICT RULE:** After completing ANY task, invoke `/cc-improver` to capture learnings.

**Always invoke after:**
- Fixing errors or bugs
- Implementing new features
- Finding successful patterns
- Encountering gotchas or edge cases
- Any code changes

**Only skip for:**
- "commit" / "push" / "commit and push" requests
- Pure git operations (status, log, diff)
- Reading files without making changes

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 7
- **Styling:** TailwindCSS v4 with custom neon theme
- **Animation:** Framer Motion 12
- **State:** Zustand 5 with localStorage persistence
- **Routing:** React Router DOM 7

## Project Structure

```
src/
├── stores/              # Shared Zustand stores
│   ├── authStore.ts     # Authentication state (login, signup, logout)
│   ├── difficultyStore.ts # Adaptive difficulty system (tiers, practice mode)
│   └── difficultyHelpers.ts # Shared helpers for game store integration
├── data/
│   └── games.ts         # Centralized game definitions (single source of truth)
├── components/
│   ├── auth/            # ProtectedRoute component
│   ├── layout/          # Navbar, layout components
│   └── ui/              # Reusable UI components (Button, Card, GameCard, ChallengeBar)
├── games/               # Individual game modules (lazy-loaded via React.lazy)
│   ├── animal-kingdom/  # Animal quiz game (4 categories)
│   ├── code-quest/      # Visual block programming (30 levels)
│   ├── geography-explorer/ # Geography quiz (4 modes, 24 levels)
│   ├── history-heroes/  # History quiz (4 eras)
│   ├── math-basics/     # Math operations game (24 levels)
│   ├── memory-matrix/   # Pattern memory game (15 levels)
│   ├── physics-lab/     # Physics experiments (5 interactive labs)
│   ├── puzzle-world/    # Puzzle games (4 modes: sliding, pattern, sequence, jigsaw)
│   ├── science-explorer/# Science quiz (4 categories)
│   ├── space-exploration/# Solar system exploration + space quiz
│   ├── typing-master/   # Typing practice (multiple modes)
│   └── word-builder/    # Vocabulary and spelling game
├── pages/               # Route pages
│   ├── Dashboard.tsx
│   ├── GamePlayPage.tsx # Game router (lazy-loads games)
│   ├── GamesPage.tsx
│   ├── LandingPage.tsx
│   ├── LeaderboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ShopPage.tsx
│   └── SignupPage.tsx
└── App.tsx
```

## Game Module Pattern

Each game follows this structure:
```
games/[game-name]/
├── [GameName].tsx       # Main component with state machine
├── index.ts             # Module exports
├── types/index.ts       # TypeScript types and constants
├── data/levels.ts       # Level definitions and generators
├── stores/[name]Store.ts # Zustand stores (game state + progress)
└── components/          # Game-specific components
    ├── CountdownOverlay.tsx
    ├── PauseOverlay.tsx
    ├── ResultsScreen.tsx
    ├── LevelSelector.tsx
    └── [game-specific].tsx
```

## Adaptive Difficulty System

Kids can freely choose their challenge level via the ChallengeBar component:
- **Explorer** (easy): 50% more time, 20% fewer questions, double hints, 1x XP
- **Adventurer** (normal): Standard settings, 1x XP
- **Champion** (hard): 30% less time, 30% more questions, half hints, 1.5x XP
- **Practice Mode**: No time limits, unlimited hints, 0.5x XP

Key behaviors:
- ChallengeBar appears in every game's main menu
- Tier modifiers applied via `useDifficultyStore.getState()` in each game store's `selectLevel`
- Performance recorded after each round for adaptive suggestions (sliding window of 5 attempts)
- Suggestion algorithm: <60% accuracy → suggest Explorer, >85% → suggest Champion
- Flexible unlock: kids can access levels up to 2 levels ahead of their highest played level
- All stores use `version: 1` for localStorage migration support

Files: `src/stores/difficultyStore.ts`, `src/stores/difficultyHelpers.ts`, `src/components/ui/ChallengeBar.tsx`

## Authentication

Client-side auth via Zustand persist store:
- `src/stores/authStore.ts` - login/signup/logout with localStorage persistence
- `src/components/auth/ProtectedRoute.tsx` - redirects unauthenticated users to /login
- Dashboard, Games, Shop, Leaderboard routes are protected

## Design System

### Colors (Neon Theme)
- `neon-cyan`: #00F5FF - Primary accent
- `neon-pink`: #FF00FF - Secondary accent
- `neon-green`: #00FF88 - Success/Math
- `neon-purple`: #8B5CF6 - Physics
- `neon-orange`: #FF6B35 - Warning
- `neon-yellow`: #FFE55C - Highlight
- `neon-red`: #FF3366 - Error/danger

### Background Colors
- `bg-primary`: #0a0a0f - Main background
- `bg-secondary`: #12121a - Card backgrounds
- `bg-tertiary`: #1a1a25 - Elevated surfaces

### Typography
- Display font: Orbitron (futuristic headings)
- Body font: Inter (readable text)

## Implemented Games

### 1. Memory Matrix
- Pattern memorization with grid sizes 3x3 to 6x6
- 15 levels with progressive difficulty
- Star rating system (1-3 stars)

### 2. Code Quest
- Visual block programming
- 30 levels teaching loops, conditionals, functions
- Drag-and-drop command blocks

### 3. Physics Lab
- 5 interactive experiments:
  - Gravity Drop
  - Bounce Lab
  - Pendulum Wave
  - Ramp & Roll
  - Force Push
- Real-time physics simulation

### 4. Math Basics
- 5 operations: +, -, ×, ÷, mixed
- 24 levels (easy → expert)
- LED 7-segment display aesthetic
- Combo/streak system with multipliers

### 5. Space Exploration
- Solar system exploration with 8 planets + dwarf planets
- Orbit visualization and planet facts
- Space quiz with progressive difficulty

### 6. Geography Explorer
- 4 game modes: Flag Quiz, Capital Match, Landmark Hunter, Continent Challenge
- 24 levels across 7 continents
- ~60 countries with capitals, flags, and fun facts
- ~40 famous landmarks with descriptions
- Explorer rank progression system
- Combo/streak multipliers and star rating

### 7. Science Explorer
- 4 science categories with quiz-based learning
- Educational explanations after each answer
- Progressive difficulty with star ratings

### 8. History Heroes
- 4 historical eras with quiz gameplay
- Timeline-themed UI aesthetic
- Combo/streak system with multipliers

### 9. Animal Kingdom
- 4 animal categories: mammals, birds, ocean life, reptiles & amphibians
- Jungle-themed background aesthetic
- Fun fact generation and learning reinforcement

### 10. Puzzle World
- 4 puzzle modes: Sliding, Pattern Match, Sequence, Jigsaw Lite
- Click-based interactions (touch-friendly, no drag-and-drop)
- Holographic arcade aesthetic with CRT scanlines
- Hint system with score penalty

### 11. Typing Master
- Multiple game modes including word rain
- WPM and accuracy tracking
- Keyboard visualizer component

### 12. Word Builder
- Vocabulary and spelling game
- Letter tile placement mechanics
- Hint system for assistance

## Adding New Games

1. Create folder: `src/games/[game-name]/`
2. Follow the module pattern above
3. Add lazy import to `GamePlayPage.tsx`:
   ```tsx
   const GameName = lazy(() => import('../games/game-name').then(m => ({ default: m.GameName })));
   ```
4. Add entry to the `gameComponents` lookup map in GamePlayPage.tsx
5. Add game info to `gameInfo` object in GamePlayPage.tsx
6. Add to `GamesPage.tsx` games array
7. Remove from "Coming Soon" section if listed there
8. Run `npx tsc -b` to verify build

## State Management

- Use Zustand for game state
- Persist progress with `persist` middleware
- Store pattern:
  ```ts
  export const useGameStore = create<GameState>()((set, get) => ({
    // State
    // Actions
  }));

  export const useProgressStore = create<Progress>()(
    persist(
      (set, get) => ({ /* ... */ }),
      { name: 'game-progress' }
    )
  );
  ```

## Animation Guidelines

- Use Framer Motion for all animations
- Common patterns:
  - `initial`, `animate`, `exit` for mount/unmount
  - `whileHover`, `whileTap` for interactions
  - `AnimatePresence` for exit animations
- Prefer CSS for simple hover effects

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Games Yet to Implement

- Mouse Expert
- Rhythm & Reflex

## Security

- CSP meta tag configured in `index.html`
- Source maps disabled in production (`vite.config.ts`)
- `console.log` and `debugger` stripped from production builds
- `.env*` files excluded via `.gitignore`
- Input validation on signup form fields
- Client-side auth via `useAuthStore` (Zustand + persist); credentials hashed and stored in localStorage
- Game progress stored in localStorage is client-side only and tamperable via devtools
- See `bugs_to_fix.json` for the full security audit with 12 findings

## Accessibility

- Skip-to-content link on LandingPage
- Keyboard navigation on clickable Cards and GameCards (Enter/Space)
- ARIA attributes across Navbar, Dashboard, GamesPage, ShopPage, LeaderboardPage
- `role="dialog"` + `aria-modal` on modals with Escape key handling
- `role="math"` with spoken equation labels on math displays
- `role="status"` + `aria-live="assertive"` on countdown overlays
- Progress bars with `role="progressbar"` and proper ARIA attributes

## Learnings & Best Practices

### [2026-01-13] TypeScript - Unused Variables Break Production Build
**Context:** Build failed after adding Space Exploration, Geography Explorer, Science Explorer, History Heroes, and Animal Kingdom games
**Problem:** TypeScript strict mode treats unused imports/variables as errors (TS6133, TS6196). Local dev server doesn't catch these but `tsc -b` and production builds fail.
**Solution:**
- Always run `npx tsc -b` before committing new code
- Only destructure variables you actually use: `const { used } = store` not `const { used, unused } = store`
- Prefix required-but-unused parameters with underscore: `(_planetId) => {}`
- Remove unused type imports: `import type { Used } from './types'` not `import type { Used, Unused }`
**Files affected:** SpaceExploration.tsx, spaceStore.ts, LevelSelector.tsx, PlanetCard.tsx, SolarSystem.tsx, SpaceQuiz.tsx, geoStore.ts, ModeSelector.tsx, levels.ts, GeographyExplorer.tsx, ScienceExplorer.tsx, scienceStore.ts, questions.ts, animal-kingdom/data/levels.ts
**Tags:** #typescript #build #cloudflare
**Frequency:** 4

### [2026-01-13] Game Module - Update GamesPage When Adding New Games
**Context:** Added Space Exploration, Geography Explorer, Science Explorer, History Heroes, Animal Kingdom, Puzzle World games
**Problem:** Need to update multiple files when adding a new game, easy to miss one
**Solution:** Checklist for adding new games:
1. Create game folder with all components
2. Add to `GamePlayPage.tsx` - import and routing
3. Add to `GamesPage.tsx` - games array
4. Remove from "Coming Soon" section if it was listed there
5. Run `npx tsc -b` to verify build
**Tags:** #games #checklist
**Frequency:** 6

### [2026-01-13] Game Pattern - Quiz Game with Categories/Modes
**Context:** Implemented Geography Explorer (4 game modes), Science Explorer (4 science categories), History Heroes (4 historical eras), and Animal Kingdom (4 animal categories: mammals, birds, ocean-life, reptiles-amphibians)
**Problem:** Need flexible quiz structure supporting different question types, difficulties, and progression
**Solution:** Quiz game architecture pattern:
- Use state machine: menu → category-select → level-select → countdown → playing → paused → results
- Separate stores: useGameStore (ephemeral game state) + useProgressStore (persisted with zustand persist)
- Question generator function that creates questions dynamically based on level config
- Combo/streak system with multipliers for engagement
- Star rating based on accuracy thresholds (60%, 80%, 95%)
- Level unlock requirements based on previous level scores
- Show educational explanations after each answer for learning reinforcement
**Files:** GeographyExplorer.tsx, geoStore.ts, ScienceExplorer.tsx, scienceStore.ts, HistoryHeroes.tsx, historyStore.ts, AnimalKingdom.tsx, animalStore.ts, levels.ts
**Tags:** #games #quiz #pattern #zustand
**Frequency:** 4

### [2026-01-13] Game Pattern - Puzzle Game with Multiple Modes
**Context:** Implemented Puzzle World with 4 puzzle modes: Sliding (number tile puzzles), Pattern Match (memory cards), Sequence (pattern completion), Jigsaw Lite (click-to-place pieces)
**Problem:** Need interactive puzzle mechanics that work well for kids without complex drag-and-drop
**Solution:** Puzzle game architecture pattern:
- State machine: menu → mode-select → level-select → countdown → playing → paused → results
- Click-based interactions instead of drag-and-drop (more reliable, touch-friendly)
- For sliding puzzles: check solvability before presenting (count inversions)
- For pattern matching: Fisher-Yates shuffle with matched pair tracking
- For sequences: multiple choice answers with visual feedback
- For jigsaw: click-to-select piece, click-to-place on grid (avoids drag-and-drop complexity)
- Performance scoring based on moves/time, not just completion
- Hint system with score penalty for sliding puzzles
- Holographic arcade aesthetic: CRT scanlines, rainbow shimmer overlays, corner accents, animated grids
**Files:** puzzle-world/PuzzleWorld.tsx, puzzleStore.ts, SlidingPuzzle.tsx, PatternMatch.tsx, SequencePuzzle.tsx, JigsawLite.tsx
**Tags:** #games #puzzle #pattern #zustand #aesthetic
**Frequency:** 1

### [2026-02-14] Tailwind v4 - Dynamic Class Names Don't Work with JIT
**Context:** Dashboard achievements and GamePlayPage background glows used template literals like `bg-neon-${color}/10`
**Problem:** Tailwind JIT compiler only detects statically-written class names. Dynamic template literal classes (e.g., `from-neon-${color}/20`, `bg-neon-${game.color}/10`) are never generated and silently fail.
**Solution:** Use pre-computed static class lookup maps instead of string interpolation:
```tsx
// BAD: `bg-neon-${color}/10` - JIT won't generate this
// GOOD:
const bgGlowClasses: Record<string, string> = {
  cyan: 'bg-neon-cyan/10',
  pink: 'bg-neon-pink/10',
};
```
**Files affected:** Dashboard.tsx, GamePlayPage.tsx
**Tags:** #tailwind #jit #styling
**Frequency:** 2

### [2026-02-14] Game Logic - Protect State During Execution Lifecycle
**Context:** Code Quest startExecution() and stopExecution() called initializeLevel() which reset programBlocks to []
**Problem:** Calling a full reset function (like initializeLevel) during execution lifecycle events can destroy ephemeral user state (program blocks, user input, etc.) that needs to survive across state transitions.
**Solution:** When transitioning game states, save user-created data before resets and restore after, or use targeted state updates instead of full resets.
**Files affected:** codeQuestStore.ts
**Tags:** #games #state-machine #zustand
**Frequency:** 1

### [2026-02-14] Game Logic - Prevent Infinite Resource Accumulation on Replays
**Context:** Space Exploration added starsEarned to totalStars unconditionally on every play
**Problem:** Replay loops allow infinite accumulation of resources (stars, coins, XP) when progress updates don't check for previous best scores.
**Solution:** Only award the delta: `Math.max(0, newStars - existingBestStars)`. Track per-level bests and compare.
**Files affected:** spaceStore.ts
**Tags:** #games #scoring #exploit
**Frequency:** 1

### [2026-02-14] Performance - Lazy Load Game Modules
**Context:** All 12 game modules were eagerly imported in GamePlayPage.tsx
**Problem:** Monolithic bundle loaded all game code upfront even when user only plays one game.
**Solution:** Use `React.lazy()` with `Suspense` for each game import. Each game becomes its own ~65-97 KB chunk loaded on demand. Add a loading fallback component.
**Files affected:** GamePlayPage.tsx
**Tags:** #performance #code-splitting #react
**Frequency:** 1

## Gotchas
- **Zustand persist versioning**: All persist stores need `version: 1` in config for future migrations (freq:2)
- **Object lookup vs prototype**: `gameInfo[id]` hits `toString`/`constructor` via prototype; use `hasOwnProperty.call()` (freq:1)
- **Security tests vitest**: Tests run via `npx vitest run src/__tests__/security.test.ts`; 20 adversarial tests (freq:1)
- **Store timer leak**: Move `setInterval` to component `useEffect` with cleanup; don't store interval ID in Zustand (freq:1)
- **Timer drift**: Use wall-clock `timerDeadline` not decrement; `tickTimer` computes `Math.ceil((deadline-Date.now())/1000)` (freq:6)
- **Division by zero guards**: Always guard ratios like `facts/planets*4` with `length > 0` ternary (freq:1)
- **Overlay a11y**: CountdownOverlay needs `role="status" aria-live="assertive"`, PauseOverlay needs `role="dialog" aria-modal="true"` (freq:1)
- **Tailwind JIT dynamic classes**: Use static lookup maps not template literals `map[color] || 'text-white'` (freq:4)
- **Games data duplication**: Dashboard/GamesPage/LandingPage had separate game arrays; centralized to `src/data/games.ts` (freq:1)
- **Button rounded-inherit**: Not a valid Tailwind class; use `rounded-[inherit]` with brackets (freq:1)
- **animate-shimmer undefined**: GameCard/Button reference `animate-shimmer` but keyframes weren't defined in index.css (freq:1)
- **Test files in tsconfig**: `src/__tests__/` must be excluded from `tsconfig.app.json` to avoid vitest type errors in build (freq:1)
- **Mobile nav stays open**: MobileNavLink needs `onClick` to call `setMobileMenuOpen(false)` on navigation (freq:1)
- **useEffect timer stale closure**: Read store via `useTypingGameStore.getState()` inside interval, not closure var (freq:1)
- **rAF stale state + perf**: Use ref for latest state in rAF loops; batch position updates in single `set()` (freq:2)
- **Case-sensitive typing**: Levels 6+ (sentences/paragraphs) need strict `key === expected`; beginner levels stay case-insensitive (freq:1)
- **Auth mockUserProfile removal**: Replace per-page `mockUserProfile` with `useAuthStore` user data + fallback defaults (freq:1)
- **Linter races on multi-file edits**: Linter may strip new import before usage is added; re-read file and re-add import (freq:1)
- **Zustand actions in useEffect**: Wrap store actions in `useRef` to avoid re-trigger deps; reduces dep array (freq:1)
- **Lazy JSX map perf**: Use `Record<string, LazyExoticComponent>` lookup not `Record<string, ReactNode>` JSX map (freq:1)
- **Loop expansion DOS**: Guard recursive `expandProgram` with `MAX_EXPANDED_COMMANDS=500`; catch and show error (freq:1)
- **Math.random in animate**: Pre-compute random values via `useMemo`; random in render causes infinite re-animation (freq:1)
