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
├── components/
│   ├── layout/          # Navbar, layout components
│   └── ui/              # Reusable UI components (Button, Card, GameCard)
├── games/               # Individual game modules
│   ├── code-quest/      # Visual block programming (30 levels)
│   ├── math-basics/     # Math operations game (24 levels)
│   ├── memory-matrix/   # Pattern memory game (15 levels)
│   ├── physics-lab/     # Physics experiments (5 interactive labs)
│   └── typing-master/   # Typing practice (in progress)
├── pages/               # Route pages
│   ├── Dashboard.tsx
│   ├── GamePlayPage.tsx # Game router
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

## Adding New Games

1. Create folder: `src/games/[game-name]/`
2. Follow the module pattern above
3. Add to `GamePlayPage.tsx`:
   ```tsx
   import { GameName } from '../games/game-name';

   if (gameId === 'game-name') {
     return <GameName />;
   }
   ```
4. Add game info to `gameInfo` object in GamePlayPage.tsx

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

## Learnings & Best Practices

### [2026-01-13] TypeScript - Unused Variables Break Production Build
**Context:** Cloudflare Pages build failed after adding Space Exploration game
**Problem:** TypeScript strict mode treats unused imports/variables as errors (TS6133, TS6196). Local dev server doesn't catch these but `tsc -b` and production builds fail.
**Solution:**
- Always run `npx tsc -b` before committing new code
- Only destructure variables you actually use: `const { used } = store` not `const { used, unused } = store`
- Prefix required-but-unused parameters with underscore: `(_planetId) => {}`
- Remove unused type imports: `import type { Used } from './types'` not `import type { Used, Unused }`
**Files affected:** SpaceExploration.tsx, spaceStore.ts, LevelSelector.tsx, PlanetCard.tsx, SolarSystem.tsx, SpaceQuiz.tsx
**Tags:** #typescript #build #cloudflare
**Frequency:** 1

### [2026-01-13] Game Module - Update GamesPage When Adding New Games
**Context:** Added Space Exploration game
**Problem:** Need to update multiple files when adding a new game, easy to miss one
**Solution:** Checklist for adding new games:
1. Create game folder with all components
2. Add to `GamePlayPage.tsx` - import and routing
3. Add to `GamesPage.tsx` - games array
4. Remove from "Coming Soon" section if it was listed there
5. Run `npx tsc -b` to verify build
**Tags:** #games #checklist
**Frequency:** 1
