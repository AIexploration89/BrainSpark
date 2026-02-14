# BrainSpark

An educational gaming platform for kids featuring interactive learning games with a cyberpunk/neon aesthetic.

## Features

- **12 Interactive Games** spanning math, science, coding, geography, history, and more
- **Cyberpunk Visual Theme** with neon colors, glowing effects, and unique per-game aesthetics
- **Progress Tracking** with star ratings, high scores, and level unlocking
- **Accessible Design** with ARIA labels, keyboard navigation, screen reader support, and skip-to-content links
- **Code-Split Loading** - games are lazy-loaded for fast initial page loads
- **Content Security Policy** configured for defense-in-depth

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

### Space Exploration
Journey through the solar system learning about planets, moons, and cosmic phenomena.
- 8 planets + dwarf planets with detailed facts
- Orbit visualization and interactive planet exploration
- Space quiz with progressive difficulty

### Geography Explorer
Travel the world and test your knowledge of countries, capitals, flags, and landmarks.
- 4 game modes: Flag Quiz, Capital Match, Landmark Hunter, Continent Challenge
- 24 levels across 7 continents
- ~60 countries and ~40 famous landmarks with fun facts

### Science Explorer
Dive into scientific disciplines with quiz-based learning.
- 4 science categories with progressive difficulty
- Educational explanations after each answer
- Star rating and combo system

### History Heroes
Travel through time and learn about major historical events and figures.
- 4 historical eras with quiz gameplay
- Timeline-themed UI aesthetic
- Combo/streak multipliers

### Animal Kingdom
Explore the animal world across different habitats and species.
- 4 categories: mammals, birds, ocean life, reptiles & amphibians
- Jungle-themed background aesthetic
- Fun facts and learning reinforcement

### Puzzle World
Solve puzzles across 4 different modes with a holographic arcade aesthetic.
- **Sliding Puzzle** - Number tile rearrangement with solvability checks
- **Pattern Match** - Memory card matching with Fisher-Yates shuffle
- **Sequence** - Pattern completion with multiple choice
- **Jigsaw Lite** - Click-to-place piece puzzles

### Typing Master
Practice keyboard skills with multiple engaging game modes.
- Word rain and timed typing challenges
- WPM and accuracy tracking
- On-screen keyboard visualizer

### Word Builder
Build vocabulary and spelling skills with letter tile mechanics.
- Letter tile placement gameplay
- Hint system for assistance
- Progressive difficulty levels

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **TailwindCSS v4** - Styling
- **Framer Motion 12** - Animations
- **Zustand 5** - State management with localStorage persistence
- **React Router DOM 7** - Navigation

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
├── components/           # Reusable UI components (Button, Card, GameCard, Navbar)
├── games/               # Game modules (lazy-loaded)
│   ├── animal-kingdom/  # Animal quiz game
│   ├── code-quest/      # Visual programming game
│   ├── geography-explorer/ # Geography quiz
│   ├── history-heroes/  # History quiz
│   ├── math-basics/     # Math operations game
│   ├── memory-matrix/   # Memory pattern game
│   ├── physics-lab/     # Physics experiments
│   ├── puzzle-world/    # Puzzle games (4 modes)
│   ├── science-explorer/# Science quiz
│   ├── space-exploration/# Solar system exploration
│   ├── typing-master/   # Typing practice
│   └── word-builder/    # Vocabulary game
├── pages/               # Route pages
└── App.tsx              # Root component
```

## Roadmap

- [ ] Mouse Expert - Mouse control training
- [ ] Rhythm & Reflex - Timing and coordination
- [ ] User accounts and backend authentication
- [ ] Cloud progress sync
- [ ] Server-validated leaderboards
- [ ] Achievement system
- [ ] Parent dashboard

## License

MIT
