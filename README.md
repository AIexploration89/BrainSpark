# BrainSpark

An educational gaming platform for kids featuring interactive learning games with a cyberpunk/neon aesthetic.

## Features

- **4 Fully Implemented Games** with progressive difficulty levels
- **Cyberpunk Visual Theme** with neon colors and glowing effects
- **Progress Tracking** with star ratings and high scores
- **Responsive Design** works on desktop and tablet
- **Keyboard Support** for accessibility

## Games

### Memory Matrix
Challenge your memory with pattern recognition puzzles. Memorize highlighted cells and recreate the pattern.
- 15 levels with increasing grid sizes (3x3 to 6x6)
- Timed memorization phases
- Star rating based on accuracy

### Code Quest
Learn programming logic through visual block coding. Guide your character through mazes using commands.
- 30 levels teaching loops, conditionals, and functions
- Drag-and-drop command blocks
- Step-by-step code execution visualization

### Physics Lab
Explore physics concepts through 5 interactive experiments:
- **Gravity Drop** - Compare fall rates of different masses
- **Bounce Lab** - Experiment with elasticity and materials
- **Pendulum Wave** - Observe harmonic motion patterns
- **Ramp & Roll** - Study friction and acceleration
- **Force Push** - Apply forces and see Newton's laws in action

### Math Basics
Master arithmetic with an arcade-style math game featuring LED-style displays.
- 5 operations: Addition, Subtraction, Multiplication, Division, Mixed
- 24 levels from easy to expert
- Combo system with score multipliers up to 3x
- Numpad and multiple choice input modes

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **TailwindCSS v4** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AIexploration89/BrainSpark.git
cd BrainSpark

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── games/            # Game modules
│   ├── code-quest/   # Visual programming game
│   ├── math-basics/  # Math operations game
│   ├── memory-matrix/# Memory pattern game
│   ├── physics-lab/  # Physics experiments
│   └── typing-master/# Typing practice (WIP)
├── pages/            # Route pages
└── App.tsx           # Root component
```

## Roadmap

- [ ] Typing Master - Keyboard typing practice
- [ ] Mouse Expert - Mouse control training
- [ ] Word Builder - Vocabulary and spelling
- [ ] Rhythm & Reflex - Timing and coordination
- [ ] User accounts and cloud progress sync
- [ ] Leaderboards
- [ ] Achievement system
- [ ] Parent dashboard

## License

MIT
